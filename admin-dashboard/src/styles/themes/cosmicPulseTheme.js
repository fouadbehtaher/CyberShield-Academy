import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';

const createCosmicPulseTheme = () => responsiveFontSizes(createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: {
      main: '#22d3ee',
      dark: '#0f7caa',
      light: '#67e8f9',
      contrastText: '#03131f',
    },
    secondary: {
      main: '#f472b6',
      dark: '#db2777',
      light: '#fbb6ce',
      contrastText: '#2f1021',
    },
    success: {
      main: '#34d399',
      dark: '#0f9d58',
      light: '#6ee7b7',
      contrastText: '#022d1b',
    },
    warning: {
      main: '#fb923c',
      dark: '#ea580c',
      light: '#fdba74',
      contrastText: '#2f1100',
    },
    error: {
      main: '#f87171',
      dark: '#ef4444',
      light: '#fca5a5',
      contrastText: '#360808',
    },
    info: {
      main: '#818cf8',
      dark: '#4f46e5',
      light: '#a5b4fc',
      contrastText: '#0a1028',
    },
    background: {
      default: '#050516',
      paper: alpha('#0b102b', 0.82),
    },
    text: {
      primary: '#f8fafc',
      secondary: alpha('#cbd5f5', 0.86),
      disabled: alpha('#e2e8f0', 0.4),
    },
    divider: alpha('#e2e8f0', 0.08),
    gradients: {
      primary: 'linear-gradient(135deg, #22d3ee 0%, #7c3aed 45%, #f472b6 100%)',
      surface: 'linear-gradient(160deg, rgba(7, 12, 35, 0.92) 0%, rgba(24, 7, 45, 0.74) 100%)',
      accent: 'radial-gradient(circle at 25% 20%, rgba(130, 87, 230, 0.42), transparent 55%)',
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
          backgroundColor: '#050516',
          backgroundImage:
            'radial-gradient(circle at 15% 10%, rgba(129, 140, 248, 0.18), transparent 48%), radial-gradient(circle at 82% 12%, rgba(244, 114, 182, 0.14), transparent 52%), linear-gradient(135deg, #050516 0%, #0b102b 55%, #130720 100%)',
          backgroundAttachment: 'fixed',
          color: '#f8fafc',
          transition: 'background 320ms ease',
        },
        '#root': {
          isolation: 'isolate',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'linear-gradient(180deg, rgba(129, 140, 248, 0.7), rgba(244, 114, 182, 0.6))',
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
          backgroundImage: 'linear-gradient(150deg, rgba(9, 16, 40, 0.92) 0%, rgba(37, 8, 55, 0.78) 100%)',
          borderRadius: 26,
          border: `1px solid ${alpha('#22d3ee', 0.22)}`,
          boxShadow: '0 28px 62px -36px rgba(10, 12, 38, 0.92)',
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
          border: `1px solid ${alpha('#22d3ee', 0.28)}`,
          backgroundImage:
            'linear-gradient(175deg, rgba(9, 16, 40, 0.94) 0%, rgba(37, 8, 55, 0.74) 60%, rgba(18, 191, 203, 0.22) 120%)',
          boxShadow: '0 28px 60px -36px rgba(9, 10, 38, 0.96)',
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
          backgroundImage: 'linear-gradient(125deg, #22d3ee 0%, #7c3aed 55%, #f472b6 100%)',
          boxShadow: '0 22px 40px -22px rgba(124, 58, 237, 0.6)',
          '&:hover': {
            backgroundImage: 'linear-gradient(125deg, #67e8f9 0%, #a855f7 55%, #fb7185 100%)',
            boxShadow: '0 34px 68px -28px rgba(244, 114, 182, 0.6)',
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          borderColor: alpha('#22d3ee', 0.6),
          '&:hover': {
            borderWidth: 2,
            borderColor: alpha('#f472b6', 0.6),
            backgroundColor: alpha('#22d3ee', 0.12),
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
            background: alpha('#22d3ee', 0.2),
            color: '#22d3ee',
          },
          '&:hover': {
            transform: 'translateX(-6px)',
            background: alpha('#f472b6', 0.14),
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
          backgroundImage: 'linear-gradient(135deg, #22d3ee 0%, #7c3aed 55%, #f472b6 100%)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: alpha('#0b102b', 0.72),
          padding: 4,
        },
        indicator: {
          height: '100%',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #22d3ee 0%, #7c3aed 100%)',
        },
      },
    },
  },
}));

export default createCosmicPulseTheme;
