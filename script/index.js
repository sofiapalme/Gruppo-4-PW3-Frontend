import { jwtDecode } from "./jwtManager.js"

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    form.addEventListener("submit", login);
});

async function login(event) {
    event.preventDefault();
    const inputEmail = document.getElementById("email").value
    const inputPassword = document.getElementById("password").value;

    const url = "http://localhost:8080/auth/login";
    const requestBody = {
        email: inputEmail,
        password: inputPassword
    }

    try {
        const response = await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)
            });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();

        localStorage.setItem("accessToken", json.accessToken)
        localStorage.setItem("refreshToken", json.refreshToken)
        roleRedirection();
    }
    catch (error) {
        alert(error)
        console.error(error);
    }
};

function roleRedirection() {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        const decodedToken = jwtDecode(accessToken);

        if (decodedToken.groups.indexOf("Admin") >= 0) {
            window.location.href = "/pages/dashboardAdmin.html";
        }
        else if (decodedToken.groups.indexOf("Requester") >= 0) {
            window.location.href = "/pages/dashboardRequester.html";
        }
        else if (decodedToken.groups.indexOf("Reception") >= 0) {
            window.location.href = "/pages/dashboardReceptionist.html";
        }
        else {
            window.location.href = "index.html";
        }
    }
};
