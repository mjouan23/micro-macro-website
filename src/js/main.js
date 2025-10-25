document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('button_bottom');
    if (!btn) return;

    btn.style.cursor = 'pointer';
    btn.addEventListener('click', function (e) {
        e.preventDefault();

        const nav = document.querySelector('nav') || document.querySelector('#menu nav');
        const offset = nav ? nav.offsetHeight : 0;
        
        const content = document.querySelector('.content');
        if (content) {
            // calcule la position juste après le bas du bloc content
            const top = content.getBoundingClientRect().top - offset;
            window.scrollTo({ top, behavior: 'smooth' });
            return;
        }
    });
});