import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import useStaticPageSetup from '../hooks/useStaticPageSetup';

function AboutPage() {
  useStaticPageSetup({
    title: 'من نحن - بيت الصيانة',
    bodyClass: 'page-about'
  });

  return (
    <>
      <SiteHeader active="about" />

      <div className="about-wrapper">
        <section className="about-hero-new">
          <div className="container">
            <div className="about-hero-content">
              <div className="text-content" data-aos="fade-left">
                <div className="badge-pill" style={{ display: 'inline-block', marginBottom: '15px' }}>من نحن</div>
                <h1 style={{ fontSize: '3rem', margin: '0 0 5px', color: 'var(--text-dark)', fontWeight: 900 }}>منصة</h1>
                <h1 style={{ fontSize: '4rem', marginBottom: '24px', color: 'var(--primary-color)', fontWeight: 900 }}>بيت الصيانة</h1>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginBottom: '25px', maxWidth: '500px', lineHeight: 1.8 }}>
                  في بيت الصيانة نؤمن أن صيانة المنزل يجب أن تكون عملية سهلة وسريعة، وليس تجربة مرهقة مليئة بالبحث والتجارب غير المضمونة. لهذا أنشأنا منصة تجمع بين أصحاب المنازل والحرفيين المحترفين في مكان واحد لتسهيل الوصول إلى خدمات الصيانة والتشطيب بثقة وسهولة.
                </p>
                
                <div className="about-feature-text">
                  <div className="icon text-primary">
                    <i className="ph ph-user-gear" />
                  </div>
                  <p>
                    سواء كنت تحتاج إلى فني سباكة، كهربائي، نجار، دهانات، تركيب أرضيات أو تشطيب متكامل، ستجد في بيت الصيانة الحرفي المناسب لتنفيذ العمل بكفاءة.
                  </p>
                </div>
                
                <a href="login.html" className="btn btn-primary" style={{ padding: '15px 35px', borderRadius: '30px', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                  تسجيل دخول لطلب خدمة <i className="ph ph-arrow-left" />
                </a>
              </div>
              <div className="image-content" data-aos="fade-right">
                <img src="/Images/about.webp" alt="بيت الصيانة" className="about-hero-img" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'; }} />
              </div>
            </div>
          </div>
        </section>

        <section className="prob-sol-section bg-light" style={{ padding: '80px 0' }}>
          <div className="container container-narrow">
            <div className="section-header text-center" data-aos="fade-up" style={{ marginBottom: '50px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-dark)' }}>لماذا وُجدت <span className="text-primary">بيت الصيانة</span></h2>
              <p style={{ color: 'var(--text-muted)' }}>يعاني الكثير من أصحاب المنازل من صعوبة العثور على فني موثوق لتنفيذ أعمال الصيانة أو التشطيب، وغالبًا ما يضيع الكثير من الوقت في البحث دون ضمان الحصول على خدمة جيدة.</p>
            </div>

            <div className="prob-sol-wrapper">
              <div className="problem-box" data-aos="fade-left">
                <div className="box-header-new">
                  <div className="icon-circle bg-danger text-white" style={{ width: '40px', height: '40px', fontSize: '1.2rem', margin: '0 0 0 15px' }}>
                    <i className="ph ph-x" />
                  </div>
                  <h2>المشاكل الشائعة</h2>
                </div>
                <ul className="custom-list-new list-danger">
                  <li><span>صعوبة العثور على فني موثوق</span> <i className="ph ph-x text-danger" /></li>
                  <li><span>عدم وضوح الأسعار</span> <i className="ph ph-x text-danger" /></li>
                  <li><span>تأخر تنفيذ الأعمال</span> <i className="ph ph-x text-danger" /></li>
                  <li><span>تجارب غير مرضية مع بعض الحرفيين</span> <i className="ph ph-x text-danger" /></li>
                </ul>
              </div>

              <div className="solution-box text-center" data-aos="fade-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="box-header-new" style={{ justifyContent: 'center', marginBottom: '15px' }}>
                  <div className="icon-circle bg-success text-white" style={{ width: '40px', height: '40px', fontSize: '1.2rem', margin: '0 0 0 15px' }}>
                    <i className="ph ph-check" />
                  </div>
                  <h2>الحل مع بيت الصيانة</h2>
                </div>
                <p className="solution-text" style={{ fontSize: '1rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '20px' }}>
                  جاءت فكرة بيت الصيانة لتجمع الحرفيين المتخصصين في مكان واحد وتمنحك طريقة سهلة للوصول إلى الفني المناسب.
                </p>
                <div className="solution-shield-badge">
                  <i className="ph ph-house-line" />
                </div>
                <a href="login.html" className="btn btn-primary" style={{ width: '100%', borderRadius: '8px', padding: '14px', fontSize: '1.1rem', marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  سجل دخول واطلب خدمتك <i className="ph ph-arrow-left" style={{ marginTop: '4px' }} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="about-services section-padding">
          <div className="container">
            <div className="section-header text-center" data-aos="fade-up" style={{ marginBottom: '50px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-dark)' }}>ماذا يقدم لك <span className="text-primary">بيت الصيانة</span></h2>
              <p style={{ color: 'var(--text-muted)' }}>توفر منصة بيت الصيانة مجموعة واسعة من خدمات الصيانة والتشطيب المنزلي لتساعدك في العثور على الخدمة التي تحتاجها بسهولة.</p>
            </div>

            <div className="about-services-grid-new">
              <a href="technicians.html?service=plumbing" className="about-service-card" data-aos="fade-up" data-aos-delay="100" style={{ textDecoration: 'none' }}>
                <div className="about-service-icon text-primary"><i className="ph ph-drop" /></div>
                <div className="about-service-content">
                  <h3>السباكة</h3>
                  <p>إصلاح التسريبات وتركيب الأدوات الصحية وصيانة أنظمة المياه.</p>
                </div>
              </a>
              
              <a href="technicians.html?service=carpentry" className="about-service-card" data-aos="fade-up" data-aos-delay="200" style={{ textDecoration: 'none' }}>
                <div className="about-service-icon" style={{ color: '#d97706' }}><i className="ph ph-ruler" /></div>
                <div className="about-service-content">
                  <h3>النجارة</h3>
                  <p>تركيب الأبواب والأثاث الخشبي وإصلاح الأعمال الخشبية.</p>
                </div>
              </a>

              <a href="technicians.html?service=paint" className="about-service-card" data-aos="fade-up" data-aos-delay="300" style={{ textDecoration: 'none' }}>
                <div className="about-service-icon text-primary"><i className="ph ph-paint-roller" /></div>
                <div className="about-service-content">
                  <h3>الدهانات</h3>
                  <p>دهانات داخلية وخارجية بتشطيبات احترافية.</p>
                </div>
              </a>

              <a href="technicians.html?service=electricity" className="about-service-card" data-aos="fade-up" data-aos-delay="400" style={{ textDecoration: 'none' }}>
                <div className="about-service-icon" style={{ color: '#d97706' }}><i className="ph ph-lightning" /></div>
                <div className="about-service-content">
                  <h3>الكهرباء</h3>
                  <p>تركيب وصيانة الأعطال الكهربائية وتمديدات الكهرباء المنزلية.</p>
                </div>
              </a>

              <a href="technicians.html?service=flooring" className="about-service-card" data-aos="fade-up" data-aos-delay="500" style={{ textDecoration: 'none' }}>
                <div className="about-service-icon text-primary"><i className="ph ph-squares-four" /></div>
                <div className="about-service-content">
                  <h3>الأرضيات</h3>
                  <p>تركيب السيراميك والبورسلين وصيانة الأرضيات.</p>
                </div>
              </a>

              <a href="technicians.html?service=finishing" className="about-service-card" data-aos="fade-up" data-aos-delay="600" style={{ textDecoration: 'none' }}>
                <div className="about-service-icon" style={{ color: '#d97706' }}><i className="ph ph-house" /></div>
                <div className="about-service-content">
                  <h3>التشطيب المتكامل</h3>
                  <p>تنفيذ أعمال التشطيب للشقق والمكاتب من البداية حتى التسليم.</p>
                </div>
              </a>
            </div>

            <div className="about-service-card-full" data-aos="fade-up" data-aos-delay="700" style={{ marginTop: '40px' }}>
              <div className="full-icon-box">
                <i className="ph ph-wrench" />
              </div>
              <div className="full-content-text">
                <h3>خدمات أخرى</h3>
                <p>هل تبحث عن خدمة مختلفة؟ استعرض الفنيين في مجالات صيانة متنوعة.</p>
              </div>
              <a href="services.html" className="btn btn-primary btn-lg" style={{ borderRadius: '8px', padding: '12px 30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                استعرض الخدمات <i className="ph ph-arrow-left" style={{ marginTop: '4px' }} />
              </a>
            </div>
          </div>
        </section>

        <section className="process section-padding bg-light">
          <div className="container">
            <div className="section-header text-center" data-aos="fade-up">
              <h2>كيف تعمل منصة بيت الصيانة</h2>
            </div>
            <div className="process-steps" style={{ justifyContent: 'center' }}>
              <div className="step" data-aos="fade-up" data-aos-delay="100"><div className="step-num">1</div><p>اختر الخدمة التي تحتاجها</p></div>
              <div className="step" data-aos="fade-up" data-aos-delay="200"><div className="step-num">2</div><p>سجل دخول أو أنشئ حساب عميل</p></div>
              <div className="step" data-aos="fade-up" data-aos-delay="300"><div className="step-num">3</div><p>اطلع على التقييمات والخبرة لكل فني</p></div>
              <div className="step" data-aos="fade-up" data-aos-delay="400"><div className="step-num">4</div><p>تواصل واطلب خدمتك بأمان</p></div>
            </div>
            <div className="text-center" style={{ marginTop: '40px' }} data-aos="fade-up">
              <a href="services.html" className="btn btn-primary" style={{ padding: '12px 30px', borderRadius: '30px', textDecoration: 'none' }}>استعرض الفنيين الآن</a>
            </div>
          </div>
        </section>

        <section className="why-us section-padding">
          <div className="container text-center">
            <div className="section-header" data-aos="fade-up">
              <h2>لماذا يثق المستخدمون في بيت الصيانة</h2>
            </div>
            <div className="why-us-grid">
              <div className="why-item" data-aos="fade-up" data-aos-delay="0"><i className="fas fa-users-cog" /><h4>منصة تجمع أفضل الحرفيين في مختلف المجالات</h4></div>
              <div className="why-item" data-aos="fade-up" data-aos-delay="100"><i className="fas fa-search" /><h4>سهولة العثور على الفني المناسب</h4></div>
              <div className="why-item" data-aos="fade-up" data-aos-delay="200"><i className="fas fa-tools" /><h4>خدمات صيانة متنوعة في مكان واحد</h4></div>
              <div className="why-item" data-aos="fade-up" data-aos-delay="300"><i className="fab fa-whatsapp" /><h4>إمكانية التواصل المباشر مع الفني</h4></div>
              <div className="why-item" data-aos="fade-up" data-aos-delay="400"><i className="fas fa-mobile-alt" /><h4>تجربة استخدام بسيطة وسريعة</h4></div>
            </div>
            <div className="text-center" style={{ marginTop: '40px' }} data-aos="fade-up">
              <a href="services.html" className="btn btn-outline btn-lg">اكتشف خدمات بيت الصيانة</a>
            </div>
          </div>
        </section>

        <section className="section-padding bg-light">
          <div className="container">
            <div className="home-cta" data-aos="fade-up">
              <div className="home-cta-content">
                <h2>جاهز تبدأ؟</h2>
                <p style={{ maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.8 }}>إذا كنت تبحث عن فني موثوق لصيانة منزلك أو تنفيذ أعمال التشطيب، يمكنك الآن تصفح الخدمات المتوفرة في بيت الصيانة واختيار الفني المناسب لك بسهولة.</p>
                <div className="cta-buttons" style={{ marginTop: '30px' }}>
                  <a href="login.html" className="btn btn-white-pill auth-gate-link">سجل دخول الآن</a>
                  <a href="login.html" className="btn btn-dark-pill auth-gate-link">اطلب الخدمة الآن</a>
                </div>
                <p className="final-cta-text" style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '25px' }}>لا تضيع وقتك في البحث، دع بيت الصيانة تساعدك في الوصول إلى الخدمة المناسبة بسرعة.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}

export default AboutPage;
