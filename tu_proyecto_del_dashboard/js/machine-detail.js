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

  const sectionButtons = document.querySelectorAll('.section-switcher__button');
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
  const filterStatusSelect = document.getElementById('filter-status-select');
  const recordsBody        = document.getElementById('daily-records-body');

  const assignmentHistoryList   = document.getElementById('assignment-history-list');
  const assignmentHistoryEmpty  = document.getElementById('assignment-history-empty');

  const formatHeader = () => `Maquina ${state.general.number} - ${state.general.brand}`;

  const formatNumber = (value) => {
    if (typeof value !== 'number') return value;
    try {
      return value.toLocaleString('es-CL');
    } catch (error) {
      return value.toLocaleString();
    }
  };

  const renderInfoView = () => {
    machineNumberView.textContent = state.general.number;
    machineBrandView.textContent  = state.general.brand;
    machinePlateView.textContent  = state.general.plate;
    machineYearView.textContent   = state.general.year;
    machineStatusView.textContent = state.general.status;
    machineDriverView.textContent = state.general.driver || '(Sin Asignar)';
    machineNumberHeader.textContent = formatHeader();
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
    if (!filterDriverSelect || !filterStatusSelect) return;
    const drivers = Array.from(new Set(state.dailyRecords.map(r => r.driver)));
    const statuses = Array.from(new Set(state.dailyRecords.map(r => r.status)));

    filterDriverSelect.innerHTML = '<option value="all">Todos</option>' +
      drivers.map(driver => `<option value="${driver}">${driver}</option>`).join('');
    filterStatusSelect.innerHTML = '<option value="all">Todos</option>' +
      statuses.map(status => `<option value="${status}">${status}</option>`).join('');
  };

  const renderDailyRecords = () => {
    if (!recordsBody) return;
    const driverFilter = filterDriverSelect?.value || 'all';
    const statusFilter = filterStatusSelect?.value || 'all';

    recordsBody.innerHTML = '';
    const filtered = state.dailyRecords.filter(record => {
      const driverMatch = driverFilter === 'all' || record.driver === driverFilter;
      const statusMatch = statusFilter === 'all' || record.status === statusFilter;
      return driverMatch && statusMatch;
    });

    if (!filtered.length) {
      recordsBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay registros disponibles.</td></tr>';
      return;
    }

    filtered.forEach(record => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
                      <td>${record.date}</td>
                      <td>${record.driver}</td>
                      <td><span class="status-pill status-pill--${record.status === 'Cerrado' ? 'default' : 'ok'}">${record.status}</span></td>
                      <td>${formatNumber(record.collected)}</td>
                      <td>${formatNumber(record.diesel)}</td>
                      <td style="text-align: center;">
                          ${record.obs ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="opacity: 0.8;"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/></svg>' : ''}
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

    assignmentHistoryList.innerHTML = '';

    if (!rows.length) {
      assignmentHistoryEmpty?.classList.add('is-visible');
      return;
    }
    assignmentHistoryEmpty?.classList.remove('is-visible');

    const table = document.createElement('table');
    table.className = 'data-table data-table--compact';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Chofer</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    rows.forEach(row => {
      const tr = document.createElement('tr');
      const estado = row.isCurrent && !row.end ? 'Activa' : (row.end ? 'Cerrada' : 'En curso');
      tr.innerHTML = `
        <td>${row.driver}</td>
        <td>${row.start || '--'}</td>
        <td>${row.end || 'En curso'}</td>
        <td><span class="status-pill status-pill--${row.isCurrent && !row.end ? 'ok' : 'default'}">${estado}</span></td>
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

  sectionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-active')) return;

      sectionButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const targetId = btn.getAttribute('data-target');
      const section = document.getElementById(targetId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  filterStatusSelect?.addEventListener('change', renderDailyRecords);

  renderInfoView();
  renderDocumentation();
  populateRecordFilters();
  renderDailyRecords();
  renderAssignments();
});
