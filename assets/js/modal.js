/* ============================================================
   CROWN SOFTWARE SYSTEMS — Modal JS
   ============================================================ */

(function() {
  'use strict';

  const overlay = document.querySelector('.modal-overlay');
  const modal   = document.querySelector('.modal');
  const closeBtn = document.querySelector('.modal__close');
  const form    = document.querySelector('.modal-form');
  const successEl = document.querySelector('.modal__success');
  const formBody  = document.querySelector('.modal-form-body');

  if (!overlay) return;

  window.openModal = function() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const firstInput = overlay.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 350);
  };

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Reset form after close animation
    setTimeout(() => {
      if (form) form.reset();
      if (successEl) successEl.style.display = 'none';
      if (formBody) formBody.style.display = '';
      clearErrors();
    }, 400);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  /* ── Validation ─────────────────────────────────────────── */
  function clearErrors() {
    document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
  }
  function showError(input, msg) {
    input.classList.add('error');
    const span = document.createElement('span');
    span.className = 'form-error-msg';
    span.style.cssText = 'color:#e66;font-size:0.75rem;display:block;margin-top:0.3rem;';
    span.textContent = msg;
    input.parentNode.appendChild(span);
  }

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors();
      let valid = true;

      const name   = form.querySelector('#modal-name');
      const email  = form.querySelector('#modal-email');
      const comment = form.querySelector('#modal-comment');

      if (!name.value.trim()) { showError(name, 'Please enter your name.'); valid = false; }
      if (!email.value.trim()) { showError(email, 'Please enter your email.'); valid = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError(email, 'Please enter a valid email.'); valid = false; }

      if (!valid) return;

      // Simulate submit (no backend)
      const btn = form.querySelector('.modal-submit');
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

      setTimeout(() => {
        if (formBody) formBody.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
        if (btn) { btn.textContent = 'Send Request'; btn.disabled = false; }
      }, 1000);
    });
  }
})();
