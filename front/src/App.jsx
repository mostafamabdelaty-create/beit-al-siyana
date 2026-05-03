import { useEffect } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import TechniciansPage from './pages/TechniciansPage';
import TechnicianProfilePage from './pages/TechnicianProfilePage';
import PricingPage from './pages/PricingPage';
import JoinTechnicianPage from './pages/JoinTechnicianPage';
import LoginPage from './pages/LoginPage';
import RegisterCustomerPage from './pages/RegisterCustomerPage';
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TechnicianDashboardPage from './pages/TechnicianDashboardPage';

const resolveRequestedPage = (pathname) => {
  const raw = (pathname || '/').split('/').pop() || 'index.html';
  const cleaned = raw.split('?')[0].split('#')[0] || 'index.html';
  const withExtension = cleaned.endsWith('.html') ? cleaned : `${cleaned}.html`;
  const normalized = withExtension.replace(/^\/+/, '').replace(/[^a-zA-Z0-9._-]/g, '');

  if (!normalized || normalized.includes('..')) {
    return 'index.html';
  }

  return normalized;
};

function GlobalLinkInterceptor({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      // Find the closest anchor tag
      const a = e.target.closest('a');
      
      // If there's a link and it's not a new tab and not a download
      if (a && a.href && a.target !== '_blank' && !a.hasAttribute('download')) {
        // Only intercept if it's an internal link
        try {
          const url = new URL(a.href);
          if (url.origin === window.location.origin) {
            e.preventDefault();
            
            // Check if it's a hash link on the same page
            if (url.pathname === window.location.pathname && url.hash) {
              navigate(url.pathname + url.search + url.hash, { replace: true });
              const element = document.getElementById(url.hash.substring(1));
              if (element) {
                const y = element.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            } else {
              navigate(url.pathname + url.search + url.hash);
              // Only scroll to top if not a hash link
              if (!url.hash) {
                window.scrollTo(0, 0);
              } else {
                setTimeout(() => {
                  const element = document.getElementById(url.hash.substring(1));
                  if (element) {
                    const y = element.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }, 100);
              }
            }
          }
        } catch (err) {
          // Ignore invalid URLs
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [navigate]);

  return children;
}

function AppRoutes() {
  const location = useLocation();
  const pageName = resolveRequestedPage(location.pathname);

  // Global AOS (Animate on Scroll) Logic
  useEffect(() => {
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

    // Small delay to ensure DOM is fully rendered after route change
    const timeoutId = setTimeout(() => {
      const aosElements = document.querySelectorAll('[data-aos]:not(.visible)');
      aosElements.forEach((element) => {
        const delay = element.getAttribute('data-aos-delay');
        if (delay) element.style.transitionDelay = `${delay}ms`;
        observer.observe(element);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [location.pathname]);

  if (pageName === 'index.html') return <HomePage />;
  if (pageName === 'services.html') return <ServicesPage />;
  if (pageName === 'about.html') return <AboutPage />;
  if (pageName === 'technicians.html') return <TechniciansPage />;
  if (pageName === 'technician-profile.html') return <TechnicianProfilePage />;
  if (pageName === 'pricing.html') return <PricingPage />;
  if (pageName === 'join-technician.html') return <JoinTechnicianPage />;
  if (pageName === 'login.html') return <LoginPage />;
  if (pageName === 'register-customer.html') return <RegisterCustomerPage />;
  if (pageName === 'customer-profile.html') return <CustomerProfilePage />;
  if (pageName === 'admin-dashboard.html') return <AdminDashboardPage />;
  if (pageName === 'technician-dashboard.html') return <TechnicianDashboardPage />;
  if (pageName === 'support.html') return <SupportPage />;
  if (pageName === 'privacy.html') return <PrivacyPage />;
  if (pageName === 'terms.html') return <TermsPage />;

  return <NotFoundPage />;
}

function App() {
  return (
    <BrowserRouter>
      <GlobalLinkInterceptor>
        <AppRoutes />
      </GlobalLinkInterceptor>
    </BrowserRouter>
  );
}

export default App;
