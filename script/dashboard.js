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
    item.addEventListener('click', function(e) {
        const submenu = this.querySelector('.submenu');
        const arrow = this.querySelector('.arrow');
        
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

        document.querySelectorAll('.arrow').forEach(a => {
            if (a !== arrow) {
                a.textContent = '▼';
            }
        });

        if (submenu) {
            const isActive = submenu.classList.contains('active');
            submenu.classList.toggle('active');
            arrow.textContent = isActive ? '▼' : '▲';
        }

        e.stopPropagation();
    });
});

// Gestione click sui sottomenu
document.querySelectorAll('.submenu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation(); // Previene la propagazione al menu-item padre
        const targetId = item.id + '-section';
        showSection(targetId);
    });
});

// Click fuori dal menu chiude i sottomenu
document.addEventListener('click', function(e) {
    const menu = document.querySelector('.menu');
    if (!menu.contains(e.target)) {
        document.querySelectorAll('.submenu').forEach(submenu => {
            submenu.classList.remove('active');
        });
        document.querySelectorAll('.arrow').forEach(arrow => {
            arrow.textContent = '▼';
        });
    }
});

// All'avvio mostra la home
document.addEventListener('DOMContentLoaded', () => {
    showSection('home-section');
});
