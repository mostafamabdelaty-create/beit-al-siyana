import { useEffect, useMemo, useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { toApiUrl, toMediaUrl } from '../utils/apiBase';

const HEAD_ATTR = 'data-tech-profile-head';
const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const normalizeDigits = (value) => String(value || '').replace(/\D/g, '');

const parseMediaPath = (path) => {
  if (!path) return '';
  return toMediaUrl(path);
};

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

function TechnicianProfilePage() {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const userToken = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = Boolean(userToken);
  const isCustomer = isLoggedIn && userRole === 'customer';

  const techId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || '';
  }, []);

  const theme = useMemo(() => resolvePlanTheme(profile?.plan), [profile?.plan]);

  const displaySpecialty = useMemo(() => {
    if (!profile) return 'فني صيانة';

    const specialtyVal = profile.specialty || profile.profile?.specialty;
    const customSpecialtyVal = profile.customSpecialty || profile.profile?.customSpecialty;

    return specialtyVal === 'أخرى'
      ? (customSpecialtyVal || 'خدمات أخرى')
      : (specialtyVal || 'فني صيانة');
  }, [profile]);

  const services = useMemo(() => {
    if (!profile) return [];

    const customSpecialtyVal = profile.customSpecialty || profile.profile?.customSpecialty;
    const rawServices = profile.services || profile.profile?.services || [];
    if (!Array.isArray(rawServices) || rawServices.length === 0) {
      return ['خدمات الصيانة الفورية'];
    }

    return rawServices.map((service) => {
      const name = service?.name || service;
      if (name === 'أخرى' && customSpecialtyVal) return customSpecialtyVal;
      return name;
    });
  }, [profile]);

  const images = useMemo(() => {
    if (!profile) return [];
    const list = profile.gallery || profile.profile?.galleryImages || [];
    return Array.isArray(list) ? list : [];
  }, [profile]);

  const videos = useMemo(() => {
    if (!profile) return [];
    const list = profile.videos || profile.profile?.galleryVideos || [];
    return Array.isArray(list) ? list : [];
  }, [profile]);

  const showGallery = Boolean(profile?.plan?.benefits?.workImages) || images.length > 0;
  const showVideos = Boolean(profile?.plan?.benefits?.workVideos) || videos.length > 0;

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((acc, item) => acc + (item.rating || 0), 0);
    return total / reviews.length;
  }, [reviews]);

  const summaryStars = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNum = index + 1;
      if (starNum <= Math.floor(averageRating)) return 'full';
      if (starNum - averageRating < 1) return 'half';
      return 'empty';
    });
  }, [averageRating]);
  const backToServiceLink = useMemo(() => {
    if (!profile) return 'technicians.html';
    
    const specialtyMap = {
      'سباكة': 'plumbing',
      'كهرباء': 'electricity',
      'نجارة': 'carpentry',
      'دهانات': 'paint',
      'أرضيات': 'flooring',
      'تشطيب': 'finishing',
      'أخرى': 'other'
    };

    const specialty = profile.specialty || profile.profile?.specialty || 'plumbing';
    const service = specialtyMap[specialty] || 'plumbing';
    return `technicians.html?service=${service}`;
  }, [profile]);

  const phone = profile?.phone || '';
  const phoneDigits = normalizeDigits(phone);
  const waMessage = encodeURIComponent(`مرحباً ${profile?.name || ''} ، أريد الاستفسار عن خدمة من بيت الصيانة`);
  const callHref = `tel:${phone}`;
  const waHref = `https://wa.me/${phoneDigits}?text=${waMessage}`;

  const trackRequest = async () => {
    if (!techId) return;
    try {
      await fetch(toApiUrl(`/technicians/${techId}/track-request`), { method: 'POST' });
      // Optional: Update local state if you want to show it immediately
      setProfile(prev => prev ? { ...prev, requestCount: (prev.requestCount || 0) + 1 } : prev);
    } catch (err) {
      console.warn('Tracking failed:', err);
    }
  };

  useEffect(() => {
    document.title = 'بطاقة الفني - بيت الصيانة';
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = '';

    appendHeadLink('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    appendHeadLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    appendHeadLink('/css/style.css');
    appendHeadLink('/css/services.css');
    appendHeadLink('/css/technician-profile.css');

    const navCta = document.querySelector('.nav-cta');
    if (isLoggedIn && navCta) {
      navCta.innerText = userRole === 'admin' ? 'لوحة التحكم' : 'حسابي';
      if (userRole === 'customer') navCta.href = 'customer-profile.html';
      if (userRole === 'technician') navCta.href = 'technician-dashboard.html';
      if (userRole === 'admin') navCta.href = 'admin-dashboard.html';
    }

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

    return () => {
      menuToggle?.removeEventListener('click', toggleMenu);
      navItems.forEach((link) => link.removeEventListener('click', closeMenu));
      window.removeEventListener('scroll', onScroll);
    };
  }, [isLoggedIn, userRole]);

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

    const animated = document.querySelectorAll('[data-aos]');
    animated.forEach((el) => {
      const delay = el.getAttribute('data-aos-delay');
      if (delay) el.style.transitionDelay = `${delay}ms`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [profile, reviews]);

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      if (!techId) return;
      try {
        const response = await fetch(toApiUrl(`/reviews/technician/${techId}`));
        const result = await response.json();
        if (cancelled) return;
        if (result.success && Array.isArray(result.data)) {
          setReviews(result.data);
        } else {
          setReviews([]);
        }
      } catch (err) {
        if (!cancelled) setReviews([]);
      }
    };

    const loadProfile = async () => {
      if (!techId) {
        setError('لم يتم تحديد الفني المطلوب.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(toApiUrl(`/technicians/${techId}`));
        const result = await response.json();
        if (cancelled) return;

        if (result.success && result.data) {
          setProfile(result.data);
          document.title = `${result.data.name || 'بطاقة الفني'} - بيت الصيانة`;
        } else {
          setError('تعذر تحميل بيانات الفني.');
        }
      } catch (err) {
        if (!cancelled) {
          setError('حدث خطأ أثناء تحميل البيانات.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadProfile();
    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [techId]);

  const submitReview = async () => {
    if (!selectedRating || !reviewText.trim()) {
      alert('يرجى اختيار التقييم وكتابة تعليقك');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const response = await fetch(toApiUrl('/reviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
        body: JSON.stringify({
          technicianId: techId,
          rating: selectedRating,
          comment: reviewText.trim()
        })
      });

      const result = await response.json();
      if (!result.success) {
        alert(result.message || 'فشل إضافة التقييم');
        return;
      }

      alert('تم إضافة تقييمك بنجاح');
      setSelectedRating(0);
      setReviewText('');

      const reviewsResponse = await fetch(toApiUrl(`/reviews/technician/${techId}`));
      const reviewsResult = await reviewsResponse.json();
      if (reviewsResult.success && Array.isArray(reviewsResult.data)) {
        setReviews(reviewsResult.data);
      }
    } catch (err) {
      alert('حدث خطأ أثناء الإرسال');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const goBack = (event) => {
    event.preventDefault();
    window.history.back();
  };

  return (
    <>
      <SiteHeader />

      <section style={{ paddingTop: '100px', paddingBottom: '20px', position: 'relative', zIndex: 100 }}>
        <div className="container">
          <a 
            href={backToServiceLink} 
            className="back-link-modern" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px', 
              color: '#1e293b', 
              textDecoration: 'none', 
              fontWeight: '800', 
              fontSize: '0.9rem', 
              background: '#ffffff', 
              padding: '10px 20px', 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-arrow-right" style={{ color: '#FF5C1A' }} />
            <span>العودة إلى قائمة الفنيين</span>
          </a>
        </div>
      </section>

      <section style={{ padding: '0 0 30px' }}>
        <div className="container">
          <div
            className={`profile-hero ${theme.className}`}
            style={{
              '--plan-accent': theme.accentColor,
              '--plan-grad-from': theme.gradientFrom,
              '--plan-grad-to': theme.gradientTo
            }}
          >
            <div className="profile-hero-top">
              <div className="profile-img-wrap" style={{ background: '#f1f5f9' }}>
                <img
                  src={parseMediaPath(profile?.photo || profile?.profileImage || profile?.profile?.profileImage || DEFAULT_AVATAR)}
                  alt={profile?.name || 'صنايعي'}
                  onError={(event) => {
                    event.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
              </div>
              <div className="profile-info">
                <div className="badge-row">
                  {profile?.plan?.name ? (
                    <div
                      className="plan-badge-pill"
                      style={{
                        background: theme.gradientFrom,
                        color: theme.accentColor,
                        borderColor: theme.accentColor
                      }}
                    >
                      {profile.plan.badgeText || profile.plan.name}
                    </div>
                  ) : null}
                  {profile?.isTrusted ? (
                    <div className="verified-pill"><i className="fas fa-check-circle" /> هوية موثقة</div>
                  ) : null}
                </div>
                <h1>{profile?.name || 'جاري التحميل...'}</h1>
                <div className="profile-meta">
                  <span className="rating-star"><i className="fas fa-star" /> {profile?.rating ?? profile?.averageRating ?? 'جديد'}</span>
                  <span className="reviews-count"><i className="fas fa-comments" /> {profile?.reviewsCount ?? profile?.totalReviews ?? '0'} تقييم</span>
                  <span><i className="fas fa-briefcase" /> {displaySpecialty}</span>
                  <span><i className="fas fa-map-marker-alt" /> {profile?.location || 'غير محدد'}</span>
                  <span><i className="fas fa-clock" /> خبرة {profile?.experience || 0} سنة</span>
                </div>
                <div id="profSubInfo" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '25px', padding: '15px', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px', fontSize: '0.9rem' }}>
                  <span style={{ color: '#9a3412', fontWeight: 800 }}><i className="fas fa-paper-plane" /> إجمالي الطلبات: {profile?.requestCount || 0} طلب</span>
                  <span style={{ color: '#166534', fontWeight: 700 }}><i className="fas fa-crown" /> الباقة: {profile?.plan?.name || 'مجانية'}</span>
                  <span style={{ color: '#166534' }}>
                    <i className="fas fa-calendar-alt" /> عضو منذ:{' '}
                    {profile?.subscriptionStartDate
                      ? new Date(profile.subscriptionStartDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })
                      : '-'}
                  </span>
                  {profile?.subscriptionExpiry ? (
                    <span style={{ color: '#166534', fontWeight: 700 }}>
                      <i className="fas fa-hourglass-half" /> متبقي:{' '}
                      {Math.max(0, Math.ceil((new Date(profile.subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24)))} يوم
                    </span>
                  ) : null}
                </div>
                <p className="profile-short-desc">
                  {profile?.bio || 'فني متخصص في تقديم خدمات الصيانة وإصلاح الأعطال بدقة واحترافية.'}
                </p>
              </div>
            </div>

            <div
              className="profile-contact-bar"
              id="profileContactBar"
              style={{
                '--plan-accent': theme.accentColor,
                '--plan-grad-from': theme.gradientFrom,
                '--plan-grad-to': theme.gradientTo
              }}
            >
              {!isLoggedIn ? (
                <div id="contactLockedMsg" style={{ padding: '0 15px', color: '#ef4444', fontWeight: 600 }}>
                  <i className="fas fa-lock" /> يرجى تسجيل الدخول لطلب الخدمة والتواصل مع الفني
                </div>
              ) : null}

              {isLoggedIn ? (
                <div className="profile-contact-bar">
                  <a href={callHref} className="btn-profile-call call" onClick={trackRequest}>
                    <i className="fas fa-phone-alt" />
                    اتصال
                  </a>
                  <a href={waHref} target="_blank" rel="noreferrer" className="btn-profile-call whatsapp" onClick={trackRequest}>
                    <i className="fab fa-whatsapp" />
                    واتساب
                  </a>
                </div>
              ) : (
                <a href="login.html" className="btn-profile-call" style={{ background: '#111827', color: 'white' }}>
                  <i className="fas fa-sign-in-alt" /> تسجيل دخول
                </a>
              )}

              {isLoggedIn && userRole === 'admin' ? (
                <a
                  href="admin-dashboard.html"
                  className="btn-profile-call"
                  style={{ background: '#0f172a', color: 'white' }}
                  onClick={() => {
                    localStorage.setItem('admin_target_user', profile?._id || techId);
                  }}
                >
                  <i className="fas fa-user-shield" /> بيانات الآدمن
                </a>
              ) : null}
            </div>
          </div>

          {isLoading ? <div className="profile-card"><p>جاري التحميل...</p></div> : null}
          {error ? <div className="profile-card"><p style={{ color: '#ef4444' }}>{error}</p></div> : null}
        </div>
      </section>

      {!isLoading && !error ? (
        <section style={{ padding: '0 0 60px' }}>
          <div className="container">
            <div className="profile-layout">
              <div>
                <div className="profile-card" data-aos="fade-up">
                  <h2><i className="fas fa-user" style={{ background: 'var(--secondary-color)', color: 'var(--primary-color)' }} /> نبذة عن الفني</h2>
                  <p>{profile?.bio || 'فني متخصص في تقديم خدمات الصيانة وإصلاح الأعطال بدقة واحترافية.'}</p>
                </div>

                <div className="profile-card" data-aos="fade-up">
                  <h2><i className="fas fa-tools" style={{ background: '#ffedd5', color: '#f97316' }} /> الخدمات التي يقدمها</h2>
                  <div className="services-grid">
                    {services.map((service, index) => (
                      <div key={`${service}-${index}`} className="service-item">
                        <i className="fas fa-check" /> {service}
                      </div>
                    ))}
                  </div>
                </div>

                {showGallery ? (
                  <div className="profile-card" data-aos="fade-up">
                    <h2><i className="fas fa-images" style={{ background: '#f0fdf4', color: '#22c55e' }} /> بعض الأعمال السابقة</h2>
                    <p style={{ marginBottom: '20px' }}>صور توضح جودة الأعمال التي نفذها الفني.</p>
                    <div className="gallery-grid">
                      {images.length ? images.map((img, index) => (
                        <div key={`${img}-${index}`} className="gallery-item" style={{ border: 'none' }}>
                          <img src={parseMediaPath(img)} alt={`work-${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                        </div>
                      )) : <p>لا توجد صور متاحة حالياً.</p>}
                    </div>
                  </div>
                ) : null}

                {showVideos ? (
                  <div className="profile-card" data-aos="fade-up">
                    <h2><i className="fas fa-video" style={{ background: '#fef2f2', color: '#ef4444' }} /> معرض الفيديوهات</h2>
                    <p style={{ marginBottom: '20px' }}>شاهد فيديوهات توضح مهارات الفني وطريقة تنفيذه للأعمال.</p>
                    <div className="gallery-grid">
                      {videos.length ? videos.map((video, index) => (
                        <div key={`${video}-${index}`} className="gallery-item" style={{ border: 'none' }}>
                          <video src={parseMediaPath(video)} controls style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
                        </div>
                      )) : <p>لا توجد فيديوهات متاحة حالياً.</p>}
                    </div>
                  </div>
                ) : null}

                <div className="profile-card" data-aos="fade-up">
                  <h2><i className="fas fa-star" style={{ background: '#fffbeb', color: '#f59e0b' }} /> آراء العملاء</h2>

                  {reviews.length ? (
                    <div className="reviews-summary">
                      <div className="reviews-score">{averageRating.toFixed(1)}</div>
                      <div>
                        <div className="reviews-stars">
                          {summaryStars.map((star, index) => (
                            <i
                              key={`${star}-${index}`}
                              className={
                                star === 'full'
                                  ? 'fas fa-star'
                                  : star === 'half'
                                    ? 'fas fa-star-half-alt'
                                    : 'far fa-star'
                              }
                            />
                          ))}
                        </div>
                        <div className="reviews-count">بناءً على {reviews.length} تقييم</div>
                      </div>
                    </div>
                  ) : null}

                  <div id="reviewsList">
                    {reviews.length ? reviews.map((review) => (
                      <div key={review._id} className="review-card">
                        <div style={{ color: '#f59e0b', marginBottom: '5px' }}>
                          {Array.from({ length: review.rating || 0 }).map((_, index) => (
                            <i key={`r-${review._id}-${index}`} className="fas fa-star" />
                          ))}
                        </div>
                        <p>"{review.comment}"</p>
                        <span className="review-author"><i className="fas fa-user-circle" /> {review.customerId?.fullName || 'عميل'}</span>
                      </div>
                    )) : (
                      <p className="text-center" style={{ color: '#64748b', padding: '20px' }}>
                        لا يوجد آراء حقيقية لهذا الفني حتى الآن.
                      </p>
                    )}
                  </div>

                  {isCustomer ? (
                    <div id="addReviewSection" style={{ marginTop: '30px', paddingTop: '25px', borderTop: '1px solid #e2e8f0' }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>أضف رأيك وتقييمك</h3>
                      <div className="rating-input" style={{ display: 'flex', gap: '8px', marginBottom: '15px', color: '#cbd5e1', fontSize: '1.5rem', cursor: 'pointer' }}>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <i
                            key={value}
                            className="fas fa-star"
                            onClick={() => setSelectedRating(value)}
                            style={{ color: value <= selectedRating ? '#f59e0b' : '#cbd5e1' }}
                          />
                        ))}
                      </div>
                      <textarea
                        id="reviewText"
                        value={reviewText}
                        onChange={(event) => setReviewText(event.target.value)}
                        placeholder="اكتب رأيك في تعامل الفني وجودة العمل..."
                        style={{ width: '100%', height: '100px', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '12px', fontFamily: 'inherit', marginBottom: '15px' }}
                      />
                      <button
                        id="submitReviewBtn"
                        className="btn btn-dark"
                        style={{ width: '100%', borderRadius: '8px' }}
                        onClick={submitReview}
                        disabled={isSubmittingReview}
                      >
                        {isSubmittingReview ? 'جاري الإرسال...' : 'إرسال التقييم'}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="sidebar-contact">
                <div className="sidebar-contact-card" data-aos="fade-up">
                  <h3>تواصل مع الفني</h3>
                  {!isLoggedIn ? (
                    <div id="sidebarLockedMsg" style={{ marginBottom: '15px', background: '#fff1f2', padding: '12px', borderRadius: '8px', color: '#e11d48', fontSize: '0.85rem', fontWeight: 600 }}>
                      <i className="fas fa-lock" /> يجب تسجيل الدخول للتواصل مع الفني
                    </div>
                  ) : null}
                  <p>يمكنك التواصل مباشرة مع الفني لحجز الخدمة أو الاستفسار عن التفاصيل.</p>
                  {isLoggedIn ? (
                    <>
                      <a href={callHref} className="btn-profile-call call" onClick={trackRequest}><i className="fas fa-phone-alt" /> اتصل الآن</a>
                      <a href={waHref} target="_blank" rel="noreferrer" className="btn-profile-call whatsapp" onClick={trackRequest}><i className="fab fa-whatsapp" style={{ fontSize: '1.2rem' }} /> تواصل عبر واتساب</a>
                    </>
                  ) : (
                    <a href="login.html" className="btn-profile-call" style={{ background: '#111827', color: 'white', justifyContent: 'center' }}>
                      <i className="fas fa-sign-in-alt" /> تسجيل دخول
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-padding bg-light">
        <div className="container">
          <div className="home-cta" data-aos="fade-up">
            <div className="home-cta-content">
              <h2>تحتاج إلى خدمة الآن؟</h2>
              <p style={{ maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.8 }}>
                إذا كنت تبحث عن فني لتنفيذ أعمال الصيانة أو التأسيس، يمكنك التواصل مع الفني مباشرة.
              </p>
              <div className="cta-buttons" style={{ marginTop: '30px' }}>
                {isLoggedIn ? (
                  <>
                    <a href={callHref} className="btn btn-white-pill" onClick={trackRequest}>اتصل الآن</a>
                    <a href={waHref} target="_blank" rel="noreferrer" className="btn btn-dark-pill" onClick={trackRequest}>تواصل عبر واتساب</a>
                  </>
                ) : (
                  <a href="login.html" className="btn btn-dark-pill" style={{ background: '#111827' }}>
                    تسجيل دخول للتواصل
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '30px 0' }}>
        <div className="container text-center">
          <a href={backToServiceLink} className="back-link-modern" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1e293b', textDecoration: 'none', fontWeight: '800', fontSize: '0.95rem', background: '#ffffff', padding: '12px 30px', borderRadius: '12px', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
            <i className="fas fa-arrow-right" style={{ color: '#FF5C1A' }} />
            <span>العودة إلى قائمة الفنيين</span>
          </a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

export default TechnicianProfilePage;
