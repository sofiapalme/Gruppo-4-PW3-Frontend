// === Script specifico per Mobile ===

const accessToken = localStorage.getItem("accessToken");

// Utility functions for date and time formatting
function convertToItalianDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatTime(timeString) {
    if (!timeString) return '';
    // Se è già nel formato HH:MM, restituiscilo così com'è
    if (timeString.match(/^\d{2}:\d{2}$/)) return timeString;
    // Se è nel formato HH:MM:SS, rimuovi i secondi
    if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
        return timeString.substring(0, 5);
    }
    // Se è nel formato HH:MM:SS.sss (con millisecondi), rimuovi secondi e millisecondi
    if (timeString.match(/^\d{2}:\d{2}:\d{2}\.\d+$/)) {
        return timeString.substring(0, 5);
    }
    return timeString;
}

// JWT refresh function (simplified version for mobile functions)
async function refreshJwt() {
    // Simplified version - in a real implementation this would refresh the JWT token
    // For now, we'll just return a resolved promise
    return Promise.resolve();
}

// Funzione per caricare i dati del count e aggiornare la dashboard
function loadCountData() {
    console.log('🔄 Loading count data...');
    console.log('📋 Access token:', accessToken ? 'Present' : 'Missing');
    
    const headers = {
        'Content-Type': 'application/json'
    };
    
    // Aggiungi l'header Authorization solo se il token esiste
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    console.log('📤 Sending request to: http://localhost:8080/list/count');
    console.log('📤 Headers:', headers);
    
    fetch('http://localhost:8080/list/count', {
        method: 'GET',
        headers: headers
    })    .then(response => {
        console.log('📥 Response status:', response.status);
        console.log('📥 Response ok:', response.ok);
        if (!response.ok) {
            console.error('❌ Response not ok. Status:', response.status, 'StatusText:', response.statusText);
            throw new Error(`Errore nel recupero dei dati count: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Count data received:', data);
        
        // Calcola il totale dei presenti (dipendenti + visitatori)
        const totalPresenti = (data.Employees || 0) + (data.Visitors || 0);
        
        // Aggiorna i valori nella dashboard desktop
        const totalDesktopElement = document.getElementById('total-presenti-desktop');
        const employeesDesktopElement = document.getElementById('dipendenti-count-desktop');
        const visitorsDesktopElement = document.getElementById('visitatori-count-desktop');
        
        if (totalDesktopElement) totalDesktopElement.textContent = totalPresenti;
        if (employeesDesktopElement) employeesDesktopElement.textContent = data.Employees || 0;
        if (visitorsDesktopElement) visitorsDesktopElement.textContent = data.Visitors || 0;
        
        // Aggiorna i valori nella dashboard mobile
        const totalMobileElement = document.getElementById('total-presenti-mobile');
        const employeesMobileElement = document.getElementById('dipendenti-count-mobile');
        const visitorsMobileElement = document.getElementById('visitatori-count-mobile');
        
        if (totalMobileElement) totalMobileElement.textContent = totalPresenti;
        if (employeesMobileElement) employeesMobileElement.textContent = data.Employees || 0;
        if (visitorsMobileElement) visitorsMobileElement.textContent = data.Visitors || 0;
    })    .catch(err => {
        console.error('❌ Errore nel caricamento dei dati count:', err);
        console.error('❌ Stack trace:', err.stack);
        // In caso di errore, mantieni i valori di default o mostra 0
        const elements = [
            'total-presenti-desktop', 'dipendenti-count-desktop', 'visitatori-count-desktop',
            'total-presenti-mobile', 'dipendenti-count-mobile', 'visitatori-count-mobile'
        ];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = '0';
        });
    });
}

const visitHeaders = {};
if (accessToken) {
    visitHeaders['Authorization'] = `Bearer ${accessToken}`;
}

fetch('http://localhost:8080/visit', {
    method: 'GET',
    headers: visitHeaders
})
.then(response => {
    if (!response.ok) throw new Error('Errore nel recupero delle visite');
    return response.json();
})
.then(data => {
    console.log('📊 Visit data received:', data);
    
    const today = new Date().toISOString().split('T')[0];
    
    // Filtra visite odierne e future
    const todayVisits = data.filter(visit => visit.dataInizio === today);
    const futureVisits = data.filter(visit => visit.dataInizio > today);
      console.log('📅 Today visits:', todayVisits.length);
    console.log('🔮 Future visits:', futureVisits.length);
      // Funzione per formattare le ore
    function formatTime(timeString) {
        if (!timeString) return '';
        // Se è già nel formato HH:MM, restituiscilo così com'è
        if (timeString.match(/^\d{2}:\d{2}$/)) return timeString;
        // Se è nel formato HH:MM:SS, rimuovi i secondi
        if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
            return timeString.substring(0, 5);
        }
        // Se è nel formato HH:MM:SS.sss (con millisecondi), rimuovi secondi e millisecondi
        if (timeString.match(/^\d{2}:\d{2}:\d{2}\.\d+$/)) {
            return timeString.substring(0, 5);
        }
        return timeString;
    }
    
    // Funzione per creare una riga della tabella desktop (con motivo e responsabile)
    function createDesktopVisitRow(visit) {
        return `
<tr>
    <td>${visit.personaVisitatore?.nome || ''}</td>
    <td>${visit.personaVisitatore?.cognome || ''}</td>
    <td>${visit.dataInizio || ''}</td>
    <td>${formatTime(visit.oraInizio)}</td>
    <td>${visit.motivo || ''}</td>
    <td>${visit.responsabile?.nome || ''} ${visit.responsabile?.cognome || ''}</td>
</tr>`;
    }
    
    // Funzione per creare una riga della tabella mobile (con data/ora fine)
    function createMobileVisitRow(visit) {
        return `
<tr>
    <td>${visit.personaVisitatore?.nome || ''}</td>
    <td>${visit.personaVisitatore?.cognome || ''}</td>
    <td>${visit.dataInizio || ''}</td>
    <td>${formatTime(visit.oraInizio)}</td>
    <td>${visit.dataFine || ''}</td>
    <td>${formatTime(visit.oraFine)}</td>
</tr>`;
    }
      // Popola tabelle DESKTOP
    const desktopTbody1 = $('#home-table1-body');
    const desktopTbody2 = $('#home-table2-body');
    
    if (desktopTbody1.length) {
        desktopTbody1.empty();
        todayVisits.slice(0, 6).forEach(visit => {
            desktopTbody1.append(createDesktopVisitRow(visit));
        });
    }
    
    if (desktopTbody2.length) {
        desktopTbody2.empty();
        futureVisits.slice(0, 6).forEach(visit => {
            desktopTbody2.append(createDesktopVisitRow(visit));
        });
    }
      // Popola tabelle MOBILE
    const mobileTbody1 = $('#home-table1-body-mobile');
    const mobileTbody2 = $('#home-table2-body-mobile');
    
    if (mobileTbody1.length) {
        mobileTbody1.empty();
        todayVisits.slice(0, 2).forEach(visit => {
            mobileTbody1.append(createMobileVisitRow(visit));
        });
    }
    
    if (mobileTbody2.length) {
        mobileTbody2.empty();
        futureVisits.slice(0, 2).forEach(visit => {
            mobileTbody2.append(createMobileVisitRow(visit));
        });
    }
    
    // Inizializza DataTables per le tabelle desktop
    if ($('#home-table1').length && !$.fn.DataTable.isDataTable('#home-table1')) {
        $('#home-table1').DataTable({
            searching: false,
            paging: false,
            info: false,
            lengthChange: false,
            ordering: false,
            language: {
                emptyTable: "Nessuna visita odierna"
            }
        });
    }
    
    if ($('#home-table2').length && !$.fn.DataTable.isDataTable('#home-table2')) {
        $('#home-table2').DataTable({
            searching: false,
            paging: false,
            info: false,
            lengthChange: false,
            ordering: false,
            language: {
                emptyTable: "Nessuna visita futura"
            }
        });
    }
    
    // Inizializza DataTables per le tabelle mobile
    if ($('#home-table1-mobile').length && !$.fn.DataTable.isDataTable('#home-table1-mobile')) {
        $('#home-table1-mobile').DataTable({
            searching: false,
            paging: false,
            info: false,
            lengthChange: false,
            ordering: false,
            language: {
                emptyTable: "Nessuna visita odierna"
            }
        });
    }
    
    if ($('#home-table2-mobile').length && !$.fn.DataTable.isDataTable('#home-table2-mobile')) {
        $('#home-table2-mobile').DataTable({
            searching: false,
            paging: false,
            info: false,
            lengthChange: false,
            ordering: false,
            language: {
                emptyTable: "Nessuna visita futura"
            }
        });
    }
})
.catch(err => {
    console.error('❌ Error loading visits:', err);
    const errorMessage = '<tr><td colspan="6">Errore nel caricamento dei visitatori</td></tr>';
    
    // Gestione errori per tabelle desktop
    $('#home-table1-body').html(errorMessage);
    $('#home-table2-body').html(errorMessage);
    
    // Gestione errori per tabelle mobile
    $('#home-table1-body-mobile').html(errorMessage);
    $('#home-table2-body-mobile').html(errorMessage);
});


// Mappatura tra sezioni mobile e desktop
const sectionMapping = {
  // Mobile => Desktop
  'home-mobile-section': 'home-section',
  'visualizza-opzione1-mobile-section': 'visualizza-opzione1-section',  'visualizza-visite-mobile-section': 'visualizza-visite-section',
  'visitatori-elenco-presenti-mobile-section': 'visitatori-elenco-presenti-section',
  'visualizza-elenco-visitatori-futuri-mobile-section': 'visualizza-elenco-visite-future-section',
  'visualizza-elenco-visitatori-oggi-mobile-section': 'visualizza-elenco-visite-odierne-section',
  'visualizza-visite-suo-carico-mobile-section': 'visualizza-visite-suo-carico-section',
  'visualizza-presenti-suo-carico-mobile-section': 'visualizza-presenti-suo-carico-section',
  'visualizza-futuri-suo-carico-mobile-section': 'visualizza-futuri-suo-carico-section',
  'visualizza-elenco-tel-sm-mobile-section': 'visualizza-elenco-tel-sm-section',
  'storico-timbrature-visitatori-mobile-section': 'storico-timbrature-visitatori-section',
  'storico-timbrature-dipendenti-mobile-section': 'storico-timbrature-dipendenti-section',
  'storico-timbrature-mensa-mobile-section': 'storico-timbrature-mensa-section',
  'visitatori-opzione1-mobile-section': 'visitatori-crea-visite-section',
  'visitatori-opzione2-mobile-section': 'visitatori-crea-persone-section'
};

// Mappatura inversa Desktop => Mobile
const desktopToMobileMapping = {};
Object.keys(sectionMapping).forEach(mobile => {
  const desktop = sectionMapping[mobile];
  desktopToMobileMapping[desktop] = mobile;
});

// Variabile per tenere traccia della sezione attiva corrente
let currentActiveSection = null;

document.addEventListener('DOMContentLoaded', () => {
  // Carica i dati del count quando la pagina si carica
  loadCountData();
  
  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const overlay = document.getElementById('overlay');
  const submenu = document.getElementById('submenu-container');  const submenuData = {
    'visualizza-mobile-section': [
      { label: 'Elenco odierne', target: 'visualizza-elenco-visitatori-oggi-mobile-section' },
      { label: 'Elenco future', target: 'visualizza-elenco-visitatori-futuri-mobile-section' }
    ],
    'storico-mobile-section': [
      { label: 'Storico visite', target: 'visualizza-visite-mobile-section' },
      { label: 'Storico timbrature visitatori', target: 'storico-timbrature-visitatori-mobile-section' },
      { label: 'Storico timbrature dipendenti', target: 'storico-timbrature-dipendenti-mobile-section' },
      { label: 'Storico timbrature mensa', target: 'storico-timbrature-mensa-mobile-section' }
    ],    'visitatori-mobile-section': [
      { label: 'Crea visite', target: 'visitatori-nuova-visita-mobile-section' },
      { label: 'Crea persone', target: 'visitatori-crea-utente-mobile-section' },
      { label: 'Elenco presenti', target: 'visitatori-elenco-presenti-mobile-section' },
      { label: 'Elenco persone', target: 'visualizza-elenco-persone-mobile-section' },
      { label: 'Elenco telefonico dipendenti', target: 'visualizza-elenco-tel-sm-mobile-section' }
    ]
  };

  function closeAllMobile() {
    submenu.classList.remove('active');
    overlay.classList.remove('active');
  }  // Rende showMobileSection accessibile globalmente
  window.showMobileSection = function(id) {
    console.log('📱 showMobileSection called with:', id);
    
    // First remove active class from all sections
    const currentActive = document.querySelector('.mobile-section.active');
    const target = document.getElementById(id);

    if (!target) {
      console.warn(`Section ${id} not found, returning to home`);
      // If target doesn't exist, show home
      const homeSection = document.getElementById('home-mobile-section');
      if (homeSection && homeSection !== currentActive) {
        handleSectionTransition(currentActive, homeSection);
        currentActiveSection = 'home-mobile-section'; // Aggiorna la sezione corrente
        console.log('📱 Updated currentActiveSection to:', currentActiveSection);
      }
      return;
    }

    if (target === currentActive) return;

    handleSectionTransition(currentActive, target);
    currentActiveSection = id; // Aggiorna la sezione corrente
    console.log('📱 Updated currentActiveSection to:', currentActiveSection);
      // Call appropriate populate function for storico sections when directly navigating
    if (id === 'storico-timbrature-visitatori-mobile-section') {
      console.log('Loading storico timbrature visitatori mobile data...');
      if (window.populateStoricoTimbratureVisitatoriMobile) {
        window.populateStoricoTimbratureVisitatoriMobile();
      }
    } else if (id === 'storico-timbrature-dipendenti-mobile-section') {
      console.log('Loading storico timbrature dipendenti mobile data...');
      if (window.populateStoricoTimbratureDipendentiMobile) {
        window.populateStoricoTimbratureDipendentiMobile();
      }
    } else if (id === 'storico-timbrature-mensa-mobile-section') {
      console.log('Loading storico timbrature mensa mobile data...');
      if (window.populateStoricoTimbratureMensaMobile) {
        window.populateStoricoTimbratureMensaMobile();
      }
    } else if (id === 'visualizza-elenco-visitatori-futuri-mobile-section') {
      console.log('Loading visite future mobile data...');
      if (window.createVisiteFutureMobileDataTable) {
        window.createVisiteFutureMobileDataTable();
      }
    } else if (id === 'visualizza-elenco-visitatori-oggi-mobile-section') {
      console.log('Loading visite odierne mobile data...');
      if (window.createVisiteOdierneMobileDataTable) {
        window.createVisiteOdierneMobileDataTable();
      }
    }
  };  window.handleSectionTransition = function(currentSection, newSection) {
    if (currentSection) {
      currentSection.classList.remove('active');
    }
    window.scrollTo(0, 0);
    newSection.classList.add('active');
  };
  function generateMobileSubmenu(items) {
    submenu.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'submenu-item-mobile';
      div.textContent = item.label;
      div.addEventListener('click', (e) => {
        e.stopPropagation();        closeAllMobile();
        window.showMobileSection(item.target);
          // Call appropriate populate function for storico sections
        if (item.target === 'storico-timbrature-visitatori-mobile-section') {
          console.log('Calling populateStoricoTimbratureVisitatoriMobile from submenu...');
          if (window.populateStoricoTimbratureVisitatoriMobile) {
            window.populateStoricoTimbratureVisitatoriMobile();
          }
        } else if (item.target === 'storico-timbrature-dipendenti-mobile-section') {
          console.log('Calling populateStoricoTimbratureDipendentiMobile from submenu...');
          if (window.populateStoricoTimbratureDipendentiMobile) {
            window.populateStoricoTimbratureDipendentiMobile();
          }
        } else if (item.target === 'storico-timbrature-mensa-mobile-section') {
          console.log('Calling populateStoricoTimbratureMensaMobile from submenu...');
          if (window.populateStoricoTimbratureMensaMobile) {
            window.populateStoricoTimbratureMensaMobile();
          }
        }
      });
      submenu.appendChild(div);
    });
  }
  function setupMobileListeners() {
    if (!mobileQuery.matches) return;

    document.querySelectorAll('.menu-item-mobile').forEach(item => {
      item.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const targetId = item.getAttribute('data-target');
        const isSubmenuItem = submenuData[targetId];

        // Handle submenu toggle
        if (isSubmenuItem) {
          const wasActive = submenu.classList.contains('active');
          const currentSubmenuTarget = submenu.getAttribute('data-current-target');
          
          // Only close if clicking the same menu item that opened the submenu
          if (wasActive && currentSubmenuTarget === targetId) {
            closeAllMobile();
          } else {
            // Generate new submenu
            generateMobileSubmenu(submenuData[targetId]);
            submenu.setAttribute('data-current-target', targetId);
            submenu.classList.add('active');
            overlay.classList.add('active');
          }
        } else {          // For non-submenu items (like Home), just show the section
          closeAllMobile();
          window.showMobileSection(targetId);
        }
      };
    });

    overlay.onclick = () => {
      closeAllMobile();
    };
  }  // Funzione per sincronizzare le sezioni tra mobile e desktop
  function syncSections() {
    console.log('🔄 syncSections called - currentActiveSection:', currentActiveSection);
    console.log('📱 mobileQuery.matches:', mobileQuery.matches);
    
    if (!currentActiveSection) {
      console.log('⚠️ No active section to sync');
      return;
    }
    
    if (mobileQuery.matches) {
      // Cambio da desktop a mobile
      console.log('📱 Switching from desktop to mobile');
      const mobileSection = desktopToMobileMapping[currentActiveSection];
      console.log('🔍 Looking for mobile section:', mobileSection);      if (mobileSection) {
        console.log('✅ Found mobile section, switching to:', mobileSection);
        window.showMobileSection(mobileSection);
      } else {
        console.log('❌ No mobile mapping found, going to home');
        window.showMobileSection('home-mobile-section');
      }
    } else {
      // Cambio da mobile a desktop
      console.log('🖥️ Switching from mobile to desktop');
      const desktopSection = sectionMapping[currentActiveSection];
      console.log('🔍 Looking for desktop section:', desktopSection);
      if (desktopSection) {
        console.log('✅ Found desktop section, switching to:', desktopSection);
        showSection(desktopSection);
      } else {
        console.log('❌ No desktop mapping found, going to home');
        showSection('home-section');
      }
    }
  }

  window.showMobileSection('home-mobile-section');
  setupMobileListeners();
  mobileQuery.addEventListener('change', () => {
    setupMobileListeners();
    syncSections(); // Sincronizza le sezioni quando cambia la viewport
  });
});



// === Script specifico per Desktop ===
function showSection(id) {
    console.log('🖥️ showSection called with:', id);
    
    // Nascondi tutte le sezioni
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    // Mostra solo la sezione richiesta
    const sectionToShow = document.getElementById(id);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
        currentActiveSection = id; // Aggiorna la sezione corrente
        console.log('🖥️ Updated currentActiveSection to:', currentActiveSection);
        
        // Trigger data loading for specific sections
        triggerSectionDataLoading(id);
    } else {
        console.warn('🖥️ Section not found:', id);
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
        case 'visualizza-elenco-persone-section':
            if (window.createPersonDataTable) {
                console.log('📊 Loading people data...');
                window.createPersonDataTable();
            }
            break;
        case 'visualizza-elenco-tel-sm-section':
            if (window.createContactListDataTable) {
                console.log('📊 Loading contact list data...');
                window.createContactListDataTable();
            }
            break;
        case 'storico-timbrature-visitatori-section':
            if (window.createStrocioTimbratureVisitatoriDataTable) {
                console.log('📊 Loading visitor timestamps data...');
                window.createStrocioTimbratureVisitatoriDataTable();
            }
            break;
        case 'storico-timbrature-dipendenti-section':
            if (window.createStrocioTimbratureDipendentiDataTable) {
                console.log('📊 Loading employee timestamps data...');
                window.createStrocioTimbratureDipendentiDataTable();
            }
            break;        case 'storico-timbrature-mensa-section':
            if (window.createStoricoTimbratureMensaDataTable) {
                console.log('📊 Loading cafeteria timestamps data...');
                window.createStoricoTimbratureMensaDataTable();
            }
            break;
        case 'visitatori-elenco-presenti-section':
        case 'visitatori-elenco-presenti-mobile-section':
            if (window.createElencoPresentiDataTable) {
                console.log('📊 Loading present people data...');
                window.createElencoPresentiDataTable();
            }
            // AGGIUNTA: aggiorna i counter anche quando si entra nella sezione Presenti
            loadCountData();
            break;
        default:
            console.log('ℹ️ No data loading needed for section:', sectionId);
            break;
    }
}

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function (e) {
        const submenu = this.querySelector('.submenu');
        const arrowImg = this.querySelector('.arrow img');

        // Prevent default behavior
        e.preventDefault();
        e.stopPropagation();

        // Only remove 'selected' class from siblings
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(mi => {
            if (mi !== this) {
                mi.classList.remove('selected');
                const subItems = mi.querySelectorAll('.submenu-item');
                subItems.forEach(si => si.classList.remove('selected'));
            }
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
                img.src = '/assets/down_arrow_white_icon.png';
                img.alt = 'Freccia giù';
            }
        });

        if (submenu) {
            const isActive = submenu.classList.contains('active');
            submenu.classList.toggle('active');
            if (arrowImg) {
                arrowImg.src = isActive ? '/assets/down_arrow_white_icon.png' : '/assets/up_arrow_white_icon.png';
                arrowImg.alt = isActive ? 'Freccia giù' : 'Freccia su';
            }
        }

        e.stopPropagation();
    });
});

// Gestione click sui sottomenu
document.querySelectorAll('.submenu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Previene la propagazione al menu-item padre

        // Remove selected only from sibling submenu items
        const parentSubmenu = item.closest('.submenu');
        if (parentSubmenu) {
            parentSubmenu.querySelectorAll('.submenu-item').forEach(si => {
                if (si !== item) si.classList.remove('selected');
            });
        }

        item.classList.add('selected');
        const parentMenuItem = item.closest('.menu-item');
        if (parentMenuItem) {
            parentMenuItem.classList.add('selected');
        }

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
            img.src = '/assets/down_arrow_white_icon.png';
            img.alt = 'Freccia giù';
        });
    }
});

// All'avvio mostra la home per tutte le dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dashboard initializing...');
    
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    console.log('📱 Is mobile viewport:', mobileQuery.matches);
    
    if (mobileQuery.matches) {
        // Inizializzazione mobile
        console.log('📱 Initializing mobile dashboard');
        document.querySelectorAll('.mobile-section').forEach(section => {
            section.classList.remove('active');
        });

        // Cerca la sezione home mobile appropriata
        const adminHomeMobile = document.getElementById('admin-home-mobile-section');
        const requesterHomeMobile = document.getElementById('requester-home-mobile-section');
        const receptionHomeMobile = document.getElementById('home-mobile-section');

        if (adminHomeMobile) {
            adminHomeMobile.classList.add('active');
            currentActiveSection = 'admin-home-mobile-section';
            console.log('📱 Set initial mobile section:', currentActiveSection);
        } else if (requesterHomeMobile) {
            requesterHomeMobile.classList.add('active');
            currentActiveSection = 'requester-home-mobile-section';
            console.log('📱 Set initial mobile section:', currentActiveSection);
        } else if (receptionHomeMobile) {
            receptionHomeMobile.classList.add('active');
            currentActiveSection = 'home-mobile-section';
            console.log('📱 Set initial mobile section:', currentActiveSection);
        }
    } else {
        // Inizializzazione desktop
        console.log('🖥️ Initializing desktop dashboard');
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });

        // Mostra la home in base alla dashboard
        const adminHome = document.getElementById('admin-home-section');
        const requesterHome = document.getElementById('requester-home-section');
        const receptionHome = document.getElementById('home-section');

        if (adminHome) {
            adminHome.style.display = 'block';
            currentActiveSection = 'admin-home-section';
            console.log('🖥️ Set initial desktop section:', currentActiveSection);
        } else if (requesterHome) {
            requesterHome.style.display = 'block';
            currentActiveSection = 'requester-home-section';
            console.log('🖥️ Set initial desktop section:', currentActiveSection);
        } else if (receptionHome) {
            receptionHome.style.display = 'block';
            currentActiveSection = 'home-section';
            console.log('🖥️ Set initial desktop section:', currentActiveSection);
        }
    }

    // Carica i dati del count all'avvio
    loadCountData();
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

    // Fetch visite e popola la tabella principale e le tabelle della home
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
            // Popola la tabella principale
            const tbody = $('#table1-body');
            tbody.empty();
            data.forEach(visit => {
                const row = `
<tr data-id="${visit.id}">
    <td>
        ${visit.personaVisitatore?.nome || ''}
        <input type="hidden" id="hidden-id-persona-visitatore" value="${visit.personaVisitatore?.idPersona || ''}">
        <input type="hidden" id="hidden-id-responsabile" value="${visit.responsabile?.idPersona || ''}">
    </td>    <td>${visit.personaVisitatore?.cognome || ''}</td>
    <td>${visit.dataInizio || ''}</td>
    <td>${formatTime(visit.oraInizio || '')}</td>
    <td>${visit.dataFine || ''}</td>
    <td>${formatTime(visit.oraFine || '')}</td>
    <td>${getActionButtons(visit.personaVisitatore?.azienda || '', visit.motivo || '', visit.responsabile?.nome + ' ' + visit.responsabile?.cognome || '')}</td>
    <td>${getEliminaButton()}</td>
    <td>${getModificaButton()}</td>
    <td>${getAssegnaBadgeButton()}</td>
</tr>
`;
                tbody.append(row);            });
            
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
        })
        .catch(err => {
            const tbody = $('#table1-body');
            tbody.html('<tr><td>Errore nel caricamento delle visite</td></tr>');
            if ($.fn.DataTable.isDataTable('#table1')) {
                $('#table1').DataTable().clear().destroy();
            }
            $('#table1').DataTable({
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
    });    // Gestione elimina visita (tabella table1 - retrocompatibilità)
    $(document).on('click', '.elimina-btn', function (e) {
        const row = $(this).closest('tr');
        const visitId = row.data('id');
        if (!visitId) return;
        
        // Usa le variabili globali per coerenza con dataTables.js
        window.visitIdToDelete = visitId;
        window.rowToDelete = row;
        window.tableToUpdate = '#table1';
        document.getElementById('delete-modal-message').textContent = 'Sei sicuro di voler eliminare questa visita?';
        $('#delete-modal').css('display', 'flex');
    });$(document).on('click', '#delete-confirm', function () {
        // Usa le variabili globali impostate in dataTables.js
        const visitId = window.visitIdToDelete;
        const rowElement = window.rowToDelete;
        const tableSelector = window.tableToUpdate;
        
        if (!visitId) {
            $('#delete-modal-message').text('Errore: ID visita non trovato');
            return;
        }
        
        const accessToken = localStorage.getItem("accessToken");
        fetch(`http://localhost:8080/visit/${visitId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': accessToken ? `Bearer ${accessToken}` : undefined
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Errore durante l\'eliminazione');
                
                // Gestione rimozione riga per le diverse tabelle
                if (tableSelector && $.fn.DataTable.isDataTable(tableSelector)) {
                    // Per le tabelle DataTable (visite odierne e future)
                    $(tableSelector).DataTable().row(rowElement).remove().draw();
                } else if ($.fn.DataTable.isDataTable('#table1')) {
                    // Per la vecchia tabella table1 (retrocompatibilità)
                    $('#table1').DataTable().row(rowToDelete).remove().draw();
                } else if (rowElement) {
                    // Fallback: rimozione diretta dell'elemento DOM
                    $(rowElement).remove();
                }
                
                // Reset delle variabili globali
                window.visitIdToDelete = null;
                window.rowToDelete = null;
                window.tableToUpdate = null;
            })
            .catch(err => {
                // Mostra errore nella modale
                $('#delete-modal-message').text('Errore durante l\'eliminazione della visita');
            })
            .finally(() => {
                $('#delete-modal').hide();
            });
    });    $(document).on('click', '#delete-cancel', function () {
        // Reset delle variabili globali
        window.visitIdToDelete = null;
        window.rowToDelete = null;
        window.tableToUpdate = null;
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

    // === INIZIO: Script per DataTables minimal su home-table1 e home-table2 ===
    // Inizializza DataTable senza barra di ricerca, paginazione, info, lengthChange
    $('#home-table1, #home-table2').DataTable({
        searching: false,
        paging: false,
        info: false,
        lengthChange: false,
        ordering: false,
        language: {
            emptyTable: "Nessun dato presente nella tabella"
        }
    });
});
// === FINE: Script specifico per DashboardReceptionist ===

