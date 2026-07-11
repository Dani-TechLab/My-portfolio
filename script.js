/* ================================================================
   Portfolio – Landing Page JavaScript
   Typewriter, command palette, mouse follower
   ================================================================ */

// ──────────────────────────────────────────────
// TYPEWRITER (header-bio)
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const roles = [
    'Full-Stack Developer',
    'UI/UX Enthusiast',
    'Open-Source Contributor',
    'Creative Problem Solver'
  ];
  const el = document.getElementById('header-bio');
  if (!el) return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typewrite() {
    const current = roles[roleIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex--);
    } else {
      el.textContent = current.substring(0, charIndex++);
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex > current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(typewrite, delay);
  }

  typewrite();

  // ──────────────────────────────────────────
  // COMMAND PALETTE (Ctrl+K / Cmd+K)
  // ──────────────────────────────────────────
  const overlay = document.getElementById('cmd-overlay');
  const input = document.getElementById('cmd-input');
  const results = document.getElementById('cmd-results');
  const items = results ? results.querySelectorAll('li') : [];

  function openPalette() {
    if (!overlay) return;
    overlay.classList.add('open');
    if (input) { input.value = ''; filterResults(''); input.focus(); }
    document.body.style.overflow = 'hidden';
  }

  function closePalette() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (input) input.blur();
  }

  function filterResults(query) {
    const lower = query.toLowerCase();
    items.forEach(li => {
      const text = li.textContent.toLowerCase();
      li.classList.toggle('hidden', !text.includes(lower));
    });
  }

  function navigateTo(li) {
    const href = li.getAttribute('data-href');
    if (href) {
      window.location.href = href;
      closePalette();
    }
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (!overlay || !overlay.classList.contains('open')) openPalette();
      else closePalette();
    }
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) closePalette();

    if (e.key === 'Enter' && overlay && overlay.classList.contains('open')) {
      const active = results ? results.querySelector('li:not(.hidden)') : null;
      if (active) navigateTo(active);
    }
  });

  if (input) {
    input.addEventListener('input', (e) => filterResults(e.target.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const visible = Array.from(results ? results.querySelectorAll('li:not(.hidden)') : []);
        if (!visible.length) return;
        const active = results ? results.querySelector('li.active') : null;
        const idx = active ? visible.indexOf(active) : -1;
        const next = e.key === 'ArrowDown'
          ? (idx + 1) % visible.length
          : (idx - 1 + visible.length) % visible.length;
        if (active) active.classList.remove('active');
        visible[next].classList.add('active');
      }
    });
  }

  items.forEach(li => li.addEventListener('click', () => navigateTo(li)));
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closePalette(); });

  // ──────────────────────────────────────────
  // MOUSE FOLLOWER (nav cards)
  // ──────────────────────────────────────────
  document.querySelectorAll('.nav-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });
});
