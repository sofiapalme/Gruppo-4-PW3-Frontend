function showSection(id) {
    // Nascondi tutte le sezioni
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Mostra solo la sezione richiesta
    const sectionToShow = document.getElementById(id);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    }
}

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function (e) {
        const submenu = this.querySelector('.submenu');
        const arrowImg = this.querySelector('.arrow img');

        document.querySelectorAll('.menu-item, .submenu-item').forEach(el => {
            el.classList.remove('selected');
        });

        this.classList.add('selected');

        // Se non c'è submenu, mostra la sezione corrispondente
        if (!submenu) {
            showSection(item.id + '-section');
        }

        // Gestione dei sottomenu
        document.querySelectorAll('.submenu').forEach(s => {
            if (s !== submenu) {
                s.classList.remove('active');
            }
        });

        document.querySelectorAll('.arrow img').forEach(img => {
            if (img !== arrowImg) {
                img.src = 'assets/down_arrow_white_icon.png';
                img.alt = 'Freccia giù';
            }
        });

        if (submenu) {
            const isActive = submenu.classList.contains('active');
            submenu.classList.toggle('active');
            if (arrowImg) {
                arrowImg.src = isActive ? 'assets/down_arrow_white_icon.png' : 'assets/up_arrow_white_icon.png';
                arrowImg.alt = isActive ? 'Freccia giù' : 'Freccia su';
            }
        }

        e.stopPropagation();
    });
});

// Gestione click sui sottomenu
document.querySelectorAll('.submenu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation(); // Previene la propagazione al menu-item padre
        
        document.querySelectorAll('.menu-item, .submenu-item').forEach(el => {
            el.classList.remove('selected');
        });
        
        item.classList.add('selected');

        const targetId = item.id + '-section';
        showSection(targetId);
    });
});

// Click fuori dal menu chiude i sottomenu
document.addEventListener('click', function (e) {
    const menu = document.querySelector('.menu');
    if (!menu.contains(e.target)) {
        document.querySelectorAll('.submenu').forEach(submenu => {
            submenu.classList.remove('active');
        });

        document.querySelectorAll('.arrow img').forEach(img => {
            img.src = 'assets/down_arrow_white_icon.png';
            img.alt = 'Freccia giù';
        });
    }
});

// All'avvio mostra la home
document.addEventListener('DOMContentLoaded', () => {
    showSection('home-section');
});

