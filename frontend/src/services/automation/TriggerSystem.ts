import { AdvancedAutomationEngine } from './AutomationEngine';

type TriggerHandler = (trigger: AutomationTrigger, context: any) => Promise<void>;

declare global {
  interface Window {
    eventSystem?: {
      addEventListener: (event: string, handler: (data: any) => void) => void;
      removeEventListener?: (event: string, handler: (data: any) => void) => void;
    };
    voiceControl?: {
      registerCommand: (command: { phrase: string; action: () => void }) => void;
      unregisterCommand?: (phrase: string) => void;
    };
  }
}

export class AdvancedTriggerSystem {
  private triggers: Map<string, AutomationTrigger> = new Map();
  private activeTriggers: Set<string> = new Set();
  private triggerHandlers: Map<string, TriggerHandler> = new Map();

  registerTriggerType(type: string, handler: TriggerHandler): void {
    this.triggerHandlers.set(type, handler);
  }

  addTrigger(trigger: AutomationTrigger): string {
    const triggerId = this.generateTriggerId();
    this.triggers.set(triggerId, { ...trigger, id: triggerId });

    if (trigger.enabled) {
      this.activateTrigger(triggerId);
    }

    return triggerId;
  }

  activateTrigger(triggerId: string): void {
    const trigger = this.triggers.get(triggerId);
    if (!trigger || this.activeTriggers.has(triggerId)) {
      return;
    }

    this.activeTriggers.add(triggerId);
    this.monitorTrigger(triggerId);
  }

  deactivateTrigger(triggerId: string): void {
    if (!this.activeTriggers.has(triggerId)) {
      return;
    }

    this.activeTriggers.delete(triggerId);
    const trigger = this.triggers.get(triggerId);
    if (!trigger?.monitoringData) {
      return;
    }

    if (trigger.monitoringData.interval) {
      clearInterval(trigger.monitoringData.interval as NodeJS.Timeout);
    }

    if (trigger.monitoringData.eventHandler && window.eventSystem?.removeEventListener && trigger.eventType) {
      window.eventSystem.removeEventListener(trigger.eventType, trigger.monitoringData.eventHandler);
    }

    if (trigger.monitoringData.voicePhrase && window.voiceControl?.unregisterCommand) {
      window.voiceControl.unregisterCommand(trigger.monitoringData.voicePhrase);
    }

    trigger.monitoringData = undefined;
  }

  private monitorTrigger(triggerId: string): void {
    const trigger = this.triggers.get(triggerId);
    if (!trigger) {
      return;
    }

    if (this.triggerHandlers.has(trigger.type)) {
      const handler = this.triggerHandlers.get(trigger.type)!;
      handler(trigger, {}).catch(error => this.recordTriggerExecution(triggerId, 'failed', null, error));
      return;
    }

    switch (trigger.type) {
      case 'schedule':
        this.monitorScheduleTrigger(triggerId, trigger);
        break;
      case 'event':
        this.monitorEventTrigger(triggerId, trigger);
        break;
      case 'condition':
        this.monitorConditionTrigger(triggerId, trigger);
        break;
      case 'voice':
        this.monitorVoiceTrigger(triggerId, trigger);
        break;
      default:
        console.warn(`Unsupported trigger type: ${trigger.type}`);
    }
  }

  private monitorScheduleTrigger(triggerId: string, trigger: AutomationTrigger): void {
    const interval = setInterval(() => {
      if (trigger.scheduleConfig && this.shouldTriggerSchedule(trigger.scheduleConfig)) {
        this.executeTrigger(triggerId).catch(console.error);
      }
    }, 60000);

    trigger.monitoringData = { interval };
  }

  private monitorEventTrigger(triggerId: string, trigger: AutomationTrigger): void {
    const eventHandler = (eventData: any) => {
      if (this.evaluateEventConditions(trigger.conditions, eventData)) {
        this.executeTrigger(triggerId, eventData).catch(console.error);
      }
    };

    const eventSystem = window.eventSystem;
    if (!eventSystem) {
      console.warn('Event system is not available on window');
      return;
    }

    if (!trigger.eventType) {
      console.warn('Event trigger missing eventType');
      return;
    }

    eventSystem.addEventListener(trigger.eventType, eventHandler);
    trigger.monitoringData = { eventHandler };
  }

