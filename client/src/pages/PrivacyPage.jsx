import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';
import useStaticPageSetup from '../hooks/useStaticPageSetup';

function PrivacyPage() {
  useStaticPageSetup({
    title: 'سياسة الخصوصية - بيت الصيانة',
    bodyClass: 'page-legal',
    stylesheets: ['/css/legal-page.css']
  });

  return (
    <>
      <SiteHeader />

      <div className="about-wrapper">
        <section className="about-hero" style={{ padding: '140px 0 60px', background: 'linear-gradient(135deg, var(--dark-section) 0%, var(--primary-hover) 100%)' }}>
          <div className="container text-center" data-aos="fade-up">
            <div className="badge-pill">حماية البيانات</div>
            <h1 style={{ color: 'white' }}>سياسة <span>الخصوصية</span></h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '700px', margin: '20px auto 0' }}>نحن في بيت الصيانة نلتزم بحماية خصوصيتك وضمان أمان بياناتك الشخصية.</p>
          </div>
        </section>

        <section className="legal-content">
          <div className="container container-narrow">
            <div className="card" style={{ padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h2>1. البيانات التي نجمعها</h2>
              <p>نجمع البيانات التي تقدمها لنا عند إنشاء حسابك، مثل:</p>
              <ul>
                <li>الاسم الكامل.</li>
                <li>رقم الهاتف.</li>
                <li>البريد الإلكتروني.</li>
                <li>الموقع الجغرافي أو العنوان.</li>
                <li>التخصص وسنوات الخبرة (للفنيين فقط).</li>
              </ul>

              <h2>2. كيف نستخدم بياناتك</h2>
              <p>نستخدم هذه البيانات للأغراض التالية:</p>
              <ul>
                <li>تسهيل التواصل بين العميل والفني.</li>
                <li>تحسين جودة الخدمات المقدمة على المنصة.</li>
                <li>إرسال تنبيهات هامة بخصوص الحساب أو الاشتراكات.</li>
                <li>عرض ملفات الفنيين للعملاء الباحثين عن الخدمة.</li>
              </ul>

              <h2>3. مشاركة البيانات</h2>
              <p>لا نقوم ببيع بياناتك لأطراف خارجية. يتم عرض بيانات التواصل (مثل الهاتف) للفنيين المشتركين في الباقات فقط للعملاء المسجلين لتمكين طلب الخدمة.</p>

              <h2>4. أمن المعلومات</h2>
              <p>نستخدم تقنيات حماية متقدمة لضمان عدم تسرب بياناتك أو الوصول إليها من قبل جهات غير مصرح لها. ومع ذلك، لا يوجد نظام أمان إلكتروني آمن بنسبة 100%، لذا ننصحك دائماً بالحفاظ على سرية كلمة مرورك.</p>

              <h2>5. ملفات تعريف الارتباط (Cookies)</h2>
              <p>نستخدم ملفات تعريف الارتباط لتحسين تجربة تصفحك للمنصة وتذكر تفضيلاتك عند تسجيل الدخول.</p>

              <h2>6. حقوقك</h2>
              <p>لديك الحق في تعديل بياناتك أو طلب حذف حسابك في أي وقت من خلال إعدادات البروفايل أو التواصل مع فريق الدعم الفني.</p>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter legal />
    </>
  );
}

export default PrivacyPage;
