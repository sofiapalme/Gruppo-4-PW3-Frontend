function getIdoDate(inputDate) {
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

let contactListTableInstance = null;

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
        const today = getIdoDate(new Date);
        
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
