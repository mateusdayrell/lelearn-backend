const TreinamentoUsuario = require('../models/TreinamentoUsuario');
const { validateBody, validateParams } = require('../helpers/TreinamentoUsuarioHelper');

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
      const erros = validateParams(req.params);

      if (erros.length > 0) {
        return res.status(400).json({ erros });
      }

      const treinamentoUsuario = await TreinamentoUsuario.findOne(req.params);

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
      const erros = await validateBody(req.body, res);

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
      let erros = [];
      erros = validateParams(req.params);

      if (erros.length > 0) {
        return res.status(400).json({ erros });
      }

      erros = validateBody(req.body, res, true);

      if (erros.length > 0) {
        return res.status(400).json({ erros });
      }

      const treinamentoUsuario = await TreinamentoUsuario.findOne(req.params);

      if (!treinamentoUsuario) {
        return res.status(400).json({
          erros: ['Treinamento-usuário não existe.'],
        });
      }

      const [editado] = await TreinamentoUsuario.update(req.body, { where: req.params });

      if (editado === 0) {
        return res.status(400).json({
          erros: ['Nenhum treinamento-usuário editado.'],
        });
      }

      const novoTreinamentoUsuario = await TreinamentoUsuario.findOne(req.body);

      return res.json(novoTreinamentoUsuario);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async destroy(req, res) {
    try {
      const erros = validateParams(req.params);

      if (erros.length > 0) {
        return res.status(400).json({ erros });
      }

      const treinamentoUsuario = await TreinamentoUsuario.findOne(req.params);

      if (!treinamentoUsuario) {
        return res.status(400).json({
          erros: ['Treinamento-usuário não existe.'],
        });
      }

      await TreinamentoUsuario.destroy({ where: req.params });

      return res.json(null);
    } catch (error) {
      return res.status(400).json({
        erros: error,
      });
    }
  },
};
