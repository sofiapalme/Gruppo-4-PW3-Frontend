// Utility functions
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

let todayVisitsDataInstace = null;
let futureVisitDatainstance = null;

// === Script specifico per Desktop ===
function showSection(id) {
    // Nascondi tutte le sezioni
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Mostra solo la sezione richiesta
    const sectionToShow = document.getElementById(id);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
        triggerSectionDataLoading(id);
    }
}

// Function to trigger data loading for specific sections
function triggerSectionDataLoading(sectionId) {
    console.log('🔄 Triggering data loading for section:', sectionId);
    
    switch(sectionId) {
        case 'visualizza-elenco-visite-future-section':
            if (window.createVisiteFutureDataTable) {
                console.log('📊 Loading future visits data...');
                window.createVisiteFutureDataTable();
            }
            break;
        case 'visualizza-elenco-visite-odierne-section':
            if (window.createVisiteOdierneDataTable) {
                console.log('📊 Loading today visits data...');
                window.createVisiteOdierneDataTable();
            }
            break;
        default:
            console.log('No data loading needed for this section');
            break;
    }
}

// Show home section and hide others
function showHomeSection() {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Show home section
    const homeSection = document.getElementById('admin-home-section');
    if (homeSection) {
        homeSection.style.display = 'block';
        loadHomePageData();
    }
}

window.addEventListener("load", creatHomeDataTables);

async function creatHomeDataTables() {
    const accessToken = localStorage.getItem("accessToken");
    const decodedAccessToken = jwtDecode(accessToken);
    const today = getIsoDate(new Date);
    const todayVisits = new Array;
    const futureVisits = new Array;

    const url = "http://localhost:8080/people?id=" + decodedAccessToken.id;

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

        if (todayVisitsDataInstace) {
            todayVisitsDataInstace.destroy();
            todayVisitsDataInstace = null;
        }

        if (futureVisitDatainstance) {
            futureVisitDatainstance.destroy();
            futureVisitDatainstance = null;
        }

        data.forEach(visit => {
            if (new Date(visit.dataInizio) === today) {
                todayVisits.push(visit);
            }
            else if (new Date(visit.dataInizio) > today) {
                futureVisits.push(visit);
            }
        });

        todayVisits.forEach(todayVisit => {
            todayVisit.dataInizio = convertToItalianDate(todayVisit.dataInizio);
            todayVisit.dataFine = convertToItalianDate(todayVisit.dataFine);

        });

        futureVisits.forEach(futureVisit => {
            futureVisit.dataInizio = convertToItalianDate(futureVisit.dataInizio);
            futureVisit.dataFine = convertToItalianDate(futureVisit.dataFine);

        });

        todayVisitsDataInstace = new DataTable("#requester-home-table-visite-odierne", {
            data: todayVisits,
            destroy: true,
            columns: [
                { data: "nome" },
                { data: "cognome" },
                { data: "dataInizio" },
                { data: "oraInizio" },
                { data: "dataFine" },
                { data: "oraFine" }
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

        futureVisitDatainstance = new DataTable("#requester-home-table-visite-future", {
            data: futureVisits,
            destroy: true,
            columns: [
                { data: "nome" },
                { data: "cognome" },
                { data: "dataInizio" },
                { data: "oraInizio" },
                { data: "dataFine" },
                { data: "oraFine" }
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
    }
    catch {
        console.error("Errore nella creazione della tabella:", error.message);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    showHomeSection();

    const menuItems = document.querySelectorAll('.menu-item');
    const submenuItems = document.querySelectorAll('.submenu-item');

    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const sectionId = item.id + '-section';
            showSection(sectionId);
        });
    });

    // Handle home menu item click
    const homeMenuItem = document.getElementById('admin-home');
    if (homeMenuItem) {
        homeMenuItem.addEventListener('click', function(e) {
            e.preventDefault();
            showHomeSection();
        });
    }
});

// Initialize DataTable with common settings
function initializeDataTable(table) {
    return new DataTable(table, {
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
}

let contactListTableInstance = null;

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
                            <form action="/FAKE/ADMINSCRIPT" method="POST">
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