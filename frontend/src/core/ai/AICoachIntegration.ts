import { AIStore, IAICoachService, TYPES, UserStore, useInjection } from '../architecture/container';

export type RecommendationPayload = {
  id: string;
  contentId: string;
  confidence: number;
  reasoning: string;
};

export type AdaptiveContentPayload = {
  moduleId: string;
  priority: 'low' | 'medium' | 'high';
};

export type InterventionPayload = {
  message: string;
  severity: 'info' | 'warning' | 'critical';
  recommendedAction?: string;
};

type LearningPathOptimizationPayload = {
  sequence: string[];
  rationale: string;
};

type RealTimeAnalyticsPayload = {
  engagementScore: number;
  cognitiveLoad: number;
};

type AIMessage = {
  type: 'ADAPTIVE_RECOMMENDATION' | 'COGNITIVE_INTERVENTION' | 'LEARNING_PATH_OPTIMIZATION' | 'REAL_TIME_ANALYTICS';
  payload: unknown;
};

export type UserBehaviorEvent = {
  type: string;
  metadata: Record<string, unknown>;
};

type BufferedEvent = UserBehaviorEvent & {
  timestamp: number;
  sessionId?: string;
  cognitiveMetrics?: Record<string, unknown>;
};

type ImmediateAnalysis = {
  requiresIntervention: boolean;
  intervention?: InterventionPayload;
  learningStyleUpdate?: string;
};

class MLProcessor {
  async analyzeImmediate(event: UserBehaviorEvent): Promise<ImmediateAnalysis> {
    // Placeholder ML logic; in production this would bridge to WebAssembly or Web Worker models.
    const requiresIntervention = event.type === 'STRUGGLE_SIGNAL';
    return {
      requiresIntervention,
      intervention: requiresIntervention
        ? {
            message: 'Real-time assistance triggered by detected struggle pattern.',
            severity: 'warning',
            recommendedAction: 'Switch to guided mode',
          }
        : undefined,
      learningStyleUpdate: event.metadata?.suggestedStyle as string | undefined,
    };
  }
}

const captureCognitiveMetrics = (): Record<string, unknown> => ({
  focusLevel: Math.random(),
  stressIndicator: Math.random(),
});

export class AICoachIntegration {
  private websocket: WebSocket | null = null;
  private eventBuffer: BufferedEvent[] = [];
  private flushIntervalHandle: number | null = null;
  private readonly mlProcessor = new MLProcessor();

  constructor(
    private readonly userStore: UserStore,
    private readonly aiStore: AIStore,
    private readonly aiService: IAICoachService,
  ) {
    this.initializeRealTimeConnection();
    this.setupBehaviorTracking();
  }

  private initializeRealTimeConnection(): void {
    const url = process.env.REACT_APP_AI_WS_URL ?? '';
    if (!url) {
      return;
    }

    try {
      this.websocket = new WebSocket(url);
    } catch (error) {
      console.error('Failed to open AI Coach websocket', error);
      this.scheduleReconnect();
      return;
    }

    this.websocket.onmessage = async (event) => {
      try {
        const message: AIMessage = JSON.parse(event.data);
        await this.handleAIMessage(message);
      } catch (error) {
        console.warn('Invalid AI message received', error);
      }
    };

    this.websocket.onerror = (event) => {
      console.error('AI Coach websocket error', event);
    };

    this.websocket.onclose = () => {
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (this.flushIntervalHandle) {
      window.clearInterval(this.flushIntervalHandle);
      this.flushIntervalHandle = null;
    }
    setTimeout(() => this.initializeRealTimeConnection(), 5000);
  }

  private setupBehaviorTracking(): void {
    this.flushIntervalHandle = window.setInterval(() => {
      void this.flushEvents();
    }, 4000);
  }

  public trackUserBehavior(event: UserBehaviorEvent): void {
    const enrichedEvent: BufferedEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.userStore.snapshot.currentSession?.id ?? undefined,
      cognitiveMetrics: captureCognitiveMetrics(),
    };
    this.eventBuffer.push(enrichedEvent);

    void this.processImmediateFeedback(event);

    if (this.eventBuffer.length >= 10) {
      void this.flushEvents();
    }
  }

