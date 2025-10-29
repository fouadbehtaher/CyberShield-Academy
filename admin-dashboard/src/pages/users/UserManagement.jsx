import React, { useMemo, useState } from 'react';
import {
  Avatar,
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
import { AddOutlined, DeleteOutline, EditOutlined, GroupWorkOutlined, PersonSearchOutlined } from '@mui/icons-material';
import { DataTable, Modal, Notification, Pagination, SearchBar, UserForm } from '../../components';
import AnimatedCard from '../../components/advanced/AnimatedCard.jsx';

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2, 11)}`;
};

const initialUsers = [
  { id: 'user-1', name: 'أحمد المنصوري', role: 'مدرب', active: true, skillFocus: 'التحليل الجنائي', email: 'ahmad@cybershield.academy' },
  { id: 'user-2', name: 'ليان السبيعي', role: 'متعلم', active: true, skillFocus: 'الهندسة الاجتماعية', email: 'lian@cybershield.academy' },
  { id: 'user-3', name: 'سلمان العتيبي', role: 'متعلم', active: false, skillFocus: 'حماية الشبكات', email: 'salman@cybershield.academy' },
  { id: 'user-4', name: 'نورة المطيري', role: 'مشرفة', active: true, skillFocus: 'الذكاء الاصطناعي الأمني', email: 'noura@cybershield.academy' },
];

const cohorts = [
  { name: 'دفعة المحللين 2025', progress: 78, learners: 32 },
  { name: 'مسرع الدفاع السحابي', progress: 64, learners: 18 },
  { name: 'برنامج الاستجابة للحوادث', progress: 91, learners: 27 },
];

const userStats = [
  { id: 'leaders', title: 'المشرفون', value: 18, delta: '+2 هذا الأسبوع' },
  { id: 'mentors', title: 'المدربون', value: 46, delta: '+5 حملات نشطة' },
  { id: 'learners', title: 'المتعلمون', value: '1,236', delta: '+87 تفعيل جديد' },
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) =>
      !query || [user.name, user.email, user.skillFocus, user.role].some((field) => field.toLowerCase().includes(query)),
    );
  }, [users, search]);

  const pagedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page]);

  const totalPages = Math.max(Math.ceil(filteredUsers.length / rowsPerPage), 1);

  const columns = [
    {
      field: 'name',
      label: 'الاسم الكامل',
      render: (row) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main' }}>{row.name.charAt(0)}</Avatar>
          <Box>
            <Typography fontWeight={600}>{row.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'role',
      label: 'الدور',
      type: 'chip',
      color: 'primary',
      variant: 'outlined',
    },
    {
      field: 'skillFocus',
      label: 'تركيز المهارة',
    },
    {
      field: 'active',
      label: 'الحالة',
      render: (row) => (
        <Chip
          label={row.active ? 'نشط' : 'مجمّد'}
          size="small"
          color={row.active ? 'success' : 'default'}
          variant={row.active ? 'filled' : 'outlined'}
        />
      ),
      align: 'center',
    },
  ];

  const actions = [
    {
      id: 'edit',
      label: 'تعديل المستخدم',
      icon: <EditOutlined fontSize="small" />,
      onClick: (row) => {
        setEditingUser({
          id: row.id,
          fullName: row.name,
          email: row.email,
          role: row.role,
          active: row.active,
          skillFocus: row.skillFocus,
        });
        setModalOpen(true);
      },
    },
    {
      id: 'delete',
      label: 'حذف المستخدم',
      icon: <DeleteOutline fontSize="small" />,
      color: 'error',
      onClick: (row) => {
        setUsers((current) => current.filter((item) => item.id !== row.id));
        setNotification({ open: true, message: `تم حذف حساب ${row.name}.`, severity: 'info' });
      },
    },
  ];

  const handleAddUser = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = (payload) => {
    setUsers((current) => {
      const exists = current.find((user) => user.id === payload.id);
      if (exists) {
        return current.map((user) =>
          user.id === payload.id
            ? {
                ...user,
                name: payload.fullName,
                email: payload.email,
                role: payload.role,
                active: payload.active,
                skillFocus: payload.skillFocus,
              }
            : user,
        );
      }
      return [
        ...current,
        {
          id: `user-${generateId()}`,
          name: payload.fullName,
          email: payload.email,
          role: payload.role,
          active: payload.active,
          skillFocus: payload.skillFocus,
        },
      ];
    });

    setNotification({ open: true, message: 'تم حفظ بيانات المستخدم بنجاح.', severity: 'success' });
    handleCloseModal();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <AnimatedCard animation="rise">
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={1.5}>
                <Typography variant="h4">إدارة المستخدمين</Typography>
                <Typography variant="body1" color="text.secondary">
                  تحكم كامل في أدوار الأكاديمية، تراخيص الوصول، وتوزيع المهام عبر الدُفعات مع مزامنة فورية مع أنظمة الأمن.
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip color="primary" label="مزامنة Azure AD" />
                  <Chip color="secondary" variant="outlined" label="تنبيهات امتثال نشطة" />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={2}>
                {userStats.map((stat, index) => (
                  <Grid item xs={12} sm={4} md={12} key={stat.id}>
                    <AnimatedCard variant="outlined" animation="zoom" delay={0.05 + index * 0.05}>
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
            </Grid>
          </Grid>
        </CardContent>
      </AnimatedCard>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <AnimatedCard>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
                <SearchBar
                  value={search}
                  placeholder="ابحث عن مستخدم أو مهارة..."
                  onChange={setSearch}
                  onSearch={setSearch}
                  actions={[
                    {
                      id: 'advanced-filter',
                      label: 'تصفية متقدمة',
                      icon: <PersonSearchOutlined fontSize="small" />,
                      color: 'primary',
                      onClick: () => console.info('Open advanced filter dialog'),
                    },
                  ]}
                />
                <Button variant="contained" startIcon={<AddOutlined />} onClick={handleAddUser}>
                  إضافة مستخدم
                </Button>
              </Stack>

              <DataTable columns={columns} rows={pagedUsers} rowKey="id" actions={actions} emptyMessage="لا يوجد مستخدمون مطابقون للمعايير المحددة." dense />

              <Pagination
                count={totalPages}
                page={page}
                onChange={setPage}
                label={`إجمالي المستخدمين: ${filteredUsers.length}`}
              />
            </CardContent>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <AnimatedCard delay={0.08}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                الدفعات النشطة
              </Typography>
              {cohorts.map((cohort, index) => (
                <AnimatedCard
                  key={cohort.name}
                  variant="outlined"
                  animation="zoom"
                  delay={0.1 + index * 0.05}
                  sx={{ p: 2, backgroundColor: alpha('#1f2937', 0.6) }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography fontWeight={600}>{cohort.name}</Typography>
                      <Chip size="small" icon={<GroupWorkOutlined fontSize="inherit" />} label={`${cohort.learners} عضو`} color="secondary" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      نسبة الإنجاز الحالية: {cohort.progress}%
                    </Typography>
                    <LinearProgress variant="determinate" value={cohort.progress} sx={{ height: 8, borderRadius: 999 }} />
                  </Stack>
                </AnimatedCard>
              ))}
            </CardContent>
          </AnimatedCard>
        </Grid>
      </Grid>

      <Modal open={modalOpen} onClose={handleCloseModal} title={editingUser ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}>
        <UserForm initialValues={editingUser ?? undefined} onSubmit={handleSaveUser} onCancel={handleCloseModal} />
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

export default UserManagement;
