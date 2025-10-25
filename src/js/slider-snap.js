// Snapping léger : on laisse le scroll natif (touch/drag) gérer le déplacement.
// JS fournit uniquement navigation clavier / fonctions next/prev.

document.addEventListener('DOMContentLoaded', () => {
    const strip = document.querySelector('.image-strip');
    if (!strip) return;

    const slides = Array.from(strip.querySelectorAll('.slide'));
    if (slides.length === 0) return;

    // Helper : trouver l'index du slide le plus proche du centre du viewport du strip
    function indexClosestToCenter() {
        const center = strip.scrollLeft + strip.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        slides.forEach((s, i) => {
            const sCenter = s.offsetLeft + s.offsetWidth / 2;
            const dist = Math.abs(sCenter - center);
            if (dist < bestDist) { bestDist = dist; best = i; }
        });
        return best;
    }

    // navigation clavier
    strip.tabIndex = 0;
    strip.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const current = indexClosestToCenter();
        let targetIndex = current;
        if (e.key === 'ArrowRight') targetIndex = Math.min(slides.length - 1, current + 1);
        if (e.key === 'ArrowLeft') targetIndex = Math.max(0, current - 1);
        slides[targetIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    });

    // fonctions utilitaires accessibles si besoin
    window.sliderNext = function() {
        const idx = indexClosestToCenter();
        const next = Math.min(slides.length - 1, idx + 1);
        slides[next].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    };
    window.sliderPrev = function() {
        const idx = indexClosestToCenter();
        const prev = Math.max(0, idx - 1);
        slides[prev].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    };

    // optionnel : si vous aviez une logique pour "snap after inertial scroll",
    // vous pouvez laisser la natif CSS la gérer ; évitez d'ajouter un snap JS ici.
});