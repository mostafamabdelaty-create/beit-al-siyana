function SiteFooter({ legal = false }) {
  if (legal) {
    return (
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">
                <img src="/Images/logo.svg" alt="بيت الصيانة" className="site-logo-footer" />
              </div>
              <p className="footer-about">المنصة الأولى لخدمات الصيانة المنزلية في مصر، تهدف لرفع كفاءة الخدمات وتسهيل الوصول للحرفيين المهرة.</p>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">روابط سريعة</h4>
              <ul className="footer-links">
                <li><a href="about.html">عن المنصة</a></li>
                <li><a href="terms.html">شروط الاستخدام</a></li>
                <li><a href="privacy.html">سياسة الخصوصية</a></li>
                <li><a href="join-technician.html">انضم كصنايعي</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">تواصل معنا</h4>
              <ul className="footer-contact">
                <li><i className="fas fa-phone-alt text-primary" /> <span dir="ltr">+20 1018614843</span></li>
                <li><i className="fas fa-envelope text-primary" /> <span dir="ltr">info@beitalsiyana.com</span></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 بيت الصيانة. جميع الحقوق محفوظة. المنصة الأولى لخدمات الصيانة المنزلية في مصر.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer-new">
      <div className="container">
        <div className="footer-grid-new">
          {/* Logo & About Column (Right) */}
          <div className="footer-col-about" data-aos="fade-up" data-aos-delay="100">
            <div className="footer-logo">
              <img src="/Images/logo.svg" alt="بيت الصيانة" className="site-logo-footer" />
            </div>
            <p className="footer-about-text">
              المنصة الرائدة في خدمات الصيانة المنزلية. نوفر لك أفضل الفنيين لتقديم خدمات احترافية موثوقة بأعلى معايير الجودة لتسهيل حياتك.
            </p>
          </div>

          {/* Quick Links Column (Middle) */}
          <div className="footer-col-links" data-aos="fade-up" data-aos-delay="200">
            <h4 className="footer-heading-new">روابط سريعة</h4>
            <ul className="footer-links-new">
              <li><i className="ph ph-caret-left" /><a href="about.html">عن المنصة</a></li>
              <li><i className="ph ph-caret-left" /><a href="terms.html">شروط الاستخدام</a></li>
              <li><i className="ph ph-caret-left" /><a href="privacy.html">سياسة الخصوصية</a></li>
              <li><i className="ph ph-caret-left" /><a href="join-technician.html">انضم كصنايعي</a></li>
            </ul>
          </div>

          {/* Contact Column (Left) */}
          <div className="footer-col-contact" data-aos="fade-up" data-aos-delay="300">
            <h4 className="footer-heading-new">تواصل معنا</h4>
            <ul className="footer-contact-new">
              <li>
                <div className="contact-icon-box"><i className="ph ph-phone" /></div>
                <span dir="ltr">+20 1018614843</span>
              </li>
              <li>
                <div className="contact-icon-box"><i className="ph ph-envelope-simple" /></div>
                <span dir="ltr">info@beitalsiyana.com</span>
              </li>

            </ul>
          </div>
        </div>

        <div className="footer-bottom-new">
          <p>&copy; 2025 بيت الصيانة. جميع الحقوق محفوظة.</p>
          <div className="footer-bottom-links-new">
            <a href="terms.html">الشروط</a>
            <span className="separator">|</span>
            <a href="privacy.html">الخصوصية</a>
            <span className="separator">|</span>
            <a href="support.html">الدعم</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
