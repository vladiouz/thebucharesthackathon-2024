import { GenezioDeploy } from "@genezio/types";
import { GenerateInvoiceService, getProcessedTasks } from "./generateInvoice.js";

const nodemailer = require('nodemailer');
const fs = require('fs');

const stripe = require("stripe")(
  "sk_test_51P5ARCLerUxd8e3bL0vjXfemdc6taL8p6VmHrS3hmK9U8BZVq7OysRrFIsrsW3hrGlOth4tK6Q3QKdfW6rnXfp1200tD8YEFUR"
);

const YOUR_DOMAIN = "http://localhost:5173";

@GenezioDeploy()
export class SendMailService {
  async payWithStripe(price_id) {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: price_id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });
    return session.url;
  }

  async sendMail(to, subject, text, filename) {
    const processedTasks = await getProcessedTasks();
    const price = await stripe.prices.create({
    currency: "ron",
    unit_amount: processedTasks.cost.total * 100,
    product_data: {
        name: "Software",
    },
    });

    text += " You can pay ";
    text += `<a href=${await this.payWithStripe(price.id)}>here</a>`;

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
      html: text,
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
