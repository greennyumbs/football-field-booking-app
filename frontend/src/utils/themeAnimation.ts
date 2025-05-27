/**
 * Animation for theme toggling that creates a ripple effect
 * This can be added to your application to make theme switching more visually appealing
 */
export function animateThemeChange() {
  const body = document.body;
  const isDark = document.documentElement.classList.contains('dark');
  
  // Create the ripple element
  const ripple = document.createElement('div');
  ripple.style.position = 'fixed';
  ripple.style.borderRadius = '50%';
  ripple.style.pointerEvents = 'none';
  ripple.style.zIndex = '9999';
  ripple.style.backgroundColor = isDark ? '#f8fafc' : '#0f172a';
  ripple.style.transition = 'transform 1s ease-out, opacity 0.8s ease-out';
  ripple.style.opacity = '0.3';
  
  // Position the ripple - start from the button that was clicked or center of screen
  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  
  // Calculate diagonal length for the maximum distance we need to cover
  const maxDiagonalLength = Math.sqrt(Math.pow(viewportWidth, 2) + Math.pow(viewportHeight, 2));
  
  // Style for initial state - starting from top right corner
  ripple.style.top = '70px';  // Approximately where the theme toggle button is
  ripple.style.right = '70px';
  ripple.style.width = '20px';
  ripple.style.height = '20px';
  ripple.style.transform = 'scale(1)';
  
  // Add to DOM
  body.appendChild(ripple);
  
  // Trigger animation
  setTimeout(() => {
    ripple.style.transform = `scale(${maxDiagonalLength / 10})`;
    ripple.style.opacity = '0';
  }, 50);
  
  // Clean up
  setTimeout(() => {
    body.removeChild(ripple);
  }, 1000);
}
