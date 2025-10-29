import 'reflect-metadata';

import axios, { AxiosInstance } from 'axios';
import { Container, interfaces } from 'inversify';
import React, { PropsWithChildren, createContext, useContext } from 'react';

export const TYPES = {
    LearningPathService: Symbol.for('LearningPathService'),
    SimulationService: Symbol.for('SimulationService'),
    AICoachService: Symbol.for('AICoachService'),
    HttpClient: Symbol.for('HttpClient'),
    WebSocketService: Symbol.for('WebSocketService'),
    UserStore: Symbol.for('UserStore'),
    SimulationStore: Symbol.for('SimulationStore'),
    AIStore: Symbol.for('AIStore'),
} as const;

type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends Record<string, unknown> ? DeepReadonly<T[K]> : T[K];
};

export interface IHttpClient {
    get<T>(url: string): Promise<T>;
    post<T>(url: string, body?: unknown): Promise<T>;
    patch<T>(url: string, body?: unknown): Promise<T>;
}

export interface IWebSocketService {
    connect(url: string): WebSocket;
}

export interface ILearningPathService {
    fetchLearningPath(userId: string): Promise<unknown>;
}

export interface ISimulationService {
    startSimulation(payload: Record<string, unknown>): Promise<unknown>;
    fetchSimulationState(simulationId: string): Promise<unknown>;
}

export interface IAICoachService {
    getRecommendations(userId: string): Promise<unknown>;
    recordEvent(event: Record<string, unknown>): Promise<void>;
}

class AxiosHttpClient implements IHttpClient {
    private readonly client: AxiosInstance;

    constructor() {
        this.client = axios.create({ baseURL: process.env.REACT_APP_API_URL });
    }

    async get<T>(url: string): Promise<T> {
        const response = await this.client.get<T>(url);
        return response.data;
    }

    async post<T>(url: string, body?: unknown): Promise<T> {
        const response = await this.client.post<T>(url, body);
        return response.data;
    }

    async patch<T>(url: string, body?: unknown): Promise<T> {
        const response = await this.client.patch<T>(url, body);
        return response.data;
    }
}

class WebSocketService implements IWebSocketService {
    connect(url: string): WebSocket {
        return new WebSocket(url);
    }
}

class LearningPathService implements ILearningPathService {
    constructor(private readonly httpClient: IHttpClient) {}

    fetchLearningPath(userId: string): Promise<unknown> {
        return this.httpClient.get(`/learning-paths/${userId}`);
    }
}

class SimulationService implements ISimulationService {
    constructor(private readonly httpClient: IHttpClient) {}

    startSimulation(payload: Record<string, unknown>): Promise<unknown> {
        return this.httpClient.post('/simulations/start', payload);
    }

    fetchSimulationState(simulationId: string): Promise<unknown> {
        return this.httpClient.get(`/simulations/${simulationId}`);
    }
}

class AICoachService implements IAICoachService {
    constructor(private readonly httpClient: IHttpClient) {}

    getRecommendations(userId: string): Promise<unknown> {
        return this.httpClient.get(`/ai/recommendations/${userId}`);
    }

    async recordEvent(event: Record<string, unknown>): Promise<void> {
        await this.httpClient.post('/ai/events', event);
    }
}

type Listener<T> = (state: DeepReadonly<T>) => void;

class ObservableStore<TState extends Record<string, unknown>> {
    protected state: TState;
    private listeners: Set<Listener<TState>> = new Set();

    constructor(initialState: TState) {
        this.state = initialState;
    }

    protected setState(partial: Partial<TState>): void {
        this.state = { ...this.state, ...partial } as TState;
        this.listeners.forEach((listener) => listener(Object.freeze({ ...this.state })));
    }

    subscribe(listener: Listener<TState>): () => void {
        this.listeners.add(listener);
        listener(Object.freeze({ ...this.state }));
        return () => this.listeners.delete(listener);
    }

