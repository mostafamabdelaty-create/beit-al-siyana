document.addEventListener('DOMContentLoaded', () => {

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
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // Scroll Animations (Custom AOS)
  // ==========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-aos]').forEach(element => {
    const delay = element.getAttribute('data-aos-delay');
    if (delay) {
      element.style.transitionDelay = `${delay}ms`;
    }
    observer.observe(element);
  });

  // ==========================================
  // Active Navbar Link on Scroll
  // ==========================================
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });

    // Header shadow on scroll
    const header = document.querySelector('.header');
    if (header) {
      header.style.boxShadow = window.scrollY > 50
        ? '0 4px 6px -1px rgba(0,0,0,0.4)'
        : '0 4px 6px -1px rgba(0,0,0,0.2)';
    }
  });

  // ==========================================
  // Services Page Filter
  // ==========================================
  const filterBtn = document.getElementById('filterBtn');
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      const govFilter    = document.getElementById('govFilter').value;
      const ratingFilter = document.getElementById('ratingFilter').value;
      const expFilter    = document.getElementById('expFilter').value;

      const techCards = document.querySelectorAll('.tech-card');
      let visibleCount = 0;

      techCards.forEach(card => {
        let isMatch = true;

        const metaSpans = card.querySelectorAll('.tech-meta span');
        let cardRating = 0;
        let cardExp = 0;
        let cardLocation = "";

        metaSpans.forEach(span => {
          const text = span.textContent || "";
          if (span.classList.contains('rating') || text.includes('تقييم')) {
            const match = text.match(/([\d.]+)/);
            if (match) cardRating = parseFloat(match[1]);
          } else if (text.includes('خبرة')) {
            const match = text.match(/([\d.]+)/);
            if (match) cardExp = parseFloat(match[1]);
          } else if (span.querySelector('.fa-map-marker-alt') || text.includes('،')) {
            cardLocation = text;
          }
        });

        if (govFilter !== 'all' && !cardLocation.includes(govFilter)) isMatch = false;
        if (ratingFilter !== 'all' && cardRating < parseFloat(ratingFilter)) isMatch = false;
        if (expFilter !== 'all' && cardExp < parseFloat(expFilter)) isMatch = false;

        if (isMatch) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 100); // ✅ FIXED: removed broken aos-animate class
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Show "no results" message if needed
      const noResults = document.getElementById('noResultsMsg');
      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }

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

    const serviceNames = {
      'plumbing': 'السباكة',
      'carpentry': 'النجارة',
      'paint': 'الدهانات',
      'electricity': 'الكهرباء',
      'flooring': 'الأرضيات',
      'finishing': 'التشطيب'
    };

    serviceTitle.innerText = `فنيين ${serviceNames[serviceKey] || 'الصيانة'}`;
    document.title = `بيت الصيانة | فنيين ${serviceNames[serviceKey] || 'الصيانة'}`;

    const loadTechnicians = async () => {
      techGrid.innerHTML = '<div class="loading-state" style="grid-column: 1/-1; text-align: center;">جاري التحميل...</div>'; 
      
      try {
        const response = await fetch(`http://localhost:5000/api/technicians?service=${serviceKey}`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          techGrid.innerHTML = '';
          result.data.forEach((tech, index) => {
            const card = document.createElement('div');
            card.className = 'tech-card';
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index + 1) * 100);
            card.onclick = () => window.location = `technician-profile.html?id=${tech._id}`;
            
            card.innerHTML = `
              <img src="${tech.photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}" alt="${tech.name}" class="tech-img">
              <div class="tech-content">
                <div class="tech-header-info">
                  <h3 class="tech-name">${tech.name}</h3>
                  <span class="verified-badge"><i class="fas fa-check-circle"></i> هوية موثقة</span>
                </div>
                <div class="tech-meta">
                  <span class="rating"><i class="fas fa-star"></i> ${tech.averageRating || 'جديد'} (${tech.totalReviews || '0'} تقييم)</span>
                  <span><i class="far fa-clock"></i> خبرة ${tech.experience} سنة</span>
                  <span><i class="fas fa-map-marker-alt"></i> ${tech.location || 'غير محدد'}</span>
                </div>
                <p class="tech-desc">${tech.bio || 'متخصص في أعمال التأسيس والصيانة بإحترافية.'}</p>
                <div class="tech-actions">
                  <a href="https://wa.me/${tech.phone ? tech.phone.replace(/\\D/g, '') : ''}" target="_blank" class="btn-whatsapp" onclick="event.stopPropagation();"><i class="fab fa-whatsapp" style="font-size: 1.2rem;"></i> واتساب</a>
                  <a href="tel:${tech.phone}" class="btn-call" onclick="event.stopPropagation();"><i class="fas fa-phone-alt"></i> اتصال</a>
                </div>
              </div>
            `;
            techGrid.appendChild(card);
          });
        } else {
          techGrid.innerHTML = '<div style="text-align: center; width: 100%; grid-column: 1 / -1; padding: 40px; color: #64748b;">لا يوجد فنيين حالياً في هذا القسم.</div>';
        }
      } catch (error) {
        console.error('Error loading technicians:', error);
        techGrid.innerHTML = '<div style="text-align: center; width: 100%; grid-column: 1 / -1; padding: 40px; color: #ef4444;">حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة لاحقاً.</div>';
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

    // Function to load profile
    const loadProfile = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/technicians/${id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          const techData = result.data;
          
          profName.innerText = techData.name;
          document.getElementById('profRating').innerText = techData.averageRating || 'جديد';
          document.getElementById('profReviewsCount').innerText = techData.totalReviews || '0';
          document.getElementById('profExp').innerText = techData.experience;
          document.getElementById('profLoc').innerText = techData.location || 'غير محدد';
          document.getElementById('profShortDesc').innerText = techData.bio || 'متخصص في أعمال الصيانة والتأسيس لكافة المنشآت.';
          
          if(techData.photo) document.getElementById('profImg').src = techData.photo;
          document.getElementById('profImg').alt = techData.name;
          
          document.getElementById('profCallBtn').href = `tel:${techData.phone}`;
          document.getElementById('profWaBtn').href = `https://wa.me/${techData.phone ? techData.phone.replace(/\\D/g, '') : ''}?text=مرحبا ${techData.name}، أريد الاستفسار عن خدمة من بيت الصيانة`;
          
          document.getElementById('profAbout').innerHTML = `<p>${techData.bio || 'فني متخصص في تقديم خدمات الصيانة وإصلاح الأعطال بدقة واحترافية.'}</p>`;
          
          const servicesList = document.getElementById('profServicesList');
          servicesList.innerHTML = '';
          if(techData.services && techData.services.length > 0) {
            techData.services.forEach(service => {
              const item = document.createElement('div');
              item.className = 'service-item';
              item.innerHTML = `<i class="fas ${service.icon || 'fa-check'}"></i> ${service.name || service}`;
              servicesList.appendChild(item);
            });
          } else {
             servicesList.innerHTML = '<div class="service-item"><i class="fas fa-check"></i> خدمات الصيانة الفورية</div>';
          }
        }
      } catch(error) {
        console.error('Error fetching profile:', error);
      }
    };

    loadProfile(techId);
  }

  // ==========================================
  // Pricing Page Dynamic Content
  // ==========================================
  const pricingGrid = document.getElementById('pricingGrid');
  if (pricingGrid) {
    const loadPackages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/packages');
        const result = await response.json();
        
        pricingGrid.innerHTML = '';
        if (result.success && result.data && result.data.length > 0) {
          result.data.forEach((pkg, index) => {
            const card = document.createElement('div');
            card.className = `pricing-card ${pkg.isPopular ? 'premium' : ''}`;
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index + 1) * 100);
            
            card.innerHTML = `
              ${pkg.isPopular ? '<div class="pricing-badge">الأكثر اختيارًا</div>' : ''}
              <div class="pricing-name">${pkg.name}</div>
              <div class="pricing-subtitle" style="${pkg.isPopular ? 'color: #2563eb;' : ''}">${pkg.description || ''}</div>
              <div class="pricing-desc">اشتراك مناسب للحرفيين ومقدمي الخدمات.</div>
              <div class="pricing-price" style="${pkg.isPopular ? 'color: #2563eb;' : ''}">${pkg.price} <span>جنيه / ${pkg.duration || 'شهريًا'}</span></div>
              <ul class="pricing-features">
                ${pkg.features.map(f => `<li><i class="fas fa-check-circle"></i>${f}</li>`).join('')}
              </ul>
              <a href="https://wa.me/201018614843?text=أريد الاشتراك في ${pkg.name}" target="_blank" class="btn ${pkg.isPopular ? 'btn-primary' : (index === 2 ? 'btn-dark' : 'btn-outline')}" style="width: 100%; border-radius: 8px;">اشترك الآن</a>
            `;
            pricingGrid.appendChild(card);
          });
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        pricingGrid.innerHTML = '<div style="text-align: center; width: 100%; grid-column: 1 / -1; padding: 40px; color: #ef4444;">حدث خطأ أثناء تحميل الباقات.</div>';
      }
    };

    loadPackages();
  }

  // ==========================================
  // Newsletter Form (Linked to Placeholder API)
  // ==========================================
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      if (!input || !input.value) return;

      // TODO: Actual API connection
      console.log('Sending newsletter subscription for:', input.value);
      
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.style.backgroundColor = '#10b981';
      input.value = '';
      input.placeholder = 'تم الاشتراك بنجاح!';

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        btn.style.backgroundColor = '';
        input.placeholder = 'بريدك الإلكتروني';
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
        yearsOfExperience: parseInt(document.getElementById('joinExp').value) || 0,
        city: document.getElementById('joinLocation').value,
        bio: document.getElementById('joinBio').value,
        whatsapp: document.getElementById('joinPhone').value // Defaulting whatsapp to phone
      };

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'جاري الإرسال... <i class="fas fa-spinner fa-spin"></i>';
      statusDiv.style.display = 'none';

      try {
        const response = await fetch('http://localhost:5000/api/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const result = await response.json();

        if (response.ok && result.success) {
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#d1fae5';
          statusDiv.style.color = '#065f46';
          statusDiv.innerText = result.message || 'تم إرسال طلبك بنجاح! هنتواصل معاك قريباً.';
          joinForm.reset();
        } else {
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#fee2e2';
          statusDiv.style.color = '#991b1b';
          statusDiv.innerText = result.message || 'حدث خطأ، يرجى المحاولة مرة أخرى.';
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        statusDiv.style.display = 'block';
        statusDiv.style.backgroundColor = '#fee2e2';
        statusDiv.style.color = '#991b1b';
        statusDiv.innerText = 'حدث خطأ في الاتصال بالخادم. يرجى التأكد من اتصالك والمحاولة لاحقاً.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'إرسال طلب الانضمام <i class="fas fa-paper-plane"></i>';
      }
    });
  }

});
