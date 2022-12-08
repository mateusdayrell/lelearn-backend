/* eslint-disable consistent-return */
const Curso = require('../../models/Curso');

require('dotenv').config();

const handleHook = async (cod_curso, qtd) => {
  try {
    const curso = await Curso.findByPk(cod_curso);
    curso.videos_qtd = qtd;
    curso.save();
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      erros: ['Erro ao executar hook.'],
    });
  }
};

module.exports = handleHook;