    get snapshot(): DeepReadonly<TState> {
        return Object.freeze({ ...this.state }) as DeepReadonly<TState>;
    }
}

type UserProfileState = {
    profile: Record<string, unknown> | null;
    currentSession: { id: string } | null;
};

export class UserStore extends ObservableStore<UserProfileState> {
    constructor() {
        super({ profile: null, currentSession: null });
    }

    setProfile(profile: Record<string, unknown>): void {
        this.setState({ profile });
    }

    setCurrentSession(session: { id: string } | null): void {
        this.setState({ currentSession: session });
    }
}

type SimulationState = {
    activeSimulation: Record<string, unknown> | null;
    networkEvents: Array<Record<string, unknown>>;
};

export class SimulationStore extends ObservableStore<SimulationState> {
    constructor() {
        super({ activeSimulation: null, networkEvents: [] });
    }

    setActiveSimulation(simulation: Record<string, unknown> | null): void {
        this.setState({ activeSimulation: simulation });
    }

    addNetworkEvent(event: Record<string, unknown>): void {
        this.setState({ networkEvents: [...this.state.networkEvents, event] });
    }
}

type AIState = {
    recommendations: Array<Record<string, unknown>>;
    interventions: Array<Record<string, unknown>>;
};

export class AIStore extends ObservableStore<AIState> {
    constructor() {
        super({ recommendations: [], interventions: [] });
    }

    setRecommendations(recommendations: Array<Record<string, unknown>>): void {
        this.setState({ recommendations });
    }

    addIntervention(intervention: Record<string, unknown>): void {
        this.setState({ interventions: [...this.state.interventions, intervention] });
    }
}

let container: Container | null = null;

const bindContainer = (target: Container) => {
    if (target.isBound(TYPES.HttpClient)) {
        return;
    }

    target.bind<IHttpClient>(TYPES.HttpClient).to(AxiosHttpClient).inSingletonScope();
    target.bind<IWebSocketService>(TYPES.WebSocketService).to(WebSocketService).inSingletonScope();

    target.bind<ILearningPathService>(TYPES.LearningPathService)
        .toDynamicValue((context) => new LearningPathService(context.container.get(TYPES.HttpClient)))
        .inSingletonScope();

    target.bind<ISimulationService>(TYPES.SimulationService)
        .toDynamicValue((context) => new SimulationService(context.container.get(TYPES.HttpClient)))
        .inSingletonScope();

    target.bind<IAICoachService>(TYPES.AICoachService)
        .toDynamicValue((context) => new AICoachService(context.container.get(TYPES.HttpClient)))
        .inSingletonScope();

    target.bind<UserStore>(TYPES.UserStore).to(UserStore).inSingletonScope();
    target.bind<SimulationStore>(TYPES.SimulationStore).to(SimulationStore).inSingletonScope();
    target.bind<AIStore>(TYPES.AIStore).to(AIStore).inSingletonScope();
};

export const getContainer = (): Container => {
    if (!container) {
        container = new Container();
        bindContainer(container);
    }
    return container;
};

export const InjectionContext = createContext<Container | null>(null);

export const InjectionProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const ctx = getContainer();
    return (
        <InjectionContext.Provider value={ctx}>
            {children}
        </InjectionContext.Provider>
    );
};

export const useInjection = <T,>(identifier: interfaces.ServiceIdentifier<T>): T => {
    const ctx = useContext(InjectionContext);
    if (!ctx) {
        throw new Error('Attempted to use dependency injection outside of provider');
    }
    return ctx.get(identifier);
};

export const useStores = () => {
    const ctx = useContext(InjectionContext);
    if (!ctx) {
        throw new Error('Attempted to access stores outside of InjectionProvider');
    }

    return {
        userStore: ctx.get<UserStore>(TYPES.UserStore),
        simulationStore: ctx.get<SimulationStore>(TYPES.SimulationStore),
        aiStore: ctx.get<AIStore>(TYPES.AIStore),
    };
};
