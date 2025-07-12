// 📦 पहले से localStorage में जो "tasks" save हैं उन्हें लोड करें, वरना खाली array से शुरू करें
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// 🔄 जब पेज लोड हो, तो सारे tasks को display करें
showTasks(tasks);

// 🔘 जब "Add Task" बटन क्लिक हो, तो एक नया task जोड़ें
document.getElementById("addTaskBtn").addEventListener("click", function () {
  // टेक्स्ट इनपुट से task का नाम लें
  let taskInput = document.getElementById("taskInput");
  let taskName = taskInput.value.trim(); // शुरुआत और अंत के खाली spaces हटाएं

  if (taskName) {
    // task object बनाएं (name + done = false)
    tasks.push({ name: taskName, done: false });

    // input field को खाली कर दें
    taskInput.value = "";

    // localStorage में सेव करें
    saveTasks();

    // UI में updated list दिखाएं
    showTasks(tasks);
  }
});

// 💾 सभी tasks को localStorage में string की तरह सेव करें
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks)); // array को JSON string में बदलकर सेव करें
}

// 🧾 UI में tasks को दिखाने वाला function
function showTasks(filteredTasks = tasks) {
  let taskList = document.getElementById("taskList"); // UL element को पकड़ें
  taskList.innerHTML = ""; // पहले से मौजूद tasks हटा दें

  // अगर कोई task नहीं है तो message दिखाएं
  if (filteredTasks.length === 0) {
    taskList.innerHTML = "<li>No Task Found</li>";
    return;
  }

  // हर task को एक list item (li) के रूप में दिखाएं
  filteredTasks.forEach((task, index) => {
    let li = document.createElement("li"); // नया <li> बनाएं

    // ✅ Checkbox जो task को complete/ incomplete दिखाए
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox"; // input का type checkbox रखें
    checkbox.checked = task.done; // अगर task पहले से complete है, तो tick करें

    // जब checkbox बदलता है, तो task का status update करें
    checkbox.onchange = function () {
      task.done = this.checked; // true/false set करें
      saveTasks();              // localStorage में सेव करें
      showTasks(tasks);         // UI update करें
    };

    // 🖊️ Task का नाम एक <span> में दिखाएं
    let span = document.createElement("span");
    span.innerText = task.name; // task का नाम दिखाएं

    if (task.done) span.classList.add("completed"); // अगर task पूरा है तो style बदलें (CSS में line-through)

    // 🖊️ Edit बटन बनाएँ
    let editBtn = document.createElement("button");
    editBtn.innerText = "✏️"; // बटन में ✏️ icon
    editBtn.onclick = function () {
      document.getElementById("taskInput").value = task.name; // task name input में भरें
      tasks.splice(index, 1); // पुराना task list से हटा दें
      saveTasks();            // updated list को save करें
      showTasks(tasks);       // UI update करें
    };

    // ❌ Delete बटन बनाएँ
    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "❌"; // बटन में ❌ icon
    deleteBtn.onclick = function () {
      // Confirm popup दिखाएं
      if (confirm("Delete this task?")) {
        tasks.splice(index, 1); // task array से हटाएं
        saveTasks();            // updated list save करें
        showTasks(tasks);       // UI update करें
      }
    };

    // 🧱 सभी elements को <li> में जोड़ें
    li.appendChild(checkbox);  // checkbox जोड़ें
    li.appendChild(span);      // task का नाम
    li.appendChild(editBtn);   // edit बटन
    li.appendChild(deleteBtn); // delete बटन

    // <ul> में <li> जोड़ें
    taskList.appendChild(li);
  });
}

// 🔍 Filter dropdown change पर tasks को filter करें
document.getElementById("filter").addEventListener("change", function () {
  let filter = this.value; // चुना गया option (all, completed, pending)

  // सभी tasks दिखाएं
  if (filter === "all") {
    showTasks(tasks);
  }
  // सिर्फ completed वाले tasks दिखाएं
  else if (filter === "completed") {
    showTasks(tasks.filter((task) => task.done));
  }
  // सिर्फ pending वाले tasks दिखाएं
  else if (filter === "pending") {
    showTasks(tasks.filter((task) => !task.done));
  }
});

// 🗑️ "Clear Completed" बटन: सभी पूरे हुए tasks को हटाएं
document.getElementById("clearCompleted").addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done); // केवल pending tasks रखें
  saveTasks();    // localStorage अपडेट करें
  showTasks(tasks); // UI update करें
});

// 🧹 "Clear All" बटन: सभी tasks हटाएं
document.getElementById("clearAll").addEventListener("click", () => {
  // Confirm popup
  if (confirm("Delete all tasks?")) {
    tasks = []; // tasks array खाली करें
    saveTasks();
    showTasks(tasks);
  }
});

// 🌙 Dark Mode Toggle बटन पर light/dark mode स्विच करें
document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark"); // body में dark class toggle करें

  // theme को localStorage में save करें
  let isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// 🌗 Page reload होने पर theme restore करें
window.onload = function () {
  // अगर saved theme dark है तो dark class जोड़ें
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
};
