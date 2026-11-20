(() => {
  const tour = document.querySelector('.tour');
  const slides = [...tour.querySelectorAll('.slide')];
  const choices = [...tour.querySelectorAll('[data-slide]')];
  const toggle = tour.querySelector('[data-play]');
  const status = tour.querySelector('[data-status]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let playing = !motion.matches;
  let timer;
  function schedule() {
    clearTimeout(timer);
    if (playing && !document.hidden && !tour.matches(':hover') && !tour.contains(document.activeElement)) {
      timer = setTimeout(() => show(active + 1), 7000);
    }
  }
  function show(index, announce = false) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== active; });
    choices.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)));
    if (announce) status.textContent = `Slide ${active + 1} of ${slides.length}: ${slides[active].querySelector('h3').textContent}`;
    schedule();
  }
  function setPlaying(value) {
    playing = value;
    toggle.textContent = playing ? 'Pause slideshow' : 'Play slideshow';
    schedule();
  }
  choices.forEach(button => button.addEventListener('click', () => {
    setPlaying(false);
    show(Number(button.dataset.slide), true);
  }));
  tour.querySelector('[data-prev]').addEventListener('click', () => { setPlaying(false); show(active - 1, true); });
  tour.querySelector('[data-next]').addEventListener('click', () => { setPlaying(false); show(active + 1, true); });
  toggle.addEventListener('click', () => setPlaying(!playing));
  tour.addEventListener('mouseenter', () => clearTimeout(timer));
  tour.addEventListener('mouseleave', schedule);
  tour.addEventListener('focusin', () => clearTimeout(timer));
  tour.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => setPlaying(false));
  tour.classList.add('enhanced');
  show(0);
  setPlaying(playing);
})();
