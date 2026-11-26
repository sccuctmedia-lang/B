(() => {
  const collection = document.querySelector('.reference-collection');
  const filter = document.querySelector('.reference-filter');
  const count = document.querySelector('#reference-count');
  const cards = [...collection.querySelectorAll('[data-category]')];
  const buttons = [...filter.querySelectorAll('button')];
  const dialog = document.querySelector('.reference-dialog');
  const photo = dialog.querySelector('img');
  const caption = dialog.querySelector('#reference-caption');
  const position = dialog.querySelector('#reference-position');
  let visible = cards;
  let active = 0;
  let opener;

  function apply(category) {
    visible = cards.filter(card => category === 'all' || card.dataset.category === category);
    for (const card of cards) card.hidden = !visible.includes(card);
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    count.textContent = visible.length + ' photographs';
  }

  function show(index) {
    active = (index + visible.length) % visible.length;
    const card = visible[active];
    const link = card.querySelector('.reference-image');
    photo.src = link.href;
    photo.alt = link.querySelector('img').alt;
    caption.textContent = card.querySelector('h2').textContent;
    position.textContent = (active + 1) + ' of ' + visible.length;
  }

  filter.hidden = false;
  apply('all');
  filter.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (button) apply(button.dataset.filter);
  });
  window.addEventListener('hashchange', () => {
    const target = cards.find(card => '#' + card.id === location.hash);
    if (target?.hidden) {
      apply('all');
      target.scrollIntoView();
    }
  });

  if (typeof dialog.showModal !== 'function') return;
  collection.addEventListener('click', event => {
    const link = event.target.closest('.reference-image');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    show(visible.indexOf(link.closest('article')));
    dialog.showModal();
  });
  dialog.addEventListener('click', event => {
    const button = event.target.closest('[data-step]');
    if (button) show(active + Number(button.dataset.step));
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    const direction = {ArrowLeft: -1, ArrowRight: 1}[event.key];
    if (!direction) return;
    event.preventDefault();
    show(active + direction);
  });
  dialog.addEventListener('close', () => opener?.focus());
})();