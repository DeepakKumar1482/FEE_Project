const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dhrahulpp',
    api_key: '974478933734273',
    api_secret: 'FqL_93woeYB8Gyu2wmV22XSSDbw'
});

module.exports = cloudinary;