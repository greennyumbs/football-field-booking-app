// This script helps prevent flash of wrong theme during page load
// It should be added to your public/index.html file as an inline script
// within the <head> section to ensure it runs before the page renders

(function() {
  // Get theme from localStorage or system preference
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
    
    // Add the 'no-transition' class to prevent transitions during load
    document.documentElement.classList.add('no-transition');
    
    // Remove the no-transition class after the page has loaded
    window.addEventListener('load', function() {
      // Use requestAnimationFrame to ensure the class is removed after the page is rendered
      requestAnimationFrame(function() {
        document.documentElement.classList.remove('no-transition');
      });
    });
  } catch (e) {
    console.error('Error setting initial theme:', e);
  }
})();
