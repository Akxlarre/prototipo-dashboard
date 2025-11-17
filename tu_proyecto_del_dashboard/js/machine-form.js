/* ==================================== */
/* machine-form.js - Formulario Reutilizable de Máquina */
/* DRY: Single Source of Truth para formularios de máquina */
/* ==================================== */

/**
 * Genera el HTML del formulario de máquina
 * @param {Object} data - Datos iniciales de la máquina (opcional)
 * @param {Object} options - Opciones de configuración
 * @returns {string} HTML del formulario
 */
function generateMachineForm(data = {}, options = {}) {
    const {
        number = '',
        brand = '',
        plate = '',
        year = '',
        status = 'Operativa',
        driver = '',
        initialKm = ''
    } = data;
    
    const {
        showDriver = true,
        showStatus = true,
        showYear = true,
        showInitialKm = false,
        formId = 'machine-form'
    } = options;
    
    const statusOptions = [
        { value: 'Operativa', label: 'Operativa' },
        { value: 'En Taller', label: 'En Taller' },
        { value: 'Inactiva', label: 'Inactiva' }
    ];
    
    const driverOptions = [
        { value: '', label: '-- Seleccionar Chofer --' },
        { value: 'Juan Pérez', label: 'Juan Pérez' },
        { value: 'María Gómez', label: 'María Gómez' },
        { value: 'Pedro López', label: 'Pedro López' },
        { value: '(Sin Asignar)', label: '(Sin Asignar)' }
    ];
    
    let formHTML = `<form id="${formId}">`;
    
    // Número de Máquina
    formHTML += `
        <div class="form-field">
            <label for="machine-number" class="form-field__label">Número de Máquina</label>
            <input type="text" id="machine-number" class="input-text" value="${number}" placeholder="Ej: 05" required>
        </div>
    `;
    
    // Marca
    formHTML += `
        <div class="form-field">
            <label for="machine-brand" class="form-field__label">Marca</label>
            <input type="text" id="machine-brand" class="input-text" value="${brand}" placeholder="Ej: Mercedes-Benz" required>
        </div>
    `;
    
    // Patente
    formHTML += `
        <div class="form-field">
            <label for="machine-plate" class="form-field__label">Patente</label>
            <input type="text" id="machine-plate" class="input-text" value="${plate}" placeholder="Ej: ABCD-12" required>
        </div>
    `;
    
    // Año de Fabricación
    if (showYear) {
        formHTML += `
            <div class="form-field">
                <label for="machine-year" class="form-field__label">Año de Fabricación</label>
                <input type="number" id="machine-year" class="input-text" value="${year}" placeholder="Ej: 2018" min="1990" max="2035" required>
            </div>
        `;
    }
    
    // Chofer Asignado
    if (showDriver) {
        const driverSelectOptions = driverOptions.map(opt => {
            const selected = opt.value === driver ? 'selected' : '';
            return `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
        }).join('');
        
        formHTML += `
            <div class="form-field">
                <label for="machine-driver" class="form-field__label">Chofer Asignado ${driver === '' ? '(Opcional)' : ''}</label>
                <select id="machine-driver" class="input-text">
                    ${driverSelectOptions}
                </select>
            </div>
        `;
    }
    
    // Estado Operativo
    if (showStatus) {
        const statusSelectOptions = statusOptions.map(opt => {
            const selected = opt.value === status ? 'selected' : '';
            return `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
        }).join('');
        
        formHTML += `
            <div class="form-field">
                <label for="machine-status" class="form-field__label">Estado Operativo</label>
                <select id="machine-status" class="input-text" required>
                    ${statusSelectOptions}
                </select>
            </div>
        `;
    }
    
    // Kilometraje Inicial (solo para creación)
    if (showInitialKm) {
        formHTML += `
            <div class="form-field">
                <label for="machine-initial-km" class="form-field__label">Kilometraje Inicial</label>
                <input type="number" id="machine-initial-km" class="input-text" value="${initialKm}" placeholder="Ej: 125000">
            </div>
        `;
    }
    
    formHTML += `</form>`;
    
    return formHTML;
}

/**
 * Obtiene los valores del formulario de máquina
 * @param {string} formId - ID del formulario
 * @returns {Object} Objeto con los valores del formulario
 */
function getMachineFormData(formId = 'machine-form') {
    const form = document.getElementById(formId);
    if (!form) return {};
    
    return {
        number: document.getElementById('machine-number')?.value || '',
        brand: document.getElementById('machine-brand')?.value || '',
        plate: document.getElementById('machine-plate')?.value || '',
        year: document.getElementById('machine-year')?.value || '',
        status: document.getElementById('machine-status')?.value || '',
        driver: document.getElementById('machine-driver')?.value || '',
        initialKm: document.getElementById('machine-initial-km')?.value || ''
    };
}

/**
 * Valida el formulario de máquina
 * @param {string} formId - ID del formulario
 * @returns {Object} { valid: boolean, errors: Array }
 */
function validateMachineForm(formId = 'machine-form') {
    const data = getMachineFormData(formId);
    const errors = [];
    
    if (!data.number || data.number.trim() === '') {
        errors.push('El número de máquina es requerido');
    }
    
    if (!data.brand || data.brand.trim() === '') {
        errors.push('La marca es requerida');
    }
    
    if (!data.plate || data.plate.trim() === '') {
        errors.push('La patente es requerida');
    }
    
    if (data.year && (parseInt(data.year) < 1990 || parseInt(data.year) > 2035)) {
        errors.push('El año debe estar entre 1990 y 2035');
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

