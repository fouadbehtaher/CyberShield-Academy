import React, { useState, useEffect } from 'react';
import { Button, Card, Grid, Group, Progress, RingProgress, Stack, Text } from '@mantine/core';

interface AutomationStats {
  totalMacros: number;
  activeMacros: number;
  executionsToday: number;
  successRate: number;
  averageExecutionTime: number;
}

interface SystemHealth {
  automationEngine: 'healthy' | 'warning' | 'critical';
  triggerSystem: 'healthy' | 'warning' | 'critical';
  scheduler: 'healthy' | 'warning' | 'critical';
}

export const AutomationDashboard: React.FC = () => {
  const [stats, setStats] = useState<AutomationStats>({
    totalMacros: 0,
    activeMacros: 0,
    executionsToday: 0,
    successRate: 0,
    averageExecutionTime: 0
  });

  const [recentExecutions, setRecentExecutions] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    automationEngine: 'healthy',
    triggerSystem: 'healthy',
    scheduler: 'healthy'
  });

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    const macros = JSON.parse(localStorage.getItem('macros') || '[]');
    const executions = JSON.parse(localStorage.getItem('triggerExecutions') || '[]');

    const today = new Date().toDateString();
    const todayExecutions = executions.filter((execution: any) => new Date(execution.timestamp).toDateString() === today);
    const successfulExecutions = todayExecutions.filter((execution: any) => execution.status === 'success');

    setStats({
      totalMacros: macros.length,
      activeMacros: macros.filter((macro: any) => macro.enabled).length,
      executionsToday: todayExecutions.length,
      successRate: todayExecutions.length > 0 ? (successfulExecutions.length / todayExecutions.length) * 100 : 0,
      averageExecutionTime: calculateAverageTime(todayExecutions)
    });

    setRecentExecutions(executions.slice(-10).reverse());
  };

  const calculateAverageTime = (executions: any[]): number => {
    if (executions.length === 0) {
      return 0;
    }

    const totalTime = executions.reduce((sum, exec) => sum + (exec.duration || 0), 0);
    return totalTime / executions.length;
  };

  const successRate = Math.round(stats.successRate);
  const activeRatio = stats.totalMacros > 0 ? (stats.activeMacros / stats.totalMacros) * 100 : 0;

  return (
    <div className="automation-dashboard">
      <h2>📊 لوحة مراقبة الأتمتة</h2>

      <Grid className="stats-grid">
        <Grid.Col span={3}>
          <Card className="stat-card">
            <Text size="xl" fw={700}>
              {stats.totalMacros}
            </Text>
            <Text c="dimmed">إجمالي الماكروات</Text>
            <Progress value={activeRatio} mt="sm" />
            <Text size="sm">{stats.activeMacros} نشطة</Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card className="stat-card">
            <Text size="xl" fw={700}>
              {stats.executionsToday}
            </Text>
            <Text c="dimmed">التنفيذات اليوم</Text>
            <RingProgress
              sections={[{ value: successRate, color: 'green' }]}
              label={
                <Text c="green" fw={700} ta="center" size="xl">
                  {successRate}%
                </Text>
              }
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card className="stat-card">
            <Text size="xl" fw={700}>
              {Math.round(stats.averageExecutionTime)}ms
            </Text>
            <Text c="dimmed">متوسط وقت التنفيذ</Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={3}>
          <Card className="stat-card">
            <div className="health-status">
              <div className={`status-indicator ${systemHealth.automationEngine}`} />
              <Text>محرك الأتمتة</Text>
            </div>
            <div className="health-status">
              <div className={`status-indicator ${systemHealth.triggerSystem}`} />
              <Text>نظام المشغلات</Text>
            </div>
            <div className="health-status">
              <div className={`status-indicator ${systemHealth.scheduler}`} />
              <Text>المجدول</Text>
            </div>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid className="details-grid" mt="lg">
        <Grid.Col span={6}>
          <Card className="recent-executions">
            <h4>🕐 آخر التنفيذات</h4>
            <div className="executions-list">
              {recentExecutions.map(execution => (
                <div key={execution.id ?? `${execution.triggerId}-${execution.timestamp}`} className="execution-item">
                  <div className="execution-info">
                    <Text fw={500}>{execution.triggerId}</Text>
                    <Text size="sm" c="dimmed">
                      {new Date(execution.timestamp).toLocaleString()}
                    </Text>
                  </div>
                  <div className={`execution-status ${execution.status}`}>
                    {execution.status === 'success' ? '✅' : '❌'}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          <Card className="quick-actions">
            <h4>⚡ إجراءات سريعة</h4>
            <Stack gap="md">
              <Button variant="light" fullWidth>
                🔄 تشغيل جميع الماكروات النشطة
              </Button>
              <Button variant="light" fullWidth>
                ⏸️ إيقاف جميع المشغلات
              </Button>
              <Button variant="light" fullWidth>
                📋 تصدير سجل التنفيذات
              </Button>
              <Button variant="light" color="red" fullWidth>
                🗑️ مسح السجلات القديمة
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};
