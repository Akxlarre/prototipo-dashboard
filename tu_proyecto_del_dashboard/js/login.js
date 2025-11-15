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
});
