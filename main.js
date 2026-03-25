/* ─────────────────────────────────────────
   WALCO – main.js  |  Interactive behaviors
───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR: Scroll-triggered glass effect ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 2. HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ── 3. INTERSECTION OBSERVER: Reveal animations ── */
  const revealTargets = document.querySelectorAll(
    '.service-card, .futuro-checklist li, .result-card, .eng-header, .futuro-img-wrap, .futuro-content-col, .potencial-header, .contact-left, .contact-right, .footer-col'
  );
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 4 === 1) el.classList.add('reveal-delay-1');
    if (i % 4 === 2) el.classList.add('reveal-delay-2');
    if (i % 4 === 3) el.classList.add('reveal-delay-3');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => observer.observe(el));

  /* ── 4. POTENCIAL SLIDER ── */
  const slider = document.getElementById('consumo-slider');
  const consumoValue = document.getElementById('consumo-value');
  const valPotencia = document.getElementById('val-potencia');
  const valEconomia = document.getElementById('val-economia');
  const valCO2 = document.getElementById('val-co2');
  const valPayback = document.getElementById('val-payback');
  const fillPotencia = document.getElementById('fill-potencia');
  const fillEconomia = document.getElementById('fill-economia');
  const fillCO2 = document.getElementById('fill-co2');
  const fillPayback = document.getElementById('fill-payback');

  const updateSlider = () => {
    const kWh        = parseInt(slider.value);
    const maxKWh     = 500000; // 500 mil kWh
    const precoKWh   = 1.126; // valor atual do kWh em R$
    const margem     = 0.75;  // 75% (margem de erro de 25%)
    const valorUtil  = precoKWh * margem; // R$ 0,8445/kWh

    // Alerta de contato para consumo acima de 1 MWh
    const contatoMsg = document.getElementById('slider-contact-msg');
    if (contatoMsg) {
      contatoMsg.style.display = kWh >= maxKWh ? 'block' : 'none';
    }

    // Cálculos de estimativa
    const kWp        = (kWh / 150).toFixed(1);
    const economia   = Math.round(kWh * valorUtil * 12);  // economia anual
    const co2        = (kWh * 0.04 * 12 / 1000).toFixed(1); // 40g CO2/kWh
    const costKWp    = 3800; // custo médio instalado por kWp
    const systemCost = kWp * costKWp;
    const payback    = economia > 0 ? Math.round(systemCost / economia * 12) : 0;

    consumoValue.textContent = kWh.toLocaleString('pt-BR') + ' kWh';
    valPotencia.textContent  = kWp + ' kWp';
    valEconomia.textContent  = 'R$ ' + economia.toLocaleString('pt-BR');
    valCO2.textContent       = co2 + ' t CO₂';
    valPayback.textContent   = '~' + payback + ' meses';

    const pct = ((kWh - 500) / (maxKWh - 500)) * 100;
    fillPotencia.style.width = Math.max(3, pct) + '%';
    fillEconomia.style.width = Math.max(3, pct * 0.9) + '%';
    fillCO2.style.width      = Math.max(3, pct * 0.8) + '%';
    fillPayback.style.width  = Math.max(10, 85 - pct * 0.5) + '%';

    // Gradiente dinâmico do slider
    slider.style.background = `linear-gradient(to right, #ffcc00 0%, #ffcc00 ${pct}%, rgba(255,255,255,0.15) ${pct}%, rgba(255,255,255,0.15) 100%)`;
  };

  if (slider) {
    slider.addEventListener('input', updateSlider);
    updateSlider(); // initialize
  }

  /* ── 5. CONTACT FORM ── */
  window.handleFormSubmit = (e) => {
    e.preventDefault();
    const success = document.getElementById('form-success');
    const btn = document.getElementById('btn-submit-form');
    btn.textContent = 'Enviando...';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      btn.textContent = 'ENVIAR MENSAGEM →';
      btn.style.opacity = '1';
      success.classList.add('visible');
      e.target.reset();
      setTimeout(() => success.classList.remove('visible'), 4000);
    }, 1200);
  };

  /* ── 6. (Removido – newsletter) ── */

  /* ── 7. SMOOTH ACTIVE NAV ── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const activateNav = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--yellow)'
        : '';
    });
  };
  window.addEventListener('scroll', activateNav, { passive: true });

  /* ── 8. SERVICE CARD: Stagger entry ── */
  const cards = document.querySelectorAll('.service-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.06}s`;
  });

});
