document.addEventListener("DOMContentLoaded", function () {
    let username = localStorage.getItem("username");
    if (username) {
        document.getElementById("navUsername").textContent = username;
    }
});
document.addEventListener("DOMContentLoaded", function () {
    /** Update Streak Count **/
    let streakCountElement = document.getElementById("streakCount");
    let storedStreak = localStorage.getItem("streakDates");
    let streakDays = storedStreak ? JSON.parse(storedStreak).length : 0;
    streakCountElement.textContent = streakDays;

    /** Update Points from Checked Tasks **/
    let pointsElement = document.getElementById("points");

    function updatePoints() {
        let pointsElement = document.getElementById("points");
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        let completedTasks = tasks.filter(task => task.completed);
        pointsElement.textContent = completedTasks.length * 10;
    }

    updatePoints(); // Call initially

    /** Update Time Spent (hh:mm:ss format, resets at midnight) **/
    let timeSpentElement = document.getElementById("timeSpent");
    let startTime = localStorage.getItem("startTime");
    let lastResetDate = localStorage.getItem("lastResetDate");

    function getFormattedTime(seconds) {
        let h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        let m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        let s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    function updateTimeSpent() {
        let now = new Date();
        let todayDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format

        if (lastResetDate !== todayDate) {
            // Reset time if a new day started
            localStorage.setItem("startTime", Date.now());
            localStorage.setItem("lastResetDate", todayDate);
            startTime = localStorage.getItem("startTime");
        }

        let elapsed = Math.floor((Date.now() - startTime) / 1000);
        timeSpentElement.textContent = getFormattedTime(elapsed);
    }

    updateTimeSpent(); // Initial call
    setInterval(updateTimeSpent, 1000); // Update every second

    /** Listen for Task Check/Uncheck Changes **/
    window.addEventListener("storage", function (event) {
        if (event.key === "tasks") {
            updatePoints(); // Update points if tasks change
        }
    });
});
