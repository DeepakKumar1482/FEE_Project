const multer = require('multer');
const path = require('path');

// Create public directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public', { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public')
    },
    filename: function(req, file, cb) {
        // Use unique filename to prevent overwriting
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and GIF allowed.'));
        }
    }
});

module.exports = upload;