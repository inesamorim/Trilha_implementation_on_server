window.onload = function() {
    var login_box = document.getElementById("login");
    var loginButton = document.getElementById("loginButton");
    var closeBtn = document.getElementById("close")[0];

    loginButton.onclick = function() {
        login_box.style.display = "block";
    }

    closeBtn.onclick = function() {
        login_box.style.display = none;
    }

    window.onclick = function(event) {
        if (event.target == login_box) {
            login_box.style.display = none;
        }
    }
}