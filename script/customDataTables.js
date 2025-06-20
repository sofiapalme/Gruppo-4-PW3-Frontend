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

const visualizzaPersoneNavElement = document.getElementById("visualizza-elenco-visite-odierne");
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

async function createPerson(event) {
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
    fax = fax === "" ? null : fax;

    let pIva = String(document.getElementById("pIva").value);
    pIva = pIva === "" ? null : pIva;

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
    numCentriCosto = numCentriCosto === 0 ? null : numCentriCosto;

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

    console.log(requestBody);
    createPersonFetch(requestBody);
}

async function createPersonFetch(requestBody) {
    await refreshJwt();
    console.log(requestBody);
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
<<<<<<< HEAD:script/dataTables.js

        alert("Persona salvata con successo! (forse)");
=======
        window.location.reload();
>>>>>>> b13a8871136efe2c7de082ace1a41199fbd3e372:script/customDataTables.js
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
        const today = getIsoDate(new Date);        data.forEach(visit => {
            if (visit.dataInizio > today) {
                visit.dataInizio = convertToItalianDate(visit.dataInizio);
                visit.dataFine = visit.dataFine ? convertToItalianDate(visit.dataFine) : null;
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
                // Salva la data originale per il confronto
                visit.dataInizioOriginal = visit.dataInizio;
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
                { 
                    data: "oraTimbrature",
                    render: function(data) {
                        return formatTime(data);
                    }
                },
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
        }        contactListTableInstance = new DataTable("#tabella-timbrature-dipendenti", {
            data: data,
            destroy: true,
            columns: [
                { data: "nome" },
                { data: "cognome" },
                { data: "azienda" },
                { data: "codiceBadge" },
                { data: "dataTimbratura" },
                { 
                    data: "oraTimbrature",
                    render: function(data) {
                        return formatTime(data);
                    }
                },
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
        }        contactListTableInstance = new DataTable("#tabella-timbrature-mensa", {
            data: data,
            destroy: true,
            columns: [
                { data: "nome" },
                { data: "cognome" },
                { data: "azienda" },
                { data: "codiceBadge" },
                { data: "dataTimbratura" },
                { 
                    data: "oraTimbrature",
                    render: function(data) {
                        return formatTime(data);
                    }
                },
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

// Event listeners per i pulsanti della tabella visite odierne
document.addEventListener('click', function(event) {    // Gestione click pulsante Dettagli visite odierne
    if (event.target.classList.contains('dettagli-visite-odierne-btn')) {
        const azienda = event.target.getAttribute('data-azienda');
        const flagDPI = event.target.getAttribute('data-flagdpi');
        const materiale = event.target.getAttribute('data-materiale');
        const automezzo = event.target.getAttribute('data-automezzo');
        
        // Popola la modale con i dati (solo i campi richiesti)
        document.getElementById('modal-visite-odierne-azienda').textContent = azienda;
        document.getElementById('modal-visite-odierne-flagdpi').textContent = flagDPI;
        document.getElementById('modal-visite-odierne-materiale').textContent = materiale;
        document.getElementById('modal-visite-odierne-automezzo').textContent = automezzo;
        
        // Mostra la modale
        document.getElementById('dettagli-visite-odierne-modal').style.display = 'flex';
    }

    // Gestione click pulsante Dettagli visite future
    if (event.target.classList.contains('dettagli-visite-future-btn')) {
        const azienda = event.target.getAttribute('data-azienda');
        const flagDPI = event.target.getAttribute('data-flagdpi');
        const materiale = event.target.getAttribute('data-materiale');
        const automezzo = event.target.getAttribute('data-automezzo');
        
        // Popola la modale con i dati
        document.getElementById('modal-visite-future-azienda').textContent = azienda;
        document.getElementById('modal-visite-future-flagdpi').textContent = flagDPI;
        document.getElementById('modal-visite-future-materiale').textContent = materiale;
        document.getElementById('modal-visite-future-automezzo').textContent = automezzo;
        
        // Mostra la modale
        document.getElementById('dettagli-visite-future-modal').style.display = 'flex';
    }    // Gestione click pulsante Elimina visite odierne
    if (event.target.classList.contains('elimina-btn')) {
        // Trova la riga della tabella
        const row = event.target.closest('tr');
        if (!row) return;
        
        // Prendi l'ID della visita dalla riga DataTable 
        const table = $('#tabella-visite-odierne').DataTable();
        const rowData = table.row(row).data();
        const visitId = rowData?.id;
        
        if (!visitId) {
            alert('Impossibile trovare l\'ID della visita');
            return;
        }
        
        // Memorizza i dati per l'eliminazione e mostra la modale
        window.visitIdToDelete = visitId;
        window.rowToDelete = row;
        window.tableToUpdate = '#tabella-visite-odierne';
        document.getElementById('delete-modal-message').textContent = 'Sei sicuro di voler eliminare questa visita?';
        document.getElementById('delete-modal').style.display = 'flex';
    }

    // Gestione click pulsante Elimina visite future
    if (event.target.classList.contains('elimina-future-btn')) {
        // Trova la riga della tabella
        const row = event.target.closest('tr');
        if (!row) return;
        
        // Prendi l'ID della visita dalla riga DataTable 
        const table = $('#tabella-visite-future').DataTable();
        const rowData = table.row(row).data();
        const visitId = rowData?.id;
        
        if (!visitId) {
            alert('Impossibile trovare l\'ID della visita');
            return;
        }
        
        // Memorizza i dati per l'eliminazione e mostra la modale
        window.visitIdToDelete = visitId;
        window.rowToDelete = row;
        window.tableToUpdate = '#tabella-visite-future';
        document.getElementById('delete-modal-message').textContent = 'Sei sicuro di voler eliminare questa visita futura?';
        document.getElementById('delete-modal').style.display = 'flex';
    }
      // Gestione click per chiudere le modali
    if (event.target.id === 'close-dettagli-visite-odierne-modal' || event.target.id === 'dettagli-visite-odierne-modal') {
        document.getElementById('dettagli-visite-odierne-modal').style.display = 'none';
    }
    
    if (event.target.id === 'close-dettagli-visite-future-modal' || event.target.id === 'dettagli-visite-future-modal') {
        document.getElementById('dettagli-visite-future-modal').style.display = 'none';
    }
    
    // Gestione click pulsante Assegna Badge
    if (event.target.textContent === 'Assegna Badge') {
        // Trova la riga della tabella
        const row = event.target.closest('tr');
        if (!row) return;
        
        // Prendi i dati della riga DataTable 
        const table = $('#tabella-visite-odierne').DataTable();
        const rowData = table.row(row).data();
        const visitatoreName = rowData?.personaVisitatore?.nome || '';
        const visitatoreSurname = rowData?.personaVisitatore?.cognome || '';
        
        // Richiedi il numero del badge
        const badgeNumber = prompt(`Inserisci il numero del badge per ${visitatoreName} ${visitatoreSurname}:`);
        
        if (badgeNumber && badgeNumber.trim() !== '') {
            // Qui puoi implementare la logica per assegnare il badge
            // Per ora mostriamo solo un messaggio di conferma
            alert(`Badge ${badgeNumber.trim()} assegnato a ${visitatoreName} ${visitatoreSurname}`);
            
            // TODO: Implementare chiamata API per assegnare il badge
            // fetch(`http://localhost:8080/badge/assign`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            //     },
            //     body: JSON.stringify({
            //         visitId: rowData.id,
            //         badgeNumber: badgeNumber.trim()
            //     })
            // })
        }
    }
});

// Event listener per chiudere la modale cliccando fuori
document.getElementById('dettagli-visite-odierne-modal').addEventListener('click', function(event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});

// Event listener per chiudere la modale visite future cliccando fuori
document.getElementById('dettagli-visite-future-modal').addEventListener('click', function(event) {
    if (event.target === this) {
        this.style.display = 'none';
    }
});
