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
            <h2 style='padding-left: 10px;'> Recuperação de senha LeLearn </h2>
        </div>
        <div style='background-color: #28282c; width: 100%; color: #FFFFFF; text-align: center; margin: 0 10px;'>
            <p style='padding-top: 5px;'>
                <label>Você solicitou a alteração da sua senha.</label> <br>
                <label>Utilize o código abaixo para concluir o processo.</label> <br>
            </p>
            <div style="width: 50%; background-color:#343438; color: #00B37E; margin: auto; padding: 5px;">
                <label>${token}</label>
            </div>
            <p style='padding-bottom: 5px;'>
                <label>Se você não solicitou esse código, é possível que outra</label> <br>
                <label>pessoa esteja tentando acessar a sua conta do Lelearn.</label> <br>
                <label>Não encaminhe ou dê o código a ninguém.</label>
            </p>
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

  async notification1(data) {
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
            <h2 style='padding-left: 10px;'> Recuperação de senha LeLearn </h2>
        </div>
        <div style='background-color: #28282c; width: 100%; color: #FFFFFF; text-align: center; margin: 0 10px;'>
            <p style='padding-top: 5px;'>
                <label>Novo comentário no Lelearn.</label> <br>
            </p>
            <div>
                <label>${data.nome} comentou no vídeo ${data.video}</label>
            </div>
            <p style='padding-bottom: 5px;'>
                <label>Se você não solicitou esse código, é possível que outra</label> <br>
                <label>pessoa esteja tentando acessar a sua conta do Lelearn.</label> <br>
                <label>Não encaminhe ou dê o código a ninguém.</label>
            </p>
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

  async notification2(data) {
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
            <h2 style='padding-left: 10px;'> Recuperação de senha LeLearn </h2>
        </div>
        <div style='background-color: #28282c; width: 100%; color: #FFFFFF; text-align: center; margin: 0 10px;'>
            <p style='padding-top: 5px;'>
                <label>O seu comentário foi respondido</label> <br>
            </p>
            <div>
                <label>Um administrador respondeu o seu comentário no vídeo ${data.video}</label>
            </div>
            <p style='padding-bottom: 5px;'>
                <label>Se você não solicitou esse código, é possível que outra</label> <br>
                <label>pessoa esteja tentando acessar a sua conta do Lelearn.</label> <br>
                <label>Não encaminhe ou dê o código a ninguém.</label>
            </p>
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

  async notification3(data) {
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
            <h2 style='padding-left: 10px;'> Recuperação de senha LeLearn </h2>
        </div>
        <div style='background-color: #28282c; width: 100%; color: #FFFFFF; text-align: center; margin: 0 10px;'>
            <p style='padding-top: 5px;'>
                <label>O seu comentário foi respondido</label> <br>
            </p>
            <div>
                <label>${data.nome} adicionou uma resposta ao seu comentário no vídeo ${data.video}</label>
            </div>
            <p style='padding-bottom: 5px;'>
                <label>Se você não solicitou esse código, é possível que outra</label> <br>
                <label>pessoa esteja tentando acessar a sua conta do Lelearn.</label> <br>
                <label>Não encaminhe ou dê o código a ninguém.</label>
            </p>
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

  async notification4(data) {
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
            <h2 style='padding-left: 10px;'> Recuperação de senha LeLearn </h2>
        </div>
        <div style='background-color: #28282c; width: 100%; color: #FFFFFF; text-align: center; margin: 0 10px;'>
            <p style='padding-top: 5px;'>
                <label>O seu comentário foi respondido</label> <br>
            </p>
            <div>
                <label>${data.nome} adicionou uma resposta a um comentário no vídeo ${data.titulo}</label>
            </div>
            <p style='padding-bottom: 5px;'>
                <label>Se você não solicitou esse código, é possível que outra</label> <br>
                <label>pessoa esteja tentando acessar a sua conta do Lelearn.</label> <br>
                <label>Não encaminhe ou dê o código a ninguém.</label>
            </p>
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

  async notification5(data) {
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
            <h2 style='padding-left: 10px;'> Recuperação de senha LeLearn </h2>
        </div>
        <div style='background-color: #28282c; width: 100%; color: #FFFFFF; text-align: center; margin: 0 10px;'>
            <p style='padding-top: 5px;'>
                <label>O seu comentário foi respondido</label> <br>
            </p>
            <div>
                <label>Um administrador adicionou uma resposta a um comentário que você participou no vídeo ${data.titulo}</label>
            </div>
            <p style='padding-bottom: 5px;'>
                <label>Se você não solicitou esse código, é possível que outra</label> <br>
                <label>pessoa esteja tentando acessar a sua conta do Lelearn.</label> <br>
                <label>Não encaminhe ou dê o código a ninguém.</label>
            </p>
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

  async notification6(data) {
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
            <h2 style='padding-left: 10px;'> Recuperação de senha LeLearn </h2>
        </div>
        <div style='background-color: #28282c; width: 100%; color: #FFFFFF; text-align: center; margin: 0 10px;'>
            <p style='padding-top: 5px;'>
                <label>O seu comentário foi respondido</label> <br>
            </p>
            <div>
                <label>${data.nome} adicionou uma resposta a um comentário que você participou no vídeo ${data.titulo}</label>
            </div>
            <p style='padding-bottom: 5px;'>
                <label>Se você não solicitou esse código, é possível que outra</label> <br>
                <label>pessoa esteja tentando acessar a sua conta do Lelearn.</label> <br>
                <label>Não encaminhe ou dê o código a ninguém.</label>
            </p>
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
