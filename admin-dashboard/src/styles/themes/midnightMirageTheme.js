import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';

const createMidnightMirageTheme = () => responsiveFontSizes(createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: {
      main: '#7dd3fc',
      dark: '#0f172a',
      light: '#bae6fd',
      contrastText: '#030712',
    },
    secondary: {
      main: '#facc15',
      dark: '#CA8A04',
      light: '#FEF08A',
      contrastText: '#0a0900',
    },
    success: {
      main: '#4ade80',
      dark: '#15803d',
      light: '#bbf7d0',
      contrastText: '#02130a',
    },
    warning: {
      main: '#fb923c',
      dark: '#ea580c',
      light: '#fed7aa',
      contrastText: '#2f1100',
    },
    error: {
      main: '#f97316',
      dark: '#c2410c',
      light: '#fdba74',
      contrastText: '#2b0a01',
    },
    info: {
      main: '#86efac',
      dark: '#16a34a',
      light: '#dcfce7',
      contrastText: '#03120a',
    },
    background: {
      default: '#020617',
      paper: alpha('#0f172a', 0.85),
    },
    text: {
      primary: '#f8fafc',
      secondary: alpha('#cbd5f5', 0.84),
      disabled: alpha('#cbd5f5', 0.38),
    },
    divider: alpha('#94a3b8', 0.16),
    gradients: {
      primary: 'linear-gradient(140deg, #7dd3fc 0%, #facc15 45%, #fb923c 100%)',
      surface: 'linear-gradient(120deg, rgba(15, 23, 42, 0.92) 0%, rgba(47, 17, 0, 0.78) 100%)',
      accent: 'radial-gradient(circle at 25% 25%, rgba(125, 211, 252, 0.35), transparent 60%)',
    },
  },
  shape: { borderRadius: 20 },
  spacing: 8,
  typography: {
    fontFamily: '"Cairo", "Tajawal", "Rubik", "Segoe UI", sans-serif',
    h1: { fontWeight: 700, fontSize: '3rem', letterSpacing: '-0.035em' },
    h2: { fontWeight: 700, fontSize: '2.35rem', letterSpacing: '-0.03em' },
    h3: { fontWeight: 600, fontSize: '2rem', letterSpacing: '-0.02em' },
    h4: { fontWeight: 600, fontSize: '1.7rem', letterSpacing: '-0.015em' },
    h5: { fontWeight: 600, fontSize: '1.4rem' },
    h6: { fontWeight: 600, fontSize: '1.1rem' },
    subtitle1: { fontWeight: 600, letterSpacing: '-0.004em' },
    subtitle2: { fontWeight: 500, letterSpacing: '-0.003em' },
    body1: { fontWeight: 400, fontSize: '1rem', letterSpacing: '0.01em' },
    body2: { fontWeight: 400, fontSize: '0.95rem', letterSpacing: '0.012em' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.04em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minHeight: '100vh',
          backgroundColor: '#020617',
          backgroundImage:
            'radial-gradient(circle at 12% 16%, rgba(125, 211, 252, 0.18), transparent 52%), radial-gradient(circle at 80% 18%, rgba(250, 204, 21, 0.16), transparent 54%), linear-gradient(145deg, #020617 0%, #0f172a 58%, #111827 100%)',
          backgroundAttachment: 'fixed',
          color: '#f8fafc',
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
          backdropFilter: 'blur(20px)',
          backgroundImage: 'linear-gradient(160deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 64, 175, 0.62) 100%)',
          borderRadius: 26,
          border: `1px solid ${alpha('#38bdf8', 0.28)}`,
          boxShadow: '0 26px 70px -30px rgba(2, 6, 23, 0.8)',
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 26,
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${alpha('#facc15', 0.24)}`,
          backgroundImage:
            'linear-gradient(175deg, rgba(2, 6, 23, 0.92) 0%, rgba(14, 116, 144, 0.6) 55%, rgba(250, 204, 21, 0.18) 110%)',
          boxShadow: '0 30px 68px -32px rgba(8, 47, 73, 0.88)',
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
          paddingInline: 26,
          paddingBlock: 11,
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(130deg, #7dd3fc 0%, #facc15 55%, #fb923c 100%)',
          boxShadow: '0 24px 44px -26px rgba(250, 204, 21, 0.45)',
          '&:hover': {
            backgroundImage: 'linear-gradient(130deg, #bae6fd 0%, #fde68a 55%, #fdba74 100%)',
            boxShadow: '0 34px 72px -30px rgba(251, 146, 60, 0.55)',
          },
        },
      },
    },
  },
}));

export default createMidnightMirageTheme;
