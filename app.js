let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

document.getElementById("toggleNotes").onclick = () => {
const notes = document.getElementById("taskNotes");
notes.style.display = notes.style.display === "none" ? "block" : "none";
};

function save(){
localStorage.setItem("tasks", JSON.stringify(tasks));
render();
}

function addTask(){
const title = document.getElementById("taskTitle").value.trim();
const notes = document.getElementById("taskNotes").value.trim();

if(title.length === 0) return;
if(title.length > 100){
alert("Title too long (max 100 characters)");
return;
}

tasks.push({
title,
notes,
status:"pending",
date:new Date().toISOString(),
expanded:false
});

document.getElementById("taskTitle").value="";
document.getElementById("taskNotes").value="";

save();
}

function toggleComplete(i){
tasks[i].status = tasks[i].status === "pending" ? "completed" : "pending";
save();
}

function deleteTask(i){
if(confirm("Delete this task?")){
tasks.splice(i,1);
save();
}
}

function toggleNotes(i){
tasks[i].expanded=!tasks[i].expanded;
save();
}

function editTask(i){
if(tasks[i].status==="completed"){
alert("Mark incomplete before editing.");
return;
}

const title = prompt("Edit title", tasks[i].title);
if(title!==null){
tasks[i].title=title;
}

const notes = prompt("Edit notes", tasks[i].notes);
if(notes!==null){
tasks[i].notes=notes;
}

save();
}

function render(){

const pending = document.getElementById("pending");
const completed = document.getElementById("completed");

pending.innerHTML="";
completed.innerHTML="";

tasks.forEach((t,i)=>{

const div=document.createElement("div");
div.className="task";

const title=document.createElement("div");
title.textContent=t.title;

if(t.status==="completed"){
title.classList.add("completed");
}

div.appendChild(title);

if(t.notes){
const btn=document.createElement("button");
btn.textContent=t.expanded?"Hide Notes":"Show Notes";
btn.onclick=()=>toggleNotes(i);
div.appendChild(btn);

if(t.expanded){
const notes=document.createElement("div");
notes.className="notes";
notes.textContent=t.notes;
div.appendChild(notes);
}
}

const menu=document.createElement("div");
menu.className="menu";

const completeBtn=document.createElement("button");
completeBtn.textContent="Toggle";
completeBtn.onclick=()=>toggleComplete(i);

const editBtn=document.createElement("button");
editBtn.textContent="Edit";
editBtn.onclick=()=>editTask(i);

const delBtn=document.createElement("button");
delBtn.textContent="Delete";
delBtn.onclick=()=>deleteTask(i);

menu.appendChild(completeBtn);
menu.appendChild(editBtn);
menu.appendChild(delBtn);

div.appendChild(menu);

if(t.status==="pending"){
pending.appendChild(div);
}else{
completed.appendChild(div);
}

});

updateStats();
}

function updateStats(){

const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate()-7);

const weekTasks = tasks.filter(t => new Date(t.date) >= weekAgo);

const completed = weekTasks.filter(t => t.status==="completed").length;
const total = weekTasks.length;

const percent = total ? Math.round((completed/total)*100) : 0;

document.getElementById("progressText").innerText =
completed + " / " + total + " tasks completed";

document.getElementById("progressFill").style.width = percent + "%";

document.getElementById("report").innerText =
"Tasks created: "+total+" | Completed: "+completed+" | Completion: "+percent+"%";

document.getElementById("pendingTitle").innerText =
"Pending Tasks (" + tasks.filter(t=>t.status==="pending").length + ")";

document.getElementById("completedTitle").innerText =
"Completed Tasks (" + tasks.filter(t=>t.status==="completed").length + ")";
}

function exportTasks(){
const data = JSON.stringify(tasks);
const blob = new Blob([data], {type:"application/json"});
const url = URL.createObjectURL(blob);

const a = document.createElement("a");
a.href=url;
a.download="tasks-backup.json";
a.click();
}

function importTasks(){
const file = document.getElementById("importFile").files[0];
if(!file) return;

const reader = new FileReader();
reader.onload = e => {
tasks = JSON.parse(e.target.result);
save();
};

reader.readAsText(file);
}

function resetTasks(){
if(confirm("Reset all tasks?")){
tasks=[];
save();
}
}

document.addEventListener("DOMContentLoaded", function () {
    render();
});
