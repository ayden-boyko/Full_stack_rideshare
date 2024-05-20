import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

/// TP RUN FRONTEND------------npm start

function App() {
  const [data, setData] = useState({ message: "test" });

  useEffect(() => {
    /*chnage to route to reference the supabse db*/
    const fetch_Hello = async () => {
      const response = await fetch(
        "http://localhost:5000/accountinfo/accounts",
        {
          headers: { Accept: "application/json" },
        }
      );
      const responseClone = response.clone();
      responseClone.text().then((text) => console.log(text));
      const json = await response.json();
      if (response.ok) {
        setData(json);
      }
    };
    fetch_Hello();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>hey is this working?</p>
        <p>{data.drivers}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
