import { useState } from "react";
import "./form.css";

function Form() {
  const [formData, setFormData] = useState({
    numarFactura: "",
    dataFactura: "",
    dataScadenta: "",
    cifClient: "",
  });

  const [isGenerated, setIsGenerated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    console.log(formData);

    e.preventDefault();
    // Send formData to server for processing

    if (isGenerated === false) {
      fetch("your-server-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Server Response:", data);
          setIsGenerated(true);
          // Optionally handle server response
        })
        .catch((error) => {
          console.error("Error:", error);

          // Optionally handle errors
        });

      // Reset form after submission
      setFormData({
        numarFactura: "",
        dataFactura: "",
        dataScadenta: "",
        cifClient: "",
      });
    } else {
      //AICI DESCARCA FISIER
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="dateFactura">
          <h2>Date Factura</h2>
          <label htmlFor="numarFactura">Numar factura:</label>
          <input
            type="text"
            id="numarFactura"
            name="numarFactura"
            value={formData.numarFactura}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="dataFactura">Data factura:</label>
          <input
            type="date"
            id="dataFactura"
            name="dataFactura"
            value={formData.dataFactura}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="dataScadenta">Data scadenta:</label>
          <input
            type="date"
            id="dataScadenta"
            name="dataScadenta"
            value={formData.dataScadenta}
            onChange={handleChange}
          />
        </div>

        <div className="dateFactura">
          <h2>Date Client</h2>
          <label htmlFor="cifClient">CIF al clientului:</label>
          <input
            type="text"
            id="cifClient"
            name="cifClient"
            value={formData.cifClient}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          {isGenerated === false ? "Genereaza Factura" : "Descarca Factura"}
        </button>
      </form>
    </div>
  );
}

export default Form;
