import { createTheme, ThemeOptions } from '@mui/material/styles';

// ============================================================
// STRIDE MUI Theme
// Built on Unit Mobile Design System tokens
// Font: DM Sans (Google Fonts)
// ============================================================

const strideTokens = {
  // Colors
  bgCanvas:      '#FAFAFA',
  bgSurface:     '#FFFFFF',
  bgSubtle:      '#F3F4F6',
  bgMuted:       '#E5E7EB',

  fgPrimary:     '#111827',
  fgSecondary:   '#374151',
  fgMuted:       '#6B7280',

  borderDefault: '#E5E7EB',
  borderStrong:  '#D1D5DB',

  action:        '#2563EB',
  actionHover:   '#1D4ED8',

  success:       '#16A34A',
  error:         '#DC2626',
  warning:       '#D97706',

  // Dark mode
  darkBgCanvas:  '#0B0F1A',
  darkBgSurface: '#131A2A',
  darkFgPrimary: '#F8FAFC',
  darkAction:    '#3B82F6',

  // Font
  fontSans: "'DM Sans', system-ui, -apple-system, sans-serif",

  // Border radii
  radiusXs:  '6px',
  radiusSm:  '8px',
  radiusMd:  '12px',
  radiusLg:  '16px',
  radiusXl:  '20px',
  radiusPill:'999px',
};

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? strideTokens.darkAction : strideTokens.action,
      dark: strideTokens.actionHover,
    },
    secondary: {
      main: strideTokens.fgSecondary,
    },
    background: {
      default: mode === 'dark' ? strideTokens.darkBgCanvas  : strideTokens.bgCanvas,
      paper:   mode === 'dark' ? strideTokens.darkBgSurface : strideTokens.bgSurface,
    },
    text: {
      primary:   mode === 'dark' ? strideTokens.darkFgPrimary : strideTokens.fgPrimary,
      secondary: mode === 'dark' ? '#CBD5E1'                  : strideTokens.fgSecondary,
      disabled:  mode === 'dark' ? '#64748B'                  : strideTokens.fgMuted,
    },
    divider: mode === 'dark' ? 'rgba(148,163,184,0.16)' : strideTokens.borderDefault,
    error:   { main: strideTokens.error },
    warning: { main: strideTokens.warning },
    success: { main: strideTokens.success },
  },
  typography: {
    fontFamily: strideTokens.fontSans,
    fontWeightLight:   400,
    fontWeightRegular: 400,
    fontWeightMedium:  500,
    fontWeightBold:    700,
    h1: { fontSize: '28px', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-.02em' },
    h2: { fontSize: '24px', fontWeight: 700, lineHeight: 1.35 },
    h3: { fontSize: '20px', fontWeight: 600, lineHeight: 1.35 },
    h4: { fontSize: '16px', fontWeight: 600, lineHeight: 1.35 },
    h5: { fontSize: '14px', fontWeight: 600 },
    h6: { fontSize: '12px', fontWeight: 600 },
    body1: { fontSize: '16px', lineHeight: 1.5 },
    body2: { fontSize: '14px', lineHeight: 1.5 },
    caption: { fontSize: '12px', lineHeight: 1.5 },
    button: { fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' },
  },
  shape: {
    borderRadius: 8, // = --radius-sm; override per-component
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',  // 1 — subtle
    '0 2px 8px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',  // 2 — card
    '0 4px 16px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)', // 3 — medium
    '0 10px 30px rgba(0,0,0,0.14), 0 4px 10px rgba(0,0,0,0.08)',// 4 — strong
    // remaining required by MUI (fill with the same strong)
    ...Array(20).fill('0 10px 30px rgba(0,0,0,0.14), 0 4px 10px rgba(0,0,0,0.08)'),
  ] as ThemeOptions['shadows'],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: strideTokens.fontSans,
          fontWeight: 600,
          borderRadius: strideTokens.radiusSm,
          textTransform: 'uppercase',
          letterSpacing: '.06em',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          '&:hover': { filter: 'brightness(1.06)' },
        },
        outlinedPrimary: {
          borderColor: strideTokens.borderStrong,
          color: strideTokens.fgPrimary,
          '&:hover': {
            borderColor: strideTokens.fgPrimary,
            background: strideTokens.bgSubtle,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontFamily: strideTokens.fontSans,
            borderRadius: strideTokens.radiusMd,
            '& fieldset': { borderColor: strideTokens.borderStrong },
            '&:hover fieldset': { borderColor: strideTokens.fgPrimary },
            '&.Mui-focused fieldset': { borderColor: strideTokens.action },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: strideTokens.radiusLg,
          border: `1px solid ${strideTokens.borderDefault}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: strideTokens.radiusPill, fontWeight: 600 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: strideTokens.fontSans,
          fontSize: '12px',
          borderRadius: strideTokens.radiusXs,
          backgroundColor: strideTokens.fgPrimary,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(14px)',
          color: strideTokens.fgPrimary,
          boxShadow: 'none',
          borderBottom: `1px solid ${strideTokens.borderDefault}`,
        },
      },
    },
  },
});

// Export pre-built themes
export const lightThemeStride = createTheme(getThemeOptions('light'));
export const darkThemeStride  = createTheme(getThemeOptions('dark'));

// Legacy compat (used by existing components until migrated)
export const lightTheme = {
  bg: strideTokens.bgCanvas,
  itemBg: strideTokens.bgSubtle,
  primary: strideTokens.action,
  secondary: strideTokens.bgSubtle,
  greyLight: strideTokens.bgMuted,
  shadow: 'rgba(0,0,0,0.07)',
  shadowMedium: 'rgba(0,0,0,0.12)',
  textLink: strideTokens.fgSecondary,
  textItem: strideTokens.fgPrimary,
};

export const darkTheme = {
  bg: strideTokens.darkBgCanvas,
  itemBg: '#283449',
  primary: strideTokens.darkAction,
  secondary: '#1B2438',
  greyDark: '#283449',
  shadow: 'rgba(0,0,0,0.5)',
  shadowMedium: 'rgba(0,0,0,0.6)',
  textLink: strideTokens.darkFgPrimary,
  textItem: strideTokens.darkFgPrimary,
};

export default lightThemeStride;
