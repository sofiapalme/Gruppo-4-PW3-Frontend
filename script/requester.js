import { jwtDecode } from "./jwtManager.js";
import { refreshJwt } from "./jwtManager.js";

let todayVisitsDataInstace = null;
let futureVisitDatainstance = null
let contactListTableInstance = null;
let visitsTableInstance = null;

function getIsoDate(inputDate) {
    const formattedDate = inputDate.toISOString().split('T')[0];
    return formattedDate;
}

function convertToItalianDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function addSevenDaysToISO(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
}

function formatTimeToHourMinute(timeStr) {
    const [hours, minutes] = timeStr.split(":");
    return `${hours}:${minutes}`;
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

//Creates the form that creates a new visit;
const createVisitNavElement = document.getElementById("requester-create-visit");
createVisitNavElement.addEventListener("click", createVisitForm);

async function createVisitForm() {
    const peopleUrl = "http://localhost:8080/people";
    const itProvisionUrl = "http://localhost:8080/it-provision";
    const accessToken = localStorage.getItem("accessToken");
    const visitors = new Array;
    const employees = new Array;

    try {
        const peopleResponse = await fetch(peopleUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            }
        });

        if (!peopleResponse.ok) {
            throw new Error(`Errore nel recupero dei dati: ${response.status}`);
        }

        const peopleData = await peopleResponse.json();;

        if (contactListTableInstance) {
            contactListTableInstance.destroy();
            contactListTableInstance = null;
        }

        peopleData.forEach(person => {
            if (person.azienda === "Secondo Mona") {
                employees.push(person);
            }
            else {
                visitors.push(person)
            }
        });

        const visitorSelect = document.getElementById("idVisitatore-crea-visita");
        visitorSelect.innerHTML = "";

        visitors.forEach(visitor => {
            const option = document.createElement("option");
            option.innerHTML = visitor.nome + " " + visitor.cognome + " - " + visitor.azienda + " - " + visitor.mail;
            option.value = visitor.idPersona;
            visitorSelect.appendChild(option);
        });

        const employeeSelect = document.getElementById("idResponsabile-crea-visita");
        employeeSelect.innerHTML = "";

        employees.forEach(employee => {
            const option = document.createElement("option");
            option.innerHTML = employee.nome + " " + employee.cognome + " - " + employee.azienda + " - " + employee.mail;
            option.value = employee.idPersona;
            employeeSelect.appendChild(option);
        });

        const itProvisionResponse = await fetch(itProvisionUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            }
        });

        if (!itProvisionResponse.ok) {
            throw new Error(`Errore nel recupero dei dati: ${itProvisionResponse.status}`);
        }

        const itProvisionData = await itProvisionResponse.json();

        const itProvisionSelect = document.getElementById("materiale-informatico-crea-visita")
        itProvisionSelect.innerHTML = "";

        itProvisionData.forEach(itProvision => {
            const option = document.createElement("option");
            option.innerHTML = itProvision.tipologia + " - " + itProvision.marca + " - " + itProvision.seriale;
            option.value = itProvision.id;
            itProvisionSelect.appendChild(option);
        });
    }
    catch {
        console.error("Errore nella creazione della tabella:", error.message);
    }
}

//Collects the data to create a new visit
const createVisitButton = document.getElementById("crea-visita-button");
createVisitButton.addEventListener("click", createVisit)

function createVisit(event) {
    event.preventDefault();

    const idVisitatore = document.getElementById("idVisitatore-crea-visita").value;
    const idResponsabile = document.getElementById("idResponsabile-crea-visita").value;
    const idMaterialeInformatico = document.getElementById("materiale-informatico-crea-visita").value;
    const dataInizio = document.getElementById("data-inizio").value;
    const oraInizio = document.getElementById("ora-inizio").value;
    const motivo = document.getElementById("motivo").value;
    const flagAccessoConAutomezzo = document.getElementById("automezzo").checked;
    const flagDPI = document.getElementById("dpi").checked;

    const requestBody = {
        "dataInizio": dataInizio,
        "oraInizio": oraInizio,
        "dataFine": null,
        "oraFine": null,
        "motivo": motivo,
        "idVisitatore": idVisitatore,
        "idResponsabile": idResponsabile,
        "flagDPI": flagDPI,
        "idMaterialeInformatico": idMaterialeInformatico,
        "vincolo": null,
        "flagAccessoConAutomezzo": flagAccessoConAutomezzo
    }
    console.log(requestBody)
    alert("inizio fetch")
    createVisitFetch(requestBody);
}

