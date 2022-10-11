const { Op } = require('sequelize');
const Curso = require('../models/Curso');
const Usuario = require('../models/Usuario');

const Treinamento = require('../models/Treinamento');

module.exports = {
  async index(req, res) {
    try {
      const treinamentos = await Treinamento.findAll({
        include: [{ model: Usuario, as: 'usuarios', attributes: ['cpf', 'nome'] }, 'cursos'],
        order: [['nome_treinamento'], ['usuarios', 'nome'], ['cursos', 'nome_curso']],
      });

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
      const { usuarios, cursos } = req.body;

      const novoTreinamento = await Treinamento.create(req.body);

      if (usuarios) {
        const usuariosArr = [];
        usuarios.forEach((u) => {
          usuariosArr.push(u.cpf);
        });
        await novoTreinamento.setUsuarios(usuariosArr);
      }

      if (cursos) {
        const cursosArr = [];
        cursos.forEach((c) => {
          cursosArr.push(c.cod_curso);
        });
        await novoTreinamento.setCursos(cursosArr);
      }

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
      const { usuarios, cursos } = req.body;
      const usuariosArr = [];
      const cursosArr = [];

      if (!id) {
        return res.status(400).json({
          erros: ['Código do treinamento não enviado.'],
        });
      }

      const treinamento = await Treinamento.findByPk(id, {
        include: [{ model: Usuario, as: 'usuarios', attributes: ['cpf', 'nome'] }, 'cursos'],
      });

      if (!treinamento) {
        return res.status(400).json({
          erros: ['Treinamento não existe.'],
        });
      }

      if (usuarios) {
        usuarios.forEach((u) => {
          usuariosArr.push(u.cpf);
        });
        await treinamento.setUsuarios(usuariosArr);
      }

      if (cursos) {
        cursos.forEach((c) => {
          cursosArr.push(c.cod_curso);
        });
        await treinamento.setCursos(cursosArr);
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

      await treinamento.setCursos(null);
      await treinamento.setUsuarios(null);
      await treinamento.destroy();

      return res.json(treinamento); // também pode enviar null
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },

  async search(req, res) {
    try {
      const { search } = req.params;
      const urlParams = new URLSearchParams(search);

      const nome_treinamento = urlParams.get('nome_treinamento');
      const cpf = urlParams.get('cpf');
      const cod_curso = urlParams.get('cod_curso');

      const treinamentos = await Treinamento.findAll({
        where: {
          [Op.and]: [
            { nome_treinamento: { [Op.substring]: nome_treinamento } },
          ],
        },
        include: [
          {
            model: Usuario,
            as: 'usuarios',
            where: {
              cpf: cpf || { [Op.not]: null },
            },
          },
          {
            model: Curso,
            as: 'cursos',
            where: {
              cod_curso: cod_curso || { [Op.not]: null },
            },
          },
        ],
        order: [['nome_treinamento'], ['usuarios', 'nome'], ['cursos', 'nome_curso']],
      });

      return res.json(treinamentos);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  },
};
