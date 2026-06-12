export const colors = {
  primary:      '#000000',
  secondary:    '#ffffff',
  action:       '#111111',
  actionHover:  '#222222',
  error:        '#dc2626',
  warning:      '#f59e0b',
  success:      '#16a34a',
  bgPrimary:    '#ffffff',
  bgSecondary:  '#f5f5f5',
  bgCard:       '#ffffff',
  fgPrimary:    '#111111',
  fgSecondary:  '#444444',
  fgMuted:      '#888888',
  fgPlaceholder:'#aaaaaa',
  border:       '#e5e5e5',
  borderStrong: '#cccccc',
  overlay:      'rgba(0,0,0,0.5)',
} as const;

export type ColorKey = keyof typeof colors;
