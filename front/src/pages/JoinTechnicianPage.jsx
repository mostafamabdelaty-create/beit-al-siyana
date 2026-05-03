import { useEffect, useMemo, useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { toApiUrl } from '../utils/apiBase';

const HEAD_ATTR = 'data-join-page-head';

const periodLabels = {
  days: 'يوم',
  months: 'شهر',
  years: 'سنة',
  monthly: 'شهر',
  quarterly: '3 أشهر',
  yearly: 'سنة'
};

const centers = [
  'مركز ناصر',
  'مركز ببا',
  'مركز إهناسيا',
  'مركز سمسطا',
  'مركز الفشن',
  'مركز بني سويف',
  'مدينة بني سويف'
];

const specialties = ['سباكة', 'كهرباء', 'نجارة', 'دهانات', 'أرضيات', 'تشطيب', 'أخرى'];

const appendHeadLink = (href, rel = 'stylesheet') => {
  const existing = document.querySelector(`link[${HEAD_ATTR}="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.setAttribute(HEAD_ATTR, href);
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};

function JoinTechnicianPage() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    city: '',
    address: '',
    specialty: '',
    customSpecialty: '',
    yearsOfExperience: '',
    bio: ''
  });
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedDurationIndex, setSelectedDurationIndex] = useState('0');
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentPreviewUrl, setPaymentPreviewUrl] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPlan = useMemo(
    () => plans.find((plan) => (plan.id || plan._id) === selectedPlanId),
    [plans, selectedPlanId]
  );

  const durationOptions = useMemo(() => {
    if (!selectedPlan?.pricingOptions || !Array.isArray(selectedPlan.pricingOptions)) {
      return [];
    }
    return selectedPlan.pricingOptions;
  }, [selectedPlan]);

  const selectedDuration = useMemo(() => {
    if (!durationOptions.length) return null;
    return durationOptions[Number(selectedDurationIndex)] || durationOptions[0];
  }, [durationOptions, selectedDurationIndex]);

  const finalPrice = useMemo(() => {
    if (!selectedPlan) return 0;
    if (selectedDuration) return Number(selectedDuration.price || 0);
    return Number(selectedPlan.price || 0);
  }, [selectedPlan, selectedDuration]);

  const paymentDurationText = useMemo(() => {
    if (!selectedDuration) return '';
    const durationLabel = `${selectedDuration.duration} ${periodLabels[selectedDuration.unit] || selectedDuration.unit}`;
    return `لمدة ${durationLabel}`;
  }, [selectedDuration]);

  useEffect(() => {
    document.title = 'انضم كفني - بيت الصيانة';
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = 'page-join';

    appendHeadLink('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    appendHeadLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    appendHeadLink('/css/style.css');
    appendHeadLink('/css/join-technician-page.css');

    const userToken = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const navCta = document.querySelector('.nav-cta');

    if (userToken && navCta) {
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
    navItems.forEach((item) => item.addEventListener('click', closeMenu));

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
    animated.forEach((element) => observer.observe(element));

    return () => {
      menuToggle?.removeEventListener('click', toggleMenu);
      navItems.forEach((item) => item.removeEventListener('click', closeMenu));
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadPackages = async () => {
      try {
        const response = await fetch(toApiUrl('/packages'));
        const result = await response.json();
        if (cancelled) return;

        const list = result.success && Array.isArray(result.data) ? result.data : [];
        setPlans(list);

        const urlParams = new URLSearchParams(window.location.search);
        const urlPlanId = urlParams.get('planId');

        if (urlPlanId && list.some((plan) => (plan.id || plan._id) === urlPlanId)) {
          setSelectedPlanId(urlPlanId);
          setSelectedDurationIndex('0');
        }
      } catch (err) {
        if (!cancelled) {
          setPlans([]);
        }
      }
    };

    loadPackages();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!paymentFile) {
      setPaymentPreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(paymentFile);
    setPaymentPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [paymentFile]);

  const handleInput = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const resetForm = () => {
    setForm({
      fullName: '',
      phone: '',
      email: '',
      password: '',
      city: '',
      address: '',
      specialty: '',
      customSpecialty: '',
      yearsOfExperience: '',
      bio: ''
    });
    setSelectedPlanId('');
    setSelectedDurationIndex('0');
    setPaymentFile(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!selectedPlanId) {
      setStatus({ type: 'error', message: 'يرجى اختيار الباقة المناسبة.' });
      return;
    }

    if (finalPrice > 0 && !paymentFile) {
      setStatus({ type: 'error', message: 'يرجى رفع صورة إيصال التحويل قبل إرسال الطلب.' });
      return;
    }

    if (form.specialty === 'أخرى' && !form.customSpecialty.trim()) {
      setStatus({ type: 'error', message: 'يرجى كتابة تخصصك في خانة (ما هو تخصصك؟).' });
      return;
    }

    setIsSubmitting(true);

    const payload = new FormData();
    payload.append('fullName', form.fullName.trim());
    payload.append('phone', form.phone.trim());
    payload.append('email', form.email.trim());
    payload.append('password', form.password);
    payload.append('city', form.city);
    payload.append('address', form.address.trim());
    payload.append('specialty', form.specialty);
    payload.append('yearsOfExperience', form.yearsOfExperience);
    payload.append('bio', form.bio.trim());
    payload.append('package', selectedPlanId);
    payload.append('price', String(finalPrice));

    if (selectedDuration) {
      payload.append('duration', String(selectedDuration.duration));
      payload.append('durationUnit', selectedDuration.unit);
    } else if (selectedPlan) {
      if (selectedPlan.period === 'yearly') {
        payload.append('duration', '1');
        payload.append('durationUnit', 'years');
      } else {
        payload.append('duration', '1');
        payload.append('durationUnit', 'months');
      }
    }

    if (form.customSpecialty.trim()) {
      payload.append('customSpecialty', form.customSpecialty.trim());
    }
    if (paymentFile) {
      payload.append('paymentScreenshot', paymentFile);
    }

    try {
      const response = await fetch(toApiUrl('/join'), {
        method: 'POST',
        body: payload
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          type: 'success',
          message: 'تهانينا! تم إرسال طلبك بنجاح. سنقوم بمراجعته والرد عليك في أقرب وقت.'
        });
        resetForm();
      } else {
        setStatus({
          type: 'error',
          message: result.message || 'عذراً، حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً.'
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'عذراً، هناك مشكلة في الاتصال. تأكد من جودة الإنترنت وحاول مجدداً.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SiteHeader />

      <div className="join-container">
        <div className="form-card" data-aos="fade-up">
          <div className="form-header">
            <h1>انضم كفني محترف</h1>
            <p>ابدأ رحلتك مع بيت الصيانة الآن وافتح لخدماتك آفاقاً جديدة للوصول لآلاف العملاء.</p>
          </div>

          <form id="joinTechnicianForm" onSubmit={onSubmit}>
            <div className="row-grid">
              <div className="input-group">
                <label className="input-label">الاسم بالكامل <span className="text-danger">*</span></label>
                <div className="input-wrapper">
                  <input type="text" className="input-control" required placeholder="أدخل اسمك الثلاثي" value={form.fullName} onChange={handleInput('fullName')} />
                  <i className="ph ph-user-circle" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">رقم الهاتف (واتساب) <span className="text-danger">*</span></label>
                <div className="input-wrapper">
                  <input type="tel" className="input-control" required placeholder="010XXXXXXXX" value={form.phone} onChange={handleInput('phone')} />
                  <i className="ph ph-whatsapp-logo" />
                </div>
              </div>
            </div>

            <div className="row-grid">
              <div className="input-group">
                <label className="input-label">البريد الإلكتروني <span className="text-danger">*</span></label>
                <div className="input-wrapper">
                  <input type="email" className="input-control" required placeholder="name@example.com" value={form.email} onChange={handleInput('email')} />
                  <i className="ph ph-envelope-simple" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">كلمة المرور <span className="text-danger">*</span></label>
                <div className="input-wrapper">
                  <input type="password" className="input-control" required minLength={6} placeholder="أدخل كلمة مرور قوية" value={form.password} onChange={handleInput('password')} />
                  <i className="ph ph-lock" />
                </div>
              </div>
            </div>

            <div className="row-grid">
              <div className="input-group">
                <label className="input-label">المركز / المنطقة <span className="text-danger">*</span></label>
                <div className="input-wrapper">
                  <select className="input-control" required value={form.city} onChange={handleInput('city')}>
                    <option value="" disabled>اختر المركز...</option>
                    {centers.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <i className="ph ph-map-pin" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">العنوان بالتفصيل <span className="text-danger">*</span></label>
                <div className="input-wrapper">
                  <input type="text" className="input-control" required placeholder="مثال: الحي الرابع، شارع 10" value={form.address} onChange={handleInput('address')} />
                  <i className="ph ph-sign-post" />
                </div>
              </div>
            </div>

            <div className="row-grid">
              <div className="input-group">
                <label className="input-label">التخصص الأساسي <span className="text-danger">*</span></label>
                <div className="input-wrapper">
                  <select className="input-control" required value={form.specialty} onChange={handleInput('specialty')}>
                    <option value="" disabled>اختر تخصصك...</option>
                    {specialties.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <i className="ph ph-wrench" />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">سنوات الخبرة <span className="text-danger">*</span></label>
                <div className="input-wrapper">
                  <input type="number" className="input-control" required placeholder="كم سنة تعمل في هذا المجال؟" value={form.yearsOfExperience} onChange={handleInput('yearsOfExperience')} />
                  <i className="ph ph-medal" />
                </div>
              </div>
            </div>

            {form.specialty === 'أخرى' ? (
              <div className="input-group" id="otherSpecialtyGroup" style={{ marginBottom: '25px' }}>
                <label className="input-label">ما هو تخصصك؟ <span className="text-danger">*</span></label>
                <div className="input-wrapper">
                  <input type="text" className="input-control" placeholder="مثال: فني تكييف" required value={form.customSpecialty} onChange={handleInput('customSpecialty')} />
                  <i className="ph ph-wrench" />
                </div>
              </div>
            ) : null}

            <div className="input-group">
              <label className="input-label">اختر الباقة المناسبة <span className="text-danger">*</span></label>
              <div className="input-wrapper">
                <select
                  id="joinPackage"
                  className="input-control"
                  required
                  value={selectedPlanId}
                  onChange={(event) => {
                    setSelectedPlanId(event.target.value);
                    setSelectedDurationIndex('0');
                  }}
                >
                  <option value="" disabled>{plans.length ? 'اختر الباقة...' : 'جاري تحميل الباقات...'}</option>
                  {plans.map((plan) => {
                    const id = plan.id || plan._id;
                    return (
                      <option key={id} value={id}>{plan.name}</option>
                    );
                  })}
                </select>
                <i className="ph ph-diamond" />
              </div>
            </div>

            {durationOptions.length > 0 ? (
              <div className="input-group" id="durationContainer">
                <label className="input-label">مدة الاشتراك المفضلة <span className="text-danger">*</span></label>
                <div className="input-wrapper">
                  <select
                    id="joinDuration"
                    className="input-control"
                    value={selectedDurationIndex}
                    onChange={(event) => setSelectedDurationIndex(event.target.value)}
                  >
                    {durationOptions.map((option, index) => {
                      const durationStr = `${option.duration} ${periodLabels[option.unit] || option.unit}`;
                      const label = option.label ? `${option.label} (${durationStr})` : durationStr;
                      return (
                        <option key={`${selectedPlanId}-${index}`} value={String(index)}>
                          {label} - {option.price} ج.م
                        </option>
                      );
                    })}
                  </select>
                  <i className="ph ph-calendar-check" />
                </div>
              </div>
            ) : null}

            {selectedPlanId && finalPrice > 0 ? (
              <div id="paymentDetails">
                <div className="payment-header">
                  <div className="payment-title">
                    <i className="ph ph-shield-check" />
                    <div>
                      <h4>إتمام عملية الاشتراك</h4>
                      {paymentDurationText ? (
                        <div id="paymentDurationText" style={{ fontSize: '0.9rem', color: '#38bdf8', marginTop: '5px', fontWeight: 600 }}>
                          {paymentDurationText}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="price-badge">المبلغ: <span id="packagePriceText">{finalPrice}</span> ج.م</div>
                </div>

                <div className="vodafone-box">
                  <p style={{ marginBottom: '10px', opacity: 0.9, fontSize: '0.95rem' }}>يرجى تحويل المبلغ عبر فودافون كاش للرقم:</p>
                  <span className="vodafone-number">01018614843</span>
                </div>

                <div style={{ marginTop: '25px' }}>
                  <label className="input-label" style={{ color: 'white', opacity: 0.9 }}>
                    <i className="ph ph-cloud-arrow-up" />
                    صورة إيصال التحويل <span className="text-danger">*</span>
                  </label>
                  <input
                    id="paymentFile"
                    type="file"
                    accept="image/*"
                    className="input-control"
                    required={finalPrice > 0}
                    onChange={(event) => setPaymentFile(event.target.files?.[0] || null)}
                    style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                  />

                  {paymentFile ? (
                    <div id="paymentPreview" className="preview-box" style={{ display: 'flex' }}>
                      <i className="ph ph-file-image" style={{ color: '#38bdf8' }} />
                      <span id="fileNameDisplay" style={{ fontSize: '0.85rem', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {paymentFile.name}
                      </span>
                      {paymentPreviewUrl ? <img id="filePreviewThumb" src={paymentPreviewUrl} alt="معاينة" /> : null}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="input-group">
              <label className="input-label">نبذة عن خبراتك وخدماتك <span className="text-danger">*</span></label>
              <div className="input-wrapper">
                <textarea className="input-control" rows={4} required placeholder="أخبر العملاء لماذا يجب عليهم اختيارك؟ اكتب تخصصاتك الدقيقة وأعمالك السابقة." style={{ paddingTop: '20px' }} value={form.bio} onChange={handleInput('bio')} />
                <i className="ph ph-chat-dots" style={{ top: '25px' }} />
              </div>
            </div>

            {status.message ? (
              <div
                id="joinFormStatus"
                style={{
                  display: 'block',
                  padding: '20px',
                  borderRadius: '16px',
                  marginBottom: '25px',
                  textAlign: 'center',
                  fontWeight: 700,
                  backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: status.type === 'success' ? '#166534' : '#991b1b'
                }}
              >
                {status.message}
              </div>
            ) : null}

            <button type="submit" id="joinSubmitBtn" className="submit-btn" disabled={isSubmitting}>
              <span>{isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال طلب الانضمام'}</span>
              <i className={isSubmitting ? 'ph ph-spinner' : 'ph ph-paper-plane-tilt'} />
            </button>
          </form>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}

export default JoinTechnicianPage;
