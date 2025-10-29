import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';

const createMidnightForgeTheme = () => responsiveFontSizes(createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: {
      main: '#f97316',
      dark: '#ea580c',
      light: '#fb923c',
      contrastText: '#140400',
    },
    secondary: {
      main: '#a855f7',
      dark: '#7c3aed',
      light: '#c084fc',
      contrastText: '#16042e',
    },
    success: {
      main: '#22d3ee',
      dark: '#0891b2',
      light: '#67e8f9',
      contrastText: '#03151c',
    },
    warning: {
      main: '#facc15',
      dark: '#ca8a04',
      light: '#fde047',
      contrastText: '#281b00',
    },
    error: {
      main: '#ef4444',
      dark: '#b91c1c',
      light: '#f87171',
      contrastText: '#2f0a0a',
    },
    info: {
      main: '#38bdf8',
      dark: '#0ea5e9',
      light: '#bae6fd',
      contrastText: '#041f2c',
    },
    background: {
      default: '#0b0d14',
      paper: alpha('#131823', 0.92),
    },
    text: {
      primary: '#f8fafc',
      secondary: alpha('#e2e8f0', 0.72),
      disabled: alpha('#e2e8f0', 0.4),
    },
    divider: alpha('#94a3b8', 0.18),
    gradients: {
      primary: 'linear-gradient(130deg, #f97316 0%, #a855f7 48%, #22d3ee 100%)',
      surface: 'linear-gradient(160deg, rgba(10, 10, 18, 0.94) 0%, rgba(20, 24, 37, 0.88) 55%, rgba(124, 58, 237, 0.22) 100%)',
      accent: 'radial-gradient(circle at 18% 24%, rgba(249, 115, 22, 0.28), transparent 60%)',
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
    h4: { fontWeight: 700, fontSize: '1.65rem', letterSpacing: '-0.015em' },
    h5: { fontWeight: 600, fontSize: '1.35rem' },
    h6: { fontWeight: 600, fontSize: '1.15rem' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.05em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minHeight: '100vh',
          backgroundColor: '#090b12',
          backgroundImage:
            'radial-gradient(circle at 10% 8%, rgba(249, 115, 22, 0.14), transparent 48%), radial-gradient(circle at 82% 12%, rgba(34, 211, 238, 0.14), transparent 55%), linear-gradient(140deg, #08090f 0%, #131823 58%, #0f172a 100%)',
          backgroundAttachment: 'fixed',
          color: '#f8fafc',
          transition: 'background 320ms ease',
        },
        '#root': {
          isolation: 'isolate',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.7), rgba(168, 85, 247, 0.6))',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backdropFilter: 'blur(30px)',
          backgroundImage: 'linear-gradient(170deg, rgba(14, 18, 28, 0.96) 0%, rgba(36, 18, 42, 0.82) 100%)',
          borderRadius: 24,
          border: `1px solid ${alpha('#f97316', 0.24)}`,
          boxShadow: '0 28px 72px -40px rgba(0, 0, 0, 0.6)',
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
          border: `1px solid ${alpha('#22d3ee', 0.28)}`,
          backgroundImage:
            'linear-gradient(180deg, rgba(12, 16, 26, 0.92) 0%, rgba(22, 15, 22, 0.78) 64%, rgba(249, 115, 22, 0.18) 120%)',
          boxShadow: '0 32px 80px -46px rgba(0, 0, 0, 0.85)',
          transition: 'transform 220ms ease, box-shadow 260ms ease',
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
          backgroundImage: 'linear-gradient(125deg, #f97316 0%, #a855f7 55%, #22d3ee 100%)',
          boxShadow: '0 26px 56px -30px rgba(249, 115, 22, 0.65)',
          '&:hover': {
            backgroundImage: 'linear-gradient(125deg, #ea580c 0%, #9333ea 55%, #0ea5e9 100%)',
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          borderColor: alpha('#f97316', 0.42),
          '&:hover': {
            borderColor: alpha('#22d3ee', 0.5),
            backgroundColor: alpha('#f97316', 0.1),
          },
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
            background: alpha('#f97316', 0.2),
            color: '#f97316',
          },
          '&:hover': {
            transform: 'translateX(-4px)',
            background: alpha('#22d3ee', 0.18),
          },
        },
      },
    },
  },
}));

export default createMidnightForgeTheme;
