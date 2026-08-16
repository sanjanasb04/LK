const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'file-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Flexible file filter allowing images, videos, audio and documents
const fileFilter = (req, file, cb) => {
  const mime = (file.mimetype || '').toLowerCase();
  const ext = (path.extname(file.originalname) || '').toLowerCase();
  
  if (
    mime.startsWith('image/') || 
    mime.startsWith('video/') || 
    mime.startsWith('audio/') || 
    mime.includes('pdf') || 
    mime.includes('word') || 
    mime.includes('officedocument') ||
    mime.includes('octet-stream') ||
    ['.mp4', '.mkv', '.webm', '.mov', '.avi', '.wmv', '.flv', '.pdf', '.docx', '.doc', '.txt'].includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file format (${file.mimetype || ext}). Please upload valid image, video, audio or document files.`), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit for videos and recordings
  fileFilter: fileFilter
});

// POST /api/upload
router.post('/', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer Upload Error:', err);
      return res.status(400).json({ success: false, message: `Upload limit error: ${err.message}` });
    } else if (err) {
      console.error('File Filter Error:', err);
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file received in upload payload' });
    }

    // Return relative public path
    const fileUrl = `/uploads/${req.file.filename}`;
    
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  });
});

module.exports = router;
