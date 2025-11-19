document.addEventListener('DOMContentLoaded', () => {
  const state = {
    general: {
      number: '05',
      brand: 'Mercedes-Benz',
      plate: 'ABCD-12',
      year: '2018',
      status: 'Operativa',
      driver: 'Juan Pérez'
    },
    documentation: {
      revision: '2023-11-20',
      permit: '2024-03-31',
      insurance: '2024-01-15'
    },
    assignments: {
      current: {
        driver: 'Juan Pérez',
        start: '2025-10-01',
        shift: 'Mañana',
        route: 'Ramal Centro',
        notes: 'Sin novedades',
        end: null
      },
      history: [
        { driver: 'Laura Díaz', start: '2025-08-01', end: '2025-09-30' },
        { driver: 'Pedro López', start: '2025-05-01', end: '2025-07-31' }
      ]
    },
    dailyRecords: [
      { date: '2025-11-16', driver: 'Juan Pérez', status: 'Cerrado', collected: 150000, diesel: 35000, obs: true },
      { date: '2025-11-15', driver: 'Juan Pérez', status: 'Cerrado', collected: 145000, diesel: 32000, obs: false },
      { date: '2025-11-14', driver: 'Laura Díaz', status: 'Abierto', collected: 0, diesel: 0, obs: true },
    ]
  };

  const tabButtons = document.querySelectorAll('.tab-item');
  const machineNumberHeader = document.getElementById('machine-number-header');
  const machineNumberView = document.getElementById('machine-number-view');
  const machineBrandView  = document.getElementById('machine-brand-view');
  const machinePlateView  = document.getElementById('machine-plate-view');
  const machineYearView   = document.getElementById('machine-year-view');
  const machineStatusView = document.getElementById('machine-status-view');
  const machineDriverView = document.getElementById('machine-driver-view');

  const generalInfoCard   = document.getElementById('general-info-card');
  const editGeneralBtn    = document.getElementById('edit-general-btn');
  const saveGeneralBtn    = document.getElementById('save-general-btn');
  const cancelGeneralBtn  = document.getElementById('cancel-general-btn');
  const formContainerEdit = document.getElementById('machine-form-container-edit');

  const revDateView      = document.getElementById('rev-date-view');
  const permitDateView   = document.getElementById('permit-date-view');
  const insDateView      = document.getElementById('insurance-date-view');
  const revDateInput     = document.getElementById('rev-date-input');
  const permitDateInput  = document.getElementById('permit-date-input');
  const insDateInput     = document.getElementById('insurance-date-input');

  const documentationCard     = document.getElementById('documentation-card');
  const editDocumentationBtn  = document.getElementById('documentation-edit-btn');
  const saveDocumentationBtn  = document.getElementById('documentation-save-btn');
  const cancelDocumentationBtn = document.getElementById('documentation-cancel-btn');

  const filterDriverSelect = document.getElementById('filter-driver-select');
  const recordsBody        = document.getElementById('daily-records-body');

  const assignmentHistoryList   = document.getElementById('assignment-history-list');
  const assignmentEmptyState    = document.getElementById('assignment-empty-state');
  const assignmentChipFilters   = document.querySelectorAll('[data-history-filter]');
  
  let currentAssignmentFilter = 'all';

  const formatHeader = () => `Maquina ${state.general.number} - ${state.general.brand}`;

  const formatNumber = (value) => {
    if (typeof value !== 'number') return value;
    try {
      return value.toLocaleString('es-CL');
    } catch (error) {
      return value.toLocaleString();
    }
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return value;
    try {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    } catch (error) {
      return `$${value.toLocaleString()}`;
    }
  };

  const renderInfoView = () => {
    machineNumberView.textContent = state.general.number;
    machineBrandView.textContent  = state.general.brand;
    machinePlateView.textContent  = state.general.plate;
    machineYearView.textContent   = state.general.year;
    
    // Renderizar estado operativo con status-pill
    const statusContainer = document.getElementById('machine-status-view-container');
    if (statusContainer) {
      const statusClass = state.general.status === 'Operativa' ? 'status-pill--ok' : 'status-pill--error';
      statusContainer.innerHTML = `<span class="status-pill ${statusClass}">${state.general.status}</span>`;
    }
    
    machineDriverView.textContent = state.general.driver || '(Sin Asignar)';
    machineNumberHeader.textContent = formatHeader();
    
    // Actualizar aria-label del avatar con información dinámica
    const avatar = document.querySelector('.machine-avatar');
    if (avatar) {
      avatar.setAttribute('aria-label', `Icono de Micro ${state.general.brand} ${state.general.number}`);
    }
  };

  const renderDocumentation = () => {
    revDateView.textContent    = state.documentation.revision;
    permitDateView.textContent = state.documentation.permit;
    insDateView.textContent    = state.documentation.insurance;
    if (revDateInput) revDateInput.value = state.documentation.revision;
    if (permitDateInput) permitDateInput.value = state.documentation.permit;
    if (insDateInput) insDateInput.value = state.documentation.insurance;
  };

  const populateRecordFilters = () => {
    if (!filterDriverSelect) return;
    const drivers = Array.from(new Set(state.dailyRecords.map(r => r.driver)));

    filterDriverSelect.innerHTML = '<option value="all">Todos</option>' +
      drivers.map(driver => `<option value="${driver}">${driver}</option>`).join('');
  };

  const renderDailyRecords = () => {
    if (!recordsBody) return;
    
    const driverFilter = filterDriverSelect?.value || 'all';
    const emptyState = document.getElementById('records-empty-state');
    const tableContainer = document.querySelector('#daily-records-section .data-table-container table');

    recordsBody.innerHTML = '';
    const filtered = state.dailyRecords.filter(record => {
      const driverMatch = driverFilter === 'all' || record.driver === driverFilter;
      return driverMatch;
    });

    // Manejar estado vacío
    if (!filtered.length) {
      if (tableContainer) tableContainer.style.display = 'none';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    // Mostrar tabla y ocultar estado vacío
    if (tableContainer) tableContainer.style.display = 'table';
    if (emptyState) emptyState.style.display = 'none';

    filtered.forEach(record => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${record.date}</td>
        <td>${record.driver}</td>
        <td style="text-align: right;" class="tabular-nums">${formatCurrency(record.collected)}</td>
        <td style="text-align: right;" class="tabular-nums">${formatCurrency(record.diesel)}</td>
        <td style="text-align: center;">
          ${record.obs ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="vertical-align: middle;" title="Tiene observaciones"><circle cx="8" cy="8" r="7" stroke="currentColor" fill="none" stroke-width="1.5"/><circle cx="8" cy="12" r="0.8" fill="currentColor"/><path d="M8 5v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' : '—'}
        </td>
        <td>
          <a href="admin-registro-diario.html?mode=view" class="btn-link btn-sm">Ver Detalle</a>
        </td>
      `;
      recordsBody.appendChild(tr);
    });
  };

  const renderAssignments = () => {
    if (!assignmentHistoryList) return;
    const { current, history } = state.assignments;

    const rows = [];
    if (current && current.driver) {
      rows.push({ ...current, isCurrent: true, startSort: current.start });
    }
    history.forEach(entry => rows.push({ ...entry, isCurrent: false, startSort: entry.start }));
    rows.sort((a, b) => new Date(b.startSort) - new Date(a.startSort));

    // Aplicar filtro
    const filtered = rows.filter(row => {
      if (currentAssignmentFilter === 'all') return true;
      if (currentAssignmentFilter === 'current') return row.isCurrent && !row.end;
      if (currentAssignmentFilter === 'closed') return row.end !== null && row.end !== undefined;
      return true;
    });

    assignmentHistoryList.innerHTML = '';

    // Manejar estado vacío
    if (!filtered.length) {
      if (assignmentEmptyState) assignmentEmptyState.style.display = 'flex';
      return;
    }
    if (assignmentEmptyState) assignmentEmptyState.style.display = 'none';

    const table = document.createElement('table');
    table.className = 'data-table data-table--compact';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Chofer</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th style="width: 120px;">Duración</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    filtered.forEach(row => {
      const tr = document.createElement('tr');
      
      // Calcular duración
      let duration = '--';
      if (row.start) {
        const startDate = new Date(row.start);
        const endDate = row.end ? new Date(row.end) : new Date();
        const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        duration = days === 0 ? 'Hoy' : days === 1 ? '1 día' : `${days} días`;
      }
      
      // Destacar asignación activa
      if (row.isCurrent && !row.end) {
        tr.style.backgroundColor = 'rgba(37, 99, 235, 0.04)';
        tr.style.fontWeight = 'var(--font-weight-medium)';
      }
      
      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: var(--space-xs);">
            <span>${row.driver}</span>
            ${row.isCurrent && !row.end ? '<span class="status-pill status-pill--ok" style="font-size: 11px; padding: 2px 8px;">ACTIVA</span>' : ''}
          </div>
        </td>
        <td>${row.start || '--'}</td>
        <td>${row.end || '<span style="color: var(--color-text-secondary);">En curso</span>'}</td>
        <td style="color: var(--color-text-secondary);">${duration}</td>
      `;
      tbody.appendChild(tr);
    });

    assignmentHistoryList.appendChild(table);
  };

  const buildEditFormHTML = () => `
    <form id="machine-form-edit">
      <div class="form-field">
        <label class="form-field__label" for="machine-number">Número</label>
        <input id="machine-number" class="input-text" value="${state.general.number}">
      </div>
      <div class="form-field">
        <label class="form-field__label" for="machine-brand">Marca</label>
        <input id="machine-brand" class="input-text" value="${state.general.brand}">
      </div>
      <div class="form-field">
        <label class="form-field__label" for="machine-plate">Patente</label>
        <input id="machine-plate" class="input-text" value="${state.general.plate}">
      </div>
      <div class="form-field">
        <label class="form-field__label" for="machine-year">Año</label>
        <input id="machine-year" class="input-text" value="${state.general.year}">
      </div>
      <div class="form-field">
        <label class="form-field__label" for="machine-status">Estado Operativo</label>
        <input id="machine-status" class="input-text" value="${state.general.status}">
      </div>
      <div class="form-field">
        <label class="form-field__label" for="machine-driver">Chofer Asignado</label>
        <input id="machine-driver" class="input-text" value="${state.general.driver}">
      </div>
    </form>
  `;

  const enterEditMode = () => {
    generalInfoCard.classList.add('is-editing');
    if (formContainerEdit) {
      formContainerEdit.innerHTML = buildEditFormHTML();
    }
    editGeneralBtn.style.display   = 'none';
    saveGeneralBtn.style.display   = 'inline-flex';
    cancelGeneralBtn.style.display = 'inline-flex';
  };

  const exitEditMode = () => {
    generalInfoCard.classList.remove('is-editing');
    editGeneralBtn.style.display   = 'inline-flex';
    saveGeneralBtn.style.display   = 'none';
    cancelGeneralBtn.style.display = 'none';
  };

  const saveGeneral = () => {
    const form = document.getElementById('machine-form-edit');
    if (!form) return;
    state.general.number = form.querySelector('#machine-number').value.trim();
    state.general.brand  = form.querySelector('#machine-brand').value.trim();
    state.general.plate  = form.querySelector('#machine-plate').value.trim();
    state.general.year   = form.querySelector('#machine-year').value.trim();
    state.general.status = form.querySelector('#machine-status').value.trim();
    state.general.driver = form.querySelector('#machine-driver').value.trim();

    renderInfoView();
    renderDocumentation();
    exitEditMode();
  };

  const enterDocumentationEditMode = () => {
    documentationCard.classList.add('is-editing');
    editDocumentationBtn.style.display   = 'none';
    saveDocumentationBtn.style.display   = 'inline-flex';
    cancelDocumentationBtn.style.display = 'inline-flex';
  };

  const exitDocumentationEditMode = () => {
    documentationCard.classList.remove('is-editing');
    editDocumentationBtn.style.display   = 'inline-flex';
    saveDocumentationBtn.style.display   = 'none';
    cancelDocumentationBtn.style.display = 'none';
  };

  const saveDocumentation = () => {
    state.documentation.revision  = revDateInput?.value || state.documentation.revision;
    state.documentation.permit    = permitDateInput?.value || state.documentation.permit;
    state.documentation.insurance = insDateInput?.value || state.documentation.insurance;

    renderDocumentation();
    exitDocumentationEditMode();
    
    // Aquí se podría agregar una llamada a una API para guardar los datos
    console.log('Documentación actualizada:', state.documentation);
  };

  // Tab navigation
  tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('aria-controls');

      // Update tabs
      tabButtons.forEach(t => {
        t.classList.remove('tab-item--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('tab-item--active');
      tab.setAttribute('aria-selected', 'true');

      // Update content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
      });
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = 'block';
      }
    });
  });

  editGeneralBtn?.addEventListener('click', enterEditMode);
  saveGeneralBtn?.addEventListener('click', saveGeneral);
  cancelGeneralBtn?.addEventListener('click', () => {
    exitEditMode();
    renderInfoView();
    renderDocumentation();
  });

  editDocumentationBtn?.addEventListener('click', enterDocumentationEditMode);
  saveDocumentationBtn?.addEventListener('click', saveDocumentation);
  cancelDocumentationBtn?.addEventListener('click', () => {
    exitDocumentationEditMode();
    renderDocumentation();
  });

  filterDriverSelect?.addEventListener('change', renderDailyRecords);

  // Chip filters para asignaciones
  assignmentChipFilters.forEach(chip => {
    chip.addEventListener('click', () => {
      // Remover active de todos
      assignmentChipFilters.forEach(c => c.classList.remove('is-active'));
      // Agregar active al clickeado
      chip.classList.add('is-active');
      // Actualizar filtro actual
      currentAssignmentFilter = chip.getAttribute('data-history-filter');
      // Re-renderizar
      renderAssignments();
    });
  });

  renderInfoView();
  renderDocumentation();
  populateRecordFilters();
  renderDailyRecords();
  renderAssignments();
});
