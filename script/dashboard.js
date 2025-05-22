function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => {
        if (sec.id === id) {
            sec.classList.add('active');
        } else {
            sec.classList.remove('active');
        }
    });
}

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function (e) {
        const submenu = this.querySelector('.submenu');
        const arrow = this.querySelector('.arrow');

        document.querySelectorAll('.submenu').forEach(s => {
            if (s !== submenu) s.classList.remove('active');
        });

        document.querySelectorAll('.arrow').forEach(a => {
            if (a !== arrow) a.textContent = '▼';
        });

        if (submenu) {
            const isActive = submenu.classList.contains('active');
            submenu.classList.toggle('active', !isActive);
            arrow.textContent = isActive ? '▼' : '▲';
        } else {
            // se non c'è submenu, mostra la home (o altra sezione)
            showSection('home-section');
        }

        e.stopPropagation();
    });
});

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

document.querySelectorAll('.submenu-item').forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.id + '-section';
        showSection(targetId);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Mostra home all’avvio
    showSection('home-section');
});
