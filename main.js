/* ══════════════════════════════════════════════════════════
   HUSTAD COMPANIES, INC. — MAIN JS
   ──────────────────────────────────────────────────────────
   WEB3FORMS SETUP (one-time, ~3 minutes):
   ① Sign up free at https://web3forms.com
   ② Create a form access key in the Web3Forms dashboard
   ③ Copy your access key → paste below as WEB3FORMS_ACCESS_KEY
   ④ Web3Forms will send notifications to the inbox configured in
      your Web3Forms account
   ══════════════════════════════════════════════════════════ */

/* ── Web3Forms Configuration ── */
const WEB3FORMS_ACCESS_KEY = 'a0a2cdcf-98b4-4fe2-96c1-05283188accc';
const NOTIFY_EMAIL         = 'aminul@hustadcompanies.com';
const WEB3FORMS_ENDPOINT   = 'https://api.web3forms.com/submit';
const WEB3FORMS_READY      = WEB3FORMS_ACCESS_KEY !== 'YOUR_ACCESS_KEY';

/* ════════════════════════════════════════════
   HERO SLIDESHOW — Ken Burns + crossfade
   ════════════════════════════════════════════ */
(function () {
  const slides   = document.querySelectorAll('.hero__slide');
  const dots     = document.querySelectorAll('.hero__dot');
  const INTERVAL = 6000;
  const FADE_DUR = 1400;

  if (!slides.length) return;

  let current = 0;
  let timer   = null;

  function goTo(index) {
    const prev = current;
    current = (index + slides.length) % slides.length;
    if (prev === current) return;

    slides[prev].classList.add('leaving');
    slides[prev].classList.remove('active');
    slides[current].classList.add('active');
    slides[current].classList.remove('leaving');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    setTimeout(() => slides[prev].classList.remove('leaving'), FADE_DUR + 100);
  }

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const startTimer  = () => { clearInterval(timer); timer = setInterval(next, INTERVAL); };
  const pauseTimer  = () => clearInterval(timer);

  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startTimer(); }));

  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', pauseTimer);
    hero.addEventListener('mouseleave', startTimer);

    let touchStartX = 0;
    hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); startTimer(); }
    }, { passive: true });
  }

  document.addEventListener('keydown', e => {
    if (!hero) return;
    const r = hero.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    if (e.key === 'ArrowRight') { next(); startTimer(); }
    if (e.key === 'ArrowLeft')  { prev(); startTimer(); }
  });

  startTimer();
})();

/* ════════════════════════════════════════════
   NAV — scroll state
   ════════════════════════════════════════════ */
(function () {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ════════════════════════════════════════════
   MOBILE HAMBURGER
   ════════════════════════════════════════════ */
(function () {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    links.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    btn.classList.remove('open');
    links.classList.remove('open');
    btn.setAttribute('aria-expanded', false);
  }));

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      btn.classList.remove('open');
      links.classList.remove('open');
    }
  });
})();

/* ════════════════════════════════════════════
   STICKY CTA — hide when contact in view
   ════════════════════════════════════════════ */
(function () {
  const sticky  = document.getElementById('stickyCta');
  const contact = document.getElementById('contact');
  if (!sticky || !contact) return;

  new IntersectionObserver(([e]) => {
    sticky.style.opacity      = e.isIntersecting ? '0' : '1';
    sticky.style.pointerEvents = e.isIntersecting ? 'none' : 'auto';
  }, { threshold: 0.1 }).observe(contact);
})();

/* ════════════════════════════════════════════
   SCROLL-REVEAL ANIMATIONS
   ════════════════════════════════════════════ */
(function () {
  const tagged = [
    { sel: '.card',                  cls: 'reveal',       stagger: true  },
    { sel: '.diff-card',             cls: 'reveal',       stagger: true  },
    { sel: '.scope-item',            cls: 'reveal',       stagger: true  },
    { sel: '.process-step__content', cls: 'reveal',       stagger: false },
    { sel: '.impact-item',           cls: 'reveal',       stagger: true  },
    { sel: '.section__header',       cls: 'reveal',       stagger: false },
    { sel: '.two-col__text',         cls: 'reveal-left',  stagger: false },
    { sel: '.two-col__visual',       cls: 'reveal-right', stagger: false },
    { sel: '.origin-block',          cls: 'reveal',       stagger: false },
  ];

  tagged.forEach(({ sel, cls, stagger }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add(cls);
      if (stagger) el.style.transitionDelay = `${(i % 4) * 80}ms`;
    });
  });

  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    .observe(...(Array.from(document.querySelectorAll('.reveal, .reveal-left, .reveal-right'))
      .map(el => { new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }).observe(el); return el; })));
})();

