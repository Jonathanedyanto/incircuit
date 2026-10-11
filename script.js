/* =========================================================
   PCB Design Lab - script.js
   Daftar isi:
   1. CONFIG (identitas yang mudah diubah)
   2. Penerapan identitas ke halaman
   3. Navbar & menu hamburger
   4. Scroll: navbar, menu aktif, tombol ke atas
   5. Animasi muncul saat digulir
   6. FAQ accordion
   7. Formulir: validasi & pesan WhatsApp
   ========================================================= */

(function () {
  'use strict';

  /* ==================== 1. CONFIG ==================== */
  /* ===== UBAH DI SINI: identitas perusahaan ===== */
  const CONFIG = {
    brandName: 'InCircuit',          // nama perusahaan
    whatsapp: '081295871024',            // nomor WhatsApp: awali 62, tanpa +, tanpa 0 di depan, tanpa spasi/strip
    email: 'Incircuit@gmail.com',            // alamat email
    instagram: 'InCircuit'  // username Instagram, tanpa @
  };
  /* ===== AKHIR BAGIAN YANG DIUBAH ===== */

  // Nilai bawaan di atas. Selama belum diganti, tombol kontak menampilkan peringatan
  // agar pesan tidak terkirim ke nomor orang lain secara tidak sengaja.
  const PLACEHOLDER = {
    whatsapp: '081295871024',
    instagram: 'username_instagram_anda'
  };

  const isWaInvalid = () =>
    CONFIG.whatsapp === PLACEHOLDER.whatsapp || !/^\d{9,15}$/.test(CONFIG.whatsapp);
  const isEmailPlaceholder = () => CONFIG.email === PLACEHOLDER.email;
  const isIgPlaceholder = () => CONFIG.instagram === PLACEHOLDER.instagram;

  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menandai bahwa JavaScript aktif (dipakai CSS untuk animasi)
  document.documentElement.classList.add('js');

  /* ==================== 2. PENERAPAN IDENTITAS ==================== */
  function waUrl(text) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text);
  }

  function applyIdentity() {
    // Nama perusahaan + judul tab
    $$('[data-brand]').forEach(function (el) { el.textContent = CONFIG.brandName; });
    document.title = CONFIG.brandName + ' | Jasa Desain PCB Profesional';

    // Tombol/tautan WhatsApp
    const defaultMessage = 'Halo ' + CONFIG.brandName + ', saya ingin berkonsultasi mengenai desain PCB.';
    $$('[data-wa]').forEach(function (a) {
      if (isWaInvalid()) {
        a.setAttribute('href', '#');
      } else {
        a.setAttribute('href', waUrl(defaultMessage));
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
      }
    });

    // Email
    $$('[data-email]').forEach(function (a) {
      a.setAttribute('href', isEmailPlaceholder() ? '#' : 'mailto:' + CONFIG.email);
    });
    $$('[data-email-text]').forEach(function (el) { el.textContent = CONFIG.email; });

    // Instagram
    $$('[data-ig]').forEach(function (a) {
      a.setAttribute('href', isIgPlaceholder() ? '#' : 'https://www.instagram.com/' + CONFIG.instagram + '/');
    });
    $$('[data-ig-text]').forEach(function (el) { el.textContent = '@' + CONFIG.instagram; });

    // Tahun hak cipta otomatis
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  // Peringatan jika identitas belum diganti (mencegah tautan palsu terbuka)
  document.addEventListener('click', function (e) {
    const wa = e.target.closest('[data-wa]');
    if (wa && isWaInvalid()) {
      e.preventDefault();
      alert('Nomor WhatsApp belum diatur.\n\nBuka script.js, lalu ubah CONFIG.whatsapp (contoh: 6281234567890).');
      return;
    }
    const mail = e.target.closest('[data-email]');
    if (mail && isEmailPlaceholder()) {
      e.preventDefault();
      alert('Alamat email belum diatur.\n\nBuka script.js, lalu ubah CONFIG.email.');
      return;
    }
    const ig = e.target.closest('[data-ig]');
    if (ig && isIgPlaceholder()) {
      e.preventDefault();
      alert('Username Instagram belum diatur.\n\nBuka script.js, lalu ubah CONFIG.instagram.');
    }
  });

  /* ==================== 3. NAVBAR & MENU HAMBURGER ==================== */
  const navbar = $('#navbar');
  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');

  function setMenu(open) {
    navMenu.classList.toggle('open', open);
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  }

  navToggle.addEventListener('click', function () {
    setMenu(!navMenu.classList.contains('open'));
  });

  // Menu tertutup otomatis setelah salah satu tautan diklik
  $$('a', navMenu).forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) setMenu(false);
  });

  /* ==================== 4. SCROLL ==================== */
  // Catatan: smooth scrolling untuk tautan menu diatur di style.css (scroll-behavior).
  const backToTop = $('#backToTop');
  const sections = $$('main section[id]');
  const navLinks = $$('.nav-link');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;

    navbar.classList.toggle('scrolled', y > 10);
    backToTop.classList.toggle('show', y > 600);

    // Tentukan bagian yang sedang tampil, lalu tandai menu yang sesuai
    let current = '';
    sections.forEach(function (section) {
      if (section.offsetTop <= y + 120) current = section.id;
    });
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) {
      current = 'kontak';
    }
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ==================== 5. ANIMASI MUNCUL ==================== */
  const revealItems = $$('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // animasi hanya sekali
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(function (item, index) {
      // Jeda kecil bertahap agar kartu muncul berurutan
      item.style.transitionDelay = (index % 4) * 80 + 'ms';
      observer.observe(item);
    });
  } else {
    // Browser lama: tampilkan semua langsung
    revealItems.forEach(function (item) { item.classList.add('visible'); });
  }

  /* ==================== 6. FAQ ACCORDION ==================== */
  const faqItems = $$('.faq-item');

  faqItems.forEach(function (item) {
    const button = $('.faq-question', item);
    button.addEventListener('click', function () {
      const willOpen = !item.classList.contains('open');

      // Tutup semua, lalu buka yang diklik (satu terbuka dalam satu waktu)
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        $('.faq-question', other).setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==================== 7. FORMULIR ==================== */
  const form = $('#contactForm');
  const formStatus = $('#formStatus');

  // Aturan validasi tiap kolom. Mengembalikan pesan error, atau '' jika valid.
  const validators = {
    name: function (v) {
      if (!v) return 'Nama wajib diisi.';
      if (v.length < 3) return 'Nama minimal 3 karakter.';
      return '';
    },
    email: function (v) {
      if (!v) return 'Email wajib diisi.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Format email belum benar. Contoh: nama@email.com';
      return '';
    },
    service: function (v) {
      if (!v) return 'Pilih salah satu jenis layanan.';
      return '';
    },
    message: function (v) {
      if (!v) return 'Deskripsi proyek wajib diisi.';
      if (v.length < 20) return 'Jelaskan proyek Anda minimal 20 karakter.';
      return '';
    }
  };

  function validateField(name) {
    const field = $('#' + name);
    const error = validators[name](field.value.trim());
    $('#' + name + 'Error').textContent = error;
    field.closest('.form-group').classList.toggle('has-error', Boolean(error));
    field.setAttribute('aria-invalid', error ? 'true' : 'false');
    return !error;
  }

  function setStatus(text, type) {
    formStatus.textContent = text;
    formStatus.classList.remove('success', 'error');
    if (type) formStatus.classList.add(type);
  }

  // Validasi ulang secara langsung setelah kolom pernah ditandai salah
  Object.keys(validators).forEach(function (name) {
    const field = $('#' + name);
    const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(eventName, function () {
      if (field.closest('.form-group').classList.contains('has-error')) validateField(name);
    });
    field.addEventListener('blur', function () {
      if (field.value.trim() !== '') validateField(name);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus('', '');

    // Periksa semua kolom
    const results = Object.keys(validators).map(function (name) {
      return { name: name, valid: validateField(name) };
    });
    const firstInvalid = results.find(function (r) { return !r.valid; });

    if (firstInvalid) {
      $('#' + firstInvalid.name).focus();
      setStatus('Periksa kembali kolom yang ditandai merah.', 'error');
      return;
    }

    if (isWaInvalid()) {
      setStatus('Nomor WhatsApp belum diatur. Buka script.js dan ubah CONFIG.whatsapp.', 'error');
      return;
    }

    // Susun pesan WhatsApp dari isi formulir
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const service = $('#service').value;
    const message = $('#message').value.trim();

    const text = [
      'Halo ' + CONFIG.brandName + ', saya ingin berkonsultasi mengenai desain PCB.',
      '',
      'Nama: ' + name,
      'Email: ' + email,
      'Jenis layanan: ' + service,
      '',
      'Deskripsi proyek:',
      message
    ].join('\n');

    window.open(waUrl(text), '_blank', 'noopener');

    setStatus('WhatsApp dibuka dengan pesan yang sudah terisi. Pesan baru terkirim setelah Anda menekan tombol kirim di WhatsApp.', 'success');
    form.reset();
  });

  /* ==================== MULAI ==================== */
  applyIdentity();
  onScroll();
})();