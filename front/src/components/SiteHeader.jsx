import { useState, useEffect } from 'react';

function SiteHeader({ active }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userToken = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const getNavCtaData = () => {
    if (!userToken) return { text: 'تسجيل دخول', href: 'login.html' };
    
    if (userRole === 'admin') return { text: 'لوحة التحكم', href: 'admin-dashboard.html' };
    if (userRole === 'technician') return { text: 'حسابي', href: 'technician-dashboard.html' };
    if (userRole === 'customer') return { text: 'حسابي', href: 'customer-profile.html' };
    
    return { text: 'حسابي', href: 'login.html' };
  };

  const navCta = getNavCtaData();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
  };

  return (
    <header className={`header-new ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container-new">
        <div className="nav-wrapper-new">
          <div className="logo-new">
            <a href="index.html">
              <img src="/Images/beit-siyana-logo.png" alt="بيت الصيانة" className="logo-img" style={{ height: '70px', width: 'auto', objectFit: 'contain' }} />
            </a>
          </div>

          <nav className={`nav-links-new ${isMenuOpen ? 'active' : ''}`}>
            <div className="mobile-menu-header">
              <img src="/Images/beit-siyana-logo.png" alt="بيت الصيانة" className="mobile-logo" />
              <button className="mobile-close" onClick={() => setIsMenuOpen(false)}>
                <i className="ph ph-x" />
              </button>
            </div>
            
            <div className="nav-links-inner">
              <a href="index.html" className={active === 'home' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                <i className="ph ph-house" /> الرئيسية
              </a>
              <a href="about.html" className={active === 'about' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                <i className="ph ph-info" /> نبذة عنا
              </a>
              <a href="services.html" className={active === 'services' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                <i className="ph ph-wrench" /> الخدمات
              </a>
              <a href="pricing.html" className={active === 'pricing' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                <i className="ph ph-package" /> الباقات
              </a>
              <a href="support.html" className={active === 'support' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                <i className="ph ph-headset" /> الدعم
              </a>
            </div>

            {userToken && (
              <div className="mobile-menu-footer">
                <button className="mobile-logout" onClick={handleLogout}>
                  <i className="ph ph-sign-out" /> تسجيل الخروج
                </button>
              </div>
            )}
          </nav>

          <div className="nav-actions">
            <a href={navCta.href} className="btn-nav-user nav-cta" onClick={() => setIsMenuOpen(false)}>
              {navCta.text} <i className="ph ph-user" />
            </a>
            <button className="menu-toggle" aria-label="فتح القائمة" onClick={toggleMenu}>
              <i className={isMenuOpen ? "ph ph-x" : "ph ph-list"} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
