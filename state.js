// js/state.js
const state = {
  monthIndex: 0,
  weekIndex: 0,

  progress: loadData("devtrack_progress", {}),
  extras: loadData("devtrack_extras", {}),
  notes: loadData("devtrack_notes", {}),

  // dias estudados: { "YYYY-MM-DD": number } (quantas ações no dia)
  studyLog: loadData("devtrack_studylog", {}),

  search: "",
};
