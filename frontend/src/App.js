import "./App.css";
import React, { useState } from "react";
import User from "./Components/User";
import Accounts from "./Components/Accounts";
import NavBar from "./Components/NavBar";
import DriverPage from "./Components/DriverPage";
import RiderPage from "./Components/RiderPage";

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
  const logOUT = {
    role: null,
    id: null,
    name: null,
    rating: null,
    instructions: null,
    zipcode: null,
    is_active: false,
    carpool: false,
  };

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
        </div>
      </body>
    );
  } else {
    return (
      <body className="App">
        <NavBar
          userType={data.role}
          userId={data.id}
          userName={data.name}
          userRating={data.rating}
          userLocation={data.zipcode}
          userStatus={data.is_active}
          passedFunction={func}
          logData={logOUT}
        />
        {data.role === "driver" ? (
          <DriverPage
            userId={data.id}
            userName={data.name}
            userRating={data.rating}
            userInstructions={data.instructions}
            userLocation={data.zipcode}
            userStatus={data.is_active}
            userCarpool={data.carpool}
          />
        ) : (
          <RiderPage
            userId={data.id}
            userName={data.name}
            userRating={data.rating}
            userInstructions={data.instructions}
            userLocation={data.zipcode}
            userStatus={data.is_active}
            userCarpool={data.carpool}
          />
        )}
      </body>
    );
  }
}

export default App;
