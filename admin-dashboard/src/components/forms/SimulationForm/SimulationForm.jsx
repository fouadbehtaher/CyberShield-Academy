import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

const difficultyOptions = ['بسيط', 'متوسط', 'متقدم', 'محترف'];
const statusOptions = ['قيد التنفيذ', 'تحت الإعداد', 'جاهز للتشغيل', 'اُختتم حديثًا'];

const defaultValues = {
  id: undefined,
  name: '',
  difficulty: difficultyOptions[2],
  status: statusOptions[0],
  participants: 0,
  description: '',
  objective: '',
};

const SimulationForm = ({ initialValues, onSubmit, onCancel }) => {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });

  useEffect(() => {
    setValues({ ...defaultValues, ...initialValues });
  }, [initialValues]);

  const formTitle = useMemo(() => (values.id ? 'تحديث بيانات المحاكاة' : 'إنشاء محاكاة جديدة'), [values.id]);

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
            label="عنوان المحاكاة"
            value={values.name}
            onChange={(event) => handleChange('name', event.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="simulation-difficulty-label">درجة الصعوبة</InputLabel>
            <Select
              labelId="simulation-difficulty-label"
              label="درجة الصعوبة"
              value={values.difficulty}
              onChange={(event) => handleChange('difficulty', event.target.value)}
            >
              {difficultyOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="simulation-status-label">حالة التنفيذ</InputLabel>
            <Select
              labelId="simulation-status-label"
              label="حالة التنفيذ"
              value={values.status}
              onChange={(event) => handleChange('status', event.target.value)}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="عدد المشاركين"
            type="number"
            value={values.participants}
            onChange={(event) => handleChange('participants', Number(event.target.value))}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="هدف السيناريو"
            value={values.objective}
            onChange={(event) => handleChange('objective', event.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="التفاصيل الفنيّة"
            value={values.description}
            onChange={(event) => handleChange('description', event.target.value)}
            multiline
            minRows={3}
            fullWidth
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

SimulationForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    difficulty: PropTypes.string,
    status: PropTypes.string,
    participants: PropTypes.number,
    description: PropTypes.string,
    objective: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

SimulationForm.defaultProps = {
  initialValues: defaultValues,
  onSubmit: undefined,
  onCancel: undefined,
};

export default SimulationForm;
