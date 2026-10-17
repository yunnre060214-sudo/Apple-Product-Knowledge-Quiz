export const HELLO_KEY = 'apple-trivia:hello:v1';

// Independent of the question-bank request: the intro must never block playing.
export function createHelloController({document, storage, reducedMotion = () => false, setTimer = setTimeout, clearTimer = clearTimeout}) {
  const root = document.documentElement;
  const overlay = document.getElementById('hello-intro');
  const content = document.getElementById('site-content');
  const skip = document.getElementById('hello-skip');
  let active = false, leaving = false, played = false, timers = [], previousFocus;
  const clear = () => { timers.forEach(clearTimer); timers = []; };
  const later = (fn, ms) => timers.push(setTimer(fn, ms));
  const seen = () => { try { return storage?.getItem(HELLO_KEY) === '1'; } catch { return false; } };
  const remember = () => { played = true; try { storage?.setItem(HELLO_KEY, '1'); } catch {} };
  const onKey = e => {
    if (e.key === 'Escape') { e.preventDefault(); dismiss(); }
    if (e.key === 'Tab') { e.preventDefault(); skip.focus({preventScroll:true}); }
  };
  function cleanup() {
    clear();
    root.classList.remove('hello-pending', 'hello-booting');
    overlay.classList.remove('hello-playing', 'hello-leaving');
    overlay.hidden = true;
    content.inert = false;
    document.removeEventListener('keydown', onKey, true);
    skip.removeEventListener('click', dismiss);
    active = false; leaving = false;
    const target = previousFocus && previousFocus !== document.body && previousFocus.isConnected ? previousFocus : document.getElementById('main');
    target?.focus({preventScroll:true});
  }
  function dismiss() {
    if (!active || leaving) return;
    leaving = true; remember(); clear();
    overlay.classList.add('hello-leaving');
    if (reducedMotion()) cleanup(); else later(cleanup, 480);
  }
  function play({force = false} = {}) {
    if (active) return false;
    if (!force && (played || seen() || reducedMotion())) {
      root.classList.remove('hello-pending', 'hello-booting');
      overlay.hidden = true; content.inert = false;
      return false;
    }
    previousFocus = document.activeElement;
    active = true; overlay.hidden = false; content.inert = true;
    root.classList.add('hello-pending');
    overlay.classList.remove('hello-playing', 'hello-leaving');
    // Reset the path animation when the user explicitly replays it.
    void overlay.offsetWidth;
    overlay.classList.add('hello-playing');
    skip.addEventListener('click', dismiss);
    document.addEventListener('keydown', onKey, true);
    skip.focus({preventScroll:true});
    later(dismiss, reducedMotion() ? 1200 : 4100);
    later(() => { remember(); cleanup(); }, 6000);
    root.classList.remove('hello-booting');
    return true;
  }
  return {play, dismiss};
}

let controller;
export function replayHello() { return controller?.play({force:true}); }
if (typeof document !== 'undefined') {
  let storage;
  try { storage = window.localStorage; } catch {}
  controller = createHelloController({document, storage, reducedMotion: () => matchMedia('(prefers-reduced-motion: reduce)').matches});
  if (document.documentElement.classList.contains('hello-pending')) controller.play();
}
