function login() {
    let username = document.getElementById("username").value.trim();

    if (username === "") {
        alert("Please enter your name.");
        return;
    }

    localStorage.setItem("username", username);
    window.location.href = "homeindex.html"; // Redirect to profile page
}
