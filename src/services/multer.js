const multer = require('multer');
const multerConfig = require('../config/multerConfig');

const upload = multer(multerConfig).single('foto');

module.exports = upload;
