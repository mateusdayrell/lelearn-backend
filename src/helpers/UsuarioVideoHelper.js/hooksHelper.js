/* eslint-disable no-useless-concat */
/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-import-module-exports
const sequelize = require('sequelize');
const TreinamentoUsuario = require('../../models/TreinamentoUsuario');
const Curso = require('../../models/Curso');

require('dotenv').config();

const handleHook = async (type, obj, qtd) => {
  try {
    const { cod_curso, cpf } = obj;

    const curso = await Curso.findByPk(cod_curso);

    if (curso.videos_qtd === (qtd)) {
      const treinUsuario = await TreinamentoUsuario.findAll({
        where: (sequelize.literal('`TreinamentoUsuario`.`cpf`' + ` = ${cpf} AND ` + '`TreinamentoUsuario`.`cod_treinamento`' + ` IN (SELECT cod_treinamento FROM treinamentos_cursos TC WHERE TC.cod_curso = ${cod_curso})`)),
      });

      treinUsuario.forEach(async (item) => {
        await TreinamentoUsuario.update(
          (type === 'save'
            ? { cursos_concluidos: item.cursos_concluidos + 1 }
            : { cursos_concluidos: item.cursos_concluidos - 1 }),
          { where: { cod_treinamento: item.cod_treinamento, cpf: item.cpf } },
        );
      });
    }
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      erros: ['Erro ao executar hook.'],
    });
  }
};

module.exports = handleHook;
