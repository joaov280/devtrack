// js/features.js
(function () {
  const KEYS = {
    daylog: "devtrack_daylog",     // { "YYYY-MM-DD": [ {m,w,i,title} ] }
    pins: "devtrack_pins",         // { "YYYY-MM-DD": [ {m,w,i,title} ] }
    reviews: "devtrack_reviews",   // { "YYYY-MM-DD": [ {m,w,i,title,step} ] }
    achievements: "devtrack_achievements" // { unlocked: {id: "YYYY-MM-DD"} }
  };

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "") ?? fallback; }
    catch { return fallback; }
  }
  function save(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function pad(n){ return String(n).padStart(2, "0"); }
  function dateKey(d=new Date()){
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }
  function addDaysKey(baseKey, add){
    const d = new Date(baseKey + "T00:00:00");
    d.setDate(d.getDate() + add);
    return dateKey(d);
  }

  // ===== storage state (module) =====
  const daylog = load(KEYS.daylog, {});
  const pins = load(KEYS.pins, {});
  const reviews = load(KEYS.reviews, {});
  const ach = load(KEYS.achievements, { unlocked: {} });

  // ===== hook para quando marcar tarefa ✅ =====
  function onTaskCompleted({ m, w, i, title }) {
    const today = dateKey();

    // daylog: guarda histórico do que foi concluído por dia
    daylog[today] = daylog[today] || [];
    // evita duplicar
    if (!daylog[today].some(x => x.m===m && x.w===w && x.i===i)) {
      daylog[today].push({ m, w, i, title });
      save(KEYS.daylog, daylog);
    }

    // revisões espaçadas: 1, 7, 30 dias
    const schedule = [
      { step: 1, days: 1 },
      { step: 2, days: 7 },
      { step: 3, days: 30 },
    ];

    schedule.forEach(s => {
      const due = addDaysKey(today, s.days);
      reviews[due] = reviews[due] || [];
      // evita duplicar
      if (!reviews[due].some(x => x.m===m && x.w===w && x.i===i && x.step===s.step)) {
        reviews[due].push({ m, w, i, title, step: s.step });
      }
    });

    save(KEYS.reviews, reviews);

    unlockAchievements(); // checa conquistas
    renderToday();
    renderCalendar();
    renderChart();
  }

  // ===== fixar tarefa do dia =====
  function pinTask({ m, w, i, title }) {
    const today = dateKey();
    pins[today] = pins[today] || [];
    if (!pins[today].some(x => x.m===m && x.w===w && x.i===i)) {
      pins[today].push({ m, w, i, title });
      save(KEYS.pins, pins);
    }
    renderToday();
  }

  function clearTodayPins() {
    const today = dateKey();
    pins[today] = [];
    save(KEYS.pins, pins);
    renderToday();
  }

  // ===== util: ir para tarefa (muda mês/semana, limpa busca) =====
  function goToTask(m, w) {
    state.monthIndex = m;
    state.weekIndex = w;
    window.renderMonths?.(() => {});
    window.renderWeeks?.(() => {});
    state.search = "";
    const si = document.getElementById("searchInput");
    if (si) si.value = "";
    window.renderTasks?.();
    window.renderNotes?.();
    window.renderProgressTab?.();
  }

  // ===== HOJE render =====
  function renderToday() {
    const today = dateKey();
    const pinsBox = document.getElementById("todayPins");
    const revBox = document.getElementById("todayReviews");

    const todayDoneEl = document.getElementById("todayDone");
    const todayDueEl = document.getElementById("todayDue");
    const todayStreakEl = document.getElementById("todayStreak");

    const doneToday = (daylog[today] || []).length;
    const dueToday = (reviews[today] || []).length;

    if (todayDoneEl) todayDoneEl.textContent = doneToday;
    if (todayDueEl) todayDueEl.textContent = dueToday;

    const st = window.computeStreaks?.() || { now: 0 };
    if (todayStreakEl) todayStreakEl.textContent = st.now;

    if (pinsBox) {
      const items = pins[today] || [];
      pinsBox.innerHTML = items.length
        ? items.map(x => `
            <div class="item">
              <div>${escapeHtml(x.title)}</div>
              <small>${escapeHtml(whereLabel(x.m, x.w))}</small>
              <div style="margin-top:8px;">
                <button class="btn-mini" data-goto="${x.m},${x.w}">Ir</button>
              </div>
            </div>
          `).join("")
        : `<div class="item"><div>Nada fixado ainda.</div></div>`;

      pinsBox.querySelectorAll("[data-goto]").forEach(btn => {
        btn.addEventListener("click", () => {
          const [m,w] = btn.getAttribute("data-goto").split(",").map(Number);
          goToTask(m,w);
        });
      });
    }

    if (revBox) {
      const items = reviews[today] || [];
      revBox.innerHTML = items.length
        ? items.map(x => `
            <div class="item">
              <div>🧠 ${escapeHtml(x.title)}</div>
              <small>${escapeHtml(whereLabel(x.m, x.w))} • etapa ${x.step}</small>
              <div style="margin-top:8px;">
                <button class="btn-mini" data-goto="${x.m},${x.w}">Ir</button>
              </div>
            </div>
          `).join("")
        : `<div class="item"><div>Nenhuma revisão hoje 🎉</div></div>`;

      revBox.querySelectorAll("[data-goto]").forEach(btn => {
        btn.addEventListener("click", () => {
          const [m,w] = btn.getAttribute("data-goto").split(",").map(Number);
          goToTask(m,w);
        });
      });
    }

    renderAchievements();
  }

  function whereLabel(m,w){
    return `${window.CURRICULUM[m]?.title || "?"} • ${window.CURRICULUM[m]?.weeks[w]?.title || "?"}`;
  }

  // ===== Conquistas =====
  function unlock(id) {
    if (!ach.unlocked[id]) {
      ach.unlocked[id] = dateKey();
      save(KEYS.achievements, ach);
    }
  }

  function totals() {
    // total concluídas no app (ignora removidas)
    let done = 0;
    let total = 0;

    for (let m=0; m<window.CURRICULUM.length; m++){
      for (let w=0; w<window.CURRICULUM[m].weeks.length; w++){
        const base = window.CURRICULUM[m].weeks[w].tasks;
        const key = `${m}-${w}`;
        // extras
        let extras = [];
        try { extras = (state.extras[key] || []).map(e => (typeof e==="string"? {title:e,deleted:false}:{title:e.title,deleted:!!e.deleted})); } catch {}
        const all = base.map(t=>({title:t,deleted:false})).concat(extras);

        for (let i=0; i<all.length; i++){
          total++;
          if (all[i].deleted) continue;
          if (state.progress[`${m}-${w}-${i}`]) done++;
        }
      }
    }
    return { done, total };
  }

  function unlockAchievements() {
    const st = window.computeStreaks?.() || { now: 0, best: 0 };
    const t = totals();
    const daysStudied = Object.keys(state.studyLog || {}).filter(k => Number(state.studyLog[k]) >= 1).length;

    if (t.done >= 1) unlock("first_done");
    if (t.done >= 25) unlock("done_25");
    if (t.done >= 100) unlock("done_100");

    if (daysStudied >= 7) unlock("days_7");
    if (daysStudied >= 30) unlock("days_30");

    if (st.best >= 7) unlock("streak_7");
    if (st.best >= 14) unlock("streak_14");
    if (st.best >= 30) unlock("streak_30");
  }

  function renderAchievements() {
    const box = document.getElementById("achievementsBox");
    if (!box) return;

    unlockAchievements();

    const defs = [
      { id:"first_done", icon:"✅", title:"Primeira concluída", sub:"Concluiu 1 tarefa" },
      { id:"done_25", icon:"🚀", title:"25 concluídas", sub:"Você tá embalado" },
      { id:"done_100", icon:"🏅", title:"100 concluídas", sub:"Nível monstro" },
      { id:"days_7", icon:"📅", title:"7 dias estudando", sub:"Dias com estudo" },
      { id:"days_30", icon:"🗓️", title:"30 dias estudando", sub:"Consistência real" },
      { id:"streak_7", icon:"🔥", title:"Streak 7", sub:"7 dias seguidos" },
      { id:"streak_14", icon:"🔥", title:"Streak 14", sub:"14 dias seguidos" },
      { id:"streak_30", icon:"🔥", title:"Streak 30", sub:"30 dias seguidos" },
    ];

    box.innerHTML = defs.map(d => {
      const unlockedAt = ach.unlocked[d.id];
      const cls = unlockedAt ? "badge" : "badge locked";
      const sub = unlockedAt ? `${d.sub} • desbloqueado em ${unlockedAt}` : d.sub;
      return `
        <div class="${cls}">
          <span class="b-icon">${d.icon}</span>
          <div>
            <div class="b-title">${escapeHtml(d.title)}</div>
            <span class="b-sub">${escapeHtml(sub)}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  // ===== Calendário =====
  let calMonth = new Date().getMonth();
  let calYear = new Date().getFullYear();

  function renderCalendar() {
    const root = document.getElementById("calendar");
    const title = document.getElementById("calTitle");
    if (!root || !title) return;

    const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    title.textContent = `${monthNames[calMonth]} ${calYear}`;

    root.innerHTML = "";

    const dows = ["D","S","T","Q","Q","S","S"];
    dows.forEach(x => {
      const el = document.createElement("div");
      el.className = "cal-dow";
      el.textContent = x;
      root.appendChild(el);
    });

    const first = new Date(calYear, calMonth, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();

    // espaços antes
    for (let i=0; i<startDow; i++){
      const blank = document.createElement("div");
      blank.style.opacity = "0";
      root.appendChild(blank);
    }

    for (let day=1; day<=daysInMonth; day++){
      const d = new Date(calYear, calMonth, day);
      const key = dateKey(d);

      const count = Number(state.studyLog?.[key] || 0);
      const level = count >= 6 ? "l4" : count >= 3 ? "l3" : count >= 2 ? "l2" : count >= 1 ? "l1" : "";

      const el = document.createElement("div");
      el.className = `cal-day ${level}`.trim();
      el.innerHTML = `<div class="n">${day}</div><div class="dot"></div>`;
      el.addEventListener("click", () => showDayDetails(key));
      root.appendChild(el);
    }
  }

  function showDayDetails(key) {
    const items = daylog[key] || [];
    const count = Number(state.studyLog?.[key] || 0);

    const msg = items.length
      ? items.slice(0, 50).map(x => `• ${x.title} (${whereLabel(x.m,x.w)})`).join("\n")
      : "Sem tarefas registradas.";

    alert(`📅 ${key}\n\nAções de estudo: ${count}\n\nConcluídas:\n${msg}`);
  }

  function bindCalendarNav() {
    const prev = document.getElementById("calPrev");
    const next = document.getElementById("calNext");
    if (prev) prev.addEventListener("click", () => {
      calMonth--;
      if (calMonth < 0){ calMonth = 11; calYear--; }
      renderCalendar();
    });
    if (next) next.addEventListener("click", () => {
      calMonth++;
      if (calMonth > 11){ calMonth = 0; calYear++; }
      renderCalendar();
    });
  }

  // ===== Gráfico (canvas) =====
  function renderChart() {
    const canvas = document.getElementById("studyChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const days = [];
    const today = new Date();
    for (let i=29; i>=0; i--){
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      days.push({ key, v: Number(state.studyLog?.[key] || 0) });
    }

    const W = canvas.width = canvas.parentElement.clientWidth;
    const H = canvas.height = 140;

    ctx.clearRect(0,0,W,H);

    const maxV = Math.max(1, ...days.map(x=>x.v));
    const padX = 10, padY = 18;
    const bw = (W - padX*2) / days.length;

    // eixo base
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--border") || "rgba(255,255,255,0.1)";
    ctx.fillRect(padX, H - padY, W - padX*2, 1);
    ctx.globalAlpha = 1;

    // barras
    const primary = getComputedStyle(document.body).getPropertyValue("--primary") || "#3b82f6";
    ctx.fillStyle = primary;

    days.forEach((x, idx) => {
      const h = ((H - padY*2) * x.v) / maxV;
      const x0 = padX + idx*bw + 1;
      const y0 = (H - padY) - h;
      const w0 = Math.max(2, bw - 2);

      ctx.globalAlpha = x.v ? 0.9 : 0.15;
      roundRect(ctx, x0, y0, w0, h, 6);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  }

  function roundRect(ctx, x, y, w, h, r){
    const rr = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x+rr, y);
    ctx.arcTo(x+w, y, x+w, y+h, rr);
    ctx.arcTo(x+w, y+h, x, y+h, rr);
    ctx.arcTo(x, y+h, x, y, rr);
    ctx.arcTo(x, y, x+w, y, rr);
    ctx.closePath();
  }

  // ===== Public: botão ⭐ nos itens =====
  function attachPinButtonsInTaskList() {
    const list = document.getElementById("taskList");
    if (!list) return;

    // adiciona ⭐ em cada li que ainda não tem
    list.querySelectorAll("li").forEach(li => {
      const row = li.querySelector(".task-row");
      const left = li.querySelector(".task-left");
      if (!row || !left) return;

      if (row.querySelector(".btn-pin")) return;

      // tentar descobrir título na UI
      const titleEl = left.querySelector(".task-title");
      if (!titleEl) return;

      const pinBtn = document.createElement("button");
      pinBtn.type = "button";
      pinBtn.className = "btn-pin";
      pinBtn.title = "Fixar como tarefa do dia";
      pinBtn.textContent = "⭐";

      pinBtn.addEventListener("click", () => {
        // pega índices do estado atual (sem adivinhar)
        // o renderTasks usa índice implícito; aqui fixamos "o que está selecionado agora":
        const title = titleEl.textContent.trim();
        const m = state.monthIndex;
        const w = state.weekIndex;

        // tenta achar o índice "i" real pela lista atual (melhor esforço):
        const idx = Array.from(list.querySelectorAll("li")).indexOf(li);
        if (idx < 0) return;

        pinTask({ m, w, i: idx, title });
      });

      row.appendChild(pinBtn);
    });
  }

  // ===== eventos UI =====
  function bindTodayButtons() {
    const mark = document.getElementById("todayMarkStudyBtn");
    const clear = document.getElementById("todayClearPinsBtn");

    if (mark) mark.addEventListener("click", () => {
      // conta como “estudei hoje” mesmo sem marcar task
      if (window.recordStudyToday) window.recordStudyToday();
      renderToday();
      renderCalendar();
      renderChart();
    });

    if (clear) clear.addEventListener("click", () => clearTodayPins());
  }

  function escapeHtml(str) {
    return String(str || "")
      .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
      .replaceAll('"',"&quot;").replaceAll("'","&#039;");
  }

  // ===== integração com ui.js =====
  // ui.js vai chamar isso quando marcar ✅
  window.features_onTaskToggled = function ({ m, w, i, title, checked }) {
    if (checked) onTaskCompleted({ m, w, i, title });
    // (desmarcar não apaga histórico/revisão — intencional)
  };

  // ui.js/main.js podem chamar isso após render
  window.features_afterRender = function () {
    attachPinButtonsInTaskList();
    renderToday();
    renderCalendar();
    renderChart();
    renderAchievements();
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindTodayButtons();
    bindCalendarNav();

    
    // render inicial (se já estiver tudo carregado)
    setTimeout(() => {
      renderToday();
      renderCalendar();
      renderChart();
      renderAchievements();
    }, 50);

    // re-render chart on resize
    window.addEventListener("resize", () => {
      // leve debounce
      clearTimeout(window.__chartT);
      window.__chartT = setTimeout(renderChart, 120);
    });
  });
})();
// ===== Accordion toggle (Hoje / Conquistas) =====
(function () {
  function bindAcc(btnId, accId, storageKey) {
    const btn = document.getElementById(btnId);
    const acc = document.getElementById(accId);
    if (!btn || !acc) return;

    // estado salvo
    const saved = localStorage.getItem(storageKey);
    if (saved === "0") acc.classList.remove("open");
    if (saved === "1") acc.classList.add("open");

    btn.addEventListener("click", () => {
      acc.classList.toggle("open");
      localStorage.setItem(storageKey, acc.classList.contains("open") ? "1" : "0");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindAcc("todayAccBtn", "todayAcc", "devtrack_acc_today");
    bindAcc("achAccBtn", "achAcc", "devtrack_acc_ach");
  });
})();
