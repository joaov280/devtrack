// js/ui.js

let _onMonthSelect = null;
let _onWeekSelect = null;

function _mwKey() { return `${state.monthIndex}-${state.weekIndex}`; }
function _taskKey(i) { return `${state.monthIndex}-${state.weekIndex}-${i}`; }

function _normalizeExtrasForKey(key) {
  const arr = state.extras[key] || [];
  if (arr.length && typeof arr[0] === "string") {
    state.extras[key] = arr.map(t => ({ title: t, deleted: false }));
    saveData("devtrack_extras", state.extras);
  }
}

function _getTasksWithMeta() {
  const month = window.CURRICULUM[state.monthIndex];
  const week = month.weeks[state.weekIndex];

  const key = _mwKey();
  _normalizeExtrasForKey(key);

  const base = week.tasks.map((t) => ({ title: t, type: "base", deleted: false }));
  const extras = (state.extras[key] || []).map((obj) => ({
    title: obj.title,
    type: "extra",
    deleted: !!obj.deleted,
  }));

  const all = base.concat(extras);
  return all.map((t, index) => ({ ...t, index }));
}

/* ===== Dropdown custom ===== */

function _closeAllDropdowns() {
  document.querySelectorAll(".dd.open").forEach(dd => dd.classList.remove("open"));
}

function _setupDropdown(ddId, btnId, menuId) {
  const dd = document.getElementById(ddId);
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);

  if (!dd || !btn || !menu) return { dd: null, btn: null, menu: null };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dd.classList.contains("open");
    _closeAllDropdowns();
    if (!isOpen) dd.classList.add("open");
  });

  return { dd, btn, menu };
}

document.addEventListener("click", _closeAllDropdowns);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") _closeAllDropdowns(); });

const _monthUI = _setupDropdown("monthDD", "monthBtn", "monthMenu");
const _weekUI  = _setupDropdown("weekDD", "weekBtn", "weekMenu");

function renderMonths(onSelect) {
  _onMonthSelect = onSelect;

  const menu = _monthUI.menu;
  const label = document.getElementById("monthLabel");
  if (!menu || !label) return;

  menu.innerHTML = "";

  window.CURRICULUM.forEach((m, idx) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "dd-item" + (idx === state.monthIndex ? " active" : "");
    item.textContent = m.title;

    item.addEventListener("click", () => {
      state.monthIndex = idx;
      state.weekIndex = 0; // opcional: volta pra semana 1 ao trocar mês
      label.textContent = m.title;
      _closeAllDropdowns();

      renderMonths(_onMonthSelect);
      renderWeeks(_onWeekSelect);

      if (typeof _onMonthSelect === "function") _onMonthSelect(idx);
    });

    menu.appendChild(item);
  });

  label.textContent = window.CURRICULUM[state.monthIndex].title;
}

function renderWeeks(onSelect) {
  _onWeekSelect = onSelect;

  const menu = _weekUI.menu;
  const label = document.getElementById("weekLabel");
  if (!menu || !label) return;

  menu.innerHTML = "";

  const weeks = window.CURRICULUM[state.monthIndex].weeks;

  weeks.forEach((w, idx) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "dd-item" + (idx === state.weekIndex ? " active" : "");
    item.textContent = w.title;

    item.addEventListener("click", () => {
      state.weekIndex = idx;
      label.textContent = w.title;
      _closeAllDropdowns();

      renderWeeks(_onWeekSelect);

      if (typeof _onWeekSelect === "function") _onWeekSelect(idx);
    });

    menu.appendChild(item);
  });

  label.textContent = weeks[state.weekIndex]?.title || "Semana";
}

/* ===== Barra de progresso ===== */

function updateProgressBar() {
  const all = _getTasksWithMeta().filter(t => !t.deleted);
  const total = all.length;

  let done = 0;
  for (let i = 0; i < total; i++) {
    // aqui i é índice "visual" do all filtrado, então melhor contar pelo key real:
    // porém pra manter simples, vamos contar pelo array completo (sem filtrar por deleted)
  }

  // contagem correta (considera deleted removidas)
  const allFull = _getTasksWithMeta();
  let total2 = 0, done2 = 0;
  for (let i = 0; i < allFull.length; i++) {
    if (allFull[i].deleted) continue;
    total2++;
    if (state.progress[_taskKey(i)]) done2++;
  }

  const percent = total2 ? (done2 / total2) * 100 : 0;
  const fill = document.getElementById("progressFill");
  if (fill) fill.style.width = `${percent}%`;
}

