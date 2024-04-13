import axios from "axios";
import getXML from "./xml";

export class SendXMLService {
  static async sendXMLAndGetPDF(fac) {
    try {
      // Prepare the XML data
      const xmlData = getXML(fac);

      // Set up the HTTP request headers
      const config = {
        headers: {
          "Content-Type": "text/plain",
        },
        responseType: "arraybuffer", // Important for handling binary data
      };

      // POST the XML data
      const response = await axios.post(
        "https://webservicesp.anaf.ro/prod/FCTEL/rest/transformare/FACT1",
        xmlData,
        config,
      );

      // Write the PDF file received in response
      return response.data;
    } catch (error) {
      console.error("Error during API call:", error.message);
    }
  }
}