// === Funzioni di popolamento storico mobile ===
window.populateStoricoTimbratureVisitatoriMobile = async function() {
    const accessToken = localStorage.getItem("accessToken");
    const url = "http://localhost:8080/badge-record-history/visitors";
    const tableId = '#tabella-timbrature-visitatori-mobile';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken ? `Bearer ${accessToken}` : undefined
            }
        });
        if (!response.ok) throw new Error('Errore nel recupero dei dati');
        const data = await response.json();
        // Destroy previous DataTable if exists
        if ($.fn.DataTable.isDataTable(tableId)) {
            $(tableId).DataTable().clear().destroy();
        }        // Prepare data for DataTable (Nome, Cognome, Dettagli)
        const tableData = data.map(row => ({
            nome: row.nome || '',
            cognome: row.cognome || '',
            dettagli: row // pass full row for button
        }));
        $(tableId).DataTable({
            data: tableData,
            destroy: true,
            columns: [
                { data: 'nome' },
                { data: 'cognome' },
                {
                    data: 'dettagli',
                    orderable: false,
                    render: function(data, type, row) {
                        return `<button class='action-button-mobile dettagli-timbrature-visitatori-btn-mobile' data-row='${JSON.stringify(data).replace(/'/g, "&apos;")}' style='font-size:12px;'>Dettagli</button>`;
                    }
                }
            ],
            lengthChange: false,
            pageLength: 4,
            autoWidth: false,
            responsive: true,
            searching: true, // Abilita la barra di ricerca
            info: true,      // Mostra info paginazione
            language: {
                paginate: { next: '>', previous: '<' },
                emptyTable: 'Nessun dato presente nella tabella',
                zeroRecords: 'Nessun risultato trovato',
                info: 'Pagina _PAGE_ di _PAGES_',
                infoEmpty: 'Nessun elemento disponibile',
                search: 'Cerca:',
            }
        });
    } catch (err) {
        const tbody = document.querySelector(tableId + ' tbody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="3">Errore nel caricamento</td></tr>';
    }
};

