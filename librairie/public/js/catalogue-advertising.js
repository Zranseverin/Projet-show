document.querySelectorAll('[data-advertising]').forEach((section) => {
    const track = section.querySelector('.advertising-track');
    const slides = [...track.querySelectorAll('.advertising-slide')];
    const pauseButton = section.querySelector('[data-ad-pause]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let timer;
    let scrollTimer;
    let visible = !('IntersectionObserver' in window);
    let hovered = false;
    let focused = false;
    let dragging = false;
    let paused = reducedMotion.matches;

    const markCurrent = () => {
        slides.forEach((slide, position) => slide.classList.toggle('is-current', position === index));
    };
    const updateButton = () => {
        pauseButton.textContent = paused ? '\u25b6' : '\u23f8';
        pauseButton.setAttribute('aria-label', paused ? 'Démarrer le défilement automatique' : 'Mettre le défilement en pause');
        pauseButton.setAttribute('aria-pressed', String(paused));
    };
    const move = (direction) => {
        index = (index + direction + slides.length) % slides.length;
        track.scrollTo({
            left: slides[index].offsetLeft - slides[0].offsetLeft,
            behavior: reducedMotion.matches ? 'auto' : 'smooth',
        });
        markCurrent();
    };
    const schedule = () => {
        clearTimeout(timer);
        if (paused || !visible || hovered || focused || dragging || document.hidden || slides.length < 2) return;
        timer = setTimeout(() => {
            move(1);
            schedule();
        }, 4500);
    };
    section.querySelectorAll('[data-ad-direction]').forEach((button) => {
        button.addEventListener('click', () => {
            move(Number(button.dataset.adDirection));
            schedule();
        });
    });
    pauseButton.addEventListener('click', () => {
        paused = !paused;
        updateButton();
        schedule();
    });
    section.addEventListener('mouseenter', () => { hovered = true; schedule(); });
    section.addEventListener('mouseleave', () => { hovered = false; schedule(); });
    section.addEventListener('focusin', () => { focused = true; schedule(); });
    section.addEventListener('focusout', (event) => {
        focused = section.contains(event.relatedTarget);
        schedule();
    });
    track.addEventListener('pointerdown', () => { dragging = true; schedule(); });
    const release = () => { dragging = false; schedule(); };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    track.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const origin = slides[0].offsetLeft;
            index = slides.reduce((nearest, slide, position) =>
                Math.abs(slide.offsetLeft - origin - track.scrollLeft) < Math.abs(slides[nearest].offsetLeft - origin - track.scrollLeft) ? position : nearest, 0);
            markCurrent();
        }, 140);
    }, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) paused = true;
        updateButton();
        schedule();
    });
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) section.classList.add('advertising-revealed');
            schedule();
        }, { threshold: 0.15 });
        observer.observe(section);
    }
    markCurrent();
    updateButton();
    schedule();
});
