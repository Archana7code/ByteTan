let seconds = 0, minutes = 0, hours = 0;
let display = document.getElementById("stopwatch");
let interval;

function startStopwatch() {
    if (!interval) {
        interval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                seconds = 0;
                minutes++;
            }
            if (minutes === 60) {
                minutes = 0;
                hours++;
            }
            display.textContent =
                (hours < 10 ? "0" + hours : hours) + ":" +
                (minutes < 10 ? "0" + minutes : minutes) + ":" +
                (seconds < 10 ? "0" + seconds : seconds);
        }, 1000);
    }
}

function stopStopwatch() {
    clearInterval(interval);
    interval = null;
}

function resetStopwatch() {
    clearInterval(interval);
    interval = null;
    seconds = 0; minutes = 0; hours = 0;
    display.textContent = "00:00:00";
}

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskList = document.getElementById("taskList");
    if (taskInput.value.trim() === "") return;
    
    let li = document.createElement("li");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onclick = () => {
        li.classList.toggle("completed");
        saveTasks();
    };
    
    let text = document.createElement("span");
    text.textContent = taskInput.value;
    
    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<img src="images/2" alt="Delete" class="delete-icon">';
    deleteBtn.onclick = () => {
        taskList.removeChild(li);
        saveTasks();
    };
    
    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    
    taskInput.value = "";
    saveTasks();
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        addTask();
    }
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let taskList = document.getElementById("taskList");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        let li = document.createElement("li");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        if (task.completed) li.classList.add("completed");
        checkbox.onclick = () => {
            li.classList.toggle("completed");
            saveTasks();
        };
        
        let text = document.createElement("span");
        text.textContent = task.text;
        
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => {
            taskList.removeChild(li);
            saveTasks();
        };
        
        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", loadTasks);

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}