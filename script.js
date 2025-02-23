let seconds = 0, minutes = 0, hours = 0;
let display = document.getElementById("stopwatch");
let interval;

document.addEventListener("DOMContentLoaded", function () {
    let username = localStorage.getItem("username");
    if (username) {
        document.getElementById("navUsername").textContent = username;
    }
});
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

function updateStreak() {
    let streakCountElement = document.getElementById("streakCount");
    if (!streakCountElement) {
        console.warn("Streak Tracker elements missing! Skipping streak update.");
        return; // Stop execution if the streak tracker isn't loaded
    }

    let streak = parseInt(localStorage.getItem("streakCount")) || 0;
    let tasks = document.querySelectorAll("#taskList li");
    
    let today = new Date().toISOString().split("T")[0];
    let streakDates = JSON.parse(localStorage.getItem("streakDates")) || [];

    if (tasks.length > 0 && !streakDates.includes(today)) {
        streak++;
        streakDates.push(today);
    } else if (tasks.length === 0 && streakDates.includes(today)) {
        streak--;
        streakDates = streakDates.filter(date => date !== today);
    }

    localStorage.setItem("streakCount", streak);
    localStorage.setItem("streakDates", JSON.stringify(streakDates));

    streakCountElement.textContent = streak;
    updateStreakCalendar();
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
        updateStreak(); // ✅ Ensure streak updates when a task is marked complete
    };
    
    let text = document.createElement("span");
    text.textContent = taskInput.value;
    
    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete"; //"class="delete-icon"
    deleteBtn.onclick = () => {
        console.log("Task deleted, updating streak...");
        taskList.removeChild(li);
        saveTasks();
        updateStreak(); // ✅ Ensure streak updates when a task is deleted
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
            updateStreak(); 
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

function updateStreak() {
    let today = new Date().toISOString().split("T")[0]; 
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (tasks.length > 0) {
        
        let streakData = JSON.parse(localStorage.getItem("streakData")) || {};
        streakData[today] = true;
        localStorage.setItem("streakData", JSON.stringify(streakData));
    } else {
      
        let streakData = JSON.parse(localStorage.getItem("streakData")) || {};
        delete streakData[today];
        localStorage.setItem("streakData", JSON.stringify(streakData));
    }

    
    if (typeof updateStreakCalendar === "function") {
        updateStreakCalendar();
    }
}

