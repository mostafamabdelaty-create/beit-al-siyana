import { useEffect } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const HEAD_ATTR = 'data-services-head';

const appendHeadLink = (href, rel = 'stylesheet') => {
  const existing = document.querySelector(`link[${HEAD_ATTR}="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.setAttribute(HEAD_ATTR, href);
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};

function ServicesPage() {
  useEffect(() => {
    document.title = 'بيت الصيانة | الخدمات';
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = 'page-services';

    appendHeadLink('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    appendHeadLink('/css/style.css');
    appendHeadLink('/css/services.css');

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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const aosElements = document.querySelectorAll('[data-aos]');
    aosElements.forEach((element) => {
      const delay = element.getAttribute('data-aos-delay');
      if (delay) element.style.transitionDelay = `${delay}ms`;
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <SiteHeader active="services" />

      <div className="services-wrapper">
        {/* Hero Section */}
        <section className="services-hero-new">
          <div className="container" data-aos="fade-up">
            <div className="services-badge-pill">حلول متكاملة</div>
            <h1>بوابتك لمنزل <span>مثالي</span></h1>
            <p>نحن نجمع بين الخبرة الفنية واللمسة الجمالية لنقدم لك خدمات صيانة وتشطيب تفوق التوقعات.</p>
            <div className="services-tab-btn" data-aos="fade-up" data-aos-delay="100">
              <i className="ph ph-squares-four" />
              <span>خدماتنـــا</span>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="services-grid-section">
          <div className="container">
            <div className="services-grid-new">

              {/* السباكة */}
              <a href="technicians.html?service=plumbing" className="service-card-v2" data-aos="fade-up" data-aos-delay="100">
                <div className="sc-header">
                  <h3>السباكة</h3>
                  <div className="sc-icon"><i className="ph ph-wrench" /></div>
                </div>
                <p>نظام مائي بلا عيوب، من صيانة الصنابير وحتى تمديد الشبكات الرئيسية بأحدث التقنيات.</p>
                <div className="sc-footer">
                  <span className="sc-browse-btn">تصفح الخدمة <i className="ph ph-caret-left" /></span>
                </div>
              </a>

              {/* النجارة */}
              <a href="technicians.html?service=carpentry" className="service-card-v2" data-aos="fade-up" data-aos-delay="200">
                <div className="sc-header">
                  <h3>النجارة</h3>
                  <div className="sc-icon"><i className="ph ph-hammer" /></div>
                </div>
                <p>من إصلاح الأثاث إلى تصميم وتركيب الأبواب والمطابخ بأفضل جودة أخشاب.</p>
                <div className="sc-footer">
                  <span className="sc-browse-btn">تصفح الخدمة <i className="ph ph-caret-left" /></span>
                </div>
              </a>

              {/* الدهانات */}
              <a href="technicians.html?service=paint" className="service-card-v2" data-aos="fade-up" data-aos-delay="300">
                <div className="sc-header">
                  <h3>الدهانات</h3>
                  <div className="sc-icon"><i className="ph ph-paint-roller" /></div>
                </div>
                <p>ألوان تنبض بالحياة وتشطيبات نهائية تعكس ذوقك الرفيع بكل دقة واحترافية.</p>
                <div className="sc-footer">
                  <span className="sc-browse-btn">تصفح الخدمة <i className="ph ph-caret-left" /></span>
                </div>
              </a>

              {/* الكهرباء */}
              <a href="technicians.html?service=electricity" className="service-card-v2" data-aos="fade-up" data-aos-delay="100">
                <div className="sc-header">
                  <h3>الكهرباء</h3>
                  <div className="sc-icon"><i className="ph ph-lightning" /></div>
                </div>
                <p>إضاءة ذكية وتوصيلات آمنة تضمن لك أعلى معايير الأمان في منزلك أو منشأتك.</p>
                <div className="sc-footer">
                  <span className="sc-browse-btn">تصفح الخدمة <i className="ph ph-caret-left" /></span>
                </div>
              </a>

              {/* الأرضيات */}
              <a href="technicians.html?service=flooring" className="service-card-v2" data-aos="fade-up" data-aos-delay="200">
                <div className="sc-header">
                  <h3>الأرضيات</h3>
                  <div className="sc-icon"><i className="ph ph-squares-four" /></div>
                </div>
                <p>سيراميك، باركيه، أو رخام.. نضمن استواء تام ومظهراً جذاباً يدوم لسنوات طويلة.</p>
                <div className="sc-footer">
                  <span className="sc-browse-btn">تصفح الخدمة <i className="ph ph-caret-left" /></span>
                </div>
              </a>

              {/* التشطيب المتكامل */}
              <a href="technicians.html?service=finishing" className="service-card-v2" data-aos="fade-up" data-aos-delay="300">
                <div className="sc-header">
                  <h3>التشطيب المتكامل</h3>
                  <div className="sc-icon"><i className="ph ph-house-line" /></div>
                </div>
                <p>استلم منزلك "على المفتاح"، لنسلمك إياه جاهزاً للسكن بمفتاح السعادة.</p>
                <div className="sc-footer">
                  <span className="sc-browse-btn">تصفح الخدمة <i className="ph ph-caret-left" /></span>
                </div>
              </a>

              {/* خدمات أخرى - Full Width Card */}
              <a href="technicians.html?service=other" className="service-card-full-v2" data-aos="fade-up" data-aos-delay="100">
                <div className="scf-right">
                  <span className="sc-browse-btn sc-browse-btn-orange">تصفح الخدمة <i className="ph ph-caret-left" /></span>
                </div>
                <div className="scf-center">
                  <h3>خدمات أخرى</h3>
                  <p>خدمات صيانة منزلية متنوعة لتلبية جميع احتياجاتك المختلفة.</p>
                </div>
                <div className="scf-left">
                  <div className="scf-icon"><i className="ph ph-wrench" /></div>
                </div>
              </a>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="services-cta-section">
          <div className="container">
            <div className="services-cta-new" data-aos="zoom-in">
              <div className="cta-content-side">
                <h2>هل أنت جاهز للبدء؟</h2>
                <p>تواصل معنا اليوم للحصول على استشارة مجانية ومعاينة فورية لمشروعك.</p>
                <div className="cta-actions-new">
                  <a href="login.html" className="btn-cta-primary auth-gate-link">
                    <i className="ph ph-sign-in" /> تسجيل دخول لطلب خدمة
                  </a>
                  <a href="#" className="btn-cta-whatsapp">
                    <i className="ph ph-whatsapp-logo" /> تواصل عبر واتساب
                  </a>
                </div>
              </div>
              <div className="cta-image-side">
                <img src="/Images/services-cta-techs.png" alt="فنيو بيت الصيانة" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}

export default ServicesPage;
