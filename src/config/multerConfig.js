const multer = require('multer');
const { extname, resolve } = require('path');

const aleatorio = () => Math.floor(Math.random() * 1000 + 1000);
const maxSize = 2000000; // 2MB

module.exports = {
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      return cb(new multer.MulterError('O arquivo deve ser do tipo JPG  ou PNG!'));
    }

    return cb(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, '..', '..', 'uploads', 'images'));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${aleatorio()}${extname(file.originalname)}`); // data_aletorio.extensao
    },
  }), // salvar no disco do servidor
};
