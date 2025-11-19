/* ==================================== */
/* main.js - Utilidades Globales       */
/* ==================================== */

/**
 * Sistema de Toast Notifications
 * Uso: showToast('Mensaje', 'success')
 * Tipos: success, error, warning, info
 */
function showToast(message, type = 'info', duration = 3000) {
    // Crear o obtener contenedor de toasts
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Crear toast
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    // Íconos según tipo
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span class="toast__icon">${icons[type] || icons.info}</span>
        <span class="toast__content">${message}</span>
        <button class="toast__close" onclick="this.parentElement.remove()">✕</button>
    `;
    
    container.appendChild(toast);
    
    // Mostrar con animación
    setTimeout(() => toast.classList.add('toast--visible'), 100);
    
    // Auto-remover
    if (duration > 0) {
        setTimeout(() => {
            toast.classList.remove('toast--visible');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    return toast;
}

/**
 * Haptic Feedback
 * Uso: triggerHaptic('light')
 * Tipos: light, medium, success
 */
function triggerHaptic(style = 'light') {
    if ('vibrate' in navigator) {
        const patterns = {
            light: [10],
            medium: [20],
            success: [10, 50, 10],
            error: [30, 20, 30]
        };
        navigator.vibrate(patterns[style] || patterns.light);
    }
}

/**
 * Formatear moneda chilena
 * Uso: formatCurrency(475000) => "$475.000"
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(value);
}

/**
 * Formatear fecha
 * Uso: formatDate('2025-11-18') => "18 de Noviembre"
 */
function formatDate(dateString) {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const date = new Date(dateString + 'T00:00:00');
    return `${date.getDate()} de ${months[date.getMonth()]}`;
}

/**
 * Debounce function para optimizar eventos
 * Uso: const debouncedFn = debounce(() => {...}, 300)
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Detectar modo táctil
 */
function isTouchDevice() {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

/**
 * Agregar clase al body si es dispositivo táctil
 */
document.addEventListener('DOMContentLoaded', () => {
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    }
    
    // Prevenir zoom en inputs en iOS
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1, maximum-scale=1');
            }
        });
        
        input.addEventListener('blur', function() {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1.0');
            }
        });
    });
});

// Exportar funciones para uso global
window.showToast = showToast;
window.triggerHaptic = triggerHaptic;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.debounce = debounce;
window.isTouchDevice = isTouchDevice;

