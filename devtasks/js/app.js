import { createTask, isValidTask, filterTasks, getTaskStats } from "./taskUtils.js";

let tasks = [];
let currentFilter = "all";

const taskForm = typeof document !== "undefined"
  ? document.querySelector("#task-form")
  : null;
const taskInput = typeof document !== "undefined"
  ? document.querySelector("#task-input")
  : null;
const taskList = typeof document !== "undefined"
  ? document.querySelector("#task-list")
  : null;
const formError = typeof document !== "undefined"
  ? document.querySelector("#form-error")
  : null;
const emptyMessage = typeof document !== "undefined"
  ? document.querySelector("#empty-message")
  : null;

const totalTasks = typeof document !== "undefined"
  ? document.querySelector("#total-tasks")
  : null;
const pendingTasks = typeof document !== "undefined"
  ? document.querySelector("#pending-tasks")
  : null;
const completedTasks = typeof document !== "undefined"
  ? document.querySelector("#completed-tasks")
  : null;

export function createTask(text) {
  return {
    id: Date.now(),
    text: text.trim(),
    completed: false,
  };
}

export function isValidTask(text) {
  return typeof text === 'string' && text.trim().length > 0;
}

export function filterTasks(tasks, filter) {
  switch (filter) {
    case 'pending':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    default:
      return tasks;
  }
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  return { total, completed, pending };
}   

function saveTasks() {
  localStorage.setItem("devtasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("devtasks");

  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function updateStats() {
  const stats = getTaskStats(tasks);

  totalTasks.textContent = stats.total;
  pendingTasks.textContent = stats.pending;
  completedTasks.textContent = stats.completed;
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = filterTasks(tasks, currentFilter);

  emptyMessage.style.display =
    filteredTasks.length === 0 ? "block" : "none";

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    li.className = "task";

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <input
        type="checkbox"
        class="task-checkbox"
        data-id="${task.id}"
        ${task.completed ? "checked" : ""}
        aria-label="Completar tasca"
      >
      <span class="task-text">${escapeHTML(task.text)}</span>
      <button class="delete-button" data-id="${task.id}">
        Eliminar
      </button>
    `;

    taskList.appendChild(li);
  });

  updateStats();
}

if (typeof document !== "undefined") {
  taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value;

    if (!isValidTask(text)) {
      formError.textContent = "La tasca no pot estar buida.";
      return;
    }

    formError.textContent = "";

    tasks.push(createTask(text));
    saveTasks();

    taskInput.value = "";
    renderTasks();
  });

  taskList.addEventListener("click", event => {
    const deleteButton = event.target.closest(".delete-button");

    if (!deleteButton) {
      return;
    }

    const id = Number(deleteButton.dataset.id);

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
  });

  taskList.addEventListener("change", event => {
    const checkbox = event.target.closest(".task-checkbox");

    if (!checkbox) {
      return;
    }

    const id = Number(checkbox.dataset.id);
    const task = tasks.find(task => task.id === id);

    if (task) {
      task.completed = checkbox.checked;
    }

    saveTasks();
    renderTasks();
  });

  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;

      document.querySelectorAll(".filter").forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");
      renderTasks();
    });
  });

  loadTasks();
  renderTasks();
}
