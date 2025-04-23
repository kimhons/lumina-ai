import { useEffect, useState } from 'react';

/**
 * Custom hook for responsive design
 * Returns boolean indicating if the media query matches
 * 
 * @param {string} query - Media query string (e.g., '(max-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Define callback for changes
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    
    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);
  
  return matches;
};

/**
 * Predefined breakpoint hooks for common screen sizes
 */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1400px)');

/**
 * Accessibility preference hooks
 */
export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const usePrefersReducedData = () => useMediaQuery('(prefers-reduced-data: reduce)');
export const usePrefersContrast = () => useMediaQuery('(prefers-contrast: more)');

/**
 * Device capability hooks
 */
export const useHasHover = () => useMediaQuery('(hover: hover)');
export const useHasPointer = () => useMediaQuery('(pointer: fine)');
export const useIsTouchDevice = () => useMediaQuery('(pointer: coarse)');

/**
 * Orientation hooks
 */
export const useIsPortrait = () => useMediaQuery('(orientation: portrait)');
export const useIsLandscape = () => useMediaQuery('(orientation: landscape)');

/**
 * Custom hook for responsive values based on screen size
 * 
 * @param {Object} values - Object with values for different breakpoints
 * @param {any} values.base - Default value
 * @param {any} [values.sm] - Value for small screens (>= 576px)
 * @param {any} [values.md] - Value for medium screens (>= 768px)
 * @param {any} [values.lg] - Value for large screens (>= 992px)
 * @param {any} [values.xl] - Value for extra large screens (>= 1200px)
 * @param {any} [values.xxl] - Value for extra extra large screens (>= 1400px)
 * @returns {any} - The appropriate value for the current screen size
 */
export const useResponsiveValue = (values) => {
  const isXxl = useMediaQuery('(min-width: 1400px)');
  const isXl = useMediaQuery('(min-width: 1200px)');
  const isLg = useMediaQuery('(min-width: 992px)');
  const isMd = useMediaQuery('(min-width: 768px)');
  const isSm = useMediaQuery('(min-width: 576px)');
  
  if (isXxl && values.xxl !== undefined) return values.xxl;
  if (isXl && values.xl !== undefined) return values.xl;
  if (isLg && values.lg !== undefined) return values.lg;
  if (isMd && values.md !== undefined) return values.md;
  if (isSm && values.sm !== undefined) return values.sm;
  
  return values.base;
};
