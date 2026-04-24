const API_BASE = '/api';
const token = localStorage.getItem('token');

if (!token) window.location.href = 'login.html';

const authHeaders = (withJson = false) => ({
    ...(withJson ? { 'Content-Type': 'application/json' } : {}),
    'Authorization': `Bearer ${token}`
});

let techData = null;

async function init() {
    await fetchTechData();
    bindSidebar();
    bindForms();
    bindUploads();
    bindRenewForm();
}

async function fetchTechData() {
    try {
        const res = await fetch(`${API_BASE}/technicians/me`, { headers: authHeaders() });
        const result = await res.json();
        
        if (!res.ok || !result.success) {
            if (res.status === 401) logout();
            throw new Error(result.message || 'فشل تحميل البيانات');
        }

        techData = result.data;
        renderProfile();
        renderGallery();
        checkPlanBenefits();
        calculateSubscription();
    } catch (err) {
        console.error('Fetch Error:', err);
        showStatus(err.message, 'error');
        // Clear dots if error
        document.querySelectorAll('.loading-dots').forEach(el => el.textContent = '---');
    }
}

function renderProfile() {
    try {
        if (!techData) return;
        const { user, profile, plan } = techData;
        console.log('Rendering Profile for:', user.fullName);
        
        // Header
        document.getElementById('techGreeting').innerText = `مرحباً، ${user.fullName || '...'}`;
        document.getElementById('techPlanBadge').innerText = plan?.name || 'بدون باقة';
        
        // Profile Form
        document.getElementById('techFullName').value = user.fullName || '';
        document.getElementById('techPhone').value = user.phone || '';
        document.getElementById('techSpecialty').value = profile.specialty || '';
        document.getElementById('techCity').value = profile.city || '';
        document.getElementById('techAddress').value = profile.address || '';
        document.getElementById('techExp').value = profile.yearsOfExperience || 0;
        document.getElementById('techBio').value = profile.bio || '';

        // Profile Image
        const imgEl = document.getElementById('techProfileImg');
        const iconEl = document.getElementById('techProfileIcon');
        if (profile.profileImage) {
            imgEl.src = profile.profileImage;
            imgEl.style.display = 'block';
            iconEl.style.display = 'none';
        } else {
            imgEl.style.display = 'none';
            iconEl.style.display = 'block';
        }

        // Subscription Tab
        document.getElementById('subPlanName').innerText = plan?.name || 'بدون باقة';
        
        if (profile.subscriptionStartDate) {
            document.getElementById('subRegDate').innerText = new Date(profile.subscriptionStartDate).toLocaleDateString('ar-EG');
        }
        if (profile.subscriptionExpiry) {
            document.getElementById('subPlanExpiry').innerText = `ساري حتى: ${new Date(profile.subscriptionExpiry).toLocaleDateString('ar-EG')}`;
        }

        // View Public Profile Link
        const viewLink = document.getElementById('viewPublicProfile');
        if (viewLink && user.id) {
            viewLink.href = `technician-profile.html?id=${user.id}`;
        }
    } catch (err) {
        console.error('Render Error:', err);
    }
}

function calculateSubscription() {
    const expiry = techData.profile.subscriptionExpiry;
    if (!expiry) {
        document.getElementById('daysLeftText').innerText = 'غير محدد';
        return;
    }

    const expiryDate = new Date(expiry);
    const now = new Date();
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const daysText = document.getElementById('daysLeftText');
    const alertBox = document.getElementById('subExpiryAlert');
    const alertDays = document.getElementById('daysLeftAlert');

    if (diffDays <= 0) {
        daysText.innerText = 'منتهي';
        daysText.style.color = '#ef4444';
        alertBox.style.display = 'flex';
        alertBox.style.background = '#fef2f2';
        alertBox.style.borderColor = '#fee2e2';
        alertDays.innerText = '0';
    } else {
        daysText.innerText = `${diffDays} يوم`;
        if (diffDays <= 5) {
            alertBox.style.display = 'flex';
            alertDays.innerText = diffDays;
        } else {
            alertBox.style.display = 'none';
        }
    }
}

function renderGallery() {
    const imagesGrid = document.getElementById('imagesGrid');
    const videosGrid = document.getElementById('videosGrid');
    
    imagesGrid.innerHTML = '';
    videosGrid.innerHTML = '';

    const benefits = techData.plan?.benefits || {};

    // Images
    if (benefits.workImages) {
        techData.profile.galleryImages.forEach(img => {
            const div = document.createElement('div');
            div.className = 'media-item';
            div.innerHTML = `
                <img src="/${img}" alt="عمل سابق">
                <button class="delete-btn" onclick="deleteMedia('${img}', 'image')"><i class="fas fa-trash"></i></button>
            `;
            imagesGrid.appendChild(div);
        });

        const placeholder = document.createElement('div');
        placeholder.className = 'upload-placeholder';
        placeholder.onclick = () => document.getElementById('imageUploadInput').click();
        placeholder.innerHTML = `<i class="fas fa-plus"></i><span>إضافة صورة</span>`;
        imagesGrid.appendChild(placeholder);
    }

    // Videos
    const isProfessional = techData.plan?.themeKey === 'professional';
    const canShowVideos = benefits.workVideos || isProfessional;
    
    if (canShowVideos) {
        const videoList = techData.profile.galleryVideos || [];
        videoList.forEach(vid => {
            const div = document.createElement('div');
            div.className = 'media-item';
            div.innerHTML = `
                <video src="/${vid}" style="width:100%; height:100%; object-fit:cover;"></video>
                <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; pointer-events:none;">
                   <i class="fas fa-play-circle" style="color:white; font-size:2rem; opacity:0.8;"></i>
                </div>
                <button class="delete-btn" onclick="deleteMedia('${vid}', 'video')"><i class="fas fa-trash"></i></button>
            `;
            // Make video clickable to play in new tab or modal
            div.style.cursor = 'pointer';
            div.onclick = (e) => {
                if (e.target.closest('.delete-btn')) return;
                window.open(`/${vid}`, '_blank');
            };
            videosGrid.appendChild(div);
        });

        // Only show upload placeholder if (Premium) OR (Professional AND count < 1)
        const canUploadMore = benefits.workVideos || (isProfessional && videoList.length < 1);
        
        if (canUploadMore) {
            const placeholder = document.createElement('div');
            placeholder.className = 'upload-placeholder';
            placeholder.onclick = () => document.getElementById('videoUploadInput').click();
            placeholder.innerHTML = `<i class="fas fa-plus"></i><span>إضافة فيديو</span>`;
            videosGrid.appendChild(placeholder);
        }
    }
}

