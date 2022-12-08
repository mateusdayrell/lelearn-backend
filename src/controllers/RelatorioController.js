import PdfPrinter from 'pdfmake';
import sequelize from 'sequelize';
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
    // eslint-disable-next-line no-use-before-define
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

export default new RelatorioController();
