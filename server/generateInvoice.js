import { GenezioDeploy } from "@genezio/types";
import { format, addDays } from "date-fns";
import { GetJiraClosedTasksService } from "./getJiraClosedTasks";

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
      issueDate: format(new Date(), "dd/MM/yyyy"),
      dueDate: format(addDays(new Date(), 30), "dd/MM/yyyy"),
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
          name: processedTasks.invoiceDescription || "",
        },
      ],
    };

    return JSON.stringify(invoice);
  }
}
