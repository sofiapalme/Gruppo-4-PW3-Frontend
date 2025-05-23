async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errore = document.getElementById("errore");

    if (!email || !password) {
        errore.textContent = "Compila tutti i campi!";
        return;
    }

    const response = await fetch("http://localhost:8080/autch/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    });

    if(!response.ok){
        throw(new Error("Errore nella login."))
    }
    else{
        const data=await response.json();
        const decoded=jwtDecode(data.accessToken);
        console.log(data.accessToken)
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        if(decoded.groups.indexOf("Admin") >= 0){
            window.location.href = "dashboard.html";
        }
    }
}

function setSubmit(){
    const form =document.querySelector("form");
    form.onsubmit=function(e){
        e.preventDefault();
        login();
    };
}