window.populateStoricoTimbratureDipendentiMobile = async function() {
    const accessToken = localStorage.getItem("accessToken");
    const url = "http://localhost:8080/badge-record-history/secondo-mona";
    const tableId = '#tabella-timbrature-dipendenti-mobile';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken ? `Bearer ${accessToken}` : undefined
            }
        });
        if (!response.ok) throw new Error('Errore nel recupero dei dati');
        const data = await response.json();
        if ($.fn.DataTable.isDataTable(tableId)) {
            $(tableId).DataTable().clear().destroy();
        }
        const tableData = data.map(row => ({
            nome: row.nome || '',
            cognome: row.cognome || '',
            dettagli: row
        }));
        $(tableId).DataTable({
            data: tableData,
            destroy: true,
            columns: [
                { data: 'nome' },
                { data: 'cognome' },
                {
                    data: 'dettagli',
                    orderable: false,
                    render: function(data, type, row) {
                        return `<button class='action-button-mobile dettagli-timbrature-dipendenti-btn-mobile' data-row='${JSON.stringify(data).replace(/'/g, "&apos;")}' style='font-size:12px;'>Dettagli</button>`;
                    }
                }
            ],
            lengthChange: false,
            pageLength: 4,
            autoWidth: false,
            responsive: true,
            searching: true, // Abilita la barra di ricerca
            info: true,      // Mostra info paginazione
            language: {
                paginate: { next: '>', previous: '<' },
                emptyTable: 'Nessun dato presente nella tabella',
                zeroRecords: 'Nessun risultato trovato',
                info: 'Pagina _PAGE_ di _PAGES_',
                infoEmpty: 'Nessun elemento disponibile',
                search: 'Cerca:',
            }
        });
    } catch (err) {
        const tbody = document.querySelector(tableId + ' tbody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="3">Errore nel caricamento</td></tr>';
    }
};