// === INIZIO: Script specifico per DashboardReceptionist ===
$(document).ready(function () {
    // Funzione per calcolare la differenza tra una data e oggi
    $.fn.dataTable.ext.type.order['date-distance-pre'] = function (data) {
        const today = new Date();
        const date = new Date(data);
        return Math.abs(date - today);
    };

    // Funzione per generare i pulsanti azione
    function getActionButtons(azienda, motivo, dipendente) {
        return `
            <button class="action-button dettagli-btn" data-azienda="${azienda}" data-motivo="${motivo}" data-dipendente="${dipendente}">Dettagli</button>
        `;
    }
    function getEliminaButton() {
        return '<button class="action-button elimina-btn" style="max-width:70px;height:28px;font-size:12px;background:#c0392b;">Elimina</button>';
    }
    function getModificaButton() {
        return '<button class="action-button" style="max-width:70px;height:28px;font-size:12px;">Modifica</button>';
    }
    function getAssegnaBadgeButton() {
        return '<button class="action-button" style="max-width:110px;height:28px;font-size:12px;background:#27ae60;">Assegna Badge</button>';
    }

    // Fetch visite e popola la tabella
    const accessToken = localStorage.getItem("accessToken");
    fetch('http://localhost:8080/visit', {
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
            // Per ogni visita, aggiungi idPersonaVisitatore = visit.personaVisitatore.idPersona
            data.forEach(visit => {
                visit.idPersonaVisitatore = visit.personaVisitatore?.idPersona || '';
            });
            const tbody = $('#table1-body');
            tbody.empty();
            data.forEach(visit => {
                const row = `
<tr data-id="${visit.id}">
    <td>
        ${visit.personaVisitatore?.nome || ''}
        <input type="hidden" id="hidden-id-persona-visitatore" value="${visit.personaVisitatore?.idPersona || ''}">
        <input type="hidden" id="hidden-id-responsabile" value="${visit.responsabile?.idPersona || ''}">
    </td>
    <td>${visit.personaVisitatore?.cognome || ''}</td>
    <td>${visit.dataInizio || ''}</td>
    <td>${visit.oraInizio || ''}</td>
    <td>${visit.dataFine || ''}</td>
    <td>${visit.oraFine || ''}</td>
    <td>${getActionButtons(visit.personaVisitatore?.azienda || '', visit.motivo || '', visit.responsabile?.nome + ' ' + visit.responsabile?.cognome || '')}</td>
    <td>${getEliminaButton()}</td>
    <td>${getModificaButton()}</td>
    <td>${getAssegnaBadgeButton()}</td>
</tr>
`;
                tbody.append(row);
            });
            // Aggiorna DataTable dopo aver popolato
            if ($.fn.DataTable.isDataTable('#table1')) {
                $('#table1').DataTable().clear().destroy();
            }
            $('#table1').DataTable({
                lengthChange: false,
                pageLength: 8,
                order: [[3, 'asc']],
                columnDefs: [{
                    targets: 3,
                    type: 'date-distance'
                }],
                autoWidth: false,
                responsive: true,
                language: {
                    info: "Elemento _START_ di _TOTAL_",
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
        })
        .catch(err => {
            const tbody = $('#table1-body');
            // Assicura che la riga di errore abbia 10 colonne
            tbody.html('<tr><td colspan="10">Errore nel caricamento delle visite</td></tr>');
            if ($.fn.DataTable.isDataTable('#table1')) {
                $('#table1').DataTable().clear().destroy();
            }
            $('#table1').DataTable({
                lengthChange: false,
                pageLength: 8,
                autoWidth: false,
                responsive: true,
                language: {
                    info: "Elemento _START_ di _TOTAL_",
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
        });

    // Gestione modale dettagli
    $(document).on('click', '.dettagli-btn', function (e) {
        e.preventDefault();
        $('#modal-azienda').text($(this).data('azienda'));
        $('#modal-motivo').text($(this).data('motivo'));
        $('#modal-dipendente').text($(this).data('dipendente'));
        $('#dettagli-modal').css('display', 'flex');
    });
    $(document).on('click', '#close-modal', function () {
        $('#dettagli-modal').hide();
    });
    $(document).on('click', '#dettagli-modal', function (e) {
        if (e.target === this) $(this).hide();
    });

    // Gestione elimina visita
    let visitIdToDelete = null;
    let rowToDelete = null;
    $(document).on('click', '.elimina-btn', function (e) {
        rowToDelete = $(this).closest('tr');
        visitIdToDelete = rowToDelete.data('id');
        if (!visitIdToDelete) return;
        $('#delete-modal').css('display', 'flex');
    });
    $(document).on('click', '#delete-confirm', function () {
        const accessToken = localStorage.getItem("accessToken");
        fetch(`http://localhost:8080/visit/${visitIdToDelete}`, {
            method: 'DELETE',
            headers: {
                'Authorization': accessToken ? `Bearer ${accessToken}` : undefined
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Errore durante l\'eliminazione');
                if ($.fn.DataTable.isDataTable('#table1')) {
                    $('#table1').DataTable().row(rowToDelete).remove().draw();
                } else {
                    rowToDelete.remove();
                }
            })
            .catch(err => {
                // Mostra errore nella modale
                $('#delete-modal-message').text('Errore durante l\'eliminazione della visita');
            })
            .finally(() => {
                $('#delete-modal').hide();
            });
    });
    $(document).on('click', '#delete-cancel', function () {
        $('#delete-modal').hide();
    });
    $(document).on('click', '.action-button:contains("Modifica")', function (e) {
        e.preventDefault();
        const row = $(this).closest('tr');
        const idVisita = row.data('id');
        const idPersonaVisitatore = Number(document.getElementById('hidden-id-persona-visitatore').value);
        const idResponsabile = Number(document.getElementById('hidden-id-responsabile').value);

        $('#modifica-idVisita').val(idVisita);
        $('#modifica-idPersonaVisitatore').val(idPersonaVisitatore);
        $('#modifica-idResponsabile').val(idResponsabile);

        $('#modifica-nome').val(row.find('td').eq(0).contents().filter(function () {
            return this.nodeType === 3;
        }).text().trim());

        $('#modifica-cognome').val(row.find('td').eq(1).text());
        $('#modifica-dataInizio').val(row.find('td').eq(2).text());
        $('#modifica-oraInizio').val(row.find('td').eq(3).text());
        $('#modifica-dataFine').val(row.find('td').eq(4).text());
        $('#modifica-oraFine').val(row.find('td').eq(5).text());

        const dettagliBtn = row.find('.dettagli-btn');
        $('#modifica-azienda').val(dettagliBtn.data('azienda') || '');
        $('#modifica-motivo').val(dettagliBtn.data('motivo') || '');
        $('#modifica-dipendente').val(dettagliBtn.data('dipendente') || '');

        $('#modifica-modal').css('display', 'flex');
    });
    $(document).on('click', '#close-modifica-modal', function () {
        $('#modifica-modal').hide();
    });
    $(document).on('click', '#modifica-modal', function (e) {
        if (e.target === this) $(this).hide();
    });
    $('#modifica-form').on('submit', function (e) {
        e.preventDefault();
        const idVisita = $('#modifica-idVisita').val();
        const idPersonaVisitatore = Number(document.getElementById('modifica-idPersonaVisitatore').value);
        const idResponsabile = Number(document.getElementById('modifica-idResponsabile').value);
        console.log(idPersonaVisitatore);

        const payload = {
            motivo: $('#modifica-motivo').val(),
            dataInizio: $('#modifica-dataInizio').val(),
            oraInizio: $('#modifica-oraInizio').val(),
            dataFine: $('#modifica-dataFine').val(),
            oraFine: $('#modifica-oraFine').val(),
            idPersonaVisitatore: idPersonaVisitatore,
            idResponsabile: idResponsabile
        };

        console.log('Payload:', payload);

        const accessToken = localStorage.getItem("accessToken");

        fetch(`http://localhost:8080/visit/${idVisita}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken ? `Bearer ${accessToken}` : undefined
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error('Errore durante la modifica');
                $('#modifica-modal').hide();
                location.reload();
            })
            .catch(err => {
                alert('Errore durante la modifica della visita');
            });
    });
});
// === FINE: Script specifico per DashboardReceptionist ===
