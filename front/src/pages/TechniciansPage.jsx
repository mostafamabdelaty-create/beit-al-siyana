import { useEffect, useMemo, useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { toApiUrl, toMediaUrl } from '../utils/apiBase';

const HEAD_ATTR = 'data-technicians-head';
const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const serviceNames = {
  plumbing: 'السباكة',
  carpentry: 'النجارة',
  paint: 'الدهانات',
  electricity: 'الكهرباء',
  flooring: 'الأرضيات',
  finishing: 'التشطيب المتكامل',
  other: 'خدمات أخرى'
};

const serviceSearchMap = {
  plumbing: 'سباكة',
  carpentry: 'نجارة',
  paint: 'دهانات',
  electricity: 'كهرباء',
  flooring: 'أرضيات',
  finishing: 'تشطيب',
  other: 'أخرى'
};

const centers = [
  'مركز ناصر',
  'مركز ببا',
  'مركز إهناسيا',
  'مركز سمسطا',
  'مركز الفشن',
  'مركز بني سويف'
];

const normalizeDigits = (value) => String(value || '').replace(/\D/g, '');

const resolvePlanTheme = (plan) => {
  const themeKey = plan?.themeKey || 'starter';
  const defaults = {
    starter: {
      accentColor: '#3b82f6',
      gradientFrom: '#eff6ff',
      gradientTo: '#dbeafe',
      className: 'plan-theme-starter'
    },
    professional: {
      accentColor: '#2563eb',
      gradientFrom: '#dbeafe',
      gradientTo: '#bfdbfe',
      className: 'plan-theme-professional'
    },
    premium: {
      accentColor: '#7c3aed',
      gradientFrom: '#f3e8ff',
      gradientTo: '#e9d5ff',
      className: 'plan-theme-premium'
    },
    custom: {
      accentColor: '#0f766e',
      gradientFrom: '#ccfbf1',
      gradientTo: '#99f6e4',
      className: 'plan-theme-custom'
    }
  };

  const base = defaults[themeKey] || defaults.starter;
  return {
    accentColor: plan?.style?.accentColor || base.accentColor,
    gradientFrom: plan?.style?.gradientFrom || base.gradientFrom,
    gradientTo: plan?.style?.gradientTo || base.gradientTo,
    className: base.className
  };
};

const appendHeadLink = (href, rel = 'stylesheet') => {
  const existing = document.querySelector(`link[${HEAD_ATTR}="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.setAttribute(HEAD_ATTR, href);
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};

function TechniciansPage() {
  const [allTechnicians, setAllTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [govFilter, setGovFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [expFilter, setExpFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const userToken = localStorage.getItem('token');

  const serviceKey = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('service') || 'plumbing';
  }, []);

  const serviceLabel = serviceNames[serviceKey] || 'الصيانة';

  useEffect(() => {
    document.title = `بيت الصيانة | فنيون ${serviceLabel}`;
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = 'page-services page-technicians';

    appendHeadLink('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    appendHeadLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    appendHeadLink('/css/style.css');
    appendHeadLink('/css/services.css');
    appendHeadLink('/css/plumbing.css');

    return () => {};
  }, [serviceLabel, userToken]);

  useEffect(() => {
    let cancelled = false;

    const loadTechnicians = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const searchTerm = serviceSearchMap[serviceKey] || serviceSearchMap.plumbing;
        const response = await fetch(toApiUrl(`/technicians/service/${encodeURIComponent(searchTerm)}`));
        const result = await response.json();

        if (cancelled) return;

        if (result.success && Array.isArray(result.data)) {
          setAllTechnicians(result.data);
          setFilteredTechnicians(result.data);
        } else {
          setAllTechnicians([]);
          setFilteredTechnicians([]);
        }
      } catch (error) {
        if (cancelled) return;
        console.error('Error loading technicians:', error);
        setLoadError('حدث خطأ أثناء تحميل البيانات.');
        setAllTechnicians([]);
        setFilteredTechnicians([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadTechnicians();

    return () => {
      cancelled = true;
    };
  }, [serviceKey]);

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

    const aosElements = document.querySelectorAll('[data-aos]');
    aosElements.forEach((element) => {
      const delay = element.getAttribute('data-aos-delay');
      if (delay) element.style.transitionDelay = `${delay}ms`;
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [filteredTechnicians, isLoading]);

  const applyFilters = () => {
    const next = allTechnicians.filter((tech) => {
      const ratingValue = parseFloat(tech.rating ?? '0') || 0;
      const experienceValue = parseFloat(tech.experience ?? '0') || 0;
      const locationText = tech.location || '';

      if (govFilter !== 'all' && !locationText.includes(govFilter)) return false;
      if (ratingFilter !== 'all' && ratingValue < parseFloat(ratingFilter)) return false;
      if (expFilter !== 'all' && experienceValue < parseFloat(expFilter)) return false;

      return true;
    });

    setFilteredTechnicians(next);
    document.querySelector('.tech-grid-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const trackRequest = async (techId) => {
    try {
      await fetch(toApiUrl(`/technicians/${techId}/track-request`), { method: 'POST' });
    } catch (err) {
      console.warn('Tracking failed:', err);
    }
  };

  const renderTechCard = (tech, index) => {
    const theme = resolvePlanTheme(tech.plan);
    const waNumber = normalizeDigits(tech.whatsapp || tech.phone || '');
    const phone = tech.phone || '';
    const displaySpecialty = tech.specialty === 'أخرى'
      ? (tech.customSpecialty || 'خدمات أخرى')
      : (tech.specialty || 'فني صيانة');

    const profileHref = `technician-profile.html?id=${tech.id || tech._id || ''}`;

    return (
      <div
        key={tech.id || tech._id || `${tech.name}-${index}`}
        className={`tech-card ${theme.className}`}
        data-aos="fade-up"
        data-aos-delay={(index + 1) * 100}
        style={{
          '--plan-accent': theme.accentColor,
          '--plan-grad-from': theme.gradientFrom,
          '--plan-grad-to': theme.gradientTo
        }}
        onClick={() => {
          window.location.href = profileHref;
        }}
      >
        <img
          src={tech.profileImage ? toMediaUrl(tech.profileImage) : DEFAULT_AVATAR}
          alt={tech.name || 'فني'}
          className="tech-img"
          onError={(event) => {
            event.currentTarget.src = DEFAULT_AVATAR;
          }}
        />

        <div className="tech-content">
          <div className="tech-header-info">
            <h3 className="tech-name">{tech.name}</h3>
            <div className="tech-badges">
              {tech.plan ? (
                <span
                  className="plan-badge"
                  style={{
                    background: theme.gradientFrom,
                    color: theme.accentColor,
                    borderColor: theme.accentColor
                  }}
                >
                  {tech.plan.badgeText || tech.plan.name}
                </span>
              ) : null}

              {tech.isTrusted ? (
                <span className="verified-badge"><i className="fas fa-check-circle" /> هوية موثقة</span>
              ) : null}
            </div>
          </div>

          <div className="tech-meta">
            <span className="rating"><i className="fas fa-star" /> {tech.rating || 'جديد'} ({tech.reviewsCount || '0'} تقييم)</span>
            <span className="requests" style={{ color: '#ea580c', fontWeight: '700' }}><i className="fas fa-paper-plane" /> {tech.requestCount || 0} طلب</span>
            <span><i className="fas fa-briefcase" /> {displaySpecialty}</span>
            <span><i className="far fa-clock" /> خبرة {tech.experience || 0} سنة</span>
            <span><i className="fas fa-map-marker-alt" /> {tech.location || 'غير محدد'}</span>
          </div>

          <p className="tech-desc">{tech.bio || 'متخصص في أعمال التأسيس والصيانة باحترافية.'}</p>

          <div className="tech-actions">
            {userToken ? (
              <>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                  onClick={(event) => {
                    event.stopPropagation();
                    trackRequest(tech.id || tech._id);
                  }}
                >
                  <i className="fab fa-whatsapp" style={{ fontSize: '1.2rem' }} /> واتساب
                </a>
                <a
                  href={`tel:${phone}`}
                  className="btn-call"
                  onClick={(event) => {
                    event.stopPropagation();
                    trackRequest(tech.id || tech._id);
                  }}
                >
                  <i className="fas fa-phone-alt" /> اتصال
                </a>
              </>
            ) : (
              <a
                href="login.html"
                className="btn-call"
                style={{ background: '#111827', width: '100%', justifyContent: 'center' }}
                onClick={(event) => event.stopPropagation()}
              >
                <i className="fas fa-lock" /> تسجيل دخول للتواصل
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SiteHeader active="services" />

      <div className="about-wrapper">
        <section className="plumbing-header-section">
          <div className="container" data-aos="fade-down">
            <div className="plumbing-header-row">
              <a href="services.html" className="back-to-services-btn">
                <i className="fas fa-arrow-right" />
                العودة إلى الخدمات
              </a>
              <h1 id="serviceTitle">فنيون {serviceLabel}</h1>
            </div>
          </div>
        </section>

        <section className="filter-section container" data-aos="fade-up" style={{ position: 'relative', zIndex: 10 }}>
          <div className="filter-wrapper">
            <div className="filter-group" style={{ flex: 2 }}>
              <label className="filter-group-label">المركز / المنطقة</label>
              <select className="filter-select" value={govFilter} onChange={(e) => setGovFilter(e.target.value)}>
                <option value="all">كل المراكز</option>
                {centers.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>

            <div className="filter-group" style={{ flex: 2 }}>
              <label className="filter-group-label text-center">التقييم</label>
              <select className="filter-select" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                <option value="all">كل التقييمات</option>
                <option value="4.5">4.5+ نجوم</option>
                <option value="4.0">4.0+ نجوم</option>
                <option value="3.5">3.5+ نجوم</option>
                <option value="3.0">3.0+ نجوم</option>
              </select>
            </div>

            <div className="filter-group" style={{ flex: 2 }}>
              <label className="filter-group-label text-center">سنوات الخبرة</label>
              <select className="filter-select" value={expFilter} onChange={(e) => setExpFilter(e.target.value)}>
                <option value="all">كل الخبرات</option>
                <option value="1">1+ سنة</option>
                <option value="3">3+ سنوات</option>
                <option value="5">5+ سنوات</option>
                <option value="10">10+ سنوات</option>
              </select>
            </div>

            <div className="filter-group" style={{ flex: 1.5, alignSelf: 'flex-end' }}>
              <button className="filter-submit-btn" onClick={applyFilters}>
                <i className="fas fa-sliders-h" /> تصفية النتائج
              </button>
            </div>
          </div>
        </section>

        <section className="tech-grid-section">
          <div className="container">
            <div className="tech-grid" id="techGrid">
              {isLoading ? <div className="loading-state">جاري التحميل...</div> : null}
              {!isLoading && !loadError && filteredTechnicians.map(renderTechCard)}
              {!isLoading && !loadError && filteredTechnicians.length === 0 ? (
                <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px', color: '#64748b' }}>
                  لا يوجد فنيون حالياً في هذا القسم.
                </div>
              ) : null}
              {!isLoading && loadError ? (
                <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px', color: '#ef4444' }}>
                  {loadError}
                </div>
              ) : null}
            </div>

            {!isLoading && !loadError && filteredTechnicians.length === 0 && allTechnicians.length > 0 ? (
              <div id="noResultsMsg" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                لم يتم العثور على فنيين يطابقون خيارات التصفية هذه.
              </div>
            ) : null}
          </div>
        </section>

        <div className="container bottom-back-wrapper">
          <a href="services.html" className="back-to-services-btn">
            <i className="fas fa-arrow-right" />
            العودة إلى الخدمات
          </a>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}

export default TechniciansPage;
