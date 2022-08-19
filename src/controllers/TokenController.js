import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';

class TokenController {
  async store(req, res) {
    const { email = '', senha = '' } = req.body;

    if (!email || !senha) {
      return res.status(401).json({
        erros: ['Credenciais inválidas.'],
      });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({
        erros: ['Usuário não existe.'],
      });
    }

    if (!(await usuario.validarSenha(senha))) {
      return res.status(401).json({
        erros: ['Senha inválida.'],
      });
    }

    const { cpf, tipo } = usuario;
    const token = jwt.sign({ cpf, email, tipo }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    return res.json({ token, usuario: { cpf, email, nome: usuario.nome } });
  }
}

export default new TokenController();
