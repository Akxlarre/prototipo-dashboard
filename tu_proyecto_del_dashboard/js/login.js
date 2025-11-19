document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const adminBtn = document.getElementById('login-admin-btn');
    const workerBtn = document.getElementById('login-worker-btn');

    const redirectToAdmin = () => {
        window.location.href = 'admin-dashboard.html';
    };

    const redirectToWorker = () => {
        window.location.href = 'worker-home.html';
    };

    if (adminBtn) {
        adminBtn.addEventListener('click', (e) => {
            e.preventDefault();
            redirectToAdmin();
        });
    }

    if (workerBtn) {
        workerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            redirectToWorker();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = (emailInput ? emailInput.value : '').toLowerCase();
            if (email.includes('admin')) {
                redirectToAdmin();
            } else {
                redirectToWorker();
            }
        });
    }

    /* ------------------------------ */
    /* Modales: Recuperar/Soporte     */
    /* ------------------------------ */
    const forgotTrigger = document.getElementById('forgot-password-trigger');
    const helpTrigger = document.getElementById('help-trigger');
    const forgotModal = document.getElementById('forgot-password-modal');
    const helpModal = document.getElementById('help-modal');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    const syncBodyScroll = () => {
        const anyOpen = document.querySelector('.modal-overlay.is-active');
        document.body.classList.toggle('is-modal-open', Boolean(anyOpen));
    };

    const openModal = (modal) => {
        if (!modal) return;
        if (modal === forgotModal) {
            resetForgotModalState();
        }
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        syncBodyScroll();

        const focusable = modal.querySelector('[data-initial-focus]') || modal.querySelector('input, button, a.btn, [tabindex]');
        if (focusable) {
            focusable.focus();
        }
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        if (modal === forgotModal) {
            resetForgotModalState();
        }
        syncBodyScroll();
    };

    modalOverlays.forEach((modal) => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    if (forgotTrigger) {
        forgotTrigger.addEventListener('click', () => openModal(forgotModal));
    }

    if (helpTrigger) {
        helpTrigger.addEventListener('click', () => openModal(helpModal));
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.is-active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    const forgotForm = document.getElementById('forgot-password-form');
    const forgotEmailInput = document.getElementById('forgot-password-email');
    const forgotFeedback = document.getElementById('forgot-password-feedback');
    const forgotSubmitBtn = document.getElementById('forgot-password-submit');
    const forgotSubmitDefaultLabel = forgotSubmitBtn ? forgotSubmitBtn.textContent : 'Enviar enlace';

    const resetForgotModalState = () => {
        if (forgotForm) {
            forgotForm.reset();
        }
        if (forgotFeedback) {
            forgotFeedback.hidden = true;
            forgotFeedback.textContent = '';
        }
        if (forgotSubmitBtn) {
            forgotSubmitBtn.disabled = false;
            forgotSubmitBtn.textContent = forgotSubmitDefaultLabel;
        }
    };

    if (forgotForm) {
        forgotForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!forgotEmailInput || !forgotSubmitBtn) return;

            const emailValue = forgotEmailInput.value.trim();
            if (!emailValue) {
                forgotEmailInput.focus();
                return;
            }

            const originalLabel = forgotSubmitBtn.textContent;
            forgotSubmitBtn.disabled = true;
            forgotSubmitBtn.textContent = 'Enviando...';

            setTimeout(() => {
                if (forgotFeedback) {
                    forgotFeedback.textContent = `Enviamos un enlace a ${emailValue} para restablecer tu contraseña.`;
                    forgotFeedback.hidden = false;
                }
                forgotSubmitBtn.disabled = false;
                forgotSubmitBtn.textContent = originalLabel;
            }, 900);
        });
    }
});
