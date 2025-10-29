import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Group,
  RingProgress,
  Slider,
  Switch,
  Text,
  Title,
  Tooltip,
  SegmentedControl,
  Stack,
  ThemeIcon,
  Flex,
  Divider,
  NumberInput,
  Select,
  Progress,
} from '@mantine/core';
import { DonutChart } from '@mantine/charts';
import { IconBrain, IconRobot, IconSparkles } from '@tabler/icons-react';
import type { ControlPanelState, ControlUpdater } from './types';

interface TrainingSnapshot {
  accuracy: number;
  loss: number;
  throughput: number;
}

interface AIControlPanelProps {
  state: ControlPanelState;
  onStateChange: ControlUpdater;
}

const MODEL_KEYS = ['recommendation', 'nlp', 'behavior', 'assessment'] as const;

export const AIControlPanel: React.FC<AIControlPanelProps> = ({ state, onStateChange }) => {
  const [trainingProgress, setTrainingProgress] = useState<Map<string, number>>(() => {
    const initial = new Map<string, number>();
    MODEL_KEYS.forEach(model => initial.set(model, 0));
    return initial;
  });
  const [trainingSnapshot, setTrainingSnapshot] = useState<TrainingSnapshot>({
    accuracy: 74,
    loss: 0.45,
    throughput: 128,
  });
  const [activeModel, setActiveModel] = useState<typeof MODEL_KEYS[number]>('recommendation');

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTrainingProgress(prev => {
        const next = new Map(prev);
        MODEL_KEYS.forEach(model => {
          const current = next.get(model) ?? 0;
          if (current < 100) {
            next.set(model, Math.min(100, current + Math.random() * 8));
          }
        });
        return next;
      });

      setTrainingSnapshot(prev => ({
        accuracy: Math.min(99, prev.accuracy + Math.random() * 1.2),
        loss: Math.max(0.1, prev.loss - Math.random() * 0.02),
        throughput: prev.throughput + (Math.random() > 0.5 ? 8 : -4),
      }));
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  const handleAdaptiveLearningToggle = useCallback(
    (enabled: boolean) => {
      onStateChange(prev => ({
        ...prev,
        aiSystems: {
          ...prev.aiSystems,
          adaptiveLearning: enabled,
        },
      }));
    },
    [onStateChange],
  );

  const handlePerformanceMetricChange = useCallback(
    (metric: string, value: number) => {
      onStateChange(prev => {
        const nextMetrics = new Map(prev.aiSystems.performanceMetrics);
        nextMetrics.set(metric, value);
        return {
          ...prev,
          aiSystems: {
            ...prev.aiSystems,
            performanceMetrics: nextMetrics,
          },
        };
      });
    },
    [onStateChange],
  );

  const modelPerformance = useMemo(
    () => state.aiSystems.performanceMetrics.get('recommendation') ?? 78,
    [state.aiSystems.performanceMetrics],
  );

  return (
    <Stack gap="lg" className="ai-control-panel">
      <Group align="flex-start" grow>
        <Card shadow="sm" padding="lg" radius="md" className="ai-model-card">
          <Group justify="space-between" align="flex-start" mb="md">
            <Title order={4}>🤖 نموذج التوصية الذكية</Title>
            <ThemeIcon variant="light" radius="xl" size="lg">
              <IconRobot size={18} />
            </ThemeIcon>
          </Group>
          <Stack gap="md">
            <Switch
              label="التعلم التكيفي"
              checked={state.aiSystems.adaptiveLearning}
              onChange={event => handleAdaptiveLearningToggle(event.currentTarget.checked)}
            />
            <Slider
              label="دقة التوصية"
              marks={[
                { value: 60, label: '60%' },
                { value: 80, label: '80%' },
                { value: 100, label: '100%' },
              ]}
              value={modelPerformance}
              min={50}
              max={100}
              step={1}
              onChange={value => handlePerformanceMetricChange('recommendation', value)}
            />
            <RingProgress
              size={140}
              thickness={16}
              label={
                <Stack gap={0} align="center" pt="xs">
                  <Text size="xs" color="dimmed">
                    دقة التوصية
                  </Text>
                  <Text fw={700}>{modelPerformance}%</Text>
                </Stack>
              }
              sections={[{ value: modelPerformance, color: 'indigo.5' }]}
            />
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" className="ai-model-card">
          <Group justify="space-between" align="flex-start" mb="md">
            <Title order={4}>💬 معالجة اللغة الطبيعية</Title>
            <ThemeIcon variant="light" radius="xl" size="lg">
              <IconBrain size={18} />
            </ThemeIcon>
          </Group>
          <Stack gap="md">
            <Progress size="xl" radius="md" value={trainingProgress.get('nlp') ?? 0} />
            <Text size="sm" ta="center" fw={600}>
              {Math.round(trainingProgress.get('nlp') ?? 0)}%
            </Text>
            <Group gap="xs" justify="space-between">
              <Tooltip label="بدء تدريب النموذج">
                <Button variant="light" size="sm" radius="md">
                  تدريب
                </Button>
              </Tooltip>
              <Tooltip label="تقييم الأداء الحالي">
                <Button variant="light" size="sm" radius="md">
                  تقييم
                </Button>
              </Tooltip>
              <Tooltip label="إعادة ضبط النموذج">
                <Button variant="light" size="sm" radius="md" color="red">
                  إعادة تعيين
                </Button>
              </Tooltip>
            </Group>
            <Divider />
            <Stack gap={6}>
              <Text size="xs" color="dimmed">
                لقطة التدريب الحالية
              </Text>
              <Flex gap="md" wrap="wrap">
                <MetricPill label="الدقة" value={`${trainingSnapshot.accuracy.toFixed(1)}%`} />
                <MetricPill label="الخسارة" value={trainingSnapshot.loss.toFixed(3)} />
                <MetricPill label="العينات/ثانية" value={trainingSnapshot.throughput.toFixed(0)} />
              </Flex>
            </Stack>
          </Stack>
        </Card>
      </Group>

      <Group align="flex-start" grow>
        <Card shadow="sm" padding="lg" radius="md" className="ai-model-card">
          <Group justify="space-between" align="flex-start" mb="md">
            <Title order={4}>📊 تحليل السلوك والتعلم</Title>
            <ThemeIcon variant="light" radius="xl" size="lg">
              <IconSparkles size={18} />
            </ThemeIcon>
          </Group>
          <DonutChart
            size={180}
            tooltipAnimationDuration={200}
            data={[
              { name: 'نشط', value: 65, color: 'green.6' },
              { name: 'متوسط', value: 25, color: 'yellow.4' },
              { name: 'منخفض', value: 10, color: 'red.5' },
            ]}
          />
          <Stack gap="sm" mt="md">
            <Switch label="التتبع التلقائي" defaultChecked radius="md" />
            <Switch label="التدخل الذكي" defaultChecked radius="md" />
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" className="advanced-ai-controls">
          <Group justify="space-between" align="flex-start" mb="md">
            <Title order={4}>🎛️ تحكم متقدم في النماذج</Title>
            <SegmentedControl
              value={activeModel}
              onChange={value => setActiveModel(value as typeof MODEL_KEYS[number])}
              data={MODEL_KEYS.map(model => ({ value: model, label: model.toUpperCase() }))}
            />
          </Group>

          <Stack gap="md">
            <Stack gap="xs">
              <Text size="sm" fw={600}>
                معدل التعلم
              </Text>
              <Slider
                min={0.0001}
                max={0.1}
                step={0.0001}
                defaultValue={0.001}
                label={value => value.toFixed(4)}
              />
            </Stack>

            <Stack gap="xs">
              <Text size="sm" fw={600}>
                حجم الدفعة
              </Text>
              <Select
                defaultValue="64"
                data={[
                  { value: '32', label: '32' },
                  { value: '64', label: '64' },
                  { value: '128', label: '128' },
                  { value: '256', label: '256' },
                ]}
              />
            </Stack>

            <Stack gap="xs">
              <Text size="sm" fw={600}>
                وظيفة الخسارة
              </Text>
              <Select
                defaultValue="crossentropy"
                data={[
                  { value: 'mse', label: 'MSE' },
                  { value: 'crossentropy', label: 'Cross Entropy' },
                  { value: 'huber', label: 'Huber' },
                ]}
              />
            </Stack>

            <Stack gap="xs">
              <Text size="sm" fw={600}>
                مبكر الإيقاف (عصر)
              </Text>
              <NumberInput defaultValue={10} min={1} max={100} step={1} />
            </Stack>
          </Stack>

          <Divider my="md" />

          <Group grow>
            <Button variant="filled" color="blue">
              🔄 تدريب جميع النماذج
            </Button>
            <Button variant="light" color="orange">
              📈 تحسين Hyperparameters
            </Button>
            <Button variant="light" color="red">
              🗑️ مسح ذاكرة النماذج
            </Button>
          </Group>
        </Card>
      </Group>
    </Stack>
  );
};

const MetricPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Stack
    gap={2}
    align="flex-start"
    p={8}
    style={{ borderRadius: '8px', backgroundColor: '#F5F7FA' }}
  >
    <Text size="xs" color="dimmed">
      {label}
    </Text>
    <Text fw={600}>{value}</Text>
  </Stack>
);

export default AIControlPanel;
