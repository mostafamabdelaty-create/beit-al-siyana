import { useState } from 'react';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import useStaticPageSetup from '../hooks/useStaticPageSetup';

const faqItems = [
  {
    q: 'كيف يمكنني طلب خدمة؟',
    content: (
      <>
        <p>يمكنك طلب الخدمة بسهولة من خلال الخطوات التالية:</p>
        <ul>
          <li><i className="ph ph-check text-success" />تصفح صفحة الخدمات</li>
          <li><i className="ph ph-check text-success" />اختر نوع الخدمة التي تحتاجها</li>
          <li><i className="ph ph-check text-success" />استعرض الفنيين المتخصصين في هذه الخدمة</li>
          <li><i className="ph ph-check text-success" />تواصل مباشرة مع الفني عبر الاتصال أو الواتساب</li>
        </ul>
        <p style={{ fontWeight: 600, color: '#111827', marginTop: '10px' }}>بهذه الطريقة يمكنك الحصول على الخدمة بسرعة وسهولة.</p>
      </>
    )
  },
  {
    q: 'هل يمكنني اختيار الفني الذي أريده؟',
    content: <p>نعم، يمكنك تصفح الفنيين المتخصصين في كل خدمة واختيار الفني المناسب لك بناءً على الخبرة والتقييمات المعروضة.</p>
  },
  {
    q: 'كيف يمكنني التواصل مع الفني؟',
    content: (
      <>
        <p>بعد اختيار الفني المناسب، يمكنك التواصل معه مباشرة من خلال:</p>
        <ul>
          <li><i className="ph ph-phone" style={{ color: '#2563eb' }} />الاتصال الهاتفي</li>
          <li><i className="ph ph-whatsapp-logo text-success" />أو عبر واتساب</li>
        </ul>
      </>
    )
  },
  {
    q: 'هل الخدمات متوفرة في جميع الأوقات؟',
    content: <p>تعتمد مواعيد توفر الخدمة على الفني نفسه، ويمكنك الاتفاق معه مباشرة على الموعد المناسب لتنفيذ العمل.</p>
  }
];

