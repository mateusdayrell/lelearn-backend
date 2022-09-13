import jwt from 'jsonwebtoken';
// import Usuario from '../models/Usuario';

export default (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      erros: ['Realize login para prosseguir.'],
    });
  }

  const [, token] = authorization.split(' ');

  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);
    const { cpf, email, tipo } = dados;

    // Verifica se os dados do token sao os mesmos do usuario logado
    // const usuario = Usuario.findOne({
    //   where: { cpf, email, tipo },
    // });

    // if (!usuario) {
    //   return res.status(401).json({
    //     errors: ['Usuário inválido'],
    //   });
    // }

    req.userCpf = cpf;
    req.userEmail = email;
    req.userType = tipo;

    return next();
  } catch (error) {
    return res.status(401).json({
      erros: ['Token expirado ou inválido, faça login para continuar.'],
    });
  }
};
