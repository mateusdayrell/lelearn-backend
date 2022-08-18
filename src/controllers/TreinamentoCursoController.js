const TreinamentoCurso = require('../models/TreinamentoCurso');
const Treinamento = require('../models/Treinamento');
const Curso = require('../models/Curso');

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
      const erros = validateParams(req.params)

      if (erros.length > 0) {
        return res.status(400).json({ erros });
      }

      const treinamentoCurso = await TreinamentoCurso.findOne({ where:req.params})

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
      const erros = await validateBody(req.body, res)

      if (erros.length > 0) {
        return res.status(400).json({ erros });
      }

      const treinamentoCurso = await TreinamentoCurso.create(req.body);

      return res.json(treinamentoCurso);
    } catch (error) {
      return res.status(400).json({
        erros: error
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

      const treinamentoCurso = await TreinamentoCurso.findOne(req.params)

      if (!treinamentoCurso) {
        return res.status(400).json({
          erros: ['Treinamento-curso não existe.'],
        });
      }

      const [ editado ] = await TreinamentoCurso.update(req.body, {where : req.params})

      if(editado === 0){
        return res.status(400).json({
          erros: ['Nenhum treinamento-curso editado.'],
        });
      }

      const novoTreinamentoCurso = await TreinamentoCurso.findOne(req.body)

      return res.json(novoTreinamentoCurso);
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

      const treinamentoCurso = await TreinamentoCurso.findOne(req.params)

      if (!treinamentoCurso) {
        return res.status(400).json({
          erros: ['Treinamento-curso não existe.'],
        });
      }

      await TreinamentoCurso.destroy({ where: req.params },);

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

    if (!params.cod_curso) {
      erros.push('Código de curso do treinamento-curso não enviado.');
    }
    if (!params.cod_treinamento) {
      erros.push('Código de treinamento do treinamento-curso não enviado.');
    }

    return erros;
}

const validateBody = async (body, res, update) => {
  try {
    const erros = [];

    if (!body.cod_curso && !update) {
      erros.push('Código do curso não enviado');
    }
    if (!body.cod_treinamento && !update) {
      erros.push('Código do treinamento não enviado')
    }

    if(erros.length > 0) return erros

    if(body.cod_curso){
      const curso = await Curso.findByPk(body.cod_curso);
      if (!curso) {
        erros.push('Curso não existe.');
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
