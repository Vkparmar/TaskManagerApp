let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filter = document.getElementById("filter");
const searchTask = document.getElementById("searchTask");

showTasks();

addTaskBtn.onclick = () => {

const name = taskInput.value.trim();
const date = dueDate.value;

if(!name) return;

tasks.push({
id:Date.now(),
name:name,
date:date,
done:false
});

taskInput.value="";
dueDate.value="";

saveTasks();
showTasks();

};

function showTasks(){

taskList.innerHTML="";

let filtered = [...tasks];

if(filter.value==="completed")
filtered = filtered.filter(t=>t.done);

if(filter.value==="pending")
filtered = filtered.filter(t=>!t.done);

if(searchTask.value)
filtered = filtered.filter(t=>t.name.toLowerCase().includes(searchTask.value.toLowerCase()));

filtered.forEach(task=>{

const li=document.createElement("li");

li.draggable=true;

li.innerHTML=`

<div>

<input type="checkbox" ${task.done?"checked":""}>

<span class="${task.done?'completed':''}">${task.name}</span>

<small>${task.date||""}</small>

</div>

<div>

<button class="edit">✏️</button>

<button class="delete">❌</button>

</div>

`;

const checkbox=li.querySelector("input");

checkbox.onchange=()=>{

task.done=checkbox.checked;

saveTasks();

showTasks();

};

li.querySelector(".delete").onclick=()=>{

tasks=tasks.filter(t=>t.id!==task.id);

saveTasks();

showTasks();

};

li.querySelector(".edit").onclick=()=>{

taskInput.value=task.name;
dueDate.value=task.date;

tasks=tasks.filter(t=>t.id!==task.id);

};

taskList.appendChild(li);

});

updateProgress();

}

filter.onchange=showTasks;

searchTask.oninput=showTasks;

function updateProgress(){

let done=tasks.filter(t=>t.done).length;

let percent=tasks.length? (done/tasks.length)*100 : 0;

document.getElementById("progressBar").style.width=percent+"%";

}

document.getElementById("clearCompleted").onclick=()=>{

tasks=tasks.filter(t=>!t.done);

saveTasks();

showTasks();

};

document.getElementById("clearAll").onclick=()=>{

if(confirm("Delete all tasks?")){

tasks=[];

saveTasks();

showTasks();

}

};

document.getElementById("themeToggle").onclick=()=>{

document.body.classList.toggle("dark-theme");

};

document.getElementById("backupBtn").onclick=()=>{

const data=JSON.stringify(tasks);

const blob=new Blob([data]);

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download="tasks-backup.json";

a.click();

};

function saveTasks(){

localStorage.setItem("tasks",JSON.stringify(tasks));

}
