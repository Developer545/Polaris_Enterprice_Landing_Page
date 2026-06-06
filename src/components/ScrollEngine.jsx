/* ============================================================
   POLARIS — Premium Scroll Animation Engine
   GSAP + ScrollTrigger + Lenis smooth scroll
   ============================================================ */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ── Lenis smooth scroll singleton ──────────────────────────── */
let lenisInstance = null;

function initLenis() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 1.5,
  });

  // Connect Lenis → GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

/* ── Hero parallax + staggered entrance ─────────────────────── */
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Staggered entrance on load
  tl.fromTo('.hero-meta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.1 })
    .fromTo('h1.display .line', { opacity: 0, y: 50, skewY: 2 }, { opacity: 1, y: 0, skewY: 0, duration: 0.8, stagger: 0.15 }, '-=0.3')
    .fromTo('.hero-sub-wrap', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
    .fromTo('.hero-cta .btn', { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 }, '-=0.3')
    .fromTo('.hero-trust-row .trust-item', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.2')
    .fromTo('.mockup-frame', { opacity: 0, y: 60, scale: 0.92, rotateX: 8 }, { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1, ease: 'power2.out' }, '-=0.8')
    .fromTo('.scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3');

  // Hero parallax on scroll
  gsap.to('.hero-grid > div:first-child', {
    y: -60,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  });

  gsap.to('.mockup-frame', {
    y: -100,
    scale: 0.95,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  });

  // Hero grid pattern fade on scroll
  gsap.to('.hero::before', {
    opacity: 0,
    scrollTrigger: {
      trigger: '.hero',
      start: '60% top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/* ── Marquee speed-up on scroll ─────────────────────────────── */
function animateMarquee() {
  gsap.fromTo('.marquee-wrap', {
    opacity: 0,
    y: 30,
  }, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    scrollTrigger: {
      trigger: '.marquee-wrap',
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });
}

/* ── Stats counter entrance ─────────────────────────────────── */
function animateStats() {
  gsap.fromTo('.stat-item', {
    opacity: 0,
    y: 40,
    scale: 0.9,
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.7,
    ease: 'back.out(1.4)',
    stagger: 0.12,
    scrollTrigger: {
      trigger: '.stats-section',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}

/* ── Logo wall stagger ──────────────────────────────────────── */
function animateLogoWall() {
  gsap.fromTo('.logo-tile', {
    opacity: 0,
    y: 25,
    scale: 0.92,
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.5,
    stagger: { each: 0.06, from: 'random' },
    scrollTrigger: {
      trigger: '.logo-wall',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

/* ── Section headers — cinematic text reveal ────────────────── */
function animateSectionHeads() {
  document.querySelectorAll('.section-head').forEach((head) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: head,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    });

    const num = head.querySelector('.num');
    const label = head.querySelector('.label');
    const display = head.querySelector('.display');
    const desc = head.querySelector('.desc');

    if (num) tl.fromTo(num, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4 });
    if (label) tl.fromTo(label, { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.3 }, '-=0.2');
    if (display) tl.fromTo(display, { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.out' }, '-=0.1');
    if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
  });
}

/* ── Bento grid — staggered cards with depth ────────────────── */
function animateBento() {
  gsap.fromTo('.bento-cell', {
    opacity: 0,
    y: 50,
    scale: 0.93,
    rotateX: 4,
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    duration: 0.7,
    ease: 'power2.out',
    stagger: { each: 0.1, from: 'start' },
    scrollTrigger: {
      trigger: '.bento',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}

/* ── 3D Showcase — staggered depth entrance ─────────────────── */
function animate3DShowcase() {
  gsap.fromTo('.float-3d-card', {
    opacity: 0,
    y: 80,
    rotateX: 15,
    scale: 0.85,
  }, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.float-3d-showcase',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

/* ── Module tiles — wave entrance ───────────────────────────── */
function animateModules() {
  gsap.fromTo('.module-tile', {
    opacity: 0,
    y: 40,
    x: -15,
  }, {
    opacity: 1,
    y: 0,
    x: 0,
    duration: 0.6,
    ease: 'power2.out',
    stagger: { each: 0.07, from: 'start', grid: 'auto', axis: 'y' },
    scrollTrigger: {
      trigger: '.modules-grid',
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
  });
}

/* ── Pricing packs — scale pop ──────────────────────────────── */
function animatePricing() {
  gsap.fromTo('.pack', {
    opacity: 0,
    y: 50,
    scale: 0.85,
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.6,
    ease: 'back.out(1.2)',
    stagger: 0.08,
    scrollTrigger: {
      trigger: '.pricing-grid',
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
  });
}

/* ── Quote cards — slide in from sides ──────────────────────── */
function animateQuotes() {
  document.querySelectorAll('.quote-card').forEach((card, i) => {
    const fromLeft = i % 2 === 0;
    gsap.fromTo(card, {
      opacity: 0,
      x: fromLeft ? -60 : 60,
      rotateY: fromLeft ? 6 : -6,
    }, {
      opacity: 1,
      x: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/* ── Comparison table — row-by-row reveal ───────────────────── */
function animateComparison() {
  const rows = document.querySelectorAll('.cmp-table tbody tr');
  if (!rows.length) return;

  gsap.fromTo(rows, {
    opacity: 0,
    x: -30,
  }, {
    opacity: 1,
    x: 0,
    duration: 0.4,
    stagger: 0.06,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.cmp-table',
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
  });
}

/* ── FAQ — accordion items slide ────────────────────────────── */
function animateFAQ() {
  gsap.fromTo('.faq-item', {
    opacity: 0,
    y: 25,
    x: -10,
  }, {
    opacity: 1,
    y: 0,
    x: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.faq-list',
      start: 'top 82%',
      toggleActions: 'play none none none',
    },
  });
}

/* ── Contact cards — slide up with rotation ─────────────────── */
function animateContact() {
  gsap.fromTo('.contact-card', {
    opacity: 0,
    y: 40,
    rotateX: 6,
    scale: 0.95,
  }, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-grid',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

/* ── Version cards — side-by-side slide ─────────────────────── */
function animateVersionCards() {
  const cards = document.querySelectorAll('.version-card');
  if (!cards.length) return;

  cards.forEach((card, i) => {
    gsap.fromTo(card, {
      opacity: 0,
      x: i === 0 ? -60 : 60,
      scale: 0.92,
    }, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/* ── CTA Final — dramatic entrance ──────────────────────────── */
function animateCTAFinal() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.cta-final',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });

  tl.fromTo('.cta-final .display', {
    opacity: 0,
    y: 50,
    scale: 0.9,
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: 'power3.out',
  })
  .fromTo('.cta-final p', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
  .fromTo('.cta-actions .btn', { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 }, '-=0.2')
  .fromTo('.post-cta span', { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.08 }, '-=0.1');
}

/* ── Footer — subtle rise ───────────────────────────────────── */
function animateFooter() {
  gsap.fromTo('.footer-grid > *', {
    opacity: 0,
    y: 25,
  }, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });
}

/* ── Horizontal parallax for chips ──────────────────────────── */
function animateChips() {
  document.querySelectorAll('.chip-row').forEach((row) => {
    gsap.fromTo(row.children, {
      opacity: 0,
      x: 20,
    }, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      stagger: 0.06,
      scrollTrigger: {
        trigger: row,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/* ── Nav scroll progress bar ────────────────────────────────── */
function animateNavProgress() {
  // Create a scroll progress indicator under the nav
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  const nav = document.querySelector('.nav');
  if (nav) {
    nav.appendChild(bar);
    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });
  }
}

/* ── MAIN HOOK — useScrollEngine ────────────────────────────── */
export function useScrollEngine() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Init Lenis smooth scroll
    const lenis = initLenis();

    // Small delay to ensure DOM is painted
    const rafId = requestAnimationFrame(() => {
      animateHero();
      animateMarquee();
      animateStats();
      animateLogoWall();
      animateSectionHeads();
      animateBento();
      animate3DShowcase();
      animateModules();
      animatePricing();
      animateQuotes();
      animateComparison();
      animateFAQ();
      animateContact();
      animateVersionCards();
      animateCTAFinal();
      animateFooter();
      animateChips();
      animateNavProgress();
    });

    return () => {
      cancelAnimationFrame(rafId);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
      }
    };
  }, []);
}
