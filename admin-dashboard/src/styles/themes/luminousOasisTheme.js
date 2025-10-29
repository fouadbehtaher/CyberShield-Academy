import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';

const createLuminousOasisTheme = () => responsiveFontSizes(createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: {
      main: '#0ea5e9',
      dark: '#0369a1',
      light: '#7dd3fc',
      contrastText: '#f8fafc',
    },
    secondary: {
      main: '#ec4899',
      dark: '#be185d',
      light: '#f9a8d4',
      contrastText: '#fff7fb',
    },
    success: {
      main: '#10b981',
      dark: '#047857',
      light: '#6ee7b7',
      contrastText: '#f0fdf4',
    },
    warning: {
      main: '#fbbf24',
      dark: '#d97706',
      light: '#fcd34d',
      contrastText: '#1f1300',
    },
    error: {
      main: '#fb7185',
      dark: '#e11d48',
      light: '#fda4af',
      contrastText: '#2f0610',
    },
    info: {
      main: '#38bdf8',
      dark: '#0284c7',
      light: '#bae6fd',
      contrastText: '#022c46',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffffcc',
    },
    text: {
      primary: '#0f172a',
      secondary: alpha('#334155', 0.72),
      disabled: alpha('#475569', 0.46),
    },
    divider: alpha('#94a3b8', 0.24),
    gradients: {
      primary: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 55%, #ec4899 100%)',
      surface: 'linear-gradient(155deg, rgba(255, 255, 255, 0.9) 0%, rgba(203, 213, 225, 0.4) 100%)',
      accent: 'radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.22), transparent 65%)',
    },
  },
  shape: { borderRadius: 18 },
  spacing: 8,
  typography: {
    fontFamily: '"Cairo", "Tajawal", "Rubik", "Segoe UI", sans-serif',
    h1: { fontWeight: 700, fontSize: '3rem', letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, fontSize: '2.4rem', letterSpacing: '-0.025em' },
    h3: { fontWeight: 600, fontSize: '2rem', letterSpacing: '-0.015em' },
    h4: { fontWeight: 600, fontSize: '1.7rem' },
    h5: { fontWeight: 600, fontSize: '1.35rem' },
    h6: { fontWeight: 600, fontSize: '1.1rem' },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.05em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          backgroundImage:
            'radial-gradient(circle at 12% 18%, rgba(14, 165, 233, 0.18), transparent 45%), radial-gradient(circle at 88% 16%, rgba(236, 72, 153, 0.14), transparent 50%), linear-gradient(135deg, #e0f2fe 0%, #f5f3ff 100%)',
          backgroundAttachment: 'fixed',
          color: '#0f172a',
        },
        '#root': {
          isolation: 'isolate',
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backdropFilter: 'blur(18px)',
          backgroundImage: 'linear-gradient(160deg, rgba(255, 255, 255, 0.94) 0%, rgba(224, 242, 254, 0.82) 100%)',
          borderRadius: 24,
          border: `1px solid ${alpha('#38bdf8', 0.25)}`,
          boxShadow: '0 28px 60px -30px rgba(14, 116, 144, 0.28)',
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 24,
          overflow: 'hidden',
          position: 'relative',
          border: `1px solid ${alpha('#ec4899', 0.2)}`,
          backgroundImage:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(224, 242, 254, 0.82) 55%, rgba(248, 204, 255, 0.6) 120%)',
          boxShadow: '0 30px 72px -32px rgba(148, 163, 184, 0.32)',
          transition: 'transform 220ms ease, box-shadow 220ms ease',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          paddingInline: 24,
          paddingBlock: 10,
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 60%, #ec4899 100%)',
          boxShadow: '0 24px 46px -26px rgba(14, 165, 233, 0.38)',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 60%, #f472b6 100%)',
            boxShadow: '0 34px 68px -30px rgba(59, 130, 246, 0.35)',
          },
        },
      },
    },
  },
}));

export default createLuminousOasisTheme;
