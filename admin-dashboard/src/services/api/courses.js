import httpClient from './httpClient';

const fallbackCourses = [
  {
    id: 'course-1',
    title: 'استراتيجيات الدفاع المتقدم',
    level: 'محترف',
    duration: '12 ساعة تدريبية',
    objectives: ['تقوية أنظمة كشف التسلل', 'إدارة استجابة للحوادث متعددة الفرق'],
    description: 'برنامج مكثف يركز على بناء دفاعات متكاملة ضد التهديدات المتقدمة.',
  },
  {
    id: 'course-2',
    title: 'الهندسة الاجتماعية المضادة',
    level: 'متوسط',
    duration: '8 ساعات تدريبية',
    objectives: ['تصميم حملات توعوية', 'تحليل أنماط الاحتيال البشري'],
    description: 'يعلّم الفرق كيفية التصدي للهندسة الاجتماعية عبر سيناريوهات واقعية.',
  },
  {
    id: 'course-3',
    title: 'أمن الحوسبة السحابية',
    level: 'متقدم',
    duration: '10 ساعات تدريبية',
    objectives: ['إعداد سياسات الهوية والوصول', 'تطبيق أفضل ممارسات Zero Trust'],
    description: 'مسار عملي لتأمين بيئات Kubernetes وخدمات السحابة العامة.',
  },
];

const guardArray = (payload) => (Array.isArray(payload) && payload.length ? payload : fallbackCourses);

const normalizeModule = (module) => ({
  id: module.id ?? `course-${module.slug ?? module.title}`,
  title: module.title ?? module.name,
  level: module.level ?? module.difficulty ?? 'متوسط',
  duration: module.duration ?? module.estimatedHours ?? '8 ساعات تدريبية',
  objectives: module.objectives ?? module.learningObjectives ?? [],
  description: module.description ?? module.summary ?? '',
});

export const fetchCourses = async () => {
  try {
    const response = await httpClient.get('/api/content/modules');
    const modules = guardArray(response.data);
    return modules.map(normalizeModule);
  } catch (error) {
    return fallbackCourses;
  }
};

export const createCourse = async (course) => {
  try {
    const response = await httpClient.post('/api/content/modules', course);
    return normalizeModule(response.data);
  } catch (error) {
    return { ...course, id: `course-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11)}` };
  }
};

export const updateCourse = async (courseId, payload) => {
  try {
    const response = await httpClient.put(`/api/content/modules/${courseId}`, payload);
    return normalizeModule(response.data);
  } catch (error) {
    return { id: courseId, ...payload };
  }
};

export const deleteCourse = async (courseId) => {
  try {
    await httpClient.delete(`/api/content/modules/${courseId}`);
    return true;
  } catch (error) {
    return true;
  }
};

export default {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
