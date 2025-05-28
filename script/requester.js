import { jwtDecode } from "./jwtManager.js";

let contactListTableInstance = null;

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
