import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';

const createNeoAuroraTheme = () => responsiveFontSizes(createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: {
      main: '#38bdf8',
      dark: '#0ea5e9',
      light: '#7dd3fc',
      contrastText: '#020617',
    },
    secondary: {
      main: '#a855f7',
      dark: '#7e22ce',
      light: '#c084fc',
      contrastText: '#0f172a',
    },
    success: {
      main: '#22d3ee',
      dark: '#0e7490',
      light: '#67e8f9',
      contrastText: '#012a36',
    },
    warning: {
      main: '#fbbf24',
      dark: '#d97706',
      light: '#fcd34d',
      contrastText: '#1f1300',
    },
    error: {
      main: '#f87171',
      dark: '#ef4444',
      light: '#fca5a5',
      contrastText: '#3b0a0a',
    },
    info: {
      main: '#60a5fa',
      dark: '#2563eb',
      light: '#93c5fd',
      contrastText: '#041026',
    },
    background: {
      default: '#020617',
      paper: alpha('#0f172a', 0.74),
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
      disabled: alpha('#cbd5f5', 0.46),
    },
    divider: alpha('#e2e8f0', 0.08),
    gradients: {
      primary: 'linear-gradient(135deg, #38bdf8 0%, #4f46e5 45%, #a855f7 100%)',
      surface: 'linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.68) 100%)',
      accent: 'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.4), transparent 55%)',
    },
  },
  shape: {
    borderRadius: 18,
  },
  spacing: 8,
  typography: {
    fontFamily: '"Cairo", "Tajawal", "Rubik", "Segoe UI", sans-serif',
    h1: { fontWeight: 700, fontSize: '3rem', letterSpacing: '-0.04em' },
    h2: { fontWeight: 700, fontSize: '2.4rem', letterSpacing: '-0.03em' },
    h3: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, fontSize: '1.7rem', letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, fontSize: '1.4rem', letterSpacing: '-0.01em' },
    h6: { fontWeight: 600, fontSize: '1.1rem' },
    subtitle1: { fontWeight: 600, letterSpacing: '-0.005em' },
    subtitle2: { fontWeight: 500, letterSpacing: '-0.005em' },
    body1: { fontWeight: 400, fontSize: '1rem', letterSpacing: '0.01em' },
    body2: { fontWeight: 400, fontSize: '0.95rem', letterSpacing: '0.015em' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.04em' },
    caption: { letterSpacing: '0.08em' },
    overline: { letterSpacing: '0.12em', fontWeight: 600 },
  },
  zIndex: {
    appBar: 1300,
    drawer: 1200,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*::-webkit-scrollbar': {
          width: 10,
          height: 10,
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.6), rgba(168, 85, 247, 0.6))',
          borderRadius: 999,
        },
        body: {
          margin: 0,
          minHeight: '100vh',
          backgroundColor: '#020617',
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.12), transparent 40%), radial-gradient(circle at 80% 10%, rgba(168, 85, 247, 0.14), transparent 42%), linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)',
          backgroundAttachment: 'fixed',
          color: '#e2e8f0',
          transition: 'background 300ms ease',
        },
        '#root': {
          isolation: 'isolate',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backdropFilter: 'blur(22px)',
          backgroundImage: 'linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.78) 100%)',
          borderRadius: 24,
          border: `1px solid ${alpha('#38bdf8', 0.1)}`,
          boxShadow: '0 24px 48px -32px rgba(15, 23, 42, 0.8)',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 24,
          border: `1px solid ${alpha('#38bdf8', 0.14)}`,
          backgroundImage:
            'linear-gradient(160deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.72) 60%, rgba(8, 145, 178, 0.16) 120%)',
          boxShadow: '0 24px 48px -34px rgba(15, 23, 42, 0.9)',
          transition: 'transform 180ms ease, box-shadow 220ms ease',
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
          paddingInline: 24,
          paddingBlock: 10,
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(120deg, #38bdf8 0%, #6366f1 100%)',
          boxShadow: '0 20px 35px -20px rgba(99, 102, 241, 0.7)',
          '&:hover': {
            backgroundImage: 'linear-gradient(120deg, #22d3ee 0%, #7c3aed 100%)',
            boxShadow: '0 30px 60px -24px rgba(124, 58, 237, 0.55)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          fontWeight: 600,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          marginBlock: 4,
          transition: 'background 180ms ease, transform 180ms ease',
          '&.Mui-selected': {
            background: alpha('#38bdf8', 0.16),
            color: '#38bdf8',
          },
          '&:hover': {
            transform: 'translateX(-4px)',
            background: alpha('#38bdf8', 0.12),
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          height: 8,
        },
        bar: {
          borderRadius: 999,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: alpha('#1f2937', 0.6),
          padding: 4,
        },
        indicator: {
          height: '100%',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 100%)',
        },
      },
    },
  },
}));

export default createNeoAuroraTheme;
