import React, { useCallback, useMemo, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
  Divider,
} from '@mui/material';
import {
  Block,
  Delete,
  Edit,
  PlayArrow,
  Stop,
  Visibility,
} from '@mui/icons-material';
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import type { ControlPanelState, ControlUpdater } from './types';

interface UserRecord {
  id: string;
  username: string;
  email: string;
  role: string;
  level: number;
  status: 'نشط' | 'متوقف' | 'قيد المراجعة';
  lastActivity: string;
  performance: number;
  sessionDuration: string;
  currentModule: string;
}

interface UserManagementPanelProps {
  state: ControlPanelState;
  onStateChange: ControlUpdater;
}

const STATUS_COLORS: Record<UserRecord['status'], 'success' | 'default' | 'warning'> = {
  'نشط': 'success',
  'متوقف': 'default',
  'قيد المراجعة': 'warning',
};

export const UserManagementPanel: React.FC<UserManagementPanelProps> = ({
  state,
  onStateChange,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<GridRowSelectionModel>([]);
  const [userActions, setUserActions] = useState<Map<string, string>>(new Map());

  const users = useMemo<UserRecord[]>(
    () => [
      {
        id: '1',
        username: 'أحمد محمد',
        email: 'ahmed@example.com',
        role: 'طالب',
        level: 5,
        status: 'نشط',
        lastActivity: '2025-02-10 14:30',
        performance: 85,
        sessionDuration: '02:15:30',
        currentModule: 'أمن الشبكات',
      },
      {
        id: '2',
        username: 'سارة علي',
        email: 'sara@example.com',
        role: 'مدرب',
        level: 12,
        status: 'نشط',
        lastActivity: '2025-02-10 13:55',
        performance: 92,
        sessionDuration: '03:04:12',
        currentModule: 'تحليل البرمجيات الخبيثة',
      },
      {
        id: '3',
        username: 'خالد يوسف',
        email: 'khaled@example.com',
        role: 'طالب',
        level: 3,
        status: 'قيد المراجعة',
        lastActivity: '2025-02-09 20:12',
        performance: 61,
        sessionDuration: '01:05:18',
        currentModule: 'التحقيق في الحوادث',
      },
      {
        id: '4',
        username: 'ليلى حسن',
        email: 'laila@example.com',
        role: 'مسؤول النظام',
        level: 15,
        status: 'متوقف',
        lastActivity: '2025-02-07 09:44',
        performance: 74,
        sessionDuration: '00:44:20',
        currentModule: 'هندسة البرمجيات الآمنة',
      },
    ],
    [],
  );

  const handleMonitoringToggle = useCallback(
    (enabled: boolean) => {
      onStateChange(prev => ({
        ...prev,
        userManagement: {
          ...prev.userManagement,
          realTimeMonitoring: enabled,
        },
      }));
    },
    [onStateChange],
  );

  const handleBulkAction = useCallback(
    (action: string) => {
      if (!selectedUsers.length) {
        return;
      }

      setUserActions(prev => {
        const next = new Map(prev);
        selectedUsers.forEach(id => {
          next.set(String(id), action);
        });
        return next;
      });

      onStateChange(prev => ({
        ...prev,
        userManagement: {
          ...prev.userManagement,
          bulkActions: Array.from(
            new Set([...prev.userManagement.bulkActions, action]),
          ),
        },
      }));
    },
    [onStateChange, selectedUsers],
  );

  const handleSingleAction = useCallback(
    (userId: string, action: string) => {
      setUserActions(prev => {
        const next = new Map(prev);
        next.set(userId, action);
        return next;
      });
    },
    [],
  );

  const columns = useMemo<GridColDef<UserRecord>[]>(
    () => [
      {
        field: 'user',
        headerName: 'المستخدم',
        flex: 1.2,
        minWidth: 220,
        sortable: false,
        renderCell: params => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar>{params.row.username.charAt(0)}</Avatar>
            <Stack spacing={0.4}>
              <Typography fontWeight={600} variant="body2">
                {params.row.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {params.row.email}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        field: 'role',
        headerName: 'الدور',
        width: 120,
        renderCell: params => (
          <Chip label={params.value} size="small" color="primary" variant="outlined" />
        ),
      },
      {
        field: 'level',
        headerName: 'المستوى',
        width: 110,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'status',
        headerName: 'الحالة',
        width: 150,
        renderCell: params => (
          <Badge
            overlap="circular"
            variant="dot"
            color={STATUS_COLORS[params.value as UserRecord['status']]}
          >
            <Chip
              label={params.value}
              size="small"
              color={STATUS_COLORS[params.value as UserRecord['status']]}
              variant="outlined"
            />
          </Badge>
        ),
      },
      {
        field: 'performance',
        headerName: 'الأداء',
        minWidth: 160,
        renderCell: params => (
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              width: '100%',
              height: 28,
              borderRadius: 16,
              overflow: 'hidden',
              background: theme => theme.palette.grey[200],
            }}
          >
            <Paper
              elevation={0}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${params.value}%`,
                borderRadius: 'inherit',
                background: `linear-gradient(90deg, #4CAF50, #2e7d32)`,
                transition: 'width 0.4s ease',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                color: params.value > 55 ? '#fff' : '#111',
              }}
            >
              {params.value}%
            </Typography>
          </Paper>
        ),
      },
      {
        field: 'sessionDuration',
        headerName: 'مدة الجلسة',
        width: 150,
      },
      {
        field: 'currentModule',
        headerName: 'الوحدة الحالية',
        flex: 1,
        minWidth: 180,
      },
      {
        field: 'lastActivity',
        headerName: 'آخر نشاط',
        minWidth: 170,
      },
      {
        field: 'actions',
        headerName: 'الإجراءات',
        sortable: false,
        width: 220,
        renderCell: params => (
          <Stack direction="row" spacing={1}>
            <Tooltip title="عرض التفاصيل">
              <IconButton size="small" onClick={() => handleSingleAction(params.row.id, 'view')}>
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="تعديل">
              <IconButton size="small" onClick={() => handleSingleAction(params.row.id, 'edit')}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="إيقاف مؤقت">
              <IconButton size="small" onClick={() => handleSingleAction(params.row.id, 'pause')}>
                <Stop fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="حظر">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleSingleAction(params.row.id, 'block')}
              >
                <Block fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [handleSingleAction],
  );

  return (
    <Stack spacing={3} className="user-management-panel">
      <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            التحكم الجماعي ({selectedUsers.length} مستخدم محدد)
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<PlayArrow />}
              onClick={() => handleBulkAction('activate')}
              disabled={!selectedUsers.length}
            >
              تفعيل المحددين
            </Button>
            <Button
              variant="outlined"
              startIcon={<Stop />}
              onClick={() => handleBulkAction('pause')}
              disabled={!selectedUsers.length}
            >
              إيقاف مؤقت
            </Button>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => handleBulkAction('edit')}
              disabled={!selectedUsers.length}
            >
              تعديل جماعي
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => handleBulkAction('delete')}
              disabled={!selectedUsers.length}
            >
              حذف المحددين
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={1} sx={{ height: 600, borderRadius: 2, overflow: 'hidden' }}>
        <DataGrid
          rows={users}
          columns={columns}
          disableRowSelectionOnClick
          checkboxSelection
          onRowSelectionModelChange={setSelectedUsers}
          rowSelectionModel={selectedUsers}
          pageSizeOptions={[5, 10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: 'performance', sort: 'desc' }] },
          }}
          slots={{
            toolbar: () => (
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ px: 2, py: 1.5, borderBottom: theme => `1px solid ${theme.palette.divider}` }}
              >
                <Button variant="contained" color="primary">
                  إضافة مستخدم جديد
                </Button>
                <Button variant="outlined">تصدير البيانات</Button>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  آخر إجراء: {userActions.size ? Array.from(userActions.values()).pop() : 'لا يوجد'}
                </Typography>
                <Stack direction="row" alignItems="center" sx={{ marginLeft: 'auto' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={state.userManagement.realTimeMonitoring}
                        onChange={event => handleMonitoringToggle(event.target.checked)}
                      />
                    }
                    labelPlacement="start"
                    label="المراقبة الفورية"
                    sx={{ mr: 0 }}
                  />
                </Stack>
              </Stack>
            ),
          }}
        />
      </Paper>

      {state.userManagement.realTimeMonitoring && <RealTimeUserMonitor users={users} />}
    </Stack>
  );
};

