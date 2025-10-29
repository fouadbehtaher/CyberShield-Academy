import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid, MenuItem, Select, TextField, InputLabel, FormControl } from '@mui/material';

const levelOptions = ['مبتدئ', 'متوسط', 'متقدم', 'محترف'];

const defaultValues = {
  id: undefined,
  title: '',
  level: levelOptions[0],
  duration: '',
  objectives: '',
  description: '',
};

const CourseForm = ({ initialValues, onSubmit, onCancel }) => {
  const [values, setValues] = useState({
    ...defaultValues,
    ...initialValues,
    objectives: Array.isArray(initialValues?.objectives)
      ? initialValues.objectives.join('\n')
      : initialValues?.objectives ?? defaultValues.objectives,
  });

  useEffect(() => {
    setValues({
      ...defaultValues,
      ...initialValues,
      objectives: Array.isArray(initialValues?.objectives)
        ? initialValues.objectives.join('\n')
        : initialValues?.objectives ?? defaultValues.objectives,
    });
  }, [initialValues]);

  const handleChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({
      ...values,
      objectives: values.objectives
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    });
  };

  const formTitle = useMemo(() => (values.id ? 'تحديث المسار التدريبي' : 'إضافة مسار تدريبي'), [values.id]);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="عنوان المسار"
            value={values.title}
            onChange={(event) => handleChange('title', event.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="course-level-label">المستوى</InputLabel>
            <Select
              labelId="course-level-label"
              label="المستوى"
              value={values.level}
              onChange={(event) => handleChange('level', event.target.value)}
            >
              {levelOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="مدة البرنامج"
            placeholder="مثال: 12 ساعة تدريبية"
            value={values.duration}
            onChange={(event) => handleChange('duration', event.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="الأهداف التدريبية (سطراً لكل هدف)"
            value={values.objectives}
            onChange={(event) => handleChange('objectives', event.target.value)}
            multiline
            minRows={4}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="وصف مختصر"
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

CourseForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    level: PropTypes.string,
    duration: PropTypes.string,
    objectives: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    description: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

CourseForm.defaultProps = {
  initialValues: defaultValues,
  onSubmit: undefined,
  onCancel: undefined,
};

export default CourseForm;
