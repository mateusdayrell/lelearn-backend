import TreinamentoCurso from '../models/TreinamentoCurso';
import Treinamento from '../models/Treinamento';
import Curso from '../models/Curso';

class TreinamentoCursoController {
  async index(req, res) {
    try {
      const treinamentos = await TreinamentoCurso.findAll();
      return res.json(treinamentos);
    } catch (error) {
      return res.json(null);
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do treinamento-curso não enviado.'],
        });
      }

      const treinCurso = await TreinamentoCurso.findByPk(id);

      return res.json(treinCurso);
    } catch (error) {
      return res.json(null);
    }
  }

  async store(req, res) {
    try {
      const { cod_treinamento, cod_curso } = req.body; // eslint-disable-line

      if (!cod_treinamento) { // eslint-disable-line
        return res.status(400).json({
          erros: ['Código do treinamento não enviado.'],
        });
      }

      if (!cod_curso) { // eslint-disable-line
        return res.status(400).json({
          erros: ['Código do curso não enviado.'],
        });
      }

      const treinamento = await Treinamento.findByPk(cod_treinamento);

      if (!treinamento) {
        return res.status(400).json({
          erros: ['Treinamento não existe.'],
        });
      }

      const curso = await Curso.findByPk(cod_curso);
      if (!curso) {
        return res.status(400).json({
          erros: ['Curso não existe.'],
        });
      }

      const treinCurso = await TreinamentoCurso.create(req.body);

      return res.json(treinCurso);
    } catch (error) {
      return res.status(400).json({
        erros: error,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { cod_treinamento, cod_curso } = req.body; // eslint-disable-line

      if (!id) {
        return res.status(400).json({
          erros: ['Código do treinamento-curso não enviado.'],
        });
      }

      const treinCurso = TreinamentoCurso.findByPk(id);

      if (!treinCurso) { // eslint-disable-line
        return res.status(400).json({
          erros: ['Treinamento-curso não existe.'],
        });
      }

      if (!cod_treinamento) { // eslint-disable-line
        return res.status(400).json({
          erros: ['Código do treinamento não enviado.'],
        });
      }

      if (!cod_curso) { // eslint-disable-line
        return res.status(400).json({
          erros: ['Código do curso não enviado.'],
        });
      }

      const treinamento = await Treinamento.findByPk(cod_treinamento);
      if (!treinamento) {
        return res.status(400).json({
          erros: ['Treinamento não existe.'],
        });
      }

      const curso = await Curso.findByPk(cod_curso);
      if (!curso) {
        return res.status(400).json({
          erros: ['Curso não existe.'],
        });
      }

      const treinCursoEditado = await treinCurso.update(req.body);

      return res.json(treinCursoEditado);
    } catch (error) {
      return res.status(400).json({
        erros: error,
      });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do treinamento-curso não enviado.'],
        });
      }

      const treinCurso = TreinamentoCurso.findByPk(id);

      if (!treinCurso) {
        return res.status(400).json({
          erros: ['Treinamento-curso não existe.'],
        });
      }

      await treinCurso.destroy();

      return res.json(treinCurso); // também pode enviar null
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  }
}

export default new TreinamentoCursoController();
