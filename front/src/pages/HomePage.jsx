import { useEffect } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
const HEAD_ATTR = 'data-home-head';

const appendHeadLink = (href, rel = 'stylesheet') => {
  const existing = document.querySelector(`link[${HEAD_ATTR}="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.setAttribute(HEAD_ATTR, href);
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};

function HomePage() {
  useEffect(() => {
    document.title = 'بيت الصيانة | خدمات صيانة منزلك بسهولة';
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = '';

    appendHeadLink('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    appendHeadLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    appendHeadLink('/css/style.css?v=4');

    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    currentPath = currentPath.split('?')[0].split('#')[0] || 'index.html';

    document.querySelectorAll('.nav-links a').forEach((link) => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });

    const userToken = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const navCta = document.querySelector('.nav-cta');

    if (userToken && navCta) {
      navCta.innerText = userRole === 'admin' ? 'لوحة التحكم' : 'حسابي';
      if (userRole === 'customer') navCta.href = 'customer-profile.html';
      if (userRole === 'technician') navCta.href = 'technician-dashboard.html';
      if (userRole === 'admin') navCta.href = 'admin-dashboard.html';
    }

    document.querySelectorAll('.auth-gate-link').forEach((btn) => {
      if (!userToken) {
        btn.innerText = 'تسجيل دخول لطلب خدمة';
        btn.href = 'login.html';
      }
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    const toggleMenu = () => navLinks?.classList.toggle('active');
    const closeMenu = () => navLinks?.classList.remove('active');

    menuToggle?.addEventListener('click', toggleMenu);
    navItems.forEach((item) => item.addEventListener('click', closeMenu));



    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (!header) return;

      header.style.boxShadow =
        window.scrollY > 50
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
    };

    window.addEventListener('scroll', handleScroll);

    const cards = document.querySelectorAll('#services .service-card[data-service]');
    const navigateHandlers = [];

    cards.forEach((card) => {
      const serviceKey = card.getAttribute('data-service');
      if (!serviceKey) return;

      card.style.cursor = 'pointer';
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');

      const onClick = () => {
        window.location.href = `technicians.html?service=${encodeURIComponent(serviceKey)}`;
      };

      const onKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      };

      card.addEventListener('click', onClick);
      card.addEventListener('keydown', onKeyDown);
      navigateHandlers.push({ card, onClick, onKeyDown });
    });

    return () => {
      menuToggle?.removeEventListener('click', toggleMenu);
      navItems.forEach((item) => item.removeEventListener('click', closeMenu));
      window.removeEventListener('scroll', handleScroll);

      navigateHandlers.forEach(({ card, onClick, onKeyDown }) => {
        card.removeEventListener('click', onClick);
        card.removeEventListener('keydown', onKeyDown);
      });
    };
  }, []);

  return (
    <>
      <SiteHeader active="home" />

      <section id="hero" className="hero-new">
        <div className="hero-bg-overlay"></div>
        <div className="container hero-container-new">
          <div className="hero-content-new" data-aos="fade-left">
            <div className="hero-badge">
              <span>خدمات صيانة منزلية متكاملة</span>
              <i className="ph ph-house" />
            </div>
            <h1>
              <span className="text-dark">خدمات </span>
              <span className="text-primary">صيانة</span><br/>
              <span className="text-dark">منزلك بسهوله</span>
            </h1>
            <p className="hero-subtitle-new">
              <span className="bullet-dot"></span>
              اختر، احجز، ونفّذ بثقة.
            </p>
            <div className="hero-actions-new">
              <a href="services.html" className="btn btn-primary btn-lg auth-gate-link" style={{ padding: '15px 35px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                احجز الان <i className="ph ph-arrow-left" />
              </a>
            </div>
          </div>
          <div className="hero-trust-floating" data-aos="fade-up" data-aos-delay="200">
            <div className="trust-icon-circle">
              <i className="ph-fill ph-shield-check" />
            </div>
            <div className="trust-floating-text">
              <span className="trust-title">خدمة موثوقة</span>
              <span className="trust-percent">100%</span>
              <span className="trust-desc">رضا مضمون</span>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-banner-section">
        <div className="container">
          <div className="trust-banner-new" data-aos="fade-up">
            <div className="trust-item-new">
              <div className="trust-icon-new bg-primary-light text-primary"><i className="ph ph-squares-four" /></div>
              <h3>خدمات صيانة<br/>متنوعة لمنزلك</h3>
              <p>كل خدمات الصيانة التي<br/>تحتاجها في مكان واحد.</p>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item-new">
              <div className="trust-icon-new text-primary" style={{ background: '#fff4ed' }}><i className="ph-fill ph-star" /></div>
              <h3>تقييمات العملاء<br/>للفنيين</h3>
              <p>تقييمات حقيقية تساعدك<br/>على اختيار الأفضل.</p>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item-new">
              <div className="trust-icon-new text-primary" style={{ background: '#fff4ed' }}><i className="ph-fill ph-lightning" /></div>
              <h3>حجز سهل<br/>وسريع</h3>
              <p>احجز الخدمة في دقائق<br/>ونصل إليك في الوقت المناسب.</p>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item-new">
              <div className="trust-icon-new text-primary" style={{ background: '#fff4ed' }}><i className="ph-fill ph-tag" /></div>
              <h3>أسعار تنافسية<br/>وواضحة</h3>
              <p>أسعار عادلة بدون رسوم<br/>خفية وبأعلى جودة.</p>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item-new">
              <div className="trust-icon-new text-primary" style={{ background: '#fff4ed' }}><i className="ph-fill ph-user-circle-check" /></div>
              <h3>فنيين موثوقين<br/>ومحترفين</h3>
              <p>فريق عمل مدرب<br/>ومؤهل لخدمتك باحترافية.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="prob-sol-section bg-light">
        <div className="container container-narrow">
          <div className="prob-sol-wrapper">
            <div className="problem-box" data-aos="fade-right">
              <div className="box-header-new">
                <h2>المشكلة اللي بتواجه أغلب <span className="text-danger">الناس</span></h2>
                <div className="icon-circle bg-danger-light text-danger">
                  <i className="ph ph-x" />
                </div>
              </div>
              <ul className="custom-list-new">
                <li><span>صعوبة العثور على فني موثوق</span> <i className="ph ph-x text-danger" /></li>
                <li><span>تجارب سيئة مع فنيين غير محترفين</span> <i className="ph ph-x text-danger" /></li>
                <li><span>ضياع وقت كبير في البحث عن الحرفيين</span> <i className="ph ph-x text-danger" /></li>
                <li><span>عدم وجود منصة تجمع كل الخدمات المنزلية في مكان واحد</span> <i className="ph ph-x text-danger" /></li>
              </ul>
            </div>
            <div className="solution-box" data-aos="fade-left">
              <div className="box-header-new">
                <h2>منصة "بيت الصيانة" توفر لك <span className="text-success">الحل</span></h2>
                <div className="icon-circle bg-success-light text-success">
                  <i className="ph ph-check" />
                </div>
              </div>
              <p className="solution-text">نحن نجمع أفضل الحرفيين في مكان واحد، ونوفر لك طريقة سهلة لاختيار الفني المناسب لخدمتك، مع إمكانية التواصل المباشر معه عبر الاتصال أو الواتساب.</p>
              <div className="solution-shield">
                <i className="ph ph-shield-check" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="services section-padding bg-light">
        <div className="container">
          <div className="section-header text-center" data-aos="fade-up">
            <h4 style={{ color: 'var(--primary-color)', fontSize: '1rem', fontWeight: 800, marginBottom: '10px' }}>خدماتنا</h4>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-dark)', marginBottom: '15px' }}>مجموعة شاملة من خدمات الصيانة</h2>
            <p style={{ color: 'var(--text-muted)' }}>لتلبية كافة احتياجات منزلك</p>
          </div>
          <div className="services-grid-new">
            <a href="technicians.html?service=plumbing" className="service-card-new" data-service="plumbing" data-aos="fade-up" data-aos-delay="100">
              <div className="service-img-wrapper">
                <img src="/Images/plumber.webp" alt="السباكة" />
                <div className="service-icon-circle"><i className="ph ph-drop" /></div>
              </div>
              <div className="service-content-new">
                <h3>السباكة</h3>
                <p>إصلاح التسريبات وتركيب الأدوات الصحية وصيانة المواسير.</p>
              </div>
            </a>
            <a href="technicians.html?service=electricity" className="service-card-new" data-service="electricity" data-aos="fade-up" data-aos-delay="200">
              <div className="service-img-wrapper">
                <img src="/Images/electrician.webp" alt="الكهرباء" />
                <div className="service-icon-circle"><i className="ph ph-lightning" /></div>
              </div>
              <div className="service-content-new">
                <h3>الكهرباء</h3>
                <p>تركيب وصيانة الأعطال الكهربائية وتمديدات الكهرباء المنزلية.</p>
              </div>
            </a>
            <a href="technicians.html?service=carpentry" className="service-card-new" data-service="carpentry" data-aos="fade-up" data-aos-delay="300">
              <div className="service-img-wrapper">
                <img src="/Images/carpenter.webp" alt="النجارة" />
                <div className="service-icon-circle"><i className="ph ph-ruler" /></div>
              </div>
              <div className="service-content-new">
                <h3>النجارة</h3>
                <p>تصليح وتركيب الأبواب والأثاث الخشبي.</p>
              </div>
            </a>
            <a href="technicians.html?service=paint" className="service-card-new" data-service="paint" data-aos="fade-up" data-aos-delay="400">
              <div className="service-img-wrapper">
                <img src="/Images/Painting.webp" alt="الدهانات" />
                <div className="service-icon-circle"><i className="ph ph-paint-roller" /></div>
              </div>
              <div className="service-content-new">
                <h3>الدهانات</h3>
                <p>دهانات داخلية وخارجية بألوان وتشطيبات احترافية.</p>
              </div>
            </a>
            <a href="technicians.html?service=flooring" className="service-card-new" data-service="flooring" data-aos="fade-up" data-aos-delay="500">
              <div className="service-img-wrapper">
                <img src="/Images/Flooring.webp" alt="الأرضيات" />
                <div className="service-icon-circle"><i className="ph ph-squares-four" /></div>
              </div>
              <div className="service-content-new">
                <h3>الأرضيات</h3>
                <p>تركيب السيراميك والبورسلين وصيانة الأرضيات.</p>
              </div>
            </a>
            <a href="technicians.html?service=finishing" className="service-card-new" data-service="finishing" data-aos="fade-up" data-aos-delay="600">
              <div className="service-img-wrapper">
                <img src="/Images/Full Finishing.webp" alt="التشطيب المتكامل" />
                <div className="service-icon-circle"><i className="ph ph-house" /></div>
              </div>
              <div className="service-content-new">
                <h3>التشطيب المتكامل</h3>
                <p>تشطيب كامل للشقق والمكاتب من البداية حتى التسليم.</p>
              </div>
            </a>
            <a href="services.html" className="service-card-new service-card-full" data-service="other" data-aos="fade-up" data-aos-delay="700">
              <div className="service-content-full">
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: 'var(--white)', fontSize: '1.8rem', marginBottom: '10px' }}>خدمات أخرى</h3>
                  <p style={{ color: 'var(--border-color)' }}>هل تحتاج لخدمة مختلفة؟ ابحث عن فنيين في تخصصات متنوعة أخرى.</p>
                </div>
                <div className="action-button-full">
                  <span className="btn btn-primary" style={{ padding: '12px 30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>ابحث الآن <i className="ph ph-arrow-left" /></span>
                </div>
                <div className="icon-large-bg"><i className="ph ph-wrench" /></div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section id="process" className="process section-padding bg-light">
        <div className="container">
          <div className="section-header text-center" data-aos="fade-up">
            <h2>كيف تعمل المنصة؟</h2>
            <p>خطوات بسيطة للحصول على الخدمة التي تحتاجها</p>
          </div>
          <div className="process-steps">
            <div className="step" data-aos="fade-up" data-aos-delay="100"><div className="step-num">1</div><h3>اختر الخدمة</h3><p>اختر الخدمة المناسبة من الموقع</p></div>
            <div className="step" data-aos="fade-up" data-aos-delay="200"><div className="step-num">2</div><h3>سجل دخول / حساب جديد</h3><p>سجل دخولك كعميل لتتمكن من رؤية بيانات التواصل</p></div>
            <div className="step" data-aos="fade-up" data-aos-delay="300"><div className="step-num">3</div><h3>تصفح الفنيين والتقييمات</h3><p>استعرض الفنيين المتاحين والتقييمات الحقيقية من العملاء</p></div>
            <div className="step" data-aos="fade-up" data-aos-delay="400"><div className="step-num">4</div><h3>تواصل واطلب خدمتك</h3><p>تواصل مباشرة مع الفني عبر الاتصال أو الواتساب بعد تسجيل الدخول</p></div>
            <div className="step" data-aos="fade-up" data-aos-delay="500"><div className="step-num">5</div><h3>احصل على الخدمة</h3><p>احصل على الخدمة بسهولة وسرعة</p></div>
          </div>
        </div>
      </section>

      <section className="why-us section-padding">
        <div className="container text-center">
          <div className="section-header" data-aos="fade-up"><h2>لماذا تختار "بيت الصيانة"؟</h2></div>
          <div className="why-us-grid">
            <div className="why-item" data-aos="fade-up" data-aos-delay="0"><i className="fas fa-users-cog" /><h4>منصة تجمع أفضل الحرفيين</h4></div>
            <div className="why-item" data-aos="fade-up" data-aos-delay="100"><i className="fas fa-clock" /><h4>توفير الوقت والجهد في البحث</h4></div>
            <div className="why-item" data-aos="fade-up" data-aos-delay="200"><i className="fas fa-tools" /><h4>خدمات متنوعة لصيانة المنزل</h4></div>
            <div className="why-item" data-aos="fade-up" data-aos-delay="300"><i className="fab fa-whatsapp" /><h4>إمكانية التواصل المباشر مع الفني</h4></div>
            <div className="why-item" data-aos="fade-up" data-aos-delay="400"><i className="fas fa-star-half-alt" /><h4>اختيار الفني المناسب حسب التقييم والخبرة</h4></div>
          </div>

          <div className="social-proof" data-aos="zoom-in" data-aos-delay="500">
            <i className="fas fa-quote-right quote-icon" />
            <p>"يستخدم العديد من العملاء منصة بيت الصيانة للحصول على خدمات صيانة منزلية موثوقة، ويعتمدون عليها للعثور على فنيين محترفين بسرعة وسهولة."</p>
            <div className="stars">
              <i className="fas fa-star text-warning" />
              <i className="fas fa-star text-warning" />
              <i className="fas fa-star text-warning" />
              <i className="fas fa-star text-warning" />
              <i className="fas fa-star text-warning" />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section-padding bg-light">
        <div className="container">
          <div className="home-cta" data-aos="fade-up">
            <div className="home-cta-content">
              <h2>مستعد لطلب خدمتك؟</h2>
              <p>لو محتاج مساعدة في اختيار الخدمة المناسبة، تواصل معنا وسنساعدك في الوصول إلى الفني المناسب بسرعة.</p>
              <div className="cta-buttons">
                <a href="tel:+201018614843" className="btn btn-white-pill">
                  <i className="fas fa-phone-alt" style={{ marginLeft: '8px' }} />اتصل بنا الآن
                </a>
                <a
                  href="https://wa.me/201018614843?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D8%AD%D8%AA%D8%A7%D8%AC%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9%20%D9%81%D9%8A%20%D9%85%D9%86%D8%B5%D8%A9%20%D8%A8%D9%8A%D8%AA%20%D8%A7%D9%84%D8%B5%D9%8A%D8%A7%D9%86%D8%A9"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-dark-pill btn-whatsapp-cta"
                >
                  <i className="fab fa-whatsapp" style={{ marginLeft: '8px' }} />تواصل عبر واتساب
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

export default HomePage;
