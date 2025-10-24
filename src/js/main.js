document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('button_bottom');
    if (!btn) return;

    btn.style.cursor = 'pointer';
    btn.addEventListener('click', function (e) {
        e.preventDefault();

        const nav = document.querySelector('nav') || document.querySelector('#menu nav');
        const offset = nav ? nav.offsetHeight : 0;

        const hero = document.getElementById('puzzle2_hero');
        if (hero) {
            // calcule la position juste après le bas du bloc hero
            const top = hero.getBoundingClientRect().top + window.pageYOffset + hero.offsetHeight - offset;
            window.scrollTo({ top, behavior: 'smooth' });
            return;
        }

        // fallback : faire comme avant vers #content
        const target = document.getElementById('content');
        if (target) {
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});