  private monitorConditionTrigger(triggerId: string, trigger: AutomationTrigger): void {
    const interval = setInterval(() => {
      if (this.evaluateEventConditions(trigger.conditions, {})) {
        this.executeTrigger(triggerId).catch(console.error);
      }
    }, 10000);

    trigger.monitoringData = { interval };
  }

  private monitorVoiceTrigger(triggerId: string, trigger: AutomationTrigger): void {
    const phrase = trigger.voicePhrase || trigger.name;
    const voiceControl = window.voiceControl;
    if (!voiceControl) {
      console.warn('Voice control system is not available on window');
      return;
    }

    voiceControl.registerCommand({
      phrase,
      action: () => {
        this.executeTrigger(triggerId).catch(console.error);
      }
    });

    trigger.monitoringData = { voicePhrase: phrase };
  }

  private async executeTrigger(triggerId: string, context?: any): Promise<void> {
    const trigger = this.triggers.get(triggerId);
    if (!trigger) {
      return;
    }

    try {
      for (const action of trigger.actions) {
        await this.executeAction(action, context);
      }

      this.recordTriggerExecution(triggerId, 'success', context);
    } catch (error) {
      this.recordTriggerExecution(triggerId, 'failed', context, error);

      if (trigger.errorHandling) {
        await this.handleTriggerError(triggerId, trigger.errorHandling, error, context);
      }
    }
  }

  private async executeAction(action: TriggerAction, context: any): Promise<void> {
    switch (action.type) {
      case 'macro':
        await this.executeMacroAction(action, context);
        break;
      case 'api':
        await this.executeAPIAction(action, context);
        break;
      case 'notification':
        await this.executeNotificationAction(action, context);
        break;
      case 'custom':
        await this.executeCustomAction(action, context);
        break;
      default:
        console.warn(`Unknown trigger action type: ${action.type}`);
    }
  }

  private async executeMacroAction(action: TriggerAction, context: any): Promise<void> {
    if (!action.macroId) {
      throw new Error('Macro action missing macroId');
    }

    const automationEngine = new AdvancedAutomationEngine();
    await automationEngine.executeMacro(action.macroId, context);
  }

