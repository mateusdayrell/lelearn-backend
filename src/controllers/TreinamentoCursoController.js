const TreinamentoCurso = require('../models/TreinamentoCurso');
const { validateBody, validateParams } = require('../helpers/TreinamentoCursoHelper');

module.exports = {
  async index(req, res) {
    try {
      const treinamentos = await TreinamentoCurso.findAll();
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

      const treinamentoCurso = await TreinamentoCurso.findOne({ where: req.params });

      if (!treinamentoCurso) {
        return res.status(400).json({
          erros: ['Treinamento-curso não existe.'],
        });
      }

      return res.json(treinamentoCurso);
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

      const treinamentoCurso = await TreinamentoCurso.create(req.body);

      return res.json(treinamentoCurso);
    } catch (error) {
      return res.status(400).json({
        erros: error,
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

      const treinamentoCurso = await TreinamentoCurso.findOne(req.params);

      if (!treinamentoCurso) {
        return res.status(400).json({
          erros: ['Treinamento-curso não existe.'],
        });
      }

      const [editado] = await TreinamentoCurso.update(req.body, { where: req.params });

      if (editado === 0) {
        return res.status(400).json({
          erros: ['Nenhum treinamento-curso editado.'],
        });
      }

      const novoTreinamentoCurso = await TreinamentoCurso.findOne(req.body);

      return res.json(novoTreinamentoCurso);
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

      const treinamentoCurso = await TreinamentoCurso.findOne(req.params);

      if (!treinamentoCurso) {
        return res.status(400).json({
          erros: ['Treinamento-curso não existe.'],
        });
      }

      await TreinamentoCurso.destroy({ where: req.params });

      return res.json(null);
    } catch (error) {
      return res.status(400).json({
        erros: error,
      });
    }
  },
};