//Performs the fetch function to create a new visit
async function createVisitFetch(requestBody) {
    await refreshJwt();
    const url = "http://localhost:8080/visit";
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

        alert("Persona salvata con successo! (forse)")
    }
    catch (error) {
        console.error("Errore nella creazione della tabella:", error.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const accessToken = localStorage.getItem('accessToken');
    const decodetoken = jwtDecode(accessToken, { header: true });
    const userId = jwtDecode(accessToken)?.id;
    fetch(`http://localhost:8080/visit?id=${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': accessToken ? `Bearer ${accessToken}` : undefined
        }
    })
        .then(response => {
            if (!response.ok) throw new Error('Errore nel recupero delle visite');
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('tabella-mie-visite');
            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = '<p>Nessuna visita trovata.</p>';
                return;
            }
            let html = '<table class="display custom-table"><thead><tr>' +
                '<th>Nome</th><th>Cognome</th><th>Data inizio</th><th>Ora inizio</th><th>Data fine</th><th>Ora fine</th><th>Motivo</th></tr></thead><tbody>';
            data.forEach(visit => {
                html += `<tr>
                <td>${visit.personaVisitatore?.nome || ''}</td>
                <td>${visit.personaVisitatore?.cognome || ''}</td>
                <td>${visit.dataInizio || ''}</td>
                <td>${visit.oraInizio || ''}</td>
                <td>${visit.dataFine || ''}</td>
                <td>${visit.oraFine || ''}</td>
                <td>${visit.motivo || ''}</td>
            </tr>`;
            });
            html += '</tbody></table>';
            container.innerHTML = html;
        })
        .catch(err => {
            document.getElementById('tabella-mie-visite').innerHTML = '<p style="color:red">Errore nel caricamento delle visite</p>';
        });


    const contactListnavElement = document.getElementById("requester-elenco-telefonico");
    contactListnavElement.addEventListener('click', createContactListDataTable);

    async function createContactListDataTable() {
        const url = "http://localhost:8080/employee-contact-list";
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

            if (contactListTableInstance) {
                contactListTableInstance.destroy();
                contactListTableInstance = null;
            }

            contactListTableInstance = new DataTable("#tabella-elenco-telefonico", {
                data: data,
                destroy: true,
                columns: [
                    { data: "nome" },
                    { data: "cognome" },
                    { data: "email" },
                    { data: "telefono" },
                    { data: "cellulare" }
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

});

//Creates the datatables for the user's visits
const nextVisitsNavElement = document.getElementById("requester-visite")
nextVisitsNavElement.addEventListener("click", createVisitsDataTable);

const nextVisitsButton = document.getElementById("home-next-visits-button");
nextVisitsButton.addEventListener("click", createVisitsDataTable);

async function createVisitsDataTable(event) {
    await refreshJwt();
    event.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    let fromDate = document.getElementById("home-next-visits-date").value || null;

    const decodedAccessToken = jwtDecode(accessToken);
    const idResponsabile = String(decodedAccessToken.id);
    let url;
    if (!fromDate) {
        url = `http://localhost:8080/visit/by-date/${idResponsabile}`;
    }
    else {
        alert("Sono nell'else")
        url = `http://localhost:8080/visit/by-date/${idResponsabile}?fromdate=${fromDate}`;
    }

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

        if (visitsTableInstance) {
            visitsTableInstance.destroy();
            visitsTableInstance = null;
        }

        const futureVisits = new Array;
        data.forEach(visit => {
            visit.dataInizio = visit.dataInizio ? convertToItalianDate(visit.dataInizio) : "N/D";
            visit.dataFine = visit.dataFine ? convertToItalianDate(visit.dataFine) : "N/D";
            visit.oraInizio = visit.oraInizio ? formatTimeToHourMinute(visit.oraInizio) : "N/D";
            visit.oraFine = visit.oraFine ? formatTimeToHourMinute(visit.oraFine) : "N/D";
            visit.motivo = visit.motivo || "N/D";

            visit.visitatore = visit.visitatore
                ? `${visit.visitatore.nome} ${visit.visitatore.cognome}`
                : "N/A";

            visit.responsabile = visit.responsabile
                ? `${visit.responsabile.nome} ${visit.responsabile.cognome}`
                : "N/A";

            visit.materialeInformatico = visit.materialeInformatico
                ? `${visit.materialeInformatico.tipologia} ${visit.materialeInformatico.marca} ${visit.materialeInformatico.seriale}`
                : "Nessun materiale";

            visit.flagDPI = visit.flagDPI === true ? "Sì" : "No";
            visit.accessoConAutomezzo = visit.accessoConAutomezzo === true ? "Sì" : "No";

            futureVisits.push(visit);
        });

        visitsTableInstance = new DataTable("#home-table-next-visits", {
            data: futureVisits,
            destroy: true,
            columns: [
                { data: "visitatore" },
                { data: "responsabile" },
                { data: "dataInizio" },
                { data: "oraInizio" },
                { data: "dataFine" },
                { data: "oraFine" },
                { data: "motivo" },
                { data: "flagDPI" },
                { data: "materialeInformatico" },
                { data: "accessoConAutomezzo" },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `
                            <form action="/your-target-url" method="POST">
                                <input type="hidden" name="if" value="${row.id}" />
                                <button type="submit" class="edit-btn">Modifica</button>
                                <button type="submit" class="edit-btn">Elimina</button>
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

        let toDate;
        if (!fromDate) {
            fromDate = new Date().toISOString().split('T')[0];
            toDate = addSevenDaysToISO(fromDate)

            fromDate = convertToItalianDate(fromDate)
            toDate = convertToItalianDate(toDate);

            const homeParagraph = document.getElementById("home-paragraph-next-visits");
            homeParagraph.innerHTML = "Visualizza le visite dal " + fromDate + " al " + toDate;

        }
        else {
            fromDate = convertToItalianDate(fromDate)

            const homeParagraph = document.getElementById("home-paragraph-next-visits");
            homeParagraph.innerHTML = "Visualizza le visite del " + fromDate;
        }

    } catch (error) {
        console.error("Errore nella creazione della tabella:", error.message);
    }

}
