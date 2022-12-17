module.exports = {
  async comentarioTemplate(data) {
    try {
      const mailBody = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.cdnfonts.com/css/montserrat" rel="stylesheet">
          <title>Novo comentário no Lelearn</title>
        </head>
        <body style='background-color: #1f1f23; font-family: "Montserrat", sans-serif;'>
          <div style='background-color: #1f1f23; color: #00B37E;  display: flex; justify-content: center;'>
              <h2 style='padding-left: 10px;'> Novo comentário no Lelearn</h2>
          </div>
          <div style='background-color: #28282c; width: 100%; color: #FFFFFF; text-align: center; margin: 0 10px;'>
              <p style='padding-top: 5px;'>
                <label>Um administrador respondeu ao seu comentário ou ao comentário que você participou no vídeo ${data.titulo}</label>
              </p>
              <div>
                  <label>Clique no botão abaixo para acessar o comentário</label>
                  <a href="${process.env.FRONTEND}/videos/${data.curso}/${data.video}" target="_blank">Acessar comentário</a>
              </div>
          </div>
        </body>
      </html>
      `;

      return mailBody;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
