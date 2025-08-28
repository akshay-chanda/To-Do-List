// Select elements
const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

// Load saved tasks
document.addEventListener("DOMContentLoaded", loadTasks);

// Add task
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Restore theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

// Add Task Function
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }
  createTaskElement(taskText);
  saveTasks();
  taskInput.value = "";
}

// Create Task Element
function createTaskElement(taskText, isDone = false) {
  const li = document.createElement("li");
  li.textContent = taskText;

  if (isDone) li.classList.add("done");

  // Toggle done
  li.addEventListener("click", (e) => {
    if (!e.target.classList.contains("edit-btn") && !e.target.classList.contains("delete-btn")) {
      li.classList.toggle("done");
      saveTasks();
    }
  });

  // Action buttons
  const actions = document.createElement("div");
  actions.className = "actions";

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const newTask = prompt("Edit your task:", li.firstChild.textContent);
    if (newTask !== null && newTask.trim() !== "") {
      li.firstChild.textContent = newTask.trim();
      saveTasks();
    }
  });

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  li.appendChild(actions);

  taskList.appendChild(li);
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    tasks.push({ text: li.firstChild.textContent, done: li.classList.contains("done") });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => createTaskElement(task.text, task.done));
}
