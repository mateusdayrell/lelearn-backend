/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
const PdfPrinter = require('pdfmake');
const sequelize = require('sequelize');
const moment = require('moment/moment');
const { cpf: cpfValidator } = require('cpf-cnpj-validator');

const Curso = require('../models/Curso');
const Video = require('../models/Video');
const Treinamento = require('../models/Treinamento');
const Usuario = require('../models/Usuario');

class RelatorioController {
  async cursos(req, res) {
    try {
      const cursos = await Curso.findAll({
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(CV.cod_video) FROM cursos_videos CV WHERE CV.cod_curso = `Curso`.`cod_curso` AND CV.cod_video = (SELECT V.cod_video FROM videos V WHERE V.cod_video = CV.cod_video AND V.deleted_at IS NULL))'), 'videos_qtd'],
            [sequelize.literal('(SELECT COUNT(TC.cod_treinamento) FROM treinamentos_cursos TC WHERE TC.cod_curso = `Curso`.`cod_curso` AND TC.cod_treinamento = (SELECT T.cod_treinamento FROM treinamentos T WHERE T.cod_treinamento = TC.cod_treinamento AND T.deleted_at IS NULL))'), 'treinamentos_qtd'],
            [sequelize.literal('(SELECT COUNT(DISTINCT(UV.cpf)) FROM usuarios_videos UV WHERE UV.cod_curso = `Curso`.`cod_curso` AND UV.cpf = (SELECT U.cpf FROM usuarios U WHERE U.cpf = UV.cpf AND U.deleted_at IS NULL) AND UV.cod_video = (SELECT V.cod_video FROM videos V WHERE V.cod_video = UV.cod_video AND V.deleted_at IS NULL))'), 'alcance_usuarios'],
            [sequelize.literal('(SELECT COUNT(UV.cod_curso) FROM usuarios_videos UV WHERE UV.cod_curso = `Curso`.`cod_curso` AND UV.cpf = (SELECT U.cpf FROM usuarios U WHERE U.cpf = UV.cpf AND U.deleted_at IS NULL) AND UV.cod_video = (SELECT V.cod_video FROM videos V WHERE V.cod_video = UV.cod_video AND V.deleted_at IS NULL))'), 'visualizacoes'],
            [sequelize.literal('(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cod_video IN (SELECT CV.cod_video FROM cursos_videos CV WHERE CV.cod_curso = `Curso`.`cod_curso` AND CV.cod_video = (SELECT V.cod_video FROM videos V WHERE V.cod_video = CV.cod_video AND V.deleted_at IS NULL)) AND C.cpf = (SELECT U.cpf FROM usuarios U WHERE U.cpf = C.cpf AND U.deleted_at IS NULL))'), 'comentarios_qtd'],
            [sequelize.literal('(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cod_video IN (SELECT CV.cod_video FROM cursos_videos CV WHERE CV.cod_curso = `Curso`.`cod_curso` AND CV.cod_video = (SELECT V.cod_video FROM videos V WHERE V.cod_video = CV.cod_video AND V.deleted_at IS NULL)) AND C.cpf = (SELECT U.cpf FROM usuarios U WHERE U.cpf = C.cpf AND U.deleted_at IS NULL) AND C.resolvido = 1)'), 'comentarios_resolvidos_qtd'],
          ],
        },
        order: ['nome_curso'],
      });

      const json = JSON.stringify(cursos);
      const obj = JSON.parse(json);

      const body = [];

      obj.forEach((curso, i) => {
        const rows = [];
        rows.push(i);
        rows.push(curso.cod_curso);
        rows.push(curso.nome_curso);
        rows.push(curso.videos_qtd);
        rows.push(curso.treinamentos_qtd);
        rows.push(curso.alcance_usuarios);
        rows.push(curso.visualizacoes);
        rows.push(curso.comentarios_qtd);
        rows.push(curso.comentarios_resolvidos_qtd);
        body.push(rows);
      });

      const docDefinitions = {
        defaultStyle: { font: 'Helvetica' },
        footer(currentPage, pageCount) { return { text: `Página ${currentPage.toString()} de ${pageCount}`, style: 'footer' }; },
        header(currentPage) {
          if (currentPage === 1) {
            return [
              { text: 'LeLearn', alignment: 'left', style: 'header' },
            ];
          }
          return [];
        },
        content: [
          { text: `Relatório de cursos - ${moment().format('DD/MM/YYYY')} \n\n\n`, style: 'contentHeader' },
          {
            style: 'table',
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Nº', style: 'tableHeader' },
                  { text: 'Cod', style: 'tableHeader' },
                  { text: 'Nome', style: 'tableHeader' },
                  { text: 'Vídeos', style: 'tableHeader' },
                  { text: 'Treinamentos', style: 'tableHeader' },
                  { text: 'Usuários alcançados', style: 'tableHeader' },
                  { text: 'Visualizações', style: 'tableHeader' },
                  { text: 'Comentários', style: 'tableHeader' },
                  { text: 'Comentários resolvidos', style: 'tableHeader' },
                ],
                ...body,
              ],
            },
          },
        ],
        styles: {
          table: {
            fontSize: 10,
          },
          header: {
            color: '#00B37E',
            characterSpacing: 0.5,
            margin: [260, 10, 0, 0],
            bold: true,
          },
          footer: {
            margin: [20, 20, 0, 10],
          },
          contentHeader: {
            fontSize: 16,
            bold: true,
            alignment: 'center',
          },
          tableHeader: {
            fontSize: 10,
            bold: true,
            alignment: 'center',
          },
          center: {
            alignment: 'center',
          },
        },
      };

      // eslint-disable-next-line no-use-before-define
      pdf(docDefinitions, res);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }

  async treinamento(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['Código do treinamento não enviado.'],
        });
      }

      const usuarios = await Usuario.findAll({ attributes: ['cpf'], raw: true });
      const cpfs = usuarios.map((u) => `'${u.cpf}'`);

      const videos = await Video.findAll({ attributes: ['cod_video'], raw: true });
      const codVideos = videos.map((v) => `'${v.cod_video}'`);

      const cursos = await Curso.findAll({ attributes: ['cod_curso'], raw: true });
      const codCursos = cursos.map((c) => `'${c.cod_curso}'`);

      const treinamento = await Treinamento.findByPk(id, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(TU.cpf) FROM treinamentos_usuarios TU WHERE TU.cod_treinamento = '${id}' AND TU.cpf = (SELECT U.cpf FROM usuarios U WHERE U.cpf = TU.cpf AND U.deleted_at IS NULL))`), 'total_usuarios'],
            [sequelize.literal(`(SELECT COUNT(TC.cod_curso) FROM treinamentos_cursos TC WHERE TC.cod_treinamento = '${id}' AND TC.cod_curso = (SELECT C.cod_curso FROM cursos C WHERE C.cod_curso = TC.cod_curso AND C.deleted_at IS NULL))`), 'total_cursos'],
            [sequelize.literal(`(SELECT COUNT(CV.cod_video) FROM cursos_videos CV WHERE CV.cod_curso in (SELECT (TC.cod_curso) FROM treinamentos_cursos TC WHERE TC.cod_treinamento = '${id}' AND TC.cod_curso = (SELECT C.cod_curso FROM cursos C WHERE C.cod_curso = TC.cod_curso AND C.deleted_at IS NULL)) AND CV.cod_video = (SELECT V.cod_video FROM videos V WHERE V.cod_video = CV.cod_video AND V.deleted_at IS NULL))`), 'total_videos'],
            [sequelize.literal(`(SELECT COUNT(C.cod_comentario) FROM comentarios C WHERE C.cpf = (SELECT U.cpf FROM usuarios U WHERE U.cpf = C.cpf AND U.deleted_at IS NULL) AND C.cod_video IN (SELECT CV.cod_video FROM cursos_videos CV WHERE CV.cod_video = (SELECT V.cod_video FROM videos V where V.cod_video = CV.cod_video AND V.deleted_at IS NULL) AND CV.cod_curso in (SELECT TC.cod_curso from treinamentos_cursos TC WHERE TC.cod_treinamento = '${id}' AND TC.cod_curso = (SELECT CUR.cod_curso FROM cursos CUR WHERE CUR.cod_curso = TC.cod_curso AND CUR.deleted_at IS NULL))))`), 'total_comentarios'],
            [sequelize.literal(`(SELECT COUNT(C.cod_comentario) FROM comentarios C WHERE C.cpf = (SELECT U.cpf FROM usuarios U WHERE U.cpf = C.cpf AND U.deleted_at IS NULL) AND C.cod_video IN (SELECT CV.cod_video FROM cursos_videos CV WHERE CV.cod_video = (SELECT V.cod_video FROM videos V where V.cod_video = CV.cod_video AND V.deleted_at IS NULL) AND CV.cod_curso in (SELECT TC.cod_curso from treinamentos_cursos TC WHERE TC.cod_treinamento = '${id}' AND TC.cod_curso = (SELECT CUR.cod_curso FROM cursos CUR WHERE CUR.cod_curso = TC.cod_curso AND CUR.deleted_at IS NULL))) AND C.resolvido = 1)`), 'total_comentarios_resolvidos'],
          ],
        },
        include: [
          {
            model: Usuario,
            as: 'usuarios',
            attributes: {
              include: [
                [sequelize.literal(`IF((SELECT cursos_concluidos FROM treinamentos_usuarios TU WHERE TU.cpf = \`usuarios\`.\`cpf\` AND TU.cpf IN (${cpfs}) AND TU.cod_treinamento = '${id}') = (SELECT COUNT(cod_curso) FROM treinamentos_cursos TC where TC.cod_treinamento = '${id}' AND TC.cod_curso IN (${codCursos})), true, false)`), 'concluido'],
                [sequelize.literal(`(SELECT COUNT(cpf) FROM usuarios_videos UV WHERE UV.cpf = \`usuarios\`.\`cpf\` AND UV.cpf IN (${cpfs}) AND UV.cod_video IN (${codVideos}) AND UV.cod_curso IN (${codCursos}) AND UV.cod_curso in (SELECT (cod_curso) FROM treinamentos_cursos TC WHERE TC.cod_treinamento = '${id}') AND UV.cod_curso IN (${codCursos}))`), 'videos_assistidos'],
                [sequelize.literal(`(SELECT COUNT(cpf) FROM comentarios C WHERE C.cpf = \`usuarios\`.\`cpf\` AND C.cpf IN (${cpfs}) AND C.cod_video IN (SELECT CV.cod_video FROM cursos_videos CV WHERE CV.cod_video IN (${codVideos}) AND CV.cod_curso IN (${codCursos}) AND CV.cod_curso IN (SELECT TC.cod_curso FROM treinamentos_cursos TC WHERE TC.cod_treinamento = '${id}' AND TC.cod_curso IN (${codCursos}))))`), 'total_comentarios'],
                // eslint-disable-next-line max-len
                // [sequelize.literal(`(SELECT COUNT(cpf) FROM comentarios C WHERE C.resolvido = 1 AND C.cpf = \`usuarios\`.\`cpf\` AND C.cod_video IN (SELECT CV.cod_video FROM cursos_videos CV WHERE CV.cod_curso IN (SELECT TC.cod_curso FROM treinamentos_cursos TC WHERE TC.cod_curso = ${id})))`), 'total_comentarios_resolvidos'],
              ],
              exclude: ['senha', 'password_reset_token', 'password_reset_expires'],
            },
            through: {
              attributes: ['prazo', 'cursos_concluidos'],
            },
          },
        ],
        order: [['usuarios', 'nome']],
      });

      if (!treinamento) {
        return res.status(400).json({
          erros: ['Treinamento não existe.'],
        });
      }

      const json = JSON.stringify(treinamento);
      const obj = JSON.parse(json);

      const body = [];
      const bodyTreinamento = [[
        { text: obj.total_usuarios, style: 'center' },
        { text: obj.total_cursos, style: 'center' },
        { text: obj.total_videos, style: 'center' },
        { text: obj.total_comentarios, style: 'center' },
        { text: obj.total_comentarios_resolvidos, style: 'center' },
      ]];

      obj.usuarios.forEach((user, i) => {
        const rows = [];
        rows.push(i);
        rows.push(user.cpf);
        rows.push(user.nome);
        rows.push(user.treinamentos_usuarios.prazo
          ? moment(user.treinamentos_usuarios.prazo).format('DD/MM/YYYY')
          : 'Sem prazo');
        rows.push(user.concluido ? 'Sim' : 'Não');
        rows.push(user.treinamentos_usuarios.cursos_concluidos);
        rows.push(user.videos_assistidos);
        rows.push(user.total_comentarios);
        body.push(rows);
      });

      const docDefinitions = {
        defaultStyle: { font: 'Helvetica' },
        footer(currentPage, pageCount) { return { text: `Página ${currentPage.toString()} de ${pageCount}`, style: 'footer' }; },
        header(currentPage) {
          if (currentPage === 1) {
            return [
              { text: 'LeLearn', alignment: 'left', style: 'header' },
            ];
          }
          return [];
        },
        content: [
          { text: `Relatório de treinamento - ${moment().format('DD/MM/YYYY')} \n\n\n`, style: 'contentHeader' },
          { text: 'Dados do treinamento:\n\n', style: 'title' },
          {
            columns: [
              { text: `Código: ${treinamento.cod_treinamento}` },
              { text: `Nome: ${treinamento.nome_treinamento}` },
              { text: `Criado em: ${moment(treinamento.created_at).format('DD/MM/YYYY')}\n\n` },
            ],
          },
          {
            text: `Descrição: ${treinamento.desc_treinamento}\n\n\n`,
          },
          { text: 'Estatísticas gerais do treinamento:\n\n', style: 'title' },
          {
            table: {
              widths: [95, 95, 95, 95, 95],
              body: [
                [
                  { text: 'Usuários', style: 'tableHeader' },
                  { text: 'Cursos', style: 'tableHeader' },
                  { text: 'Vídeos', style: 'tableHeader' },
                  { text: 'Comentários', style: 'tableHeader' },
                  { text: 'Comentários resolvidos', style: 'tableHeader' },
                ],
                ...bodyTreinamento,
              ],
            },
          },
          { text: '\n\n\n' },
          { text: 'Usuários:\n\n', style: 'title' },
          {
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Nº', style: 'tableHeader' },
                  { text: 'CPF', style: 'tableHeader' },
                  { text: 'Nome', style: 'tableHeader' },
                  { text: 'Prazo', style: 'tableHeader' },
                  { text: 'Concluído', style: 'tableHeader' },
                  { text: 'Cursos concluídos', style: 'tableHeader' },
                  { text: 'Vídeos assistidos', style: 'tableHeader' },
                  { text: 'Comentários', style: 'tableHeader' },
                ],
                ...body,
              ],
            },
          },
        ],
        styles: {
          header: {
            color: '#00B37E',
            characterSpacing: 0.5,
            margin: [260, 10, 0, 0],
            bold: true,
          },
          footer: {
            margin: [20, 20, 0, 10],
          },
          contentHeader: {
            fontSize: 16,
            bold: true,
            alignment: 'center',
          },
          title: {
            fontSize: 12,
            bold: true,
          },
          tableHeader: {
            fontSize: 11,
            bold: true,
            alignment: 'center',
          },
          center: {
            alignment: 'center',
          },
        },
      };

      // eslint-disable-next-line no-use-before-define
      pdf(docDefinitions, res);

      // return res.json(treinamento);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }

  async usuarioTreinamentos(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['CPF não enviado.'],
        });
      }

      const videos = await Video.findAll({ attributes: ['cod_video'], raw: true });
      const codVideos = videos.map((v) => `'${v.cod_video}'`);

      const cursos = await Curso.findAll({ attributes: ['cod_curso'], raw: true });
      const codCursos = cursos.map((c) => `'${c.cod_curso}'`);

      const treinamentos = await Treinamento.findAll({ attributes: ['cod_treinamento'], raw: true });
      const codTreinamentos = treinamentos.map((t) => `'${t.cod_treinamento}'`);

      const usuario = await Usuario.findByPk(id, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(cpf) FROM treinamentos_usuarios TU, treinamentos T WHERE TU.cpf = '${id}' AND T.cod_treinamento = TU.cod_treinamento AND T.deleted_at IS NULL)`), 'total_treinamentos'],
            [sequelize.literal(`(SELECT COUNT(cpf) FROM treinamentos_usuarios TU, treinamentos T WHERE TU.cpf = '${id}' AND TU.cursos_concluidos = (SELECT COUNT(TC.cod_curso) FROM treinamentos_cursos TC WHERE TC.cod_treinamento = TU.cod_treinamento AND TC.cod_curso IN (${codCursos}) ) AND T.cod_treinamento = TU.cod_treinamento AND T.deleted_at IS NULL)`), 'total_treinamentos_concluidos'],
            [sequelize.literal(`(SELECT COUNT(DISTINCT(UV.cod_curso)) FROM usuarios_videos UV, cursos C WHERE UV.cpf = '${id}' AND UV.cod_curso IN (${codVideos}) AND UV.cod_video IN (${codVideos}) AND (SELECT COUNT(UV1.cod_curso) FROM usuarios_videos UV1 WHERE UV1.cod_curso = UV.cod_curso AND UV1.cpf = '${id}' AND UV1.cod_curso IN (${codCursos}) AND UV1.cod_video IN (${codVideos})) = (SELECT C1.videos_qtd FROM cursos C1 WHERE C1.cod_curso = UV.cod_curso) AND C.cod_curso = UV.cod_curso AND C.deleted_at IS NULL)`), 'total_cursos_concluidos'],
            [sequelize.literal(`(SELECT COUNT(UV.cod_video) FROM usuarios_videos UV, videos V WHERE UV.cpf = '${id}' AND V.cod_video = UV.cod_video AND V.deleted_at IS NULL)`), 'total_videos_assistidos'],
            [sequelize.literal(`(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cpf = '${id}' AND C.cod_video IN (${codVideos}))`), 'total_comentarios'],
            [sequelize.literal(`(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cpf = '${id}' AND C.cod_video IN (${codVideos}) AND C.resolvido = 1)`), 'total_comentarios_resolvidos'],
          ],
          exclude: ['senha', 'password_reset_token', 'password_reset_expires'],
        },
        include: [
          {
            model: Treinamento,
            as: 'treinamentos',
            through: {
              attributes: ['prazo', 'cursos_concluidos'],
            },
            attributes: {
              include: [
                [sequelize.literal(`IF((SELECT cursos_concluidos FROM treinamentos_usuarios TU WHERE TU.cod_treinamento = \`treinamentos\`.\`cod_treinamento\` AND TU.cpf = '${id}' AND TU.cod_treinamento IN (${codTreinamentos})) = (SELECT COUNT(cod_curso) FROM treinamentos_cursos TC where TC.cod_treinamento = \`treinamentos\`.\`cod_treinamento\` AND TC.cod_treinamento IN (${codTreinamentos} AND TC.cod_curso IN (${codCursos}))), true, false)`), 'concluido'],
                [sequelize.literal(`(SELECT COUNT(TC.cod_curso) FROM treinamentos_cursos TC WHERE TC.cod_treinamento = \`treinamentos\`.\`cod_treinamento\` AND TC.cod_treinamento IN (${codTreinamentos}) AND TC.cod_curso IN (${codCursos}))`), 'total_cursos'],
              ],
            },
          },
        ],
        order: [['treinamentos', 'nome_treinamento']],
      });

      if (!usuario) {
        return res.status(400).json({
          erros: ['Usuário não existe.'],
        });
      }

      const json = JSON.stringify(usuario);
      const obj = JSON.parse(json);

      const body = [];
      const bodyUsuario = [[
        { text: obj.total_treinamentos, style: 'center' },
        { text: obj.total_treinamentos_concluidos, style: 'center' },
        { text: obj.total_cursos_concluidos, style: 'center' },
        { text: obj.total_videos_assistidos, style: 'center' },
        { text: obj.total_comentarios, style: 'center' },
        { text: obj.total_comentarios_resolvidos, style: 'center' },
      ]];

      obj.treinamentos.forEach((trein, i) => {
        const rows = [];
        rows.push(i);
        rows.push(trein.cod_treinamento);
        rows.push(trein.nome_treinamento);
        rows.push(trein.desc_treinamento);
        rows.push(trein.concluido ? 'Sim' : 'Não');
        rows.push(trein.treinamentos_usuarios.prazo
          ? moment(trein.treinamentos_usuarios.prazo).format('DD/MM/YYYY')
          : 'Sem prazo');
        rows.push(trein.total_cursos);
        rows.push(trein.treinamentos_usuarios.cursos_concluidos);
        body.push(rows);
      });

      const docDefinitions = {
        defaultStyle: { font: 'Helvetica' },
        footer(currentPage, pageCount) { return { text: `Página ${currentPage.toString()} de ${pageCount}`, style: 'footer' }; },
        header(currentPage) {
          if (currentPage === 1) {
            return [
              { text: 'LeLearn', alignment: 'left', style: 'header' },
            ];
          }
          return [];
        },
        content: [
          { text: `Relatório de treinamentos do usuário - ${moment().format('DD/MM/YYYY')} \n\n\n`, style: 'contentHeader' },
          { text: 'Dados do usuário:\n\n', style: 'title' },
          {
            columns: [
              { text: `CPF: ${cpfValidator.format(usuario.cpf)}` },
              { text: `Nome: ${usuario.nome}\n\n` },
            ],
          },
          {
            columns: [
              { text: `Criado em: ${moment(usuario.created_at).format('DD/MM/YYYY')}` },
              { text: `Tipo: ${usuario.tipo === 0 ? 'Administrador' : 'Usuário comum'}\n\n` },
            ],
          },
          {
            columns: [
              { text: `Telefone: ${usuario.telefone}` },
              { text: `Email: ${usuario.email} \n\n\n` },
            ],
          },
          { text: 'Estatísticas gerais do usuário:\n\n', style: 'title' },
          {
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Treinamentos', style: 'tableHeader' },
                  { text: 'Treinamentos concluídos', style: 'tableHeader' },
                  { text: 'Cursos concluídos', style: 'tableHeader' },
                  { text: 'Vídeos assistidos', style: 'tableHeader' },
                  { text: 'Comentários', style: 'tableHeader' },
                  { text: 'Comentários resolvidos', style: 'tableHeader' },
                ],
                ...bodyUsuario,
              ],
            },
          },
          { text: '\n\n\n' },
          { text: 'Treinamentos:\n\n', style: 'title' },
          {
            table: {
              widths: ['auto', 27, 'auto', 120, 'auto', 'auto', 'auto', 64],
              body: [
                [
                  { text: 'Nº', style: 'tableHeader' },
                  { text: 'Cod.', style: 'tableHeader' },
                  { text: 'Nome', style: 'tableHeader' },
                  { text: 'Descrição', style: 'tableHeader' },
                  { text: 'Concluído', style: 'tableHeader' },
                  { text: 'Prazo', style: 'tableHeader' },
                  { text: 'Cursos', style: 'tableHeader' },
                  { text: 'Cursos concluídos', style: 'tableHeader' },
                ],
                ...body,
              ],
            },
          },
        ],
        styles: {
          header: {
            color: '#00B37E',
            characterSpacing: 0.5,
            margin: [260, 10, 0, 0],
            bold: true,
          },
          footer: {
            margin: [20, 20, 0, 10],
          },
          contentHeader: {
            fontSize: 16,
            bold: true,
            alignment: 'center',
          },
          title: {
            fontSize: 12,
            bold: true,
          },
          tableHeader: {
            fontSize: 12,
            bold: true,
            alignment: 'center',
          },
          center: {
            alignment: 'center',
          },
        },
      };

      // eslint-disable-next-line no-use-before-define
      pdf(docDefinitions, res);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }

  async usuarioCursos(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          erros: ['CPF não enviado.'],
        });
      }

      const videos = await Video.findAll({ attributes: ['cod_video'], raw: true });
      const codVideos = videos.map((v) => `'${v.cod_video}'`);

      const cursos = await Curso.findAll({ attributes: ['cod_curso'], raw: true });
      const codCursos = cursos.map((c) => `'${c.cod_curso}'`);

      const usuario = await Usuario.findByPk(id, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(DISTINCT(cod_curso)) FROM usuarios_videos UV WHERE UV.cpf = '${id}' AND cod_curso IN (${codCursos}) )`), 'cursos_iniciados'],
            [sequelize.literal(`(SELECT COUNT(DISTINCT(cod_curso)) FROM usuarios_videos UV WHERE UV.cpf = '${id}' AND UV.cod_curso IN (${codCursos}) AND (SELECT COUNT(UV1.cod_video) FROM usuarios_videos UV1 WHERE UV1.cpf = '${id}' AND UV1.cod_curso = UV.cod_curso AND UV1.cod_video IN (${codVideos})) = (SELECT COUNT(CV.cod_video) FROM cursos_videos CV WHERE CV.cod_curso = UV.cod_curso AND CV.cod_video IN (${codVideos})))`), 'cursos_concluidos'],
            [sequelize.literal(`(SELECT COUNT(cod_video) FROM usuarios_videos UV WHERE UV.cpf = '${id}' AND cod_video IN (${codVideos}))`), 'videos_assistidos'],
            [sequelize.literal(`(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cpf = '${id}' AND C.cod_video IN (${codVideos}))`), 'comentarios'],
          ],
          exclude: ['senha', 'password_reset_token', 'password_reset_expires'],
        },
        include: [
          {
            model: Curso,
            as: 'cursos',
            attributes: {
              include: [
                [sequelize.literal(`IF((SELECT COUNT(cod_video) FROM usuarios_videos UV WHERE UV.cpf = '${id}' AND UV.cod_curso = \`cursos\`.\`cod_curso\` AND UV.cod_video IN (${codVideos}) AND UV.cod_curso IN (${codCursos})) = (SELECT COUNT(cod_video) FROM cursos_videos CV where CV.cod_curso = \`cursos\`.\`cod_curso\` AND CV.cod_video IN (${codVideos}) AND CV.cod_curso IN (${codCursos})), true, false)`), 'concluido'],
                [sequelize.literal(`(SELECT COUNT(cod_video) FROM cursos_videos WHERE cod_curso = \`cursos\`.\`cod_curso\` AND cod_video IN (${codVideos}) AND cod_curso IN (${codCursos}))`), 'total_videos'],
                [sequelize.literal(`(SELECT COUNT(cod_video) FROM usuarios_videos WHERE cod_curso = \`cursos\`.\`cod_curso\` AND cpf = '${id}' AND cod_video IN (${codVideos}) AND cod_curso IN (${codCursos}))`), 'total_videos_assistidos'],
                [sequelize.literal(`(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cod_video IN (SELECT CV.cod_video FROM cursos_videos CV WHERE CV.cod_curso = \`cursos\`.\`cod_curso\` AND CV.cod_video IN (${codVideos}) AND CV.cod_curso IN (${codCursos})) AND C.cpf = '${id}')`), 'comentarios'],
              ],
            },
          },
        ],
        order: [['cursos', 'nome_curso']],
      });

      if (!usuario) {
        return res.status(400).json({
          erros: ['Usuário não existe.'],
        });
      }

      const json = JSON.stringify(usuario);
      const obj = JSON.parse(json);

      const body = [];
      const bodyUsuario = [[
        { text: obj.cursos_iniciados, style: 'center' },
        { text: obj.cursos_concluidos, style: 'center' },
        { text: obj.videos_assistidos, style: 'center' },
        { text: obj.comentarios, style: 'center' },
      ]];

      obj.cursos.forEach((curso, i) => {
        const rows = [];
        rows.push(i);
        rows.push(curso.cod_curso);
        rows.push(curso.nome_curso);
        rows.push(curso.desc_curso);
        rows.push(curso.concluido ? 'Sim' : 'Não');
        rows.push(curso.total_videos);
        rows.push(curso.total_videos_assistidos);
        rows.push(curso.comentarios);
        body.push(rows);
      });

      const docDefinitions = {
        defaultStyle: { font: 'Helvetica' },
        footer(currentPage, pageCount) { return { text: `Página ${currentPage.toString()} de ${pageCount}`, style: 'footer' }; },
        header(currentPage) {
          if (currentPage === 1) {
            return [
              { text: 'LeLearn', alignment: 'left', style: 'header' },
            ];
          }
          return [];
        },
        content: [
          { text: `Relatório de cursos do usuário - ${moment().format('DD/MM/YYYY')} \n\n\n`, style: 'contentHeader' },
          { text: 'Dados do usuário:\n\n', style: 'title' },
          {
            columns: [
              { text: `CPF: ${cpfValidator.format(usuario.cpf)}` },
              { text: `Nome: ${usuario.nome}\n\n` },
            ],
          },
          {
            columns: [
              { text: `Criado em: ${moment(usuario.created_at).format('DD/MM/YYYY')}` },
              { text: `Tipo: ${usuario.tipo === 0 ? 'Administrador' : 'Usuário comum'}\n\n` },
            ],
          },
          {
            columns: [
              { text: `Telefone: ${usuario.telefone}` },
              { text: `Email: ${usuario.email} \n\n\n` },
            ],
          },
          { text: 'Estatísticas gerais do usuário:\n\n', style: 'title' },
          {
            table: {
              widths: [120, 120, 120, 120],
              body: [
                [
                  { text: 'Cursos iniciados', style: 'tableHeader' },
                  { text: 'Cursos concluídos', style: 'tableHeader' },
                  { text: 'Vídeos assistidos', style: 'tableHeader' },
                  { text: 'Comentários', style: 'tableHeader' },
                ],
                ...bodyUsuario,
              ],
            },
          },
          { text: '\n\n\n' },
          { text: 'Cursos:\n\n', style: 'title' },
          {
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Nº', style: 'tableHeader' },
                  { text: 'Cod.', style: 'tableHeader' },
                  { text: 'Nome', style: 'tableHeader' },
                  { text: 'Descrição', style: 'tableHeader' },
                  { text: 'Concluído', style: 'tableHeader' },
                  { text: 'Vídeos', style: 'tableHeader' },
                  { text: 'Vídeos assistidos', style: 'tableHeader' },
                  { text: 'Comentarios', style: 'tableHeader' },
                ],
                ...body,
              ],
            },
          },
        ],
        styles: {
          header: {
            color: '#00B37E',
            characterSpacing: 0.5,
            margin: [260, 10, 0, 0],
            bold: true,
          },
          footer: {
            margin: [20, 20, 0, 10],
          },
          contentHeader: {
            fontSize: 16,
            bold: true,
            alignment: 'center',
          },
          title: {
            fontSize: 12,
            bold: true,
          },
          tableHeader: {
            fontSize: 12,
            bold: true,
            alignment: 'center',
          },
          center: {
            alignment: 'center',
          },
        },
      };

      // eslint-disable-next-line no-use-before-define
      pdf(docDefinitions, res);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }

  async videos(req, res) {
    try {
      const usuarios = await Usuario.findAll({ attributes: ['cpf'], raw: true });
      const cpfs = usuarios.map((u) => `'${u.cpf}'`);

      const cursos = await Curso.findAll({ attributes: ['cod_curso'], raw: true });
      const codCursos = cursos.map((c) => `'${c.cod_curso}'`);

      const treinamentos = await Treinamento.findAll({ attributes: ['cod_treinamento'], raw: true });
      const codTreinamentos = treinamentos.map((t) => `'${t.cod_treinamento}'`);

      const videos = await Video.findAll({
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(DISTINCT(cod_curso)) FROM cursos_videos CV WHERE CV.cod_video = \`Video\`.\`cod_video\` AND cod_curso IN (${codCursos}))`), 'cursos_qtd'],
            [sequelize.literal(`(SELECT COUNT(DISTINCT(cod_treinamento)) FROM treinamentos_cursos TC WHERE TC.cod_treinamento IN (${codTreinamentos}) AND TC.cod_curso IN (SELECT CV.cod_curso FROM cursos_videos CV WHERE CV.cod_video = \`Video\`.\`cod_video\` AND CV.cod_curso IN (${codCursos})))`), 'treinamentos_qtd'],
            [sequelize.literal(`(SELECT COUNT(DISTINCT(cpf)) FROM usuarios_videos UV WHERE UV.cod_video = \`Video\`.\`cod_video\` AND UV.cpf IN (${cpfs}) AND UV.cod_curso IN (${codCursos}))`), 'alcance_usuarios'],
            [sequelize.literal(`(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cod_video = \`Video\`.\`cod_video\` AND C.cpf IN (${cpfs}))`), 'comentarios_qtd'],
            [sequelize.literal(`(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cod_video = \`Video\`.\`cod_video\` AND C.cpf IN (${cpfs}) AND C.resolvido = 1)`), 'comentarios_resolvidos_qtd'],
          ],
        },
        order: ['titulo_video'],
      });

      const json = JSON.stringify(videos);
      const obj = JSON.parse(json);

      const body = [];

      obj.forEach((curso, i) => {
        const rows = [];
        rows.push(i);
        rows.push(curso.cod_video);
        rows.push(curso.titulo_video);
        rows.push(curso.cursos_qtd);
        rows.push(curso.treinamentos_qtd);
        rows.push(curso.alcance_usuarios);
        rows.push(curso.comentarios_qtd);
        rows.push(curso.comentarios_resolvidos_qtd);
        body.push(rows);
      });

      const docDefinitions = {
        defaultStyle: { font: 'Helvetica' },
        footer(currentPage, pageCount) { return { text: `Página ${currentPage.toString()} de ${pageCount}`, style: 'footer' }; },
        header(currentPage) {
          if (currentPage === 1) {
            return [
              { text: 'LeLearn', alignment: 'left', style: 'header' },
            ];
          }
          return [];
        },
        content: [
          { text: `Relatório de vídeos - ${moment().format('DD/MM/YYYY')} \n\n\n`, style: 'contentHeader' },
          {
            style: 'table',
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Nº', style: 'tableHeader' },
                  { text: 'Cod', style: 'tableHeader' },
                  { text: 'Nome', style: 'tableHeader' },
                  { text: 'Cursos', style: 'tableHeader' },
                  { text: 'Treinamentos', style: 'tableHeader' },
                  { text: 'Usuários', style: 'tableHeader' },
                  { text: 'Comentários', style: 'tableHeader' },
                  { text: 'Comentários resolvidos', style: 'tableHeader' },
                ],
                ...body,
              ],
            },
          },
        ],
        styles: {
          table: {
            fontSize: 10,
            alignment: 'justify',
          },
          header: {
            color: '#00B37E',
            characterSpacing: 0.5,
            margin: [260, 10, 0, 0],
            bold: true,
          },
          footer: {
            margin: [20, 20, 0, 10],
          },
          contentHeader: {
            fontSize: 16,
            bold: true,
            alignment: 'center',
          },
          tableHeader: {
            fontSize: 11,
            bold: true,
            alignment: 'center',
          },
          center: {
            alignment: 'center',
          },
        },
      };

      // eslint-disable-next-line no-use-before-define
      pdf(docDefinitions, res);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }
}

const pdf = (docDefinitions, res) => {
  const fonts = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  };

  const printer = new PdfPrinter(fonts);

  const pdfDoc = printer.createPdfKitDocument(docDefinitions);

  const chunks = [];

  pdfDoc.on('data', (chunk) => {
    chunks.push(chunk);
  });

  pdfDoc.end();

  pdfDoc.on('end', () => {
    const result = Buffer.concat(chunks);
    return res.end(result);
  });
};

module.exports = new RelatorioController();
