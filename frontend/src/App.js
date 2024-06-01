import "./App.css";
import React, { useState } from "react";
import User from "./Components/User";
import Accounts from "./Components/Accounts";
/// TP RUN FRONTEND------------npm start

function App() {
  const [data, setData] = useState(null);

  // use multi value state: { data : null, thingy: string}

  return (
    <body className="App">
      <div className="start">
        <div className="bar">
          {data == null ? (
            <h1>SELECT ROLE</h1>
          ) : (
            <button className="item" onClick={() => setData(null)}>
              HOME
            </button>
          )}
        </div>
        {data == null ? (
          <div className="menu">
            <User type="Rider" event={() => setData("riders")} />
            <User type="Driver" event={() => setData("drivers")} />
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
