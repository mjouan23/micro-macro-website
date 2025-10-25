// Gestion "magnétisme" (snap) pour .image-strip : un slide à la fois sur mobile (et desktop drag)
document.addEventListener('DOMContentLoaded', () => {
    const strip = document.querySelector('.image-strip');
    if (!strip) return;

    // On travaille uniquement avec les wrappers .slide présents dans le HTML
    let slides = Array.from(strip.querySelectorAll('.slide'));
    if (slides.length === 0) return;

    // Assure que chaque slide ne se contracte pas en flex
    slides.forEach(s => {
        s.style.flex = '0 0 auto';
        s.style.display = 'inline-flex';
        s.style.alignItems = 'center';
        s.style.justifyContent = 'center';
    });

    // Pointer drag variables
    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    // Debounced snap after scroll end
    let scrollTimer = null;
    const SCROLL_DEBOUNCE = 120;

    function snapToNearest() {
        const scrollLeft = strip.scrollLeft;
        // Trouver le slide dont left est le plus proche du scrollLeft
        let nearestIndex = 0;
        let minDiff = Math.abs(slides[0].offsetLeft - scrollLeft);
        for (let i = 1; i < slides.length; i++) {
            const diff = Math.abs(slides[i].offsetLeft - scrollLeft);
            if (diff < minDiff) {
                minDiff = diff;
                nearestIndex = i;
            }
        }
        const target = slides[nearestIndex];
        // aligner le slide sur le bord gauche du conteneur
        strip.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    }

    // Pointer events to allow dragging
    strip.addEventListener('pointerdown', (e) => {
        isDown = true;
        strip.setPointerCapture(e.pointerId);
        startX = e.clientX;
        startScroll = strip.scrollLeft;
        strip.classList.add('is-dragging'); // optional for styling
    });

    strip.addEventListener('pointermove', (e) => {
        if (!isDown) return;
        const dx = startX - e.clientX;
        strip.scrollLeft = startScroll + dx;
    });

    function endDrag(e) {
        if (!isDown) return;
        isDown = false;
        try { strip.releasePointerCapture(e.pointerId); } catch (err) {}
        strip.classList.remove('is-dragging');
        // Snap to nearest after drag
        snapToNearest();
    }

    strip.addEventListener('pointerup', endDrag);
    strip.addEventListener('pointercancel', endDrag);
    strip.addEventListener('pointerleave', (e) => { if (isDown) endDrag(e); });

    // Also snap after natural scroll (inertia) finishes
    strip.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            if (!isDown) snapToNearest();
        }, SCROLL_DEBOUNCE);
    });

    // Optional keyboard navigation (left/right)
    strip.addEventListener('keydown', (e) => {
        // trouver slide actuellement visible
        const currentIndex = slides.findIndex(s => Math.abs(s.offsetLeft - strip.scrollLeft) < 5);
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            const next = Math.min(slides.length - 1, (currentIndex === -1 ? 0 : currentIndex + 1));
            strip.scrollTo({ left: slides[next].offsetLeft, behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prev = Math.max(0, (currentIndex === -1 ? 0 : currentIndex - 1));
            strip.scrollTo({ left: slides[prev].offsetLeft, behavior: 'smooth' });
        }
    });

    // Make container focusable for keyboard nav
    strip.tabIndex = 0;
});