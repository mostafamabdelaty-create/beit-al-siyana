import { useEffect } from 'react';

const HEAD_ATTR = 'data-static-page-head';

const appendHeadLink = (href, rel = 'stylesheet') => {
  const existing = document.querySelector(`link[${HEAD_ATTR}="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.setAttribute(HEAD_ATTR, href);
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};

function useStaticPageSetup({ title, bodyClass = '', stylesheets = [] }) {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = bodyClass;

    appendHeadLink('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    appendHeadLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    appendHeadLink('/css/style.css?v=3');
    appendHeadLink('/css/services.css');
    stylesheets.forEach((sheet) => appendHeadLink(sheet));

    const userToken = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const navCta = document.querySelector('.nav-cta');

    if (userToken && navCta) {
      navCta.innerText = userRole === 'admin' ? 'لوحة التحكم' : 'حسابي';
      if (userRole === 'customer') navCta.href = 'customer-profile.html';
      if (userRole === 'technician') navCta.href = 'technician-dashboard.html';
      if (userRole === 'admin') navCta.href = 'admin-dashboard.html';
    }

    document.querySelectorAll('.auth-gate-link').forEach((link) => {
      if (!userToken) {
        link.innerText = 'تسجيل دخول لطلب خدمة';
        link.href = 'login.html';
      }
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    const toggleMenu = () => navLinks?.classList.toggle('active');
    const closeMenu = () => navLinks?.classList.remove('active');

    menuToggle?.addEventListener('click', toggleMenu);
    navItems.forEach((link) => link.addEventListener('click', closeMenu));

    const onScroll = () => {
      const header = document.querySelector('.header');
      if (!header) return;
      header.style.boxShadow =
        window.scrollY > 50
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
    };
    window.addEventListener('scroll', onScroll);

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

    const animated = document.querySelectorAll('[data-aos]');
    animated.forEach((el) => {
      const delay = el.getAttribute('data-aos-delay');
      if (delay) el.style.transitionDelay = `${delay}ms`;
      observer.observe(el);
    });

    return () => {
      menuToggle?.removeEventListener('click', toggleMenu);
      navItems.forEach((link) => link.removeEventListener('click', closeMenu));
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [title, bodyClass, stylesheets.join('|')]);
}

export default useStaticPageSetup;
