const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|docx|doc|pptx|txt|zip|jpg|png/;
    allowed.test(file.mimetype) ? cb(null, true) : cb(new Error('Type interdit'));
  }
});

module.exports = {
  single: upload.single('file'),
  array: upload.array('files', 10)
};