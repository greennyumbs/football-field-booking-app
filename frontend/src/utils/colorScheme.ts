/**
 * Function to set up listeners for color scheme changes at the OS level
 * 
 * @param callback - Function to call when the color scheme changes
 * @returns A cleanup function to remove the listener
 */
export function listenForColorSchemeChanges(
  callback: (isDark: boolean) => void
): () => void {
  // Check if window is defined (for SSR)
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {}; // Return empty cleanup function
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Initial call with current state
  callback(mediaQuery.matches);
  
  // Set up listener for changes
  const handleChange = (event: MediaQueryListEvent) => {
    callback(event.matches);
  };
  
  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  } 
  // Legacy support (Safari 13.x)
  else if ('addListener' in mediaQuery) {
    // @ts-ignore - deprecated but needed for older browsers
    mediaQuery.addListener(handleChange);
    return () => {
      // @ts-ignore - deprecated but needed for older browsers
      mediaQuery.removeListener(handleChange);
    };
  }
  
  return () => {}; // Return empty cleanup function if not supported
}

/**
 * Detects if dark mode is preferred by the user's operating system
 */
export function isDarkModePreferred(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
