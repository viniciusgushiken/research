const state = {
  data: null,
  filters: {
    search: "",
    theme: "",
    domain: "",
    type: "",
    ministry: "",
    date: "",
    onlyPairs: false,
    sort: "date-desc",
  },
};

const els = {
  sourceRange: document.querySelector("#sourceRange"),
  sourceTotal: document.querySelector("#sourceTotal"),
  metricTotal: document.querySelector("#metricTotal"),
  metricAverage: document.querySelector("#metricAverage"),
  metricPeak: document.querySelector("#metricPeak"),
  metricPairs: document.querySelector("#metricPairs"),
  search: document.querySelector("#search"),
  themeFilter: document.querySelector("#themeFilter"),
  domainFilter: document.querySelector("#domainFilter"),
  typeFilter: document.querySelector("#typeFilter"),
  ministryFilter: document.querySelector("#ministryFilter"),
  dateFilter: document.querySelector("#dateFilter"),
  sortOrder: document.querySelector("#sortOrder"),
  onlyPairs: document.querySelector("#onlyPairs"),
  clearFilters: document.querySelector("#clearFilters"),
  dailyChart: document.querySelector("#dailyChart"),
  ministryChart: document.querySelector("#ministryChart"),
  resultCount: document.querySelector("#resultCount"),
  activeChips: document.querySelector("#activeChips"),
  themeSummary: document.querySelector("#themeSummary"),
  records: document.querySelector("#records"),
  dialog: document.querySelector("#detailDialog"),
  closeDialog: document.querySelector("#closeDialog"),
  detailMeta: document.querySelector("#detailMeta"),
  detailTitle: document.querySelector("#detailTitle"),
  detailTags: document.querySelector("#detailTags"),
  detailChanges: document.querySelector("#detailChanges"),
  detailText: document.querySelector("#detailText"),
  detailPdf: document.querySelector("#detailPdf"),
};

const formatNumber = new Intl.NumberFormat("pt-BR");

fetch("data.json")
  .then((response) => response.json())
  .then((payload) => {
    state.data = payload;
    renderMeta();
    setupFilters();
    renderCharts();
    render();
  });

function renderMeta() {
  const { meta } = state.data;
  els.sourceRange.textContent = `${meta.dateStart} a ${meta.dateEnd}`;
  els.sourceTotal.textContent = `${formatNumber.format(meta.total)} XMLs processados`;
  els.metricTotal.textContent = formatNumber.format(meta.total);
  els.metricAverage.textContent = formatNumber.format(meta.dailyAverage);
  els.metricPeak.textContent = `${meta.dailyMax.date} (${formatNumber.format(meta.dailyMax.count)})`;
  els.metricPairs.textContent = formatNumber.format(meta.retificationsWithPairs);
}

function setupFilters() {
  fillSelect(els.themeFilter, "Todas", state.data.themes);
  fillSelect(els.domainFilter, "Todas", state.data.domains);
  fillSelect(els.typeFilter, "Todos", state.data.types);
  fillSelect(els.ministryFilter, "Todos", state.data.ministries);
  fillSelect(
    els.dateFilter,
    "Todas",
    state.data.dailyCounts.map((item) => ({ name: item.date, count: item.count }))
  );

  els.search.addEventListener("input", () => {
    state.filters.search = els.search.value.trim().toLowerCase();
    render();
  });
  els.themeFilter.addEventListener("change", () => {
    state.filters.theme = els.themeFilter.value;
    render();
  });
  els.domainFilter.addEventListener("change", () => {
    state.filters.domain = els.domainFilter.value;
    render();
  });
  els.typeFilter.addEventListener("change", () => {
    state.filters.type = els.typeFilter.value;
    render();
  });
  els.ministryFilter.addEventListener("change", () => {
    state.filters.ministry = els.ministryFilter.value;
    render();
  });
  els.dateFilter.addEventListener("change", () => {
    state.filters.date = els.dateFilter.value;
    render();
  });
  els.sortOrder.addEventListener("change", () => {
    state.filters.sort = els.sortOrder.value;
    render();
  });
  els.onlyPairs.addEventListener("change", () => {
    state.filters.onlyPairs = els.onlyPairs.checked;
    render();
  });
  els.clearFilters.addEventListener("click", clearFilters);
  els.closeDialog.addEventListener("click", () => els.dialog.close());
}

function fillSelect(select, label, items) {
  select.innerHTML = `<option value="">${label}</option>`;
  for (const item of items) {
    const option = document.createElement("option");
    option.value = item.name;
    option.textContent = `${item.name} (${formatNumber.format(item.count)})`;
    select.append(option);
  }
}

function renderCharts() {
  const maxDay = Math.max(...state.data.dailyCounts.map((item) => item.count));
  els.dailyChart.innerHTML = state.data.dailyCounts
    .map(
      (item) => `
        <div class="bar-row" title="${item.date}: ${item.count}">
          <span>${item.date.slice(0, 5)}</span>
          <button class="bar-track" type="button" data-date="${item.date}" aria-label="Filtrar ${item.date}">
            <span class="bar-fill" style="width:${(item.count / maxDay) * 100}%"></span>
          </button>
          <strong>${item.count}</strong>
        </div>`
    )
    .join("");
  els.dailyChart.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.date = button.dataset.date;
      els.dateFilter.value = button.dataset.date;
      render();
    });
  });

  els.ministryChart.innerHTML = state.data.ministries
    .slice(0, 10)
    .map(
      (item) => `
        <button class="rank-item" type="button" data-ministry="${escapeAttr(item.name)}">
          <strong>${escapeHtml(item.name)}</strong>
          <span>${formatNumber.format(item.count)} atos</span>
        </button>`
    )
    .join("");
  els.ministryChart.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.ministry = button.dataset.ministry;
      els.ministryFilter.value = button.dataset.ministry;
      render();
    });
  });
}

