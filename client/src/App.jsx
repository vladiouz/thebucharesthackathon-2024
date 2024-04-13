import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { GenerateInvoiceService } from "@genezio-sdk/the-bucharest-hackathon-2024";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [response, setResponse] = useState("");

  async function sayHello() {
    const response = await GenerateInvoiceService.generateInvoice({
      invoiceID: "id123",
      startDate: "2024-04-01",
      endDate: "2024-04-16",
      CIF: "30124159",
    });
    setResponse(response);
  }

  return (
    <>
      <div>
        <a href="https://genezio.com" target="_blank">
          <img
            src="https://raw.githubusercontent.com/Genez-io/graphics/main/svg/Logo_Genezio_White.svg"
            className="logo genezio light"
            alt="Genezio Logo"
          />
          <img
            src="https://raw.githubusercontent.com/Genez-io/graphics/main/svg/Logo_Genezio_Black.svg"
            className="logo genezio dark"
            alt="Genezio Logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Genezio + React = ❤️</h1>
      <div className="card">
        <input
          type="text"
          className="input-box"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <br />
        <br />

        <button onClick={() => sayHello()}>Say Hello</button>
        <p className="read-the-docs">{response}</p>
      </div>
    </>
  );
}

export default App;
