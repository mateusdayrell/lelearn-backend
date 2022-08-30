import Usuario from '../models/Usuario';
import { Op } from "sequelize";

class UsuarioController {
  async index(req, res) {
    try {
      const usuarios = await Usuario.findAll();

      return res.json(usuarios);
    } catch (error) {
      return res.json(null);
    }
  }

  async show(req, res) {
    try {

      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);

      return res.json(usuario);
    } catch (error) {
      return res.json(null);
    }
  }

  async store(req, res) {
    try {
      const novoUsuario = await Usuario.create(req.body);

      return res.json(novoUsuario);
    } catch (error) {
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
          erros: ['CPF não enviado.'],
        });
      }

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(400).json({
          erros: ['Usuário não existe.'],
        });
      }

      const usuarioEditado = await usuario.update(req.body);

      return res.json(usuarioEditado);
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
          erros: ['CPF não enviado.'],
        });
      }

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(400).json({
          erros: ['Usuário não existe.'],
        });
      }

      await usuario.destroy();

      return res.json(usuario); // também pode enviar null
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  }

  async search(req, res){
    try {
      const { search } = req.params;
      const urlParams = new URLSearchParams(search)

      const cpf = urlParams.get('cpf')
      const nome = urlParams.get('nome')
      const tipo = urlParams.get('tipo')

      const usuarios = await Usuario.findAll({
        where: {
          [Op.and]: [
            {cpf: { [Op.substring]: cpf}},
            {nome: { [Op.substring]: nome}},
            {tipo: { [Op.substring]: tipo}}
          ]
        }
      })

      return res.json(usuarios);
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  }
}

export default new UsuarioController();
