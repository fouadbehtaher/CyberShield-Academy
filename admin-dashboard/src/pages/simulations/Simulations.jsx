import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { PlayArrow, SyncOutlined, VisibilityOutlined } from '@mui/icons-material';
import { AIForm, Modal, Notification, SimulationForm } from '../../components';
import { fetchSimulations, saveSimulation, deleteSimulation, triggerSimulationStart } from '../../services/api/simulations';
import AnimatedCard from '../../components/advanced/AnimatedCard.jsx';

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2, 11)}`;
};

const difficultyFilters = ['الكل', 'بسيط', 'متوسط', 'متقدم', 'محترف'];
const statusFilters = ['الكل', 'قيد التنفيذ', 'تحت الإعداد', 'جاهز للتشغيل', 'اُختتم حديثًا'];

const Simulations = () => {
  const [simulations, setSimulations] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState(difficultyFilters[0]);
  const [statusFilter, setStatusFilter] = useState(statusFilters[0]);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [simulationModalOpen, setSimulationModalOpen] = useState(false);
  const [editingSimulation, setEditingSimulation] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const loadSimulations = async () => {
      setSyncing(true);
      const data = await fetchSimulations();
      setSimulations(data);
      setSyncing(false);
    };

    loadSimulations();
  }, []);

  const filteredSimulations = useMemo(() => {
    return simulations.filter((simulation) => {
      const matchesDifficulty = difficultyFilter === 'الكل' || simulation.difficulty === difficultyFilter;
      const matchesStatus = statusFilter === 'الكل' || simulation.status === statusFilter;
      return matchesDifficulty && matchesStatus;
    });
  }, [difficultyFilter, statusFilter, simulations]);

  const summary = useMemo(() => {
    if (!simulations.length) {
      return { total: 0, active: 0, completion: 0, advanced: 0 };
    }
    const total = simulations.length;
    const active = simulations.filter((sim) => sim.status === 'قيد التنفيذ' || sim.status === 'جاهز للتشغيل').length;
    const completion = Math.round(simulations.reduce((acc, sim) => acc + (sim.progress ?? 0), 0) / simulations.length);
    const advanced = simulations.filter((sim) => sim.difficulty === 'متقدم' || sim.difficulty === 'محترف').length;
    return { total, active, completion, advanced };
  }, [simulations]);

  const handleOpenSimulationModal = (simulation = null) => {
    setEditingSimulation(simulation);
    setSimulationModalOpen(true);
  };

  const handleCloseSimulationModal = () => {
    setEditingSimulation(null);
    setSimulationModalOpen(false);
  };

  const handleSaveSimulation = async (payload) => {
    const response = await saveSimulation(payload.id ? payload : { ...payload, id: `sim-${generateId()}` });
    setSimulations((current) => {
      const exists = current.find((simulation) => simulation.id === response.id);
      if (exists) {
        return current.map((simulation) => (simulation.id === response.id ? { ...simulation, ...response } : simulation));
      }
      return [...current, response];
    });

    setNotification({ open: true, message: 'تم حفظ بيانات المحاكاة.', severity: 'success' });
    handleCloseSimulationModal();
  };

  const handleDeleteSimulation = async (simulationId) => {
    await deleteSimulation(simulationId);
    setSimulations((current) => current.filter((simulation) => simulation.id !== simulationId));
    setNotification({ open: true, message: 'تم حذف المحاكاة من الجدول.', severity: 'info' });
  };

  const handleTriggerStart = async (simulation) => {
    await triggerSimulationStart({ simulationId: simulation.id, mode: 'ACCELERATED' });
    setNotification({ open: true, message: 'بدأت جلسة المحاكاة.', severity: 'success' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <AnimatedCard animation="rise">
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Stack spacing={1.5}>
              <Typography variant="h4">المحاكاة المتقدمة</Typography>
              <Typography variant="body1" color="text.secondary">
                راقب حالة المختبرات السيبرانية، شغّل السيناريوهات، ونسّق الفرق المتداخلة مع محرك الذكاء الاصطناعي.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip color="primary" label={`عدد السيناريوهات ${summary.total}`} />
                <Chip color="secondary" variant="outlined" label={`نشطة الآن ${summary.active}`} />
                <Chip color="success" label={`متوسط الإنجاز ${summary.completion}%`} />
              </Stack>
            </Stack>
            <Button
              variant="outlined"
              startIcon={<SyncOutlined />}
              onClick={async () => {
                setSyncing(true);
                const data = await fetchSimulations();
                setSimulations(data);
                setSyncing(false);
              }}
            >
              {syncing ? 'جارٍ التحديث...' : 'مزامنة فورية'}
            </Button>
          </Stack>
        </CardContent>
      </AnimatedCard>

      <AnimatedCard>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
              <Typography variant="subtitle2">تصفية حسب الصعوبة</Typography>
              <Select size="small" value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)}>
                {difficultyFilters.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
              <Typography variant="subtitle2">حالة التنفيذ</Typography>
              <Select size="small" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                {statusFilters.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ marginInlineStart: 'auto' }}>
              <Button variant="outlined" onClick={() => setConfigModalOpen(true)}>
                إعدادات الذكاء الاصطناعي
              </Button>
              <Button variant="contained" onClick={() => handleOpenSimulationModal()}>
                إنشاء محاكاة جديدة
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </AnimatedCard>

      <Grid container spacing={3}>
        {filteredSimulations.map((simulation) => (
          <Grid item xs={12} md={4} key={simulation.id}>
            <AnimatedCard
              animation="fade"
              delay={0.06}
              sx={{ height: '100%', backgroundImage: 'linear-gradient(165deg, rgba(15, 23, 42, 0.92), rgba(8, 145, 178, 0.26))' }}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{simulation.name}</Typography>
                  <Chip label={simulation.difficulty} color="primary" variant="outlined" />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  الهدف الأساسي: {simulation.objective}
                </Typography>

                <Divider sx={{ opacity: 0.2 }} />

                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    حالة التنفيذ: {simulation.status}
                  </Typography>
                  <LinearProgress variant="determinate" value={simulation.progress} />
                  <Typography variant="caption" color="text.secondary">
                    مستوى التقدم {simulation.progress}% — المشاركون {simulation.participants}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button size="small" variant="outlined" startIcon={<VisibilityOutlined />} onClick={() => handleOpenSimulationModal(simulation)}>
                    تفاصيل
                  </Button>
                  <Button size="small" variant="contained" startIcon={<PlayArrow />} onClick={() => handleTriggerStart(simulation)}>
                    تشغيل
                  </Button>
                  <Button size="small" variant="text" color="error" onClick={() => handleDeleteSimulation(simulation.id)}>
                    حذف
                  </Button>
                </Stack>
              </CardContent>
            </AnimatedCard>
          </Grid>
        ))}
      </Grid>

      <Modal open={simulationModalOpen} onClose={handleCloseSimulationModal} title={editingSimulation ? 'تعديل المحاكاة' : 'إنشاء محاكاة جديدة'}>
        <SimulationForm initialValues={editingSimulation ?? undefined} onSubmit={handleSaveSimulation} onCancel={handleCloseSimulationModal} />
      </Modal>

      <Modal open={configModalOpen} onClose={() => setConfigModalOpen(false)} title="تهيئة محرك الذكاء الاصطناعي">
        <AIForm
          onSubmit={(values) => {
            console.info('AI settings submitted', values);
            setNotification({ open: true, message: 'تم حفظ إعدادات الذكاء الاصطناعي.', severity: 'success' });
            setConfigModalOpen(false);
          }}
          onCancel={() => setConfigModalOpen(false)}
        />
      </Modal>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification((current) => ({ ...current, open: false }))}
      />
    </Box>
  );
};

export default Simulations;
