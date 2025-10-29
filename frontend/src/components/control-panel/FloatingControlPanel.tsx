import React, { useMemo } from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  RingProgress,
  Stack,
  Text,
  ThemeIcon,
  Tooltip
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconGauge,
  IconLock,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconShieldCheck,
  IconTopologyRing2,
  IconUsers
} from '@tabler/icons-react';
import type { ControlPanelState, ControlUpdater } from './types';

interface FloatingControlPanelProps {
  state: ControlPanelState;
  onStateChange: ControlUpdater;
  simulationTime: number;
  threatPercent: number;
  activeScenarioCount: number;
}

const clampTimeScale = (value: number) => Math.min(10, Math.max(0, Number(value.toFixed(2))));

const formatSimulationTime = (seconds: number): string => {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, secs].map(part => part.toString().padStart(2, '0')).join(':');
  }

  return [minutes, secs].map(part => part.toString().padStart(2, '0')).join(':');
};

export const FloatingControlPanel: React.FC<FloatingControlPanelProps> = ({
  state,
  onStateChange,
  simulationTime,
  threatPercent,
  activeScenarioCount
}) => {
  const paused = state.globalControls.timeScale === 0;

  const metrics = useMemo(() => {
    const activeUsers = Math.max(8, state.userManagement.activeFilters.length * 3 + 18);
    const defenses = (state.simulationEnvironment.autoResponse ? 12 : 8) + activeScenarioCount;
    return {
      activeUsers,
      activeThreats: activeScenarioCount,
      defenses
    };
  }, [state.userManagement.activeFilters.length, state.simulationEnvironment.autoResponse, activeScenarioCount]);

  const threatColor = threatPercent > 70 ? 'red.6' : threatPercent > 40 ? 'yellow.6' : 'teal.6';

  const handleSlow = () =>
    onStateChange(prev => ({
      ...prev,
      globalControls: {
        ...prev.globalControls,
        timeScale: Math.max(0.1, clampTimeScale(prev.globalControls.timeScale - 0.5))
      }
    }));

  const handleSpeed = () =>
    onStateChange(prev => ({
      ...prev,
      globalControls: {
        ...prev.globalControls,
        timeScale: clampTimeScale(prev.globalControls.timeScale + 0.5)
      }
    }));

  const handleToggle = () =>
    onStateChange(prev => ({
      ...prev,
      globalControls: {
        ...prev.globalControls,
        timeScale: prev.globalControls.timeScale === 0 ? 1 : 0
      }
    }));

  const handleEmergencyStop = () =>
    onStateChange(prev => ({
      ...prev,
      globalControls: {
        ...prev.globalControls,
        timeScale: 0
      },
      simulationEnvironment: {
        ...prev.simulationEnvironment,
        activeScenarios: new Set<string>(),
        autoResponse: false
      }
    }));

  const handleLockdown = () =>
    onStateChange(prev => ({
      ...prev,
      globalControls: {
        ...prev.globalControls,
        difficulty: Math.min(10, prev.globalControls.difficulty + 1)
      },
      simulationEnvironment: {
        ...prev.simulationEnvironment,
        autoResponse: true,
        threatLevel: Math.min(10, prev.simulationEnvironment.threatLevel + 1)
      }
    }));

  return (
    <Card shadow="xl" radius="lg" withBorder className="floating-control-panel" padding="lg">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Group gap="xs">
              <ThemeIcon size="sm" radius="md" variant="light" color="indigo">
                <IconTopologyRing2 size={16} />
              </ThemeIcon>
              <Text fw={600} size="sm">
                بيئة المحاكاة
              </Text>
            </Group>
            <Group gap="xs">
              <ThemeIcon size="sm" radius="md" variant="light" color="blue">
                <IconGauge size={16} />
              </ThemeIcon>
              <Text size="xs" color="dimmed">
                زمن المحاكاة: {formatSimulationTime(simulationTime)}
              </Text>
            </Group>
          </Stack>
          <RingProgress
            size={90}
            thickness={10}
            sections={[{ value: threatPercent, color: threatColor }]}
            label={
              <Stack gap={0} align="center" pt={2}>
                <Text size="xs" color="dimmed">
                  مؤشر الخطر
                </Text>
                <Text size="sm" fw={700}>
                  {threatPercent}%
                </Text>
              </Stack>
            }
          />
        </Group>

        <Divider label="حالة التشغيل" labelPosition="center" />

        <Group gap="md" grow>
          <Stack gap={4}>
            <Group gap="xs">
              <ThemeIcon size="sm" radius="md" variant="light" color="cyan">
                <IconUsers size={16} />
              </ThemeIcon>
              <Text size="xs" color="dimmed">
                المستخدمون النشطون
              </Text>
            </Group>
            <Text fw={700} size="lg">
              {metrics.activeUsers}
            </Text>
          </Stack>
          <Stack gap={4}>
            <Group gap="xs">
              <ThemeIcon size="sm" radius="md" variant="light" color="red">
                <IconAlertTriangle size={16} />
              </ThemeIcon>
              <Text size="xs" color="dimmed">
                التهديدات النشطة
              </Text>
            </Group>
            <Group gap="xs">
              <Text fw={700} size="lg">
                {metrics.activeThreats}
              </Text>
              <Badge color={metrics.activeThreats > 0 ? 'red' : 'gray'} variant="light">
                {metrics.activeThreats > 0 ? 'تحت السيطرة' : 'مستقر'}
              </Badge>
            </Group>
          </Stack>
          <Stack gap={4}>
            <Group gap="xs">
              <ThemeIcon size="sm" radius="md" variant="light" color="teal">
                <IconShieldCheck size={16} />
              </ThemeIcon>
              <Text size="xs" color="dimmed">
                الدفاعات العاملة
              </Text>
            </Group>
            <Text fw={700} size="lg">
              {metrics.defenses}
            </Text>
          </Stack>
        </Group>

        <Divider label="تحكم سريع" labelPosition="center" />

        <Group gap="sm" grow>
          <Tooltip label="خفض سرعة المحاكاة" withArrow>
            <Button
              variant="light"
              color="gray"
              leftSection={<IconPlayerTrackPrev size={16} />}
              onClick={handleSlow}
            >
              إبطاء
            </Button>
          </Tooltip>
          <Tooltip label={paused ? 'استئناف الزمن' : 'إيقاف الزمن'} withArrow>
            <Button
              variant={paused ? 'filled' : 'light'}
              color={paused ? 'green' : 'yellow'}
              leftSection={paused ? <IconPlayerPlay size={16} /> : <IconPlayerPause size={16} />}
              onClick={handleToggle}
            >
              {paused ? 'تشغيل' : 'إيقاف' }
            </Button>
          </Tooltip>
          <Tooltip label="تسريع المحاكاة" withArrow>
            <Button
              variant="light"
              color="blue"
              leftSection={<IconPlayerTrackNext size={16} />}
              onClick={handleSpeed}
            >
              تسريع
            </Button>
          </Tooltip>
        </Group>
        <Group gap="xs" justify="space-between">
          <Text size="xs" color="dimmed">
            السرعة الحالية: {state.globalControls.timeScale.toFixed(1)}x
          </Text>
          <Badge color={state.simulationEnvironment.autoResponse ? 'green' : 'gray'} variant="light">
            {state.simulationEnvironment.autoResponse ? 'استجابة آلية نشطة' : 'المراقبة اليدوية'}
          </Badge>
        </Group>

        <Divider label="إجراءات الطوارئ" labelPosition="center" />

        <Group gap="sm" grow>
          <Button
            variant="filled"
            color="red"
            leftSection={<IconPlayerPause size={16} />}
            onClick={handleEmergencyStop}
          >
            إيقاف طارئ
          </Button>
          <Button
            variant="outline"
            color="dark"
            leftSection={<IconLock size={16} />}
            onClick={handleLockdown}
          >
            وضع الحظر
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default FloatingControlPanel;
