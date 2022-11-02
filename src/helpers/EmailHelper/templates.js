module.exports = {
  async forgotPasswordTemplate(token) {
    try {
      const mailBody = `
      <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.cdnfonts.com/css/montserrat" rel="stylesheet">
        <title>Recuperação de senha</title>
      </head>
      <body style='background-color: #1f1f23; font-family: "Montserrat", sans-serif;'>
        <div style='background-color: #1f1f23; color: #00B37E;  display: flex; justify-content: center;'>
            <h2> Recuperação de senha LeLearn </h2>
        </div>
        <div style='background-color: #28282c; color: white; text-align: center; display: flex; justify-content: center;flex-direction: column;align-items: center;'>
            <p>
                <label>Você solicitou a redefinição de sua senha.</label> <br>
                <label>Copie o código abaixo e cole no campo indicado na página anterior do LeLearn.</label> <br>
            </p>
            <div style="width: 50%; background-color:#343438; color: #00B37E; margin-top: 10px; padding: 10px; margin-bottom: 10px;">
                <label>${token}</label>
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
