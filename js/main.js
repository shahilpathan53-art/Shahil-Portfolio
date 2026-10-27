/* ============================================================
   SHAHIL PATHAN — ELITE DEVELOPER PORTFOLIO v2.0
   Next-Generation JavaScript — All Interactions & Features
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // INITIALIZATION
  // ============================================================
  document.addEventListener('DOMContentLoaded', function () {
    initScrollProgress();
    initNavbar();
    initMobileNav();
    initSmoothScroll();
    initActiveSection();
    initRevealAnimations();
    initHeroAnimations();
    initHeroSphere();
    initAmbientCanvas();
    initCustomCursor();
    initMagneticButtons();
    initProjectFilters();
    initProjectModals();
    initTerminal();
    initContactForm();
    initCopyEmail();
    initBackToTop();
    initDynamicYear();
    initStatusWidget();
  });

  // ============================================================
  // SCROLL PROGRESS BAR
  // ============================================================
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }, { passive: true });
  }

  // ============================================================
  // NAVBAR
  // ============================================================
  function initNavbar() {
    var nav = document.querySelector('.navbar');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }

  // ============================================================
  // MOBILE NAV
  // ============================================================
  function initMobileNav() {
    var toggle = document.querySelector('.navbar__toggle');
    var menu = document.querySelector('.navbar__mobile-menu');
    if (!toggle || !menu) return;

    function close() {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      if (menu.classList.contains('open')) { close(); }
      else {
        toggle.classList.add('open');
        menu.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { close(); toggle.focus(); }
    });
  }

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#' || id === '#top') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        var t = document.querySelector(id);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  }

  // ============================================================
  // ACTIVE SECTION
  // ============================================================
  function initActiveSection() {
    var secs = document.querySelectorAll('section[id]');
    var links = document.querySelectorAll('.navbar__link');
    var mlinks = document.querySelectorAll('.navbar__mobile-link');
    if (!secs.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.getAttribute('id');
          links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + id); });
          mlinks.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + id); });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });
    secs.forEach(function (s) { obs.observe(s); });
  }

  // ============================================================
  // SCROLL REVEAL
  // ============================================================
  function initRevealAnimations() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (prefersReducedMotion()) { els.forEach(function (e) { e.classList.add('revealed'); }); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('revealed'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
    els.forEach(function (e) { obs.observe(e); });
  }

  // ============================================================
  // HERO ENTRANCE ANIMATIONS
  // ============================================================
  function initHeroAnimations() {
    var items = document.querySelectorAll('.anim-fade-up');
    if (!items.length) return;
    if (prefersReducedMotion()) { items.forEach(function (el) { el.classList.add('visible'); }); return; }
    items.forEach(function (el) {
      var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(function () { el.classList.add('visible'); }, delay);
    });
  }

  // ============================================================
  // HERO 3D WIREFRAME SPHERE (Canvas)
  // ============================================================
  function initHeroSphere() {
    var canvas = document.getElementById('hero-sphere');
    if (!canvas) return;
    if (prefersReducedMotion()) { canvas.style.display = 'none'; return; }

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    var mouseX = 0, mouseY = 0;
    var cx = size / 2, cy = size / 2, radius = size * 0.35;
    var rotX = 0, rotY = 0;
    var points = [];
    var lines = [];

    // Generate sphere points
    var rings = 12, segs = 18;
    for (var i = 0; i <= rings; i++) {
      var phi = (Math.PI * i) / rings;
      for (var j = 0; j < segs; j++) {
        var theta = (2 * Math.PI * j) / segs;
        points.push({
          x: Math.sin(phi) * Math.cos(theta),
          y: Math.cos(phi),
          z: Math.sin(phi) * Math.sin(theta)
        });
      }
    }
    // Connect adjacent points
    for (var i = 0; i <= rings; i++) {
      for (var j = 0; j < segs; j++) {
        var cur = i * segs + j;
        var next = i * segs + ((j + 1) % segs);
        if (cur < points.length && next < points.length) lines.push([cur, next]);
        var below = (i + 1) * segs + j;
        if (below < points.length) lines.push([cur, below]);
      }
    }

    // Mouse tracking
    document.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    var frameId;
    function draw() {
      ctx.clearRect(0, 0, size, size);
      rotY += 0.003 + mouseX * 0.002;
      rotX += 0.001 + mouseY * 0.001;

      var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      var cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      var projected = points.map(function (p) {
        var x1 = p.x * cosY - p.z * sinY;
        var z1 = p.x * sinY + p.z * cosY;
        var y1 = p.y * cosX - z1 * sinX;
        var z2 = p.y * sinX + z1 * cosX;
        var scale = 1 / (1 + z2 * 0.3);
        return { x: cx + x1 * radius * scale, y: cy + y1 * radius * scale, z: z2, scale: scale };
      });

      // Draw lines
      ctx.lineWidth = 0.5;
      lines.forEach(function (ln) {
        var a = projected[ln[0]], b = projected[ln[1]];
        if (!a || !b) return;
        var avgZ = (a.z + b.z) / 2;
        var alpha = Math.max(0.02, Math.min(0.2, 0.12 + avgZ * 0.08));
        ctx.strokeStyle = 'rgba(139, 92, 246, ' + alpha + ')';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      // Draw points
      projected.forEach(function (p) {
        var alpha = Math.max(0.05, Math.min(0.7, 0.35 + p.z * 0.35));
        var r = Math.max(0.8, 1.5 * p.scale);
        ctx.fillStyle = 'rgba(167, 139, 250, ' + alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      frameId = requestAnimationFrame(draw);
    }

    draw();

    // Pause when hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { cancelAnimationFrame(frameId); }
      else { draw(); }
    });
  }

  // ============================================================
  // AMBIENT CANVAS BACKGROUND
  // ============================================================
  function initAmbientCanvas() {
    var canvas = document.getElementById('ambient-canvas');
    if (!canvas || prefersReducedMotion()) { if (canvas) canvas.style.display = 'none'; return; }

    var ctx = canvas.getContext('2d');
    var w, h, particles = [];
    var count = Math.min(40, Math.floor(window.innerWidth / 30));

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', debounce(resize, 200));

    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.5 + 0.3
      });
    }

    var frameId;
    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.fillStyle = 'rgba(139, 92, 246, 0.12)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = 'rgba(139, 92, 246, ' + (0.03 * (1 - dist / 150)) + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      frameId = requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(frameId);
      else animate();
    });
  }

  // ============================================================
  // CUSTOM CURSOR
  // ============================================================
  function initCustomCursor() {
    if (prefersReducedMotion()) return;
    var cursor = document.querySelector('.cursor');
    if (!cursor) return;
    // Only for fine pointer devices
    if (!window.matchMedia('(pointer: fine)').matches) { cursor.style.display = 'none'; return; }

    var dot = cursor.querySelector('.cursor__dot');
    var ring = cursor.querySelector('.cursor__ring');
    var dotX = 0, dotY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function (e) {
      dotX = e.clientX; dotY = e.clientY;
    });

    function loop() {
      ringX += (dotX - ringX) * 0.12;
      ringY += (dotY - ringY) * 0.12;
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(loop);
    }
    loop();

    // Hover effects
    var hoverables = document.querySelectorAll('a, button, [role="button"], .project-card, .skills__tag, .contact__item, .github__repo, input, textarea');
    hoverables.forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('hovering'); });
    });
  }

  // ============================================================
  // MAGNETIC BUTTONS
  // ============================================================
  function initMagneticButtons() {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  // ============================================================
  // PROJECT FILTERS
  // ============================================================
  function initProjectFilters() {
    var filters = document.querySelectorAll('.projects__filter');
    var cards = document.querySelectorAll('.project-card');
    if (!filters.length) return;

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filters.forEach(function (f) { f.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');

        cards.forEach(function (card) {
          var tags = (card.getAttribute('data-tags') || '').split(',');
          if (filter === 'all' || tags.indexOf(filter) !== -1) {
            card.classList.remove('filtered-out');
            card.style.position = '';
            card.style.visibility = '';
          } else {
            card.classList.add('filtered-out');
            // After transition, truly hide
            setTimeout(function () {
              if (card.classList.contains('filtered-out')) {
                card.style.position = 'absolute';
                card.style.visibility = 'hidden';
              }
            }, 400);
          }
        });

        // Handle featured card grid span
        var grid = document.getElementById('projects-grid');
        if (grid) {
          var visibleCards = grid.querySelectorAll('.project-card:not(.filtered-out)');
          visibleCards.forEach(function (c) {
            if (c.classList.contains('project-card--featured')) {
              c.style.gridColumn = visibleCards.length === 1 ? 'span 1' : '';
            }
          });
        }
      });
    });
  }

  // ============================================================
  // PROJECT MODALS
  // ============================================================
  function initProjectModals() {
    var overlay = document.querySelector('.modal-overlay');
    var modal = overlay ? overlay.querySelector('.modal') : null;
    if (!overlay || !modal) return;

    var closeBtn = overlay.querySelector('.modal__close');
    var detailBtns = document.querySelectorAll('.project-card__link--details');

    var projectData = {
      1: { number: 'Project 01', title: 'Online Cycle Mart', category: 'PHP · MySQL · E-commerce', overview: 'An online bicycle shopping web application designed to provide a convenient browsing and shopping experience. The project uses PHP for server-side functionality and a responsive interface built with HTML, CSS, and Bootstrap. MySQL and phpMyAdmin support database management, while XAMPP provides the local development environment.', approach: 'Built with a traditional server-side architecture using PHP for backend logic and MySQL for data persistence. The frontend uses Bootstrap for responsive layouts, ensuring the application works well across different screen sizes.', features: ['Responsive bicycle shopping interface', 'Product browsing and presentation', 'Server-side functionality using PHP', 'Database-backed application architecture', 'Local development using XAMPP', 'Database administration using phpMyAdmin'], tech: ['PHP', 'HTML5', 'CSS3', 'Bootstrap', 'MySQL', 'XAMPP'], github: 'https://github.com/shahilpathan53-art/Cycle-Mart-PHP', learning: 'This project provided hands-on experience with PHP backend development, MySQL database management, and building responsive e-commerce interfaces.' },
      2: { number: 'Project 02', title: 'Cycle Sales System', category: 'MERN Stack · Full-Stack Web Development', overview: 'A full-stack bicycle sales application built with React, Node.js, Express.js, and MongoDB. The application is designed to let users browse bicycles and manage shopping-related interactions through a responsive interface backed by RESTful APIs.', approach: 'Implements a MERN stack architecture with a React frontend powered by Vite for fast development, RESTful API backend with Express.js, and MongoDB for flexible document-based data storage.', features: ['User registration and authentication', 'Bicycle browsing and product catalog', 'Cart and order management', 'Admin dashboard for managing products and orders', 'RESTful API integration', 'Responsive user interface'], tech: ['React', 'Vite', 'Node.js', 'Express.js', 'MongoDB', 'Bootstrap', 'HTML5', 'CSS3'], github: 'https://github.com/shahilpathan53-art/Cycle-Mart-React', learning: 'This project deepened my understanding of the MERN stack, RESTful API design, and building full-stack applications with modern JavaScript tools.' },
      3: { number: 'Project 03', title: 'Uber Management System', category: 'MEAN Stack · Management Application', overview: 'A full-stack ride-management web application concept built with Angular, TypeScript, Node.js, Express.js, and MongoDB. The project focuses on organizing ride-related records and providing a structured management interface.', approach: 'Uses the MEAN stack with Angular and TypeScript for a strongly-typed frontend, Express.js for API development, and MongoDB for flexible data storage.', features: ['User registration and authentication', 'Ride booking management', 'Admin dashboard for managing users and rides', 'RESTful API integration', 'Responsive, modular interface'], tech: ['Angular', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Bootstrap', 'HTML5', 'CSS3'], github: 'https://github.com/shahilpathan53-art/Angular-Uber', learning: 'Building with the MEAN stack helped me understand Angular\'s component architecture, TypeScript type safety, and differences between React and Angular approaches.' },
      4: { number: 'Project 04', title: 'RTO Management System', category: 'MERN Stack · Administrative Systems', overview: 'A vehicle and driving-license management application concept designed to organize transport-related records and administrative workflows. Built with React, Node.js, Express.js, and MongoDB.', approach: 'Features a React-based frontend for interactive admin interfaces, Express.js REST APIs for data operations, and MongoDB for storing vehicle and license records.', features: ['User registration and authentication', 'Vehicle registration management', 'Driving-license application and management', 'Administrative dashboard for managing users and records', 'RESTful API integration', 'Responsive interface'], tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Bootstrap', 'HTML5', 'CSS3'], github: 'https://github.com/shahilpathan53-art/RTO-Management-System', learning: 'This project strengthened my skills in building CRUD-heavy administrative applications and managing complex data relationships.' },
      5: { number: 'Project 05', title: 'Graduate Admission Prediction', category: 'Machine Learning · Python · Data Analysis', overview: 'A machine-learning-based web application that estimates graduate admission chances from academic and profile-related inputs. Uses a Linear Regression model and a Kaggle dataset.', approach: 'Built with Python and Flask, using Scikit-learn for model training. The dataset from Kaggle includes GRE score, TOEFL score, CGPA, and other academic indicators.', features: ['Admission prediction based on user inputs', 'Linear Regression model', 'Data preprocessing and visualization', 'Simple web interface built with Flask', 'Prediction results display'], tech: ['Python', 'Flask', 'Scikit-learn', 'NumPy', 'Pandas', 'Matplotlib', 'HTML', 'CSS'], github: 'https://github.com/shahilpathan53-art/Data-Analytics-Project', learning: 'This project introduced me to machine learning workflows including data preprocessing, model training, and deploying predictions through a web interface. Note: Predictions are estimates based on the trained model and dataset, not guarantees of actual university admission.' },
      6: { number: 'Additional Project', title: 'Music Store Database Analysis', category: 'MySQL · Data Analysis', overview: 'A database analysis project focused on exploring customer behavior and revenue trends in a music store dataset.', approach: 'Used MySQL to write analytical queries exploring customer behavior patterns, revenue trends, and sales data.', features: ['Analysis of customer behavior', 'Revenue trend exploration', 'Sales and marketing insights', 'SQL query design and optimization'], tech: ['MySQL'], github: 'https://github.com/shahilpathan53-art', learning: 'This project helped me practice writing complex SQL queries and understanding how database analysis can drive business decisions.' }
    };

    detailBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var d = projectData[this.getAttribute('data-project')];
        if (!d) return;
        modal.querySelector('.modal__number').textContent = d.number;
        modal.querySelector('.modal__title').textContent = d.title;
        modal.querySelector('.modal__category').textContent = d.category;
        modal.querySelector('#modal-overview').textContent = d.overview;
        modal.querySelector('#modal-approach').textContent = d.approach;
        modal.querySelector('#modal-learning').textContent = d.learning;

        var fc = modal.querySelector('#modal-features');
        fc.innerHTML = '';
        d.features.forEach(function (f) {
          var div = document.createElement('div');
          div.className = 'modal__feature';
          div.innerHTML = '<svg class="modal__feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>' + escapeHtml(f) + '</span>';
          fc.appendChild(div);
        });

        var tc = modal.querySelector('#modal-tech');
        tc.innerHTML = '';
        d.tech.forEach(function (t) {
          var span = document.createElement('span');
          span.className = 'modal__tech-tag';
          span.textContent = t;
          tc.appendChild(span);
        });

        var gl = modal.querySelector('#modal-github');
        if (gl) gl.href = d.github;

        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        var cb = overlay.querySelector('.modal__close');
        if (cb) cb.focus();
      });
    });

    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });
  }

  // ============================================================
  // INTERACTIVE TERMINAL
  // ============================================================
  function initTerminal() {
    var input = document.getElementById('terminal-input');
    var output = document.getElementById('terminal-output');
    var clearBtn = document.getElementById('terminal-clear-btn');
    if (!input || !output) return;

    var history = [];
    var historyIdx = -1;

    var commands = {
      help: function () {
        return [
          { type: 'heading', text: 'Available Commands:' },
          { type: 'output', text: '  help       — Show available commands' },
          { type: 'output', text: '  about      — About Shahil Pathan' },
          { type: 'output', text: '  skills     — Technical skills' },
          { type: 'output', text: '  projects   — View projects' },
          { type: 'output', text: '  education  — Academic journey' },
          { type: 'output', text: '  contact    — Contact information' },
          { type: 'output', text: '  github     — Open GitHub profile' },
          { type: 'output', text: '  linkedin   — Open LinkedIn profile' },
          { type: 'output', text: '  clear      — Clear terminal' }
        ];
      },
      about: function () {
        return [
          { type: 'heading', text: '▸ About Shahil Pathan' },
          { type: 'output', text: '  Software Developer & MCA Student' },
          { type: 'output', text: '  Focused on full-stack web development,' },
          { type: 'output', text: '  machine learning, and building practical' },
          { type: 'output', text: '  digital solutions.' },
          { type: 'output', text: '  Currently pursuing MCA at Uka Tarsadia University.' }
        ];
      },
      skills: function () {
        return [
          { type: 'heading', text: '▸ Technical Skills' },
          { type: 'output', text: '  Languages   : C, C++, Java, Python, Dart, JavaScript' },
          { type: 'output', text: '  Frontend    : HTML5, CSS3, Bootstrap, React.js, Angular' },
          { type: 'output', text: '  Backend     : Node.js, Express.js, PHP, Flask' },
          { type: 'output', text: '  Databases   : MySQL, SQLite, MongoDB' },
          { type: 'output', text: '  Tools       : Git, GitHub, VS Code, XAMPP, NPM' }
        ];
      },
      projects: function () {
        return [
          { type: 'heading', text: '▸ Projects (5+)' },
          { type: 'output', text: '  01. Online Cycle Mart       — PHP, MySQL' },
          { type: 'output', text: '  02. Cycle Sales System       — MERN Stack' },
          { type: 'output', text: '  03. Uber Management System   — MEAN Stack' },
          { type: 'output', text: '  04. RTO Management System    — MERN Stack' },
          { type: 'output', text: '  05. Admission Prediction     — Python, ML' },
          { type: 'output', text: '  06. Music Store DB Analysis  — MySQL' }
        ];
      },
      education: function () {
        return [
          { type: 'heading', text: '▸ Education' },
          { type: 'output', text: '  MCA — Uka Tarsadia University [Currently Pursuing]' },
          { type: 'output', text: '  BCA — VNSGU, Gujarat [Completed]' }
        ];
      },
      contact: function () {
        return [
          { type: 'heading', text: '▸ Contact' },
          { type: 'output', text: '  Email    : shahilpathan53@gmail.com' },
          { type: 'output', text: '  GitHub   : github.com/shahilpathan53-art' },
          { type: 'output', text: '  LinkedIn : linkedin.com/in/shahil-pathan-66a2a639a' }
        ];
      },
      github: function () {
        window.open('https://github.com/shahilpathan53-art', '_blank', 'noopener');
        return [{ type: 'output', text: '  Opening GitHub profile...' }];
      },
      linkedin: function () {
        window.open('https://www.linkedin.com/in/shahil-pathan-66a2a639a/', '_blank', 'noopener');
        return [{ type: 'output', text: '  Opening LinkedIn profile...' }];
      },
      clear: function () {
        output.innerHTML = '';
        return [];
      }
    };

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var cmd = input.value.trim().toLowerCase();
        input.value = '';
        if (!cmd) return;

        history.push(cmd);
        historyIdx = history.length;

        // Echo input
        addLine('input', cmd);

        if (commands[cmd]) {
          var lines = commands[cmd]();
          lines.forEach(function (ln, i) {
            setTimeout(function () { addLine(ln.type, ln.text); }, (i + 1) * 40);
          });
        } else {
          addLine('error', '  Command not found: ' + escapeHtml(cmd) + '. Type "help" for commands.');
        }

        // Auto-scroll
        setTimeout(function () { output.scrollTop = output.scrollHeight; }, 100);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIdx > 0) { historyIdx--; input.value = history[historyIdx]; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIdx < history.length - 1) { historyIdx++; input.value = history[historyIdx]; }
        else { historyIdx = history.length; input.value = ''; }
      }
    });

    function addLine(type, text) {
      var div = document.createElement('div');
      div.className = 'terminal__line terminal__line--' + type;
      div.textContent = text;
      output.appendChild(div);
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        output.innerHTML = '';
        addLine('system', 'Terminal cleared. Type "help" for commands.');
      });
    }
  }

  // ============================================================
  // CONTACT FORM
  // ============================================================
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.querySelectorAll('.form__group').forEach(function (g) { g.classList.remove('error'); });
      var name = form.querySelector('#contact-name');
      var email = form.querySelector('#contact-email');
      var subject = form.querySelector('#contact-subject');
      var message = form.querySelector('#contact-message');
      var valid = true;
      if (!name.value.trim()) { name.closest('.form__group').classList.add('error'); valid = false; }
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.closest('.form__group').classList.add('error'); valid = false; }
      if (!subject.value.trim()) { subject.closest('.form__group').classList.add('error'); valid = false; }
      if (!message.value.trim()) { message.closest('.form__group').classList.add('error'); valid = false; }
      if (!valid) return;
      var mailto = 'mailto:shahilpathan53@gmail.com?subject=' + encodeURIComponent(subject.value.trim()) + '&body=' + encodeURIComponent('Name: ' + name.value.trim() + '\nEmail: ' + email.value.trim() + '\n\n' + message.value.trim());
      window.location.href = mailto;
    });
  }

  // ============================================================
  // COPY EMAIL
  // ============================================================
  function initCopyEmail() {
    var el = document.getElementById('copy-email');
    if (!el) return;
    el.addEventListener('click', function () {
      navigator.clipboard.writeText('shahilpathan53@gmail.com').then(function () {
        var fb = el.querySelector('.contact__copy-feedback');
        if (fb) { fb.classList.add('show'); setTimeout(function () { fb.classList.remove('show'); }, 2000); }
      }).catch(function () {});
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  }

  // ============================================================
  // BACK TO TOP
  // ============================================================
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // ============================================================
  // DYNAMIC YEAR
  // ============================================================
  function initDynamicYear() {
    var el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ============================================================
  // STATUS WIDGET
  // ============================================================
  function initStatusWidget() {
    var widget = document.getElementById('status-widget');
    if (!widget) return;
    setTimeout(function () { widget.classList.add('visible'); }, 2000);
  }

  // ============================================================
  // UTILITIES
  // ============================================================
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }
})();
