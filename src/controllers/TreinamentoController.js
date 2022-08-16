const Treinamento = require('../models/Treinamento');

module.exports = {
  async index(req, res) {
    try {
      const treinamentos = await Treinamento.findAll();

      return res.json(treinamentos);
    } catch (error) {
      return res.json(null);
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do treinamento não enviado.'],
        });
      }

      const treinamento = await Treinamento.findByPk(id);

      if (!treinamento) {
        return res.status(400).json({
          erros: ['Treinamento não existe.'],
        });
      }

      return res.json(treinamento);
    } catch (error) {
      return res.json(null);
    }
  },

  async store(req, res) {
    try {
      const novoTreinamento = await Treinamento.create(req.body);

      return res.json(novoTreinamento);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do treinamento não enviado.'],
        });
      }

      const treinamento = await Treinamento.findByPk(id);

      if (!treinamento) {
        return res.status(400).json({
          erros: ['Treinamento não existe.'],
        });
      }

      const treinamentoEditado = await treinamento.update(req.body);

      return res.json(treinamentoEditado);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do treinamento não enviado.'],
        });
      }

      const treinamento = await Treinamento.findByPk(id);

      if (!treinamento) {
        return res.status(400).json({
          erros: ['Treinamento não existe.'],
        });
      }

      await treinamento.destroy();

      return res.json(treinamento); // também pode enviar null
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },
};