/* ════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
   ════════════════════════════════════════════ */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('nav').offsetHeight;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 8, behavior: 'smooth' });
    });
  });
})();

/* ════════════════════════════════════════════
   ACTIVE NAV LINK ON SCROLL
   ════════════════════════════════════════════ */
(function () {
  const sections = ['why-storm', 'why-hustad', 'what-we-deliver', 'contact'];
  const navLinks = document.querySelectorAll('.nav__links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 88) current = id;
    });
    navLinks.forEach(a => {
      const href   = a.getAttribute('href').replace('#', '');
      const active = href === current;
      a.style.color      = active ? 'var(--amber-lt)' : '';
      a.style.background = active ? 'rgba(232,146,10,.1)' : '';
    });
  }, { passive: true });
})();

/* ════════════════════════════════════════════
   STAT COUNTER ANIMATION
   ════════════════════════════════════════════ */
(function () {
  const stats = [
    { sel: '.stat:nth-child(1) .stat__num', target: 1973, from: 1950, suffix: ''  },
    { sel: '.stat:nth-child(3) .stat__num', target: 50,   from: 0,    suffix: '+' },
    { sel: '.stat:nth-child(5) .stat__num', target: 100,  from: 0,    suffix: '%' },
  ];

  let animated = false;
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCounters() {
    if (animated) return;
    animated = true;
    stats.forEach(({ sel, target, from, suffix }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const start = Date.now(), dur = 1400;
      const tick = () => {
        const p = Math.min((Date.now() - start) / dur, 1);
        const value = Math.round(from + (target - from) * easeOut(p));
        el.textContent = target >= 1000 && !suffix ? String(value) + suffix : value.toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) new IntersectionObserver(([e]) => { if (e.isIntersecting) animateCounters(); }, { threshold: 0.5 }).observe(heroStats);
})();

/* ════════════════════════════════════════════
   CONTACT FORM — validation + Web3Forms send
   ════════════════════════════════════════════ */
(function () {
  const form        = document.getElementById('contactForm');
  const successEl   = document.getElementById('formSuccess');
  const errorEl     = document.getElementById('formError');
  const errorText   = document.getElementById('formErrorText');
  const submitBtn   = document.getElementById('submitBtn');
  const submitLabel = document.getElementById('submitLabel');
  const spinner     = document.getElementById('submitSpinner');
  const tsField     = document.getElementById('submittedAt');
  if (!form) return;

  const rules = {
    firstName: { required: true,  label: 'First name' },
    lastName:  { required: true,  label: 'Last name'  },
    company:   { required: true,  label: 'Company name' },
    email:     { required: true,  label: 'Email address', isEmail: true },
  };

  const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const formatDetail = (label, value) => `${label}: ${value}`;

  function buildAssessmentPayload(data) {
    const now = data.now || new Date();
    const submittedAtLocal = now.toLocaleString('en-US', {
      weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
    });
    const submittedAtIso = now.toISOString();
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const requestType = 'Assessment Request';
    const emailSubject = `New ${requestType} from ${fullName || 'Website Visitor'} - ${submittedAtLocal}`;
    const requestSummary = [
      formatDetail('Request Type', requestType),
      formatDetail('Recipient', NOTIFY_EMAIL),
      formatDetail('Submitted By', fullName || 'Not provided'),
      formatDetail('Email', data.email || 'Not provided'),
      formatDetail('Phone', data.phone || 'Not provided'),
      formatDetail('Company / Organization', data.company || 'Not provided'),
      formatDetail('Number of Properties', data.propertyCount || 'Not specified'),
      formatDetail('Submitted At', submittedAtLocal),
      formatDetail('Submitted At (ISO)', submittedAtIso),
      formatDetail('Additional Context', data.message || 'No additional context provided.'),
    ].join('\n');

    return {
      submittedAtLocal,
      submittedAtIso,
      templateParams: {
        access_key:       WEB3FORMS_ACCESS_KEY,
        subject:          emailSubject,
        from_name:        'Hustad Website',
        to_email:         NOTIFY_EMAIL,
        recipient_email:  NOTIFY_EMAIL,
        sender_name:      fullName || 'Website Visitor',
        from_email:       data.email || 'Not provided',
        reply_to:         data.email || 'Not provided',
        company:          data.company || 'Not provided',
        phone:            data.phone || 'Not provided',
        property_count:   data.propertyCount || 'Not specified',
        message:          data.message || 'No additional context provided.',
        request_type:     requestType,
        email_subject:    emailSubject,
        request_summary:  requestSummary,
        submitted_at:     submittedAtLocal,
        submitted_at_iso: submittedAtIso,
        botcheck:         '',
      }
    };
  }

  async function sendAssessmentEmail(templateParams) {
    if (!WEB3FORMS_READY) {
      console.warn(
        '[Hustad] Web3Forms not configured. Set WEB3FORMS_ACCESS_KEY in main.js.\n',
        'Form data that would have been sent:', templateParams
      );
      return { simulated: true };
    }

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(templateParams),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || `Web3Forms status ${response.status}`);
    }

    return result;
  }

  function validateField(name, value) {
    const r = rules[name];
    if (!r) return '';
    if (r.required && !value.trim()) return `${r.label} is required.`;
    if (r.isEmail && value.trim() && !isValidEmail(value)) return 'Enter a valid email address.';
    return '';
  }

  function showFieldError(name, msg) {
    const el  = form.elements[name];
    const err = document.getElementById(name + 'Error');
    if (el)  el.classList.toggle('error', !!msg);
    if (err) err.textContent = msg;
  }

  /* Live validation */
  Object.keys(rules).forEach(name => {
    const el = form.elements[name];
    if (!el) return;
    el.addEventListener('blur',  () => showFieldError(name, validateField(name, el.value)));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) showFieldError(name, validateField(name, el.value));
    });
  });

  /* Submit */
  form.addEventListener('submit', async e => {
    e.preventDefault();

    /* Validate all fields */
    let valid = true;
    Object.keys(rules).forEach(name => {
      const el  = form.elements[name];
      const msg = validateField(name, el ? el.value : '');
      showFieldError(name, msg);
      if (msg) valid = false;
    });
    if (!valid) return;

    /* Show spinner */
    submitBtn.disabled       = true;
    submitLabel.textContent  = 'Sending…';
    spinner.classList.remove('hidden');
    errorEl.classList.add('hidden');

    /* Collect form data */
    const firstName     = form.elements.firstName.value.trim();
    const lastName      = form.elements.lastName.value.trim();
    const company       = form.elements.company.value.trim();
    const email         = form.elements.email.value.trim();
    const phone         = form.elements.phone?.value.trim() || 'Not provided';
    const propertyCount = form.elements.propertyCount?.value || 'Not specified';
    const message       = form.elements.message?.value.trim() || 'No additional context provided.';
    const { submittedAtLocal, templateParams } = buildAssessmentPayload({
      firstName,
      lastName,
      company,
      email,
      phone,
      propertyCount,
      message,
    });
    if (tsField) tsField.value = submittedAtLocal;

    try {
      await sendAssessmentEmail(templateParams);
      if (!WEB3FORMS_READY) await new Promise(r => setTimeout(r, 1200));
      showSuccess();
    } catch (err) {
      console.error('[Hustad] Email send failed:', err);
      submitBtn.disabled      = false;
      submitLabel.textContent = 'Request Assessment';
      spinner.classList.add('hidden');
      errorEl.classList.remove('hidden');
      if (errorText) {
        errorText.textContent = 'Unable to send your request right now. Please call us directly at 608-224-0990 or email will.moore@hustadcompanies.com.';
      }
    }
  });

  function showSuccess() {
    /* Hide all form sections */
    form.querySelectorAll('.form-group, .form-row, .form-footer, input[type="hidden"]')
      .forEach(el => (el.style.display = 'none'));
    errorEl.classList.add('hidden');
    successEl.classList.remove('hidden');
  }

  window.triggerSampleAssessmentEmail = async function triggerSampleAssessmentEmail() {
    const { templateParams } = buildAssessmentPayload({
      firstName: 'Jordan',
      lastName: 'Keller',
      company: 'Summit Property Group',
      email: 'jordan.keller@example.com',
      phone: '(608) 555-0148',
      propertyCount: '6-20',
      message: 'Requesting an exterior assessment after yesterday\'s hail event for three Madison-area properties. Please include roof, siding, gutters, and window-screen observations.',
      now: new Date(),
    });

    try {
      const result = await sendAssessmentEmail(templateParams);
      console.info('[Hustad] Sample assessment email processed.', result, templateParams);
      return { ok: true, result, templateParams };
    } catch (err) {
      console.error('[Hustad] Sample assessment email failed.', err, templateParams);
      return { ok: false, error: err, templateParams };
    }
  };
})();
