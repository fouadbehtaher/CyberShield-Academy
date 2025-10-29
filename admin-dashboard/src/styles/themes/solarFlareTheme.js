import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';

const createSolarFlareTheme = () => responsiveFontSizes(createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: {
      main: '#f97316',
      dark: '#c2410c',
      light: '#fb923c',
      contrastText: '#1b0a02',
    },
    secondary: {
      main: '#facc15',
      dark: '#ca8a04',
      light: '#fde047',
      contrastText: '#1f1500',
    },
    success: {
      main: '#4ade80',
      dark: '#15803d',
      light: '#86efac',
      contrastText: '#03210d',
    },
    warning: {
      main: '#fb923c',
      dark: '#ea580c',
      light: '#fdba74',
      contrastText: '#2c1100',
    },
    error: {
      main: '#f87171',
      dark: '#ef4444',
      light: '#fca5a5',
      contrastText: '#360808',
    },
    info: {
      main: '#38bdf8',
      dark: '#0ea5e9',
      light: '#7dd3fc',
      contrastText: '#02141f',
    },
    background: {
      default: '#120708',
      paper: alpha('#2d0706', 0.82),
    },
    text: {
      primary: '#fff7ed',
      secondary: alpha('#fde68a', 0.86),
      disabled: alpha('#facc15', 0.4),
    },
    divider: alpha('#fdba74', 0.12),
    gradients: {
      primary: 'linear-gradient(135deg, #f97316 0%, #ef4444 45%, #facc15 100%)',
      surface: 'linear-gradient(150deg, rgba(33, 13, 4, 0.94) 0%, rgba(71, 10, 12, 0.74) 100%)',
      accent: 'radial-gradient(circle at 20% 18%, rgba(251, 191, 36, 0.4), transparent 55%)',
    },
  },
  shape: {
    borderRadius: 18,
  },
  spacing: 8,
  typography: {
    fontFamily: '"Cairo", "Tajawal", "Rubik", "Segoe UI", sans-serif',
    h1: { fontWeight: 700, fontSize: '3rem', letterSpacing: '-0.035em' },
    h2: { fontWeight: 700, fontSize: '2.4rem', letterSpacing: '-0.03em' },
    h3: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, fontSize: '1.7rem', letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, fontSize: '1.4rem', letterSpacing: '-0.01em' },
    h6: { fontWeight: 600, fontSize: '1.1rem' },
    subtitle1: { fontWeight: 600, letterSpacing: '-0.005em' },
    subtitle2: { fontWeight: 500, letterSpacing: '-0.005em' },
    body1: { fontWeight: 400, fontSize: '1rem', letterSpacing: '0.01em' },
    body2: { fontWeight: 400, fontSize: '0.95rem', letterSpacing: '0.015em' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.045em' },
    caption: { letterSpacing: '0.08em' },
    overline: { letterSpacing: '0.12em', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minHeight: '100vh',
          backgroundColor: '#120708',
          backgroundImage:
            'radial-gradient(circle at 18% 15%, rgba(251, 191, 36, 0.18), transparent 45%), radial-gradient(circle at 80% 12%, rgba(248, 113, 113, 0.22), transparent 55%), linear-gradient(135deg, #120708 0%, #24090a 48%, #3b0708 100%)',
          backgroundAttachment: 'fixed',
          color: '#fff7ed',
          transition: 'background 320ms ease',
        },
        '#root': {
          isolation: 'isolate',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.7), rgba(250, 204, 21, 0.6))',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backdropFilter: 'blur(24px)',
          backgroundImage: 'linear-gradient(150deg, rgba(34, 13, 4, 0.94) 0%, rgba(76, 11, 12, 0.78) 100%)',
          borderRadius: 26,
          border: `1px solid ${alpha('#f97316', 0.26)}`,
          boxShadow: '0 28px 62px -38px rgba(36, 8, 8, 0.92)',
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
          borderRadius: 26,
          border: `1px solid ${alpha('#f97316', 0.3)}`,
          backgroundImage:
            'linear-gradient(175deg, rgba(33, 13, 4, 0.94) 0%, rgba(76, 11, 12, 0.74) 60%, rgba(251, 191, 36, 0.22) 120%)',
          boxShadow: '0 30px 64px -38px rgba(36, 8, 8, 0.96)',
          transition: 'transform 200ms ease, box-shadow 240ms ease',
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
          paddingInline: 26,
          paddingBlock: 11,
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(125deg, #f97316 0%, #ef4444 50%, #facc15 100%)',
          boxShadow: '0 24px 44px -24px rgba(239, 68, 68, 0.65)',
          '&:hover': {
            backgroundImage: 'linear-gradient(125deg, #fb923c 0%, #f87171 50%, #fde047 100%)',
            boxShadow: '0 36px 68px -30px rgba(251, 191, 36, 0.55)',
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          borderColor: alpha('#f97316', 0.6),
          '&:hover': {
            borderWidth: 2,
            borderColor: alpha('#facc15', 0.6),
            backgroundColor: alpha('#f97316', 0.14),
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
          backdropFilter: 'blur(14px)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          marginBlock: 5,
          transition: 'background 200ms ease, transform 200ms ease',
          '&.Mui-selected': {
            background: alpha('#f97316', 0.22),
            color: '#f97316',
          },
          '&:hover': {
            transform: 'translateX(-6px)',
            background: alpha('#facc15', 0.16),
          },
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
          backgroundImage: 'linear-gradient(135deg, #f97316 0%, #ef4444 55%, #facc15 100%)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: alpha('#2d0706', 0.75),
          padding: 4,
        },
        indicator: {
          height: '100%',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #f97316 0%, #facc15 100%)',
        },
      },
    },
  },
}));

export default createSolarFlareTheme;
