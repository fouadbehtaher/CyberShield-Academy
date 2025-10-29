import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, FormControlLabel, Grid, Slider, Switch, TextField, Typography } from '@mui/material';

const defaultValues = {
  scenarioName: '',
  maxAgents: 4,
  adaptiveDifficulty: true,
  explorationRate: 0.2,
  notes: '',
};

const sliderMarks = [
  { value: 0, label: '0%' },
  { value: 0.5, label: '50%' },
  { value: 1, label: '100%' },
];

const AIForm = ({ initialValues, onSubmit, onCancel }) => {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });

  useEffect(() => {
    setValues({ ...defaultValues, ...initialValues });
  }, [initialValues]);

  const handleChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="اسم السيناريو التكيفي"
            value={values.scenarioName}
            onChange={(event) => handleChange('scenarioName', event.target.value)}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="عدد العملاء المتوازي"
            type="number"
            value={values.maxAgents}
            onChange={(event) => handleChange('maxAgents', Number(event.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={values.adaptiveDifficulty}
                onChange={(event) => handleChange('adaptiveDifficulty', event.target.checked)}
              />
            }
            label="تفعيل صعوبة تكيفية"
          />
        </Grid>
      </Grid>

      <Box>
        <Typography gutterBottom>نسبة الاستكشاف للذكاء الاصطناعي</Typography>
        <Slider
          value={values.explorationRate}
          onChange={(_, value) => handleChange('explorationRate', value)}
          min={0}
          max={1}
          step={0.05}
          marks={sliderMarks}
        />
      </Box>

      <TextField
        label="ملاحظات تشغيل"
        value={values.notes}
        onChange={(event) => handleChange('notes', event.target.value)}
        multiline
        minRows={3}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onCancel} variant="text">
          إلغاء
        </Button>
        <Button type="submit" variant="contained">
          حفظ الإعدادات
        </Button>
      </Box>
    </Box>
  );
};

AIForm.propTypes = {
  initialValues: PropTypes.shape({
    scenarioName: PropTypes.string,
    maxAgents: PropTypes.number,
    adaptiveDifficulty: PropTypes.bool,
    explorationRate: PropTypes.number,
    notes: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

AIForm.defaultProps = {
  initialValues: defaultValues,
  onSubmit: undefined,
  onCancel: undefined,
};

export default AIForm;