window.populateStoricoTimbratureMensaMobile = async function() {
    const accessToken = localStorage.getItem("accessToken");
    const url = "http://localhost:8080/badge-record-history/lunch-area";
    const tableId = '#tabella-timbrature-mensa-mobile';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken ? `Bearer ${accessToken}` : undefined
            }
        });
        if (!response.ok) throw new Error('Errore nel recupero dei dati');
        const data = await response.json();
        if ($.fn.DataTable.isDataTable(tableId)) {
            $(tableId).DataTable().clear().destroy();
        }
        const tableData = data.map(row => ({
            nome: row.nome || '',
            cognome: row.cognome || '',
            dettagli: row
        }));
        $(tableId).DataTable({
            data: tableData,
            destroy: true,
            columns: [
                { data: 'nome' },
                { data: 'cognome' },
                {
                    data: 'dettagli',
                    orderable: false,
                    render: function(data, type, row) {
                        return `<button class='action-button-mobile dettagli-timbrature-mensa-btn-mobile' data-row='${JSON.stringify(data).replace(/'/g, "&apos;")}' style='font-size:12px;'>Dettagli</button>`;
                    }
                }
            ],
            lengthChange: false,
            pageLength: 4,
            autoWidth: false,
            responsive: true,
            searching: true, // Abilita la barra di ricerca
            info: true,      // Mostra info paginazione
            language: {
                paginate: { next: '>', previous: '<' },
                emptyTable: 'Nessun dato presente nella tabella',
                zeroRecords: 'Nessun risultato trovato',
                info: 'Pagina _PAGE_ di _PAGES_',
                infoEmpty: 'Nessun elemento disponibile',
                search: 'Cerca:',
            }
        });
    } catch (err) {
        const tbody = document.querySelector(tableId + ' tbody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="3">Errore nel caricamento</td></tr>';
    }
};

