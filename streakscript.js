document.addEventListener("DOMContentLoaded", function () {
    const daysContainer = document.getElementById("daysContainer");
    const monthYear = document.getElementById("monthYear");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const streakCountElement = document.getElementById("streakCount");
    const resetButton = document.getElementById("resetStreak");

    if (!daysContainer || !streakCountElement || !monthYear || !prevMonthBtn || !nextMonthBtn || !resetButton) {
        console.error("Streak Tracker elements missing!");
        return;
    }

    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let timeSpent = 0;
    const timeThreshold = 30 * 60 * 1000; // 30 minutes in milliseconds

    /** Track time spent on the website **/
    setInterval(() => {
        timeSpent += 1000; // Increase time by 1 second
        if (timeSpent >= timeThreshold) {
            addStreakForToday();
        }
    }, 1000);

    /** Function to add streak if task deleted or 15 minutes spent **/
    function addStreakForToday() {
        let streakDates = JSON.parse(localStorage.getItem("streakDates")) || [];
        const todayDate = new Date().toISOString().split("T")[0];

        if (!streakDates.includes(todayDate)) {
            streakDates.push(todayDate);
            localStorage.setItem("streakDates", JSON.stringify(streakDates));
            updateStreak();
        }
    }

    /** Reset Button: Reset streak to 0 **/
    resetButton.onclick = function () {
        localStorage.removeItem("streakDates"); // Completely reset streak data
        localStorage.setItem("streak", "0");
    
        document.getElementById("streakCount").textContent = "0"; // Reset displayed streak count
        generateCalendar(currentMonth, currentYear); // Redraw calendar with reset data
    };
    

    /** Generate Calendar with Streak Colors and Image **/
    function generateCalendar(month, year) {
        daysContainer.innerHTML = "";
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        monthYear.textContent = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

        let streakDates = JSON.parse(localStorage.getItem("streakDates")) || [];
        let formattedToday = today.toISOString().split("T")[0];

        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement("div");
            daysContainer.appendChild(emptyDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement("div");
            dayDiv.textContent = day;
            dayDiv.classList.add("day");

            let formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            if (streakDates.includes(formattedDate)) {
                dayDiv.classList.add("streak-day"); // Orange for completed streak days
            } else {
                dayDiv.classList.add("no-streak-day"); // Gray for non-streak days
            }

            if (formattedDate === formattedToday && streakDates.includes(formattedDate)) {
                const img = document.createElement("img");
                img.src = "streak-image.png"; // Replace with actual streak image path
                img.alt = "Streak Completed!";
                img.classList.add("streak-image");
                dayDiv.appendChild(img);
            }

            daysContainer.appendChild(dayDiv);
        }
    }

    /** Update Streak Counter and Calendar **/
    function updateStreak() {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        let streakDates = JSON.parse(localStorage.getItem("streakDates")) || [];
        const todayDate = new Date().toISOString().split("T")[0];

        if (tasks.length === 0 && !streakDates.includes(todayDate)) {
            streakDates.push(todayDate);
            localStorage.setItem("streakDates", JSON.stringify(streakDates));
        }

        streakCountElement.textContent = streakDates.length;
        generateCalendar(currentMonth, currentYear);
    }

    /** Navigation for Previous & Next Month **/
    prevMonthBtn.addEventListener("click", function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener("click", function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    updateStreak();
});