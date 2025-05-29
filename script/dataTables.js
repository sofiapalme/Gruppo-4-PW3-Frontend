import { refreshJwt } from "./jwtManager"

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
    await refreshJwt();
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
                { data: "citta"},
                { data: "mail"}, 
                { data: "cellulare"},
                { data: "luogoNascita"},
                { data: "dataNascita"}
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
    await refreshJwt();
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

if (visiteFutureNavList) {
    visiteFutureNavList.addEventListener("click", createVisiteFutureDataTable);
}

async function createVisiteFutureDataTable() {
    await refreshJwt();
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
        const today = getIsoDate(new Date);

        data.forEach(visit => {
            if (visit.dataInizio > today) {
                visit.dataInizio = convertToItalianDate(visit.dataInizio);
                visit.dataFine = convertToItalianDate(visit.dataFine);
                futureVisits.push(visit)
            }
        });

        console.log('Future visits:', futureVisits);

        const isAdmin = window.location.href.includes('dashboardAdmin');

        contactListTableInstance = new DataTable("#tabella-visite-future", {
            data: futureVisits,
            destroy: true,
            columns: isAdmin ? [
                { 
                    data: null,
                    render: function(data) {
                        return `${data.personaVisitatore?.nome || ''} ${data.personaVisitatore?.cognome || ''}`;
                    }
                },
                { 
                    data: null,
                    render: function(data) {
                        return `${data.oraInizio || ''} - ${data.oraFine || ''}`;
                    }
                },
                {
                    data: null,
                    render: function(data) {
                        const actions = [];
                        if (data.flagDPI) actions.push('DPI richiesto');
                        if (data.materialeInformatico?.id) actions.push('Mat. informatico');
                        if (data.flagAccessoConAutomezzo) actions.push('Automezzo');
                        return `<button class="action-button dettagli-btn" data-azienda="${data.personaVisitatore?.azienda || ''}" 
                                data-motivo="${data.motivo || ''}" data-responsabile="${data.responsabile?.nome} ${data.responsabile?.cognome}">
                                Dettagli${actions.length ? ` (${actions.join(', ')})` : ''}</button>`;
                    }
                }
            ] : [
                { data: "dataInizio" },
                { data: "dataFine" },
                { data: "oraInizio" },
                { data: "oraFine" },
                { data: "motivo" },
                { 
                    data: null,
                    render: function(data) {
                        return `${data.personaVisitatore?.nome || ''} ${data.personaVisitatore?.cognome || ''}`;
                    }
                },
                { 
                    data: null,
                    render: function(data) {
                        return `${data.responsabile?.nome || ''} ${data.responsabile?.cognome || ''}`;
                    }
                },
                { 
                    data: "flagDPI",
                    render: function(data) {
                        return data ? 'Sì' : 'No';
                    }
                },
                { 
                    data: "materialeInformatico",
                    render: function(data) {
                        return data?.descrizione || 'Nessuno';
                    }
                },
                { 
                    data: "flagAccessoConAutomezzo",
                    render: function(data) {
                        return data ? 'Sì' : 'No';
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

        // Add click handler for details button
        if (isAdmin) {
            $(document).on('click', '.dettagli-btn', function(e) {
                e.preventDefault();
                const azienda = $(this).data('azienda');
                const motivo = $(this).data('motivo');
                const responsabile = $(this).data('responsabile');
                
                // Show details in a modal or other UI element
                alert(`Dettagli visita:\nAzienda: ${azienda}\nMotivo: ${motivo}\nResponsabile: ${responsabile}`);
            });
        }
    } catch (error) {
        console.error("Errore nella creazione della tabella:", error.message);
        const table = document.querySelector("#tabella-visite-future");
        if (table) {
            const tbody = table.querySelector("tbody");
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="12">Errore nel caricamento dei dati</td></tr>';
            }
        }
    }
}

const visiteOrdierneNavList = document.getElementById("visualizza-elenco-visite-odierne");
const adminVisiteOdierneNavList = document.getElementById("admin-visite-odierne");

// Add event listeners for both reception and admin dashboard
if (visiteOrdierneNavList) {
    visiteOrdierneNavList.addEventListener("click", createVisiteOdierneDataTable);
}
if (adminVisiteOdierneNavList) {
    adminVisiteOdierneNavList.addEventListener("click", createVisiteOdierneDataTable);
}

async function createVisiteOdierneDataTable() {
    await refreshJwt();
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

        const todayVisits = [];
        const today = getIsoDate(new Date());

        data.forEach(visit => {
            if (visit.dataInizio === today) {
                visit.dataInizio = convertToItalianDate(visit.dataInizio);
                visit.dataFine = convertToItalianDate(visit.dataFine);
                todayVisits.push(visit);
            }
        });

        console.log('Today visits:', todayVisits);

        // Get the current page URL to determine whether we're in admin or reception dashboard
        const isAdmin = window.location.href.includes('dashboardAdmin');

        contactListTableInstance = new DataTable("#tabella-visite-odierne", {
            data: todayVisits,
            destroy: true,
            columns: isAdmin ? [
                { 
                    data: null,
                    render: function(data) {
                        return `${data.personaVisitatore?.nome || ''} ${data.personaVisitatore?.cognome || ''}`;
                    }
                },
                { 
                    data: null,
                    render: function(data) {
                        return `${data.oraInizio || ''} - ${data.oraFine || ''}`;
                    }
                },
                {
                    data: null,
                    render: function(data) {
                        const now = new Date();
                        const startTime = new Date(`${data.dataInizio} ${data.oraInizio}`);
                        const endTime = new Date(`${data.dataFine} ${data.oraFine}`);
                        
                        if (now < startTime) return 'In attesa';
                        if (now > endTime) return 'Completata';
                        return 'In corso';
                    }
                },
                {
                    data: null,
                    render: function(data) {
                        const actions = [];
                        if (data.flagDPI) actions.push('DPI richiesto');
                        if (data.materialeInformatico?.id) actions.push('Mat. informatico');
                        if (data.flagAccessoConAutomezzo) actions.push('Automezzo');
                        return `<button class="action-button dettagli-btn" data-azienda="${data.personaVisitatore?.azienda || ''}" 
                                data-motivo="${data.motivo || ''}" data-responsabile="${data.responsabile?.nome} ${data.responsabile?.cognome}">
                                Dettagli${actions.length ? ` (${actions.join(', ')})` : ''}</button>`;
                    }
                }
            ] : [
                { data: "dataInizio" },
                { data: "dataFine" },
                { data: "oraInizio" },
                { data: "oraFine" },
                { data: "motivo" },
                { 
                    data: null,
                    render: function(data) {
                        return `${data.personaVisitatore?.nome || ''} ${data.personaVisitatore?.cognome || ''}`;
                    }
                },
                { 
                    data: null,
                    render: function(data) {
                        return `${data.responsabile?.nome || ''} ${data.responsabile?.cognome || ''}`;
                    }
                },
                { 
                    data: "flagDPI",
                    render: function(data) {
                        return data ? 'Sì' : 'No';
                    }
                },
                { 
                    data: "materialeInformatico",
                    render: function(data) {
                        return data?.descrizione || 'Nessuno';
                    }
                },
                { 
                    data: "flagAccessoConAutomezzo",
                    render: function(data) {
                        return data ? 'Sì' : 'No';
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

        // Add click handler for details button
        if (isAdmin) {
            $(document).on('click', '.dettagli-btn', function(e) {
                e.preventDefault();
                const azienda = $(this).data('azienda');
                const motivo = $(this).data('motivo');
                const responsabile = $(this).data('responsabile');
                
                // Show details in a modal or other UI element
                // This should be implemented based on your UI requirements
                alert(`Dettagli visita:\nAzienda: ${azienda}\nMotivo: ${motivo}\nResponsabile: ${responsabile}`);
            });
        }

    } catch (error) {
        console.error("Errore nella creazione della tabella:", error.message);
        const table = document.querySelector("#tabella-visite-odierne");
        if (table) {
            const tbody = table.querySelector("tbody");
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="12">Errore nel caricamento dei dati</td></tr>';
            }
        }
    }
}

const storicoTimbratureVisitatoriNavList = document.getElementById("storico-timbrature-visitatori");
storicoTimbratureVisitatoriNavList.addEventListener("click", createStrocioTimbratureVisitatoriDataTable);

async function createStrocioTimbratureVisitatoriDataTable() {
    await refreshJwt();
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
        }        contactListTableInstance = new DataTable("#tabella-timbrature-visitatori", {
            data: data,
            destroy: true,
            columns: [
                { data: "nome" },
                { data: "cognome" },
                { data: "azienda" },
                { data: "codiceBadge" },
                { data: "dataTimbratura" },
                { data: "oraTimbrature" },
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

const storicoTimbratureDipendentiNavList = document.getElementById("storico-timbrature-dipendenti");
storicoTimbratureDipendentiNavList.addEventListener("click", createStrocioTimbratureDipendentiDataTable);

async function createStrocioTimbratureDipendentiDataTable() {
    await refreshJwt();
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
                { data: "codiceBadge" },
                { data: "dataTimbratura" },
                { data: "oraTimbrature" },
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
    await refreshJwt();
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
                { data: "codiceBadge" },
                { data: "dataTimbratura" },
                { data: "oraTimbrature" },
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
    await refreshJwt();
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
};

// Make functions globally accessible for showSection calls
window.createVisiteFutureDataTable = createVisiteFutureDataTable;
window.createVisiteOdierneDataTable = createVisiteOdierneDataTable;
window.createPersonDataTable = createPersonDataTable;
window.createContactListDataTable = createContactListDataTable;
window.createStrocioTimbratureVisitatoriDataTable = createStrocioTimbratureVisitatoriDataTable;
window.createStrocioTimbratureDipendentiDataTable = createStrocioTimbratureDipendentiDataTable;
window.createStoricoTimbratureMensaDataTable = createStoricoTimbratureMensaDataTable;
