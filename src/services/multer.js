import multer from 'multer';
import multerConfig from '../config/multerConfig';

const upload = multer(multerConfig).single('foto');

export default upload;
