// js/settings.js

(function () {
  const KEYS = {
    progress: "devtrack_progress",
    extras: "devtrack_extras",
    notes: "devtrack_notes",
    studylog: "devtrack_studylog",
    theme: "devtrack_theme",
    sidebarCollapsed: "sidebarCollapsed",
    weeklyGoal: "devtrack_weekly_goal",
  };

  function $(id) { return document.getElementById(id); }

  function setStatus(el, msg) {
    if (!el) return;
    el.textContent = msg;
    setTimeout(() => { el.textContent = ""; }, 2000);
  }

  function getBackupObject() {
    const out = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {}
    };

    Object.values(KEYS).forEach((k) => {
      const v = localStorage.getItem(k);
      if (v !== null) out.data[k] = v; // mantém string (JSON já serializado)
    });

    return out;
  }

  function downloadJSON(filename, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  function applyBackupObject(obj) {
    if (!obj || typeof obj !== "object" || !obj.data) throw new Error("Backup inválido.");
    const data = obj.data;

    // escreve só o que existe no backup
    Object.keys(data).forEach((k) => {
      localStorage.setItem(k, data[k]);
    });
  }

  function resetProgressOnly() {
    localStorage.removeItem(KEYS.progress);
  }

  function resetAll() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  }

  function initSettingsUI() {
    const weeklyGoalInput = $("weeklyGoalInput");
    const saveWeeklyGoalBtn = $("saveWeeklyGoalBtn");
    const weeklyGoalStatus = $("weeklyGoalStatus");

    const exportBtn = $("exportBackupBtn");
    const importFile = $("importBackupFile");
    const importBtn = $("importBackupBtn");
    const backupStatus = $("backupStatus");

    const resetProgressBtn = $("resetProgressBtn");
    const resetAllBtn = $("resetAllBtn");
    const resetStatus = $("resetStatus");

    // meta semanal: carregar
    const savedGoal = localStorage.getItem(KEYS.weeklyGoal);
    if (weeklyGoalInput && savedGoal !== null) weeklyGoalInput.value = savedGoal;

    // salvar meta
    if (saveWeeklyGoalBtn && weeklyGoalInput) {
      saveWeeklyGoalBtn.addEventListener("click", () => {
        const v = Number(weeklyGoalInput.value || 0);
        if (Number.isNaN(v) || v < 0) {
          setStatus(weeklyGoalStatus, "Valor inválido.");
          return;
        }
        localStorage.setItem(KEYS.weeklyGoal, String(v));
        setStatus(weeklyGoalStatus, "Meta semanal salva ✅");

        // se quiser refletir em outras telas no futuro
        if (window.renderProgressTab) window.renderProgressTab();
      });
    }

    // exportar
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const backup = getBackupObject();
        const date = new Date();
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        downloadJSON(`devtrack-backup-${y}-${m}-${d}.json`, backup);
        setStatus(backupStatus, "Backup exportado ✅");
      });
    }

    // importar
    if (importBtn && importFile) {
      importBtn.addEventListener("click", async () => {
        const file = importFile.files?.[0];
        if (!file) {
          setStatus(backupStatus, "Escolha um arquivo .json primeiro.");
          return;
        }

        try {
          const text = await file.text();
          const obj = JSON.parse(text);
          applyBackupObject(obj);
          setStatus(backupStatus, "Backup importado ✅ Recarregando...");

          // recarrega pra refletir tudo (state pega do localStorage)
          setTimeout(() => location.reload(), 600);
        } catch (e) {
          setStatus(backupStatus, "Falha ao importar (arquivo inválido).");
        }
      });
    }

    // reset progresso
    if (resetProgressBtn) {
      resetProgressBtn.addEventListener("click", () => {
        const ok = confirm("Resetar APENAS o progresso (checks)?");
        if (!ok) return;

        resetProgressOnly();
        setStatus(resetStatus, "Progresso resetado ✅ Recarregando...");
        setTimeout(() => location.reload(), 600);
      });
    }

    // reset tudo
    if (resetAllBtn) {
      resetAllBtn.addEventListener("click", () => {
        const ok = confirm("Resetar TUDO? (progresso, extras, notas, streak, tema)");
        if (!ok) return;

        resetAll();
        setStatus(resetStatus, "Tudo resetado ✅ Recarregando...");
        setTimeout(() => location.reload(), 600);
      });
    }
  }

  // expõe init pra main.js chamar quando o DOM carregar
  window.initSettingsUI = initSettingsUI;
})();
