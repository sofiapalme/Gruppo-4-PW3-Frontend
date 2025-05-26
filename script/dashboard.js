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
        const arrowImg = arrow ? arrow.querySelector('img') : null;

        document.querySelectorAll('.submenu').forEach(s => {
            if (s !== submenu) s.classList.remove('active');
        });

        document.querySelectorAll('.arrow img').forEach(img => {
            img.src = 'assets/down_arrow_white_icon.png';
            img.alt = 'Freccia giù';
        });

        if (submenu) {
            const isActive = submenu.classList.contains('active');
            submenu.classList.toggle('active', !isActive);

            if (arrowImg) {
                arrowImg.src = isActive ? 'assets/down_arrow_white_icon.png' : 'assets/up_arrow_white_icon.png';
                arrowImg.alt = isActive ? 'Freccia giù' : 'Freccia su';
            }
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

        document.querySelectorAll('.arrow img').forEach(img => {
            img.src = 'assets/down_arrow_white_icon.png';
            img.alt = 'Freccia giù';
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