// Gestione apertura modale dettagli mobile
$(document).on('click', '.dettagli-btn-mobile', function (e) {
    e.preventDefault();
    const rowData = $(this).data('row');
    let dati = rowData;
    if (typeof rowData === 'string') {
        try { dati = JSON.parse(rowData.replace(/&apos;/g, "'")); } catch { dati = {}; }
    }
    // Solo i campi richiesti, con label chiari e ordine corretto
    const campi = [
        { key: 'azienda', label: 'Azienda' },
        { key: 'codiceBadge', label: 'Codice Badge' },
        { key: 'dataTimbratura', label: 'Data Timbratura' },
        { key: 'oraTimbratura', label: 'Ora Timbratura', alt: 'oraTimbrature' },
        { key: 'descrizione', label: 'Descrizione', alt: 'descrizioneTimbratrice' }
    ];
    let html = '<div style="padding:1em">';
    campi.forEach(campo => {
        let value = dati[campo.key];
        if ((!value || value === undefined) && campo.alt) value = dati[campo.alt];
        html += `<div style='margin-bottom:10px'><b>${campo.label}:</b> ${value ? value : '-'}</div>`;
    });
    html += '</div>';
    // Usa una modale generica già presente o creane una se serve
    let modal = document.getElementById('dettagli-modal-mobile');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dettagli-modal-mobile';
        modal.className = 'modal';
        modal.style = 'display:flex;position:fixed;z-index:9999;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);align-items:center;justify-content:center;';
        modal.innerHTML = `<div class='modal-content' style='background:#fff;padding:30px 40px;border-radius:18px;min-width:300px;max-width:90vw;max-height:90vh;box-shadow:0 2px 16px #0002;position:relative;'><span id='close-modal-mobile' style='position:absolute;top:10px;right:18px;font-size:28px;cursor:pointer;'>&times;</span><h3>Dettagli</h3><div id='dettagli-modal-mobile-content'></div></div>`;
        document.body.appendChild(modal);
    }
    document.getElementById('dettagli-modal-mobile-content').innerHTML = html;
    modal.style.display = 'flex';
});
$(document).on('click', '#close-modal-mobile', function () {
    $('#dettagli-modal-mobile').hide();
});
$(document).on('click', '#dettagli-modal-mobile', function (e) {
    if (e.target === this) $(this).hide();
});

