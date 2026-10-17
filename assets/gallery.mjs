// Original vector studies of three familiar Apple silhouettes. No external assets.
export const devices = [
  {id:'mac', name:'Macintosh', year:'1984', image:'macintosh.svg'},
  {id:'ipod', name:'iPod', year:'2004', image:'ipod.svg'},
  {id:'iphone', name:'iPhone', year:'2007', image:'iphone.svg'},
];

export function archiveMarkup(version) {
  return `<figure class="archive" aria-label="Apple 经典产品"><div class="archive-stage">${devices.map((d,i)=>`<div class="archive-layer ${i===0?'is-active':''}" data-archive-layer="${d.id}" aria-hidden="true"><span class="archive-year">${d.year}</span><div class="archive-object"><img src="./assets/${d.image}?v=${version}" width="480" height="440" alt="" draggable="false" decoding="async"></div></div>`).join('')}</div><div class="archive-select" role="group" aria-label="切换展陈产品">${devices.map((d,i)=>`<button type="button" data-device="${d.id}" aria-pressed="${i===0}"><span>${d.name}</span><i aria-hidden="true"></i></button>`).join('')}</div><figcaption class="sr-only" aria-live="polite" data-archive-caption>Macintosh，1984 年</figcaption></figure>`;
}

export function mountArchive(figure, {reducedMotion = () => false} = {}) {
  if (!figure) return () => {};
  const buttons = [...figure.querySelectorAll('[data-device]')];
  let active = 'mac', frame, previous = 0;
  let targetX = 0, targetY = 0, x = 0, y = 0;
  const reset = () => { targetX = 0; targetY = 0; schedule(); };
  const media = matchMedia('(hover: hover) and (pointer: fine)');
  function tick(now) {
    frame = undefined;
    if (!figure.isConnected) return;
    const amount = 1 - Math.exp(-Math.min(32, now - (previous || now - 16)) / 70);
    previous = now;
    x += (targetX - x) * amount;
    y += (targetY - y) * amount;
    figure.style.setProperty('--art-x', `${x.toFixed(3)}deg`);
    figure.style.setProperty('--art-y', `${y.toFixed(3)}deg`);
    if (Math.abs(targetX-x)+Math.abs(targetY-y) > .015) schedule();
    else previous = 0;
  }
  function schedule() { if (frame === undefined) frame = requestAnimationFrame(tick); }
  function move(event) {
    if (!media.matches || reducedMotion() || event.pointerType === 'touch') return;
    const b = figure.getBoundingClientRect();
    targetX = ((event.clientY-b.top)/b.height-.5)*-5;
    targetY = ((event.clientX-b.left)/b.width-.5)*5;
    schedule();
  }
  function select(event) {
    const button = event.target.closest('[data-device]');
    const item = devices.find(d => d.id === button?.dataset.device);
    if (!item || item.id === active) return;
    active = item.id;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    figure.querySelectorAll('[data-archive-layer]').forEach(layer => layer.classList.toggle('is-active', layer.dataset.archiveLayer === active));
    figure.querySelector('[data-archive-caption]').textContent = `${item.name}，${item.year} 年`;
  }
  // Native button focus and Tab order remain available for all three studies.
  figure.addEventListener('click', select);
  figure.addEventListener('pointermove', move);
  figure.addEventListener('pointerleave', reset);
  return () => {
    cancelAnimationFrame(frame);
    figure.removeEventListener('click', select);
    figure.removeEventListener('pointermove', move);
    figure.removeEventListener('pointerleave', reset);
  };
}
