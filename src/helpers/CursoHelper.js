const fs = require('fs');
const { resolve } = require('path');

const apagarFotoCurso = async (nomeArquivo) => {
  try {
    const filePath = resolve(__dirname, '..', '..', 'uploads', 'images', nomeArquivo);
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

module.exports = {
  apagarFotoCurso,
};