function render() {
  const filtered = sortRecords(state.data.records.filter(matchesFilters));
  els.resultCount.textContent = `${formatNumber.format(filtered.length)} de ${formatNumber.format(state.data.meta.total)} atos`;
  renderActiveChips();
  renderThemeSummary(filtered);
  renderRecords(filtered.slice(0, 220));
}

function matchesFilters(record) {
  const f = state.filters;
  if (f.theme && record.theme !== f.theme) return false;
  if (f.domain && record.domain !== f.domain) return false;
  if (f.type && record.type !== f.type) return false;
  if (f.ministry && record.ministry !== f.ministry) return false;
  if (f.date && record.date !== f.date) return false;
  if (f.onlyPairs && !record.oldNew.length) return false;
  if (f.search) {
    const text = `${record.title} ${record.summary} ${record.ministry} ${record.unit} ${record.category} ${record.type}`.toLowerCase();
    if (!text.includes(f.search)) return false;
  }
  return true;
}

function sortRecords(records) {
  const sorted = [...records];
  const sorters = {
    "date-desc": (a, b) => b.isoDate.localeCompare(a.isoDate) || a.ministry.localeCompare(b.ministry),
    "date-asc": (a, b) => a.isoDate.localeCompare(b.isoDate) || a.ministry.localeCompare(b.ministry),
    theme: (a, b) => a.theme.localeCompare(b.theme) || b.isoDate.localeCompare(a.isoDate),
    ministry: (a, b) => a.ministry.localeCompare(b.ministry) || b.isoDate.localeCompare(a.isoDate),
  };
  return sorted.sort(sorters[state.filters.sort]);
}

function renderActiveChips() {
  const chips = [];
  const labels = {
    theme: "Categoria",
    domain: "Área",
    type: "Tipo",
    ministry: "Órgão",
    date: "Data",
    search: "Busca",
  };
  for (const key of Object.keys(labels)) {
    if (state.filters[key]) chips.push(`${labels[key]}: ${state.filters[key]}`);
  }
  if (state.filters.onlyPairs) chips.push("Apenas Onde se lê / Leia-se");
  els.activeChips.innerHTML = chips.map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`).join("");
}

function renderThemeSummary(records) {
  const counts = new Map();
  for (const record of records) counts.set(record.theme, (counts.get(record.theme) || 0) + 1);
  els.themeSummary.innerHTML = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(
      ([theme, count]) => `
        <button class="theme-card" type="button" data-theme="${escapeAttr(theme)}">
          <span>${escapeHtml(theme)}</span>
          <strong>${formatNumber.format(count)}</strong>
        </button>`
    )
    .join("");
  els.themeSummary.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.theme = button.dataset.theme;
      els.themeFilter.value = button.dataset.theme;
      render();
    });
  });
}

function renderRecords(records) {
  if (!records.length) {
    els.records.innerHTML = `<p>Nenhum ato encontrado com os filtros atuais.</p>`;
    return;
  }
  els.records.innerHTML = records.map(renderRecord).join("");
  els.records.querySelectorAll("button[data-id]").forEach((button) => {
    button.addEventListener("click", () => openRecord(button.dataset.id));
  });
}

function renderRecord(record) {
  return `
    <article class="record">
      <div class="record-head">
        <div>
          <div class="meta">${record.date} · ${escapeHtml(record.type)} · ${escapeHtml(record.ministry)} · pág. ${escapeHtml(record.page)}</div>
          <h3>${escapeHtml(record.title)}</h3>
        </div>
        <button type="button" data-id="${escapeAttr(record.id)}">Detalhes</button>
      </div>
      <div class="chips">
        <span class="chip theme">${escapeHtml(record.theme)}</span>
        <span class="chip">${escapeHtml(record.domain)}</span>
        <span class="chip">${escapeHtml(record.unit)}</span>
      </div>
      ${record.oldNew.length ? renderChanges(record.oldNew.slice(0, 2)) : ""}
      <p>${escapeHtml(record.summary)}</p>
    </article>`;
}

function renderChanges(changes) {
  return `
    <div class="changes">
      ${changes
        .map(
          (change) => `
            <div class="change-pair">
              <del>Antes: ${escapeHtml(change.old)}</del>
              <ins>Depois: ${escapeHtml(change.new)}</ins>
            </div>`
        )
        .join("")}
    </div>`;
}

function openRecord(id) {
  const record = state.data.records.find((item) => item.id === id);
  if (!record) return;
  els.detailMeta.textContent = `${record.date} · ${record.type} · edição ${record.edition} · página ${record.page} · ${record.file}`;
  els.detailTitle.textContent = record.title;
  els.detailTags.innerHTML = [record.theme, record.domain, record.ministry, record.unit]
    .map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`)
    .join("");
  els.detailChanges.innerHTML = record.oldNew.length ? renderChanges(record.oldNew) : "";
  els.detailText.textContent = record.text;
  els.detailPdf.href = record.pdf;
  els.dialog.showModal();
}

function clearFilters() {
  state.filters = {
    search: "",
    theme: "",
    domain: "",
    type: "",
    ministry: "",
    date: "",
    onlyPairs: false,
    sort: "date-desc",
  };
  els.search.value = "";
  els.themeFilter.value = "";
  els.domainFilter.value = "";
  els.typeFilter.value = "";
  els.ministryFilter.value = "";
  els.dateFilter.value = "";
  els.onlyPairs.checked = false;
  els.sortOrder.value = "date-desc";
  render();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
