import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Usuario from '../models/Usuario';
// import transporter from '../helpers/EmailHelper/Transporter'

import nodemailer from "nodemailer"
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

      if(!email || usuario.email !== email){
        return res.status(400).json({
          erros: ['Email incorreto.'],
        });
      }

      const token = crypto.randomBytes(20).toString('hex')

      const tokenExpiration = new Date();
      tokenExpiration.setHours(tokenExpiration.getHours() + 1)

      const usuarioEditado = await usuario.update({
        password_reset_token: token,
        password_reset_expires: tokenExpiration
      });

      let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        secure: false, // process.env.SECURE_EMAIL === 'true' ? true : false, // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false, // process.env.TLS_EMAIL === 'true' ? true : false,
        },
      })

      let { accepted } = await transporter.sendMail({
        from: "LeLern " + process.env.MAIL_USERNAME,
        to: 'mateusdayrell7@gmail.com',
        subject: "Hello ✔", // Subject line
        text: "Hello world ✔", // plaintext body
        html: "<b>Hello world ✔</b>" // html body
      });

      if (accepted.length > 0) return res.status(200).send({sucess: 'AEEEE'})
      else return res.status(400).send({error: 'ERROU'})

      // transporter.sendMail({
      //   from: "LeLern " + process.env.MAIL_USERNAME,
      //   to: 'mateusdayrell7@gmail.com',
      //   subject: "Hello ✔", // Subject line
      //   text: "Hello world ✔", // plaintext body
      //   html: "<b>Hello world ✔</b>" // html body
      // }, err => {
      //   console.log(err)
      //   if (err) return res.status(400).send({error: 'ERROU'})

      //   return res.status(200).send({sucess: 'AEEEE'})
      // })
    } catch (error) {
      console.log(error)
      return false
    }
  }

}

export default new TokenController();
