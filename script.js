let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingIndex = -1;

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const filterSelect = document.getElementById("filter");

showTasks(tasks);

addTaskBtn.addEventListener("click", function () {
  let taskName = taskInput.value.trim();
  if (!taskName) return;

  if (editingIndex === -1) {
    tasks.push({ name: taskName, done: false });
  } else {
    tasks[editingIndex].name = taskName;
    editingIndex = -1;
    addTaskBtn.innerText = "Add Task";
  }

  taskInput.value = "";
  saveTasks();
  showTasks(tasks);
});

// Filter tasks on dropdown change
filterSelect.addEventListener("change", function () {
  const filter = this.value;

  if (filter === "all") {
    showTasks(tasks);
  } else if (filter === "completed") {
    showTasks(tasks.filter((task) => task.done === true));
  } else if (filter === "pending") {
    showTasks(tasks.filter((task) => task.done === false));
  }
});

function showTasks(filteredTasks = tasks) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    taskList.innerHTML = "<li>No Task Found</li>";
    return;
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    checkbox.addEventListener("change", () => {
      // Update task.done on checkbox toggle
      // Need to find index of this task in main tasks array
      // Because filteredTasks may be subset, index here may differ
      // So find actual index in tasks array
      const taskIndex = tasks.findIndex(t => t.name === task.name && t.done === task.done);
      if (taskIndex > -1) {
        tasks[taskIndex].done = checkbox.checked;
        saveTasks();
        showTasks(tasks);
      }
    });

    const span = document.createElement("span");
    span.innerText = task.name;
    if (task.done) span.classList.add("completed");

    const editBtn = document.createElement("button");
    editBtn.innerText = "✏️";
    editBtn.addEventListener("click", () => {
      // Find actual index of this task in tasks array for editing
      const taskIndex = tasks.findIndex(t => t.name === task.name && t.done === task.done);
      if (taskIndex > -1) {
        taskInput.value = tasks[taskIndex].name;
        editingIndex = taskIndex;
        addTaskBtn.innerText = "Update Task";
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "❌";
    deleteBtn.addEventListener("click", () => {
      if (confirm("Delete this task?")) {
        const taskIndex = tasks.findIndex(t => t.name === task.name && t.done === task.done);
        if (taskIndex > -1) {
          tasks.splice(taskIndex, 1);
          saveTasks();
          showTasks(tasks);
        }
      }
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
