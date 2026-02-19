const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const weeklyGoalInput = document.getElementById("weeklyGoal");
const goalStatus = document.getElementById("goalStatus");
const themeToggle = document.getElementById("themeToggle");
const streakDisplay = document.getElementById("streak");
const exportBtn = document.getElementById("exportPDF");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div>
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        ${task.title}
      </div>
      <button>❌</button>
    `;

    // checkbox
    li.querySelector("input").addEventListener("change", () => {
      task.completed = !task.completed;
      saveTasks();
      updateGoal();
      updateChart();
      updateStreak();
    });

    // delete
    li.querySelector("button").addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
      updateGoal();
      updateChart();
    });

    taskList.appendChild(li);
  });

  updateGoal();
}

addTaskBtn.addEventListener("click", () => {
  if (!taskInput.value) return;

  tasks.push({
    id: Date.now(),
    title: taskInput.value,
    completed: false,
    date: new Date().toDateString()
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
  updateChart();
});

renderTasks();


// ================= META =================

function updateGoal() {
  const goal = Number(weeklyGoalInput.value);
  const completed = tasks.filter(t => t.completed).length;

  if (!goal) {
    goalStatus.textContent = "";
    return;
  }

  if (completed >= goal) {
    goalStatus.textContent = "Meta atingida 🎉";
  } else {
    goalStatus.textContent = `Faltam ${goal - completed} tarefas`;
  }
}

weeklyGoalInput.addEventListener("input", () => {
  localStorage.setItem("goal", weeklyGoalInput.value);
  updateGoal();
});

weeklyGoalInput.value = localStorage.getItem("goal") || "";


// ================= STREAK =================

function updateStreak() {
  const today = new Date().toDateString();
  const last = localStorage.getItem("lastDay");
  let streak = Number(localStorage.getItem("streak") || 0);

  if (last !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (last === yesterday.toDateString()) {
      streak++;
    } else {
      streak = 1;
    }

    localStorage.setItem("streak", streak);
    localStorage.setItem("lastDay", today);
  }

  streakDisplay.textContent = "🔥 Streak: " + streak + " dias";
}

updateStreak();


// ================= TEMA =================

function loadTheme() {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

loadTheme();


// ================= GRÁFICO =================

let chart;

function updateChart() {
  const ctx = document.getElementById("progressChart");

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Concluído", "Restante"],
      datasets: [{
        data: [completed, total - completed]
      }]
    }
  });
}

updateChart();


// ================= PDF =================

exportBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Relatório DevTrack", 10, 10);

  let y = 20;
  tasks.forEach(task => {
    doc.text(
      `${task.title} - ${task.completed ? "✔" : "✖"}`,
      10,
      y
    );
    y += 10;
  });

  doc.save("devtrack_relatorio.pdf");
});
