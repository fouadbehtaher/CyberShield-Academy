import httpClient from './httpClient';

const fallbackUsers = [
  { id: 'user-1', name: 'أحمد المنصوري', role: 'مدرب', active: true, skillFocus: 'التحليل الجنائي', email: 'ahmad@cybershield.academy' },
  { id: 'user-2', name: 'ليان السبيعي', role: 'متعلم', active: true, skillFocus: 'الهندسة الاجتماعية', email: 'lian@cybershield.academy' },
  { id: 'user-3', name: 'سلمان العتيبي', role: 'متعلم', active: false, skillFocus: 'حماية الشبكات', email: 'salman@cybershield.academy' },
  { id: 'user-4', name: 'نورة المطيري', role: 'مشرفة', active: true, skillFocus: 'الذكاء الاصطناعي الأمني', email: 'noura@cybershield.academy' },
];

const guardArray = (payload) => (Array.isArray(payload) ? payload : fallbackUsers);

export const fetchUsers = async () => {
  try {
    const response = await httpClient.get('/api/users');
    return guardArray(response.data);
  } catch (error) {
    return fallbackUsers;
  }
};

export const createUser = async (user) => {
  try {
    const response = await httpClient.post('/api/users', user);
    return response.data;
  } catch (error) {
    return { ...user, id: `user-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11)}` };
  }
};

export const updateUser = async (userId, payload) => {
  try {
    const response = await httpClient.put(`/api/users/${userId}`, payload);
    return response.data;
  } catch (error) {
    return { id: userId, ...payload };
  }
};

export const deleteUser = async (userId) => {
  try {
    await httpClient.delete(`/api/users/${userId}`);
    return true;
  } catch (error) {
    return true;
  }
};

export default {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
};
