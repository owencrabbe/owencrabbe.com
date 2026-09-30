const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

function closeMenu() {
  toggle?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
}

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});

const principles = {
  sources: {
    title: 'Keep the source trail.',
    copy: 'A useful claim points to the material that supports it. The evidence stays available for the reader to inspect.',
  },
  decisions: {
    title: 'Show the assumptions.',
    copy: 'A calculation, an interpretation, and a retrieved fact are different kinds of claims. Keep their inputs and limits visible.',
  },
  boundaries: {
    title: 'Preserve what is unknown.',
    copy: 'Missing evidence should remain missing. An unresolved question is a useful result when it leads to the next check.',
  },
};

document.querySelectorAll('[data-evidence]').forEach(button => {
  button.addEventListener('click', () => {
    const principle = principles[button.dataset.evidence];
    if (!principle) return;
    document.querySelectorAll('[data-evidence]').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    document.querySelector('#inspector-title').textContent = principle.title;
    document.querySelector('#inspector-copy').textContent = principle.copy;
  });
});
