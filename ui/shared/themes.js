export const lightTheme = {
  background: '#f8f9fa',
  text: '#212529',
  headings: '#343a40',
  primary: '#0d6efd',
  primaryHover: '#0b5ed7',
  secondary: '#6c757d',
  success: '#198754',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#0dcaf0',
  light: '#f8f9fa',
  dark: '#212529',
  border: '#dee2e6',
  disabled: '#e9ecef',
  headerBackground: '#ffffff',
  footerBackground: '#f8f9fa',
  sidebarBackground: '#ffffff',
  inputBackground: '#ffffff',
  cardBackground: '#ffffff',
  shadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
  // Enhanced theme properties
  cardHeaderBackground: '#f1f3f5',
  cardBorder: '#e9ecef',
  navLinkColor: '#495057',
  navLinkHover: '#0d6efd',
  navLinkActive: '#0b5ed7',
  buttonPrimary: '#0d6efd',
  buttonSecondary: '#6c757d',
  buttonSuccess: '#198754',
  buttonDanger: '#dc3545',
  buttonWarning: '#ffc107',
  buttonInfo: '#0dcaf0',
  notificationBackground: '#ffffff',
  notificationBorder: '#dee2e6',
  notificationInfo: '#cfe2ff',
  notificationSuccess: '#d1e7dd',
  notificationWarning: '#fff3cd',
  notificationError: '#f8d7da',
  tooltipBackground: '#212529',
  tooltipText: '#ffffff',
  codeBackground: '#f1f3f5',
  codeText: '#212529',
  selectionBackground: '#0d6efd33',
  selectionText: '#212529',
  focusRing: '#0d6efd66',
  scrollbarThumb: '#adb5bd',
  scrollbarTrack: '#e9ecef'
};

export const darkTheme = {
  background: '#212529',
  text: '#f8f9fa',
  headings: '#f8f9fa',
  primary: '#0d6efd',
  primaryHover: '#0b5ed7',
  secondary: '#6c757d',
  success: '#198754',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#0dcaf0',
  light: '#f8f9fa',
  dark: '#212529',
  border: '#495057',
  disabled: '#343a40',
  headerBackground: '#343a40',
  footerBackground: '#343a40',
  sidebarBackground: '#343a40',
  inputBackground: '#2b3035',
  cardBackground: '#2b3035',
  shadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.25)',
  // Enhanced theme properties
  cardHeaderBackground: '#343a40',
  cardBorder: '#495057',
  navLinkColor: '#adb5bd',
  navLinkHover: '#0d6efd',
  navLinkActive: '#0b5ed7',
  buttonPrimary: '#0d6efd',
  buttonSecondary: '#6c757d',
  buttonSuccess: '#198754',
  buttonDanger: '#dc3545',
  buttonWarning: '#ffc107',
  buttonInfo: '#0dcaf0',
  notificationBackground: '#2b3035',
  notificationBorder: '#495057',
  notificationInfo: '#031633',
  notificationSuccess: '#051b11',
  notificationWarning: '#332701',
  notificationError: '#2c0b0e',
  tooltipBackground: '#f8f9fa',
  tooltipText: '#212529',
  codeBackground: '#343a40',
  codeText: '#f8f9fa',
  selectionBackground: '#0d6efd66',
  selectionText: '#f8f9fa',
  focusRing: '#0d6efd66',
  scrollbarThumb: '#495057',
  scrollbarTrack: '#343a40'
};

// New system theme that adapts to user's system preferences
export const systemTheme = {
  // This is a placeholder that will be replaced with either lightTheme or darkTheme
  // based on the user's system preferences
  ...lightTheme,
  // System-specific overrides can be added here
  systemAdaptive: true
};

// High contrast theme for accessibility
export const highContrastLightTheme = {
  ...lightTheme,
  background: '#ffffff',
  text: '#000000',
  headings: '#000000',
  border: '#000000',
  primary: '#0000ee',
  primaryHover: '#0000cc',
  navLinkColor: '#000000',
  navLinkHover: '#0000ee',
  navLinkActive: '#0000cc',
  focusRing: '#0000ee',
  shadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.5)',
  buttonPrimary: '#0000ee',
  buttonSecondary: '#000000',
  contrast: 'high'
};

export const highContrastDarkTheme = {
  ...darkTheme,
  background: '#000000',
  text: '#ffffff',
  headings: '#ffffff',
  border: '#ffffff',
  primary: '#00aaff',
  primaryHover: '#0088cc',
  navLinkColor: '#ffffff',
  navLinkHover: '#00aaff',
  navLinkActive: '#0088cc',
  focusRing: '#00aaff',
  shadow: '0 0.125rem 0.25rem rgba(255, 255, 255, 0.5)',
  buttonPrimary: '#00aaff',
  buttonSecondary: '#ffffff',
  contrast: 'high'
};

// Font size variations
export const fontSizes = {
  small: {
    base: '14px',
    h1: '1.75rem',
    h2: '1.5rem',
    h3: '1.25rem',
    h4: '1.1rem',
    h5: '1rem',
    h6: '0.9rem',
    button: '0.9rem',
    input: '0.9rem',
    small: '0.8rem'
  },
  medium: {
    base: '16px',
    h1: '2rem',
    h2: '1.75rem',
    h3: '1.5rem',
    h4: '1.25rem',
    h5: '1.1rem',
    h6: '1rem',
    button: '1rem',
    input: '1rem',
    small: '0.875rem'
  },
  large: {
    base: '18px',
    h1: '2.25rem',
    h2: '2rem',
    h3: '1.75rem',
    h4: '1.5rem',
    h5: '1.25rem',
    h6: '1.1rem',
    button: '1.1rem',
    input: '1.1rem',
    small: '0.95rem'
  }
};

// Animation settings
export const animations = {
  default: {
    transition: 'all 0.25s ease-in-out',
    fadeIn: 'fadeIn 0.25s ease-in-out',
    slideIn: 'slideIn 0.25s ease-in-out',
    expand: 'expand 0.25s ease-in-out'
  },
  reduced: {
    transition: 'all 0.01s linear',
    fadeIn: 'none',
    slideIn: 'none',
    expand: 'none'
  }
};

// Spacing scale
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem'
};

// Breakpoints for responsive design
export const breakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px'
};

// Z-index scale
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070
};

// Border radius scale
export const borderRadius = {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '1rem',
  pill: '50rem',
  circle: '50%'
};

// Get theme based on preferences
export const getTheme = (themeName, prefersDarkMode, highContrast) => {
  if (highContrast) {
    return prefersDarkMode ? highContrastDarkTheme : highContrastLightTheme;
  }
  
  if (themeName === 'system') {
    return prefersDarkMode ? darkTheme : lightTheme;
  }
  
  return themeName === 'dark' ? darkTheme : lightTheme;
};
