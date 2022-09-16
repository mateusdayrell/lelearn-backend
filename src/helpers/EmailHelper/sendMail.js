// eslint-disable-next-line import/no-import-module-exports
import nodemailer from 'nodemailer';

require('dotenv').config();

const handleSendMail = async (mailTo, mailSubject, mailBody) => {
  try {
    // mail trap
    // var transporter = nodemailer.createTransport({
    //   host: "smtp.mailtrap.io",
    //   port: 2525,
    //   auth: {
    //     user: "9f36963de0587a",
    //     pass: "3408c7d05b9688"
    //   }
    // })

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      // eslint-disable-next-line radix
      port: parseInt(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE_EMAIL,
      requireTLS: process.env.MAIL_TLS_EMAIL,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_SUPER_PASSWORD,
      },
    });

    const { accepted } = await transporter.sendMail({
      from: `LeLearn ${process.env.MAIL_USERNAME}`,
      to: mailTo,
      subject: mailSubject,
      html: mailBody,
    });

    if (accepted.length > 0) return accepted;
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = handleSendMail;
