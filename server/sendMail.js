import { GenezioDeploy } from "@genezio/types";

const nodemailer = require('nodemailer');
const fs = require('fs');

@GenezioDeploy()
export class SendMailService {
  async sendMail(to, subject, text, filename) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "bucharest-cp@eestec.net",
        pass: "gouo iarr zynm hfvn",
      }
    });

    let mailOptions = {
      from: "bucharest-cp@eestec.net",
      to: to,
      subject: subject,
      text: text,
      attachments: [
        {
          filename: filename,
          content: fs.createReadStream(filename),
        },
      ],
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if(err) {
        console.log('Error Occurs', err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
