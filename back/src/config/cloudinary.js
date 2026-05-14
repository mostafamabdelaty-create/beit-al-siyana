const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'beit-al-siyana/gallery';
    let resource_type = 'auto';

    if (req.originalUrl.includes('profile-image')) {
      folder = 'beit-al-siyana/profiles';
    } else if (file.mimetype.startsWith('video')) {
      folder = 'beit-al-siyana/videos';
      resource_type = 'video';
    }

    return {
      folder: folder,
      resource_type: resource_type,
      allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'webm'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
    };
  }
});

module.exports = { cloudinary, storage };
