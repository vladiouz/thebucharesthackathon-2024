import { GenezioDeploy } from "@genezio/types";
import { format, addDays } from "date-fns";
import { GetJiraClosedTasksService } from "./getJiraClosedTasks";
import { SendXMLService } from "./genpdf";

const SELLER_INFO = {
  nume_companie: "Lettuce Cook",
  nr_reg: "98871798579",
  CUI: "30124159",
};
const BUYER_INFO = {
  nume_companie: "Bucharest Hackathon",
  nr_reg: "5387685871638",
  CUI: "30124159",
};

const fac = {
  id_fac: "71",
  issueDate: "2024-04-13",
  dueDate: "2024-04-20",
  curr: "RON",
  seller: {
    nume_companie: "Hello inc",
    nr_reg: "98871798579",
    CUI: "16350738",
  },
  client: {
    nume_companie: "Bye inc",
    nr_reg: "5387685871638",
    CUI: "33184554",
  },
  legal: {
    tot_net: 402,
    tot_no_vat: 300,
  },
  items: [
    {
      id: 1,
      sum: 300,
      desc: "jfdhskfdhd",
      name: "fjvkj",
    },
  ],
};

@GenezioDeploy()
export class GenerateInvoiceService {
  async generateInvoice(payload) {
    const { invoiceID, startDate, endDate, CIF } = payload;

    const processedTasks = await GetJiraClosedTasksService.getClosedTasks(
      startDate,
      endDate,
    );

    const invoice = {
      id_fac: invoiceID,
      issueDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(addDays(new Date(), 30), "yyyy-MM-dd"),
      curr: "RON",
      seller: SELLER_INFO,
      client: {
        ...BUYER_INFO,
        // CUI: CIF,
      },
      legal: {
        tot_net: processedTasks.cost.total,
        tot_no_vat: processedTasks.cost.total,
      },
      items: [
        {
          id: 1,
          sum: processedTasks.cost.total,
          desc: "",
          name: processedTasks.invoiceDescription || "itemname",
        },
      ],
    };
    const result = await SendXMLService.sendXMLAndGetPDF(invoice);
    return result;
  }
}
