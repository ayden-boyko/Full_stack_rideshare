import "./App.css";
import User from "./Components/User";
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
    <body className="App">
      <div className="start">
        <h1>SELECT ROLE</h1>
        <div className="menu">
          <User role="Rider" />
          <User role="Driver" />
        </div>
      </div>
    </body>
  );
}

export default App;