/* ===== Render tarefas (NORMAL + BUSCA GLOBAL) ===== */

function renderTasks() {
  const list = document.getElementById("taskList");
  if (!list) return;

  list.innerHTML = "";
  const q = (state.search || "").trim().toLowerCase();

  // ===== BUSCA GLOBAL =====
  if (q) {
    const results = [];

    for (let m = 0; m < window.CURRICULUM.length; m++) {
      for (let w = 0; w < window.CURRICULUM[m].weeks.length; w++) {
        const baseTasks = window.CURRICULUM[m].weeks[w].tasks;
        const keyMW = `${m}-${w}`;
        _normalizeExtrasForKey(keyMW);

        const extras = (state.extras[keyMW] || []);
        const all = baseTasks
          .map(t => ({ title: t, deleted: false, type: "base" }))
          .concat(extras.map(e => ({ title: e.title, deleted: !!e.deleted, type: "extra" })));

        for (let i = 0; i < all.length; i++) {
          const t = all[i];
          if (t.deleted) continue;
          if ((t.title || "").toLowerCase().includes(q)) {
            const where = `${window.CURRICULUM[m].title} • ${window.CURRICULUM[m].weeks[w].title}`;
            results.push({
              m, w, i,
              title: t.title,
              where,
              checked: !!state.progress[`${m}-${w}-${i}`],
              type: t.type
            });
          }
        }
      }
    }

    if (!results.length) {
      const li = document.createElement("li");
      li.textContent = "Nada encontrado.";
      list.appendChild(li);
      updateProgressBar();
      return;
    }

    results.slice(0, 80).forEach(r => {
      const li = document.createElement("li");
      const row = document.createElement("div");
      row.className = "task-row";

      const left = document.createElement("div");
      left.className = "task-left";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = r.checked;

      const title = document.createElement("span");
      title.className = "task-title";
      title.textContent = r.title;

      const small = document.createElement("small");
      small.style.opacity = ".75";
      small.style.display = "block";
      small.textContent = r.where;

      left.appendChild(cb);
      left.appendChild(title);
      left.appendChild(small);

      row.appendChild(left);

      const go = document.createElement("button");
      go.type = "button";
      go.className = "btn-mini";
      go.textContent = "Ir";
      go.addEventListener("click", () => {
        state.monthIndex = r.m;
        state.weekIndex = r.w;

        renderMonths(() => {});
        renderWeeks(() => {});

        state.search = "";
        const searchInput = document.getElementById("searchInput");
        if (searchInput) searchInput.value = "";

        renderTasks();
        renderNotes();
        updateProgressBar();
        renderProgressTab();
        window.features_afterRender?.();
      });

      row.appendChild(go);

      cb.addEventListener("change", () => {
        state.progress[`${r.m}-${r.w}-${r.i}`] = cb.checked;
        saveData("devtrack_progress", state.progress);

        if (cb.checked && window.recordStudyToday) window.recordStudyToday();

        if (window.features_onTaskToggled) {
          window.features_onTaskToggled({
            m: r.m, w: r.w, i: r.i,
            title: r.title,
            checked: cb.checked
          });
        }

        renderProgressTab();
        window.features_afterRender?.();
      });

      li.appendChild(row);
      list.appendChild(li);
    });

    updateProgressBar();
    return;
  }

  // ===== NORMAL (mês/semana atual) =====
  const all = _getTasksWithMeta();
  const baseLen = window.CURRICULUM[state.monthIndex].weeks[state.weekIndex].tasks.length;

  all.forEach((t) => {
    if (t.deleted) return;

    const li = document.createElement("li");

    const row = document.createElement("div");
    row.className = "task-row";

    const left = document.createElement("div");
    left.className = "task-left";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!state.progress[_taskKey(t.index)];

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = t.title;

    left.appendChild(cb);
    left.appendChild(title);

    if (t.type === "extra") {
      const badge = document.createElement("span");
      badge.className = "badge-extra";
      badge.textContent = "extra";
      left.appendChild(badge);
    }

    row.appendChild(left);

    // remover extra (marca como deleted)
    if (t.type === "extra") {
      const del = document.createElement("button");
      del.type = "button";
      del.className = "btn-del";
      del.title = "Remover tarefa extra";
      del.textContent = "🗑️";

      del.addEventListener("click", () => {
        const key = _mwKey();
        _normalizeExtrasForKey(key);

        const extraIndex = t.index - baseLen;
        if (state.extras[key] && state.extras[key][extraIndex]) {
          state.extras[key][extraIndex].deleted = true;
          saveData("devtrack_extras", state.extras);
          renderTasks();
          updateProgressBar();
          renderProgressTab();
          window.features_afterRender?.();
        }
      });

      row.appendChild(del);
    }

    cb.addEventListener("change", () => {
      state.progress[_taskKey(t.index)] = cb.checked;
      saveData("devtrack_progress", state.progress);

      if (cb.checked && window.recordStudyToday) window.recordStudyToday();

      if (window.features_onTaskToggled) {
        window.features_onTaskToggled({
          m: state.monthIndex,
          w: state.weekIndex,
          i: t.index,
          title: t.title,
          checked: cb.checked
        });
      }

      updateProgressBar();
      renderProgressTab();
      window.features_afterRender?.();
    });

    li.appendChild(row);
    list.appendChild(li);
  });

  updateProgressBar();
}

