const Treinamento = require('../models/Treinamento');
const Curso = require('../models/Curso');

const validateBody = async (body, res, update) => {
  try {
    const erros = [];

    if (!body.cod_curso && !update) {
      erros.push('Código do curso não enviado');
    }
    if (!body.cod_treinamento && !update) {
      erros.push('Código do treinamento não enviado');
    }

    if (erros.length > 0) return erros;

    if (body.cod_curso) {
      const curso = await Curso.findByPk(body.cod_curso);
      if (!curso) {
        erros.push('Curso não existe.');
      }
    }

    if (body.cod_treinamento) {
      const treinamento = await Treinamento.findByPk(body.cod_treinamento);
      if (!treinamento) {
        erros.push('Treinamento não existe.');
      }
    }

    if (erros.length > 0) return erros;

    return erros;
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      erros: error,
    });
  }
};

const validateParams = (params) => {
  const erros = [];

  if (!params.cod_curso) {
    erros.push('Código de curso do treinamento-curso não enviado.');
  }
  if (!params.cod_treinamento) {
    erros.push('Código de treinamento do treinamento-curso não enviado.');
  }

  return erros;
};

module.exports = {
  validateBody,
  validateParams,
};
