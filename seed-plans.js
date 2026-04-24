const mongoose = require('mongoose');
const Plan = require('./src/models/Plan.model');
require('dotenv').config();

const seedPlans = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const plans = [
            {
                name: 'باقة البداية',
                themeKey: 'starter',
                price: 0,
                description: 'مثالية للفنيين المبتدئين لتجربة المنصة',
                features: ['ظهور في البحث', 'بيانات الاتصال'],
                sortPriority: 1,
                benefits: {
                    platformVisibility: true,
                    contactInfo: true,
                    workImages: false,
                    workVideos: false,
                    topInListing: false,
                    trustedBadge: false
                }
            },
            {
                name: 'الباقة الاحترافية',
                themeKey: 'professional',
                price: 500,
                description: 'للفنيين الذين يرغبون في عرض أعمالهم بالصور',
                features: ['ظهور في البحث', 'بيانات الاتصال', 'معرض صور الأعمال'],
                sortPriority: 2,
                benefits: {
                    platformVisibility: true,
                    contactInfo: true,
                    workImages: true,
                    workVideos: false,
                    topInListing: true,
                    trustedBadge: true
                }
            },
            {
                name: 'الباقة المميزة',
                themeKey: 'premium',
                price: 800,
                description: 'أقصى استفادة مع دعم الفيديوهات والظهور المتصدر',
                features: ['ظهور متصدر', 'بيانات الاتصال', 'معرض صور وفيديوهات'],
                sortPriority: 3,
                benefits: {
                    platformVisibility: true,
                    contactInfo: true,
                    workImages: true,
                    workVideos: true,
                    topInListing: true,
                    trustedBadge: true
                }
            }
        ];

        for (const p of plans) {
            await Plan.findOneAndUpdate({ themeKey: p.themeKey }, p, { upsert: true });
        }

        console.log('Plans seeded successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedPlans();