function SupportPage() {
  const [activeFaq, setActiveFaq] = useState(-1);

  useStaticPageSetup({
    title: 'الدعم - بيت الصيانة',
    bodyClass: 'page-support',
    stylesheets: ['/css/support-page.css']
  });

  return (
    <>
      <SiteHeader active="support" />

      <div className="about-wrapper">
        <section className="about-hero" style={{ paddingTop: '150px' }}>
          <div className="container text-center">
            <div data-aos="fade-up">
              <div className="badge-pill">الدعم والمساعدة</div>
              <h1>الدعم <span>والمساعدة</span></h1>
              <p>في بيت الصيانة نسعى لتوفير تجربة استخدام سهلة وسريعة لكل المستخدمين. إذا كنت تحتاج إلى مساعدة في اختيار الخدمة المناسبة أو واجهت أي مشكلة أثناء استخدام المنصة، فريق الدعم لدينا جاهز لمساعدتك.</p>
              <p style={{ marginTop: '15px', fontWeight: 600, color: '#111827' }}>هدفنا هو التأكد من حصولك على الخدمة التي تحتاجها بأفضل تجربة ممكنة.</p>
            </div>
          </div>
        </section>

        <section className="section-padding" style={{ backgroundColor: '#f8fafc' }}>
          <div className="container text-center">
            <div className="section-header text-center" data-aos="fade-up">
              <h2>كيف يمكننا مساعدتك</h2>
              <p>إذا كان لديك أي سؤال أو تحتاج إلى مساعدة، لا تتردد في التواصل معنا.</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginBottom: '40px' }} data-aos="fade-up" data-aos-delay="100">
              <div style={{ flex: 1, minWidth: '200px', maxWidth: '250px', background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}><i className="ph ph-magnifying-glass" style={{ fontSize: '2rem', color: '#FF5C1A', marginBottom: '15px' }} /><p style={{ fontWeight: 600, margin: 0 }}>مساعدتك في اختيار الخدمة المناسبة لمنزلك</p></div>
              <div style={{ flex: 1, minWidth: '200px', maxWidth: '250px', background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}><i className="ph ph-desktop" style={{ fontSize: '2rem', color: '#FF5C1A', marginBottom: '15px' }} /><p style={{ fontWeight: 600, margin: 0 }}>إرشادك لكيفية استخدام المنصة</p></div>
              <div style={{ flex: 1, minWidth: '200px', maxWidth: '250px', background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}><i className="ph ph-question" style={{ fontSize: '2rem', color: '#FF5C1A', marginBottom: '15px' }} /><p style={{ fontWeight: 600, margin: 0 }}>الإجابة عن أي استفسار يخص الخدمات المتوفرة</p></div>
              <div style={{ flex: 1, minWidth: '200px', maxWidth: '250px', background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}><i className="ph ph-chats" style={{ fontSize: '2rem', color: '#FF5C1A', marginBottom: '15px' }} /><p style={{ fontWeight: 600, margin: 0 }}>المساعدة في التواصل مع الفنيين</p></div>
            </div>
          </div>
        </section>

        <section className="faq-section section-padding bg-light">
          <div className="container">
            <div className="section-header text-center" data-aos="fade-up">
              <h2>الأسئلة الشائعة</h2>
              <p>إليك إجابات لأكثر الأسئلة التي يطرحها المستخدمون</p>
            </div>
            <div style={{ maxWidth: '850px', margin: '0 auto', background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }} data-aos="fade-up">
              {faqItems.map((item, index) => {
                const isActive = activeFaq === index;
                return (
                  <div
                    key={item.q}
                    className={`faq-accordion-item${isActive ? ' active' : ''}`}
                  >
                    <button
                      className="faq-accordion-btn"
                      onClick={() => setActiveFaq((prev) => (prev === index ? -1 : index))}
                    >
                      <span>{item.q}</span>
                      <i className="ph ph-caret-down faq-icon" />
                    </button>
                    <div className="faq-accordion-body">
                      {item.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="contact-support-section section-padding">
          <div className="container text-center" data-aos="fade-up">
            <div className="section-header">
              <h2>تواصل مع فريق الدعم</h2>
              <p>إذا لم تجد الإجابة التي تبحث عنها في الأسئلة الشائعة، يمكنك التواصل مع فريق الدعم مباشرة وسنكون سعداء بمساعدتك.</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
              <a href="mailto:support@beitalsiyana.com" style={{ background: '#f8f9fa', padding: '20px 40px', borderRadius: '50px', border: '1px solid #eee', display: 'inline-flex', alignItems: 'center', gap: '15px', textDecoration: 'none', color: 'inherit' }}>
                <i className="ph ph-envelope-simple" style={{ fontSize: '1.5rem', color: '#FF5C1A' }} />
                <span style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'sans-serif' }}>support@beitalsiyana.com</span>
              </a>
              <a href="tel:+201018614843" style={{ background: '#f8f9fa', padding: '20px 40px', borderRadius: '50px', border: '1px solid #eee', display: 'inline-flex', alignItems: 'center', gap: '15px', textDecoration: 'none', color: 'inherit' }}>
                <i className="ph ph-phone" style={{ fontSize: '1.5rem', color: '#FF5C1A' }} />
                <span style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: 'sans-serif' }} dir="ltr">+20 1018614843</span>
              </a>
            </div>
          </div>
        </section>

        <section className="section-padding bg-light">
          <div className="container">
            <div className="home-cta" data-aos="fade-up">
              <div className="home-cta-content">
                <h2>تحتاج إلى مساعدة؟</h2>
                <p style={{ maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.8 }}>إذا كنت غير متأكد من الخدمة المناسبة أو تحتاج إلى مساعدة في العثور على الفني المناسب، يمكنك التواصل معنا وسنساعدك في أسرع وقت.</p>
                <div className="cta-buttons" style={{ marginTop: '30px' }}>
                  <a href="services.html" className="btn btn-white-pill auth-gate-link">تصفح الخدمات الآن</a>
                  <a href="https://wa.me/201018614843?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%A3%D8%AD%D8%AA%D8%A7%D8%AC%20%D8%A5%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9%20%D9%81%D9%8A%20%D9%85%D9%86%D8%B5%D8%A9%20%D8%A8%D9%8A%D8%AA%20%D8%A7%D9%84%D8%B5%D9%8A%D8%A7%D9%86%D8%A9" target="_blank" rel="noreferrer" className="btn btn-dark-pill">تواصل مع الدعم</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="options-cards-section section-padding bg-light">
          <div className="container">
            <div className="section-header text-center" data-aos="fade-up">
              <h2 style={{ color: 'var(--dark-section)', marginBottom: '15px' }}>خيارات الدعم</h2>
              <p style={{ fontSize: '1.1rem', color: '#555', maxWidth: '800px', margin: '0 auto' }}>اختر الخيار المناسب لك للانتقال إلى المعلومات التي تحتاجها.</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', marginTop: '40px' }}>
              <div data-aos="fade-up" data-aos-delay="100" style={{ flex: 1, minWidth: '320px', maxWidth: '500px', background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderTop: '6px solid var(--primary-color)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--secondary-color)', color: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 15px' }}>
                    <i className="ph ph-wrench" />
                  </div>
                  <h3 style={{ color: 'var(--dark-section)', fontSize: '1.5rem' }}>أحتاج إلى خدمة</h3>
                </div>
                <p style={{ color: '#666', marginBottom: '20px', lineHeight: 1.6 }}>إذا كنت تبحث عن فني لتنفيذ أعمال صيانة أو تشطيب في منزلك، يمكنك بسهولة العثور على الحرفي المناسب من خلال منصة بيت الصيانة.</p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '25px', flexGrow: 1 }}>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'start' }}><i className="ph-fill ph-check-circle" style={{ color: '#FF5C1A', marginLeft: '10px', marginTop: '5px' }} /> <span>إنشاء حساب عميل جديد</span></li>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'start' }}><i className="ph-fill ph-check-circle" style={{ color: '#FF5C1A', marginLeft: '10px', marginTop: '5px' }} /> <span>استعراض الفنيين والتقييمات الحقيقية</span></li>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'start' }}><i className="ph-fill ph-check-circle" style={{ color: '#FF5C1A', marginLeft: '10px', marginTop: '5px' }} /> <span>طلب الخدمة مباشرة بعد تسجيل الدخول</span></li>
                  <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'start' }}><i className="ph-fill ph-check-circle" style={{ color: '#FF5C1A', marginLeft: '10px', marginTop: '5px' }} /> <span>تواصل آمن ومباشر عبر واتساب أو الاتصال</span></li>
                </ul>
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '25px', borderRight: '4px solid var(--primary-color)' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--dark-section)', fontSize: '0.95rem' }}>يجب تسجيل الدخول كعميل لتتمكن من رؤية بيانات التواصل مع الفنيين.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: 'auto' }}>
                  <a href="login.html" className="btn btn-dark auth-gate-link" style={{ textAlign: 'center', padding: '12px', borderRadius: '8px', width: '100%' }}>تسجيل دخول لطلب خدمة</a>
                </div>
              </div>

              <div data-aos="fade-up" data-aos-delay="200" style={{ flex: 1, minWidth: '320px', maxWidth: '500px', background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderTop: '6px solid var(--primary-hover)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--secondary-color)', color: 'var(--primary-hover)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 15px' }}>
                    <i className="ph ph-handshake" />
                  </div>
                  <h3 style={{ color: 'var(--dark-section)', fontSize: '1.5rem' }}>أنا مقدم خدمة وأرغب في الانضمام</h3>
                </div>
                <p style={{ color: '#666', marginBottom: '20px', lineHeight: 1.6 }}>إذا كنت تعمل في مجال السباكة، الكهرباء، النجارة، الدهانات، الأرضيات أو التشطيب وترغب في الوصول إلى عملاء جدد، يمكنك الانضمام إلى منصة بيت الصيانة.</p>
                <p style={{ color: '#666', marginBottom: '20px', lineHeight: 1.6 }}>نحن نعرض الحرفيين المتخصصين على الموقع ليتمكن العملاء من العثور عليهم بسهولة والتواصل معهم مباشرة.</p>
                <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '25px', borderRight: '4px solid var(--primary-color)' }}>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--dark-section)', fontSize: '0.95rem' }}>للانضمام إلى المنصة، يمكنك التواصل معنا وإرسال بياناتك وسنقوم بإضافة ملفك التعريفي إلى الموقع.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: 'auto' }}>
                  <a href="join-technician.html" className="btn btn-primary" style={{ textAlign: 'center', padding: '12px', borderRadius: '8px', width: '100%', color: 'white', border: 'none' }}>انضم كفني في بيت الصيانة</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}

export default SupportPage;