function checkPlanBenefits() {
    const benefits = techData.plan?.benefits || {};
    const isProfessional = techData.plan?.themeKey === 'professional';
    
    document.getElementById('imagesLock').style.display = benefits.workImages ? 'none' : 'flex';
    document.getElementById('imagesContainer').style.display = benefits.workImages ? 'block' : 'none';
    
    // Show videos if workVideos is true OR plan is professional (which allows 1 video)
    const canShowVideos = benefits.workVideos || isProfessional;
    document.getElementById('videosLock').style.display = canShowVideos ? 'none' : 'flex';
    document.getElementById('videosContainer').style.display = canShowVideos ? 'block' : 'none';
}

function bindSidebar() {
    document.querySelectorAll('#techSidebarNav a[data-section]').forEach(link => {
        link.onclick = () => {
            const section = link.getAttribute('data-section');
            document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`section-${section}`).classList.add('active');
            document.querySelectorAll('#techSidebarNav a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
        };
    });
}

function bindForms() {
    document.getElementById('techProfileForm').onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData);

        try {
            const res = await fetch(`${API_BASE}/technicians/profile`, {
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
}

function bindUploads() {
    const imgInput = document.getElementById('imageUploadInput');
    const vidInput = document.getElementById('videoUploadInput');

    imgInput.onchange = (e) => handleUpload(e.target.files[0], 'image');
    vidInput.onchange = (e) => handleUpload(e.target.files[0], 'video');
}

async function handleUpload(file, type) {
    if (!file) return;
    const formData = new FormData();
    formData.append('media', file);
    formData.append('type', type);

    showStatus('جاري الرفع...', 'info');

    try {
        const res = await fetch(`${API_BASE}/technicians/gallery`, {
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
}

async function handleProfileImageUpload(file) {
    if (!file) return;
    const formData = new FormData();
    formData.append('media', file);

    showStatus('جاري رفع الصورة الشخصية...', 'info');

    try {
        const res = await fetch(`${API_BASE}/technicians/profile-image`, {
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
}

function bindRenewForm() {
    const pkgSelect = document.getElementById('renewPackage');
    const payDetails = document.getElementById('renewPaymentDetails');
    const uploadArea = document.getElementById('renewUploadArea');

    pkgSelect.onchange = () => {
        const val = pkgSelect.value;
        if (val === 'starter') {
            payDetails.style.display = 'none';
            uploadArea.style.display = 'none';
        } else {
            payDetails.style.display = 'block';
            uploadArea.style.display = 'block';
        }
    };

    document.getElementById('renewForm').onsubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('package', pkgSelect.value);
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
        formData.append('password', 'dummy'); // Not needed for renew but required by model

        const priceMap = { starter: 0, professional: 50, premium: 100 };
        formData.append('price', priceMap[pkgSelect.value]);

        const screenshot = document.getElementById('renewScreenshot').files[0];
        if (pkgSelect.value !== 'starter' && !screenshot) {
            return showStatus('يرجى رفع صورة إيصال التحويل', 'error');
        }
        if (screenshot) formData.append('paymentScreenshot', screenshot);

        showStatus('جاري إرسال الطلب...', 'info');

        try {
            const res = await fetch(`${API_BASE}/join`, {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                showStatus('تم إرسال طلب التجديد بنجاح! سيتم مراجعته قريباً.', 'success');
                e.target.reset();
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            showStatus(err.message, 'error');
        }
    };
}

async function deleteMedia(filePath, type) {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;
    try {
        const res = await fetch(`${API_BASE}/technicians/gallery`, {
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
}

function showStatus(msg, type) {
    const statusDiv = document.getElementById('techStatusMsg');
    statusDiv.style.display = 'block';
    statusDiv.innerText = msg;
    if (type === 'success') {
        statusDiv.style.background = '#d1fae5';
        statusDiv.style.color = '#065f46';
    } else if (type === 'error') {
        statusDiv.style.background = '#fee2e2';
        statusDiv.style.color = '#991b1b';
    } else {
        statusDiv.style.background = '#eff6ff';
        statusDiv.style.color = '#1d4ed8';
    }
    setTimeout(() => { statusDiv.style.display = 'none'; }, 5000);
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

window.deleteMedia = deleteMedia;
window.handleProfileImageUpload = handleProfileImageUpload;
window.logout = logout;
init();
