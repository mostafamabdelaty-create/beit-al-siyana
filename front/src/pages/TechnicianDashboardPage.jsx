import { useEffect, useState, useRef } from 'react';
import { toApiUrl, toMediaUrl } from '../utils/apiBase';

const HEAD_ATTR = 'data-tech-dashboard-head';

const appendHeadLink = (href, rel = 'stylesheet') => {
  const existing = document.querySelector(`link[${HEAD_ATTR}="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.setAttribute(HEAD_ATTR, href);
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};

function TechnicianDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');
  const [techData, setTechData] = useState(null);
  const [sidebarActive, setSidebarActive] = useState(false);
  
  const [statusMsg, setStatusMsg] = useState({ msg: '', type: '' });
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    specialty: 'سباكة',
    customSpecialty: '',
    city: 'مدينة بني سويف',
    address: '',
    yearsOfExperience: 0,
    bio: ''
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Renew Form State
  const [renewForm, setRenewForm] = useState({
    package: '',
    screenshot: null
  });
  const [packages, setPackages] = useState([]);
  const [selectedDurationIndex, setSelectedDurationIndex] = useState('0');

  const selectedPlan = packages.find(p => p.id === renewForm.package || p.themeKey === renewForm.package);
  const durationOptions = selectedPlan?.pricingOptions || [];
  const selectedDuration = durationOptions.length > 0 ? (durationOptions[Number(selectedDurationIndex)] || durationOptions[0]) : null;
  const finalPrice = selectedDuration ? Number(selectedDuration.price || 0) : (selectedPlan ? Number(selectedPlan.price || 0) : 0);

  const periodLabels = {
    days: 'يوم',
    months: 'شهر',
    years: 'سنة',
    monthly: 'شهر',
    quarterly: '3 أشهر',
    yearly: 'سنة'
  };

  const imgInputRef = useRef(null);
  const vidInputRef = useRef(null);
  const profileImgInputRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    document.title = 'لوحة تحكم الفني - بيت الصيانة';
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = 'tech-dashboard';

    appendHeadLink('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    appendHeadLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    appendHeadLink('/css/style.css');
    appendHeadLink('/css/technician-dashboard-page.css');

    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    init();

    return () => {
      document.body.className = '';
    };
  }, [token]);

  const authHeaders = (withJson = false) => ({
    ...(withJson ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${token}`
  });

  const showStatus = (msg, type) => {
    setStatusMsg({ msg, type });
    setTimeout(() => {
      setStatusMsg({ msg: '', type: '' });
    }, 5000);
  };

  const init = async () => {
    await fetchPackages();
    await fetchTechData();
    setLoading(false);
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch(toApiUrl('/packages'), { headers: authHeaders() });
      const result = await res.json();
      if (result.success) {
        setPackages(result.data);
        if (result.data.length > 0) {
          setRenewForm(prev => ({ ...prev, package: result.data[0].id }));
          setSelectedDurationIndex('0');
        }
      }
    } catch (err) {
      console.warn('Could not fetch packages:', err);
    }
  };

  const fetchTechData = async () => {
    try {
      const res = await fetch(toApiUrl('/technicians/me'), { headers: authHeaders() });
      const result = await res.json();
      
      if (!res.ok || !result.success) {
        if (res.status === 401) handleLogout();
        throw new Error(result.message || 'فشل تحميل البيانات');
      }

      let data = result.data;

      // Plan Limit Check Fallback
      if (data.plan && data.plan.name && (!data.plan.maxImages && !data.plan.limits)) {
        try {
          const pkgsRes = await fetch(toApiUrl('/packages'), { headers: authHeaders() });
          const pkgsResult = await pkgsRes.json();
          if (pkgsResult.success) {
            const fullPlan = pkgsResult.data.find(p => p.name === data.plan.name || p.id === data.plan.id);
            if (fullPlan) {
              data.plan = { ...data.plan, ...fullPlan };
            }
          }
        } catch (e) {
          console.warn('Could not fetch extra plan info:', e);
        }
      }

      setTechData(data);
      
      // Init profile form state
      setProfileForm({
        fullName: data.user.fullName || '',
        phone: data.user.phone || '',
        whatsapp: data.profile.whatsapp || data.user.phone || '',
        specialty: data.profile.specialty || 'سباكة',
        customSpecialty: data.profile.customSpecialty || '',
        city: data.profile.city || 'القاهرة',
        address: data.profile.address || '',
        yearsOfExperience: data.profile.yearsOfExperience || 0,
        bio: data.profile.bio || ''
      });

    } catch (err) {
      showStatus(err.message, 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  };

  // Profile Form Submissions
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const payload = { ...profileForm };
    
    try {
      const res = await fetch(toApiUrl('/technicians/profile'), {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        showStatus('تم تحديث البيانات بنجاح', 'success');
        fetchTechData();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      showStatus(err.message, 'error');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return showStatus('كلمة المرور الجديدة غير متطابقة', 'error');
    }

    try {
      const res = await fetch(toApiUrl('/auth/change-password'), {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        })
      });

      const result = await res.json();
      if (result.success) {
        showStatus('تم تغيير كلمة المرور بنجاح', 'success');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      showStatus(err.message, 'error');
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    showStatus('جاري رفع الصورة الشخصية...', 'info');

    try {
      const res = await fetch(toApiUrl('/technicians/profile-image'), {
        method: 'POST',
        headers: authHeaders(),
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        showStatus('تم تحديث الصورة الشخصية', 'success');
        fetchTechData();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      showStatus(err.message, 'error');
    }
  };

  // Gallery Uploads
  const handleMediaUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file || !techData) return;

    // Plan Limit Check
    const plan = techData.plan || {};
    const benefits = plan.benefits || {};
    const maxImg = Number(plan.maxImages || plan.limits?.maxImages || benefits.maxImages || 0);
    const maxVid = Number(plan.maxVideos || plan.limits?.maxVideos || benefits.maxVideos || 0);
    
    if (type === 'image') {
      if (!benefits.workImages) return showStatus('باقتك لا تدعم رفع الصور', 'error');
      const currentCount = (techData.profile.galleryImages || []).length;
      if (maxImg > 0 && currentCount >= maxImg) {
        return showStatus(`لقد وصلت للحد الأقصى المسموح به (${maxImg} صور)`, 'error');
      }
    } else if (type === 'video') {
      const isProfessional = plan.themeKey === 'professional';
      if (!benefits.workVideos && !isProfessional) return showStatus('باقتك لا تدعم رفع الفيديوهات', 'error');
      
      let finalMaxVid = maxVid;
      if (isProfessional && finalMaxVid === 0 && !benefits.workVideos) finalMaxVid = 1;

      const currentCount = (techData.profile.galleryVideos || []).length;
      if (finalMaxVid > 0 && currentCount >= finalMaxVid) {
        return showStatus(`لقد وصلت للحد الأقصى المسموح به (${finalMaxVid} فيديوهات)`, 'error');
      }
    }

    const formData = new FormData();
    formData.append('media', file);
    formData.append('type', type);

    showStatus('جاري الرفع...', 'info');

    try {
      const res = await fetch(toApiUrl('/technicians/gallery'), {
        method: 'POST',
        headers: authHeaders(),
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        showStatus('تم الرفع بنجاح', 'success');
        fetchTechData();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      showStatus(err.message, 'error');
    }
  };

  const deleteMedia = async (filePath, type) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الملف؟')) return;
    try {
      const res = await fetch(toApiUrl('/technicians/gallery'), {
        method: 'DELETE',
        headers: authHeaders(true),
        body: JSON.stringify({ filePath, type })
      });
      const result = await res.json();
      if (result.success) {
        showStatus('تم الحذف بنجاح', 'success');
        fetchTechData();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      showStatus(err.message, 'error');
    }
  };

  // Renew Submit
  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    if (!techData) return;

    const formData = new FormData();
    formData.append('package', renewForm.package);
    formData.append('type', 'renew');
    formData.append('email', techData.user.email || '');
    formData.append('fullName', techData.user.fullName || '');
    formData.append('phone', techData.user.phone || '');
    formData.append('city', techData.profile.city || 'غير محدد');
    formData.append('address', techData.profile.address || 'غير محدد');
    formData.append('specialty', techData.profile.specialty || 'غير محدد');
    formData.append('yearsOfExperience', techData.profile.yearsOfExperience || 0);
    formData.append('bio', techData.profile.bio || 'لا يوجد');
    formData.append('whatsapp', techData.profile.whatsapp || techData.user.phone || '');
    formData.append('password', 'dummy'); 

    const price = finalPrice;
    
    formData.append('price', price);

    if (price > 0 && !renewForm.screenshot) {
      return showStatus('يرجى رفع صورة إيصال التحويل', 'error');
    }
    if (renewForm.screenshot) formData.append('paymentScreenshot', renewForm.screenshot);

    showStatus('جاري إرسال الطلب...', 'info');

    try {
      const res = await fetch(toApiUrl('/join'), {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        showStatus('تم إرسال طلب التجديد بنجاح! سيتم مراجعته قريباً.', 'success');
        setRenewForm({ package: packages.length > 0 ? packages[0].id : '', screenshot: null });
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      showStatus(err.message, 'error');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>جاري التحميل...</div>;
  }

  // Derived calculations
  let diffDays = 0;
  let isExpired = false;
  if (techData && techData.profile.subscriptionExpiry) {
    const expiryDate = new Date(techData.profile.subscriptionExpiry);
    const now = new Date();
    const diffTime = expiryDate - now;
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) isExpired = true;
  }

  // Gallery benefits check
  const plan = techData?.plan || {};
  const benefits = plan.benefits || {};
  const isProfessional = plan.themeKey === 'professional';
  
  const canShowImages = benefits.workImages;
  const canShowVideos = benefits.workVideos || isProfessional;
  
  const maxImg = Number(plan.maxImages || plan.limits?.maxImages || benefits.maxImages || 0);
  let currentMaxVid = Number(plan.maxVideos || plan.limits?.maxVideos || benefits.maxVideos || 0);
  if (isProfessional && currentMaxVid === 0 && !benefits.workVideos) currentMaxVid = 1;

  const currentImages = techData?.profile?.galleryImages || [];
  const currentVideos = techData?.profile?.galleryVideos || [];
  const atImgLimit = maxImg > 0 && currentImages.length >= maxImg;
  const atVidLimit = currentMaxVid > 0 && currentVideos.length >= currentMaxVid;

  return (
    <>
      <div className={`sidebar-overlay ${sidebarActive ? 'active' : ''}`} onClick={() => setSidebarActive(false)}></div>
      <aside className={`tech-sidebar ${sidebarActive ? 'active' : ''}`}>
        <a href="index.html" className="logo"><img src="/Images/beit-siyana-logo.png" alt="بيت الصيانة" style={{ filter: 'brightness(0) invert(1)' }} /></a>
        <nav>
          <ul className="tech-nav">
            <li><a onClick={() => { setActiveSection('profile'); setSidebarActive(false); }} className={activeSection === 'profile' ? 'active' : ''}><i className="fas fa-user-circle"></i> الملف الشخصي</a></li>
            <li><a onClick={() => { setActiveSection('gallery'); setSidebarActive(false); }} className={activeSection === 'gallery' ? 'active' : ''}><i className="fas fa-images"></i> معرض الأعمال</a></li>
            <li><a onClick={() => { setActiveSection('subscription'); setSidebarActive(false); }} className={activeSection === 'subscription' ? 'active' : ''}><i className="fas fa-crown"></i> اشتراكي</a></li>
            <li style={{ marginTop: '50px' }}><a onClick={handleLogout} style={{ color: '#ef4444' }}><i className="fas fa-sign-out-alt"></i> خروج</a></li>
          </ul>
          {techData?.user?.id && (
            <a href={`technician-profile.html?id=${techData.user.id}`} className="view-profile-btn" style={{ margin: '20px', display: 'block', background: 'var(--tech-primary)', color: 'white', textAlign: 'center', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700' }}>
              <i className="fas fa-eye"></i> معاينة البروفايل
            </a>
          )}
        </nav>
      </aside>

      <main className="tech-main">
        <header className="tech-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="hamburger-menu" onClick={() => setSidebarActive(true)}>
              <i className="fas fa-bars"></i>
            </button>
            <h1>مرحباً، {techData?.user?.fullName || '...'}</h1>
          </div>
          <div className="plan-badge">{techData?.plan?.name || 'بدون باقة'}</div>
        </header>

        {statusMsg.msg && (
          <div style={{
            padding: '15px', borderRadius: '12px', marginBottom: '25px', fontWeight: '700', textAlign: 'center',
            display: 'block',
            background: statusMsg.type === 'error' ? '#fee2e2' : statusMsg.type === 'success' ? '#d1fae5' : '#eff6ff',
            color: statusMsg.type === 'error' ? '#991b1b' : statusMsg.type === 'success' ? '#065f46' : '#1d4ed8'
          }}>
            {statusMsg.msg}
          </div>
        )}

        {/* Subscription Alert */}
        {techData?.profile?.subscriptionExpiry && diffDays <= 5 && (
          <div style={{
            display: 'flex', background: isExpired ? '#fef2f2' : '#fff7ed', border: `1.5px solid ${isExpired ? '#fee2e2' : '#ffedd5'}`, 
            color: isExpired ? '#ef4444' : '#9a3412', padding: '15px', borderRadius: '15px', marginBottom: '25px', alignItems: 'center', gap: '15px'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.5rem' }}></i>
            <div>
              <strong style={{ display: 'block', marginBottom: '3px' }}>تنبيه بانتهاء الاشتراك</strong>
              <span>باقي <span>{isExpired ? '0' : diffDays}</span> أيام على انتهاء اشتراكك. يرجى التجديد لضمان استمرار ظهورك للعملاء.</span>
            </div>
          </div>
        )}

        {/* 1. Profile Section */}
        {activeSection === 'profile' && (
          <div className="dashboard-section active">
            <div className="card">
              <div className="card-title"><i className="fas fa-id-card"></i> البيانات الأساسية</div>
              <form onSubmit={handleProfileUpdate}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', gap: '15px' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#f1f5f9', border: '2px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {techData?.profile?.profileImage ? (
                      <img src={toMediaUrl(techData.profile.profileImage)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <i className="fas fa-user" style={{ fontSize: '3rem', color: '#94a3b8' }}></i>
                    )}
                  </div>
                  <button type="button" className="btn-save" style={{ fontSize: '0.85rem', padding: '6px 15px' }} onClick={() => profileImgInputRef.current.click()}>
                    <i className="fas fa-camera"></i> تغيير الصورة الشخصية
                  </button>
                  <input type="file" ref={profileImgInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleProfileImageUpload} />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>الاسم بالكامل</label>
                    <input type="text" className="form-control" required value={profileForm.fullName} onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>رقم الهاتف (الواتساب)</label>
                    <input type="tel" className="form-control" required value={profileForm.whatsapp} onChange={e => setProfileForm({ ...profileForm, whatsapp: e.target.value, phone: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>التخصص</label>
                    <select className="form-control" value={profileForm.specialty} onChange={e => setProfileForm({ ...profileForm, specialty: e.target.value })}>
                      <option value="سباكة">سباكة</option>
                      <option value="كهرباء">كهرباء</option>
                      <option value="نجارة">نجارة</option>
                      <option value="دهانات">دهانات</option>
                      <option value="أرضيات">أرضيات</option>
                      <option value="تشطيب">تشطيب</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                  {profileForm.specialty === 'أخرى' && (
                    <div className="form-group">
                      <label>ما هو تخصصك؟</label>
                      <input type="text" className="form-control" placeholder="مثال: فني تكييف" required value={profileForm.customSpecialty} onChange={e => setProfileForm({ ...profileForm, customSpecialty: e.target.value })} />
                    </div>
                  )}
                  <div className="form-group">
                    <label>المركز / المنطقة</label>
                    <select className="form-control" required value={profileForm.city} onChange={e => setProfileForm({ ...profileForm, city: e.target.value })}>
                      {["مركز ناصر", "مركز ببا", "مركز إهناسيا", "مركز سمسطا", "مركز الفشن", "مركز بني سويف"].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>العنوان بالتفصيل</label>
                    <input type="text" className="form-control" placeholder="مثال: 12 شارع التحرير، الدقي" value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>سنوات الخبرة</label>
                    <input type="number" className="form-control" min="0" value={profileForm.yearsOfExperience} onChange={e => setProfileForm({ ...profileForm, yearsOfExperience: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>نبذة عنك (تظهر للعملاء)</label>
                  <textarea className="form-control" rows="4" style={{ resize: 'vertical' }} value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}></textarea>
                </div>
                <button type="submit" className="btn-save">حفظ التغييرات</button>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="card">
              <div className="card-title"><i className="fas fa-key"></i> تغيير كلمة المرور</div>
              <form onSubmit={handlePasswordUpdate}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>كلمة المرور الحالية</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="••••••••"
                      required 
                      value={passwordForm.currentPassword} 
                      onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label>كلمة المرور الجديدة</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="••••••••"
                      required 
                      value={passwordForm.newPassword} 
                      onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label>تأكيد كلمة المرور الجديدة</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="••••••••"
                      required 
                      value={passwordForm.confirmPassword} 
                      onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} 
                    />
                  </div>
                </div>
                <button type="submit" className="btn-save">تحديث كلمة المرور</button>
              </form>
            </div>
          </div>
        )}

        {/* 2. Gallery Section */}
        {activeSection === 'gallery' && (
          <div className="dashboard-section active">
            {/* Images Card */}
            <div className="card">
              <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span><i className="fas fa-camera"></i> صور الأعمال السابقة</span>
                {canShowImages && (
                  <button className="btn-save" style={{ padding: '5px 15px', fontSize: '0.9rem' }} onClick={() => imgInputRef.current.click()}>
                    <i className="fas fa-upload"></i> ارفع صور
                  </button>
                )}
              </div>
              
              {canShowImages ? (
                <div>
                  <div className="media-grid">
                    <div style={{ gridColumn: '1 / -1', fontSize: '0.85rem', color: '#64748b', marginBottom: '10px', textAlign: 'right' }}>
                      <i className="fas fa-info-circle"></i> المسموح به: <strong>{maxImg === 0 ? 'عدد لا نهائي' : `${currentImages.length} / ${maxImg}`}</strong>
                    </div>
                    {currentImages.map((img, i) => (
                      <div key={i} className="media-item">
                        <img src={toMediaUrl(img)} alt="عمل سابق" />
                        <button className="delete-btn" onClick={() => deleteMedia(img, 'image')}><i className="fas fa-trash"></i></button>
                      </div>
                    ))}
                    {!atImgLimit && (
                      <div className="upload-placeholder" onClick={() => imgInputRef.current.click()}>
                        <i className="fas fa-plus"></i><span>إضافة صورة</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="lock-overlay">
                  <i className="fas fa-lock"></i>
                  <h3>هذه الميزة غير متاحة في باقتك الحالية</h3>
                  <p>قم بالترقية إلى الباقة الاحترافية أو المميزة لإضافة صور أعمالك.</p>
                </div>
              )}
            </div>

            {/* Videos Card */}
            <div className="card">
              <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span><i className="fas fa-video"></i> فيديوهات العمل</span>
                {canShowVideos && (
                  <button className="btn-save" style={{ padding: '5px 15px', fontSize: '0.9rem' }} onClick={() => vidInputRef.current.click()}>
                    <i className="fas fa-upload"></i> ارفع فيديو
                  </button>
                )}
              </div>
              
              {canShowVideos ? (
                <div>
                  <div className="media-grid">
                    <div style={{ gridColumn: '1 / -1', fontSize: '0.85rem', color: '#64748b', marginBottom: '10px', textAlign: 'right' }}>
                      <i className="fas fa-info-circle"></i> المسموح به: <strong>{currentMaxVid === 0 ? 'عدد لا نهائي' : `${currentVideos.length} / ${currentMaxVid}`}</strong>
                    </div>
                    {currentVideos.map((vid, i) => (
                      <div key={i} className="media-item" style={{ cursor: 'pointer' }} onClick={(e) => { if (!e.target.closest('.delete-btn')) window.open(`/${vid}`, '_blank'); }}>
                        <video src={toMediaUrl(vid)} style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                          <i className="fas fa-play-circle" style={{ color: 'white', fontSize: '2rem', opacity: 0.8 }}></i>
                        </div>
                        <button className="delete-btn" onClick={() => deleteMedia(vid, 'video')}><i className="fas fa-trash"></i></button>
                      </div>
                    ))}
                    {!atVidLimit && (
                      <div className="upload-placeholder" onClick={() => vidInputRef.current.click()}>
                        <i className="fas fa-plus"></i><span>إضافة فيديو</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="lock-overlay">
                  <i className="fas fa-lock"></i>
                  <h3>هذه الميزة غير متاحة في باقتك الحالية</h3>
                  <p>قم بالترقية إلى الباقة الاحترافية لإضافة فيديو واحد، أو الباقة المميزة لمعرض فيديوهات كامل.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Subscription Section */}
        {activeSection === 'subscription' && (
          <div className="dashboard-section active">
            <div className="card">
              <div className="card-title"><i className="fas fa-crown"></i> حالة الاشتراك</div>
              <div className="plan-info-box">
                <div className="plan-info-text">
                  <h4>{techData?.plan?.name || 'بدون باقة'}</h4>
                  <p>تاريخ التسجيل: <span>{techData?.profile?.subscriptionStartDate ? new Date(techData.profile.subscriptionStartDate).toLocaleDateString('ar-EG') : 'غير محدد'}</span></p>
                  <p>ساري حتى: {techData?.profile?.subscriptionExpiry ? new Date(techData.profile.subscriptionExpiry).toLocaleDateString('ar-EG') : 'غير محدد'}</p>
                </div>
              </div>
              
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', textAlign: 'center' }}>
                <span style={{ color: '#64748b', fontWeight: '700' }}>متبقي على انتهاء الاشتراك: </span>
                <strong style={{ color: isExpired ? '#ef4444' : '#0f172a', fontSize: '1.2rem', fontWeight: '800' }}>
                  {techData?.profile?.subscriptionExpiry ? (isExpired ? 'منتهي' : `${diffDays} يوم`) : 'غير محدد'}
                </strong>
              </div>

              {/* Renew Form */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '25px', marginTop: '25px' }}>
                <div className="card-title"><i className="fas fa-sync-alt"></i> تجديد الاشتراك</div>
                <form onSubmit={handleRenewSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>اختر الباقة للتجديد</label>
                      <select className="form-control" required value={renewForm.package} onChange={e => {
                        setRenewForm({ ...renewForm, package: e.target.value });
                        setSelectedDurationIndex('0');
                      }}>
                        {packages.length > 0 ? packages.map(pkg => {
                           const pLabel = periodLabels[pkg.period] || pkg.period || 'شهر';
                           return (
                             <option key={pkg.id} value={pkg.id}>
                               {pkg.name} ({pkg.price === 0 ? 'مجانية' : `${pkg.price} ج.م / ${pLabel}`})
                             </option>
                           );
                        }) : (
                          <option value="">جاري تحميل الباقات...</option>
                        )}
                      </select>
                    </div>
                    
                    {durationOptions.length > 0 && (
                      <div className="form-group">
                        <label>مدة التجديد</label>
                        <select className="form-control" value={selectedDurationIndex} onChange={e => setSelectedDurationIndex(e.target.value)}>
                          {durationOptions.map((opt, idx) => {
                             const durationStr = `${opt.duration} ${periodLabels[opt.unit] || opt.unit}`;
                             const label = opt.label ? `${opt.label} (${durationStr})` : durationStr;
                             return (
                               <option key={idx} value={String(idx)}>
                                 {label} - {opt.price} ج.م
                               </option>
                             );
                          })}
                        </select>
                      </div>
                    )}

                    {finalPrice > 0 && (
                      <div className="form-group">
                        <label>تفاصيل الدفع (فودافون كاش)</label>
                        <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#166534', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <div>المبلغ المطلوب: <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{finalPrice} ج.م</span></div>
                          <div>رقم التحويل: <span style={{ fontWeight: '800', fontSize: '1.1rem' }} dir="ltr">01018614843</span></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {finalPrice > 0 && (
                    <div style={{ marginTop: '15px' }}>
                      <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>ارفع صورة إيصال التحويل</label>
                      <input type="file" className="form-control" accept="image/*" onChange={e => setRenewForm({ ...renewForm, screenshot: e.target.files[0] })} />
                    </div>
                  )}

                  <button type="submit" className="btn-save" style={{ marginTop: '20px', width: '100%' }}>إرسال طلب التجديد</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <input type="file" ref={imgInputRef} accept="image/*" style={{ display: 'none' }} onChange={e => handleMediaUpload(e, 'image')} />
      <input type="file" ref={vidInputRef} accept="video/*" style={{ display: 'none' }} onChange={e => handleMediaUpload(e, 'video')} />
    </>
  );
}

export default TechnicianDashboardPage;
