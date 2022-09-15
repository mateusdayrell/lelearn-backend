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
          <title>Recuperação de senha</title>
      </head>

      <body>
          <style>
              table,
              th,
              td {
                  border: 1px solid black;
                  border-collapse: collapse;
              }
          </style>

          <div style='background-color: #3369b3; color: #fff;  display: flex; justify-content: space-between;'>
              <h2 style="margin-right: 10px;"> Recuperação de senha LeLearn </h2>
          </div>
          <div style='color: #363636; padding: 20px;'>
              <p>
                  <label>Utilize esse token: ${token} para recuperar a sua senha.</label>
              </p>

              <br />
      </body>
      </html>
      `;

      return mailBody;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
}
