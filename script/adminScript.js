let contactListTableInstance = null;

function getIsoDate(inputDate) {
    const formattedDate = inputDate.toISOString().split('T')[0];
    return formattedDate;
}

function italianDateToISO(italianDate) {
    const splittedDate = italianDate.split('/');
    const isoDate = splittedDate[2] + "-" + splittedDate[1] + "-" + splittedDate[0];
    return isoDate;
}

function convertToItalianDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

const visualizzaUtentiNavElement = document.getElementById("admin-utenti");
visualizzaUtentiNavElement.addEventListener("click", createUserDataTable);

async function createUserDataTable() {
    const url = "http://localhost:8080/user";
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            }
        });

        if (!response.ok) {
            throw new Error(`Errore nel recupero dei dati: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (contactListTableInstance) {
            contactListTableInstance.destroy();
            contactListTableInstance = null;
        }

        const modifyButton = document.createElement("button");
        modifyButton.innerHTML = "Modifica";

        contactListTableInstance = new DataTable("#tabella-utenti", {
            data: data,
            destroy: true,
            columns: [
                { data: "email" },
                { data: "role" },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `
                            <form action="/your-target-url" method="POST">
                                <input type="hidden" name="userId" value="${row.id}" />
                                <button type="submit" class="edit-btn">Modifica</button>
                            </form>
                        `;
                    }
                }
            ],
            lengthChange: false,
            pageLength: 8,
            autoWidth: false,
            responsive: true,
            language: {
                info: "Pagina _PAGE_ di _PAGES_",
                infoEmpty: "Nessun elemento disponibile",
                infoFiltered: "(filtrati da _MAX_ elementi totali)",
                search: "Cerca:",
                paginate: {
                    next: ">",
                    previous: "<"
                },
                emptyTable: "Nessun dato presente nella tabella",
                zeroRecords: "Nessun risultato trovato"
            }
        });
    } catch (error) {
        console.error("Errore nella creazione della tabella:", error.message);
    }
}

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