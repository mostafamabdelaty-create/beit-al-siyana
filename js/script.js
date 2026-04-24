document.addEventListener('DOMContentLoaded', () => {
  const AR = {
    loading: '\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0645\u064a\u0644...',
    noTechsInSection: '\u0644\u0627 \u064a\u0648\u062c\u062f \u0641\u0646\u064a\u0648\u0646 \u062d\u0627\u0644\u064a\u0627\u064b \u0641\u064a \u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645.',
    loadError: '\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a.',
    trusted: '\u0647\u0648\u064a\u0629 \u0645\u0648\u062b\u0642\u0629',
    whatsapp: '\u0648\u0627\u062a\u0633\u0627\u0628',
    call: '\u0627\u062a\u0635\u0627\u0644',
    experience: '\u062e\u0628\u0631\u0629',
    year: '\u0633\u0646\u0629',
    new: '\u062c\u062f\u064a\u062f',
    reviews: '\u062a\u0642\u064a\u064a\u0645',
    defaultTechBio: '\u0645\u062a\u062e\u0635\u0635 \u0641\u064a \u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u062a\u0623\u0633\u064a\u0633 \u0648\u0627\u0644\u0635\u064a\u0627\u0646\u0629 \u0628\u0627\u062d\u062a\u0631\u0627\u0641\u064a\u0629.',
    defaultProfileBio: '\u0641\u0646\u064a \u0645\u062a\u062e\u0635\u0635 \u0641\u064a \u062a\u0642\u062f\u064a\u0645 \u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0635\u064a\u0627\u0646\u0629 \u0648\u0625\u0635\u0644\u0627\u062d \u0627\u0644\u0623\u0639\u0637\u0627\u0644 \u0628\u062f\u0642\u0629 \u0648\u0627\u062d\u062a\u0631\u0627\u0641\u064a\u0629.',
    defaultLocation: '\u063a\u064a\u0631 \u0645\u062d\u062f\u062f',
    maintenanceServices: '\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0635\u064a\u0627\u0646\u0629 \u0627\u0644\u0641\u0648\u0631\u064a\u0629',
    loginProcessing: '\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0642\u0642...',
    newsletterDone: '\u062a\u0645 \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643 \u0628\u0646\u062c\u0627\u062d!',
    profileTitleBase: '\u0628\u064a\u062a \u0627\u0644\u0635\u064a\u0627\u0646\u0629 | \u0641\u0646\u064a\u0648\u0646',
    techniciansTitle: '\u0641\u0646\u064a\u0648\u0646'
  };

  const serviceNames = {
    plumbing: '\u0627\u0644\u0633\u0628\u0627\u0643\u0629',
    carpentry: '\u0627\u0644\u0646\u062c\u0627\u0631\u0629',
    paint: '\u0627\u0644\u062f\u0647\u0627\u0646\u0627\u062a',
    electricity: '\u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0621',
    flooring: '\u0627\u0644\u0623\u0631\u0636\u064a\u0627\u062a',
    finishing: '\u0627\u0644\u062a\u0634\u0637\u064a\u0628'
  };

  const serviceSearchMap = {
    plumbing: '\u0633\u0628\u0627\u0643\u0629',
    carpentry: '\u0646\u062c\u0627\u0631\u0629',
    paint: '\u062f\u0647\u0627\u0646\u0627\u062a',
    electricity: '\u0643\u0647\u0631\u0628\u0627\u0621',
    flooring: '\u0623\u0631\u0636\u064a\u0627\u062a',
    finishing: '\u062a\u0634\u0637\u064a\u0628'
  };

  const periodLabels = {
    monthly: '\u0634\u0647\u0631\u064a\u064b\u0627',
    quarterly: '\u0631\u0628\u0639 \u0633\u0646\u0648\u064a',
    yearly: '\u0633\u0646\u0648\u064a',
    one_time: '\u0645\u0631\u0629 \u0648\u0627\u062d\u062f\u0629',
    days: '\u064a\u0648\u0645'
  };

  // Set Active Navigation Link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath && linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  // Update Auth Gate Links
  const userToken = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const navCta = document.querySelector('.nav-cta');

  if (userToken && navCta) {
    navCta.innerText = userRole === 'admin' ? 'لوحة التحكم' : 'حسابي';
    if (userRole === 'customer') navCta.href = 'customer-profile.html';
    else if (userRole === 'technician') navCta.href = 'technician-dashboard.html';
    else if (userRole === 'admin') navCta.href = 'admin-dashboard.html';
  }

  document.querySelectorAll('.auth-gate-link').forEach(btn => {
    if (!userToken) {
      btn.innerText = 'تسجيل دخول لطلب خدمة';
      btn.href = 'login.html';
    }
  });

  const normalizeDigits = (value) => String(value || '').replace(/\D/g, '');

  const resolvePlanTheme = (plan) => {
    const themeKey = plan?.themeKey || 'starter';
    const defaults = {
      starter: {
        accentColor: '#3b82f6',
        gradientFrom: '#eff6ff',
        gradientTo: '#dbeafe',
        className: 'plan-theme-starter'
      },
      professional: {
        accentColor: '#2563eb',
        gradientFrom: '#dbeafe',
        gradientTo: '#bfdbfe',
        className: 'plan-theme-professional'
      },
      premium: {
        accentColor: '#7c3aed',
        gradientFrom: '#f3e8ff',
        gradientTo: '#e9d5ff',
        className: 'plan-theme-premium'
      },
      custom: {
        accentColor: '#0f766e',
        gradientFrom: '#ccfbf1',
        gradientTo: '#99f6e4',
        className: 'plan-theme-custom'
      }
    };

    const base = defaults[themeKey] || defaults.starter;
    return {
      accentColor: plan?.style?.accentColor || base.accentColor,
      gradientFrom: plan?.style?.gradientFrom || base.gradientFrom,
      gradientTo: plan?.style?.gradientTo || base.gradientTo,
      className: base.className
    };
  };

  const applyProfilePlanTheme = (plan, isTrusted) => {
    const profileHero = document.querySelector('.profile-hero');
    const contactBar = document.querySelector('.profile-contact-bar');
    const planBadge = document.getElementById('planBadgePill');
    const verifiedPill = document.getElementById('verifiedPill');

    if (!profileHero) return;

    const theme = resolvePlanTheme(plan);
    profileHero.style.setProperty('--plan-accent', theme.accentColor);
    profileHero.style.setProperty('--plan-grad-from', theme.gradientFrom);
    profileHero.style.setProperty('--plan-grad-to', theme.gradientTo);
    if (contactBar) {
      contactBar.style.setProperty('--plan-accent', theme.accentColor);
      contactBar.style.setProperty('--plan-grad-from', theme.gradientFrom);
      contactBar.style.setProperty('--plan-grad-to', theme.gradientTo);
    }

    profileHero.classList.remove('plan-theme-starter', 'plan-theme-professional', 'plan-theme-premium', 'plan-theme-custom');
    profileHero.classList.add(theme.className);

    if (planBadge) {
      if (plan?.name) {
        planBadge.style.display = 'inline-flex';
        planBadge.style.background = theme.gradientFrom;
        planBadge.style.color = theme.accentColor;
        planBadge.style.borderColor = theme.accentColor;
        planBadge.textContent = plan.badgeText || plan.name;
      } else {
        planBadge.style.display = 'none';
      }
    }

    if (verifiedPill) {
      verifiedPill.style.display = isTrusted ? 'inline-flex' : 'none';
    }

    // New: Handle conditional visibility of cards
    const galleryCard = document.getElementById('galleryCard');
    const videosCard = document.getElementById('videosCard');
    
    if (galleryCard) {
      galleryCard.style.display = plan?.benefits?.workImages ? 'block' : 'none';
    }
    if (videosCard) {
      videosCard.style.display = plan?.benefits?.workVideos ? 'block' : 'none';
    }
  };

  // ==========================================
  // Mobile Menu Toggle
  // ==========================================
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // Scroll Animations
  // ==========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  window.aosObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        window.aosObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-aos]').forEach((element) => {
    const delay = element.getAttribute('data-aos-delay');
    if (delay) element.style.transitionDelay = `${delay}ms`;
    window.aosObserver.observe(element);
  });

  // ==========================================
  // Active Navbar Link on Scroll
  // ==========================================
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) current = section.getAttribute('id');
    });

    navItems.forEach((item) => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) item.classList.add('active');
    });

    const header = document.querySelector('.header');
    if (header) {
      header.style.boxShadow = window.scrollY > 50
        ? '0 4px 6px -1px rgba(0,0,0,0.4)'
        : '0 4px 6px -1px rgba(0,0,0,0.2)';
    }
  });

  // ==========================================
  // Home Services Cards Navigation
  // ==========================================
  const homeServiceCards = document.querySelectorAll('#services .service-card[data-service]');
  homeServiceCards.forEach((card) => {
    card.style.cursor = 'pointer';
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');

    const navigateToTechnicians = () => {
      const serviceKey = card.getAttribute('data-service');
      if (!serviceKey) return;
      window.location.href = `technicians.html?service=${encodeURIComponent(serviceKey)}`;
    };

    card.addEventListener('click', navigateToTechnicians);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        navigateToTechnicians();
      }
    });
  });

  // ==========================================
  // Services Page Filter
  // ==========================================
  const filterBtn = document.getElementById('filterBtn');
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      const govFilter = document.getElementById('govFilter').value;
      const ratingFilter = document.getElementById('ratingFilter').value;
      const expFilter = document.getElementById('expFilter').value;

      const techCards = document.querySelectorAll('.tech-card');
      let visibleCount = 0;

      techCards.forEach((card) => {
        let isMatch = true;
        const ratingText = card.querySelector('.tech-meta .rating')?.textContent || '';
        const ratingValue = parseFloat((ratingText.match(/[\d.]+/) || ['0'])[0]);

        let experienceValue = 0;
        const locationSpan = card.querySelector('.tech-meta span i.fa-map-marker-alt')?.parentElement;
        const locationText = locationSpan?.textContent || '';
        const allMeta = card.querySelectorAll('.tech-meta span');
        allMeta.forEach((span) => {
          const text = span.textContent || '';
          if (text.includes(AR.experience)) {
            const match = text.match(/[\d.]+/);
            if (match) experienceValue = parseFloat(match[0]);
          }
        });

        if (govFilter !== 'all' && !locationText.includes(govFilter)) isMatch = false;
        if (ratingFilter !== 'all' && ratingValue < parseFloat(ratingFilter)) isMatch = false;
        if (expFilter !== 'all' && experienceValue < parseFloat(expFilter)) isMatch = false;

        if (isMatch) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 100);
          visibleCount += 1;
        } else {
          card.style.display = 'none';
        }
      });

      const noResults = document.getElementById('noResultsMsg');
      if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      document.querySelector('.tech-grid-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ==========================================
  // Technicians Page Dynamic Content
  // ==========================================
  const serviceTitle = document.getElementById('serviceTitle');
  const techGrid = document.getElementById('techGrid');

  if (techGrid && serviceTitle) {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceKey = urlParams.get('service') || 'plumbing';
    serviceTitle.innerText = `${AR.techniciansTitle} ${serviceNames[serviceKey] || '\u0627\u0644\u0635\u064a\u0627\u0646\u0629'}`;
    document.title = `${AR.profileTitleBase} ${serviceNames[serviceKey] || '\u0627\u0644\u0635\u064a\u0627\u0646\u0629'}`;

    const searchTerm = serviceSearchMap[serviceKey] || serviceSearchMap.plumbing;

    const loadTechnicians = async () => {
      techGrid.innerHTML = `<div class="loading-state" style="grid-column: 1/-1; text-align: center;">${AR.loading}</div>`;

      try {
        const response = await fetch(`/api/technicians/service/${encodeURIComponent(searchTerm)}`);
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          techGrid.innerHTML = '';
          result.data.forEach((tech, index) => {
            const theme = resolvePlanTheme(tech.plan);
            const card = document.createElement('div');
            card.className = `tech-card ${theme.className}`;
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index + 1) * 100);
            card.onclick = () => { window.location = `technician-profile.html?id=${tech.id}`; };
            card.style.setProperty('--plan-accent', theme.accentColor);
            card.style.setProperty('--plan-grad-from', theme.gradientFrom);
            card.style.setProperty('--plan-grad-to', theme.gradientTo);

            const waNumber = normalizeDigits(tech.whatsapp || tech.phone || '');
            const phone = tech.phone || '';
            const planBadge = tech.plan
              ? `<span class="plan-badge" style="background:${theme.gradientFrom}; color:${theme.accentColor}; border-color:${theme.accentColor};">${tech.plan.badgeText || tech.plan.name}</span>`
              : '';
            const verifiedBadge = tech.isTrusted
              ? `<span class="verified-badge"><i class="fas fa-check-circle"></i> ${AR.trusted}</span>`
              : '';

            const authActions = userToken 
              ? `
                <a href="https://wa.me/${waNumber}" target="_blank" class="btn-whatsapp" onclick="event.stopPropagation();"><i class="fab fa-whatsapp" style="font-size: 1.2rem;"></i> ${AR.whatsapp}</a>
                <a href="tel:${phone}" class="btn-call" onclick="event.stopPropagation();"><i class="fas fa-phone-alt"></i> ${AR.call}</a>
              `
              : `
                <a href="login.html" class="btn-call" style="background:#111827; width:100%; justify-content:center;" onclick="event.stopPropagation();"><i class="fas fa-lock"></i> تسجيل دخول للتواصل</a>
              `;

            card.innerHTML = `
              <img src="${tech.profileImage ? tech.profileImage : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" alt="${tech.name}" class="tech-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/149/149071.png'">
              <div class="tech-content">
                <div class="tech-header-info">
                  <h3 class="tech-name">${tech.name}</h3>
                  <div class="tech-badges">${planBadge}${verifiedBadge}</div>
                </div>
                <div class="tech-meta">
                  <span class="rating"><i class="fas fa-star"></i> ${tech.rating || AR.new} (${tech.reviewsCount || '0'} ${AR.reviews})</span>
                  <span><i class="far fa-clock"></i> ${AR.experience} ${tech.experience || 0} ${AR.year}</span>
                  <span><i class="fas fa-map-marker-alt"></i> ${tech.location || AR.defaultLocation}</span>
                </div>
                <p class="tech-desc">${tech.bio || AR.defaultTechBio}</p>
                <div class="tech-actions">
                  ${authActions}
                </div>
              </div>
            `;


            techGrid.appendChild(card);
            if (window.aosObserver) window.aosObserver.observe(card);
          });
        } else {
          techGrid.innerHTML = `<div style="text-align: center; width: 100%; grid-column: 1 / -1; padding: 40px; color: #64748b;">${AR.noTechsInSection}</div>`;
        }
      } catch (error) {
        console.error('Error loading technicians:', error);
        techGrid.innerHTML = `<div style="text-align: center; width: 100%; grid-column: 1 / -1; padding: 40px; color: #ef4444;">${AR.loadError}</div>`;
      }
    };

    loadTechnicians();
  }

  // ==========================================
  // Technician Profile Page Dynamic Content
  // ==========================================
  const profName = document.getElementById('profName');
  if (profName) {
    const urlParams = new URLSearchParams(window.location.search);
    const techId = urlParams.get('id');

    const loadProfile = async (id) => {
      try {
        const response = await fetch(`/api/technicians/${id}`);
        const result = await response.json();

        if (result.success && result.data) {
          const techData = result.data;
          const ratingValue = techData.rating ?? techData.averageRating ?? AR.new;
          const reviewsCount = techData.reviewsCount ?? techData.totalReviews ?? '0';

          profName.innerText = techData.name || '';
          document.getElementById('profRating').innerText = ratingValue;
          document.getElementById('profReviewsCount').innerText = reviewsCount;
          document.getElementById('profExp').innerText = techData.experience || 0;
          document.getElementById('profLoc').innerText = techData.location || AR.defaultLocation;
          document.getElementById('profShortDesc').innerText = techData.bio || AR.defaultProfileBio;

          const defaultImage = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // Professional fallback
          const profImg = document.getElementById('profImg');
          profImg.src = techData.photo || techData.profileImage || defaultImage;
          profImg.alt = techData.name || '';
          
          // Add error handler for broken images
          profImg.onerror = function() {
            this.src = defaultImage;
          };

          // Handle Contact Locking based on Auth
          const userToken = localStorage.getItem('token');
          const profCallBtn = document.getElementById('profCallBtn');
          const profWaBtn = document.getElementById('profWaBtn');
          const profLoginBtn = document.getElementById('profLoginBtn');
          const sideCallBtn = document.getElementById('sideCallBtn');
          const sideWaBtn = document.getElementById('sideWaBtn');
          const sideLoginBtn = document.getElementById('sideLoginBtn');
          
          // New CTA & Floating Buttons
          const ctaCallBtn = document.getElementById('ctaCallBtn');
          const ctaWaBtn = document.getElementById('ctaWaBtn');
          const ctaLoginBtn = document.getElementById('ctaLoginBtn');
          const floatingCall = document.getElementById('floatingCall');
          const floatingWhatsapp = document.getElementById('floatingWhatsapp');
          const floatingLogin = document.getElementById('floatingLogin');

          const contactLockedMsg = document.getElementById('contactLockedMsg');
          const sidebarLockedMsg = document.getElementById('sidebarLockedMsg');

          if (!userToken) {
            // Not logged in - Lock everything
            if (profCallBtn) profCallBtn.style.display = 'none';
            if (profWaBtn) profWaBtn.style.display = 'none';
            if (profLoginBtn) profLoginBtn.style.display = 'inline-flex';
            if (sideCallBtn) sideCallBtn.style.display = 'none';
            if (sideWaBtn) sideWaBtn.style.display = 'none';
            if (sideLoginBtn) sideLoginBtn.style.display = 'flex';
            
            if (ctaCallBtn) ctaCallBtn.style.display = 'none';
            if (ctaWaBtn) ctaWaBtn.style.display = 'none';
            if (ctaLoginBtn) ctaLoginBtn.style.display = 'inline-flex';
            
            if (floatingCall) floatingCall.style.display = 'none';
            if (floatingWhatsapp) floatingWhatsapp.style.display = 'none';
            if (floatingLogin) floatingLogin.style.display = 'flex';

            if (contactLockedMsg) contactLockedMsg.style.display = 'block';
            if (sidebarLockedMsg) sidebarLockedMsg.style.display = 'block';
          } else {
            // Logged in - Show info
            const phoneDigits = normalizeDigits(techData.phone || '');
            const waMsg = encodeURIComponent(`مرحباً ${techData.name || ''} ، أريد الاستفسار عن خدمة من بيت الصيانة`);
            
            if (profCallBtn) {
              profCallBtn.style.display = 'inline-flex';
              profCallBtn.href = `tel:${techData.phone || ''}`;
            }
            if (profWaBtn) {
              profWaBtn.style.display = 'inline-flex';
              profWaBtn.href = `https://wa.me/${phoneDigits}?text=${waMsg}`;
            }
            if (sideCallBtn) {
              sideCallBtn.style.display = 'inline-flex';
              sideCallBtn.href = `tel:${techData.phone || ''}`;
            }
            if (sideWaBtn) {
              sideWaBtn.style.display = 'inline-flex';
              sideWaBtn.href = `https://wa.me/${phoneDigits}?text=${waMsg}`;
            }
            if (ctaCallBtn) {
              ctaCallBtn.style.display = 'inline-flex';
              ctaCallBtn.href = `tel:${techData.phone || ''}`;
            }
            if (ctaWaBtn) {
              ctaWaBtn.style.display = 'inline-flex';
              ctaWaBtn.href = `https://wa.me/${phoneDigits}?text=${waMsg}`;
            }
            if (floatingCall) {
              floatingCall.style.display = 'flex';
              floatingCall.href = `tel:${techData.phone || ''}`;
            }
            if (floatingWhatsapp) {
              floatingWhatsapp.style.display = 'flex';
              floatingWhatsapp.href = `https://wa.me/${phoneDigits}?text=${waMsg}`;
            }

            // ADMIN SPECIAL TOOLS
            if (userRole === 'admin') {
              const profileBar = document.getElementById('profileContactBar');
              if (profileBar) {
                const adminBtn = document.createElement('a');
                adminBtn.href = 'admin-dashboard.html';
                adminBtn.className = 'btn-profile-call';
                adminBtn.style.background = '#0f172a';
                adminBtn.style.color = 'white';
                adminBtn.innerHTML = '<i class="fas fa-user-shield"></i> بيانات الآدمن';
                adminBtn.onclick = () => {
                   localStorage.setItem('admin_target_user', techData._id || id);
                };
                profileBar.appendChild(adminBtn);
              }
            }
          }

          applyProfilePlanTheme(techData.plan, !!techData.isTrusted);
          loadReviews(id);
          setupReviewForm(id);

          document.getElementById('profAbout').innerHTML = `<p>${techData.bio || AR.defaultProfileBio}</p>`;



          const servicesList = document.getElementById('profServicesList');
          if (servicesList) {
            servicesList.innerHTML = '';
            if (Array.isArray(techData.services) && techData.services.length > 0) {
              techData.services.forEach((service) => {
                const item = document.createElement('div');
                item.className = 'service-item';
                item.innerHTML = `<i class="fas fa-check"></i> ${service?.name || service}`;
                servicesList.appendChild(item);
              });
            } else {
              servicesList.innerHTML = `<div class="service-item"><i class="fas fa-check"></i> ${AR.maintenanceServices}</div>`;
            }
          }

          const galleryContainer = document.getElementById('profGallery');
          // Support both techData.gallery and techData.profile?.galleryImages
          const images = techData.gallery || (techData.profile && techData.profile.galleryImages) || [];
          if (galleryContainer && Array.isArray(images) && images.length > 0) {
            galleryContainer.innerHTML = images.map(img => `
              <div class="gallery-item" style="border:none;">
                <img src="/${img}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">
              </div>
            `).join('');
            const card = document.getElementById('galleryCard');
            if(card) card.style.display = 'block';
          }

          const videosContainer = document.getElementById('profVideos');
          // Support both techData.videos and techData.profile?.galleryVideos
          const videos = techData.videos || (techData.profile && techData.profile.galleryVideos) || [];
          if (videosContainer && Array.isArray(videos) && videos.length > 0) {
            videosContainer.innerHTML = videos.map(vid => `
              <div class="gallery-item" style="border:none;">
                <video src="/${vid}" controls style="width:100%; height:100%; border-radius:12px;"></video>
              </div>
            `).join('');
            const card = document.getElementById('videosCard');
            if(card) card.style.display = 'block';
          }


          // Populate Subscription Info
          const planNameEl = document.getElementById('profPlanName');
          if (planNameEl) planNameEl.innerText = techData.plan?.name || 'مجانية';
          
          const joinDateEl = document.getElementById('profJoinDate');
          if (joinDateEl && techData.subscriptionStartDate) {
              joinDateEl.innerText = new Date(techData.subscriptionStartDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' });
          }

          const daysLeftEl = document.getElementById('profDaysLeft');
          const daysContainer = document.getElementById('profDaysLeftContainer');
          if (daysLeftEl && techData.subscriptionExpiry) {
              const expiry = new Date(techData.subscriptionExpiry);
              const diff = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
              daysLeftEl.innerText = diff > 0 ? diff : 0;
              if (daysContainer) daysContainer.style.display = diff > 0 ? 'inline-block' : 'none';
          } else if (daysContainer) {
              daysContainer.style.display = 'none';
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const loadReviews = async (techId) => {
      try {
        const response = await fetch(`/api/reviews/technician/${techId}`);
        const result = await response.json();
        const reviewsList = document.getElementById('reviewsList');
        const summary = document.getElementById('reviewsSummary');

        if (result.success && result.data.length > 0) {
          const reviews = result.data;
          summary.style.display = 'flex';
          
          // Calculate average
          const total = reviews.reduce((acc, r) => acc + r.rating, 0);
          const avg = (total / reviews.length).toFixed(1);
          document.getElementById('avgScore').innerText = avg;
          document.getElementById('reviewsCountText').innerText = `بناءً على ${reviews.length} تقييم`;
          
          // Stars logic
          let starsHtml = '';
          for(let i=1; i<=5; i++) {
            if(i <= Math.floor(avg)) starsHtml += '<i class="fas fa-star"></i>';
            else if(i - avg < 1) starsHtml += '<i class="fas fa-star-half-alt"></i>';
            else starsHtml += '<i class="far fa-star"></i>';
          }
          document.getElementById('avgStars').innerHTML = starsHtml;

          // List reviews
          reviewsList.innerHTML = reviews.map(r => `
            <div class="review-card">
              <div style="color: #f59e0b; margin-bottom: 5px;">${'<i class="fas fa-star"></i>'.repeat(r.rating)}</div>
              <p>"${r.comment}"</p>
              <span class="review-author"><i class="fas fa-user-circle"></i> ${r.customerId?.fullName || 'عميل'}</span>
            </div>
          `).join('');
        }
      } catch (err) {
        console.error('Error loading reviews:', err);
      }
    };

    let selectedRating = 0;
    const setupReviewForm = (techId) => {
      const userToken = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole'); // We should save this on login
      const addSection = document.getElementById('addReviewSection');
      
      // Only show if logged in as customer
      if (userToken && userRole === 'customer') {
        addSection.style.display = 'block';
        
        // Stars Selection
        const stars = document.querySelectorAll('.star-btn');
        stars.forEach(s => {
          s.onclick = () => {
            selectedRating = parseInt(s.dataset.value);
            stars.forEach(star => {
              star.style.color = parseInt(star.dataset.value) <= selectedRating ? '#f59e0b' : '#cbd5e1';
            });
          };
        });

        // Submit
        document.getElementById('submitReviewBtn').onclick = async () => {
          const comment = document.getElementById('reviewText').value;
          if (selectedRating === 0 || !comment) {
            alert('يرجى اختيار التقييم وكتابة تعليقك');
            return;
          }

          try {
            const res = await fetch('/api/reviews', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
              },
              body: JSON.stringify({ technicianId: techId, rating: selectedRating, comment })
            });
            const data = await res.json();
            if (data.success) {
              alert('تم إضافة تقييمك بنجاح');
              location.reload();
            } else {
              alert(data.message || 'فشل إضافة التقييم');
            }
          } catch (err) {
            alert('حدث خطأ أثناء الإرسال');
          }
        };
      }
    };

    if (techId) loadProfile(techId);
  }

  // ==========================================
  // Pricing Page Dynamic Content
  // ==========================================
  const pricingGrid = document.getElementById('pricingGrid');
  const pricingModal = document.getElementById('pricingModal');
  let currentPlans = [];

  // periodLabels already defined

  window.showPlanOptions = (planId) => {
    const plan = currentPlans.find(p => p.id === planId);
    if (!plan) return;

    document.getElementById('modalPlanName').innerText = plan.name;
    const list = document.getElementById('modalOptionsList');
    list.innerHTML = '';

    if (plan.pricingOptions && plan.pricingOptions.length > 0) {
      plan.pricingOptions.forEach(opt => {
        const durationText = opt.label || `${opt.duration} ${periodLabels[opt.unit] || opt.unit}`;
        const row = document.createElement('a');
        row.className = 'price-option-row';
        row.href = `join-technician.html?planId=${plan.id}&price=${opt.price}&label=${encodeURIComponent(durationText)}`;
        row.innerHTML = `
          <div class="option-info">
            <span class="o-label">${durationText}</span>
            <span class="o-price">${opt.price} <span>ج.م</span></span>
          </div>
          <div class="select-icon"><i class="fas fa-chevron-left"></i></div>
        `;
        list.appendChild(row);
      });
    } else {
      const row = document.createElement('a');
      row.className = 'price-option-row';
      row.href = `join-technician.html?planId=${plan.id}&price=${plan.price}`;
      row.innerHTML = `
        <div class="option-info">
          <span class="o-label">اشتراك ${periodLabels[plan.period] || 'أساسي'}</span>
          <span class="o-price">${plan.price} <span>ج.م</span></span>
        </div>
        <div class="select-icon"><i class="fas fa-chevron-left"></i></div>
      `;
      list.appendChild(row);
    }

    pricingModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closePricingModal = () => {
    pricingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  if (pricingModal) {
    pricingModal.onclick = (e) => {
      if (e.target === pricingModal) closePricingModal();
    };
  }

  if (pricingGrid) {
    const loadPlans = async () => {
      try {
        const response = await fetch('/api/packages');
        const result = await response.json();

        pricingGrid.innerHTML = '';
        if (result.success && result.data && result.data.length > 0) {
          currentPlans = result.data;
          // Sort plans by sortPriority (highest first) then by price
          const sortedPlans = result.data.sort((a, b) => {
            if ((b.sortPriority || 0) !== (a.sortPriority || 0)) {
              return (b.sortPriority || 0) - (a.sortPriority || 0);
            }
            return a.price - b.price;
          });

          sortedPlans.forEach((pkg, index) => {
            const isPopular = !!pkg.popular; // Controlled by "Popular" checkbox in Admin
            const isPremiumTheme = pkg.themeKey === 'premium' || pkg.price >= 100;

            const card = document.createElement('div');
            // Use 'premium' class for styling the highlighted card (either if popular or premium theme)
            card.className = `pricing-card ${isPopular ? 'premium' : ''}`;
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index + 1) * 100);

            // Use features from DB. Fallback only if empty.
            const features = (Array.isArray(pkg.features) && pkg.features.length > 0) 
              ? pkg.features 
              : ['مميزات الباقة ستظهر هنا'];

            const featureItems = features.map((f) => `<li><i class="fas fa-check-circle" style="color: ${isPopular ? '#2563eb' : '#10b981'}"></i>${f}</li>`).join('');

            // Go directly to join page. Options will be selected there.
            const btnOnClick = `window.location.href='join-technician.html?planId=${pkg.id}'`;

            card.innerHTML = `
              ${isPopular ? `<div class="pricing-badge" style="background: #2563eb;">${pkg.badgeText || 'الأكثر مبيعاً ★'}</div>` : ''}
              
              <div class="pricing-name" style="${isPopular ? 'color: #2563eb;' : ''}">${pkg.name}</div>
              <div class="pricing-subtitle" style="${isPopular ? 'color: #3b82f6;' : ''}">${pkg.description || ''}</div>
              
              <div class="pricing-price" style="${isPopular ? 'color: #2563eb;' : ''}">
                ${pkg.price} 
                <span style="font-size: 1rem; color: #64748b;">ج.م / ${periodLabels[pkg.period] || pkg.period || periodLabels.monthly}</span>
              </div>

              <div style="margin: 20px 0; height: 1px; background: #e2e8f0; width: 100%;"></div>

              <ul class="pricing-features" style="text-align: right; width: 100%;">
                ${featureItems}
              </ul>

              <button onclick="${btnOnClick}" class="btn ${isPopular ? 'btn-primary' : (isPremiumTheme ? 'btn-dark' : 'btn-outline')}" 
                 style="width: 100%; border-radius: 30px; padding: 15px; margin-top: 20px; font-weight: 700; ${isPopular ? 'background: #2563eb; border: none; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);' : ''}">
                ${pkg.price === 0 ? 'ابدأ مجاناً' : 'اشترك الآن'}
              </button>
            `;
            pricingGrid.appendChild(card);
            if (window.aosObserver) window.aosObserver.observe(card);
          });
        }


      } catch (error) {
        console.error('Error fetching packages:', error);
        pricingGrid.innerHTML = `<div style="text-align: center; width: 100%; grid-column: 1 / -1; padding: 40px; color: #ef4444;">${AR.loadError}</div>`;
      }
    };

    loadPlans();
  }

  // ==========================================
  // Newsletter Form
  // ==========================================
  document.querySelectorAll('.newsletter-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      if (!input || !input.value) return;

      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.style.backgroundColor = '#10b981';
      input.value = '';
      input.placeholder = AR.newsletterDone;

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        btn.style.backgroundColor = '';
        input.placeholder = '\u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a';
      }, 3000);
    });
  });

  // ==========================================
  // Join Technician Form Logic
  // ==========================================
  const joinForm = document.getElementById('joinTechnicianForm');
  if (joinForm) {
    joinForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('joinSubmitBtn');
      const statusDiv = document.getElementById('joinFormStatus');

      const formData = {
        fullName: document.getElementById('joinName').value,
        phone: document.getElementById('joinPhone').value,
        email: document.getElementById('joinEmail').value,
        specialty: document.getElementById('joinServices').value,
        yearsOfExperience: parseInt(document.getElementById('joinExp').value, 10) || 0,
        city: document.getElementById('joinLocation').value,
        bio: document.getElementById('joinBio').value,
        whatsapp: document.getElementById('joinPhone').value
      };

      submitBtn.disabled = true;
      submitBtn.innerHTML = '\u062c\u0627\u0631\u064a \u0627\u0644\u0625\u0631\u0633\u0627\u0644... <i class="fas fa-spinner fa-spin"></i>';
      statusDiv.style.display = 'none';

      try {
        const response = await fetch('/api/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#d1fae5';
          statusDiv.style.color = '#065f46';
          statusDiv.innerText = result.message || '\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628\u0643 \u0628\u0646\u062c\u0627\u062d.';
          joinForm.reset();
        } else {
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#fee2e2';
          statusDiv.style.color = '#991b1b';
          statusDiv.innerText = result.message || '\u062d\u062f\u062b \u062e\u0637\u0623\u060c \u064a\u0631\u062c\u0649 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.';
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        statusDiv.style.display = 'block';
        statusDiv.style.backgroundColor = '#fee2e2';
        statusDiv.style.color = '#991b1b';
        statusDiv.innerText = '\u062d\u062f\u062b \u062e\u0637\u0623 \u0641\u064a \u0627\u0644\u0627\u062a\u0635\u0627\u0644 \u0628\u0627\u0644\u062e\u0627\u062f\u0645.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '\u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 <i class="fas fa-paper-plane"></i>';
      }
    });
  }
});
