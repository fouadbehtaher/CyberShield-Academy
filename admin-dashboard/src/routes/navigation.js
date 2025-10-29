import {
  DashboardOutlined,
  GroupOutlined,
  SchoolOutlined,
  BarChartOutlined,
  AutoAwesomeOutlined,
  SecurityOutlined,
  SettingsOutlined,
  PaletteOutlined,
} from '@mui/icons-material';

export const NAVIGATION_ITEMS = [
  {
    label: 'لوحة التحكم',
    path: '/',
    icon: DashboardOutlined,
    description: 'نظرة عامة على مؤشرات أداء المنصة.'
  },
  {
    label: 'إدارة المستخدمين',
    path: '/users',
    icon: GroupOutlined,
    description: 'إدارة المتعلمين والمدربين وصلاحياتهم.'
  },
  {
    label: 'المحاكاة المتقدمة',
    path: '/simulations',
    icon: SecurityOutlined,
    description: 'رصد جلسات المحاكاة وتكوين السيناريوهات.'
  },
  {
    label: 'مسارات التدريب',
    path: '/courses',
    icon: SchoolOutlined,
    description: 'إدارة المسارات والمحتوى التعليمي.'
  },
  {
    label: 'تحليلات التعلّم',
    path: '/analytics',
    icon: BarChartOutlined,
    description: 'تحليلات متقدمة لمؤشرات النجاح والتقدم.'
  },
  {
    label: 'ذكاء اصطناعي تكيفي',
    path: '/ai',
    icon: AutoAwesomeOutlined,
    description: 'ضبط نماذج الذكاء الاصطناعي وسلوك التوصيات.'
  },
  {
    label: 'مختبر التصميم المتقدم',
    path: '/experience-lab',
    icon: PaletteOutlined,
    description: 'استعرض أنماط الواجهة والقوالب الجاهزة للإطلاق.'
  },
  {
    label: 'الإعدادات المتقدمة',
    path: '/settings',
    icon: SettingsOutlined,
    description: 'سياسات الأمان والتكامل مع الأنظمة الأخرى.'
  }
];

export const findCurrentRoute = (pathname) => NAVIGATION_ITEMS.find((item) => item.path === pathname);
