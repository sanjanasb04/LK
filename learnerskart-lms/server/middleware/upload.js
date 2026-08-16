const multer = require('multer');
const path = require('path');
const fs = require('fs');

let storage;

// Try configuring Cloudinary if keys exist
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  try {
    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => {
        let folder = 'learnerskart-lms';
        let resource_type = 'auto';
        
        // Categorize storage types
        if (file.mimetype.startsWith('video/')) {
          folder = 'learnerskart-lms/videos';
          resource_type = 'video';
        } else if (file.mimetype === 'application/pdf') {
          folder = 'learnerskart-lms/documents';
          resource_type = 'raw';
        } else {
          folder = 'learnerskart-lms/images';
          resource_type = 'image';
        }

        return {
          folder: folder,
          resource_type: resource_type,
          public_id: file.originalname.split('.')[0] + '-' + Date.now()
        };
      }
    });
    console.log('UPLOAD CONFIG: Cloudinary storage configured successfully.');
  } catch (err) {
    console.error('Failed to configure Cloudinary. Falling back to local storage.', err);
  }
}

if (!storage) {
  // Local storage fallback
  const localUploadDir = path.join(__dirname, '..', 'public', 'uploads');
  if (!fs.existsSync(localUploadDir)) {
    fs.mkdirSync(localUploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, localUploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  console.log('UPLOAD CONFIG: Fallback Local Disk storage configured.');
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/mpeg', 'video/quicktime',
    'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported by the system. Allowed: Images, Videos, PDFs, and Excels'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max file size limit
  }
});

module.exports = upload;