  private async executeAPIAction(action: TriggerAction, context: any): Promise<void> {
    if (!action.apiEndpoint) {
      throw new Error('API action missing apiEndpoint');
    }

    await fetch(action.apiEndpoint, {
      method: action.parameters?.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(action.parameters?.headers || {})
      },
      body: JSON.stringify({ context, ...(action.parameters?.body || {}) })
    });
  }

  private async executeNotificationAction(action: TriggerAction, context: any): Promise<void> {
    if (!action.notification) {
      throw new Error('Notification action missing configuration');
    }

    console.info('Notification action dispatched', { notification: action.notification, context });
  }

  private async executeCustomAction(action: TriggerAction, context: any): Promise<void> {
    if (!action.customHandler) {
      throw new Error('Custom action missing customHandler');
    }

    const handlerFn = (window as any)[action.customHandler];
    if (typeof handlerFn !== 'function') {
      throw new Error(`Custom handler ${action.customHandler} is not a function on window`);
    }

    await handlerFn(context, action.parameters);
  }

  private async handleTriggerError(triggerId: string, config: ErrorHandlingConfig, error: any, context: any): Promise<void> {
    if (!config.retry) {
      if (config.fallbackAction) {
        await this.executeAction(config.fallbackAction, context);
      }
      return;
    }

    for (let attempt = 1; attempt <= config.maxRetries; attempt += 1) {
      try {
        await this.executeTrigger(triggerId, context);
        return;
      } catch (retryError) {
        if (attempt === config.maxRetries && config.fallbackAction) {
          await this.executeAction(config.fallbackAction, context);
        }
      }
    }
  }

  private shouldTriggerSchedule(schedule: ScheduleConfig): boolean {
    const now = new Date();
    return this.evaluateCronExpression(schedule.cron, now) &&
      this.evaluateTimeRange(schedule.timeRange, now) &&
      this.evaluateDateRange(schedule.dateRange, now);
  }

  private evaluateCronExpression(expression: string, date: Date): boolean {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = expression.split(' ');
    return this.matchesCronField(minute, date.getMinutes()) &&
      this.matchesCronField(hour, date.getHours()) &&
      this.matchesCronField(dayOfMonth, date.getDate()) &&
      this.matchesCronField(month, date.getMonth() + 1) &&
      this.matchesCronField(dayOfWeek, date.getDay());
  }

  private matchesCronField(field: string, value: number): boolean {
    if (field === '*') return true;
    if (field.includes(',')) {
      return field.split(',').some(part => this.matchesCronField(part, value));
    }
    if (field.includes('-')) {
      const [start, end] = field.split('-').map(Number);
      return value >= start && value <= end;
    }
    if (field.includes('/')) {
      const [base, step] = field.split('/').map(Number);
      return value % step === base % step;
    }
    return Number(field) === value;
  }

  private evaluateTimeRange(range: ScheduleConfig['timeRange'], date: Date): boolean {
    if (!range) {
      return true;
    }
    const [startHour, startMinute] = range.start.split(':').map(Number);
    const [endHour, endMinute] = range.end.split(':').map(Number);

    const currentMinutes = date.getHours() * 60 + date.getMinutes();
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }

  private evaluateDateRange(range: ScheduleConfig['dateRange'], date: Date): boolean {
    if (!range) {
      return true;
    }
    const start = new Date(range.start);
    const end = new Date(range.end);
    return date >= start && date <= end;
  }

  private evaluateEventConditions(conditions: Condition[], eventData: any): boolean {
    if (!conditions || conditions.length === 0) {
      return true;
    }
    return conditions.every(condition => this.evaluateSingleCondition(condition, eventData));
  }

  private evaluateSingleCondition(condition: Condition, data: any): boolean {
    const value = this.getNestedValue(data, condition.field);
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'notEquals':
        return value !== condition.value;
      case 'greaterThan':
        return value > condition.value;
      case 'lessThan':
        return value < condition.value;
      case 'contains':
        return String(value).includes(String(condition.value));
      case 'matches':
        return new RegExp(condition.value).test(String(value));
      default:
        return false;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private recordTriggerExecution(triggerId: string, status: string, context: any, error?: any): void {
    const executionRecord = {
      triggerId,
      timestamp: new Date().toISOString(),
      status,
      context,
      error: error?.message
    };

    try {
      const history = JSON.parse(localStorage.getItem('triggerExecutions') || '[]');
      history.push(executionRecord);
      localStorage.setItem('triggerExecutions', JSON.stringify(history.slice(-1000)));
    } catch (storageError) {
      console.error('Failed to persist trigger execution history', storageError);
    }
  }

  private generateTriggerId(): string {
    return `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

interface AutomationTrigger {
  id?: string;
  name: string;
  type: 'schedule' | 'event' | 'condition' | 'voice';
  description: string;
  enabled: boolean;
  conditions: Condition[];
  actions: TriggerAction[];
  scheduleConfig?: ScheduleConfig;
  eventType?: string;
  voicePhrase?: string;
  monitoringData?: any;
  errorHandling?: ErrorHandlingConfig;
}

interface TriggerAction {
  type: 'macro' | 'api' | 'notification' | 'custom';
  macroId?: string;
  apiEndpoint?: string;
  notification?: NotificationConfig;
  customHandler?: string;
  parameters?: Record<string, any>;
}

interface NotificationConfig {
  channel: 'toast' | 'email' | 'sms' | 'webhook';
  message: string;
  recipients?: string[];
}

interface Condition {
  field: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'matches';
  value: any;
}

interface ScheduleConfig {
  cron: string;
  timeRange?: { start: string; end: string };
  dateRange?: { start: Date; end: Date };
  timezone?: string;
}

interface ErrorHandlingConfig {
  retry: boolean;
  maxRetries: number;
  fallbackAction?: TriggerAction;
}
