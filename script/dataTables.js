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

const visualizzaPersoneNavElement = document.getElementById("visualizza-elenco-persone");
visualizzaPersoneNavElement.addEventListener("click", createPersonDataTable);

async function createPersonDataTable() {
    const url = "http://localhost:8080/people";
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

        const peopleList = new Array;

        data.forEach(person => {
            person.dataNascita = convertToItalianDate(person.dataNascita);
            peopleList.push(person)
        });

        contactListTableInstance = new DataTable("#tabella-persone", {
            data: peopleList,
            destroy: true,
            columns: [
                { data: "nome" },
                { data: "cognome" },
                { data: "azienda" },
                { data: "citta" },
                { data: "mail" },
                { data: "cellulare" },
                { data: "luogoNascita" },
                { data: "dataNascita" }
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

function createPerson(event) {
    event.preventDefault();
    const nome = String(document.getElementById("nome-crea-persona").value);
    const cognome = String(document.getElementById("cognome-crea-persona").value);
    const azienda = String(document.getElementById("azienda-crea-persona").value);
    const indirizzo = String(document.getElementById("indirizzo").value);
    const citta = String(document.getElementById("citta").value);
    const provincia = String(document.getElementById("provincia").value);
    const nazione = String(document.getElementById("nazione").value);
    const telefono = String(document.getElementById("telefono").value);
    const cellulare = String(document.getElementById("cellulare").value);
    let fax = String(document.getElementById("fax").value);
    fax = fax === "" ? null : value;

    let pIva = String(document.getElementById("pIva").value);
    pIva = pIva === "" ? null : value;

    const cf = String(document.getElementById("cf").value);
    const mail = String(document.getElementById("mail-crea-persona").value);
    const dataAssunzione = document.getElementById("dataAssunzione").value; // date string
    console.log("dataAssunzione: " + dataAssunzione)

    if (dataAssunzione === null) {
        dataAssunzione = "1970-01-01";
    }

    const luogoNascita = String(document.getElementById("luogoNascita").value);
    const dataNascita = document.getElementById("dataNascita").value; // date string
    const tipoDocumento = String(document.getElementById("tipoDocumento").value);
    const numeroDocumento = String(document.getElementById("numeroDocumento").value);
    const dataScadenzaDoc = document.getElementById("dataScadenzaDoc").value; // date string
    const duvri = String(document.getElementById("duvri").checked);
    let numCentriCosto = Number(document.getElementById("numCentriCosto").value);
    numCentriCosto = numCentriCosto === 0 ? null : value;

    const flagDocPrivacy = document.getElementById("flagDocPrivacy").checked;
    const dataConsegnaDocPrivacy = document.getElementById("dataConsegnaDocPrivacy").value; // date string
    const idRuolo = Number(document.getElementById("idRuolo").value);

    const requestBody = {
        "idRuna": null,
        "nome": nome,
        "cognome": cognome,
        "diminutivo": null,
        "azienda": azienda,
        "indirizzo": indirizzo,
        "citta": citta,
        "provincia": provincia,
        "nazione": nazione,
        "telefono": telefono,
        "cellulare": cellulare,
        "fax": fax,
        "pIva": pIva,
        "cf": cf,
        "mail": mail,
        "foto": null,
        "dataAssunzione": dataAssunzione,
        "matricola": null,
        "idFiliale": null,
        "idMansione": null,
        "idDeposito": null,
        "idRiferimento": null,
        "visitatore": false,
        "accessNumber": null,
        "accessCount": null,
        "accessUpdate": null,
        "luogoNascita": luogoNascita,
        "dataNascita": dataNascita,
        "dataScadCertificato": null,
        "preposto": null,
        "antincendio": null,
        "primoSoccorso": null,
        "tipoDocumento": tipoDocumento,
        "numeroDocumento": numeroDocumento,
        "dataScadenzaDoc": dataScadenzaDoc,
        "duvri": duvri,
        "numCentriCosto": numCentriCosto,
        "flagDocPrivacy": flagDocPrivacy,
        "dataConsegnaDocPrivacy": dataConsegnaDocPrivacy,
        "idRuolo": idRuolo
    }

    console.log(requestBody)
    createPersonFetch(requestBody);
}

async function createPersonFetch(requestBody) {
    const url = "http://localhost:8080/people";
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
    } catch (error) {
        console.error("Errore nella creazione della tabella:", error.message);
    }
};

const visiteFutureNavList = document.getElementById("visualizza-elenco-visite-future");
visiteFutureNavList.addEventListener("click", createVisiteFutureDataTable);

async function createVisiteFutureDataTable() {
    const url = "http://localhost:8080/visit";
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

        const futureVisits = new Array;
        const today = getIdoDate(new Date);

        data.forEach(visit => {
            if (visit.dataInizio > today) {
                visit.dataInizio = convertToItalianDate(visit.dataInizio);
                visit.dataFine = convertToItalianDate(visit.dataFine);
                futureVisits.push(visit)
            }
        });
        console.log(futureVisits)

        contactListTableInstance = new DataTable("#tabella-visite-future", {
            data: futureVisits,
            destroy: true,
            columns: [
                { data: "dataInizio" },
                { data: "dataFine" },
                { data: "oraInizio" },
                { data: "oraFine" },
                { data: "motivo" },
                { data: "personaVisitatore.nome" },
                { data: "responsabile.nome" },
                { data: "flagDPI" },
                { data: "materialeInformatico.id" },
                { data: "flagAccessoConAutomezzo" }
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

const visiteOrdierneNavList = document.getElementById("visualizza-elenco-visite-odierne");
visiteOrdierneNavList.addEventListener("click", createVisiteOdierneDataTable);

async function createVisiteOdierneDataTable() {
    const url = "http://localhost:8080/visit";
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

        const todayVisits = new Array;
        const today = getIsoDate(new Date);

        data.forEach(visit => {
            if (visit.dataInizio === today) {
                visit.dataInizio = convertToItalianDate(visit.dataInizio);
                visit.dataFine = convertToItalianDate(visit.dataFine);
                todayVisits.push(visit)
            }
        });
        console.log(todayVisits)

        contactListTableInstance = new DataTable("#tabella-visite-odierne", {
            data: todayVisits,
            destroy: true,
            columns: [
                { data: "dataInizio" },
                { data: "dataFine" },
                { data: "oraInizio" },
                { data: "oraFine" },
                { data: "motivo" },
                { data: "personaVisitatore.nome" },
                { data: "responsabile.nome" },
                { data: "flagDPI" },
                { data: "materialeInformatico.id" },
                { data: "flagAccessoConAutomezzo" }
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

const storicoTimbratureVisitatoriNavList = document.getElementById("storico-timbrature-visitatori");
storicoTimbratureVisitatoriNavList.addEventListener("click", createStrocioTimbratureVisitatoriDataTable);

async function createStrocioTimbratureVisitatoriDataTable() {
    const url = "http://localhost:8080/badge-record-history/visitors";
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

        contactListTableInstance = new DataTable("#tabella-timbrature-visitatori", {
            destroy: true,
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

const storicoTimbratureDipendentiNavList = document.getElementById("storico-timbrature-dipendenti");
storicoTimbratureDipendentiNavList.addEventListener("click", createStrocioTimbratureDipendentiDataTable);

async function createStrocioTimbratureDipendentiDataTable() {
    const url = "http://localhost:8080/badge-record-history/secondo-mona";
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

        contactListTableInstance = new DataTable("#tabella-timbrature-dipendenti", {
            data: data,
            destroy: true,
            columns: [
                { data: "nome" },
                { data: "cognome" },
                { data: "azienda" },
                { data: "idBadge" },
                { data: "codiceBadge" },
                { data: "idTimbrature" },
                { data: "dataTimbratura" },
                { data: "oraTimbrature" },
                { data: "idTimbratrice" },
                { data: "descrizioneTimbratrice" }
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

const storicoTimbratureMensaNavList = document.getElementById("storico-timbrature-mensa");
storicoTimbratureMensaNavList.addEventListener("click", createStoricoTimbratureMensaDataTable);

async function createStoricoTimbratureMensaDataTable() {
    const url = "http://localhost:8080/badge-record-history/lunch-area";
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

        contactListTableInstance = new DataTable("#tabella-timbrature-mensa", {
            data: data,
            destroy: true,
            columns: [
                { data: "nome" },
                { data: "cognome" },
                { data: "azienda" },
                { data: "idBadge" },
                { data: "codiceBadge" },
                { data: "idTimbrature" },
                { data: "dataTimbratura" },
                { data: "oraTimbrature" },
                { data: "idTimbratrice" },
                { data: "descrizioneTimbratrice" }
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

const contactListnavElement = document.getElementById("visualizza-elenco-tel-sm");
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

        contactListTableInstance = new DataTable("#contactListTable", {
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
