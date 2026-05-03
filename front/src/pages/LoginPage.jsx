import { useEffect, useState } from 'react';
import { toApiUrl } from '../utils/apiBase';

const HEAD_ATTR = 'data-login-head';

const appendHeadLink = (href, rel = 'stylesheet') => {
  const existing = document.querySelector(`link[${HEAD_ATTR}="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.setAttribute(HEAD_ATTR, href);
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    document.title = 'تسجيل الدخول - بيت الصيانة';
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = 'login-page';

    appendHeadLink('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    appendHeadLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    appendHeadLink('/css/style.css');
    appendHeadLink('/css/login-page.css');
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({
      type: 'info',
      message: 'جاري التحقق...'
    });

    try {
      const response = await fetch(toApiUrl('/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim()
        })
      });

      const text = await response.text();
      let result = {};
      try {
        result = JSON.parse(text);
      } catch {
        result = { message: text };
      }

      if (!response.ok) {
        setStatus({
          type: 'error',
          message: result.message || 'فشل تسجيل الدخول.'
        });
        return;
      }

      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      if (result.user?.role) {
        localStorage.setItem('userRole', result.user.role);
      }

      setStatus({
        type: 'success',
        message: 'تم تسجيل الدخول بنجاح! جاري التحويل...'
      });

      setTimeout(() => {
        if (result.user?.role === 'admin') {
          window.location.href = 'admin-dashboard.html';
          return;
        }
        if (result.user?.role === 'technician') {
          window.location.href = 'technician-dashboard.html';
          return;
        }
        window.location.href = 'index.html';
      }, 1500);
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'فشل الاتصال بالخادم.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusStyle =
    status.type === 'success'
      ? { backgroundColor: '#d1fae5', color: '#065f46' }
      : status.type === 'error'
        ? { backgroundColor: '#fee2e2', color: '#991b1b' }
        : { backgroundColor: '#eff6ff', color: '#1d4ed8' };

  return (
    <div className="login-container">
      <div className="login-card" data-aos="fade-up">
        <div className="login-header">
          <a href="index.html"><img src="/Images/logo.svg" alt="بيت الصيانة" /></a>
          <h1>تسجيل الدخول</h1>
        </div>

        <form id="loginForm" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              required
              placeholder="example@mail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">كلمة المرور</label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {status.message ? (
            <div
              id="loginStatus"
              style={{
                display: 'block',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center',
                fontSize: '0.9rem',
                ...statusStyle
              }}
            >
              {status.message}
            </div>
          ) : null}

          <div style={{ textAlign: 'left', marginTop: '5px', marginBottom: '15px' }}>
            <button type="button" onClick={() => setShowForgotModal(true)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
              هل نسيت كلمة المرور؟
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>

        <div className="login-footer" style={{ background: '#f1f5f9', padding: '15px', borderRadius: '12px', marginTop: '30px' }}>
          ليس لديك حساب؟ <br /><br />
          <a href="register-customer.html" style={{ display: 'block', background: 'var(--primary-color)', color: 'white', padding: '10px', borderRadius: '8px', marginBottom: '10px', textDecoration: 'none' }}>
            إنشاء حساب عميل جديد
          </a>
          <a href="join-technician.html" style={{ display: 'block', border: '1px solid var(--primary-color)', padding: '10px', borderRadius: '8px', textDecoration: 'none', color: 'var(--primary-color)' }}>
            انضم كفني الآن
          </a>
        </div>

        <a href="index.html" className="back-home"><i className="ph ph-arrow-right" /> العودة للرئيسية</a>
      </div>

      {showForgotModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowForgotModal(false)}>
          <div className="modal-content" style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 15px' }}>
              <i className="ph ph-lock-key" />
            </div>
            <h3 style={{ marginBottom: '15px', color: '#1e293b', fontSize: '1.4rem' }}>نسيت كلمة المرور؟</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px' }}>
              لضمان أمان حسابك، يرجى التواصل مع فريق الدعم الفني عبر واتساب لتأكيد هويتك واستعادة أو تغيير كلمة المرور الخاصة بك.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <a href="https://wa.me/201018614843?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D9%84%D9%82%D8%AF%20%D9%86%D8%B3%D9%8A%D8%AA%20%D9%83%D9%84%D9%85%D8%A9%20%D8%A7%D9%84%D9%85%D8%B1%D9%88%D8%B1%20%D8%A7%D9%84%D8%AE%D8%A7%D8%B5%D8%A9%20%D8%A8%D8%AD%D8%B3%D8%A7%D8%A8%D9%8A%20%D9%88%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D8%B3%D8%AA%D8%B9%D8%A7%D8%AF%D8%AA%D9%87" target="_blank" rel="noreferrer" className="btn btn-success" style={{ background: '#25D366', color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <i className="ph ph-whatsapp-logo" style={{ fontSize: '1.2rem' }} /> تواصل عبر واتساب
              </a>
              <button type="button" onClick={() => setShowForgotModal(false)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
