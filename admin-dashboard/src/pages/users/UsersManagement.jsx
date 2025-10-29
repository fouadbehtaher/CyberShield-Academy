import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Block, Delete, Edit, MoreVert, Visibility } from '@mui/icons-material';

const roles = {
  student: 'طالب',
  instructor: 'مدرب',
  admin: 'مدير',
};

const statusChipColor = {
  active: 'success',
  pending: 'warning',
  suspended: 'default',
};

const UsersManagement = () => {
  const seedUsers = useMemo(
    () => [
      {
        id: 'u-1001',
        name: 'أحمد الخالدي',
        email: 'ahmad.khalidi@example.com',
        role: 'admin',
        status: 'active',
        lastActivity: 'قبل 3 دقائق',
        avatar: 'https://i.pravatar.cc/96?img=68',
      },
      {
        id: 'u-1002',
        name: 'ليلى مراد',
        email: 'laila.murad@example.com',
        role: 'instructor',
        status: 'active',
        lastActivity: 'قبل ساعة',
        avatar: 'https://i.pravatar.cc/96?img=47',
      },
      {
        id: 'u-1003',
        name: 'سلمان السبيعي',
        email: 'salman.sb@example.com',
        role: 'student',
        status: 'pending',
        lastActivity: 'قبل يوم',
        avatar: 'https://i.pravatar.cc/96?img=12',
      },
      {
        id: 'u-1004',
        name: 'شهد الفهد',
        email: 'shahad.fahd@example.com',
        role: 'student',
        status: 'suspended',
        lastActivity: 'قبل أسبوع',
        avatar: 'https://i.pravatar.cc/96?img=33',
      },
    ],
    [],
  );

  const [users, setUsers] = useState(seedUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleFieldChange = (field) => (event) => {
    setSelectedUser((current) =>
      current ? { ...current, [field]: event.target.value } : current,
    );
  };

  const handleSaveUser = () => {
    if (!selectedUser) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) => (user.id === selectedUser.id ? selectedUser : user)),
    );
    setEditDialogOpen(false);
  };

  const handleViewDetails = () => {
    console.info('عرض تفاصيل المستخدم', selectedUser);
    handleMenuClose();
  };

  const handleBlockUser = () => {
    if (!selectedUser) {
      return;
    }
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === selectedUser.id ? { ...user, status: 'suspended' } : user,
      ),
    );
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    if (!selectedUser) {
      return;
    }
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== selectedUser.id));
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
  };

  return (
    <div className="users-management">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <Typography variant="h4">إدارة المستخدمين</Typography>
        <Button variant="contained" color="primary" onClick={() => console.info('فتح نموذج إضافة مستخدم')}>
          إضافة مستخدم جديد
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>اسم المستخدم</TableCell>
              <TableCell>البريد الإلكتروني</TableCell>
              <TableCell>الدور</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>آخر نشاط</TableCell>
              <TableCell align="right">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Avatar src={user.avatar} alt={user.name} />
                    <div>
                      <Typography variant="subtitle1">{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.id}
                      </Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={roles[user.role] ?? user.role}
                    color={user.role === 'admin' ? 'secondary' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status === 'active' ? 'نشط' : user.status === 'pending' ? 'بانتظار التفعيل' : 'معلق'}
                    color={statusChipColor[user.status] ?? 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.lastActivity}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={(event) => handleMenuClick(event, user)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} transformOrigin={{ horizontal: 'right', vertical: 'top' }}>
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" style={{ marginLeft: 8 }} /> تعديل
        </MenuItem>
        <MenuItem onClick={handleViewDetails}>
          <Visibility fontSize="small" style={{ marginLeft: 8 }} /> عرض التفاصيل
        </MenuItem>
        <MenuItem onClick={handleBlockUser}>
          <Block fontSize="small" style={{ marginLeft: 8 }} /> حظر المستخدم
        </MenuItem>
        <MenuItem onClick={handleDeleteUser}>
          <Delete fontSize="small" style={{ marginLeft: 8 }} /> حذف
        </MenuItem>
      </Menu>

      <Dialog open={editDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>تعديل بيانات المستخدم</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="اسم المستخدم"
            value={selectedUser?.name ?? ''}
            margin="normal"
            onChange={handleFieldChange('name')}
          />
          <TextField
            fullWidth
            label="البريد الإلكتروني"
            value={selectedUser?.email ?? ''}
            margin="normal"
            onChange={handleFieldChange('email')}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="user-role-label">الدور</InputLabel>
            <Select
              labelId="user-role-label"
              value={selectedUser?.role ?? ''}
              label="الدور"
              onChange={handleFieldChange('role')}
            >
              <MenuItem value="student">طالب</MenuItem>
              <MenuItem value="instructor">مدرب</MenuItem>
              <MenuItem value="admin">مدير</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="user-status-label">الحالة</InputLabel>
            <Select
              labelId="user-status-label"
              value={selectedUser?.status ?? ''}
              label="الحالة"
              onChange={handleFieldChange('status')}
            >
              <MenuItem value="active">نشط</MenuItem>
              <MenuItem value="pending">بانتظار التفعيل</MenuItem>
              <MenuItem value="suspended">معلق</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>إلغاء</Button>
          <Button onClick={handleSaveUser} variant="contained">
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
