/* =========================================================
   Портфолио Марины Захаровой — логика и анимации
   GSAP + ScrollTrigger (анимации по скроллу), Lenis (плавный скролл).
   Если библиотеки не загрузились, сайт продолжает работать без анимаций.
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Данные: правь здесь, разметка соберётся сама ---------- */

  const SKILLS = [
    { icon: '.py', name: 'Python', tag: 'Основной язык', text: 'Скрипты, автоматизация, работа с файлами и данными, библиотеки pandas и numpy.' },
    { icon: '.cpp', name: 'C++', tag: 'Инженерная база', text: 'ООП, STL, алгоритмы и структуры данных. Учит думать о памяти и сложности.' },
    { icon: '.js', name: 'HTML, CSS, JavaScript', tag: 'Веб', text: 'Сайты без фреймворков: адаптивная вёрстка, формы с валидацией, корзина, SVG и анимации. Бэкенд на Cloudflare Workers.' },
    { icon: '.sql', name: 'SQL', tag: 'Работа с данными', text: 'JOIN, GROUP BY, оконные функции, транзакции и триггеры. В реальном проекте — база SQLite (Cloudflare D1).' },
    { icon: 'ER', name: 'Базы данных', tag: 'Проектирование', text: 'Схемы, нормализация, ER-диаграммы и связи между таблицами.' },
    { icon: 'σ', name: 'Теория вероятностей и статистика', tag: 'Математика', text: 'Проверка гипотез и работа с выборками: отличаю закономерность от случайности.' },
    { icon: 'BA', name: 'Бизнес-анализ', tag: 'Понимание задачи', text: 'Разбираюсь в требованиях и задаю правильные вопросы до того, как писать код.' },
    { icon: '.xlsx', name: 'Excel', tag: 'Инструмент', text: 'Сводные таблицы, ВПР, быстрые проверки данных и графики.' },
    { icon: '.pptx', name: 'PowerPoint', tag: 'Подача результата', text: 'Показываю результат работы: демо, защита проекта, отчёт команде.' },
  ];

  // Проекты. Чтобы добавить новый — скопируй объект и положи скриншоты в img/.
  const PROJECTS = [
    {
      title: 'МясоMore — ресторан, магазин и доставка',
      desc: 'Сайт ресторана мяса и морепродуктов: меню, магазин на развес, доставка и онлайн-бронирование столов по схеме зала. Для брони написала свой сервер с базой данных и Telegram-ботом для администратора.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Cloudflare Workers', 'SQL · D1 (SQLite)', 'Telegram Bot API', 'GitHub Pages'],
      live: 'https://marinazakharova4344.github.io/miasomore/',
      repo: 'https://github.com/marinazakharova4344/miasomore',
      domain: 'marinazakharova4344.github.io/miasomore',
      cover: { src: 'img/miasomore/hero.jpg', alt: 'Главный экран сайта МясоMore' },
      shots: [
        { src: 'img/miasomore/booking.jpg', alt: 'Онлайн-бронирование: выбор стола и мест на схеме зала', caption: 'Бронь по схеме зала' },
        { src: 'img/miasomore/restaurant.jpg', alt: 'Блок «Три направления»: ресторан, магазин, доставка', caption: 'Три направления' },
        { src: 'img/miasomore/menu.jpg', alt: 'Меню ресторана с вкладками категорий', caption: 'Меню ресторана' },
        { src: 'img/miasomore/shop.jpg', alt: 'Каталог магазина с фильтрами', caption: 'Магазин' },
        { src: 'img/miasomore/mobile.jpg', alt: 'Мобильная версия сайта', caption: 'Телефон', mobile: true },
      ],
      facts: ['85 блюд в 11 категориях', '50 товаров в магазине', 'Бронь по схеме зала', 'Telegram-бот для администратора', 'Защита от двойной брони', '17 автотестов'],
      task: 'Сделать для заведения один сайт сразу под три направления: ресторан, магазин морепродуктов и доставку. И дать гостям забронировать конкретный стол или место у стойки онлайн, без звонка.',
      solution: 'Фронтенд написала на чистом HTML, CSS и JavaScript без фреймворков: меню и каталог собираются из данных, общая корзина хранится в localStorage, формы с маской телефона и проверкой полей на лету. Для брони сделала сервер на Cloudflare Workers с базой D1 (SQLite). Схема зала нарисована в SVG и показывает свободные и занятые места, данные обновляются каждую минуту. Бронь сохраняется одной транзакцией, а триггер в базе не даёт занять одно место дважды. Администратору бронь приходит в Telegram с кнопкой «Отменить» и командами /today и /tomorrow. Через 15 минут после начала бот спрашивает «Гости пришли?» и при неявке освобождает места.',
      result: 'Работающий сайт на GitHub Pages с живым онлайн-бронированием: гость выбирает дату, время и место на схеме, бронь подтверждается сразу. Логику брони проверяют 17 автотестов, в том числе 20 одновременных запросов на одно место: проходит ровно один.',
    },
  ];

  /* ---------- Окружение ---------- */

  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const animate = hasGsap && !reducedMotion;
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  if (animate) {
    gsap.registerPlugin(ScrollTrigger);
    root.classList.add('js-anim');
  }

  /* ---------- Рендер навыков и проектов ---------- */

  $('.skills__grid').innerHTML = SKILLS.map((s) => `
    <li class="skill" data-reveal>
      <div class="skill__top"><h3 class="skill__name">${s.name}</h3><span class="skill__icon" aria-hidden="true">${s.icon}</span></div>
      <span class="skill__tag">${s.tag}</span>
      <p>${s.text}</p>
    </li>`).join('');

  const arrow = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5 4h7v7"/></svg>';

  $('.projects__list').innerHTML = PROJECTS.map((p, i) => `
    <article class="project-row ${i % 2 ? 'project-row--reverse' : ''}">
      <div class="container feature__grid">
        <div class="feature__text">
          <p class="eyebrow" data-reveal>Проект ${String(i + 1).padStart(2, '0')}</p>
          <h3 class="title" data-split-words>${p.title}</h3>
          <span class="dash" aria-hidden="true"></span>
          <div class="feature__body" data-reveal><p>${p.desc}</p></div>
          <ul class="facts" data-reveal>${p.facts.map((f) => `<li>${f}</li>`).join('')}</ul>
          <div class="badges" data-reveal>${p.stack.map((t) => `<span class="badge">${t}</span>`).join('')}</div>
          <div class="project-row__actions" data-reveal>
            <a class="btn btn--accent magnetic" href="${p.live}" target="_blank" rel="noopener"><span>Открыть сайт ${arrow}</span></a>
            <button type="button" class="btn btn--line magnetic" data-project="${i}" aria-haspopup="dialog"><span>Подробнее</span></button>
            <a class="link-code" href="${p.repo}" target="_blank" rel="noopener">Код на GitHub ${arrow}</a>
          </div>
        </div>
        <div class="media media--shot" data-clip>
          <div class="media__inner" data-parallax>
            <a class="browser" href="${p.live}" target="_blank" rel="noopener" aria-label="Открыть сайт ${p.title}">
              <span class="browser__bar"><i></i><i></i><i></i><span class="browser__url">${p.domain}</span></span>
              <img src="${p.cover.src}" alt="${p.cover.alt}" loading="lazy" width="1440" height="900">
            </a>
          </div>
        </div>
      </div>
      <div class="container">
        <ul class="shots">
          ${p.shots.map((sh) => `
            <li class="shot ${sh.mobile ? 'shot--mobile' : ''}" data-reveal>
              <button type="button" class="shot__btn" data-shot="${sh.src}" data-alt="${sh.alt}" aria-haspopup="dialog">
                <img src="${sh.src}" alt="${sh.alt}" loading="lazy">
              </button>
              <span class="shot__caption">${sh.caption}</span>
            </li>`).join('')}
        </ul>
      </div>
    </article>`).join('');

  const hero = $('.hero');

  /* ---------- Код в окнах: каждая строка — отдельный блок для анимации ---------- */

  $$('.win__body code').forEach((code) => {
    code.innerHTML = code.innerHTML.split('\n').map((l) => `<span class="code-line">${l}</span>`).join('');
  });

  /* ---------- Разбиение текста на слова и буквы ---------- */

  function split(el, mode) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/\s+/).map((word) => {
      const inner = mode === 'chars'
        ? [...word].map((c) => `<span class="split-char">${c}</span>`).join('')
        : `<span class="split-word">${word}</span>`;
      return `<span class="split-mask" aria-hidden="true">${inner}</span>`;
    }).join(' ');
  }
  $$('[data-split-chars]').forEach((el) => split(el, 'chars'));
  $$('[data-split-words]').forEach((el) => split(el, 'words'));
  $('.hero__title').setAttribute('aria-label', 'Junior-разработчик, Python, JavaScript, C++, SQL');

  /* ---------- Плавный скролл (Lenis) и навигация ---------- */

  let lenis = null;
  if (animate && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop(); // включим после прелоадера
  }

  const body = document.body;
  const burger = $('.burger');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    if (lenis) open ? lenis.stop() : lenis.start();
    else body.classList.toggle('is-locked', open);
  }
  burger.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      const target = id === '#top' ? body : $(id);
      if (!target) return;
      e.preventDefault();
      if (body.classList.contains('menu-open')) setMenu(false);
      if (lenis) lenis.scrollTo(id === '#top' ? 0 : target, { offset: -40, duration: 1.4 });
      else target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Шапка, прогресс чтения, активный пункт меню ---------- */

  const header = $('.header');
  const bar = $('.progress__bar');
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    const max = root.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle('is-scrolled', y > 40);
    header.classList.toggle('is-hidden', y > lastY && y > 500 && !body.classList.contains('menu-open'));
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });

  const navLinks = $$('.nav a');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => io.observe(s));

  /* ---------- Прелоадер ---------- */

  function runPreloader(onDone) {
    const preloader = $('.preloader');
    const cleanup = () => { preloader.remove(); };
    if (!animate) { cleanup(); onDone(); return; }

    gsap.timeline()
      .to('.preloader__bar span', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' })
      .to(preloader, { yPercent: -100, duration: 0.9, ease: 'expo.inOut', onComplete: cleanup })
      .add(onDone, '-=0.45'); // интро стартует, пока шторка уезжает
  }

  /* ---------- Интро первого экрана ---------- */

  function heroIntro() {
    if (!animate) return;
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.header', { opacity: 0, duration: 1 })
      .from('.hero__bar', { scaleY: 0, duration: 0.9, ease: 'expo.inOut' }, 0)
      .from('.hero__title .split-char', { yPercent: 110, duration: 1.1, stagger: 0.018 }, 0.25)
      .fromTo('[data-hero]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 0.5)
      .from('.hero__glyph', { opacity: 0, scale: 0.9, duration: 1.6 }, 0.3)
      .from('.win--editor', { opacity: 0, y: 60, duration: 1.2 }, 0.5)
      .from('.win--editor .code-line', { opacity: 0, x: -10, duration: 0.5, stagger: 0.09 }, 0.9)
      .from('.win--term', { opacity: 0, y: 60, duration: 1.2 }, 1.1)
      .from('.service', { opacity: 0, y: 80, duration: 1.2, stagger: 0.12 }, 0.7);
  }

  /* ---------- Анимации по скроллу ---------- */

  function scrollAnimations() {
    if (!animate) return;

    // Заголовки: слова выезжают из-под маски
    $$('[data-split-words]').forEach((el) => {
      gsap.from($$('.split-word', el), {
        yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    // Розовые черточки «прорисовываются»
    $$('.dash').forEach((el) => {
      if (el.closest('.service')) return;
      gsap.fromTo(el, { scaleX: 0, opacity: 1 }, {
        scaleX: 1, opacity: 1, duration: 1, ease: 'expo.inOut',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });

    // Блоки появляются группами
    ScrollTrigger.batch('[data-reveal]:not(.dash)', {
      start: 'top 90%', once: true,
      onEnter: (batch) => gsap.fromTo(batch, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.08 }),
    });

    // Картинки: розовая шторка проезжает и открывает изображение
    $$('[data-clip]').forEach((media) => {
      const wipe = document.createElement('span');
      wipe.className = 'media__wipe';
      media.appendChild(wipe);
      const inner = $('.media__inner', media);
      gsap.set(inner, { autoAlpha: 0 });
      gsap.timeline({ scrollTrigger: { trigger: media, start: 'top 80%' } })
        .to(wipe, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' })
        .set(inner, { autoAlpha: 1 })
        .set(wipe, { transformOrigin: 'right' })
        .to(wipe, { scaleX: 0, duration: 0.8, ease: 'expo.inOut' })
        .from(inner.firstElementChild, { scale: 1.12, duration: 1.4, ease: 'expo.out' }, '<');

    });

    // Параллакс картинок
    $$('[data-parallax]').forEach((el) => {
      gsap.fromTo(el, { yPercent: -5 }, {
        yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // Первый экран уходит с лёгким параллаксом
    gsap.to('.hero__content', {
      yPercent: -18, opacity: 0.2, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero .shards', {
      yPercent: 20, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // Путь: линия прорисовывается по мере скролла
    const mm = gsap.matchMedia();
    const fillTween = (vars) => gsap.to('.steps__fill', {
      ...vars, ease: 'none',
      scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
    });
    mm.add('(min-width: 961px)', () => fillTween({ scaleX: 1 }));
    mm.add('(max-width: 960px)', () => fillTween({ scaleY: 1 }));
    gsap.from('.step', {
      opacity: 0, y: 40, duration: 1, ease: 'expo.out', stagger: 0.15,
      scrollTrigger: { trigger: '.steps', start: 'top 80%' },
    });
  }

  // Счётчики «докручиваются» при появлении
  function counters() {
    $$('[data-count]').forEach((el) => {
      const to = +el.dataset.count;
      const from = +(el.dataset.from || 0);
      const suffix = el.dataset.suffix || '';
      if (!animate) { el.textContent = to + suffix; return; }
      const obj = { v: from };
      ScrollTrigger.create({
        trigger: el, start: 'top 92%', once: true,
        onEnter: () => gsap.to(obj, { v: to, duration: 2, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(obj.v) + suffix) }),
      });
    });
  }

  /* ---------- Hero: плоскости и окна слегка следуют за мышью ---------- */

  if (animate && finePointer) {
    const layers = $$('.hero [data-depth]').map((el) => ({
      x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
      depth: +el.dataset.depth,
    }));
    hero.addEventListener('mousemove', (e) => {
      const dx = e.clientX / innerWidth - 0.5;
      const dy = e.clientY / innerHeight - 0.5;
      layers.forEach((l) => { l.x(dx * 30 * l.depth); l.y(dy * 20 * l.depth); });
    });
  }

  /* ---------- Магнитные кнопки ---------- */

  if (finePointer && !reducedMotion) {
    $$('.magnetic').forEach((btn) => {
      const label = btn.querySelector('span');
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.2}px, ${dy * 0.3}px)`;
        if (label) label.style.transform = `translate(${dx * 0.08}px, ${dy * 0.1}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        const t = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        btn.style.transition = `${t}, color 0.4s, border-color 0.4s`;
        btn.style.transform = '';
        if (label) { label.style.transition = t; label.style.transform = ''; }
        setTimeout(() => { btn.style.transition = ''; if (label) label.style.transition = ''; }, 600);
      });
    });
  }

  /* ---------- Модалка проекта ---------- */

  const modal = $('.modal');
  const modalContent = $('.modal__content');
  let lastFocused = null;

  function openModal(i) {
    const p = PROJECTS[i];
    modal.classList.remove('modal--image');
    modalContent.innerHTML = `
      <p class="eyebrow">Проект ${String(i + 1).padStart(2, '0')}</p>
      <h3 id="modal-title">${p.title}</h3>
      <span class="dash" aria-hidden="true"></span>
      <div class="badges">${p.stack.map((t) => `<span class="badge">${t}</span>`).join('')}</div>
      <div class="case">
        <div class="case__step"><h4>Задача</h4><p>${p.task}</p></div>
        <div class="case__step"><h4>Решение</h4><p>${p.solution}</p></div>
        <div class="case__step"><h4>Результат</h4><p>${p.result}</p></div>
      </div>
      <div class="case__links">
        <a class="btn btn--accent" href="${p.live}" target="_blank" rel="noopener"><span>Открыть сайт</span></a>
        <a class="btn btn--line" href="${p.repo}" target="_blank" rel="noopener"><span>Код на GitHub</span></a>
      </div>`;
    showModal();
  }

  // Просмотр скриншота во весь экран
  function openShot(src, alt) {
    modal.classList.add('modal--image');
    modalContent.innerHTML = `<img class="modal__img" src="${src}" alt="${alt}"><p class="modal__caption" id="modal-title">${alt}</p>`;
    showModal();
  }

  function showModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    lenis ? lenis.stop() : body.classList.add('is-locked');
    $('.modal__close').focus();

    if (animate) {
      gsap.fromTo('.modal__backdrop', { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo('.modal__panel', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' });
      if ($('.case', modal)) {
        gsap.from('.modal__content .dash', { scaleX: 0, duration: 0.8, delay: 0.2, ease: 'expo.inOut' });
        gsap.from('.case__step', { y: 24, opacity: 0, duration: 0.7, stagger: 0.1, delay: 0.25, ease: 'expo.out' });
      }
    }
  }

  function closeModal() {
    if (modal.hidden) return;
    const done = () => {
      modal.hidden = true;
      lenis ? lenis.start() : body.classList.remove('is-locked');
      lastFocused && lastFocused.focus();
    };
    if (!animate) return done();
    gsap.to('.modal__backdrop', { opacity: 0, duration: 0.3 });
    gsap.to('.modal__panel', { y: 40, opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: done });
  }

  $$('[data-project]').forEach((el) => el.addEventListener('click', () => openModal(+el.dataset.project)));
  $$('[data-shot]').forEach((el) => el.addEventListener('click', () => openShot(el.dataset.shot, el.dataset.alt)));
  $$('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false);
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') { // держим фокус внутри модалки
      const items = $$('button, a[href]', modal);
      const i = items.indexOf(document.activeElement);
      e.preventDefault();
      items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
    }
  });

  /* ---------- Тост, копирование email, форма ---------- */

  const toast = $('.toast');
  let toastTimer;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  const EMAIL = $('.copy-email').dataset.email;
  $('.copy-email').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      showToast('Email скопирован. Жду вашего письма!');
    } catch (err) {
      location.href = 'mailto:' + EMAIL;
    }
  });

  // Форма без сервера: собирает письмо и открывает почтовый клиент
  const form = $('.form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    $$('input, textarea', form).forEach((f) => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.parentElement.classList.toggle('is-error', bad);
      if (bad) ok = false;
    });
    if (!ok) { showToast('Заполните, пожалуйста, все поля'); return; }

    const { name, email, message } = Object.fromEntries(new FormData(form));
    const subject = encodeURIComponent(`Предложение от ${name}`);
    const text = encodeURIComponent(`${message}\n\n${name}, ${email}`);
    location.href = `mailto:${EMAIL}?subject=${subject}&body=${text}`;
    showToast('Открываю почтовый клиент…');
  });
  $$('input, textarea', form).forEach((f) => f.addEventListener('input', () => f.parentElement.classList.remove('is-error')));

  /* ---------- Пасхалки ---------- */

  console.log('%c<Марина Захарова />', 'font: 700 18px "Exo 2", sans-serif; color: #f4b4c4;');
  console.log(
    '%cРаз вы заглянули в консоль, вы цените детали. Я тоже.\nИщете junior-разработчика? mooorrriinaa@mail.ru · t.me/mooorrriinaa',
    'font: 14px Manrope, sans-serif; color: #c9c6cb; line-height: 1.6;',
  );

  // Храним последние 10 нажатий и сравниваем с кодом: лишние нажатия до него не мешают.
  // e.code — физическая клавиша, поэтому B и A работают в любой раскладке (и с Caps Lock).
  const KONAMI = 'ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight KeyB KeyA';
  const pressed = [];
  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    pressed.push(e.code);
    if (pressed.length > 10) pressed.shift();
    if (pressed.join(' ') === KONAMI) { pressed.length = 0; confetti(); }
  });

  function confetti() {
    showToast('Пасхалка найдена! Внимательность — главный навык разработчика');
    if (reducedMotion) return;
    const palette = ['#f4b4c4', '#f9d3dd', '#ffffff', '#e48fa6', '#9b989e'];
    for (let i = 0; i < 120; i++) {
      const el = document.createElement('span');
      el.className = 'confetti';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.background = palette[i % palette.length];
      body.appendChild(el);
      const drift = (Math.random() - 0.5) * 300;
      el.animate(
        [{ transform: 'translate(0, 0) rotate(0deg)' },
         { transform: `translate(${drift}px, ${innerHeight + 40}px) rotate(${Math.random() * 1080}deg)` }],
        { duration: 2200 + Math.random() * 1800, delay: Math.random() * 400, easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)' },
      ).onfinish = () => el.remove();
    }
  }

  /* ---------- Старт ---------- */

  counters();
  scrollAnimations();
  onScroll();
  runPreloader(() => {
    lenis && lenis.start();
    heroIntro();
    animate && ScrollTrigger.refresh();
  });
})();
