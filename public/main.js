const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

if (toggle && navigation) {
  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });

  navigation.addEventListener('click', (event) => {
    const anchor = event.target.closest('a');
    if (!anchor || toggle.getAttribute('aria-expanded') !== 'true') return;
    closeMenu();
    const destination = new URL(anchor.href);
    if (destination.pathname === location.pathname && destination.hash) {
      const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (toggle.getAttribute('aria-expanded') === 'true' && !navigation.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  const mobile = matchMedia('(max-width: 700px)');
  mobile.addEventListener('change', () => {
    const focusWasInMenu = navigation.contains(document.activeElement);
    closeMenu();
    if (mobile.matches && focusWasInMenu) toggle.focus();
  });
  document.documentElement.classList.add('js');
}
