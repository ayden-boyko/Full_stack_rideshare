import "./App.css";
import React, { useState } from "react";
import User from "./Components/User";
import Accounts from "./Components/Accounts";
/// TP RUN FRONTEND------------npm start

function App() {
  const [data, setData] = useState({
    role: null,
    id: null,
    name: null,
    rating: null,
    instructions: null,
    zipcode: null,
    is_active: false,
    carpool: false,
  });

  const func = setData;

  if (data.id == null) {
    return (
      <body className="App">
        <div className="start">
          <div className="bar">
            {data.role == null ? (
              <h1>SELECT ROLE</h1>
            ) : (
              <button
                className="item"
                onClick={() => setData({ ...data, role: null })}
              >
                HOME
              </button>
            )}
          </div>
          {data.role == null ? (
            <div className="menu">
              <User
                type="Rider"
                event={() => setData({ ...data, role: "riders" })}
              />
              <User
                type="Driver"
                event={() => setData({ ...data, role: "drivers" })}
              />
            </div>
          ) : (
            <>
              <Accounts userType={data.role} passedFunction={func} />
            </>
          )}

          <div>
            <p>({data.name}, heyyyy)</p>
          </div>
        </div>
      </body>
    );
  } else {
    return (
      <body className="App">
        <div className="start">
          <p>LOGGED IN!!!!!!</p>
        </div>
      </body>
    );
  }
}

export default App;
