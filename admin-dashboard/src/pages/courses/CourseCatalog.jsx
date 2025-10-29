import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AddOutlined, AutoStories, FilterListOutlined, Groups2Outlined, ShieldOutlined } from '@mui/icons-material';
import { CourseForm, Modal, Notification, SearchBar } from '../../components';
import AnimatedCard from '../../components/advanced/AnimatedCard.jsx';

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2, 11)}`;
};

const initialCourses = [
  {
    id: 'course-1',
    title: 'استراتيجيات الدفاع المتقدم',
    level: 'محترف',
    duration: '12 ساعة تدريبية',
    objectives: ['تقوية أنظمة كشف التسلل', 'إدارة استجابة للحوادث متعددة الفرق'],
    description: 'برنامج مكثف يركز على بناء دفاعات متكاملة ضد التهديدات المتقدمة.',
    progress: 84,
    cohort: 'قادة SOC 2025',
    learners: 64,
  },
  {
    id: 'course-2',
    title: 'الهندسة الاجتماعية المضادة',
    level: 'متوسط',
    duration: '8 ساعات تدريبية',
    objectives: ['تصميم حملات توعوية', 'تحليل أنماط الاحتيال البشري'],
    description: 'يعلّم الفرق كيفية التصدي للهندسة الاجتماعية عبر سيناريوهات واقعية.',
    progress: 71,
    cohort: 'دفعة الدفاع المدني الرقمي',
    learners: 52,
  },
  {
    id: 'course-3',
    title: 'أمن الحوسبة السحابية',
    level: 'متقدم',
    duration: '10 ساعات تدريبية',
    objectives: ['إعداد سياسات الهوية والوصول', 'تطبيق أفضل ممارسات Zero Trust'],
    description: 'مسار عملي لتأمين بيئات Kubernetes وخدمات السحابة العامة.',
    progress: 63,
    cohort: 'المهندسون السحابيون',
    learners: 41,
  },
];

const levelFilters = ['الكل', 'مبتدئ', 'متوسط', 'متقدم', 'محترف'];

const courseStats = [
  { id: 'catalog-total', title: 'إجمالي المسارات', value: 24, delta: '+6 خلال الربع الحالي' },
  { id: 'active-learners', title: 'المتعلمون النشطون', value: '1,842', delta: '+128 هذا الأسبوع' },
  { id: 'adaptive-streams', title: 'المسارات التكيفية', value: 12, delta: '4 تحت الإطلاق' },
];

const CourseCatalog = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(levelFilters[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        [course.title, course.description, ...(course.objectives ?? [])]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(query));
      const matchesFilter = activeFilter === 'الكل' || course.level === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [courses, search, activeFilter]);

  const handleSaveCourse = (payload) => {
    setCourses((current) => {
      const exists = current.find((course) => course.id === payload.id);
      if (exists) {
        return current.map((course) => (course.id === payload.id ? { ...course, ...payload } : course));
      }
      return [
        ...current,
        {
          ...payload,
          id: `course-${generateId()}`,
          objectives: payload.objectives,
          description: payload.description,
          progress: 0,
          cohort: payload.cohort ?? 'دفعة جديدة',
          learners: 0,
        },
      ];
    });

    setNotification({ open: true, message: 'تم حفظ المسار التدريبي بنجاح.', severity: 'success' });
    setModalOpen(false);
    setEditingCourse(null);
  };

  const handleOpenModal = (course = null) => {
    setEditingCourse(course);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses((current) => current.filter((item) => item.id !== courseId));
    setNotification({ open: true, message: 'تم حذف المسار بنجاح.', severity: 'info' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <AnimatedCard animation="rise">
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
            <Stack spacing={1.5}>
              <Typography variant="h4">مسارات التدريب</Typography>
              <Typography variant="body1" color="text.secondary">
                صمّم خبرات التعلم التكيفية، اربطها بالمحاكاة، وتابع أثرها على جاهزية الفرق في الزمن الحقيقي.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip color="primary" variant="outlined" label="متزامن مع منصة المحاكاة" />
                <Chip color="secondary" label="ذكاء توصية مفعّل" />
              </Stack>
            </Stack>
            <Grid container spacing={2} sx={{ maxWidth: 420 }}>
              {courseStats.map((stat, index) => (
                <Grid item xs={12} sm={4} key={stat.id}>
                  <AnimatedCard variant="outlined" animation="zoom" delay={0.05 + index * 0.05} sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h5" sx={{ mt: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        {stat.delta}
                      </Typography>
                    </CardContent>
                  </AnimatedCard>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </CardContent>
      </AnimatedCard>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
        <SearchBar
          value={search}
          placeholder="ابحث عن مسار أو مهارة..."
          onChange={setSearch}
          onSearch={setSearch}
          actions={[
            {
              id: 'create-course',
              label: 'مسار جديد',
              icon: <AddOutlined />,
              color: 'primary',
              onClick: () => handleOpenModal(),
            },
          ]}
        />
        <Chip icon={<FilterListOutlined />} label={`المستوى: ${activeFilter}`} variant="outlined" />
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {levelFilters.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            color={filter === activeFilter ? 'primary' : 'default'}
            variant={filter === activeFilter ? 'filled' : 'outlined'}
            onClick={() => setActiveFilter(filter)}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Stack>

      <Grid container spacing={3}>
        {filteredCourses.map((course, index) => (
          <Grid item xs={12} md={4} key={course.id}>
            <AnimatedCard
              animation="fade"
              delay={0.08 + index * 0.05}
              sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundImage: 'linear-gradient(160deg, rgba(15, 23, 42, 0.92), rgba(79, 70, 229, 0.32))' }}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flexGrow: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ShieldOutlined color="primary" />
                    <Typography variant="h6">{course.title}</Typography>
                  </Stack>
                  <Chip size="small" label={course.level} color="primary" variant="outlined" />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {course.duration}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoStories fontSize="small" /> الأهداف الرئيسية
                  </Typography>
                  <Stack spacing={0.5}>
                    {course.objectives.map((objective) => (
                      <Typography variant="body2" key={objective}>
                        • {objective}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    {course.cohort}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Groups2Outlined fontSize="small" color="secondary" />
                    <Typography variant="caption" color="text.secondary">
                      {course.learners} متعلم نشط
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={course.progress}
                    sx={{ height: 8, borderRadius: 999, backgroundColor: alpha('#38bdf8', 0.12) }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    مستوى الإنجاز {course.progress}%
                  </Typography>
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 'auto' }}>
                  <Button size="small" variant="outlined" onClick={() => handleOpenModal(course)}>
                    تعديل
                  </Button>
                  <Button size="small" variant="text" color="error" onClick={() => handleDeleteCourse(course.id)}>
                    حذف
                  </Button>
                </Box>
              </CardContent>
            </AnimatedCard>
          </Grid>
        ))}
      </Grid>

      <Modal open={modalOpen} onClose={handleCloseModal} title={editingCourse ? 'تعديل مسار تدريبي' : 'إضافة مسار تدريبي'}>
        <CourseForm initialValues={editingCourse ?? undefined} onSubmit={handleSaveCourse} onCancel={handleCloseModal} />
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

export default CourseCatalog;
