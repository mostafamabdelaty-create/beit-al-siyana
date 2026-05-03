import React, { useEffect, useState, useMemo } from 'react';

const HEAD_ATTR = 'data-admin-dashboard-head';

const appendHeadLink = (href, rel = 'stylesheet') => {
  const existing = document.querySelector(`link[${HEAD_ATTR}="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.setAttribute(HEAD_ATTR, href);
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};

const API_BASE = '/api';

const escapeHtml = (value = '') => String(value); // React does escaping by default

const periodLabel = (period) => {
  const map = {
    monthly: 'شهري',
    quarterly: 'ربع سنوي',
    yearly: 'سنوي',
    one_time: 'مرة واحدة'
  };
  return map[period] || period || '-';
};

const defaultPlanForm = {
  id: '',
  name: '',
  priority: 0,
  themeKey: 'starter',
  desc: '',
  badge: '',
  features: '',
  maxImages: 0,
  maxVideos: 0,
  pricingOptions: [],
  platformVis: true,
  contactInfo: true,
  workImages: false,
  workVideos: false,
  topListing: false,
  trustedBadge: false,
  topProfile: false,
  popular: false,
  active: true,
};

function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('المشرف');
  const [activeSection, setActiveSection] = useState('overview');

  // Data states
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [packages, setPackages] = useState([]);
  const [plansCache, setPlansCache] = useState([]);

  // Modals state
  const [imageModalUrl, setImageModalUrl] = useState(null);
  const [techDetailsModal, setTechDetailsModal] = useState(null);

  // Form state
  const [planForm, setPlanForm] = useState({ ...defaultPlanForm });
  const [planStatus, setPlanStatus] = useState({ message: '', type: '' });
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    document.title = 'لوحة التحكم المطورة - بيت الصيانة';
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = 'admin-body';

    appendHeadLink('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    appendHeadLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    appendHeadLink('/css/style.css');
    appendHeadLink('/css/admin-dashboard-page.css');

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

  const init = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
      const data = await res.json();

      if (!res.ok || data.user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
      }

      setAdminName(data.user.fullName);
      await loadStats();
      setLoading(false);
    } catch (err) {
      window.location.href = 'login.html';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  };

  // Switch Sections
  const handleSectionSwitch = (section) => {
    setActiveSection(section);
    if (section === 'overview') loadStats();
    if (section === 'join-requests') loadRequests();
    if (section === 'customers') loadCustomers();
    if (section === 'technicians') loadTechnicians();
    if (section === 'packages') loadPackages();
  };

  const sectionTitleMap = {
    'overview': 'نظرة عامة',
    'join-requests': 'طلبات الانضمام',
    'customers': 'العملاء',
    'technicians': 'الفنيين',
    'packages': 'الباقات'
  };

  // --- Loaders ---
  const loadStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard`, { headers: authHeaders() });
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/join/admin`, { headers: authHeaders() });
      const result = await res.json();
      if (result.success && result.data) {
        setRequests(result.data.filter((r) => r.status === 'pending'));
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/customers`, { headers: authHeaders() });
      const result = await res.json();
      if (result.success && result.data) {
        setCustomers(result.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadTechnicians = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/technicians-with-plans`, { headers: authHeaders() });
      const result = await res.json();
      if (result.success && result.data) {
        setTechnicians(result.data);
      } else {
        setTechnicians([]);
      }
    } catch (error) {
      console.error('Error loading technicians:', error);
    }
  };

  const loadPackages = async () => {
    setPlanStatus({ message: '', type: '' });
    try {
      const res = await fetch(`${API_BASE}/packages?includeInactive=1`);
      const result = await res.json();
      const loadedPlans = result.success && Array.isArray(result.data) ? result.data : [];
      setPlansCache(loadedPlans);

      const groups = {};
      loadedPlans.forEach(p => {
        const key = p.name.trim();
        if (!groups[key]) groups[key] = [];
        groups[key].push(p);
      });
      setPackages(Object.entries(groups));
    } catch (error) {
      console.error('Error loading packages:', error);
      setPackages([]);
    }
  };

  // --- Actions ---
  const toggleUser = async (id, action) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}/${action}`, {
        method: 'PUT',
        headers: authHeaders()
      });
      if (res.ok) {
        if (activeSection === 'customers') loadCustomers();
        if (activeSection === 'technicians') loadTechnicians();
        if (activeSection === 'overview') loadStats();
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم نهائيًا؟ سيتم حذف جميع بياناته.')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      if (res.ok) {
        if (activeSection === 'customers') loadCustomers();
        if (activeSection === 'technicians') loadTechnicians();
        if (activeSection === 'overview') loadStats();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const resetPassword = async (id) => {
    const newPassword = window.prompt('أدخل كلمة المرور الجديدة (يجب أن تكون 6 أحرف على الأقل):');
    if (!newPassword) return; // User cancelled or empty
    if (newPassword.length < 6) {
      alert('كلمة المرور قصيرة جداً');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}/reset-password`, {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify({ newPassword })
      });
      const result = await res.json();
      if (result.success) {
        alert('تم تغيير كلمة المرور بنجاح.');
      } else {
        alert(`خطأ: ${result.message}`);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('حدث خطأ في الاتصال بالخادم.');
    }
  };

  const approveRequest = async (id, type) => {
    const confirmMsg = type === 'renew' ? 'هل أنت متأكد من تجديد اشتراك هذا الفني؟' : 'هل أنت متأكد من قبول هذا الفني؟';
    if (!window.confirm(confirmMsg)) return;
    try {
      const res = await fetch(`${API_BASE}/join/admin/${id}/approve`, {
        method: 'PUT',
        headers: authHeaders()
      });
      const result = await res.json();
      if (result.success) {
        alert(type === 'renew' ? 'تم تجديد الاشتراك بنجاح.' : `تم القبول بنجاح. يمكن للفني الآن الدخول باستخدام بريده الإلكتروني وكلمة المرور التي اختارها.`);
        loadRequests();
        loadStats();
      } else {
        alert(`خطأ: ${result.message}`);
      }
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const rejectRequest = async (id) => {
    if (!window.confirm('هل أنت متأكد من رفض هذا الطلب؟')) return;
    try {
      const res = await fetch(`${API_BASE}/join/admin/${id}/reject`, {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify({ adminNotes: 'تم الرفض بواسطة الأدمن' })
      });
      if (res.ok) {
        loadRequests();
        loadStats();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  // --- Package Form Methods ---
  const handlePlanFormChange = (key, value) => {
    setPlanForm(prev => ({ ...prev, [key]: value }));
  };

  const handlePricingOptionChange = (index, field, value) => {
    const newOptions = [...planForm.pricingOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    handlePlanFormChange('pricingOptions', newOptions);
  };

  const addPricingOption = () => {
    handlePlanFormChange('pricingOptions', [
      ...planForm.pricingOptions,
      { duration: '', unit: 'months', price: '', label: '' }
    ]);
  };

  const removePricingOption = (index) => {
    const newOptions = planForm.pricingOptions.filter((_, i) => i !== index);
    handlePlanFormChange('pricingOptions', newOptions);
  };

  const savePlanForm = async () => {
    if (!planForm.name) {
      setPlanStatus({ message: 'من فضلك أدخل اسم الباقة.', type: 'error' });
      return;
    }
    const price = planForm.pricingOptions.length > 0 ? Number(planForm.pricingOptions[0].price) : 0;
    if (!Number.isFinite(price) || price < 0) {
      setPlanStatus({ message: 'من فضلك أدخل سعر صحيح للباقة.', type: 'error' });
      return;
    }

    const payload = {
      name: planForm.name.trim(),
      price: price,
      period: planForm.pricingOptions.length > 0 ? planForm.pricingOptions[0].unit : 'monthly',
      description: planForm.desc.trim(),
      features: planForm.features.split('\n').map(s => s.trim()).filter(Boolean),
      pricingOptions: planForm.pricingOptions.map(o => ({
        duration: Number(o.duration || 0),
        unit: o.unit,
        price: Number(o.price || 0),
        label: o.label.trim()
      })).filter(o => o.duration && o.price),
      isPopular: planForm.popular,
      isActive: planForm.active,
      themeKey: planForm.themeKey,
      badgeText: planForm.badge.trim(),
      sortPriority: Number(planForm.priority || 0),
      maxImages: Number(planForm.maxImages || 0),
      maxVideos: Number(planForm.maxVideos || 0),
      limits: {
        maxImages: Number(planForm.maxImages || 0),
        maxVideos: Number(planForm.maxVideos || 0)
      },
      style: {},
      benefits: {
        platformVisibility: planForm.platformVis,
        contactInfo: planForm.contactInfo,
        workImages: planForm.workImages,
        workVideos: planForm.workVideos,
        maxImages: Number(planForm.maxImages || 0),
        maxVideos: Number(planForm.maxVideos || 0),
        topInListing: planForm.topListing,
        trustedBadge: planForm.trustedBadge,
        topInProfile: planForm.topProfile
      }
    };

    const isEdit = !!planForm.id;

    try {
      const res = await fetch(`${API_BASE}/packages${isEdit ? `/${planForm.id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(true),
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'فشل حفظ الباقة');
      }

      setPlanStatus({ message: isEdit ? 'تم تعديل الباقة بنجاح.' : 'تم إضافة الباقة بنجاح.', type: 'success' });
      setPlanForm({ ...defaultPlanForm });
      await loadPackages();
    } catch (error) {
      setPlanStatus({ message: error.message || 'فشل حفظ الباقة', type: 'error' });
    }
  };

  const editPlan = (planId) => {
    const plan = plansCache.find((p) => p.id === planId);
    if (!plan) return;
    
    setPlanForm({
      id: plan.id,
      name: plan.name || '',
      themeKey: plan.themeKey || 'professional',
      badge: plan.badgeText || '',
      priority: plan.sortPriority || 0,
      desc: plan.description || '',
      features: (plan.features || []).join('\n'),
      maxImages: plan.limits?.maxImages || 0,
      maxVideos: plan.limits?.maxVideos || 0,
      pricingOptions: Array.isArray(plan.pricingOptions) ? [...plan.pricingOptions] : [],
      platformVis: !!plan.benefits?.platformVisibility,
      contactInfo: !!plan.benefits?.contactInfo,
      workImages: !!plan.benefits?.workImages,
      workVideos: !!plan.benefits?.workVideos,
      topListing: !!plan.benefits?.topInListing,
      trustedBadge: !!plan.benefits?.trustedBadge,
      topProfile: !!plan.benefits?.topInProfile,
      popular: !!plan.popular,
      active: !!plan.isActive,
    });

    setPlanStatus({ message: `جاري تعديل الباقة: ${plan.name}`, type: 'success' });
    document.getElementById('section-packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const togglePlanStatus = async (planId, shouldActivate) => {
    const actionLabel = shouldActivate ? 'تفعيل' : 'إلغاء تفعيل';
    if (!window.confirm(`هل أنت متأكد من ${actionLabel} هذه الباقة؟`)) return;

    try {
      const res = await fetch(`${API_BASE}/packages/${planId}`, {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify({ isActive: shouldActivate })
      });
      const result = await res.json();

      if (!res.ok || !result?.success) {
        throw new Error(result?.message || `فشل ${actionLabel} الباقة`);
      }

      setPlanStatus({ message: `تم ${actionLabel} الباقة بنجاح.`, type: 'success' });
      await loadPackages();
    } catch (error) {
      setPlanStatus({ message: error.message || `فشل ${actionLabel} الباقة`, type: 'error' });
    }
  };

  const deletePlan = async (planId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;
    try {
      const res = await fetch(`${API_BASE}/packages/${planId}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'فشل حذف الباقة');
      }
      setPlanStatus({ message: 'تم حذف الباقة بنجاح.', type: 'success' });
      if (planForm.id === planId) setPlanForm({ ...defaultPlanForm });
      await loadPackages();
    } catch (error) {
      setPlanStatus({ message: error.message || 'فشل حذف الباقة', type: 'error' });
    }
  };

  const toggleGroup = (groupId) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // --- Render Helpers ---
  const renderTechModalContent = () => {
    if (!techDetailsModal) return null;
    const t = techDetailsModal;

    let remainingText = "غير محدد";
    let subscriptionStatus = "غير نشط";
    let isExpired = true;
    
    const expiryDate = t.subscriptionExpiry || (t.profile && t.profile.subscriptionExpiry);
    const startDate = t.subscriptionStartDate || (t.profile && t.profile.subscriptionStartDate) || t.createdAt;

    if (expiryDate) {
        const end = new Date(expiryDate);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            remainingText = `${diffDays} يوم`;
            subscriptionStatus = 'ساري';
            isExpired = false;
        } else {
            remainingText = "منتهي";
            subscriptionStatus = 'منتهي';
            isExpired = true;
        }
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '5px' }}><i className="fas fa-user"></i> الاسم</h4>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{t.fullName}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '5px' }}><i className="fas fa-phone"></i> الهاتف</h4>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{t.phone}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '5px' }}><i className="fas fa-envelope"></i> البريد</h4>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', wordBreak: 'break-all' }}>{t.email}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '5px' }}><i className="fas fa-tools"></i> التخصص</h4>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{(t.profile && t.profile.specialty) || t.specialty || 'غير محدد'}</div>
          </div>
        </div>
        
        <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '5px' }}><i className="fas fa-map-marker-alt"></i> العنوان</h4>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{(t.profile && t.profile.city) || t.city || ''} - {(t.profile && t.profile.address) || t.address || ''}</div>
        </div>

        <div style={{ background: 'linear-gradient(to left, #eff6ff, #dbeafe)', padding: '20px', borderRadius: '12px', border: '1px solid #bfdbfe', marginTop: '10px' }}>
          <h3 style={{ marginTop: '0', color: '#1d4ed8', fontSize: '1.2rem', marginBottom: '15px', borderBottom: '1px solid #93c5fd', paddingBottom: '10px' }}>
            <i className="fas fa-gem"></i> بيانات الاشتراك
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>حالة الاشتراك</div>
              <div style={{ fontWeight: 'bold', marginTop: '5px' }}><span className={`badge ${isExpired ? 'badge-suspended' : 'badge-active'}`}>{subscriptionStatus}</span></div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>المدة المتبقية</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#b91c1c', marginTop: '5px' }}>{remainingText}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>تاريخ البداية</div>
              <div style={{ fontWeight: 'bold', color: '#0f172a', marginTop: '5px' }}>{startDate ? new Date(startDate).toLocaleDateString('ar-EG') : 'غير محدد'}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>تاريخ الانتهاء</div>
              <div style={{ fontWeight: 'bold', color: '#0f172a', marginTop: '5px' }}>{expiryDate ? new Date(expiryDate).toLocaleDateString('ar-EG') : 'غير محدد'}</div>
            </div>
            <div style={{ gridColumn: 'span 2', background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #bfdbfe', marginTop: '10px', textAlign: 'center' }}>
              <div style={{ color: '#1e4ed8', fontSize: '0.9rem', fontWeight: '700' }}>إجمالي طلبات التواصل</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ea580c' }}>{t.requestCount || 0}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>جاري التحميل...</div>;
  }

  return (
    <>
      <aside className="admin-sidebar">
        <a href="index.html" className="logo"><img src="/Images/logo.svg" alt="بيت الصيانة" /></a>
        <nav>
          <ul className="admin-nav">
            <li><a onClick={() => handleSectionSwitch('overview')} className={activeSection === 'overview' ? 'active' : ''}><i className="fas fa-chart-line"></i> نظرة عامة</a></li>
            <li><a onClick={() => handleSectionSwitch('join-requests')} className={activeSection === 'join-requests' ? 'active' : ''}><i className="fas fa-user-plus"></i> طلبات الانضمام</a></li>
            <li><a onClick={() => handleSectionSwitch('customers')} className={activeSection === 'customers' ? 'active' : ''}><i className="fas fa-users"></i> العملاء</a></li>
            <li><a onClick={() => handleSectionSwitch('technicians')} className={activeSection === 'technicians' ? 'active' : ''}><i className="fas fa-tools"></i> الفنيين</a></li>
            <li><a onClick={() => handleSectionSwitch('packages')} className={activeSection === 'packages' ? 'active' : ''}><i className="fas fa-box"></i> الباقات</a></li>
            <li style={{ marginTop: '50px' }}><a onClick={handleLogout} style={{ color: 'var(--danger)' }}><i className="fas fa-sign-out-alt"></i> خروج</a></li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{sectionTitleMap[activeSection]}</h1>
          <div style={{ color: '#64748b', fontWeight: '600' }}>مرحباً، {adminName}</div>
        </header>

        {/* 1. Overview Section */}
        {activeSection === 'overview' && (
          <div className="dashboard-section active">
            <div className="stats-grid" style={{ marginBottom: '30px' }}>
              <div className="stat-card" onClick={() => handleSectionSwitch('customers')}>
                <i className="fas fa-users"></i>
                <span className="value">{stats?.totalCustomers || 0}</span>
                <span className="label">إجمالي العملاء</span>
              </div>
              <div className="stat-card" onClick={() => handleSectionSwitch('technicians')}>
                <i className="fas fa-tools"></i>
                <span className="value">{stats?.totalTechnicians || 0}</span>
                <span className="label">الفنيين المسجلين</span>
              </div>
              <div className="stat-card" onClick={() => handleSectionSwitch('join-requests')}>
                <i className="fas fa-user-clock"></i>
                <span className="value">{stats?.pendingJoinRequests || 0}</span>
                <span className="label">طلبات بانتظار المراجعة</span>
              </div>
              <div className="stat-card" onClick={() => handleSectionSwitch('packages')}>
                <i className="fas fa-gem"></i>
                <span className="value">{stats?.totalPlans || 0}</span>
                <span className="label">باقات الاشتراك</span>
              </div>
              <div className="stat-card">
                <i className="fas fa-phone-alt"></i>
                <span className="value">{stats?.totalRequests || 0}</span>
                <span className="label">إجمالي طلبات التواصل</span>
              </div>
            </div>

            <div className="content-card" style={{ background: 'linear-gradient(135deg, var(--dark-section) 0%, var(--primary-dark) 100%)', color: 'white', border: 'none', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(22, 163, 74, 0.1)', borderRadius: '50%', filter: 'blur(50px)' }}></div>
              <div style={{ position: 'relative', zIndex: 1, padding: '40px' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>مرحباً بك في لوحة الإدارة</h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6' }}>
                  من هنا يمكنك متابعة أداء المنصة، مراجعة طلبات الفنيين الجدد، وإدارة قاعدة بيانات العملاء والباقات. استخدم القائمة الجانبية أو البطاقات في الأعلى للوصول السريع.
                </p>
                <div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
                  <button className="action-btn btn-primary" onClick={() => handleSectionSwitch('join-requests')} style={{ padding: '12px 25px', fontSize: '1rem', borderRadius: '12px' }}>
                    <i className="fas fa-plus-circle"></i> مراجعة الطلبات المعلقة
                  </button>
                  <button className="action-btn btn-success" onClick={() => handleSectionSwitch('packages')} style={{ padding: '12px 25px', fontSize: '1rem', borderRadius: '12px' }}>
                    <i className="fas fa-cog"></i> إعدادات الباقات
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginTop: '30px' }}>
              <div className="content-card" style={{ marginTop: 0 }}>
                <div className="card-header" style={{ borderBottom: '1px solid #f1f5f9' }}><i className="fas fa-info-circle" style={{ color: 'var(--primary)' }}></i> إرشادات سريعة</div>
                <div style={{ padding: '20px' }}>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'start' }}>
                      <i className="fas fa-check-circle" style={{ color: '#10b981', marginTop: '5px' }}></i>
                      <span>تأكد من مراجعة صور الإيصالات قبل قبول أي طلب انضمام أو تجديد.</span>
                    </li>
                    <li style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'start' }}>
                      <i className="fas fa-check-circle" style={{ color: '#10b981', marginTop: '5px' }}></i>
                      <span>يمكنك إيقاف أو تفعيل حسابات الفنيين والعملاء من أقسامهم المخصصة.</span>
                    </li>
                    <li style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                      <i className="fas fa-check-circle" style={{ color: '#10b981', marginTop: '5px' }}></i>
                      <span>تعديل الباقات يظهر فوراً للمستخدمين في الموقع الرئيسي.</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="content-card" style={{ marginTop: 0 }}>
                <div className="card-header" style={{ borderBottom: '1px solid #f1f5f9' }}><i className="fas fa-shield-alt" style={{ color: 'var(--primary)' }}></i> حالة النظام</div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>اتصال قاعدة البيانات</span>
                    <span className="badge badge-active">متصل</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>نظام الإشعارات</span>
                    <span className="badge badge-active">نشط</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>تحديث التلقائي</span>
                    <span className="badge badge-active">مفعل</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Join Requests Section */}
        {activeSection === 'join-requests' && (
          <div className="dashboard-section active">
            <div className="content-card">
              <div className="card-header">طلبات الانضمام المعلقة</div>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>التخصص</th>
                      <th>المدينة</th>
                      <th>الباقة</th>
                      <th>السعر</th>
                      <th>نوع الطلب</th>
                      <th>التحويل</th>
                      <th>التاريخ</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length > 0 ? requests.map((req) => (
                      <tr key={req._id}>
                        <td>{req.fullName}</td>
                        <td>{req.specialty}</td>
                        <td>{req.city}</td>
                        <td>{req.package === 'starter' ? 'البداية' : (req.package === 'professional' ? 'احترافية' : 'مميزة')}</td>
                        <td>{req.price} ج.م</td>
                        <td><span className={`badge ${req.type === 'renew' ? 'badge-suspended' : 'badge-active'}`}>{req.type === 'renew' ? 'تجديد' : 'انضمام جديد'}</span></td>
                        <td>
                          {(req.paymentScreenshot || req.screenshot) ? (
                            <button className="action-btn btn-primary" onClick={() => setImageModalUrl(`/${(req.paymentScreenshot || req.screenshot).replace(/\\/g, '/')}`)} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                              <i className="fas fa-image"></i> رؤية الصورة
                            </button>
                          ) : <span style={{ color: '#94a3b8' }}>لا يوجد</span>}
                        </td>
                        <td>{new Date(req.createdAt).toLocaleDateString('ar-EG')}</td>
                        <td>
                          <button className="action-btn btn-success" onClick={() => approveRequest(req._id, req.type)} style={{ marginLeft: '5px' }}>{req.type === 'renew' ? 'تجديد الاشتراك' : 'قبول الانضمام'}</button>
                          <button className="action-btn btn-danger" onClick={() => rejectRequest(req._id)}>رفض</button>
                        </td>
                      </tr>
                    )) : <tr><td colSpan="9" style={{ textAlign: 'center' }}>لا توجد طلبات معلقة</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. Customers Section */}
        {activeSection === 'customers' && (
          <div className="dashboard-section active">
            <div className="content-card">
              <div className="card-header">إدارة العملاء</div>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>البريد الإلكتروني</th>
                      <th>الهاتف</th>
                      <th>الحالة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length > 0 ? customers.map(c => (
                      <tr key={c._id}>
                        <td>{c.fullName}</td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td><span className={`badge badge-${c.status === 'active' ? 'active' : 'suspended'}`}>{c.status === 'active' ? 'نشط' : 'موقوف'}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {c.status === 'active'
                              ? <button className="action-btn btn-suspended" onClick={() => toggleUser(c._id, 'suspend')} title="إيقاف"><i className="fas fa-pause"></i></button>
                              : <button className="action-btn btn-success" onClick={() => toggleUser(c._id, 'activate')} title="تفعيل"><i className="fas fa-play"></i></button>}
                            <button className="action-btn" onClick={() => resetPassword(c._id)} title="تغيير كلمة المرور" style={{ background: '#3b82f6', color: 'white' }}><i className="fas fa-key"></i></button>
                            <button className="action-btn btn-danger" onClick={() => deleteUser(c._id)} title="حذف نهائي"><i className="fas fa-trash"></i></button>
                          </div>
                        </td>
                      </tr>
                    )) : <tr><td colSpan="5" style={{ textAlign: 'center' }}>لا يوجد عملاء</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3b. Technicians Section */}
        {activeSection === 'technicians' && (
          <div className="dashboard-section active">
            <div className="content-card">
              <div className="card-header">إدارة الفنيين</div>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'right' }}>الاسم</th>
                      <th style={{ textAlign: 'right' }}>البريد الإلكتروني</th>
                      <th style={{ textAlign: 'right' }}>الهاتف</th>
                      <th style={{ textAlign: 'center' }}>الطلبات</th>
                      <th style={{ textAlign: 'center' }}>الحالة</th>
                      <th style={{ textAlign: 'center' }}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {technicians.length > 0 ? technicians.map(t => {
                      const tid = t._id || t.id;
                      return (
                        <tr key={tid}>
                          <td style={{ textAlign: 'right' }}>{t.fullName}</td>
                          <td style={{ textAlign: 'right' }}>{t.email}</td>
                          <td style={{ textAlign: 'right' }}>{t.phone}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span style={{ 
                              background: '#fff7ed', 
                              color: '#ea580c', 
                              padding: '5px 12px', 
                              borderRadius: '20px', 
                              fontWeight: '800', 
                              fontSize: '0.95rem', 
                              border: '1px solid #ffedd5',
                              display: 'inline-block',
                              minWidth: '40px'
                            }}>
                              {t.requestCount || 0}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}><span className={`badge badge-${t.status === 'active' ? 'active' : 'suspended'}`}>{t.status === 'active' ? 'نشط' : 'موقوف'}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {t.status === 'active'
                                ? <button className="action-btn btn-suspended" onClick={() => toggleUser(tid, 'suspend')} title="إيقاف"><i className="fas fa-pause"></i></button>
                                : <button className="action-btn btn-success" onClick={() => toggleUser(tid, 'activate')} title="تفعيل"><i className="fas fa-play"></i></button>}
                              <button className="action-btn" onClick={() => setTechDetailsModal(t)} title="تفاصيل الفني" style={{ background: '#f59e0b', color: 'white' }}><i className="fas fa-eye"></i></button>
                              <button className="action-btn" onClick={() => resetPassword(tid)} title="تغيير كلمة المرور" style={{ background: '#3b82f6', color: 'white' }}><i className="fas fa-key"></i></button>
                              <a href={`/technician-profile.html?id=${tid}`} className="action-btn btn-primary" title="عرض الملف العام" style={{ textDecoration: 'none' }}><i className="fas fa-external-link-alt"></i></a>
                              <button className="action-btn btn-danger" onClick={() => deleteUser(tid)} title="حذف نهائي"><i className="fas fa-trash"></i></button>
                            </div>
                          </td>
                        </tr>
                      );
                    }) : <tr><td colSpan="5" style={{ textAlign: 'center' }}>لا يوجد فنيين</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. Packages Section */}
        {activeSection === 'packages' && (
          <div className="dashboard-section active" id="section-packages">
            <div className="packages-layout">
              <div className="content-card">
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-edit" style={{ color: 'var(--primary)' }}></i>
                    <span>إضافة / تعديل باقة</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="action-btn btn-primary" onClick={savePlanForm}><i className="fas fa-save"></i> حفظ الباقة</button>
                    <button className="action-btn" onClick={() => { setPlanForm({ ...defaultPlanForm }); setPlanStatus({ message: '', type: '' }); }} style={{ background: '#e2e8f0', color: '#1e293b' }}><i className="fas fa-eraser"></i> تفريغ</button>
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  {/* Basic Info Group */}
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ margin: '0 0 15px', fontSize: '0.95rem', color: '#64748b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fas fa-info-circle"></i> البيانات الأساسية
                    </h4>
                    <div className="plan-form-grid">
                      <div className="admin-input-group">
                        <label>اسم الباقة</label>
                        <input className="admin-input" value={planForm.name} onChange={e => handlePlanFormChange('name', e.target.value)} placeholder="مثل: الباقة الاحترافية" />
                      </div>
                      <div className="admin-input-group">
                        <label>أولوية الظهور</label>
                        <input className="admin-input" type="number" min="0" step="1" value={planForm.priority} onChange={e => handlePlanFormChange('priority', e.target.value)} placeholder="مثال: 1" />
                      </div>
                    </div>
                  </div>

                  {/* Advanced Pricing Options */}
                  <div style={{ marginBottom: '25px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '15px', padding: '20px' }}>
                    <h4 style={{ margin: '0 0 15px', fontSize: '0.95rem', color: '#1e293b', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fas fa-tags" style={{ color: '#2563eb' }}></i> خيارات الاشتراك المتعددة
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '15px' }}>أضف خيارات اشتراك مختلفة لهذه الباقة (مثلاً: 5 أيام بسعر معين، شهر بسعر آخر، سنة، إلخ).</p>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table className="admin-table" style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
                        <thead style={{ background: '#f1f5f9' }}>
                          <tr>
                            <th style={{ padding: '10px' }}>المدة</th>
                            <th style={{ padding: '10px' }}>الوحدة</th>
                            <th style={{ padding: '10px' }}>السعر (ج.م)</th>
                            <th style={{ padding: '10px' }}>التسمية (مثلاً: 5 أيام)</th>
                            <th style={{ padding: '10px', width: '50px' }}>حذف</th>
                          </tr>
                        </thead>
                        <tbody>
                          {planForm.pricingOptions.map((opt, i) => (
                            <tr key={i}>
                              <td><input type="number" className="admin-input" value={opt.duration} onChange={e => handlePricingOptionChange(i, 'duration', e.target.value)} placeholder="مثلاً: 5" style={{ padding: '5px' }} /></td>
                              <td>
                                <select className="admin-select" value={opt.unit} onChange={e => handlePricingOptionChange(i, 'unit', e.target.value)} style={{ padding: '5px' }}>
                                  <option value="days">أيام</option>
                                  <option value="months">شهور</option>
                                  <option value="years">سنوات</option>
                                </select>
                              </td>
                              <td><input type="number" className="admin-input" value={opt.price} onChange={e => handlePricingOptionChange(i, 'price', e.target.value)} placeholder="0.00" style={{ padding: '5px' }} /></td>
                              <td><input type="text" className="admin-input" value={opt.label} onChange={e => handlePricingOptionChange(i, 'label', e.target.value)} placeholder="5 أيام" style={{ padding: '5px' }} /></td>
                              <td><button className="action-btn btn-danger" onClick={() => removePricingOption(i)} style={{ padding: '5px 10px' }}><i className="fas fa-times"></i></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button className="action-btn" type="button" onClick={addPricingOption} style={{ background: '#111827', color: 'white', borderRadius: '8px', width: '100%', justifyContent: 'center', padding: '10px' }}>
                      <i className="fas fa-plus"></i> إضافة خيار اشتراك جديد
                    </button>
                  </div>

                  {/* Content & Limits Group */}
                  <div style={{ marginBottom: '25px' }}>
                    <h4 style={{ margin: '0 0 15px', fontSize: '0.95rem', color: '#64748b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fas fa-list-ul"></i> المحتوى والمميزات والقيود
                    </h4>
                    
                    <div className="plan-form-grid" style={{ marginBottom: '15px' }}>
                      <div className="admin-input-group">
                        <label>أقصى عدد صور (الصور)</label>
                        <input className="admin-input" type="number" min="0" value={planForm.maxImages} onChange={e => handlePlanFormChange('maxImages', e.target.value)} placeholder="0 = عدد لا نهائي" />
                        <small style={{ color: '#64748b', fontSize: '0.75rem' }}>ضع 0 للعدد اللا نهائي. لإلغاء الميزة، عطل "إضافة صور الأعمال" بالأسفل.</small>
                      </div>
                      <div className="admin-input-group">
                        <label>أقصى عدد فيديوهات (الفيديوهات)</label>
                        <input className="admin-input" type="number" min="0" value={planForm.maxVideos} onChange={e => handlePlanFormChange('maxVideos', e.target.value)} placeholder="0 = عدد لا نهائي" />
                        <small style={{ color: '#64748b', fontSize: '0.75rem' }}>ضع 0 للعدد اللا نهائي. لإلغاء الميزة، عطل "إضافة فيديوهات الأعمال" بالأسفل.</small>
                      </div>
                    </div>

                    <div className="plan-form-grid" style={{ marginBottom: '15px' }}>
                      <div className="admin-input-group">
                        <label>وصف مختصر</label>
                        <input className="admin-input" value={planForm.desc} onChange={e => handlePlanFormChange('desc', e.target.value)} placeholder="وصف يظهر تحت اسم الباقة..." />
                      </div>
                      <div className="admin-input-group">
                        <label>🏷️ النص المميز (Badge)</label>
                        <input className="admin-input" value={planForm.badge} onChange={e => handlePlanFormChange('badge', e.target.value)} placeholder="مثل: الأكثر طلباً" />
                      </div>
                    </div>

                    <div className="admin-input-group">
                      <label>المميزات (ميزة واحدة في كل سطر)</label>
                      <textarea className="plan-textarea" value={planForm.features} onChange={e => handlePlanFormChange('features', e.target.value)} placeholder="- صيانة دورية مجانية&#10;- خصم 20% على قطع الغيار..."></textarea>
                    </div>
                  </div>

                  {/* Settings (Checkboxes) */}
                  <div className="admin-check-grid">
                    <label className="admin-check"><input type="checkbox" checked={planForm.platformVis} onChange={e => handlePlanFormChange('platformVis', e.target.checked)} /> ظهور في المنصة</label>
                    <label className="admin-check"><input type="checkbox" checked={planForm.contactInfo} onChange={e => handlePlanFormChange('contactInfo', e.target.checked)} /> إضافة بيانات التواصل</label>
                    <label className="admin-check"><input type="checkbox" checked={planForm.workImages} onChange={e => handlePlanFormChange('workImages', e.target.checked)} /> إضافة صور الأعمال</label>
                    <label className="admin-check"><input type="checkbox" checked={planForm.workVideos} onChange={e => handlePlanFormChange('workVideos', e.target.checked)} /> إضافة فيديوهات الأعمال</label>
                    <label className="admin-check"><input type="checkbox" checked={planForm.topListing} onChange={e => handlePlanFormChange('topListing', e.target.checked)} /> ظهور أعلى في القائمة</label>
                    <label className="admin-check"><input type="checkbox" checked={planForm.trustedBadge} onChange={e => handlePlanFormChange('trustedBadge', e.target.checked)} /> علامة فني موثوق</label>
                    <label className="admin-check"><input type="checkbox" checked={planForm.topProfile} onChange={e => handlePlanFormChange('topProfile', e.target.checked)} /> ظهور في أعلى الصفحة</label>
                    <label className="admin-check" style={{ background: '#fffbeb' }}><input type="checkbox" checked={planForm.popular} onChange={e => handlePlanFormChange('popular', e.target.checked)} /> باقة مميزة (Popular)</label>
                    <label className="admin-check" style={{ background: '#f0fdf4' }}><input type="checkbox" checked={planForm.active} onChange={e => handlePlanFormChange('active', e.target.checked)} /> الباقة مفعلة</label>
                  </div>

                  {planStatus.message && (
                    <div className={`status-box status-${planStatus.type === 'error' ? 'error' : 'success'}`} style={{ marginTop: '15px', padding: '10px', borderRadius: '8px', color: planStatus.type === 'error' ? '#991b1b' : '#065f46', backgroundColor: planStatus.type === 'error' ? '#fee2e2' : '#d1fae5', fontWeight: 'bold' }}>
                      {planStatus.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="content-card">
                <div className="card-header">
                  <span>باقات الاشتراك الحالية</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>اسم الباقة</th>
                        <th>السعر</th>
                        <th>المدة</th>
                        <th>الأولوية</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages.length > 0 ? packages.map(([groupName, plans]) => {
                        const hasMultiple = plans.length > 1;
                        const firstPlan = plans[0];
                        const groupId = `group-${groupName.replace(/\s/g, '-')}`;
                        const isCollapsed = collapsedGroups[groupId];

                        return (
                          <React.Fragment key={groupId}>
                            <tr style={{ background: 'linear-gradient(to left, #f8fafc, #f1f5f9)' }}>
                              <td style={{ fontWeight: '800', color: '#0b2239', fontSize: '1rem' }} colSpan={hasMultiple ? 2 : 1}>
                                {hasMultiple && (
                                  <button onClick={() => toggleGroup(groupId)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '6px', color: '#3b82f6', fontSize: '1rem' }}>
                                    <i className={`fas fa-chevron-${isCollapsed ? 'up' : 'down'}`}></i>
                                  </button>
                                )}
                                {groupName}
                                <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: '700', marginRight: '8px' }}>
                                  {plans.length} {plans.length === 1 ? 'خيار' : 'خيارات'}
                                </span>
                              </td>
                              {!hasMultiple ? (
                                <>
                                  <td style={{ fontWeight: '800', color: 'var(--primary)' }}>{firstPlan.price} ج.م</td>
                                  <td><span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>{periodLabel(firstPlan.period)}</span></td>
                                  <td>{firstPlan.sortPriority || 0}</td>
                                  <td><span className={`badge ${firstPlan.isActive ? 'badge-active' : 'badge-suspended'}`}>{firstPlan.isActive ? 'مفعلة' : 'غير مفعلة'}</span></td>
                                  <td>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                      <button className="action-btn btn-primary" onClick={() => editPlan(firstPlan.id)} title="تعديل"><i className="fas fa-edit"></i></button>
                                      {firstPlan.isActive
                                        ? <button className="action-btn btn-suspended" onClick={() => togglePlanStatus(firstPlan.id, false)} title="إيقاف"><i className="fas fa-pause"></i></button>
                                        : <button className="action-btn btn-success" onClick={() => togglePlanStatus(firstPlan.id, true)} title="تفعيل"><i className="fas fa-play"></i></button>}
                                      <button className="action-btn btn-danger" onClick={() => deletePlan(firstPlan.id)} title="حذف"><i className="fas fa-trash"></i></button>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>اضغط لعرض الخيارات</td>
                              )}
                            </tr>
                            {hasMultiple && !isCollapsed && plans.map(p => (
                              <tr key={p.id} style={{ background: '#fafafa', borderRight: '4px solid #3b82f6' }}>
                                <td style={{ paddingRight: '30px', color: '#64748b', fontSize: '0.85rem' }}>
                                  <i className="fas fa-arrow-left" style={{ marginLeft: '6px', color: '#cbd5e1' }}></i>
                                  {p.badgeText || periodLabel(p.period)}
                                </td>
                                <td style={{ fontWeight: '800', color: 'var(--primary)' }}>{p.price} ج.م</td>
                                <td><span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>{periodLabel(p.period)}</span></td>
                                <td>{p.sortPriority || 0}</td>
                                <td><span className={`badge ${p.isActive ? 'badge-active' : 'badge-suspended'}`}>{p.isActive ? 'مفعلة' : 'غير مفعلة'}</span></td>
                                <td>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                    <button className="action-btn btn-primary" onClick={() => editPlan(p.id)} title="تعديل"><i className="fas fa-edit"></i></button>
                                    {p.isActive
                                      ? <button className="action-btn btn-suspended" onClick={() => togglePlanStatus(p.id, false)} title="إيقاف"><i className="fas fa-pause"></i></button>
                                      : <button className="action-btn btn-success" onClick={() => togglePlanStatus(p.id, true)} title="تفعيل"><i className="fas fa-play"></i></button>}
                                    <button className="action-btn btn-danger" onClick={() => deletePlan(p.id)} title="حذف"><i className="fas fa-trash"></i></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      }) : <tr><td colSpan="6" style={{ textAlign: 'center' }}>لا توجد باقات</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Image Preview Modal */}
      {imageModalUrl && (
        <div className="admin-modal active" onClick={() => setImageModalUrl(null)}>
          <span className="modal-close" onClick={() => setImageModalUrl(null)}>&times;</span>
          <img className="modal-content-img" src={imageModalUrl} alt="Preview" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Technician Details Modal */}
      {techDetailsModal && (
        <div className="admin-modal active" onClick={() => setTechDetailsModal(null)}>
          <div className="modal-card" style={{ background: 'white', borderRadius: '20px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '30px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <span className="modal-close" style={{ color: '#64748b', top: '15px', right: '20px', fontSize: '30px', position: 'absolute' }} onClick={() => setTechDetailsModal(null)}>&times;</span>
            <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ margin: '0', color: '#0f172a', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-id-card" style={{ color: 'var(--primary)' }}></i> ملف الفني
              </h2>
            </div>
            
            {renderTechModalContent()}
            
            <div style={{ marginTop: '25px', textAlign: 'left', borderTop: '2px solid #f1f5f9', paddingTop: '20px' }}>
              <button className="action-btn btn-primary" onClick={() => setTechDetailsModal(null)} style={{ padding: '10px 25px', fontSize: '1.1rem', borderRadius: '10px' }}>إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboardPage;
