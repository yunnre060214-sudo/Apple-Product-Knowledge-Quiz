// Reveal the new appearance over the old page from the theme button's center.
export function createThemeSwitcher({document, window, applyTheme, saveTheme, commitTheme = () => {}, reducedMotion = () => false}) {
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
    const properties = ['--theme-reveal-x', '--theme-reveal-y', '--theme-reveal-radius', '--theme-reveal-backdrop'];
    try {
      if (reducedMotion() || typeof document.startViewTransition !== 'function') {
        update();
        return true;
      }
      const bounds = button.getBoundingClientRect();
      const width = Math.max(window.innerWidth, root.clientWidth || 0);
      const height = Math.max(window.innerHeight, root.clientHeight || 0);
      const x = Math.max(0, Math.min(width, bounds.left + bounds.width / 2));
      const y = Math.max(0, Math.min(height, bounds.top + bounds.height / 2));
      const setRadius = (w, h) => {
        const radius = Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 2;
        root.style.setProperty('--theme-reveal-radius', `${radius}px`);
      };
      root.style.setProperty('--theme-reveal-x', `${x}px`);
      root.style.setProperty('--theme-reveal-y', `${y}px`);
      setRadius(width, height);
      // Keep any uncovered canvas in the old color until the reveal reaches it.
      const backdrop = window.getComputedStyle(root).getPropertyValue('--bg').trim();
      root.style.setProperty('--theme-reveal-backdrop', backdrop);
      root.classList.add('theme-revealing');
      transition = document.startViewTransition(update);
      await transition.ready;
      // Mobile snapshots can extend beneath retractable browser toolbars, beyond
      // innerHeight. Measure the actual snapshot before its first painted frame.
      try {
        const snapshot = window.getComputedStyle(root, '::view-transition-group(root)');
        const snapshotWidth = parseFloat(snapshot.width), snapshotHeight = parseFloat(snapshot.height);
        setRadius(Math.max(width, snapshotWidth || 0), Math.max(height, snapshotHeight || 0));
      } catch {}
      await transition.finished;
      return true;
    } catch {
      // Skipped or unsupported transitions still commit the requested appearance.
      transition?.skipTransition();
      update();
      return true;
    } finally {
      if (applied) commitTheme(theme);
      root.classList.remove('theme-revealing');
      properties.forEach(property => root.style.removeProperty(property));
      busy = false;
    }
  };
}