/* ===== Notas ===== */

function renderNotes() {
  const textarea = document.getElementById("weekNotes");
  const saved = document.getElementById("notesSaved");
  if (!textarea) return;

  const key = _mwKey();
  textarea.value = state.notes[key] || "";
  if (saved) saved.textContent = "";
}

function bindNotesAutosave() {
  const textarea = document.getElementById("weekNotes");
  const saved = document.getElementById("notesSaved");
  const saveBtn = document.getElementById("saveNotesBtn");
  if (!textarea) return;

  function doSave(showLabel = true) {
    const key = _mwKey();
    state.notes[key] = textarea.value;
    saveData("devtrack_notes", state.notes);

    if (showLabel && saved) {
      saved.textContent = "salvo ✅";
      setTimeout(() => { if (saved) saved.textContent = ""; }, 900);
    }

    renderProgressTab();
    window.features_afterRender?.();
  }

  let timer = null;
  textarea.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => doSave(true), 250);
  });

  if (saveBtn) saveBtn.addEventListener("click", () => doSave(true));
}

/* ===== Aba Progresso ===== */

function _calcAllStats() {
  let total = 0, done = 0;

  const doneItems = [];
  const pendingItems = [];

  for (let m = 0; m < window.CURRICULUM.length; m++) {
    for (let w = 0; w < window.CURRICULUM[m].weeks.length; w++) {
      const baseTasks = window.CURRICULUM[m].weeks[w].tasks;

      const key = `${m}-${w}`;
      _normalizeExtrasForKey(key);
      const extras = (state.extras[key] || []);

      const allTitles = baseTasks
        .map(t => ({ title: t, deleted: false, type: "base" }))
        .concat(extras.map(e => ({ title: e.title, deleted: !!e.deleted, type: "extra" })));

      for (let i = 0; i < allTitles.length; i++) {
        const t = allTitles[i];
        if (t.deleted) continue;

        total++;

        const pKey = `${m}-${w}-${i}`;
        const completed = !!state.progress[pKey];

        const labelMonth = window.CURRICULUM[m].title;
        const labelWeek = window.CURRICULUM[m].weeks[w].title;

        if (completed) {
          done++;
          doneItems.push({ title: t.title, where: `${labelMonth} • ${labelWeek}` });
        } else {
          pendingItems.push({ title: t.title, where: `${labelMonth} • ${labelWeek}` });
        }
      }
    }
  }

  const notesItems = Object.entries(state.notes || {})
    .filter(([, txt]) => (txt || "").trim().length > 0)
    .map(([k, txt]) => {
      const [m, w] = k.split("-").map(Number);
      const where = `${window.CURRICULUM[m]?.title || "?"} • ${window.CURRICULUM[m]?.weeks[w]?.title || "?"}`;
      const clean = (txt || "").trim();
      return { where, preview: clean.slice(0, 140) + (clean.length > 140 ? "..." : "") };
    });

  return { total, done, doneItems, pendingItems, notesItems };
}

