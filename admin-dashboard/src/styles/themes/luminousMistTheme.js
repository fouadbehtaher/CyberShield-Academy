import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';

const createLuminousMistTheme = () => responsiveFontSizes(createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      dark: '#1e40af',
      light: '#60a5fa',
      contrastText: '#fdfeff',
    },
    secondary: {
      main: '#10b981',
      dark: '#047857',
      light: '#6ee7b7',
      contrastText: '#041b13',
    },
    success: {
      main: '#0ea5e9',
      dark: '#0369a1',
      light: '#38bdf8',
      contrastText: '#011d2d',
    },
    warning: {
      main: '#f97316',
      dark: '#c2410c',
      light: '#fbbf24',
      contrastText: '#200c00',
    },
    error: {
      main: '#fb7185',
      dark: '#e11d48',
      light: '#fda4af',
      contrastText: '#32010a',
    },
    info: {
      main: '#6366f1',
      dark: '#4338ca',
      light: '#a5b4fc',
      contrastText: '#0c0f31',
    },
    background: {
      default: '#f9fbff',
      paper: alpha('#ffffff', 0.92),
    },
    text: {
      primary: '#0f172a',
      secondary: alpha('#1e293b', 0.76),
      disabled: alpha('#1e293b', 0.44),
    },
    divider: alpha('#0f172a', 0.08),
    gradients: {
      primary: 'linear-gradient(135deg, #60a5fa 0%, #a5b4fc 62%, #6ee7b7 100%)',
      surface: 'linear-gradient(150deg, rgba(255, 255, 255, 0.82) 0%, rgba(208, 230, 255, 0.64) 100%)',
      accent: 'radial-gradient(circle at 20% 20%, rgba(96, 165, 250, 0.18), transparent 60%)',
    },
  },
  shape: {
    borderRadius: 20,
  },
  spacing: 8,
  typography: {
    fontFamily: '"Cairo", "Tajawal", "Rubik", "Segoe UI", sans-serif',
    h1: { fontWeight: 700, fontSize: '3rem', letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, fontSize: '2.4rem', letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.015em' },
    h4: { fontWeight: 600, fontSize: '1.7rem' },
    h5: { fontWeight: 600, fontSize: '1.35rem' },
    h6: { fontWeight: 600, fontSize: '1.1rem' },
    subtitle1: { fontWeight: 600, letterSpacing: '-0.005em' },
    subtitle2: { fontWeight: 500, letterSpacing: '-0.003em' },
    body1: { fontWeight: 400, fontSize: '1rem', letterSpacing: '0.01em' },
    body2: { fontWeight: 400, fontSize: '0.94rem', letterSpacing: '0.012em' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.04em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minHeight: '100vh',
          backgroundColor: '#f1f5ff',
          backgroundImage:
            'radial-gradient(circle at 12% 12%, rgba(95, 210, 250, 0.18), transparent 52%), radial-gradient(circle at 82% 18%, rgba(126, 186, 255, 0.16), transparent 50%), linear-gradient(135deg, #f8fbff 0%, #e2f1ff 55%, #f5fff9 100%)',
          backgroundAttachment: 'fixed',
          color: '#0f172a',
          transition: 'background 320ms ease',
        },
        '#root': {
          isolation: 'isolate',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(180deg, rgba(96, 165, 250, 0.6), rgba(16, 185, 129, 0.4))',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backdropFilter: 'blur(18px)',
          backgroundImage: 'linear-gradient(150deg, rgba(255, 255, 255, 0.86) 0%, rgba(226, 240, 255, 0.72) 100%)',
          borderRadius: 28,
          border: `1px solid ${alpha('#60a5fa', 0.28)}`,
          boxShadow: '0 28px 68px -42px rgba(15, 23, 42, 0.2)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 28,
          paddingBlock: 12,
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(120deg, #2563eb 0%, #6366f1 60%, #10b981 100%)',
          boxShadow: '0 24px 48px -30px rgba(37, 99, 235, 0.46)',
          '&:hover': {
            backgroundImage: 'linear-gradient(120deg, #1d4ed8 0%, #4f46e5 60%, #0f766e 100%)',
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          borderColor: alpha('#2563eb', 0.5),
          '&:hover': {
            borderColor: alpha('#10b981', 0.6),
            backgroundColor: alpha('#2563eb', 0.08),
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          marginBlock: 5,
          '&.Mui-selected': {
            background: alpha('#2563eb', 0.18),
            color: '#1e3a8a',
          },
          '&:hover': {
            background: alpha('#2563eb', 0.12),
          },
        },
      },
    },
  },
}));

export default createLuminousMistTheme;
