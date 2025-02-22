document.addEventListener("DOMContentLoaded", function () {
    const subjectsContainer = document.getElementById("subjectsContainer");
    const addSubjectBtn = document.getElementById("addSubjectBtn");
    const subjectInput = document.getElementById("subjectInput");

    let syllabus = JSON.parse(localStorage.getItem("syllabus")) || [];

    function saveData() {
        localStorage.setItem("syllabus", JSON.stringify(syllabus));
    }

    function renderSyllabus() {
        subjectsContainer.innerHTML = "";
        syllabus.forEach((subject, subjectIndex) => {
            const subjectDiv = document.createElement("div");
            subjectDiv.classList.add("subject");

            // Subject Header
            const subjectHeader = document.createElement("div");
            subjectHeader.classList.add("subject-header");

            const subjectTitle = document.createElement("h3");
            subjectTitle.textContent = subject.name;

            subjectHeader.appendChild(subjectTitle);
            subjectDiv.appendChild(subjectHeader);

            // Progress Bar
            const progressContainer = document.createElement("div");
            progressContainer.classList.add("progress-container");

            const progressBar = document.createElement("div");
            progressBar.classList.add("progress-bar");
            progressContainer.appendChild(progressBar);

            subjectDiv.appendChild(progressContainer);

            // Topics List
            const topicList = document.createElement("div");
            subject.topics.forEach((topic, topicIndex) => {
                const topicDiv = document.createElement("div");
                topicDiv.classList.add("topic");

                const topicCheckbox = document.createElement("input");
                topicCheckbox.type = "checkbox";
                topicCheckbox.checked = topic.completed;
                topicCheckbox.onchange = () => toggleTopic(subjectIndex, topicIndex);

                const topicName = document.createElement("span");
                topicName.textContent = topic.name;

                // Topic Completion Counter
                const topicCounter = document.createElement("span");
                topicCounter.textContent = `${subject.topics.filter(t => t.completed).length}/${subject.topics.length}`;

                topicDiv.appendChild(topicCheckbox);
                topicDiv.appendChild(topicName);
                topicDiv.appendChild(topicCounter);

                topicList.appendChild(topicDiv);
            });

            subjectDiv.appendChild(topicList);

            // Add Topic Input
            const addTopicContainer = document.createElement("div");
            addTopicContainer.classList.add("add-topic-container");

            const topicInput = document.createElement("input");
            topicInput.type = "text";
            topicInput.placeholder = "Enter topic name";

            const addTopicBtn = document.createElement("button");
            addTopicBtn.textContent = "Add Topic";
            addTopicBtn.onclick = () => addTopic(subjectIndex, topicInput);

            addTopicContainer.appendChild(topicInput);
            addTopicContainer.appendChild(addTopicBtn);

            subjectDiv.appendChild(addTopicContainer);
            subjectsContainer.appendChild(subjectDiv);

            // Update Progress Bar
            updateProgress(subjectIndex);
        });
    }

    function addSubject() {
        const subjectName = subjectInput.value.trim();
        if (subjectName) {
            syllabus.push({ name: subjectName, topics: [] });
            saveData();
            renderSyllabus();
            subjectInput.value = ""; // Clear input field
        }
    }

    function addTopic(subjectIndex, inputField) {
        const topicName = inputField.value.trim();
        if (topicName) {
            syllabus[subjectIndex].topics.push({ name: topicName, completed: false });
            saveData();
            renderSyllabus();
        }
    }

    function toggleTopic(subjectIndex, topicIndex) {
        syllabus[subjectIndex].topics[topicIndex].completed =
            !syllabus[subjectIndex].topics[topicIndex].completed;
        saveData();
        renderSyllabus();
    }

    function updateProgress(subjectIndex) {
        const subject = syllabus[subjectIndex];
        const progressBar = document.querySelectorAll(".progress-bar")[subjectIndex];

        if (subject.topics.length > 0) {
            const completedCount = subject.topics.filter(topic => topic.completed).length;
            const progressPercent = (completedCount / subject.topics.length) * 100;
            progressBar.style.width = `${progressPercent}%`;
        } else {
            progressBar.style.width = "0%";
        }
    }

    addSubjectBtn.addEventListener("click", addSubject);
    renderSyllabus();
});
