import "./App.css";
import React, { useState, useEffect } from "react";
import User from "./Components/User";
import Accounts from "./Components/Accounts";
/// TP RUN FRONTEND------------npm start

function App() {
  const [data, setData] = useState(null);

  /*
  useEffect(() => {
    // chnage to route to reference the supabse db
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
  */

  return (
    <body className="App">
      <div className="start">
        <div className="bar">
          {data == null ? <h1>SELECT ROLE</h1> : <></>}
          <button className="item" onClick={() => setData(null)}>
            HOME
          </button>
        </div>
        {data == null ? (
          <div className="menu">
            <User role="Rider" event={() => setData("riders")} />
            <User role="Driver" event={() => setData("drivers")} />
          </div>
        ) : (
          <>
            <Accounts userType={data} />
          </>
        )}
      </div>
    </body>
  );
}

export default App;
