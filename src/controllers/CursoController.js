import Curso from '../models/Curso';

class CursoController {
  async index(req, res) {
    try {
      const cursos = await Curso.findAll();

      return res.json(cursos);
    } catch (error) {
      return res.json(null);
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const curso = await Curso.findByPk(id);

      return res.json(curso);
    } catch (error) {
      return res.json(null);
    }
  }

  // async create(req, res) {
  //   try {

  //   } catch (error) {

  //   }
  // }

  async store(req, res) {
    try {
      const novoCurso = await Curso.create(req.body);

      return res.json(novoCurso);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  }

  // async edit(req, res) {
  //   try {

  //   } catch (error) {

  //   }
  // }

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do curso não enviado.'],
        });
      }

      const curso = await Curso.findByPk(id);

      if (!curso) {
        return res.status(400).json({
          erros: ['Curso não existe.'],
        });
      }

      const cursoEditado = await curso.update(req.body);

      return res.json(cursoEditado);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do curso não enviado.'],
        });
      }

      const curso = await Curso.findByPk(id);

      if (!curso) {
        return res.status(400).json({
          erros: ['Curso não existe.'],
        });
      }

      await curso.destroy();

      return res.json(curso); // também pode enviar null
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  }
}

export default new CursoController();
