document.addEventListener('DOMContentLoaded', () => {
  console.log('Script cargado');

  // Generar lista de 100 agentes
  const skillPool = ['Soporte', 'Ventas', 'Desarrollo', 'QA', 'Infra', 'Marketing', 'Administración'];
  const presenciaOptions = ['En línea', 'Ausente', 'Desconocido'];

  const agentes = Array.from({ length: 100 }, (_, i) => {
    const idNum = String(i + 1).padStart(3, '0');
    // elegir entre 1 y 3 skills
    const skillsCount = 1 + (i % 3);
    const skills = Array.from({ length: skillsCount }, () => skillPool[Math.floor(Math.random() * skillPool.length)])
      .filter((v, idx, arr) => arr.indexOf(v) === idx)
      .join(', ');
    return {
      name: `Agente ${i + 1}`,
      id: `A${idNum}`,
      mail: `agente${i + 1}@example.com`,
      estado: (i % 4 === 0) ? 'Activo' : 'Inactivo',
      skills,
      presencia: presenciaOptions[i % presenciaOptions.length]
    };
  });

  // Rellenar la tabla
  const tbody = document.querySelector('table tbody');
  tbody.innerHTML = '';
  agentes.forEach((agente, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${agente.id}</td>
      <td>${agente.name}</td>
      <td>${agente.mail}</td>
      <td>${agente.presencia}</td>
      <td>${agente.skills}</td>
      <td>${agente.estado}</td>
    `;
    tr.addEventListener('click', () => {
      alert(`Has seleccionado ${agente.name} (${agente.id})`);
    });
    tbody.appendChild(tr);
  });

  console.log(`Se han generado ${agentes.length} agentes y rellenado la tabla.`);
});

// Habilitar/deshabilitar botón de búsqueda según inputs
document.addEventListener('DOMContentLoaded', () => {
  const queueName = document.getElementById('queueName');
  const queueId = document.getElementById('queueId');
  const searchBtn = document.getElementById('searchBtn');

  function updateButtonState() {
    // Activar sólo si queueName tiene texto OR queueId es un UUID válido
    const nameFilled = queueName && queueName.value.trim() !== '';
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const idValid = queueId && uuidRegex.test(queueId.value.trim());
    const enabled = nameFilled || idValid;
    if (searchBtn) searchBtn.disabled = !enabled;
  }

  [queueName, queueId].forEach(el => {
    if (!el) return;
    el.addEventListener('input', updateButtonState);
  });

  // Formateo y validación para queueId: sólo hex, añade guiones en 8-4-4-4-12
  if (queueId) {
    const boundaries = [8, 12, 16, 20];
    function formatHexWithDashes(hex) {
      const parts = [];
      let i = 0;
      for (const b of boundaries) {
        const part = hex.slice(i, b);
        if (part) parts.push(part);
        i = b;
      }
      const last = hex.slice(i);
      if (last) parts.push(last);
      return parts.join('-');
    }

    function formatUUIDInput(e) {
      const el = e.target;
      const raw = el.value;
      const selStart = el.selectionStart || 0;

      // Count hex chars before cursor
      const rawBefore = raw.slice(0, selStart);
      const cleanedBefore = rawBefore.replace(/[^0-9a-fA-F]/g, '');

      // Clean full value: only hex, max 32 chars, lowercase
      let cleaned = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 32).toLowerCase();

      const formatted = formatHexWithDashes(cleaned);

      // Formatted cursor position is length of formattedBefore
      const formattedBefore = formatHexWithDashes(cleanedBefore);

      el.value = formatted;

      try {
        const pos = formattedBefore.length;
        el.setSelectionRange(pos, pos);
      } catch (err) {
        // ignore
      }
    }

    queueId.addEventListener('input', formatUUIDInput);
    // Prevent non-hex key presses (optional UX improvement)
    queueId.addEventListener('keypress', (ev) => {
      const ch = ev.key;
      if (/^[0-9a-fA-F]$/.test(ch) || ev.key === 'Backspace' || ev.key === 'Delete') {
        return;
      }
      // Allow control keys
      if (ev.ctrlKey || ev.metaKey || ev.key.length > 1) return;
      ev.preventDefault();
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const qName = queueName ? queueName.value.trim() : '';
      const qId = queueId ? queueId.value.trim() : '';
      alert(`Buscar: ${qName || '(sin nombre)'} ${qId ? 'ID=' + qId : ''}`);
    });
  }
});
