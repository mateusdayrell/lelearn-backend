const TreinamentoUsuario = require('../models/TreinamentoUsuario');
const Treinamento = require('../models/Treinamento');
const Usuario = require('../models/Usuario');

module.exports = {
  async index(req, res) {
    try {
      const treinamentos = await TreinamentoUsuario.findAll();
      return res.json(treinamentos);
    } catch (error) {
      return res.json(null);
    }
  },

  async show(req, res) {
    try {
      const erros = validateParams(req.params)

      if (erros.length > 0) {
        return res.status(400).json({ erros });
      }

      const treinamentoUsuario = await TreinamentoUsuario.findOne(req.params)

      if (!treinamentoUsuario) {
        return res.status(400).json({
          erros: ['Treinamento-usuário não existe.'],
        });
      }

      return res.json(treinamentoUsuario); // também pode enviar null
    } catch (error) {
      return res.json(error);
    }
  },

  async store(req, res) {
    try {
      const erros = await validateBody(req.body, res)

      if (erros.length > 0) {
        return res.status(400).json({ erros });
      }

      const treinUsuario = await TreinamentoUsuario.create(req.body);

      return res.json(treinUsuario);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async update(req, res) {
    try {
      let erros = []
      erros = validateParams(req.params)

      if(erros.length > 0) {
        return res.status(400).json({ erros });
      }

      erros = validateBody(req.body, res, true)

      if(erros.length > 0) {
        return res.status(400).json({ erros });
      }

      const treinamentoUsuario = await TreinamentoUsuario.findOne(req.params)

      if (!treinamentoUsuario) {
        return res.status(400).json({
          erros: ['Treinamento-usuário não existe.'],
        });
      }

      const [ editado ] = await TreinamentoUsuario.update(req.body, {where : req.params})

      if(editado === 0){
        return res.status(400).json({
          erros: ['Nenhum treinamento-usuário editado.'],
        });
      }

      const novoTreinamentoUsuario = await TreinamentoUsuario.findOne(req.body)

      return res.json(novoTreinamentoUsuario);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async destroy(req, res) {
    try {
      const erros = validateParams(req.params)

      if (erros.length > 0) {
        return res.status(400).json({ erros });
      }

      const treinamentoUsuario = await TreinamentoUsuario.findOne(req.params)

      if (!treinamentoUsuario) {
        return res.status(400).json({
          erros: ['Treinamento-usuário não existe.'],
        });
      }

      await TreinamentoUsuario.destroy({ where: req.params },);

      return res.json(null);
    } catch (error) {
      return res.status(400).json({
        erros: error
      });
    }
  },
};

const validateParams = (params) => {
    const erros = [];

    if (!params.cpf) {
      erros.push('CPF do treinamento-usuário não enviado.');
    }
    if (!params.cod_treinamento) {
      erros.push('Código de treinamento do treinamento-usuário não enviado.');
    }

    return erros;
}

const validateBody = async (body, res, update) => {
  try {
    const erros = [];

    if (!body.cpf && !update) {
      erros.push('CPF do usuário não enviado');
    }
    if (!body.cod_treinamento && !update) {
      erros.push('Código do treinamento não enviado')
    }

    if(erros.length > 0) return erros

    if(body.cpf){
      const usuario = await Usuario.findByPk(body.cpf);
      if (!usuario) {
        erros.push('Usuário não existe.');
      }
    }

    if(body.cod_treinamento){
      const treinamento = await Treinamento.findByPk(body.cod_treinamento);
      if (!treinamento) {
        erros.push('Treinamento não existe.');
      }
    }

    if(erros.length > 0) return erros

    return erros;
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      erros: error,
    });
  }
}
