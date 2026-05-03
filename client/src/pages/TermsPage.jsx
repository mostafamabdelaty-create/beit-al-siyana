import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import useStaticPageSetup from '../hooks/useStaticPageSetup';

function TermsPage() {
  useStaticPageSetup({
    title: 'شروط الاستخدام - بيت الصيانة',
    bodyClass: 'page-legal',
    stylesheets: ['/css/legal-page.css']
  });

  return (
    <>
      <SiteHeader />

      <div className="about-wrapper">
        <section className="about-hero" style={{ padding: '140px 0 60px', background: 'linear-gradient(135deg, var(--dark-section) 0%, var(--primary-hover) 100%)' }}>
          <div className="container text-center" data-aos="fade-up">
            <div className="badge-pill">قوانين المنصة</div>
            <h1 style={{ color: 'white' }}>شروط <span>الاستخدام</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '700px', margin: '20px auto 0' }}>يرجى قراءة شروط الاستخدام بعناية قبل استخدام خدمات منصة بيت الصيانة.</p>
          </div>
        </section>

        <section className="legal-content">
          <div className="container container-narrow">
            <div className="card" style={{ padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h2>1. قبول الشروط</h2>
              <p>باستخدامك لمنصة بيت الصيانة، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام المنصة.</p>

              <h2>2. وصف الخدمة</h2>
              <p>بيت الصيانة هي منصة إلكترونية تربط بين العملاء والحرفيين (الفنيين). المنصة توفر أدوات للبحث، التواصل، وتقييم الخدمات، ولكنها لا تتدخل بشكل مباشر في الاتفاقات المالية أو تنفيذ الأعمال بين الطرفين.</p>

              <h2>3. حسابات المستخدمين</h2>
              <ul>
                <li>يجب تقديم معلومات دقيقة وصحيحة عند إنشاء الحساب.</li>
                <li>المستخدم مسؤول عن الحفاظ على سرية بيانات دخوله.</li>
                <li>يُمنع استخدام الحساب في أغراض غير قانونية أو تضر بالمنصة.</li>
              </ul>

              <h2>4. نظام الاشتراكات</h2>
              <p>توفر المنصة باقات اشتراك متنوعة للفنيين لضمان ظهورهم للعملاء. تخضع هذه الاشتراكات لسياسة الدفع الموضحة في صفحة الباقات، ولا تُرد المبالغ المدفوعة إلا في حالات استثنائية تقررها إدارة المنصة.</p>

              <h2>5. المسؤولية القانونية</h2>
              <p>المنصة غير مسؤولة عن جودة العمل المنفذ بواسطة الفنيين أو عن أي خلافات تنشأ بين العميل والفني. ننصح دائماً بالاطلاع على تقييمات الفني قبل التعاقد معه.</p>

              <h2>6. التعديلات</h2>
              <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إخطار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني أو تنبيه على المنصة.</p>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter legal />
    </>
  );
}

export default TermsPage;
