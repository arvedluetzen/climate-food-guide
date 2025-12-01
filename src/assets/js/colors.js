// Centralized theme colors available to CSS and JS
(function () {
  const theme = {
    background: '#ffffff',
    GREY100: '#d6d6d6',
    GREY200: '#b5b5b5',
    GREY300: '#949494',
    GREY400: '#767676',
    GREY500: '#595959',
    GREY600: '#3d3d3d',

    primary17: '#afe1ca',
    primary33: '#69c79b',
    primary50: '#19a966',
    primary67: '#0b874d',
    primary83: '#08663a',
    primary100: '#064628',

    secondary17: '#b5dced',
    secondary33: '#76bedd',
    secondary50: '#349ecc',
    secondary67: '#027db2',
    secondary83: '#015f88',
    secondary100: '#01415d',

    'accent-217': '#e4cff1',
    'accent-233': '#cda7e6',
    'accent-250': '#b57eda',
    'accent-267': '#9e54ce',
    'accent-283': '#8325c1',
    'accent-2100': '#5d0d91',

    'accent-117': '#e8d2b8',
    'accent-133': '#d7ae80',
    'accent-150': '#c38845',
    'accent-167': '#9b6c37',
    'accent-183': '#755229',
    'accent-1100': '#51381c',

    'accent-yellow': '#fde68a'
  };

  // Expose for JS usage
  window.themeColors = theme;

  // Also set CSS custom properties at runtime to ensure sync with JS
  try {
    const root = document && document.documentElement;
    if (root && root.style) {
      Object.keys(theme).forEach(k => {
        root.style.setProperty('--' + k, theme[k]);
      });
    }
  } catch (e) {
    // ignore in non-browser contexts
  }
})();
