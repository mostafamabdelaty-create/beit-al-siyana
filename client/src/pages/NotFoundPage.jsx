import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  useEffect(() => {
    document.title = 'صفحة غير موجودة - بيت الصيانة';
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.className = '';
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: '#111111', fontFamily: 'Tajawal, Cairo, sans-serif' }}>
      <div style={{ width: '120px', height: '120px', background: 'rgba(255, 92, 26, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
        <i className="ph ph-warning" style={{ fontSize: '4rem', color: '#FF5C1A' }} />
      </div>
      <h1 style={{ fontSize: '6rem', color: '#FF5C1A', margin: '0', fontWeight: 900, lineHeight: 1 }}>404</h1>
      <h2 style={{ color: '#ffffff', marginBottom: '15px', fontSize: '1.8rem', fontWeight: 700 }}>الصفحة غير موجودة</h2>
      <p style={{ color: '#6B6B6B', marginBottom: '35px', fontSize: '1.1rem' }}>عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
      <Link to="/" style={{ padding: '14px 35px', backgroundColor: '#FF5C1A', color: 'white', textDecoration: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s ease' }}>
        <i className="ph ph-house" /> العودة للرئيسية
      </Link>
    </div>
  );
}

export default NotFoundPage;
