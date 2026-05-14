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
    appendHeadLink('https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css');
    appendHeadLink('/css/style.css?v=3');
    appendHeadLink('/css/services.css');
    stylesheets.forEach((sheet) => appendHeadLink(sheet));

    const userToken = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    document.querySelectorAll('.auth-gate-link').forEach((link) => {
      if (!userToken) {
        link.innerText = 'تسجيل دخول لطلب خدمة';
        link.href = 'login.html';
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

    const animated = document.querySelectorAll('[data-aos]');
    animated.forEach((el) => {
      const delay = el.getAttribute('data-aos-delay');
      if (delay) el.style.transitionDelay = `${delay}ms`;
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [title, bodyClass, stylesheets.join('|')]);
}

export default useStaticPageSetup;
