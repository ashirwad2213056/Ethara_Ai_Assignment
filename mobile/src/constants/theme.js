// ─── SpendWise Design System ──────────────────────────────────────────────────
// Source of truth: DESIGN.md
// All UI components import from this file exclusively.

// ─── Color Palette ────────────────────────────────────────────────────────────
export const colors = {
  // Backgrounds
  bg: {
    primary:   '#0F1117',   // main screen background
    secondary: '#1A1D27',   // cards, surfaces
    tertiary:  '#22263A',   // elevated cards, modals
    input:     '#1E2130',   // input fields
  },

  // Brand
  brand: {
    primary:   '#7C6EF5',   // indigo-purple — primary CTA
    soft:      '#2D2855',   // brand tint backgrounds
    glow:      '#7C6EF540', // 25% opacity for highlights
  },

  // Accent (Legacy/Extended support)
  accent: {
    primary:   '#7C6EF5',
    secondary: '#E879B0',
  },

  // Semantic / Status
  success:   '#22C983',
  successBg: '#0D2E1F',
  warning:   '#F5A623',
  warningBg: '#2E1F00',
  danger:    '#F5515F',
  dangerBg:  '#2E0D0F',
  info:      '#4AABF5',
  infoBg:    '#0D1E2E',

  status: {
    success: '#22C983',
    warning: '#F5A623',
    error:   '#F5515F',
    info:    '#4AABF5',
  },

  // Text
  text: {
    primary:   '#F0EEF9',   // headings, primary content
    secondary: '#8E8BA8',   // labels, captions
    tertiary:  '#4E4C66',   // placeholders, disabled
    inverse:   '#0F1117',   // text on brand buttons
    muted:     '#8E8BA8',   // alias for secondary
  },

  // Borders
  border: {
    default: '#2A2D3E',
    strong:  '#3D405A',
    focus:   '#7C6EF5',
  },

  // Categories (fixed 8-slot palette — matches seed data)
  categories: {
    food:          '#F5A623',
    transport:     '#4AABF5',
    shopping:      '#E879B0',
    health:        '#22C983',
    housing:       '#7C6EF5',
    entertainment: '#F5515F',
    education:     '#5DCDF5',
    other:         '#8E8BA8',
  },
};

// ─── Typography ───────────────────────────────────────────────────────────────
// Fonts loaded in App.js via expo-font:
//   'GeneralSans-Regular', 'GeneralSans-Medium', 'GeneralSans-Semibold', 'GeneralSans-Bold'
//   'JetBrainsMono-Regular', 'JetBrainsMono-Bold'
export const typography = {
  sizes: {
    xs:    11,
    sm:    13,
    md:    15,
    lg:    17,
    xl:    20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 38,
  },
  fonts: {
    regular:  'System', // Fallback until fonts are loaded
    medium:   'System',
    semibold: 'System',
    bold:     'System',
    mono:     'System',
  },
  weights: {
    regular:  '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
  },
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const spacing = {
  xs:    4,
  sm:    8,
  md:    12,
  lg:    16,
  xl:    20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export const layout = {
  screenPadding:   20,   // horizontal padding on all screens
  cardRadius:      16,
  buttonRadius:    12,
  inputRadius:     10,
  badgeRadius:      6,
  avatarRadius:    20,
  bottomTabHeight: 72,   // includes safe area
  headerHeight:    56,
  
  // Extended layout properties
  spacing: spacing,
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  }
};

// ─── Motion ───────────────────────────────────────────────────────────────────
// All durations in ms
export const motion = {
  fast:   150,   // tab switches, micro feedback
  normal: 250,   // screen transitions, modals
  slow:   400,   // hero number count-up, chart entrance
};

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};
