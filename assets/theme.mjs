// Reveal the new appearance over the old page from the theme button's center.
export function createThemeSwitcher({document, window, applyTheme, saveTheme, reducedMotion = () => false}) {
  const root = document.documentElement;
  let busy = false;
  return async function switchTheme(button) {
    if (busy) return false;
    busy = true;
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    let applied = false, transition;
    const update = () => {
      if (applied) return;
      applied = true;
      applyTheme(theme);
      saveTheme(theme);
    };
    const properties = ['--theme-reveal-x', '--theme-reveal-y', '--theme-reveal-radius'];
    try {
      if (reducedMotion() || typeof document.startViewTransition !== 'function') {
        update();
        return true;
      }
      const bounds = button.getBoundingClientRect();
      const width = window.innerWidth, height = window.innerHeight;
      const x = Math.max(0, Math.min(width, bounds.left + bounds.width / 2));
      const y = Math.max(0, Math.min(height, bounds.top + bounds.height / 2));
      // Include the farthest corner and two extra pixels to avoid edge seams.
      const radius = Math.ceil(Math.hypot(Math.max(x, width - x), Math.max(y, height - y))) + 2;
      [x, y, radius].forEach((value, i) => root.style.setProperty(properties[i], `${value}px`));
      root.classList.add('theme-revealing');
      transition = document.startViewTransition(update);
      await transition.ready;
      await transition.finished;
      return true;
    } catch {
      // Skipped or unsupported transitions still commit the requested appearance.
      transition?.skipTransition();
      update();
      return true;
    } finally {
      root.classList.remove('theme-revealing');
      properties.forEach(property => root.style.removeProperty(property));
      busy = false;
    }
  };
}
