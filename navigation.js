// js/navigation.js
(function () {
  const TAB_KEY = "devtrack_active_tab";
  const SIDEBAR_KEY = "devtrack_sidebar_collapsed";
  const MOBILE_BP = 820; // <-- 1 breakpoint só

  function $(id) { return document.getElementById(id); }
  function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }
  function isMobile() { return window.matchMedia(`(max-width: ${MOBILE_BP}px)`).matches; }

  let overlay = null;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);
    overlay.addEventListener("click", closeMobileSidebar);
    return overlay;
  }

  function openMobileSidebar() {
    const sidebar = $("sidebar");
    if (!sidebar) return;
    ensureOverlay();
    sidebar.classList.add("mobile-open");
    overlay.classList.add("show");
  }

  function closeMobileSidebar() {
    const sidebar = $("sidebar");
    if (!sidebar) return;
    sidebar.classList.remove("mobile-open");
    if (overlay) overlay.classList.remove("show");
  }

  function toggleMobileSidebar() {
    const sidebar = $("sidebar");
    if (!sidebar) return;
    const open = sidebar.classList.contains("mobile-open");
    open ? closeMobileSidebar() : openMobileSidebar();
  }

  function setActiveTab(tabId) {
    const tabs = qsa(".tab-content");
    const buttons = qsa(".menu .menu-item");

    // fallback seguro
    if (!tabs.some(t => t.id === tabId)) tabId = "estudos";

    tabs.forEach(t => t.classList.toggle("active", t.id === tabId));
    buttons.forEach(b => b.classList.toggle("active", b.dataset.tab === tabId));

    const titleEl = $("pageTitle");
    if (titleEl) {
      const map = { estudos: "Estudos", progresso: "Progresso", config: "Configurações" };
      titleEl.textContent = map[tabId] || "DevTrack";
    }

    localStorage.setItem(TAB_KEY, tabId);

    // render por aba
    if (tabId === "estudos") {
      window.renderTasks?.();
      window.renderNotes?.();
    }
    if (tabId === "progresso") {
      window.renderProgressTab?.();
    }
    if (tabId === "config") {
      window.initSettingsUI?.();
    }

    // no mobile: fecha a gaveta ao trocar aba
    if (isMobile()) closeMobileSidebar();
  }

  function initTabs() {
    const buttons = qsa(".menu .menu-item");
    const tabs = qsa(".tab-content");
    if (!tabs.length) return;

    buttons.forEach(btn => {
      btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
    });

    const saved = localStorage.getItem(TAB_KEY);
    if (saved) setActiveTab(saved);
    else setActiveTab(tabs.find(t => t.classList.contains("active"))?.id || "estudos");
  }

  function initDesktopCollapse() {
    const sidebar = $("sidebar");
    const toggle = $("toggleSidebar");
    if (!sidebar || !toggle) return;

    const saved = localStorage.getItem(SIDEBAR_KEY);
    if (saved === "1") sidebar.classList.add("collapsed");

    toggle.addEventListener("click", () => {
      // no mobile esse botão pode nem aparecer, mas se aparecer:
      if (isMobile()) return toggleMobileSidebar();

      sidebar.classList.toggle("collapsed");
      localStorage.setItem(SIDEBAR_KEY, sidebar.classList.contains("collapsed") ? "1" : "0");
    });
  }

  function initMobileMenuBtn() {
    const btn = $("mobileMenuBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      // sempre funciona, mas o efeito só aparece no CSS do mobile
      toggleMobileSidebar();
    });

    // ESC fecha
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileSidebar();
    });

    // se sair do mobile, fecha overlay
    window.addEventListener("resize", () => {
      if (!isMobile()) closeMobileSidebar();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initDesktopCollapse();
    initMobileMenuBtn();
    initTabs();
  });
})();
