import Usuario from '../models/Usuario';

class UsuarioController {
  async index(req, res) {
    const novoUsuario = await Usuario.create({
      cpf: '00000000000',
      nome: 'nome',
      email: 'email@email.com',
      telefone: '38999999999',
      password: '12345678',
      tipo: 0,
    });
    res.json(
      novoUsuario,
    );
  }
}

export default new UsuarioController();
