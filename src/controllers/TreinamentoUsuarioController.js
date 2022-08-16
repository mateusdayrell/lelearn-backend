import TreinamentoUsuario from '../models/TreinamentoUsuario';
import Treinamento from '../models/Treinamento';
import Usuario from '../models/Usuario';

class TreinamentoUsuarioController {
  async index(req, res) {
    try {
      const treinamentos = await TreinamentoUsuario.findAll();
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
          erros: ['Código do treinamento-usuário não enviado.'],
        });
      }

      const treinUsuario = await TreinamentoUsuario.findByPk(id);

      return res.json(treinUsuario);
    } catch (error) {
      return res.json(null);
    }
  }

  async store(req, res) {
    try {
      const { cod_treinamento, cpf } = req.body; // eslint-disable-line

      if (!cod_treinamento) { // eslint-disable-line
        return res.status(400).json({
          erros: ['Código do treinamento não enviado.'],
        });
      }

      if (!cpf) {
        return res.status(400).json({
          erros: ['CPF não enviado.'],
        });
      }

      const treinamento = await Treinamento.findByPk(cod_treinamento);

      if (!treinamento) {
        return res.status(400).json({
          erros: ['Treinamento não existe.'],
        });
      }

      const usuario = await Usuario.findByPk(cpf);
      if (!usuario) {
        return res.status(400).json({
          erros: ['Usuário não existe.'],
        });
      }

      const treinUsuario = await TreinamentoUsuario.create(req.body);

      return res.json(treinUsuario);
    } catch (error) {
      return res.status(400).json({
        erros: error,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { cod_treinamento, cpf } = req.body; // eslint-disable-line

      if (!id) {
        return res.status(400).json({
          erros: ['Código do treinamento-usuário não enviado.'],
        });
      }

      const treinUsuario = TreinamentoUsuario.findByPk(id);

      if (!treinUsuario) { // eslint-disable-line
        return res.status(400).json({
          erros: ['Código do treinamento-usuário não enviado.'],
        });
      }

      if (!cod_treinamento) { // eslint-disable-line
        return res.status(400).json({
          erros: ['Código do treinamento não enviado.'],
        });
      }

      if (!cpf) {
        return res.status(400).json({
          erros: ['CPF não enviado.'],
        });
      }

      const treinamento = await Treinamento.findByPk(cod_treinamento);
      if (!treinamento) {
        return res.status(400).json({
          erros: ['Treinamento não existe.'],
        });
      }

      const usuario = await Usuario.findByPk(cpf);
      if (!usuario) {
        return res.status(400).json({
          erros: ['Usuário não existe.'],
        });
      }

      const treinUsuarioEditado = await treinUsuario.update(req.body);

      return res.json(treinUsuarioEditado);
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
          erros: ['Código do treinamento-usuário não enviado.'],
        });
      }

      const treinUsuario = TreinamentoUsuario.findByPk(id);

      if (!treinUsuario) {
        return res.status(400).json({
          erros: ['Treinamento-usuario não existe.'],
        });
      }

      await treinUsuario.destroy();

      return res.json(treinUsuario); // também pode enviar null
    } catch (error) {
      return res.status(400).json({
        erros: error.errors.map((err) => err.message),
      });
    }
  }
}

export default new TreinamentoUsuarioController();
