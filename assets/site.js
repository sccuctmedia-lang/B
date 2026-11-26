const sidebar = document.querySelector('.sidebar');
const menu = sidebar.querySelector('.nav-toggle');
const navigation = sidebar.querySelector('nav');

function setOpen(open) {
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
}

sidebar.classList.add('is-enhanced');
menu.hidden = false;
menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') === 'false'));
sidebar.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setOpen(false);
    menu.focus();
  }
});
