import { GenezioDeploy } from "@genezio/types";
import {
  GenerateInvoiceService,
  getProcessedTasks,
} from "./generateInvoice.js";

const nodemailer = require("nodemailer");
import "dotenv/config";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

  async sendMail(file, startDate, endDate, to, subject, text) {
    const processedTasks = await getProcessedTasks(startDate, endDate);
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
      service: "gmail",
      auth: {
        user: "bucharest-cp@eestec.net",
        pass: "gouo iarr zynm hfvn",
      },
    });

    let mailOptions = {
      from: "bucharest-cp@eestec.net",
      to: to,
      subject: subject,
      html: text,
      attachments: [
        {
          filename: "invoice.pdf",
          content: Buffer.from(file, "base64"),
        },
      ],
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log("Error Occurs", err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}
