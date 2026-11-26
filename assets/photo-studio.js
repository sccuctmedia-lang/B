(() => {
  const scenes = [
  {
    "id": "residence",
    "label": "Timber at dusk",
    "title": "Timber and glass at dusk",
    "alt": "Timber-clad residence with illuminated glazing at dusk",
    "src": "residence.webp",
    "thumb": "residence-small.webp",
    "detail": "Timber cladding and generous glazing open the living spaces to a mature garden."
  },
  {
    "id": "facade",
    "label": "Concrete exterior",
    "title": "Stepped concrete façade",
    "alt": "White concrete façade, stepped terraces and a reflecting pool",
    "src": "facade.webp",
    "thumb": "facade.webp",
    "detail": "Deep terraces shade the glazed rooms and give the building a stepped profile."
  },
  {
    "id": "interior",
    "label": "Living interior",
    "title": "Material continuity",
    "alt": "A living room with timber panelling and full-height windows",
    "src": "interior.webp",
    "thumb": "interior.webp",
    "detail": "Timber, stone and full-height glazing tie the rooms together."
  },
  {
    "id": "detail",
    "label": "Staircase detail",
    "title": "Light around a staircase",
    "alt": "A concrete staircase framed by a timber screen and daylight",
    "src": "detail.webp",
    "thumb": "detail.webp",
    "detail": "Light and timber details make the stair a feature of the room."
  }
];
  const stage = document.querySelector('#studio-stage');
  const frame = document.querySelector('#studio-frame');
  const photo = document.querySelector('#studio-photo');
  const title = document.querySelector('#studio-photo-title');
  const note = document.querySelector('#studio-photo-note');
  const counter = document.querySelector('#studio-counter');
  const useReference = document.querySelector('#studio-use');
  const orbit = document.querySelector('#studio-orbit');
  const thumbnails = document.querySelector('#studio-thumbs');
  const buttons = [...thumbnails.querySelectorAll('button')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let restingAngle = 0;
  let animation;

  function tilt(x, y) {
    frame.style.setProperty('--tilt-x', x + 'deg');
    frame.style.setProperty('--tilt-y', y + 'deg');
  }

  function select(id) {
    const index = scenes.findIndex(scene => scene.id === id);
    if (index === -1) return;
    const scene = scenes[index];
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.photo === id));
    if (scene.id === 'residence') {
      photo.sizes = '(max-width: 860px) 96vw, 64vw';
      photo.srcset = 'assets/residence-small.webp 950w, assets/residence.webp 2160w';
    } else {
      photo.removeAttribute('srcset');
      photo.removeAttribute('sizes');
    }
    photo.src = 'assets/' + scene.src;
    photo.alt = scene.alt;
    title.textContent = scene.title;
    note.textContent = scene.detail;
    counter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(scenes.length).padStart(2, '0');
    useReference.href = 'brief.html?reference=' + scene.id;
  }

  thumbnails.hidden = false;
  orbit.hidden = false;
  select(scenes[0].id);
  thumbnails.addEventListener('click', event => {
    const button = event.target.closest('[data-photo]');
    if (button) select(button.dataset.photo);
  });
  orbit.addEventListener('click', event => {
    const button = event.target.closest('[data-direction]');
    if (!button) return;
    const direction = Number(button.dataset.direction);
    restingAngle = direction ? Math.max(-24, Math.min(24, restingAngle + direction * 12)) : 0;
    tilt(0, restingAngle);
  });
  stage.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reducedMotion.matches) return;
    cancelAnimationFrame(animation);
    animation = requestAnimationFrame(() => {
      const area = stage.getBoundingClientRect();
      if (!area.width || !area.height) return;
      const x = (event.clientX - area.left) / area.width - .5;
      const y = (event.clientY - area.top) / area.height - .5;
      tilt(y * -9, restingAngle + x * 15);
    });
  });
  stage.addEventListener('pointerleave', () => {
    cancelAnimationFrame(animation);
    tilt(0, restingAngle);
  });
})();