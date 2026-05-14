import { useEffect, useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { toApiUrl } from '../utils/apiBase';

const HEAD_ATTR = 'data-pricing-head';

const appendHeadLink = (href, rel = 'stylesheet') => {
  const existing = document.querySelector(`link[${HEAD_ATTR}="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.setAttribute(HEAD_ATTR, href);
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};

function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'الباقات - بيت الصيانة';
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = 'page-pricing';

    appendHeadLink('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
    appendHeadLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    appendHeadLink('/css/style.css');
    appendHeadLink('/css/pricing-page.css?v=5');

    // Handle header shadow on scroll
    const onScroll = () => {
      const header = document.querySelector('.site-header');
      if (!header) return;
      header.style.boxShadow =
        window.scrollY > 50
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
          : 'none';
    };
    window.addEventListener('scroll', onScroll);

    const fetchPlans = async () => {
      try {
        const res = await fetch(toApiUrl('/packages'));
        const data = await res.json();
        if (data.success) {
          setPlans(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('تعذر جلب الباقات. ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <SiteHeader active="pricing" />

      <section className="pricing-hero">
        <div className="container">
          <div className="badge-pill">باقات بيت الصيانة</div>
          <h1 className="hero-title">
             اعرض خدماتك على <span>بيت الصيانة...</span><br/>
             واحصل على <span>عملاء جدد</span>
          </h1>
          <p className="hero-subtitle">
            إذا كنت فنياً أو صاحب شركة صيانة، انضم إلى شبكة بيت الصيانة وابدأ في استقبال طلبات العملاء الذين يبحثون عن خدمات موثوقة في منطقتك. وزد من فرص عملك مع عملاء جدد يومياً.
          </p>
          <div className="hero-buttons">
            <a href="join-technician.html" className="btn-orange"><i className="ph ph-users" /> ابدأ الآن واظهر على بيت الصيانة</a>
            <a 
              href="#plans" 
              className="btn-outline-orange"
            >
              <i className="ph ph-check-circle" /> شاهد الباقات
            </a>
          </div>
        </div>
      </section>

      <section className="prob-sol-section">
        <div className="container">
          <div className="prob-sol-grid">
            <div className="sol-box">
              <i className="ph ph-shield-check shield-bg" />
              <div className="sol-box-header">
                <i className="ph-fill ph-check-circle" />
                <h3>الحل مع بيت الصيانة</h3>
              </div>
              <ul className="sol-list">
                <li><i className="ph ph-check-circle" /> منصة آمنة تساعدك على الوصول إلى عملاء جادين</li>
                <li><i className="ph ph-check-circle" /> إدارة سهلة لطلباتك وجدول أعمالك</li>
                <li><i className="ph ph-check-circle" /> تواصل مباشر مع العملاء بدون وسطاء</li>
                <li><i className="ph ph-check-circle" /> تعزيز سمعتك المهنية من خلال التقييمات</li>
                <li><i className="ph ph-check-circle" /> زيادة فرص ظهورك في نتائج البحث المحلية</li>
              </ul>
            </div>

            <div className="prob-box">
              <div className="prob-box-header">
                <i className="ph-fill ph-warning" />
                <h3>المشاكل التي يواجهها الحرفيون</h3>
              </div>
              <ul className="prob-list">
                <li><i className="ph ph-x" /> صعوبة الوصول إلى عملاء جدد بشكل مستمر</li>
                <li><i className="ph ph-x" /> الاعتماد على الإعلانات المكلفة بدون نتائج مضمونة</li>
                <li><i className="ph ph-x" /> عدم وجود منصة تعرض خدماتك بشكل احترافي</li>
                <li><i className="ph ph-x" /> ضعف الثقة من العملاء الجدد</li>
                <li><i className="ph ph-x" /> ضياع وقت في البحث عن عملاء مناسبين</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="pricing-section">
        <div className="container">
          <div className="section-title">اختر الباقة المناسبة <span>لعملك</span></div>
          <div className="section-subtitle">باقات مرنة تناسب جميع الاحتياجات، اختر الباقة التي تساعدك على النمو والوصول لعملاء أكثر</div>

          <div className="pricing-grid">
            {loading ? (
              <div style={{ textAlign: 'center', width: '100%', padding: '40px', fontSize: '1.2rem', color: '#64748b' }}>جاري تحميل الباقات...</div>
            ) : error ? (
              <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#ef4444', fontSize: '1.2rem' }}>{error}</div>
            ) : plans.map(plan => {
              let icon = 'ph-cube';
              if (plan.themeKey === 'professional') icon = 'ph-star';
              if (plan.themeKey === 'premium') icon = 'ph-diamond';
              
              const isPopular = plan.popular || plan.themeKey === 'professional';

              return (
              <div key={plan.id} className={`pricing-card ${isPopular ? 'premium' : ''}`}>
                {isPopular && <div className="popular-badge">الأكثر شيوعاً</div>}
                {plan.badgeText && (
                  <div style={{ 
                    position: 'absolute', 
                    top: isPopular ? '45px' : '20px', 
                    right: '20px', 
                    background: '#ff6b00', 
                    color: 'white', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {plan.badgeText}
                  </div>
                )}
                <div className="plan-name">
                  <i className={`ph ${icon} plan-icon`} /> {plan.name}
                </div>
                <div className="plan-price">{plan.price}</div>
                <div className="plan-period">{plan.price === 0 ? 'مجانية' : `ج.م / ${plan.period === 'yearly' ? 'سنوياً' : 'شهرياً'}`}</div>
                {plan.description && (
                  <p style={{ textAlign: 'center', color: '#666', fontSize: '0.85rem', margin: '10px 0', padding: '0 15px' }}>
                    {plan.description}
                  </p>
                )}
                <div className="plan-divider"></div>
                <ul className="plan-features">
                  {plan.features && plan.features.length > 0 ? plan.features.map((feature, idx) => (
                    <li key={idx} className="">
                      <i className="ph-fill ph-check-circle check" />
                      {feature}
                    </li>
                  )) : (
                    <li className="">
                      <i className="ph-fill ph-check-circle check" />
                      جميع المزايا الأساسية
                    </li>
                  )}
                </ul>
                <a href={`join-technician.html?planId=${plan.id}`} className={`btn-plan ${isPopular ? 'btn-plan-solid' : 'btn-plan-outline'}`}>
                  ابدأ الآن
                </a>
              </div>
            )})}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="dark-cta">
            <div className="dark-cta-pattern"></div>
            <div className="dark-cta-content">
              <div className="dark-cta-title">جاهز <span>تبدأ</span> رحلتك معنا؟</div>
              <div className="dark-cta-desc">
                انضم الآن إلى آلاف الحرفيين الذين يعتمدون على بيت الصيانة لزيادة عملائهم وتطوير أعمالهم بثقة واحترافية.
              </div>
              <div className="dark-cta-buttons">
                <a href="support.html" className="btn-dark-outline"><i className="ph ph-chat-circle-dots" /> تواصل معنا</a>
                <a href="join-technician.html" className="btn-orange"><i className="ph ph-user" /> سجل الآن وابدأ</a>
              </div>
            </div>
            <div className="dark-cta-image" style={{ flex: '0 0 auto', width: '320px' }}>
              <img src="/Images/pricing-cta-team.jpg" alt="Beit Al Siyana Team" style={{ borderRadius: '20px', width: '100%', height: 'auto', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="features-row">
            <div className="feature-item">
              <div className="feature-icon"><i className="ph ph-users" /></div>
              <div className="feature-text">
                <h4>عملاء جدد يومياً</h4>
                <p>احصل على طلبات من عملاء يبحثون عن خدماتك</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="ph ph-star" /></div>
              <div className="feature-text">
                <h4>تقييمات حقيقية</h4>
                <p>بناء سمعتك من خلال تقييمات العملاء</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="ph ph-headset" /></div>
              <div className="feature-text">
                <h4>دعم فني سريع</h4>
                <p>فريقنا جاهز لمساعدتك في أي وقت</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="ph ph-shield-check" /></div>
              <div className="feature-text">
                <h4>آمن وموثوق</h4>
                <p>بياناتك محمية ومعاملاتك آمنة</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="how-to-start">
        <div className="container">
          <div className="section-title">كيف <span>تبدأ؟</span></div>
          <div className="section-subtitle">الانضمام إلى بيت الصيانة بسيط جدًا:</div>
          
          <div className="steps-container">
            <div className="steps-line"></div>



            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon"><i className="ph ph-package" /></div>
              <div className="step-title">اختر الباقة</div>
              <div className="step-desc">اختر الباقة المناسبة لاحتياجاتك وميزانيتك</div>
            </div>


            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon"><i className="ph ph-user" /></div>
              <div className="step-title">سجل حسابك</div>
              <div className="step-desc">قم بإنشاء حسابك وإدخال بياناتك الأساسية</div>
            </div>



            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon"><i className="ph ph-identification-card" /></div>
              <div className="step-title">أكمل ملفك الشخصي</div>
              <div className="step-desc">أضف تخصصك وصور أعمالك وتفاصيل خبرتك</div>
            </div>

            
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon"><i className="ph ph-users-three" /></div>
              <div className="step-title">استقبل العملاء</div>
              <div className="step-desc">يبدأ العملاء في العثور عليك والتواصل معك</div>
            </div>
          
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="green-cta">
            <div className="green-cta-content">
              <div className="green-cta-title">ابدأ الآن في الوصول إلى <span>عملاء جدد</span></div>
              <div className="green-cta-desc">
                إذا كنت فنيًا محترفًا وترغب في الوصول لآلاف العملاء فوراً، يمكنك إنشاء حسابك وإضافة خدماتك بنفسك الآن.
              </div>
              <div className="green-cta-buttons">
                <a href="support.html" className="btn-orange"><i className="ph ph-headset" /> تواصل مع الدعم</a>
                <a href="join-technician.html" className="btn-white"><i className="ph ph-user" /> سجل حسابك الآن</a>
              </div>
              <div className="green-cta-footer">
                <i className="ph ph-check-circle" /> لا تجعل العملاء يبحثون عن غيرك... اجعلهم يجدونك على بيت الصيانة.
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

export default PricingPage;