// Modal close handlers for mobile storico modals
$(document).on('click', '#close-dettagli-timbrature-visitatori-modal-mobile', function() {
    $('#dettagli-timbrature-visitatori-modal-mobile').hide();
});

$(document).on('click', '#close-dettagli-timbrature-dipendenti-modal-mobile', function() {
    $('#dettagli-timbrature-dipendenti-modal-mobile').hide();
});

$(document).on('click', '#close-dettagli-timbrature-mensa-modal-mobile', function() {
    $('#dettagli-timbrature-mensa-modal-mobile').hide();
});

// Click outside modal to close for storico modals
$(document).on('click', '#dettagli-timbrature-visitatori-modal-mobile', function(e) {
    if (e.target === this) $(this).hide();
});

$(document).on('click', '#dettagli-timbrature-dipendenti-modal-mobile', function(e) {
    if (e.target === this) $(this).hide();
});

$(document).on('click', '#dettagli-timbrature-mensa-modal-mobile', function(e) {
    if (e.target === this) $(this).hide();
});

// Specific handlers for mobile storico detail buttons
$(document).on('click', '.dettagli-timbrature-visitatori-btn-mobile', function() {
    const rowData = $(this).data('row');
    let dati = rowData;
    if (typeof rowData === 'string') {
        try { dati = JSON.parse(rowData.replace(/&apos;/g, "'")); } catch { dati = {}; }
    }
    
    // Populate visitatori modal
    $('#modal-visitatori-nome-mobile').text(dati.nome || '-');
    $('#modal-visitatori-cognome-mobile').text(dati.cognome || '-');
    $('#modal-visitatori-azienda-mobile').text(dati.azienda || '-');
    $('#modal-visitatori-badge-mobile').text(dati.codiceBadge || '-');
    $('#modal-visitatori-data-mobile').text(dati.dataTimbratura || '-');
    $('#modal-visitatori-ora-mobile').text(dati.oraTimbrature || dati.oraTimbratura || '-');
    $('#modal-visitatori-descrizione-mobile').text(dati.descrizioneTimbratrice || dati.descrizione || '-');
    
    $('#dettagli-timbrature-visitatori-modal-mobile').show();
});

$(document).on('click', '.dettagli-timbrature-dipendenti-btn-mobile', function() {
    const rowData = $(this).data('row');
    let dati = rowData;
    if (typeof rowData === 'string') {
        try { dati = JSON.parse(rowData.replace(/&apos;/g, "'")); } catch { dati = {}; }
    }
    
    // Populate dipendenti modal
    $('#modal-dipendenti-nome-mobile').text(dati.nome || '-');
    $('#modal-dipendenti-cognome-mobile').text(dati.cognome || '-');
    $('#modal-dipendenti-matricola-mobile').text(dati.matricola || '-');
    $('#modal-dipendenti-badge-mobile').text(dati.codiceBadge || '-');
    $('#modal-dipendenti-data-mobile').text(dati.dataTimbratura || '-');
    $('#modal-dipendenti-ora-mobile').text(dati.oraTimbrature || dati.oraTimbratura || '-');
    $('#modal-dipendenti-descrizione-mobile').text(dati.descrizioneTimbratrice || dati.descrizione || '-');
    
    $('#dettagli-timbrature-dipendenti-modal-mobile').show();
});

$(document).on('click', '.dettagli-timbrature-mensa-btn-mobile', function() {
    const rowData = $(this).data('row');
    let dati = rowData;
    if (typeof rowData === 'string') {
        try { dati = JSON.parse(rowData.replace(/&apos;/g, "'")); } catch { dati = {}; }
    }
    
    // Populate mensa modal
    $('#modal-mensa-nome-mobile').text(dati.nome || '-');
    $('#modal-mensa-cognome-mobile').text(dati.cognome || '-');
    $('#modal-mensa-azienda-mobile').text(dati.azienda || '-');
    $('#modal-mensa-badge-mobile').text(dati.codiceBadge || '-');
    $('#modal-mensa-data-mobile').text(dati.dataTimbratura || '-');
    $('#modal-mensa-ora-mobile').text(dati.oraTimbrature || dati.oraTimbratura || '-');
    $('#modal-mensa-descrizione-mobile').text(dati.descrizioneTimbratrice || dati.descrizione || '-');
    
    $('#dettagli-timbrature-mensa-modal-mobile').show();
});

