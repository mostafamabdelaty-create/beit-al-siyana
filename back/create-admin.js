const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User.model');

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    let admin = await User.findOne({ email: 'admin@gmail.com' });

    if (admin) {
      console.log('⚠️ الحساب موجود بالفعل، جاري تحديث بياناته ليصبح Admin..');
      admin.role = 'admin';
      admin.password = 'admin1234';
      admin.mustChangePassword = false;
      await admin.save();
      console.log('✅ تم تحديث بيانات الحساب بنجاح');
    } else {
      admin = new User({
        fullName: 'Admin',
        email: 'admin@gmail.com',
        phone: '01000000000',
        password: 'admin1234',
        role: 'admin',
        status: 'active',
        isVerified: true,
        mustChangePassword: false
      });
      await admin.save();
      console.log('✅ تم إنشاء الحساب بنجاح');
    }

    console.log({
      email: admin.email,
      password: 'admin1234',
      role: admin.role
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();