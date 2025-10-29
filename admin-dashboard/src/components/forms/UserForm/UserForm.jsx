import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';

const roleOptions = [
  { value: 'متعلم', label: 'متعلم' },
  { value: 'مدرب', label: 'مدرب' },
  { value: 'مشرف', label: 'مشرف' },
];

const skillOptions = ['الهندسة الاجتماعية', 'التحليل الجنائي', 'حماية الشبكات', 'التعلم الآلي الأمني'];

const defaultValues = {
  id: undefined,
  fullName: '',
  email: '',
  role: roleOptions[0].value,
  active: true,
  skillFocus: skillOptions[0],
  notes: '',
};

const UserForm = ({ initialValues, onSubmit, onCancel }) => {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });

  useEffect(() => {
    setValues({ ...defaultValues, ...initialValues });
  }, [initialValues]);

  const formTitle = useMemo(() => (values.id ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'), [values.id]);

  const handleChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="الاسم الكامل"
            value={values.fullName}
            onChange={(event) => handleChange('fullName', event.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="البريد الإلكتروني"
            value={values.email}
            onChange={(event) => handleChange('email', event.target.value)}
            type="email"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="user-role-label">الدور</InputLabel>
            <Select
              labelId="user-role-label"
              label="الدور"
              value={values.role}
              onChange={(event) => handleChange('role', event.target.value)}
            >
              {roleOptions.map((option) => (
                <MenuItem value={option.value} key={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="user-skill-label">تركيز المهارة</InputLabel>
            <Select
              labelId="user-skill-label"
              label="تركيز المهارة"
              value={values.skillFocus}
              onChange={(event) => handleChange('skillFocus', event.target.value)}
            >
              {skillOptions.map((skill) => (
                <MenuItem value={skill} key={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="ملاحظات إضافية"
            value={values.notes}
            onChange={(event) => handleChange('notes', event.target.value)}
            multiline
            minRows={3}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={values.active} onChange={(event) => handleChange('active', event.target.checked)} />}
            label="الحساب نشط"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 3 }}>
        <span style={{ fontWeight: 600 }}>{formTitle}</span>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onCancel} variant="text">إلغاء</Button>
          <Button type="submit" variant="contained">حفظ</Button>
        </Box>
      </Box>
    </Box>
  );
};

UserForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fullName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    active: PropTypes.bool,
    skillFocus: PropTypes.string,
    notes: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

UserForm.defaultProps = {
  initialValues: defaultValues,
  onSubmit: undefined,
  onCancel: undefined,
};

export default UserForm;
