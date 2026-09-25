/* «Мама сделала» · сценарий страницы. Без фреймворков. */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isMobile = () => innerWidth <= 860;
  const lite = matchMedia("(max-width: 860px), (pointer: coarse)").matches;

  const TG = "https://t.me/Love_mtvv";
  const CHANNEL = "https://t.me/mama_sdelala";

  /* ───────── прелоадер ───────── */
  let ready = false;
  const finishLoading = () => {
    if (ready) return;
    ready = true;
    document.body.classList.remove("is-loading");
    requestAnimationFrame(() => document.body.classList.add("is-ready"));
  };
  addEventListener("load", () => setTimeout(finishLoading, 350));
  setTimeout(finishLoading, 2200);

  /* ───────── плавный скролл (Lenis) ───────── */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.9 });
    window.__lenis = lenis;
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const scrollToTarget = (el) => {
    if (lenis) lenis.scrollTo(el, { offset: el.id === "top" ? 0 : -70, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href").slice(1);
    const el = id === "top" ? document.body : document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    if (id === "top") { lenis ? lenis.scrollTo(0, { duration: 1.4 }) : scrollTo({ top: 0, behavior: "smooth" }); return; }
    scrollToTarget(el);
  });

  /* ───────── разбивка текста на буквы ───────── */
  let charIndex = 0;
  const splitText = (el) => {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.textContent = "";
    let i = 0;
    text.split(/\s+/).forEach((word, wi, arr) => {
      const w = document.createElement("span");
      w.className = "word";
      w.setAttribute("aria-hidden", "true");
      for (const ch of word) {
        const c = document.createElement("span");
        c.className = "char";
        c.textContent = ch;
        c.style.setProperty("--ci", i++);
        w.appendChild(c);
      }
      el.appendChild(w);
      if (wi < arr.length - 1) el.appendChild(document.createTextNode(" "));
    });
    charIndex += i;
  };
  $$("[data-split]").forEach(splitText);
  // h1 должен читаться целиком
  const heroTitle = $("#hero-title");
  heroTitle.setAttribute("aria-label", "Домашний зефир");

  /* ───────── небо: облака и иллюстрации ───────── */
  const sky = { items: [] };
  const rand = (a, b) => a + Math.random() * (b - a);
  const buildSky = () => {
    const planes = { far: $(".sky__plane--far"), mid: $(".sky__plane--mid"), near: $(".sky__plane--near") };
    const spec = [
      ["far", lite ? 3 : 7, 18, 34, 0.06], ["mid", lite ? 3 : 6, 14, 26, 0.16], ["near", lite ? 2 : 4, 16, 30, 0.3]
    ];
    spec.forEach(([name, n, wMin, wMax, depth]) => {
      for (let i = 0; i < n; i++) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "sky__cloud");
        svg.innerHTML = `<use href="#${Math.random() > 0.5 ? "cloud-a" : "cloud-b"}"/>`;
        const w = rand(wMin, wMax) * (isMobile() ? 1.8 : 1);
        svg.style.cssText = `--w:${w}vw;--x:${rand(-10, 90)}vw;--y:0;--d:${rand(40, 90)}s`;
        planes[name].appendChild(svg);
        sky.items.push({ el: svg, y: rand(0, 1), depth: depth * rand(0.85, 1.15) });
      }
    });
    const decos = ["ill-currant", "ill-apple", "ill-flower", "heart", "star", "ill-currant", "petal", "ill-pear"];
    decos.forEach((id) => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "sky__deco");
      svg.innerHTML = `<use href="#${id}"/>`;
      const fill = id === "heart" ? "#F4B6CF" : id === "star" ? "#F5C542" : id === "petal" ? "#F9CFE0" : "";
      if (fill) svg.style.fill = fill;
      const edge = Math.random() > 0.5 ? rand(1, 9) : rand(88, 95);
      svg.style.cssText += `;--w:${rand(28, 56)}px;--x:${edge}vw;--y:0;--d:${rand(6, 11)}s`;
      planes.mid.appendChild(svg);
      sky.items.push({ el: svg, y: rand(0, 1), depth: rand(0.22, 0.4) });
    });
  };
  buildSky();

  const skyStops = [
    ["#FFF1F5", "#FDE3EE", "#F3E9FF"],
    ["#FFF7F0", "#FFE7DA", "#FDE3EE"],
    ["#F5FBEF", "#E5F3D3", "#FDEFF5"],
    ["#F8F2FF", "#EADCFB", "#FFE3EE"],
    ["#FFF6EC", "#FFE9C7", "#FDE3EE"],
    ["#FFF1F5", "#FBD6E6", "#F3E9FF"]
  ];
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => {
    const A = hex(a), B = hex(b);
    return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
  };
  const skyEl = $(".sky");
  let lastSkyKey = "";
  const updateSky = (y, docH) => {
    const p = clamp(y / Math.max(1, docH - innerHeight));
    const f = p * (skyStops.length - 1);
    const i = Math.min(skyStops.length - 2, Math.floor(f));
    const t = f - i;
    const key = (f * 50) | 0;
    if (key !== lastSkyKey) {
      lastSkyKey = key;
      ["--sky-1", "--sky-2", "--sky-3"].forEach((v, k) => skyEl.style.setProperty(v, mix(skyStops[i][k], skyStops[i + 1][k], t)));
    }
    if (reduced || lite) return;
    const H = innerHeight + 400;
    sky.items.forEach((it) => {
      let py = (it.y * H - y * it.depth) % H;
      if (py < 0) py += H;
      it.el.style.transform = `translate3d(0, ${py - 200}px, 0)`;
    });
  };
  if (reduced || lite) sky.items.forEach((it) => { it.el.style.transform = `translateY(${it.y * innerHeight}px)`; });

  /* ───────── HERO: шляпная коробка ───────── */
  const hero = $(".hero");
  const heroCopy = $(".hero__copy");
  const box = $(".box");
  const lid = $(".lid");
  const innerShadow = $(".box__inner-shadow");
  const reveal = $(".hero__reveal");
  const frontCloud = $(".hero__cloud--front");
  const backCloud = $(".hero__cloud--back");
  const petalsWrap = $(".box__petals");
  const heroChars = $$(".hero__title .char");

  const petals = [];
  const petalColors = ["#F9CFE0", "#F4B6CF", "#FFFFFF", "#EFA3C3", "#C7E08E", "#FBE2EC"];
  const PETALS = lite ? 10 : 16;
  for (let i = 0; i < PETALS; i++) {
    const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "box__petal");
    s.setAttribute("viewBox", "0 0 40 52");
    s.innerHTML = `<use href="#petal"/>`;
    s.style.fill = petalColors[i % petalColors.length];
    if (!lite) s.style.filter = "drop-shadow(0 6px 8px rgba(184,56,111,.25))";
    petalsWrap.appendChild(s);
    const a = (i / PETALS) * Math.PI * 2 + rand(-0.2, 0.2);
    petals.push({ el: s, a, d: rand(0.55, 1.05), r: rand(-240, 240), delay: rand(0, 0.35), sc: rand(0.7, 1.4) });
  }
  const charSpread = heroChars.map((c, i) => ({ el: c, dx: (i % 2 ? 1 : -1) * rand(10, 40), dy: rand(-60, -10), r: rand(-20, 20) }));

  const updateHero = (y) => {
    if (reduced) return;
    const total = hero.offsetHeight - innerHeight;
    const p = clamp((y - hero.offsetTop) / Math.max(1, total));
    const m = isMobile();
    const bd = box.offsetWidth;

    // 1. заголовок уходит вглубь, буквы разлетаются как сахарная пудра
    const t1 = easeInOut(seg(p, 0.03, 0.28));
    heroCopy.style.opacity = 1 - t1;
    heroCopy.style.transform = `translate3d(0, ${-t1 * 5}vh, 0) scale(${1 - t1 * 0.08})`;
    heroCopy.style.filter = !lite && t1 > 0.01 ? `blur(${t1 * 8}px)` : "";
    heroCopy.style.pointerEvents = t1 > 0.5 ? "none" : "";
    charSpread.forEach((c) => { c.el.style.translate = `${c.dx * t1}px ${c.dy * t1}px`; c.el.style.rotate = `${c.r * t1}deg`; });

    // 2. крышка приподнимается и улетает вправо-вверх
    const tl = easeInOut(seg(p, 0.05, 0.42));
    const lift = Math.sin(tl * Math.PI);
    const lx = Math.pow(tl, 1.3) * bd * (m ? 0.95 : 0.78);
    const ly = -tl * bd * (m ? 1.45 : 0.62) - lift * 20;
    const lidFade = m ? 1 - seg(p, 0.3, 0.44) : 1 - seg(p, 0.62, 0.8);
    lid.style.transform = `translate3d(${lx}px, ${ly}px, ${lift * 220}px) rotateX(${-tl * 16 + lift * 10}deg) rotateY(${tl * 26}deg) rotateZ(${tl * 34}deg) scale(${1 + lift * 0.06 - tl * 0.14})`;
    lid.style.opacity = lidFade;
    innerShadow.style.opacity = 1 - easeOut(seg(p, 0.06, 0.32));

    // 3. коробка поворачивается к нам и приближается
    const tb = easeInOut(seg(p, 0.12, 0.62));
    const tout = easeInOut(seg(p, 0.8, 1));
    const bx = m ? 0 : -tb * bd * 0.02;
    const by = m ? -tb * innerHeight * 0.12 - tout * innerHeight * 0.1 : -tout * innerHeight * 0.12;
    const bs = 1 + tb * (m ? 0.1 : 0.16) - tout * 0.18;
    box.style.transform = `translate3d(${bx}px, ${by}px, 0) rotate(${(1 - tb) * -10}deg) scale(${bs})`;

    // 4. лепестки вылетают из коробки
    const tp = seg(p, 0.1, 0.75);
    const pf = 1 - seg(p, 0.82, 0.97);
    petals.forEach((pt) => {
      const lt = easeOut(clamp((tp - pt.delay) / (1 - pt.delay)));
      const dist = lt * pt.d * bd * (m ? 0.62 : 0.85);
      const x = Math.cos(pt.a) * dist;
      const yy = Math.sin(pt.a) * dist - lt * 40;
      pt.el.style.opacity = lt > 0 ? Math.min(1, lt * 5) * pf : 0;
      pt.el.style.transform = `translate3d(${x}px, ${yy}px, 0) rotate(${pt.r * lt}deg) scale(${pt.sc * (0.4 + lt * 0.6)})`;
    });

    // 5. «каждый лепесток вручную»
    const tr = easeOut(seg(p, 0.4, 0.55)) * (1 - seg(p, 0.8, 0.92));
    reveal.style.opacity = tr;
    reveal.style.transform = `translate3d(0, ${(1 - tr) * 3}vh, 0)`;

    // 6. облака поднимаются снизу и уносят в следующую сцену
    const tc = easeInOut(seg(p, 0.76, 1));
    frontCloud.style.transform = `translate3d(0, ${100 - tc * 72}%, 0)`;
    backCloud.style.transform = `translate3d(0, ${-p * 12}vh, 0)`;
  };

  /* ───────── появления ───────── */
  const groups = new Map();
  $$("[data-in]").forEach((el) => {
    const key = el.parentElement;
    const n = groups.get(key) || 0;
    groups.set(key, n + 1);
    el.style.setProperty("--d", `${n * 90}ms`);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
  $$("[data-in], [data-split]:not(.hero__line), .geo__map, .final__qr").forEach((el) => io.observe(el));

  /* ───────── облачка «Почему наш» плавают с разной скоростью ───────── */
  const floaters = $$("[data-float]").map((el) => ({ el, k: parseFloat(el.dataset.float) }));
  const updateFloaters = () => {
    if (reduced || isMobile()) return;
    floaters.forEach(({ el, k }) => {
      const r = el.getBoundingClientRect();
      const c = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.transform = `translate3d(0, ${c * k * 90}px, 0)`;
    });
  };

  /* ───────── букеты: слова съезжаются ───────── */
  const kinetic = $$("[data-kinetic]");
  const updateKinetic = () => {
    if (reduced || !kinetic.length) return;
    const r = kinetic[0].parentElement.getBoundingClientRect();
    const q = easeOut(clamp((innerHeight - r.top) / (innerHeight * 0.75)));
    kinetic.forEach((el, i) => {
      const dir = i % 2 ? 1 : -1;
      el.style.transform = `translate3d(${(1 - q) * dir * 16}vw, 0, 0)`;
      el.style.opacity = 0.15 + q * 0.85;
    });
  };

  /* ───────── процесс: горизонтальная лента ───────── */
  const proc = $(".process");
  const track = $(".process__track");
  let procOverflow = 0;
  const layoutProcess = () => {
    if (reduced || isMobile()) { proc.style.height = ""; track.style.transform = ""; procOverflow = 0; return; }
    procOverflow = Math.max(0, track.scrollWidth - innerWidth);
    proc.style.height = `${innerHeight + procOverflow}px`;
  };
  const updateProcess = (y) => {
    if (!procOverflow) return;
    const p = clamp((y - proc.offsetTop) / procOverflow);
    track.style.transform = `translate3d(${-p * procOverflow}px, 0, 0)`;
    proc.style.setProperty("--pp", p.toFixed(4));
  };

  /* ───────── поводы: облака бегут быстрее, когда вы скроллите ───────── */
  const rows = $$(".marquee__row").map((row, i) => {
    row.innerHTML += row.innerHTML;
    return { row, x: i ? -row.scrollWidth / 2 : 0, dir: i ? 1 : -1 };
  });
  let lastY = scrollY, velocity = 0, marqueeVisible = false;
  new IntersectionObserver((es) => { marqueeVisible = es[0].isIntersecting; }).observe($(".marquee"));
  const updateMarquee = (y) => {
    const dy = y - lastY;
    velocity += (Math.abs(dy) - velocity) * 0.1;
    lastY = y;
    if (reduced || !marqueeVisible) return;
    rows.forEach((r) => {
      const half = r.row.scrollWidth / 2;
      r.x += r.dir * (0.45 + Math.min(velocity, 60) * 0.12);
      if (r.x <= -half) r.x += half;
      if (r.x > 0) r.x -= half;
      r.row.style.transform = `translate3d(${r.x}px, 0, 0)`;
    });
  };

  /* ───────── география: маршрут прорисовывается ───────── */
  const geoRoute = $(".geo__route");
  const updateGeo = () => {
    if (!geoRoute || isMobile()) return;
    const r = geoRoute.getBoundingClientRect();
    const q = reduced ? 1 : clamp((innerHeight - r.top) / (innerHeight * 0.7));
    geoRoute.style.clipPath = `inset(0 ${100 - q * 100}% 0 0)`;
  };
  $$(".geo__cities li").forEach((li, i) => li.style.setProperty("--i", i));

  /* ───────── шапка, липкая кнопка ───────── */
  const header = $(".header");
  const stickyCta = $(".sticky-cta");
  const finalSec = $("#final");
  const updateChrome = (y) => {
    header.classList.toggle("is-scrolled", y > 40);
    const fr = finalSec.getBoundingClientRect();
    stickyCta.classList.toggle("is-shown", y > innerHeight * 0.9 && fr.top > innerHeight * 0.7);
  };

  /* ───────── единый цикл кадра ───────── */
  let docH = document.documentElement.scrollHeight;
  let lastFrameY = -1;
  const frame = () => {
    const y = scrollY;
    if (y !== lastFrameY) {
      updateSky(y, docH);
      updateHero(y);
      updateFloaters();
      updateKinetic();
      updateProcess(y);
      updateGeo();
      updateChrome(y);
      lastFrameY = y;
    }
    updateMarquee(y);
    requestAnimationFrame(frame);
  };
  const relayout = () => {
    layoutProcess();
    docH = document.documentElement.scrollHeight;
    lastFrameY = -1;
  };
  addEventListener("resize", relayout);
  addEventListener("load", relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  relayout();
  requestAnimationFrame(frame);

  /* ───────── карта маршрута ───────── */
  const routeLinks = $$(".route a");
  const wayIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.dataset.waySection;
      routeLinks.forEach((a) => a.setAttribute("aria-current", String(a.dataset.way === id)));
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  $$("[data-way-section]").forEach((s) => wayIO.observe(s));

  /* ───────── меню на телефоне ───────── */
  const burger = $(".burger");
  const menu = $("#mobile-menu");
  let menuOpen = false;
  $$("#mobile-menu li").forEach((li, i) => li.style.setProperty("--i", i));
  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    menu.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
    lenis && lenis.start();
  }
  burger.addEventListener("click", () => {
    if (menuOpen) return closeMenu();
    menuOpen = true;
    menu.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Закрыть меню");
    lenis && lenis.stop();
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ───────── каталог ───────── */
  const ART = {
    rose: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="40" fill="#F4B6CF"/><path d="M60 30c16 0 28 12 28 28S76 88 60 88 32 74 32 58c0-8 4-14 10-18" fill="none" stroke="#E98DB3" stroke-width="5" stroke-linecap="round"/><path d="M60 44c9 0 16 7 16 15s-7 15-16 15-15-6-15-14c0-5 3-9 7-11" fill="none" stroke="#E98DB3" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="59" r="5" fill="#E98DB3"/><path d="M22 92c10-14 24-14 30-8-10 10-22 12-30 8zm76 0c-10-14-24-14-30-8 10 10 22 12 30 8z" fill="#8DB63C"/></svg>`,
    tulip: `<svg viewBox="0 0 120 120"><path d="M40 118l6-40h28l6 40z" fill="#C9D2DA"/><path d="M38 80h44" stroke="#A9B4BE" stroke-width="5" stroke-linecap="round"/><path d="M50 80c0-18-4-30-8-40M60 80V34M70 80c0-18 4-30 8-40" stroke="#6FA23A" stroke-width="4" fill="none"/><path d="M32 44c0-14 4-22 10-26 2 6 4 8 0 26-6 4-10 2-10 0zm20 0c0-10 4-16 8-20s8 10 8 20c0 6-16 6-16 0z" fill="#F4B6CF"/><path d="M42 18c6 4 10 12 10 26-4 4-10 2-10-26zM70 44c0-14 6-22 12-26 4 8 6 18 2 26-4 4-14 4-14 0z" fill="#E98DB3"/><path d="M52 30c0-10 4-16 8-20 4 4 8 10 8 20 0 8-16 8-16 0z" fill="#FFD57A"/></svg>`,
    heart: `<svg viewBox="0 0 120 120"><path d="M60 104S16 78 16 46c0-14 11-26 25-26 9 0 15 5 19 12 4-7 10-12 19-12 14 0 25 12 25 26 0 32-44 58-44 58z" fill="#F4B6CF"/><path d="M40 40c-4 6-4 14 0 22M52 34c-4 10-4 22 2 34M70 34c4 10 4 22-2 34M82 42c4 6 3 14-2 22" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/><path d="M60 18c-10-12-24-10-20-2 4 6 14 4 20 2zm0 0c10-12 24-10 20-2-4 6-14 4-20 2z" fill="#C2185B"/></svg>`,
    dome: `<svg viewBox="0 0 120 120"><ellipse cx="60" cy="104" rx="40" ry="8" fill="#E7C9A9"/><path d="M26 102V60a34 34 0 0168 0v42" fill="rgba(255,255,255,.5)" stroke="#B9C6D6" stroke-width="3"/><circle cx="60" cy="16" r="6" fill="#B9C6D6"/><path d="M60 100V70" stroke="#6FA23A" stroke-width="4"/><circle cx="60" cy="64" r="16" fill="#F4B6CF"/><path d="M60 54c6 0 10 4 10 10s-4 10-10 10" fill="none" stroke="#E98DB3" stroke-width="4" stroke-linecap="round"/><path d="M48 88c6-8 12-6 12-2-4 4-8 6-12 2z" fill="#8DB63C"/></svg>`,
    eight: `<svg viewBox="0 0 120 120"><circle cx="60" cy="36" r="22" fill="none" stroke="#F4B6CF" stroke-width="16"/><circle cx="60" cy="80" r="26" fill="none" stroke="#E98DB3" stroke-width="16"/><circle cx="44" cy="22" r="3" fill="#fff"/><circle cx="80" cy="70" r="3" fill="#fff"/><path d="M90 20l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="#F5C542"/></svg>`,
    cone: `<svg viewBox="0 0 120 120"><path d="M36 58h48l-24 58z" fill="#E7B774"/><path d="M42 66l30 26M52 60l26 22M40 76l18 16M66 60l12 10" stroke="#C99550" stroke-width="3"/><path d="M34 60c-8-10 0-22 10-20 0-14 14-22 24-14 10-6 24 4 18 16 10 4 8 18-2 18z" fill="#F4B6CF"/><path d="M50 44c6-6 16-6 22 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="72" cy="22" r="6" fill="#E45D86"/></svg>`,
    box: `<svg viewBox="0 0 120 120"><rect x="14" y="20" width="92" height="84" rx="10" fill="#FCE7A6"/><rect x="22" y="28" width="76" height="68" rx="6" fill="#FFF6D9"/><g><circle cx="42" cy="48" r="13" fill="#F4B6CF"/><circle cx="78" cy="48" r="13" fill="#fff"/><circle cx="42" cy="78" r="13" fill="#fff"/><circle cx="78" cy="78" r="13" fill="#FFB380"/></g><g fill="none" stroke-width="3" stroke-linecap="round"><path d="M42 40c5 0 8 4 8 8s-4 8-8 8" stroke="#E98DB3"/><path d="M78 40c5 0 8 4 8 8s-4 8-8 8" stroke="#E6D9D2"/><path d="M42 70c5 0 8 4 8 8s-4 8-8 8" stroke="#E6D9D2"/><path d="M78 70c5 0 8 4 8 8s-4 8-8 8" stroke="#F07B2E"/></g></svg>`,
    wreath: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="36" fill="none" stroke="#8DB63C" stroke-width="18"/><circle cx="60" cy="60" r="36" fill="none" stroke="#6FA23A" stroke-width="4" stroke-dasharray="3 9"/><g fill="#E45D86"><circle cx="30" cy="44" r="5"/><circle cx="88" cy="40" r="5"/><circle cx="92" cy="76" r="5"/><circle cx="36" cy="84" r="5"/><circle cx="60" cy="96" r="5"/></g><path d="M60 22c-10-12-24-8-18 0 4 4 12 2 18 0zm0 0c10-12 24-8 18 0-4 4-12 2-18 0z" fill="#E45D86"/></svg>`,
    nest: `<svg viewBox="0 0 120 120"><ellipse cx="60" cy="80" rx="44" ry="22" fill="#D6A66B"/><path d="M20 76c20 8 60 8 80 0M24 86c20 8 52 8 72 0" stroke="#B9854A" stroke-width="3" fill="none"/><ellipse cx="44" cy="62" rx="12" ry="15" fill="#F4B6CF"/><ellipse cx="62" cy="58" rx="12" ry="15" fill="#FFF"/><ellipse cx="78" cy="64" rx="11" ry="14" fill="#C7E08E"/></svg>`,
    kulich: `<svg viewBox="0 0 120 120"><rect x="36" y="52" width="48" height="56" rx="6" fill="#E7B774"/><path d="M36 60h48" stroke="#C99550" stroke-width="3"/><path d="M30 56c0-18 14-26 30-26s30 8 30 26c-6 4-10-4-14 2s-8 6-12 0-10-4-14 2-10 0-20-4z" fill="#FFF"/><g fill="#F4B6CF"><circle cx="48" cy="40" r="3"/><circle cx="62" cy="36" r="3"/><circle cx="72" cy="44" r="3"/></g><path d="M60 30c-4-8 2-14 6-12" stroke="#8DB63C" stroke-width="3" fill="none"/></svg>`,
    cake: `<svg viewBox="0 0 120 120"><rect x="18" y="56" width="84" height="46" rx="10" fill="#FFF"/><rect x="18" y="72" width="84" height="10" fill="#FFB380"/><rect x="18" y="56" width="84" height="16" rx="8" fill="#F4B6CF"/><path d="M18 64c10 8 18 8 28 0s18-8 28 0 18 8 28 0" stroke="#E98DB3" stroke-width="4" fill="none"/><g fill="#E45D86"><circle cx="38" cy="48" r="6"/><circle cx="60" cy="44" r="6"/><circle cx="82" cy="48" r="6"/></g></svg>`,
    bouquet: `<svg viewBox="0 0 120 120"><path d="M34 60l26 56 26-56z" fill="#BFE0EA"/><path d="M40 60l20 44 20-44" fill="#DDF0F5"/><circle cx="44" cy="50" r="15" fill="#F4B6CF"/><circle cx="76" cy="50" r="15" fill="#FFF"/><circle cx="60" cy="36" r="16" fill="#E9D5F5"/><g fill="none" stroke-width="3.5" stroke-linecap="round"><path d="M44 42c5 0 9 4 9 8s-4 9-9 9" stroke="#E98DB3"/><path d="M76 42c5 0 9 4 9 8s-4 9-9 9" stroke="#E6D9D2"/><path d="M60 28c5 0 9 4 9 8s-4 9-9 9" stroke="#B784D1"/></g><path d="M52 104c-8 6-18 4-18 0s10-4 18 0zm16 0c8 6 18 4 18 0s-10-4-18 0z" fill="#E45D86"/></svg>`
  };
  const ART_BG = { rose: "#FDE3EE", tulip: "#FFEBD9", heart: "#FFE0EA", dome: "#E9F1FB", eight: "#FFE8F0", cone: "#FFF1DD", box: "#FFF4D6", wreath: "#E8F3D8", nest: "#F6ECDD", kulich: "#FFF0DC", cake: "#FDE6EF", bouquet: "#E6F3F7" };

  const prices = window.MAMA_PRICES || [];
  const tabsData = window.MAMA_TABS || [];
  const tabsEl = $(".tabs");
  const grid = $("#catalog-grid");
  const fmt = (p) => (typeof p === "number" ? p.toLocaleString("ru-RU") : p);
  let activeTab = tabsData[0] && tabsData[0].id;

  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  };
  const toastEl = $(".toast");
  let toastT;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("is-shown");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("is-shown"), 2600);
  };

  const renderGrid = () => {
    const items = prices.filter((p) => p.tab === activeTab);
    grid.setAttribute("aria-labelledby", `tab-${activeTab}`);
    grid.innerHTML = items.map((it, i) => {
      const media = it.photo
        ? `<img src="${it.photo}" alt="${it.name}" loading="lazy" width="600" height="630">`
        : `<div class="card__art" style="--art-bg:${ART_BG[it.art] || "#FDE3EE"}" role="img" aria-label="${it.name}, иллюстрация">${ART[it.art] || ART.rose}</div>`;
      const orderText = `Здравствуйте! Хочу заказать: ${it.name} (${fmt(it.price)} ₽${it.unit || ""})`;
      return `<article class="card" style="--i:${i}" data-tilt>
        <div class="card__media">${media}</div>
        <div class="card__body">
          <h3 class="card__name">${it.name}</h3>
          <p class="card__desc">${it.desc}</p>
          <div class="card__row">
            <span class="card__price">${fmt(it.price)} ₽<small>${it.unit || ""}</small></span>
            <button class="copy-btn" type="button" data-copy="${orderText.replace(/"/g, "&quot;")}" aria-label="Скопировать название: ${it.name}" title="Скопировать название">
              <svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/></svg>
            </button>
            <a class="btn btn--puff" href="${TG}" target="_blank" rel="noopener" data-order="${orderText.replace(/"/g, "&quot;")}">Заказать</a>
          </div>
        </div>
      </article>`;
    }).join("");
    bindTilt(grid);
  };

  tabsEl.innerHTML = tabsData.map((t, i) => `<button class="tab" role="tab" id="tab-${t.id}" data-tab="${t.id}" aria-selected="${i === 0}" aria-controls="catalog-grid" tabindex="${i === 0 ? 0 : -1}">${t.label}</button>`).join("");
  const tabs = $$(".tab", tabsEl);
  const selectTab = (btn, focus) => {
    if (btn.dataset.tab === activeTab) return;
    tabs.forEach((t) => { const on = t === btn; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; });
    activeTab = btn.dataset.tab;
    if (focus) btn.focus();
    if (tabsEl.scrollWidth > tabsEl.clientWidth) {
      tabsEl.scrollTo({ left: btn.offsetLeft - (tabsEl.clientWidth - btn.offsetWidth) / 2, behavior: reduced ? "auto" : "smooth" });
    }
    if (document.startViewTransition && !reduced && document.visibilityState === "visible") {
      const vt = document.startViewTransition(renderGrid);
      vt.ready.catch(() => {});
      vt.finished.catch(() => {});
    } else renderGrid();
  };
  tabsEl.addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (b) selectTab(b); });
  tabsEl.addEventListener("keydown", (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
    if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
    if (e.key === "Home") n = tabs[0];
    if (e.key === "End") n = tabs[tabs.length - 1];
    if (n) { e.preventDefault(); selectTab(n, true); }
  });
  grid.addEventListener("click", async (e) => {
    const c = e.target.closest("[data-copy]");
    if (c) { const ok = await copyText(c.dataset.copy); toast(ok ? "Скопировали! Вставьте в сообщение Любе" : "Не получилось скопировать"); return; }
    const o = e.target.closest("[data-order]");
    if (o) { copyText(o.dataset.order).then((ok) => ok && toast("Название набора скопировано: вставьте его в чат")); }
  });
  renderGrid();

  /* ───────── наклон и магнит ───────── */
  function bindTilt(scope = document) {
    if (!finePointer || reduced) return;
    $$("[data-tilt]", scope).forEach((el) => {
      if (el._tilt) return;
      el._tilt = true;
      let raf = 0;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => { el.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-4px)`; });
      });
      el.addEventListener("pointerleave", () => {
        cancelAnimationFrame(raf);
        el.style.transition = "transform .6s cubic-bezier(.23,1,.32,1)";
        el.style.transform = "";
        setTimeout(() => { el.style.transition = ""; }, 600);
      });
    });
  }
  bindTilt();
  if (finePointer && !reduced) {
    $$("[data-magnet]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.25}px ${(e.clientY - r.top - r.height / 2) * 0.3}px`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "translate .5s cubic-bezier(.34,1.56,.64,1), transform .16s";
        el.style.translate = "";
        setTimeout(() => { el.style.transition = ""; }, 500);
      });
    });
  }

  /* ───────── отзывы ───────── */
  const revTrack = $(".reviews__track");
  $$("[data-rev]").forEach((b) => b.addEventListener("click", () => {
    const card = revTrack.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 22 : 300;
    revTrack.scrollBy({ left: step * parseInt(b.dataset.rev, 10), behavior: reduced ? "auto" : "smooth" });
  }));

  /* ───────── лайтбокс ───────── */
  const lb = $(".lightbox");
  const lbImg = $("img", lb);
  $$(".shot").forEach((s) => s.addEventListener("click", () => {
    const img = $("img", s);
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lb.showModal();
    lenis && lenis.stop();
  }));
  $(".lightbox__close").addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("close", () => { lenis && lenis.start(); });

  /* ───────── QR-код на канал ───────── */
  const qrEl = $("#qr");
  const drawQR = () => {
    if (window.qrcode) {
      const qr = window.qrcode(0, "M");
      qr.addData(CHANNEL);
      qr.make();
      qrEl.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    } else {
      qrEl.innerHTML = `<a href="${CHANNEL}">t.me/mama_sdelala</a>`;
    }
  };
  if (window.qrcode) drawQR(); else addEventListener("load", drawQR);

  $("#year").textContent = new Date().getFullYear();
})();
