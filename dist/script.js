(() => {
  const portrait = document.querySelector('.portrait');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (portrait) {
    const portraitImage = portrait.querySelector('.portrait-image');
    const clouds = Array.from(portrait.querySelectorAll('.portrait-cloud'));
    let frame = 0, played = false;
    const finishPortrait = () => {
      cancelAnimationFrame(frame);
      portrait.classList.remove('is-waiting', 'is-revealing');
      portrait.classList.add('is-visible');
      portraitImage.removeAttribute('mask');
    };
    const revealPortrait = () => {
      if (reduceMotion.matches) { finishPortrait(); return; }
      played = true;
      cancelAnimationFrame(frame);
      portraitImage.setAttribute('mask', 'url(#portrait-mask)');
      clouds.forEach(cloud => { cloud.setAttribute('rx', '0'); cloud.setAttribute('ry', '0'); });
      portrait.classList.remove('is-visible', 'is-revealing');
      portrait.classList.add('is-waiting');
      void portrait.getBoundingClientRect();
      portrait.classList.remove('is-waiting');
      portrait.classList.add('is-revealing');
      const started = performance.now();
      const draw = now => {
        const progress = Math.min(1, (now - started) / 5800);
        clouds.forEach((cloud, i) => {
          const local = Math.max(0, Math.min(1, (progress - i * 0.065) / (1 - i * 0.065)));
          const radius = 520 * Math.pow(local, 1.6);
          cloud.setAttribute('rx', radius.toFixed(2));
          cloud.setAttribute('ry', (radius * (i === 1 ? 1.18 : 0.92)).toFixed(2));
        });
        if (progress < 1) frame = requestAnimationFrame(draw);
        else finishPortrait();
      };
      frame = requestAnimationFrame(draw);
    };
    if (!reduceMotion.matches && 'IntersectionObserver' in window) {
      portrait.classList.add('is-waiting');
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting) && !played) {
          revealPortrait();
          observer.disconnect();
        }
      }, { threshold: 0.25 });
      observer.observe(portrait);
    } else finishPortrait();
    reduceMotion.addEventListener('change', () => {
      if (reduceMotion.matches) {
        played = true;
        finishPortrait();
      }
    });
  }
  const caseDialog = document.querySelector('#case-dialog');
  const imageDialog = document.querySelector('#image-dialog');
  if (!caseDialog.showModal || !imageDialog.showModal) return;
  document.documentElement.classList.add('js');
  const lock = () => { document.body.classList.toggle('modal-open', caseDialog.open || imageDialog.open); };
  let gallery = [], index = 0, opener = null;
  const renderImage = () => {
    const button = gallery[index];
    const img = document.querySelector('#lightbox-image');
    img.src = button.dataset.image;
    img.alt = button.dataset.caption;
    document.querySelector('#image-caption').textContent = button.dataset.caption;
    document.querySelector('#image-position').textContent = `${index + 1} / ${gallery.length}`;
    document.querySelector('#image-prev').disabled = gallery.length < 2;
    document.querySelector('#image-next').disabled = gallery.length < 2;
  };
  const move = direction => { index = (index + direction + gallery.length) % gallery.length; renderImage(); };
  function openCase(id, element) {
    const source = document.getElementById(id);
    if (!source || !source.matches('.case-archive details')) return false;
    opener = element;
    document.querySelector('#dialog-title').textContent = source.dataset.title;
    document.querySelector('#dialog-content').replaceChildren(source.querySelector('.case-content').cloneNode(true));
    caseDialog.showModal();
    caseDialog.scrollTop = 0;
    lock();
    return true;
  }
  document.addEventListener('click', event => {
    const caseLink = event.target.closest('a[href^="#case-"]');
    if (caseLink && openCase(caseLink.hash.slice(1), caseLink)) { event.preventDefault(); return; }
    const button = event.target.closest('button.image-open');
    if (button) {
      const group = button.closest('.case-gallery, .photo-grid, .case-content, .research-list');
      gallery = Array.from(group.querySelectorAll('button.image-open'));
      index = gallery.indexOf(button);
      renderImage();
      imageDialog.showModal();
      lock();
      return;
    }
    const close = event.target.closest('.close-dialog');
    if (close) close.closest('dialog').close();
  });
  for (const dialog of [caseDialog, imageDialog]) {
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => { lock(); if (dialog === caseDialog && opener) opener.focus(); });
  }
  document.querySelector('#image-prev').addEventListener('click', () => move(-1));
  document.querySelector('#image-next').addEventListener('click', () => move(1));
  document.addEventListener('keydown', event => {
    if (!imageDialog.open) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
  if (location.hash.startsWith('#case-')) openCase(location.hash.slice(1));
})();