function renderProgressTab() {
  const summaryBox = document.getElementById("summaryBox");
  const pendingBox = document.getElementById("pendingBox");
  const doneBox = document.getElementById("doneBox");
  const notesBox = document.getElementById("notesBox");
  if (!summaryBox || !pendingBox || !doneBox || !notesBox) return;

  const { total, done, doneItems, pendingItems, notesItems } = _calcAllStats();
  const percent = total ? Math.round((done / total) * 100) : 0;

  const st = (window.computeStreaks ? window.computeStreaks() : { now: 0, best: 0 });

  summaryBox.innerHTML = `
    <div><b>Total:</b> ${total}</div>
    <div><b>Concluídas:</b> ${done}</div>
    <div><b>Progresso geral:</b> ${percent}%</div>
    <div><b>Streak:</b> 🔥 ${st.now} (recorde ${st.best})</div>
  `;

  const isMobile = window.matchMedia("(max-width: 820px)").matches;
  const pendingTop = pendingItems.slice(0, isMobile ? 18 : 12); // menos no mobile

  pendingBox.innerHTML = pendingTop.length
    ? pendingTop.map(i => `<div class="item"><div>${escapeHtml(i.title)}</div><small>${escapeHtml(i.where)}</small></div>`).join("")
    : `<div class="item"><div>Nenhuma pendência 🎉</div></div>`;

  const doneTop = doneItems.slice(-12).reverse();
  doneBox.innerHTML = doneTop.length
    ? doneTop.map(i => `<div class="item"><div>${escapeHtml(i.title)}</div><small>${escapeHtml(i.where)}</small></div>`).join("")
    : `<div class="item"><div>Ainda não marcou nenhuma.</div></div>`;

  notesBox.innerHTML = notesItems.length
    ? notesItems.slice(0, 12).map(n => `<div class="item"><div>${escapeHtml(n.where)}</div><small>${escapeHtml(n.preview)}</small></div>`).join("")
    : `<div class="item"><div>Sem anotações ainda.</div></div>`;
}

// helper anti-injection
function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ===== STREAK SYSTEM ===== */

function _todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function _addDays(dateObj, days) {
  const d = new Date(dateObj);
  d.setDate(d.getDate() + days);
  return d;
}

function _dateToKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function recordStudyToday() {
  const k = _todayKey();
  if (!state.studyLog) state.studyLog = {};
  state.studyLog[k] = (state.studyLog[k] || 0) + 1;
  saveData("devtrack_studylog", state.studyLog);
  renderStreak();
}

function computeStreaks() {
  const log = state.studyLog || {};
  const studied = new Set(Object.keys(log).filter(k => Number(log[k]) >= 1));

  let now = 0;
  let cursor = new Date();
  while (studied.has(_dateToKey(cursor))) {
    now++;
    cursor = _addDays(cursor, -1);
  }

  const dates = Array.from(studied).sort();
  let best = 0, run = 0, prev = null;

  for (const k of dates) {
    if (!prev) run = 1;
    else {
      const prevDate = new Date(prev + "T00:00:00");
      const curDate = new Date(k + "T00:00:00");
      const diff = Math.round((curDate - prevDate) / (1000 * 60 * 60 * 24));
      run = (diff === 1) ? run + 1 : 1;
    }
    best = Math.max(best, run);
    prev = k;
  }

  return { now, best, studiedCount: studied.size };
}

function renderStreak() {
  const nowEl = document.getElementById("streakNow");
  const bestEl = document.getElementById("streakBest");
  const pill = document.getElementById("streakPill");
  if (!nowEl || !bestEl || !pill) return;

  const { now, best } = computeStreaks();
  nowEl.textContent = now;
  bestEl.textContent = best;

  const studiedToday = (state.studyLog?.[_todayKey()] || 0) > 0;
  pill.style.borderColor = studiedToday ? "rgba(59,130,246,0.40)" : "rgba(255,255,255,0.10)";
  pill.style.background = studiedToday ? "rgba(59,130,246,0.10)" : "rgba(255,255,255,0.04)";
}

/* ===== expõe ===== */

window.renderTasks = renderTasks;
window.updateProgressBar = updateProgressBar;

window.renderProgressTab = renderProgressTab;
window.bindNotesAutosave = bindNotesAutosave;
window.renderNotes = renderNotes;

window.renderMonths = renderMonths;
window.renderWeeks = renderWeeks;

window.renderStreak = renderStreak;
window.recordStudyToday = recordStudyToday;
window.computeStreaks = computeStreaks;