// Mobile Visit Table Functions
window.createVisiteFutureMobileDataTable = async function() {
    await refreshJwt();
    const url = "http://localhost:8080/visit";
    const accessToken = localStorage.getItem("accessToken");
    const tableId = '#tabella-visite-future-mobile';
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken ? `Bearer ${accessToken}` : undefined
            }
        });

        if (!response.ok) throw new Error('Errore nel recupero dei dati');
        
        const data = await response.json();
        
        if ($.fn.DataTable.isDataTable(tableId)) {
            $(tableId).DataTable().clear().destroy();
        }

        // Filter future visits
        const today = new Date().toISOString().split('T')[0];
        const futureVisits = data.filter(visit => visit.dataInizio > today);
          const tableData = futureVisits.map(visit => ({
            nome: visit.personaVisitatore?.nome || '',
            cognome: visit.personaVisitatore?.cognome || '',
            dettagli: {
                dataInizio: convertToItalianDate(visit.dataInizio),
                oraInizio: formatTime(visit.oraInizio),
                motivo: visit.motivo || '',
                responsabile: (visit.responsabile?.nome || '') + ' ' + (visit.responsabile?.cognome || ''),
                azienda: visit.personaVisitatore?.azienda || '',
                flagDPI: visit.flagDPI ? 'Sì' : 'No',
                materialeInformatico: visit.materialeInformatico?.descrizione || 'Nessuno',
                accessoAutomezzo: visit.flagAccessoConAutomezzo ? 'Sì' : 'No'
            },
            eliminaData: visit
        }));

        $(tableId).DataTable({
            data: tableData,
            destroy: true,
            columns: [
                { data: 'nome' },
                { data: 'cognome' },
                {
                    data: 'dettagli',
                    orderable: false,
                    render: function(data, type, row) {
                        return `<button class='action-button-mobile dettagli-visite-future-btn-mobile' 
                                data-datainizio='${data.dataInizio}'
                                data-orainizio='${data.oraInizio}'
                                data-motivo='${data.motivo}'
                                data-responsabile='${data.responsabile}'
                                data-azienda='${data.azienda}' 
                                data-flagdpi='${data.flagDPI}'
                                data-materiale='${data.materialeInformatico}'
                                data-automezzo='${data.accessoAutomezzo}' 
                                style='font-size:12px;'>Dettagli</button>`;
                    }
                },
                {
                    data: 'eliminaData',
                    orderable: false,
                    render: function(data, type, row) {
                        return `<button class='action-button-mobile elimina-future-btn-mobile' 
                                data-id='${data.idVisita}' 
                                style='font-size:12px;background:#c0392b;'>Elimina</button>`;
                    }
                }
            ],
            lengthChange: false,
            pageLength: 4,
            autoWidth: false,
            responsive: true,
            searching: true,
            info: true,
            language: {
                paginate: { next: '>', previous: '<' },
                emptyTable: 'Nessun dato presente nella tabella',
                zeroRecords: 'Nessun risultato trovato',
                info: 'Pagina _PAGE_ di _PAGES_',
                infoEmpty: 'Nessun elemento disponibile',
                search: 'Cerca:',
            }
        });    } catch (err) {
        console.error('Errore nel caricamento visite future mobile:', err);
        const tbody = document.querySelector(tableId + ' tbody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="4">Errore nel caricamento</td></tr>';
    }
};

window.createVisiteOdierneMobileDataTable = async function() {
    await refreshJwt();
    const url = "http://localhost:8080/visit";
    const accessToken = localStorage.getItem("accessToken");
    const tableId = '#tabella-visite-odierne-mobile';
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken ? `Bearer ${accessToken}` : undefined
            }
        });

        if (!response.ok) throw new Error('Errore nel recupero dei dati');
        
        const data = await response.json();
        
        if ($.fn.DataTable.isDataTable(tableId)) {
            $(tableId).DataTable().clear().destroy();
        }

        // Filter today's visits
        const today = new Date().toISOString().split('T')[0];
        const todayVisits = data.filter(visit => visit.dataInizio === today);
          const tableData = todayVisits.map(visit => {
            const now = new Date();
            const visitStart = new Date(visit.dataInizio + 'T' + visit.oraInizio);
            const oraFineDisplay = now < visitStart ? "Non ancora iniziata" : (visit.oraFine ? formatTime(visit.oraFine) : "-");
            
            return {
                nome: visit.personaVisitatore?.nome || '',
                cognome: visit.personaVisitatore?.cognome || '',
                dettagli: {
                    dataInizio: convertToItalianDate(visit.dataInizio),
                    oraInizio: formatTime(visit.oraInizio),
                    dataFine: visit.dataFine ? convertToItalianDate(visit.dataFine) : "-",
                    oraFine: oraFineDisplay,
                    motivo: visit.motivo || '',
                    responsabile: (visit.responsabile?.nome || '') + ' ' + (visit.responsabile?.cognome || ''),
                    azienda: visit.personaVisitatore?.azienda || '',
                    flagDPI: visit.flagDPI ? 'Sì' : 'No',
                    materialeInformatico: visit.materialeInformatico?.descrizione || 'Nessuno',
                    accessoAutomezzo: visit.flagAccessoConAutomezzo ? 'Sì' : 'No'
                },
                eliminaData: visit,
                badgeData: visit
            };
        });

        $(tableId).DataTable({
            data: tableData,
            destroy: true,
            columns: [
                { data: 'nome' },
                { data: 'cognome' },
                {
                    data: 'dettagli',
                    orderable: false,
                    render: function(data, type, row) {
                        return `<button class='action-button-mobile dettagli-visite-odierne-btn-mobile' 
                                data-datainizio='${data.dataInizio}'
                                data-orainizio='${data.oraInizio}'
                                data-datafine='${data.dataFine}'
                                data-orafine='${data.oraFine}'
                                data-motivo='${data.motivo}'
                                data-responsabile='${data.responsabile}'
                                data-azienda='${data.azienda}' 
                                data-flagdpi='${data.flagDPI}'
                                data-materiale='${data.materialeInformatico}'
                                data-automezzo='${data.accessoAutomezzo}' 
                                style='font-size:12px;'>Dettagli</button>`;
                    }
                },
                {
                    data: 'eliminaData',
                    orderable: false,
                    render: function(data, type, row) {
                        return `<button class='action-button-mobile elimina-btn-mobile' 
                                data-id='${data.idVisita}' 
                                style='font-size:12px;background:#c0392b;'>Elimina</button>`;
                    }
                },
                {
                    data: 'badgeData',
                    orderable: false,
                    render: function(data, type, row) {
                        return `<button class='action-button-mobile assegna-badge-btn-mobile' 
                                data-id='${data.idVisita}' 
                                style='font-size:12px;background:#27ae60;'>Badge</button>`;
                    }
                }
            ],
            lengthChange: false,
            pageLength: 4,
            autoWidth: false,
            responsive: true,
            searching: true,
            info: true,
            language: {
                paginate: { next: '>', previous: '<' },
                emptyTable: 'Nessun dato presente nella tabella',
                zeroRecords: 'Nessun risultato trovato',
                info: 'Pagina _PAGE_ di _PAGES_',
                infoEmpty: 'Nessun elemento disponibile',
                search: 'Cerca:',
            }
        });    } catch (err) {
        console.error('Errore nel caricamento visite odierne mobile:', err);
        const tbody = document.querySelector(tableId + ' tbody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="5">Errore nel caricamento</td></tr>';
    }
};

