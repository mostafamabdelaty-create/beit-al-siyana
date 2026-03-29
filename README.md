# 🔧 Sallahly Backend API

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# عدّل الـ MONGODB_URI و JWT_SECRET

# 3. Run in development
npm run dev

# 4. Run in production
npm start
```

---

## 📡 API Endpoints

### Auth `/api/auth`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | تسجيل عميل جديد | ❌ |
| POST | `/login` | تسجيل دخول | ❌ |
| GET | `/me` | بيانات المستخدم الحالي | ✅ |

### Technicians `/api/technicians`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | جلب كل الفنيين (فلتر: service, location, available) | ❌ |
| GET | `/:id` | تفاصيل فني | ❌ |
| POST | `/:id/reviews` | إضافة تقييم | ✅ Client |
| POST | `/` | إضافة فني | ✅ Admin |
| PUT | `/:id` | تعديل فني | ✅ Admin |
| DELETE | `/:id` | حذف فني | ✅ Admin |

### Services `/api/services`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | جلب كل الخدمات | ❌ |
| POST | `/` | إضافة خدمة | ✅ Admin |
| PUT | `/:id` | تعديل خدمة | ✅ Admin |
| DELETE | `/:id` | حذف خدمة | ✅ Admin |

### Bookings `/api/bookings`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | طلب حجز جديد | ✅ Client |
| GET | `/my` | طلباتي | ✅ Client |
| DELETE | `/:id` | إلغاء طلب | ✅ Client |
| GET | `/` | كل الطلبات | ✅ Admin |
| PUT | `/:id/status` | تغيير حالة طلب | ✅ Admin |

### Packages `/api/packages`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | جلب الباقات | ❌ |
| POST | `/` | إضافة باقة | ✅ Admin |
| PUT | `/:id` | تعديل باقة | ✅ Admin |
| DELETE | `/:id` | حذف باقة | ✅ Admin |

### Join Requests `/api/join`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | تقديم طلب انضمام كفني | ❌ |
| GET | `/` | كل الطلبات | ✅ Admin |
| PUT | `/:id/approve` | قبول طلب + إنشاء فني تلقائي | ✅ Admin |
| PUT | `/:id/reject` | رفض طلب | ✅ Admin |

### Admin `/api/admin`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/stats` | إحصائيات Dashboard | ✅ Admin |
| GET | `/users` | كل المستخدمين | ✅ Admin |
| PUT | `/users/:id/toggle` | تفعيل/إيقاف مستخدم | ✅ Admin |

---

## 🔐 Authentication

أضف الـ token في الـ headers:
```
Authorization: Bearer <your_token>
```

---

## 📦 Booking Status Flow
```
pending → confirmed → in_progress → completed
                  ↘ cancelled
```

---

## 🗄️ Database Models

- **User** - العملاء والأدمن
- **Technician** - الفنيين مع التقييمات
- **Service** - أنواع الخدمات
- **Booking** - طلبات الحجز
- **Package** - باقات الأسعار
- **JoinRequest** - طلبات انضمام الفنيين
