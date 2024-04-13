import { useState } from "react";
import { BackendService } from "@genezio-sdk/the-bucharest-hackathon-2024";
import "./App.css";
import Form from "./components/form/Form";

function App() {
  const [name, setName] = useState("");
  const [response, setResponse] = useState("");

  async function sayHello() {
    setResponse(await BackendService.hello(name));
  }

  return (
    <>
      <div className="app">
        <Form />
      </div>
    </>
  );
}

export default App;
