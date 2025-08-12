let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingIndex = -1;  // -1 मतलब कोई editing नहीं हो रही

showTasks(tasks);

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

// Add or Update Task बटन पर क्लिक
addTaskBtn.addEventListener("click", function () {
  let taskName = taskInput.value.trim();

  if (!taskName) return; // खाली input पर कुछ न करें

  if (editingIndex === -1) {
    // नया task add करें
    tasks.push({ name: taskName, done: false });
  } else {
    // पहले से edit हो रहे task को update करें
    tasks[editingIndex].name = taskName;
    editingIndex = -1; // editing mode खत्म
    addTaskBtn.innerText = "Add Task"; // बटन label वापस करें
  }

  taskInput.value = "";
  saveTasks();
  showTasks(tasks);
});

// UI में tasks दिखाने वाला function (थोड़ा बदलाव के साथ)
function showTasks(filteredTasks = tasks) {
  let taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    taskList.innerHTML = "<li>No Task Found</li>";
    return;
  }

  filteredTasks.forEach((task, index) => {
    let li = document.createElement("li");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.onchange = function () {
      task.done = this.checked;
      saveTasks();
      showTasks(tasks);
    };

    let span = document.createElement("span");
    span.innerText = task.name;
    if (task.done) span.classList.add("completed");

    let editBtn = document.createElement("button");
    editBtn.innerText = "✏️";
    editBtn.onclick = function () {
      // Editing mode शुरू करें
      taskInput.value = task.name;
      editingIndex = index;
      addTaskBtn.innerText = "Update Task"; // बटन का label बदलें
    };

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "❌";
    deleteBtn.onclick = function () {
      if (confirm("Delete this task?")) {
        tasks.splice(index, 1);
        saveTasks();
        showTasks(tasks);
      }
    };

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