const RealTimeUserMonitor: React.FC<{ users: UserRecord[] }> = ({ users }) => {
  const activeUsers = users.filter(user => user.status === 'نشط').length;
  const averagePerformance = users.reduce((acc, user) => acc + user.performance, 0) / users.length;
  const highPerformers = users.filter(user => user.performance >= 80).length;

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        لوحة المراقبة في الوقت الحقيقي
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} flexWrap="wrap">
        <MonitorMetric
          title="مستخدمون نشطون"
          value={activeUsers}
          helperText={`${((activeUsers / users.length) * 100).toFixed(0)}% من الإجمالي`}
        />
        <MonitorMetric
          title="متوسط الأداء"
          value={`${averagePerformance.toFixed(1)}%`}
          helperText="تحديث كل 60 ثانية"
        />
        <MonitorMetric
          title="أداء متميز"
          value={highPerformers}
          helperText="+2 خلال آخر ساعة"
        />
      </Stack>
    </Paper>
  );
};

const MonitorMetric: React.FC<{ title: string; value: React.ReactNode; helperText: string }> = ({
  title,
  value,
  helperText,
}) => (
  <Stack spacing={0.5} sx={{ minWidth: 200 }}>
    <Typography variant="body2" color="text.secondary">
      {title}
    </Typography>
    <Typography variant="h4" fontWeight={700} color="primary.main">
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {helperText}
    </Typography>
  </Stack>
);

export default UserManagementPanel;
