/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
import PdfPrinter from 'pdfmake';
import sequelize from 'sequelize';
import moment from 'moment/moment';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import Curso from '../models/Curso';
import Video from '../models/Video';
import Treinamento from '../models/Treinamento';
import Usuario from '../models/Usuario';

class RelatorioController {
  async teste(req, res) {
    const videos = await Video.findAll({
      order: [['titulo_video']],
    });
    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };

    const printer = new PdfPrinter(fonts);
    const body = [];

    videos.forEach((vid) => {
      const rows = [];
      rows.push(vid.cod_video);
      rows.push(vid.titulo_video);
      body.push(rows);
    });

    const docDefinitions = {
      defaultStyle: { font: 'Helvetica' },
      content: [
        {
          table: {
            body: [['cod_video', 'titulo_video'], ...body],
          },
        },
      ],
    };

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
  }

  criaPdf(req, res) {
    createPdfBinary((binary) => {
      res.contentType('application/pdf');
      res.send(binary);
    }, (error) => {
      res.send(`ERROR:${error}`);
    });
  }

  async cursos(req, res) {
    try {
      const cursos = await Curso.findAll({
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(cod_video) FROM cursos_videos CV WHERE CV.cod_curso = `Curso`.`cod_curso`)'), 'videos_qtd'],
            [sequelize.literal('(SELECT COUNT(cod_treinamento) FROM treinamentos_cursos TC WHERE TC.cod_curso = `Curso`.`cod_curso`)'), 'treinamentos_qtd'],
            [sequelize.literal('(SELECT COUNT(DISTINCT(cpf)) FROM usuarios_videos UV WHERE UV.cod_curso = `Curso`.`cod_curso`)'), 'alcance_usuarios'],
            [sequelize.literal('(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cod_video IN (SELECT cod_video FROM cursos_videos CV WHERE CV.cod_curso = `Curso`.`cod_curso`))'), 'comentarios_qtd'],
            [sequelize.literal('(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cod_video IN (SELECT cod_video FROM cursos_videos CV WHERE CV.cod_curso = `Curso`.`cod_curso`) AND C.resolvido = 1)'), 'comentarios_resolvidos_qtd'],
          ],
        },
        include: [
          {
            model: Video,
            as: 'videos',
          },
          {
            model: Treinamento,
            as: 'treinamentos',
          },
        ],
      });
      return res.json(cursos);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }

  async treinamentos(req, res) {
    try {
      const treinamentos = await Treinamento.findAll({
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(cpf) FROM treinamentos_usuarios TU WHERE TU.cod_treinamento = `Treinamento`.`cod_treinamento`)'), 'total_usuarios'],
            [sequelize.literal('(SELECT COUNT(cod_curso) FROM treinamentos_cursos TC WHERE TC.cod_treinamento = `Treinamento`.`cod_treinamento`)'), 'total_cursos'],
            [sequelize.literal('(SELECT COUNT(cod_video) FROM cursos_videos CV WHERE CV.cod_curso in (SELECT (cod_curso) FROM treinamentos_cursos TC WHERE TC.cod_treinamento = `Treinamento`.`cod_treinamento`))'), 'total_videos'],
            [sequelize.literal('(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cod_video IN (SELECT cod_video FROM cursos_videos CV WHERE CV.cod_curso in (SELECT cod_curso from treinamentos_cursos TC WHERE TC.cod_treinamento = `Treinamento`.`cod_treinamento`)))'), 'total_comentarios'],
            [sequelize.literal('(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cod_video IN (SELECT cod_video FROM cursos_videos CV WHERE CV.cod_curso in (SELECT cod_curso from treinamentos_cursos TC WHERE TC.cod_treinamento = `Treinamento`.`cod_treinamento`)) AND C.resolvido = 1)'), 'total_comentarios_resolvidos'],
          ],
        },
        include: [
          {
            model: Curso,
            as: 'cursos',
            attributes: {
              include: [
                [sequelize.literal('(SELECT COUNT(cod_video) FROM cursos_videos CV WHERE CV.cod_curso = `cursos`.`cod_curso`)'), 'total_videos'],
              ],
            },
          },
          {
            model: Usuario,
            as: 'usuarios',
            attributes: {
              include: [
                [sequelize.literal('(SELECT COUNT(cpf) FROM usuarios_videos UV WHERE UV.cod_curso in (SELECT (cod_curso) FROM treinamentos_cursos TC WHERE TC.cod_treinamento = `Treinamento`.`cod_treinamento`))'), 'videos_assistidos'],
              ],
            },
            through: {
              attributes: ['prazo', 'testando'],
            },
          },
        ],
      });
      return res.json(treinamentos);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  }

  async usuarioTreinamentos(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(cpf) FROM treinamentos_usuarios TU, treinamentos T WHERE TU.cpf = ${id} AND T.cod_treinamento = TU.cod_treinamento AND T.deleted_at IS NULL)`), 'total_treinamentos'],
            [sequelize.literal(`(SELECT COUNT(cpf) FROM treinamentos_usuarios TU, treinamentos T WHERE TU.cpf = ${id} AND TU.cursos_concluidos = (SELECT COUNT(TC.cod_curso) FROM treinamentos_cursos TC WHERE TC.cod_treinamento = TU.cod_treinamento) AND T.cod_treinamento = TU.cod_treinamento AND T.deleted_at IS NULL)`), 'total_treinamentos_concluidos'],
            [sequelize.literal(`(SELECT COUNT(DISTINCT(UV.cod_curso)) FROM usuarios_videos UV, cursos C WHERE UV.cpf = ${id} AND (SELECT COUNT(UV1.cod_curso) FROM usuarios_videos UV1 WHERE UV1.cod_curso = UV.cod_curso AND UV1.cpf = ${id}) = (SELECT C1.videos_qtd FROM cursos C1 WHERE C1.cod_curso = UV.cod_curso) AND C.cod_curso = UV.cod_curso AND C.deleted_at IS NULL)`), 'total_cursos_concluidos'],
            [sequelize.literal(`(SELECT COUNT(DISTINCT(UV.cod_video)) FROM usuarios_videos UV, videos V WHERE UV.cpf = ${id} AND V.cod_video = UV.cod_video AND V.deleted_at IS NULL)`), 'total_videos_assistidos'],
            [sequelize.literal(`(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cpf = ${id})`), 'total_comentarios'],
            [sequelize.literal(`(SELECT COUNT(cod_comentario) FROM comentarios C WHERE C.cpf = ${id} AND C.resolvido = 1)`), 'total_comentarios_resolvidos'],
          ],
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
                [sequelize.literal(`IF((SELECT cursos_concluidos FROM treinamentos_usuarios TU WHERE TU.cod_treinamento = \`treinamentos\`.\`cod_treinamento\` AND TU.cpf = ${id}) = (SELECT COUNT(cod_curso) FROM treinamentos_cursos TC where TC.cod_treinamento = \`treinamentos\`.\`cod_treinamento\`), true, false)`), 'concluido'],
                [sequelize.literal('(SELECT COUNT(cod_curso) FROM treinamentos_cursos WHERE cod_treinamento = `treinamentos`.`cod_treinamento`)'), 'total_cursos'],
              ],
            },
          },
        ],
      });

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

      obj.treinamentos.forEach((trein) => {
        const rows = [];
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
          { text: `Relatório de treinamentos do usuário - ${moment().format('DD/MM/YYYY HH:mm:ss')} \n\n\n`, style: 'contentHeader' },
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
              widths: [45, 'auto', 130, 'auto', 'auto', 'auto', 65],
              body: [
                [
                  { text: 'Código', style: 'tableHeader' },
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
            fontSize: 14,
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
}

function createPdfBinary(callback) {
  const docDefinitions = {
    defaultStyle: { font: 'Helvetica' },
    content: [
      { text: 'Relatório teste' },
    ],
  };

  const fontDescriptors = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  };

  const printer = new PdfPrinter(fontDescriptors);
  const doc = printer.createPdfKitDocument(docDefinitions);
  const chunks = [];

  doc.on('data', (chunk) => {
    chunks.push(chunk);
  });

  doc.on('end', () => {
    const result = Buffer.concat(chunks);
    callback(`data:application/pdf;base64,${result.toString('base64')}`);
  });

  doc.end();
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

export default new RelatorioController();
