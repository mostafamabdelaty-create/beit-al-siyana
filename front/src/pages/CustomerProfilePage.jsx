import { useEffect, useMemo, useState } from 'react';
import { toApiUrl, toMediaUrl } from '../utils/apiBase';

const HEAD_ATTR = 'data-customer-profile-head';

const appendHeadLink = (href, rel = 'stylesheet') => {
  const existing = document.querySelector(`link[${HEAD_ATTR}="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.setAttribute(HEAD_ATTR, href);
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};

function CustomerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    address: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    document.title = 'حسابي | بيت الصيانة';
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = '';

    appendHeadLink('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    appendHeadLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    appendHeadLink('/css/style.css');
    appendHeadLink('/css/customer-profile-page.css');

    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    const toggleMenu = () => navLinks?.classList.toggle('active');
    const closeMenu = () => navLinks?.classList.remove('active');

    menuToggle?.addEventListener('click', toggleMenu);
    navItems.forEach((item) => item.addEventListener('click', closeMenu));

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
      navItems.forEach((item) => item.removeEventListener('click', closeMenu));
      window.removeEventListener('scroll', onScroll);
    };
  }, [token]);

  const loadUserData = async () => {
    try {
      const response = await fetch(toApiUrl('/auth/me'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();

      if (!result.success) {
        handleLogout();
        return;
      }

      const fetchedUser = result.user || {};
      const fetchedProfile = result.profile || {};
      setUser(fetchedUser);
      setProfile(fetchedProfile);

      setForm({
        fullName: fetchedUser.fullName || '',
        email: fetchedUser.email || '',
        password: '',
        phone: fetchedUser.phone || '',
        city: fetchedProfile.city || '',
        address: fetchedProfile.address || ''
      });
    } catch (err) {
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadUserData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const payload = new FormData();
    payload.append('media', file);
    setIsUploadingAvatar(true);

    try {
      const response = await fetch(toApiUrl('/customers/profile-image'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: payload
      });
      const result = await response.json();

      if (!result.success) {
        alert(`فشل رفع الصورة: ${result.message || ''}`);
        return;
      }

      await loadUserData();
    } catch (err) {
      alert('حدث خطأ أثناء رفع الصورة');
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    const updatedData = {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      phone: form.phone,
      city: form.city,
      address: form.address
    };

    try {
      const response = await fetch(toApiUrl('/customers/profile'), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      const result = await response.json();

      if (!result.success) {
        alert(`فشل التحديث: ${result.message || ''}`);
        return;
      }

      alert('تم تحديث البيانات بنجاح');
      setShowEditModal(false);
      setForm((prev) => ({ ...prev, password: '' }));
      await loadUserData();
    } catch (err) {
      alert('حدث خطأ أثناء تحديث البيانات');
    } finally {
      setIsSaving(false);
    }
  };

  const joinedDate = useMemo(() => {
    if (!user?.createdAt) return 'يناير 2024';
    return new Date(user.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' });
  }, [user?.createdAt]);

  const avatarPath = useMemo(() => {
    if (!profile?.profileImage) return '';
    return toMediaUrl(profile.profileImage);
  }, [profile?.profileImage]);

  const userInitial = useMemo(() => {
    if (!user?.fullName) return '..';
    return user.fullName.trim().charAt(0) || '..';
  }, [user?.fullName]);

  if (loading || isUploadingAvatar) {
    return (
      <div id="loadingOverlay" className="loading-overlay" style={{ opacity: 1 }}>
        <div className="spinner" />
        <p style={{ marginTop: '20px', fontWeight: 700, color: '#64748b' }}>
          جاري تحميل بياناتك...
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="header-new">
        <div className="container nav-wrapper-new">
          <a href="index.html" className="logo">
            <img src="/Images/logo.svg" alt="بيت الصيانة" className="site-logo" />
          </a>
          <nav className="nav-links-new">
            <a href="index.html">الرئيسية</a>
            <a href="services.html">الخدمات</a>
            <a href="support.html">الدعم</a>
          </nav>
          <div className="nav-actions">
            <button onClick={handleLogout} className="btn-nav-user" style={{ cursor: 'pointer', border: 'none' }}>خروج <i className="ph ph-sign-out" /></button>
            <button className="menu-toggle" aria-label="فتح القائمة">
              <i className="ph ph-list" />
            </button>
          </div>
        </div>
      </header>

      <div className="profile-hero" />

      <div className="profile-content">
        <div className="main-card">
          <div className="profile-top">
            <label className="avatar-wrapper" htmlFor="avatarInput">
              <div id="avatarContainer">
                {avatarPath ? (
                  <img src={avatarPath} className="avatar-img" alt="بروفايل" />
                ) : (
                  <div className="avatar-large" id="userInitial">{userInitial}</div>
                )}
              </div>
              <div className="avatar-overlay">
                <i className="fas fa-camera" />
              </div>
              <input
                type="file"
                id="avatarInput"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </label>
            <div className="role-badge"><i className="fas fa-user" /> حساب عميل</div>
            <h1 className="profile-name">{user?.fullName || '...'}</h1>
            <p className="profile-email">{user?.email || '...'}</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowEditModal(true)}
              style={{ marginTop: '20px', borderRadius: '12px', padding: '10px 25px' }}
            >
              <i className="fas fa-edit" /> تعديل البيانات
            </button>
          </div>

          <h2 className="section-title"><i className="fas fa-id-card" /> المعلومات الشخصية</h2>
          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-icon"><i className="fas fa-envelope" /></div>
              <div className="detail-info">
                <span className="detail-label">البريد الإلكتروني</span>
                <span className="detail-value">{user?.email || '...'}</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon"><i className="fas fa-phone-alt" /></div>
              <div className="detail-info">
                <span className="detail-label">رقم الهاتف</span>
                <span className="detail-value">{user?.phone || 'غير مسجل'}</span>
              </div>
            </div>

            {profile?.city ? (
              <div className="detail-card">
                <div className="detail-icon"><i className="fas fa-map-marker-alt" /></div>
                <div className="detail-info">
                  <span className="detail-label">المدينة</span>
                  <span className="detail-value">{profile.city}</span>
                </div>
              </div>
            ) : null}

            {profile?.address ? (
              <div className="detail-card">
                <div className="detail-icon"><i className="fas fa-home" /></div>
                <div className="detail-info">
                  <span className="detail-label">العنوان بالتفصيل</span>
                  <span className="detail-value">{profile.address}</span>
                </div>
              </div>
            ) : null}

            <div className="detail-card">
              <div className="detail-icon"><i className="fas fa-calendar-check" /></div>
              <div className="detail-info">
                <span className="detail-label">تاريخ الانضمام</span>
                <span className="detail-value">{joinedDate}</span>
              </div>
            </div>
          </div>

          <div className="actions-bar">
            <button className="btn-logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      <div
        id="editModal"
        className="modal"
        style={{ display: showEditModal ? 'flex' : 'none' }}
        onClick={(event) => {
          if (event.target.id === 'editModal') setShowEditModal(false);
        }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2>تعديل البيانات الشخصية</h2>
            <span className="close-modal" onClick={() => setShowEditModal(false)}>&times;</span>
          </div>
          <form id="editProfileForm" onSubmit={saveProfile}>
            <div className="form-group">
              <label>الاسم بالكامل</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>البريد الإلكتروني (Gmail)</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>كلمة المرور الجديدة (اتركها فارغة إذا لا تريد التغيير)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>رقم الهاتف</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>المدينة</label>
              <input
                type="text"
                value={form.city}
                onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>العنوان بالتفصيل</label>
              <input
                type="text"
                value={form.address}
                onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              />
            </div>
            <div className="modal-actions">
              <button type="submit" className="btn-save" disabled={isSaving}>
                {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
              <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CustomerProfilePage;
