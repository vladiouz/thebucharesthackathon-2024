import { GenezioDeploy } from "@genezio/types";
import fetch from "node-fetch";

const nodemailer = require('nodemailer');

@GenezioDeploy()
export class SendMailService {
  async sendMail(to, subject, text) {
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
        text: text
    }

    transporter.sendMail(mailOptions, function(err, info) {
      if(err) {
        console.log('Error Occurs', err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
