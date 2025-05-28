function createUser(event) {
    event.preventDefault();

    const email = document.getElementById("create-user-email").value;
    const password = document.getElementById("create-user-password").value;
    const roleId = document.getElementById("create-user-ruolo").value;
    let description;

    if (roleId === 1) {
        description = "Admin";
    }
    else if (roleId === 2) {
        description = "Requester";
    }
    else if (roleId === 3) {
        description = "Reception"
    }

    requestBody = {
        "email": email,
        "password": password,
        "role": {
            "id": roleId,
            "description": description
        }
    }

    createUserFetch(requestBody)
}

async function createUserFetch(requestBody) {
    const url = "http://localhost:8080/user/add";
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Errore nel recupero dei dati: ${response.status}`);
        }

        alert("Utente salvato con successo! (forse)")
    } catch (error) {
        console.error("Errore nella creazione della tabella:", error.message);
    }
}