  private async processImmediateFeedback(event: UserBehaviorEvent): Promise<void> {
    try {
      const analysis = await this.mlProcessor.analyzeImmediate(event);
      if (analysis.requiresIntervention && analysis.intervention) {
        this.triggerRealTimeIntervention(analysis.intervention);
      }
      if (analysis.learningStyleUpdate) {
        this.updateLearningStyleModel(analysis.learningStyleUpdate);
      }
    } catch (error) {
      console.warn('Immediate feedback analysis failed', error);
    }
  }

  private async flushEvents(): Promise<void> {
    if (this.eventBuffer.length === 0) {
      return;
    }

    const eventsToSend = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      await this.aiService.recordEvent({ events: eventsToSend });
    } catch (error) {
      console.error('Error sending behavior events', error);
      this.eventBuffer.unshift(...eventsToSend);
    }
  }

  private async handleAIMessage(message: AIMessage): Promise<void> {
    switch (message.type) {
      case 'ADAPTIVE_RECOMMENDATION':
        await this.handleAdaptiveRecommendation(message.payload);
        break;
      case 'COGNITIVE_INTERVENTION':
        await this.handleCognitiveIntervention(message.payload);
        break;
      case 'LEARNING_PATH_OPTIMIZATION':
        await this.handleLearningPathOptimization(message.payload);
        break;
      case 'REAL_TIME_ANALYTICS':
        await this.handleRealTimeAnalytics(message.payload);
        break;
      default:
        break;
    }
  }

  private triggerRealTimeIntervention(intervention: InterventionPayload): void {
    this.aiStore.addIntervention(intervention);
  }

  private updateLearningStyleModel(style: string): void {
    this.userStore.setProfile({
      ...(this.userStore.snapshot.profile ?? {}),
      learningStyle: style,
    });
  }

  private async handleAdaptiveRecommendation(payload: unknown): Promise<void> {
    const safePayload = payload as { recommendations?: RecommendationPayload[] };
    if (safePayload.recommendations) {
      this.aiStore.setRecommendations(safePayload.recommendations);
      this.optimizeUXBasedOnRecommendations(safePayload.recommendations);
    }
  }

  private async handleCognitiveIntervention(payload: unknown): Promise<void> {
    const intervention = payload as InterventionPayload;
    this.triggerRealTimeIntervention(intervention);
  }

  private async handleLearningPathOptimization(payload: unknown): Promise<void> {
    const optimization = payload as LearningPathOptimizationPayload;
    this.userStore.setProfile({
      ...(this.userStore.snapshot.profile ?? {}),
      optimizedPath: optimization.sequence,
      optimizationRationale: optimization.rationale,
    });
  }

  private async handleRealTimeAnalytics(payload: unknown): Promise<void> {
    const analytics = payload as RealTimeAnalyticsPayload;
    this.aiStore.addIntervention({
      message: `Engagement score updated: ${analytics.engagementScore.toFixed(2)}`,
      severity: analytics.cognitiveLoad > 0.7 ? 'warning' : 'info',
    });
  }

  private optimizeUXBasedOnRecommendations(recommendations: RecommendationPayload[]): void {
    const topRecommendation = recommendations[0];
    if (!topRecommendation) {
      return;
    }
    this.userStore.setProfile({
      ...(this.userStore.snapshot.profile ?? {}),
      lastRecommendation: topRecommendation.contentId,
    });
  }

  public dispose(): void {
    if (this.flushIntervalHandle) {
      window.clearInterval(this.flushIntervalHandle);
      this.flushIntervalHandle = null;
    }

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }
}

export const useAICoachIntegration = (): AICoachIntegration => {
  const userStore = useInjection<UserStore>(TYPES.UserStore);
  const aiStore = useInjection<AIStore>(TYPES.AIStore);
  const aiService = useInjection<IAICoachService>(TYPES.AICoachService);
  return new AICoachIntegration(userStore, aiStore, aiService);
};
