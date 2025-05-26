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
        const arrowImg = this.querySelector('.arrow img');
        
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
