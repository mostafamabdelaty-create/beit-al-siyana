import { useEffect, useState } from 'react';
import { toApiUrl } from '../utils/apiBase';

const HEAD_ATTR = 'data-register-head';

const appendHeadLink = (href, rel = 'stylesheet') => {
  const existing = document.querySelector(`link[${HEAD_ATTR}="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.setAttribute(HEAD_ATTR, href);
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};

function RegisterCustomerPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'إنشاء حساب جديد - بيت الصيانة';
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = '';

    appendHeadLink('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    appendHeadLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    appendHeadLink('/css/register-customer-page.css');
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({
      type: 'info',
      message: 'جاري المعالجة...'
    });

    try {
      const response = await fetch(toApiUrl('/auth/register-customer'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password
        })
      });
      const result = await response.json();

      if (!result.success) {
        setStatus({
          type: 'error',
          message: result.message || 'خطأ في البيانات'
        });
        return;
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('userRole', 'customer');
      setStatus({
        type: 'success',
        message: 'تم التسجيل بنجاح! جاري الدخول...'
      });
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'تعذر الاتصال بالسيرفر'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusStyle =
    status.type === 'success'
      ? { background: '#d1fae5', color: '#065f46' }
      : status.type === 'error'
        ? { background: '#fee2e2', color: '#991b1b' }
        : { background: '#eff6ff', color: '#1d4ed8' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', width: '100%' }}>
      <div className="card">
        <div className="header">
          <img src="/Images/logo.svg" alt="بيت الصيانة" />
          <h1>إنشاء حساب عميل جديد</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>
            سجل لتتمكن من طلب الخدمات والتقييم
          </p>
        </div>

        {status.message ? (
          <div id="status" style={{ display: 'block', ...statusStyle }}>
            {status.message}
          </div>
        ) : null}

        <form id="regForm" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">الاسم بالكامل</label>
            <input
              id="name"
              type="text"
              required
              placeholder="مثال: أحمد محمد"
              value={form.fullName}
              onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              required
              placeholder="name@example.com"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">رقم الهاتف</label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="01xxxxxxxxx"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pass">كلمة المرور</label>
            <input
              id="pass"
              type="password"
              required
              placeholder="••••••••"
              minLength={6}
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
          </div>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'جاري المعالجة...' : 'إنشاء الحساب'}
          </button>
        </form>

        <div className="footer">
          لديك حساب بالفعل؟ <a href="login.html">تسجيل الدخول</a>
          <br />
          <br />
          <a href="index.html" style={{ color: '#94a3b8' }}><i className="ph ph-arrow-right" /> العودة للرئيسية</a>
        </div>
      </div>
    </div>
  );
}

export default RegisterCustomerPage;
