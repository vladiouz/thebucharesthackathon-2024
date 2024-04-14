import { useState } from "react";
import { GenerateInvoiceService } from "@genezio-sdk/the-bucharest-hackathon-2024";
import { SendMailService } from "@genezio-sdk/the-bucharest-hackathon-2024";
import "./form.css";
import { Buffer } from "buffer";

function Form() {
  const [formData, setFormData] = useState({
    invoiceID: "",
    startDate: "",
    endDate: "",
    CIF: "",
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [invoiceDownloaded, setInvoiceDownloaded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send formData to server for processing
    const response = await GenerateInvoiceService.generateInvoice(formData);
    if (response) {
      setPdfFile(
        new Blob([new Uint8Array(response?.data)], {
          type: "application/pdf",
        }),
      );
      // Reset form after submission
      // setFormData({
      //   invoiceID: "",
      //   startDate: "",
      //   endDate: "",
      //   CIF: "",
      // });
    }
  };

  function onDownloadPdf() {
    if (pdfFile) {
      setInvoiceDownloaded(true);
      const element = document.createElement("a");
      element.href = URL.createObjectURL(pdfFile);
      element.download = "invoice.pdf";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    } else {
      console.error("Error: PDF data is undefined or empty.");
    }
  }

  async function onSendMail() {
    const fileToSend = Buffer.from(await pdfFile.arrayBuffer()).toString(
      "base64",
    );
    await SendMailService.sendMail(
      fileToSend,
      formData.startDate,
      formData.endDate,
      "vlad.ionescu@eestec.ro",
      "New Invoice",
      "You have a new invoice!",
    );
  }

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="dateFactura">
          <h2>Date Factura</h2>
          <label htmlFor="invoiceID">Numar factura:</label>
          <input
            type="text"
            id="invoiceID"
            name="invoiceID"
            value={formData.invoiceID}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="startDate">Data inceput:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="endDate">Data incheiere:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="dateFactura">
          <h2>Date Client</h2>
          <label htmlFor="CIF">CIF al clientului:</label>
          <input
            type="text"
            id="CIF"
            name="CIF"
            value={formData.CIF}
            onChange={handleChange}
          />
        </div>
        {pdfFile ? (
          <>
            <button onClick={onDownloadPdf}>{"Descarca Factura"}</button>
            {invoiceDownloaded && (
              <button onClick={onSendMail}>Send invoice on email</button>
            )}
          </>
        ) : (
          <button type="submit">{"Genereaza Factura"}</button>
        )}
      </form>
    </div>
  );
}

export default Form;
