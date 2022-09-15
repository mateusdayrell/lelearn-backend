import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Usuario from '../models/Usuario';
import sendMail from '../helpers/EmailHelper/sendMail'
import { forgotPasswordTemplate } from '../helpers/EmailHelper/templates'

require('dotenv').config();

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

    const { cpf, tipo, nome } = usuario;
    const token = jwt.sign({ cpf, email, tipo }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    return res.json({
      token,
      usuario: {
        cpf, email, tipo, nome,
      },
    });
  }

  async resetPassword(req, res) {
    try {
      // Conferir e validar dados
      const {cpf} = req.params
      const {email} = req.body

      if (!cpf) {
        return res.status(400).json({
          erros: ['CPF não enviado.'],
        });
      }

      const usuario = await Usuario.scope('resetPassword').findByPk(cpf);

      if (!usuario) {
        return res.status(400).json({
          erros: ['Usuário não existe.'],
        });
      }

      if(!email || email !== usuario.email){
        return res.status(400).json({
          erros: ['Email incorreto.'],
        });
      }
      // Conferir e validar dados

      // Criar e atualizar token
      const token = crypto.randomBytes(20).toString('hex')

      const tokenExpiration = new Date(); // tempo de expiração do token de 1h
      tokenExpiration.setHours(tokenExpiration.getHours() + 1)

      const usuarioEditado = await usuario.update({ //atualizar token
        password_reset_token: token,
        password_reset_expires: tokenExpiration
      });
      // Criar e atualizar token

      const template = await forgotPasswordTemplate(token); // montar template de email
      const enviado = await sendMail(email, 'Recuperação de senha', template); //enviar email

      if(!enviado){
        return res.status(400).json({
          erros: ['Falha ao enviar email'],
        });
      }

      return res.json('Email enviado com sucesso!')
    } catch (error) {
      console.log(error)
      return res.status(400).json({
        erros: ['Erro, email não enviado!'],
      });
    }
  }

}

export default new TokenController();
