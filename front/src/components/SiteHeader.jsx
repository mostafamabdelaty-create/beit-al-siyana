function SiteHeader({ active }) {
  return (
    <header className="header-new">
      <div className="container nav-wrapper-new">
        <a href="index.html" className="logo">
          <img src="/Images/logo.webp" alt="بيت الصيانة" className="site-logo" />
        </a>
        <nav className="nav-links-new">
          <a href="index.html" className={active === 'home' ? 'active' : ''}>الرئيسية</a>
          <a href="about.html" className={active === 'about' ? 'active' : ''}>نبذة عنا</a>
          <a href="services.html" className={active === 'services' ? 'active' : ''}>الخدمات</a>
          <a href="pricing.html" className={active === 'pricing' ? 'active' : ''}>الباقات</a>
          <a href="support.html" className={active === 'support' ? 'active' : ''}>الدعم</a>
        </nav>
        <div className="nav-actions">
          <a href="login.html" className="btn-nav-user nav-cta">
            حسابي <i className="ph ph-user" />
          </a>
          <button className="menu-toggle" aria-label="فتح القائمة">
            <i className="ph ph-list" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
