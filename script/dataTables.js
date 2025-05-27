let contactListTableInstance = null;

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
            ]
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
            ]
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
            ]
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
            ]
        });

    } catch (error) {
        console.error("Errore nella creazione della tabella:", error.message);
    }
}
