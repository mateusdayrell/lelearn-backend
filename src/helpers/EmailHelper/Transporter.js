import nodemailer from "nodemailer"
require('dotenv').config();

let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: true, // process.env.SECURE_EMAIL === 'true' ? true : false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // process.env.TLS_EMAIL === 'true' ? true : false,
  },
})


// const handleSendMail = async(mailTo, mailSubject, mailBody) => {
//   try {
//     // process.env.DB_HOST
//     let transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       port: parseInt(process.env.MAIL_PORT),
//       secure: false, // process.env.SECURE_EMAIL === 'true' ? true : false, // true for 465, false for other ports
//       auth: {
//         user: process.env.MAIL_USERNAME,
//         pass: process.env.MAIL_PASSWORD,
//       },
//       tls: {
//         rejectUnauthorized: false, // process.env.TLS_EMAIL === 'true' ? true : false,
//       },
//     })

//     let { accepted } = await transporter.sendMail({
//       from: "LeLern " + process.env.MAIL_USERNAME,
//       to: mailTo,
//       subject: mailSubject,
//       html: mailBody,
//     });

//     if (accepted.length > 0) return accepted
// 		else return false
//   } catch (error) {
//     console.log(error)
//     return false
//   }
// }

module.exports = transporter