// Mobile Visit Event Handlers
$(document).on('click', '.dettagli-visite-future-btn-mobile', function() {
    const dataInizio = $(this).data('datainizio');
    const oraInizio = $(this).data('orainizio');
    const motivo = $(this).data('motivo');
    const responsabile = $(this).data('responsabile');
    const azienda = $(this).data('azienda');
    const flagDPI = $(this).data('flagdpi');
    const materiale = $(this).data('materiale');
    const automezzo = $(this).data('automezzo');
    
    // Usa il modal generico per dettagli
    let modalContent = `
        <div style="margin-bottom:10px;"><b>Data inizio:</b> ${dataInizio}</div>
        <div style="margin-bottom:10px;"><b>Ora inizio:</b> ${oraInizio}</div>
        <div style="margin-bottom:10px;"><b>Motivo:</b> ${motivo}</div>
        <div style="margin-bottom:10px;"><b>Responsabile:</b> ${responsabile}</div>
        <div style="margin-bottom:10px;"><b>Azienda:</b> ${azienda}</div>
        <div style="margin-bottom:10px;"><b>Flag DPI:</b> ${flagDPI}</div>
        <div style="margin-bottom:10px;"><b>Materiale informatico:</b> ${materiale}</div>
        <div style="margin-bottom:10px;"><b>Accesso con Automezzo:</b> ${automezzo}</div>
    `;
    
    // Crea o usa il modal generico
    let modal = document.getElementById('dettagli-modal-mobile');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dettagli-modal-mobile';
        modal.className = 'modal';
        modal.style = 'display:flex;position:fixed;z-index:9999;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class='modal-content' style='background:#fff;padding:30px 40px;border-radius:18px;min-width:300px;max-width:90vw;max-height:90vh;box-shadow:0 2px 16px #0002;position:relative;'>
            <span id='close-modal-mobile' style='position:absolute;top:10px;right:18px;font-size:28px;cursor:pointer;'>&times;</span>
            <h3>Dettagli Visita Futura</h3>
            ${modalContent}
        </div>
    `;
    
    modal.style.display = 'flex';
});

$(document).on('click', '.dettagli-visite-odierne-btn-mobile', function() {
    const dataInizio = $(this).data('datainizio');
    const oraInizio = $(this).data('orainizio');
    const dataFine = $(this).data('datafine');
    const oraFine = $(this).data('orafine');
    const motivo = $(this).data('motivo');
    const responsabile = $(this).data('responsabile');
    const azienda = $(this).data('azienda');
    const flagDPI = $(this).data('flagdpi');
    const materiale = $(this).data('materiale');
    const automezzo = $(this).data('automezzo');
    
    let modalContent = `
        <div style="margin-bottom:10px;"><b>Data inizio:</b> ${dataInizio}</div>
        <div style="margin-bottom:10px;"><b>Ora inizio:</b> ${oraInizio}</div>
        <div style="margin-bottom:10px;"><b>Data fine:</b> ${dataFine}</div>
        <div style="margin-bottom:10px;"><b>Ora fine:</b> ${oraFine}</div>
        <div style="margin-bottom:10px;"><b>Motivo:</b> ${motivo}</div>
        <div style="margin-bottom:10px;"><b>Responsabile:</b> ${responsabile}</div>
        <div style="margin-bottom:10px;"><b>Azienda:</b> ${azienda}</div>
        <div style="margin-bottom:10px;"><b>Flag DPI:</b> ${flagDPI}</div>
        <div style="margin-bottom:10px;"><b>Materiale informatico:</b> ${materiale}</div>
        <div style="margin-bottom:10px;"><b>Accesso con Automezzo:</b> ${automezzo}</div>
    `;
    
    // Crea o usa il modal generico
    let modal = document.getElementById('dettagli-modal-mobile');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dettagli-modal-mobile';
        modal.className = 'modal';
        modal.style = 'display:flex;position:fixed;z-index:9999;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);align-items:center;justify-content:center;';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class='modal-content' style='background:#fff;padding:30px 40px;border-radius:18px;min-width:300px;max-width:90vw;max-height:90vh;box-shadow:0 2px 16px #0002;position:relative;'>
            <span id='close-modal-mobile' style='position:absolute;top:10px;right:18px;font-size:28px;cursor:pointer;'>&times;</span>
            <h3>Dettagli Visita Odierna</h3>
            ${modalContent}
        </div>
    `;
    
    modal.style.display = 'flex';
});

$(document).on('click', '.elimina-future-btn-mobile, .elimina-btn-mobile', function() {
    const visitId = $(this).data('id');
    if (confirm('Sei sicuro di voler eliminare questa visita?')) {
        deleteVisit(visitId);
    }
});

$(document).on('click', '.assegna-badge-btn-mobile', function() {
    const visitId = $(this).data('id');
    // TODO: Implement badge assignment functionality
    alert('Funzionalità assegnazione badge da implementare per visita ID: ' + visitId);
});

// Modal close handlers for mobile visit modals
$(document).on('click', '#close-dettagli-visite-future-modal-mobile', function() {
    $('#dettagli-visite-future-modal-mobile').hide();
});

$(document).on('click', '#close-dettagli-visite-odierne-modal-mobile', function() {
    $('#dettagli-visite-odierne-modal-mobile').hide();
});

$(document).on('click', '#dettagli-visite-future-modal-mobile, #dettagli-visite-odierne-modal-mobile', function(e) {
    if (e.target === this) {
        $(this).hide();
    }
});

// Helper function for visit deletion
async function deleteVisit(visitId) {
    await refreshJwt();
    const accessToken = localStorage.getItem("accessToken");
    
    try {
        const response = await fetch(`http://localhost:8080/visit/${visitId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken ? `Bearer ${accessToken}` : undefined
            }
        });
        
        if (response.ok) {
            alert('Visita eliminata con successo');
            // Refresh the current table
            const currentSection = $('.mobile-section:visible').attr('id');
            if (currentSection === 'visualizza-elenco-visitatori-futuri-mobile-section') {
                createVisiteFutureMobileDataTable();
            } else if (currentSection === 'visualizza-elenco-visitatori-oggi-mobile-section') {
                createVisiteOdierneMobileDataTable();
            }
        } else {
            throw new Error('Errore nell\'eliminazione della visita');
        }
    } catch (err) {
        console.error('Errore eliminazione visita:', err);
        alert('Errore nell\'eliminazione della visita');
    }
}