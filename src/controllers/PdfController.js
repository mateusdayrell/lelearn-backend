import PdfPrinter from 'pdfmake';
import Video from '../models/Video';

class PdfController {
  async treinamentosUsuarios(req, res) {
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

    for await (const vid of videos) {
      const rows = [];
      rows.push(vid.cod_video);
      rows.push(vid.titulo_video);
      body.push(rows);
    }

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

  teste(req, res) {
    // eslint-disable-next-line no-use-before-define
    createPdfBinary((binary) => {
      console.log('foi');
      res.contentType('application/pdf');
      res.send(binary);
    }, (error) => {
      res.send(`ERROR:${error}`);
    });
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

export default new PdfController();
