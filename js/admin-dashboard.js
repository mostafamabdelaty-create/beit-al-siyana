const API_BASE = '/api';
const token = localStorage.getItem('token');

let plansCache = [];
let techniciansPlansCache = [];

const parseJsonResponse = async (res) => {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

if (!token) window.location.href = 'login.html';

const authHeaders = (withJson = false) => ({
  ...(withJson ? { 'Content-Type': 'application/json' } : {}),
  Authorization: `Bearer ${token}`
});

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const periodLabel = (period) => {
  const map = {
    monthly: 'شهري',
    quarterly: 'ربع سنوي',
    yearly: 'سنوي',
    one_time: 'مرة واحدة'
  };
  return map[period] || period || '-';
};


const openImageModal = (src) => {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  if (!modal || !modalImg) return;
  modalImg.src = src;
  modal.classList.add('active');
};

const closeImageModal = () => {
  const modal = document.getElementById('imageModal');
  if (modal) modal.classList.remove('active');
};

const showStatus = (boxId, message, type = 'success') => {
  const box = document.getElementById(boxId);
  if (!box) return;
  box.className = `status-box status-${type === 'error' ? 'error' : 'success'}`;
  box.innerText = message;
};

const clearStatus = (boxId) => {
  const box = document.getElementById(boxId);
  if (!box) return;
  box.className = 'status-box';
  box.innerText = '';
};

const addPricingOptionRow = (data = {}) => {
  const tbody = document.getElementById('pricingOptionsList');
  if (!tbody) return;
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="number" class="admin-input opt-duration" value="${data.duration || ''}" placeholder="مثلاً: 5" style="padding:5px;"></td>
    <td>
      <select class="admin-select opt-unit" style="padding:5px;">
        <option value="days" ${data.unit === 'days' ? 'selected' : ''}>أيام</option>
        <option value="months" ${data.unit === 'months' || !data.unit ? 'selected' : ''}>شهور</option>
        <option value="years" ${data.unit === 'years' ? 'selected' : ''}>سنوات</option>
      </select>
    </td>
    <td><input type="number" class="admin-input opt-price" value="${data.price || ''}" placeholder="0.00" style="padding:5px;"></td>
    <td><input type="text" class="admin-input opt-label" value="${data.label || ''}" placeholder="5 أيام" style="padding:5px;"></td>
    <td><button class="action-btn btn-danger" onclick="this.closest('tr').remove()" style="padding:5px 10px;"><i class="fas fa-times"></i></button></td>
  `;
  tbody.appendChild(row);
};

const getPlanPayloadFromForm = () => {
  const featuresRaw = document.getElementById('planFeaturesInput').value || '';
  const features = featuresRaw.split('\n').map(s => s.trim()).filter(Boolean);

  // Pricing Options
  const pricingOptions = [];
  document.querySelectorAll('#pricingOptionsList tr').forEach(row => {
    const duration = Number(row.querySelector('.opt-duration').value || 0);
    const unit = row.querySelector('.opt-unit').value;
    const price = Number(row.querySelector('.opt-price').value || 0);
    const label = row.querySelector('.opt-label').value.trim();
    if (duration && price) {
      pricingOptions.push({ duration, unit, price, label });
    }
  });

  return {
    name: document.getElementById('planNameInput').value.trim(),
    price: Number(document.getElementById('planPriceInput').value || 0),
    period: document.getElementById('planPeriodInput').value,
    description: document.getElementById('planDescInput').value.trim(),
    features,
    pricingOptions,
    isPopular: document.getElementById('planPopularInput').checked,
    isActive: document.getElementById('planActiveInput').checked,
    themeKey: document.getElementById('planThemeInput').value,
    badgeText: document.getElementById('planBadgeInput').value.trim(),
    sortPriority: Number(document.getElementById('planPriorityInput').value || 0),
    limits: {
      maxImages: Number(document.getElementById('planMaxImagesInput').value || 0),
      maxVideos: Number(document.getElementById('planMaxVideosInput').value || 0)
    },
    style: {
      accentColor: document.getElementById('planAccentInput').value.trim() || '#2563eb',
      gradientFrom: document.getElementById('planGradFromInput').value.trim(),
      gradientTo: document.getElementById('planGradToInput').value.trim(),
      isGradient: document.getElementById('planIsGradientInput').checked
    },
    benefits: {
      platformVisibility: document.getElementById('planPlatformVis').checked,
      contactInfo: document.getElementById('planContactInfo').checked,
      workImages: document.getElementById('planWorkImages').checked,
      workVideos: document.getElementById('planWorkVideos').checked,
      topInListing: document.getElementById('planTopListing').checked,
      trustedBadge: document.getElementById('planTrustedBadge').checked,
      topInProfile: document.getElementById('planTopProfile').checked
    }
  };
};

const resetPlanForm = () => {
  document.getElementById('planEditId').value = '';
  document.getElementById('planNameInput').value = '';
  document.getElementById('planPriceInput').value = '';
  document.getElementById('planPeriodInput').value = 'monthly';
  document.getElementById('planThemeInput').value = 'starter';
  document.getElementById('planBadgeInput').value = '';
  document.getElementById('planPriorityInput').value = '';
  document.getElementById('planAccentInput').value = '#2563eb';
  document.getElementById('planAccentColorPicker').value = '#2563eb';
  document.getElementById('planIsGradientInput').checked = false;
  document.getElementById('planGradFromInput').value = '';
  document.getElementById('planGradToInput').value = '';
  document.getElementById('planDescInput').value = '';
  document.getElementById('planFeaturesInput').value = '';
  document.getElementById('planMaxImagesInput').value = '';
  document.getElementById('planMaxVideosInput').value = '';
  document.getElementById('pricingOptionsList').innerHTML = '';
  
  document.getElementById('planPlatformVis').checked = true;
  document.getElementById('planContactInfo').checked = true;
  document.getElementById('planWorkImages').checked = false;
  document.getElementById('planWorkVideos').checked = false;
  document.getElementById('planTopListing').checked = false;
  document.getElementById('planTrustedBadge').checked = false;
  document.getElementById('planTopProfile').checked = false;
  document.getElementById('planPopularInput').checked = false;
  document.getElementById('planActiveInput').checked = true;
  clearStatus('planStatusBox');
};

const fillPlanForm = (plan) => {
  if (!plan) return;
  document.getElementById('planEditId').value = plan.id || '';
  document.getElementById('planNameInput').value = plan.name || '';
  document.getElementById('planPriceInput').value = plan.price || 0;
  document.getElementById('planPeriodInput').value = plan.period || 'monthly';
  document.getElementById('planThemeInput').value = plan.themeKey || 'starter';
  document.getElementById('planBadgeInput').value = plan.badgeText || '';
  document.getElementById('planPriorityInput').value = plan.sortPriority || 0;
  
  const style = plan.style || {};
  document.getElementById('planAccentInput').value = style.accentColor || '#2563eb';
  document.getElementById('planAccentColorPicker').value = style.accentColor || '#2563eb';
  document.getElementById('planIsGradientInput').checked = !!style.isGradient;
  document.getElementById('planGradFromInput').value = style.gradientFrom || '';
  document.getElementById('planGradFromPicker').value = style.gradientFrom || '#eff6ff';
  document.getElementById('planGradToInput').value = style.gradientTo || '';
  document.getElementById('planGradToPicker').value = style.gradientTo || '#dbeafe';

  document.getElementById('planDescInput').value = plan.description || '';
  document.getElementById('planFeaturesInput').value = (plan.features || []).join('\n');
  
  const limits = plan.limits || {};
  document.getElementById('planMaxImagesInput').value = limits.maxImages || 0;
  document.getElementById('planMaxVideosInput').value = limits.maxVideos || 0;

  // Fill Pricing Options
  const pricingList = document.getElementById('pricingOptionsList');
  pricingList.innerHTML = '';
  if (Array.isArray(plan.pricingOptions)) {
    plan.pricingOptions.forEach(opt => addPricingOptionRow(opt));
  }

  const ben = plan.benefits || {};
  document.getElementById('planPlatformVis').checked = !!ben.platformVisibility;
  document.getElementById('planContactInfo').checked = !!ben.contactInfo;
  document.getElementById('planWorkImages').checked = !!ben.workImages;
  document.getElementById('planWorkVideos').checked = !!ben.workVideos;
  document.getElementById('planTopListing').checked = !!ben.topInListing;
  document.getElementById('planTrustedBadge').checked = !!ben.trustedBadge;
  document.getElementById('planTopProfile').checked = !!ben.topInProfile;
  
  document.getElementById('planPopularInput').checked = !!plan.popular;
  document.getElementById('planActiveInput').checked = !!plan.isActive;
  clearStatus('planStatusBox');
};

const bindSidebarNavigation = () => {
  document.querySelectorAll('#sidebarNav a[data-section]').forEach((link) => {
    link.addEventListener('click', () => {
      const section = link.getAttribute('data-section');

      document.querySelectorAll('.dashboard-section').forEach((s) => s.classList.remove('active'));
      document.getElementById(`section-${section}`).classList.add('active');

      document.querySelectorAll('#sidebarNav a').forEach((a) => a.classList.remove('active'));
      link.classList.add('active');

      document.getElementById('sectionTitle').innerText = link.innerText;

      if (section === 'overview') loadStats();
      if (section === 'join-requests') loadRequests();
      if (section === 'customers') loadCustomers();
      if (section === 'technicians') loadTechnicians();
      if (section === 'packages') loadPackages();
    });
  });
};

const bindPackageActions = () => {
  const saveBtn = document.getElementById('savePlanBtn');
  const resetBtn = document.getElementById('resetPlanBtn');
  if (saveBtn) saveBtn.addEventListener('click', savePlanForm);
  if (resetBtn) resetBtn.addEventListener('click', resetPlanForm);
};

const bindColorSync = () => {
  const sync = (pickerId, inputId) => {
    const picker = document.getElementById(pickerId);
    const input = document.getElementById(inputId);
    if (picker && input) {
      picker.addEventListener('input', (e) => { input.value = e.target.value.toUpperCase(); });
      input.addEventListener('input', (e) => { if (/^#[0-9A-F]{6}$/i.test(e.target.value)) picker.value = e.target.value; });
    }
  };
  sync('planAccentColorPicker', 'planAccentInput');
  sync('planGradFromPicker', 'planGradFromInput');
  sync('planGradToPicker', 'planGradToInput');
};

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

async function init() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
    const data = await res.json();

    if (!res.ok || data.user.role !== 'admin') {
      window.location.href = 'index.html';
      return;
    }

    document.getElementById('adminName').innerText = `مرحبًا، ${data.user.fullName}`;
    bindSidebarNavigation();
    bindPackageActions();
    bindColorSync();
    loadStats();
  } catch (err) {
    window.location.href = 'login.html';
  }
}

async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/admin/dashboard`, { headers: authHeaders() });
    const result = await res.json();
    if (result.success) {
      const s = result.data;
      document.getElementById('statsContainer').innerHTML = `
        <div class="stat-card" onclick="document.querySelector('[data-section=\'customers\']').click()">
          <i class="fas fa-users"></i>
          <span class="value">${s.totalCustomers}</span>
          <span class="label">إجمالي العملاء</span>
        </div>
        <div class="stat-card" onclick="document.querySelector('[data-section=\'technicians\']').click()">
          <i class="fas fa-tools"></i>
          <span class="value">${s.totalTechnicians}</span>
          <span class="label">الفنيين المسجلين</span>
        </div>
        <div class="stat-card" onclick="document.querySelector('[data-section=\'join-requests\']').click()">
          <i class="fas fa-user-clock"></i>
          <span class="value">${s.pendingJoinRequests}</span>
          <span class="label">طلبات بانتظار المراجعة</span>
        </div>
        <div class="stat-card" onclick="document.querySelector('[data-section=\'packages\']').click()">
          <i class="fas fa-gem"></i>
          <span class="value">${s.totalPlans || 0}</span>
          <span class="label">باقات الاشتراك</span>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}


async function loadRequests() {
  try {
    const res = await fetch(`${API_BASE}/join/admin`, { headers: authHeaders() });
    const result = await res.json();
    const body = document.getElementById('joinRequestsBody');
    if (result.success && result.data && result.data.length > 0) {
      const pendingRequests = result.data.filter((r) => r.status === 'pending');
      if (pendingRequests.length > 0) {
        body.innerHTML = pendingRequests
          .map(
            (req) => `
            <tr>
              <td>${escapeHtml(req.fullName)}</td>
              <td>${escapeHtml(req.specialty)}</td>
              <td>${escapeHtml(req.city)}</td>
              <td>${req.package === 'starter' ? 'البداية' : (req.package === 'professional' ? 'احترافية' : 'مميزة')}</td>
              <td>${req.price} ج.م</td>
              <td><span class="badge ${req.type === 'renew' ? 'badge-suspended' : 'badge-active'}">${req.type === 'renew' ? 'تجديد' : 'انضمام جديد'}</span></td>
              <td>
                ${(req.paymentScreenshot || req.screenshot) 
                  ? `<button class="action-btn btn-primary" onclick="openImageModal('/${(req.paymentScreenshot || req.screenshot).replace(/\\/g, '/')}')" style="padding: 4px 8px; font-size: 0.75rem;">
                      <i class="fas fa-image"></i> رؤية الصورة
                     </button>` 
                  : '<span style="color:#94a3b8">لا يوجد</span>'}
              </td>
              <td>${new Date(req.createdAt).toLocaleDateString('ar-EG')}</td>
              <td>
                <button class="action-btn btn-success" onclick="approve('${req._id}', '${req.type}')">${req.type === 'renew' ? 'تجديد الاشتراك' : 'قبول الانضمام'}</button>
                <button class="action-btn btn-danger" onclick="reject('${req._id}')">رفض</button>
              </td>
            </tr>
          `
          )
          .join('');
      } else {
        body.innerHTML = '<tr><td colspan="5" style="text-align:center">لا توجد طلبات معلقة</td></tr>';
      }
    } else {
      body.innerHTML = '<tr><td colspan="5" style="text-align:center">لا توجد طلبات معلقة</td></tr>';
    }
  } catch (error) {
    console.error('Error loading requests:', error);
  }
}

async function loadCustomers() {
  try {
    const res = await fetch(`${API_BASE}/admin/customers`, { headers: authHeaders() });
    const result = await res.json();
    const body = document.getElementById('customersTableBody');
    if (result.success && result.data && result.data.length > 0) {
      body.innerHTML = result.data
        .map(c => `
          <tr>
            <td>${escapeHtml(c.fullName)}</td>
            <td>${escapeHtml(c.email)}</td>
            <td>${escapeHtml(c.phone)}</td>
            <td><span class="badge badge-${c.status === 'active' ? 'active' : 'suspended'}">${c.status === 'active' ? 'نشط' : 'موقوف'}</span></td>
            <td>
              <div class="admin-row-actions">
                ${c.status === 'active'
                  ? `<button class="action-btn btn-suspended" onclick="toggleUser('${c._id}', 'suspend')" title="إيقاف"><i class="fas fa-pause"></i></button>`
                  : `<button class="action-btn btn-success" onclick="toggleUser('${c._id}', 'activate')" title="تفعيل"><i class="fas fa-play"></i></button>`}
                <button class="action-btn btn-danger" onclick="deleteUser('${c._id}')" title="حذف نهائي"><i class="fas fa-trash"></i></button>
              </div>
            </td>
          </tr>
        `).join('');
    } else {
      body.innerHTML = '<tr><td colspan="5" style="text-align:center">لا يوجد عملاء</td></tr>';
    }
  } catch (error) {
    console.error('Error loading customers:', error);
  }
}

window.adminTechniciansData = [];

async function loadTechnicians() {
  try {
    const res = await fetch(`${API_BASE}/admin/technicians-with-plans`, { headers: authHeaders() });
    const result = await res.json();
    const body = document.getElementById('techniciansTableBody');
    if (result.success && result.data && result.data.length > 0) {
      window.adminTechniciansData = result.data;
      body.innerHTML = result.data
        .map(t => {
          const tid = t._id || t.id;
          return `
          <tr>
            <td>${escapeHtml(t.fullName)}</td>
            <td>${escapeHtml(t.email)}</td>
            <td>${escapeHtml(t.phone)}</td>
            <td><span class="badge badge-${t.status === 'active' ? 'active' : 'suspended'}">${t.status === 'active' ? 'نشط' : 'موقوف'}</span></td>
            <td>
              <div class="admin-row-actions">
                ${t.status === 'active'
                  ? `<button class="action-btn btn-suspended" onclick="toggleUser('${tid}', 'suspend')" title="إيقاف"><i class="fas fa-pause"></i></button>`
                  : `<button class="action-btn btn-success" onclick="toggleUser('${tid}', 'activate')" title="تفعيل"><i class="fas fa-play"></i></button>`}
                <button class="action-btn" onclick="viewTechModal('${tid}')" title="تفاصيل الفني" style="background: #f59e0b; color: white;"><i class="fas fa-eye"></i></button>
                <a href="technician-profile.html?id=${tid}" class="action-btn btn-primary" title="عرض الملف العام" style="text-decoration:none"><i class="fas fa-external-link-alt"></i></a>
                <button class="action-btn btn-danger" onclick="deleteUser('${tid}')" title="حذف نهائي"><i class="fas fa-trash"></i></button>
              </div>
            </td>
          </tr>
        `}).join('');
    } else {
      body.innerHTML = '<tr><td colspan="5" style="text-align:center">لا يوجد فنيين</td></tr>';
      window.adminTechniciansData = [];
    }
  } catch (error) {
    console.error('Error loading technicians:', error);
  }
}

function viewTechModal(id) {
  const t = window.adminTechniciansData.find(tech => (tech._id === id || tech.id === id || String(tech._id) === String(id) || String(tech.id) === String(id)));
  if (!t) return;
  
  let remainingText = "غير محدد";
  let subscriptionStatus = "غير نشط";
  
  const expiryDate = t.subscriptionExpiry || (t.profile && t.profile.subscriptionExpiry);
  const startDate = t.subscriptionStartDate || (t.profile && t.profile.subscriptionStartDate) || t.createdAt;

  if (expiryDate) {
      const end = new Date(expiryDate);
      const now = new Date();
      const diffTime = end - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
          remainingText = `${diffDays} يوم`;
          subscriptionStatus = `<span class="badge badge-active">ساري</span>`;
      } else {
          remainingText = "منتهي";
          subscriptionStatus = `<span class="badge badge-suspended">منتهي</span>`;
      }
  }

  const content = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h4 style="color: #64748b; font-size: 0.85rem; margin-bottom: 5px;"><i class="fas fa-user"></i> الاسم</h4>
              <div style="font-size: 1.1rem; font-weight: 700; color: #0f172a;">${escapeHtml(t.fullName)}</div>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h4 style="color: #64748b; font-size: 0.85rem; margin-bottom: 5px;"><i class="fas fa-phone"></i> الهاتف</h4>
              <div style="font-size: 1.1rem; font-weight: 700; color: #0f172a;">${escapeHtml(t.phone)}</div>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h4 style="color: #64748b; font-size: 0.85rem; margin-bottom: 5px;"><i class="fas fa-envelope"></i> البريد</h4>
              <div style="font-size: 1.1rem; font-weight: 700; color: #0f172a; word-break: break-all;">${escapeHtml(t.email)}</div>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
              <h4 style="color: #64748b; font-size: 0.85rem; margin-bottom: 5px;"><i class="fas fa-tools"></i> التخصص</h4>
              <div style="font-size: 1.1rem; font-weight: 700; color: #0f172a;">${escapeHtml((t.profile && t.profile.specialty) || t.specialty || 'غير محدد')}</div>
          </div>
      </div>
      
      <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h4 style="color: #64748b; font-size: 0.85rem; margin-bottom: 5px;"><i class="fas fa-map-marker-alt"></i> العنوان</h4>
          <div style="font-size: 1.1rem; font-weight: 700; color: #0f172a;">${escapeHtml((t.profile && t.profile.city) || t.city || '')} - ${escapeHtml((t.profile && t.profile.address) || t.address || '')}</div>
      </div>

      <div style="background: linear-gradient(to left, #eff6ff, #dbeafe); padding: 20px; border-radius: 12px; border: 1px solid #bfdbfe; margin-top: 10px;">
          <h3 style="margin-top: 0; color: #1d4ed8; font-size: 1.2rem; margin-bottom: 15px; border-bottom: 1px solid #93c5fd; padding-bottom: 10px;">
              <i class="fas fa-gem"></i> بيانات الاشتراك
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                  <div style="color: #64748b; font-size: 0.85rem;">حالة الاشتراك</div>
                  <div style="font-weight: bold; margin-top: 5px;">${subscriptionStatus}</div>
              </div>
              <div>
                  <div style="color: #64748b; font-size: 0.85rem;">المدة المتبقية</div>
                  <div style="font-weight: bold; font-size: 1.1rem; color: #b91c1c; margin-top: 5px;">${remainingText}</div>
              </div>
              <div>
                  <div style="color: #64748b; font-size: 0.85rem;">تاريخ البداية</div>
                  <div style="font-weight: bold; color: #0f172a; margin-top: 5px;">${startDate ? new Date(startDate).toLocaleDateString('ar-EG') : 'غير محدد'}</div>
              </div>
              <div>
                  <div style="color: #64748b; font-size: 0.85rem;">تاريخ الانتهاء</div>
                  <div style="font-weight: bold; color: #0f172a; margin-top: 5px;">${expiryDate ? new Date(expiryDate).toLocaleDateString('ar-EG') : 'غير محدد'}</div>
              </div>
          </div>
      </div>
  `;
  
  document.getElementById('techDetailsContent').innerHTML = content;
  document.getElementById('techDetailsModal').classList.add('active');
}

function closeTechModal() {
  document.getElementById('techDetailsModal').classList.remove('active');
}

async function loadPackages() {
  clearStatus('planStatusBox');
  clearStatus('techPlanStatusBox');

  try {
    const res = await fetch(`${API_BASE}/packages?includeInactive=1`);
    const result = await res.json();
    plansCache = result.success && Array.isArray(result.data) ? result.data : [];

    const body = document.getElementById('packagesBody');
    if (plansCache.length > 0) {
        body.innerHTML = plansCache
          .map(
            (p) => `
            <tr>
              <td style="font-weight: 700; color: #0b2239;">${escapeHtml(p.name)}</td>
              <td style="font-weight: 800; color: var(--primary);">${p.price} ج.م</td>
              <td><span style="background: #f1f5f9; padding: 4px 10px; border-radius: 8px; font-size: 0.85rem; font-weight: 700;">${periodLabel(p.period)}</span></td>
              <td>${p.sortPriority || 0}</td>
              <td><span class="badge ${p.isActive ? 'badge-active' : 'badge-suspended'}">${p.isActive ? 'مفعلة' : 'غير مفعلة'}</span></td>
              <td>
                <div class="admin-row-actions" style="justify-content: center;">
                  <button class="action-btn btn-primary" onclick="editPlan('${p.id}')" title="تعديل"><i class="fas fa-edit"></i></button>
                  ${
                    p.isActive
                      ? `<button class="action-btn btn-suspended" onclick="togglePlanStatus('${p.id}', false)" title="إيقاف"><i class="fas fa-pause"></i></button>`
                      : `<button class="action-btn btn-success" onclick="togglePlanStatus('${p.id}', true)" title="تفعيل"><i class="fas fa-play"></i></button>`
                  }
                  <button class="action-btn btn-danger" onclick="deletePlan('${p.id}')" title="حذف"><i class="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `
          )
          .join('');
    } else {
      body.innerHTML = '<tr><td colspan="6" style="text-align:center">لا توجد باقات</td></tr>';
    }
  } catch (error) {
    console.error('Error loading packages:', error);
    document.getElementById('packagesBody').innerHTML =
      '<tr><td colspan="6" style="text-align:center">حدث خطأ أثناء تحميل الباقات</td></tr>';
  }
}

async function savePlanForm() {
  const payload = getPlanPayloadFromForm();
  if (!payload.name) {
    showStatus('planStatusBox', 'من فضلك أدخل اسم الباقة.', 'error');
    return;
  }
  if (!Number.isFinite(payload.price) || payload.price < 0) {
    showStatus('planStatusBox', 'من فضلك أدخل سعر صحيح للباقة.', 'error');
    return;
  }

  const editId = document.getElementById('planEditId').value;
  const isEdit = !!editId;

  try {
    const res = await fetch(`${API_BASE}/packages${isEdit ? `/${editId}` : ''}`, {
      method: isEdit ? 'PUT' : 'POST',
      headers: authHeaders(true),
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'فشل حفظ الباقة');
    }

    showStatus('planStatusBox', isEdit ? 'تم تعديل الباقة بنجاح.' : 'تم إضافة الباقة بنجاح.', 'success');
    resetPlanForm();
    await loadPackages();
  } catch (error) {
    showStatus('planStatusBox', error.message || 'فشل حفظ الباقة', 'error');
  }
}

async function editPlan(planId) {
  const plan = plansCache.find((p) => p.id === planId);
  if (!plan) return;
  fillPlanForm(plan);
  showStatus('planStatusBox', `جاري تعديل الباقة: ${plan.name}`, 'success');
  document.getElementById('section-packages').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function togglePlanStatus(planId, shouldActivate) {
  const actionLabel = shouldActivate ? 'تفعيل' : 'إلغاء تفعيل';
  if (!confirm(`هل أنت متأكد من ${actionLabel} هذه الباقة؟`)) return;

  try {
    const res = await fetch(`${API_BASE}/packages/${planId}`, {
      method: 'PUT',
      headers: authHeaders(true),
      body: JSON.stringify({ isActive: shouldActivate })
    });
    const result = await parseJsonResponse(res);

    if (!res.ok || !result?.success) {
      throw new Error(result?.message || `فشل ${actionLabel} الباقة`);
    }

    showStatus('planStatusBox', `تم ${actionLabel} الباقة بنجاح.`, 'success');
    await loadPackages();
  } catch (error) {
    showStatus('planStatusBox', error.message || `فشل ${actionLabel} الباقة`, 'error');
  }
}

async function deletePlan(planId) {
  if (!confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;
  try {
    const res = await fetch(`${API_BASE}/packages/${planId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'فشل حذف الباقة');
    }
    showStatus('planStatusBox', 'تم حذف الباقة بنجاح.', 'success');
    if (document.getElementById('planEditId').value === planId) resetPlanForm();
    await loadPackages();
  } catch (error) {
    showStatus('planStatusBox', error.message || 'فشل حذف الباقة', 'error');
  }
}



async function toggleUser(id, action) {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}/${action}`, {
      method: 'PUT',
      headers: authHeaders()
    });
    if (res.ok) {
      // Refresh whichever list is currently being viewed
      loadCustomers();
      loadTechnicians();
      loadStats();
    }
  } catch (error) {
    console.error('Error toggling user status:', error);
  }
}

async function deleteUser(id) {
  if (!confirm('هل أنت متأكد من حذف هذا المستخدم نهائيًا؟ سيتم حذف جميع بياناته.')) return;
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (res.ok) {
      loadCustomers();
      loadTechnicians();
      loadStats();
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}


async function approve(id, type) {
  const confirmMsg = type === 'renew' ? 'هل أنت متأكد من تجديد اشتراك هذا الفني؟' : 'هل أنت متأكد من قبول هذا الفني؟';
  if (!confirm(confirmMsg)) return;
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
}

async function reject(id) {
  if (!confirm('هل أنت متأكد من رفض هذا الطلب؟')) return;
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
}

window.addPricingOptionRow = addPricingOptionRow;
window.loadStats = loadStats;
window.loadRequests = loadRequests;
window.loadCustomers = loadCustomers;
window.loadPackages = loadPackages;
window.toggleUser = toggleUser;
window.approve = approve;
window.reject = reject;
window.editPlan = editPlan;
window.togglePlanStatus = togglePlanStatus;
window.deletePlan = deletePlan;
window.deleteUser = deleteUser;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.logout = logout;

init();


