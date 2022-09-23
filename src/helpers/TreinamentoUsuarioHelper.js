const Treinamento = require('../models/Treinamento');
const Usuario = require('../models/Treinamento');

const validateParams = (params) => {
  const erros = [];

  if (!params.cpf) {
    erros.push('CPF do treinamento-usuário não enviado.');
  }
  if (!params.cod_treinamento) {
    erros.push('Código de treinamento do treinamento-usuário não enviado.');
  }

  return erros;
};

const validateBody = async (body, res, update) => {
  try {
    const erros = [];

    if (!body.cpf && !update) {
      erros.push('CPF do usuário não enviado');
    }
    if (!body.cod_treinamento && !update) {
      erros.push('Código do treinamento não enviado');
    }

    if (erros.length > 0) return erros;

    if (body.cpf) {
      const usuario = await Usuario.findByPk(body.cpf);
      if (!usuario) {
        erros.push('Usuário não existe.');
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

module.exports = {
  validateBody,
  validateParams,
};
