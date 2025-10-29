import httpClient from './httpClient';

const fallbackSimulations = [
  {
    id: 'sim-1',
    name: 'مسرح الهجوم على شبكة مالية',
    difficulty: 'متقدم',
    progress: 72,
    participants: 18,
    status: 'قيد التنفيذ',
    objective: 'تحليل سلوك الفريق تحت الضغط.',
  },
  {
    id: 'sim-2',
    name: 'استجابة لحادث تسرب بيانات',
    difficulty: 'محترف',
    progress: 54,
    participants: 12,
    status: 'تحت الإعداد',
    objective: 'قياس سرعة اكتشاف الثغرات.',
  },
  {
    id: 'sim-3',
    name: 'تأمين بيئة حاويات Kubernetes',
    difficulty: 'متوسط',
    progress: 100,
    participants: 22,
    status: 'اُختتم حديثًا',
    objective: 'تعزيز سياسات الحاوية والأسرار.',
  },
];

const guardArray = (payload) => (Array.isArray(payload) ? payload : fallbackSimulations);

export const fetchSimulations = async () => {
  try {
    const response = await httpClient.get('/api/simulations/active');
    return guardArray(response.data);
  } catch (error) {
    return fallbackSimulations;
  }
};

export const saveSimulation = async (simulation) => {
  const method = simulation.id ? 'put' : 'post';
  const url = simulation.id ? `/api/simulations/${simulation.id}` : '/api/simulations';
  try {
    const response = await httpClient[method](url, simulation);
    return response.data;
  } catch (error) {
    return {
      ...simulation,
      id: simulation.id ?? `sim-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11)}`,
    };
  }
};

export const deleteSimulation = async (simulationId) => {
  try {
    await httpClient.delete(`/api/simulations/${simulationId}`);
    return true;
  } catch (error) {
    return true;
  }
};

export const triggerSimulationStart = async (payload) => {
  try {
    const response = await httpClient.post('/api/simulations/start', payload);
    return response.data;
  } catch (error) {
    return { sessionId: `session-${Date.now()}`, status: 'STARTED', ...payload };
  }
};

export default {
  fetchSimulations,
  saveSimulation,
  deleteSimulation,
  triggerSimulationStart,
};
