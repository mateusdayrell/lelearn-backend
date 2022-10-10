import { Op } from 'sequelize';

import Curso from '../models/Curso';
import upload from '../services/multer';
import { apagarFotoCurso } from '../helpers/CursoHelper';

class CursoController {
  async index(req, res) {
    try {
      const cursos = await Curso.findAll({
        include: ['videos'],
        order: [['nome_curso'], ['videos', 'titulo_video', 'ASC']],
      });
      return res.json(cursos);
    } catch (error) {
      return res.json(null);
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const curso = await Curso.findByPk(id, {
        include: 'videos',
      });

      return res.json(curso);
    } catch (error) {
      return res.json(null);
    }
  }

  async store(req, res) {
    try {
      return upload(req, res, async (error) => {
        if (error) {
          return res.status(400).json({
            erros: [error.code],
          });
        }

        const objCurso = {... req.body}

        if(req.file){
          const { filename } = req.file;
          objCurso.nome_arquivo = filename
        }

        const novoCurso = await Curso.create(objCurso);
        return res.json(novoCurso);
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  }

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

      return upload(req, res, async (error) => {
        if (error) {
          return res.status(400).json({
            erros: [error.code],
          });
        }

        const objCurso = {... req.body}

        if(req.file){
          const { filename } = req.file;
          objCurso.nome_arquivo = filename
        }

        if (curso.nome_arquivo) {
          if (!apagarFotoCurso(curso.nome_arquivo)) {
            return res.status(400).json({
              erros: ['Erro ao excluir imagem'],
            });
          }
        }

        const cursoEditado = await curso.update(objCurso);
        return res.json(cursoEditado);
      });
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

      if (curso.nome_arquivo) {
        if (!apagarFotoCurso(curso.nome_arquivo)) {
          return res.status(400).json({
            erros: ['Erro ao excluir imagem'],
          });
        }
      }

      await curso.destroy();

      return res.json(curso); // também pode enviar null
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  }

  async search(req, res) {
    try {
      const { search } = req.params;
      const urlParams = new URLSearchParams(search);

      const nome_curso = urlParams.get('nome_curso');

      const cursos = await Curso.findAll({
        where: {
          nome_curso: { [Op.substring]: nome_curso },
        },
        include: ['videos'],
        order: [['nome_curso', 'ASC'], ['videos', 'titulo_video', 'ASC']],
      });

      return res.json(cursos);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default new CursoController();
