// js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // ===== init render base =====
  renderMonths(() => {
    state.weekIndex = 0;
    renderWeeks(onWeekSelected);
    renderTasks();
    renderNotes();
    renderProgressTab();
    if (window.renderStreak) window.renderStreak();
    if (window.initSettingsUI) window.initSettingsUI();
  // ===== Mobile menu (botão ☰ da topbar) =====
(function initMobileMenu(){
  const sidebar = document.getElementById("sidebar");
  const btn = document.getElementById("mobileMenuBtn");
  if (!sidebar || !btn) return;

  // cria overlay 1x
  let overlay = document.querySelector(".sidebar-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);
  }

  function open() {
    sidebar.classList.add("mobile-open");
    overlay.classList.add("show");
  }

  function close() {
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("show");
  }

  function toggle() {
    const isOpen = sidebar.classList.contains("mobile-open");
    isOpen ? close() : open();
  }

  btn.addEventListener("click", toggle);
  overlay.addEventListener("click", close);

  // fechar ao clicar em um item do menu
  document.querySelectorAll(".menu .menu-item").forEach(b => {
    b.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 720px)").matches) close();
    });
  });

  // ESC fecha
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();


});

  function onWeekSelected() {
    renderTasks();
    renderNotes();
    renderProgressTab();
    if (window.renderStreak) window.renderStreak();
  }

  renderWeeks(onWeekSelected);
  renderTasks();
  renderNotes();
  renderProgressTab();

  // autosave notes
  if (window.bindNotesAutosave) window.bindNotesAutosave();

  // ===== busca =====
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearchBtn");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.search = searchInput.value;
      renderTasks(); // agora busca é global
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (!searchInput) return;
      searchInput.value = "";
      state.search = "";
      renderTasks();
      searchInput.focus();
    });
  }

  // ===== adicionar tarefa extra (botão + Enter) =====
  const addBtn = document.getElementById("addTaskBtn");
  const input = document.getElementById("newTaskInput");

  function addExtra() {
    const value = (input?.value || "").trim();
    if (!value) return;

    const key = `${state.monthIndex}-${state.weekIndex}`;
    if (!state.extras[key]) state.extras[key] = [];

    // salva como objeto
    state.extras[key].push({ title: value, deleted: false });
    saveData("devtrack_extras", state.extras);

    if (input) input.value = "";
    renderTasks();
    renderProgressTab();
  }

  if (addBtn) addBtn.addEventListener("click", addExtra);

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addExtra();
    });
  }

  // ===== tema (100% garantido) =====
  (function initThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    function applyTheme(theme) {
      document.body.classList.toggle("light", theme === "light");
      localStorage.setItem("devtrack_theme", theme);
      btn.textContent = theme === "light" ? "🌞" : "🌙";
    }

    const saved = localStorage.getItem("devtrack_theme") || "dark";
    applyTheme(saved);

    btn.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light");
      applyTheme(isLight ? "dark" : "light");
    });
  })();

  // streak render inicial
  if (window.renderStreak) window.renderStreak();
});
