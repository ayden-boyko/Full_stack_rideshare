import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

/// TP RUN FRONTEND------------npm start

function App() {
  const [data, setData] = useState({ message: "test" });

  useEffect(() => {
    /*this took so much time to fix, instead of the rout being /hello, 
    it was supposed to be http://localhost:5000/hello because im running the requests through a proxy url, localhost:5000*/
    const fetch_Hello = async () => {
      const response = await fetch("http://localhost:5000/rideinfo", {
        headers: { Accept: "application/json" },
      });
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
        <p>{data}</p>
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
