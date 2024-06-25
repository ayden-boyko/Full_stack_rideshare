import "./App.css";
import React, { useState } from "react";
import User from "./Components/User";
import Accounts from "./Components/Accounts";
import NavBar from "./Components/NavBar";
import DriverPage from "./Components/DriverPage";
import RiderPage from "./Components/RiderPage";
import { ReactComponent as DriverLogo } from "./Images/driver.svg";
import { ReactComponent as RiderLogo } from "./Images/rider.svg";

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
              <h1 style={{ color: "black" }}>SELECT ROLE</h1>
            ) : (
              <button
                className="button-select"
                onClick={() => setData({ ...data, role: null })}
              >
                HOME
              </button>
            )}
          </div>
          {data.role == null ? (
            <div className="menu">
              <div className="box">
                <RiderLogo />
                <p style={{ color: "black" }}>
                  Rider <li>Request rides</li>
                  <li>Comment on them</li> <li>Rate drivers</li>
                  <li>Respond to comments</li>
                </p>
                <User
                  type="Select"
                  event={() => setData({ ...data, role: "riders" })}
                />
              </div>
              <div className="box">
                <DriverLogo />
                <p style={{ color: "black" }}>
                  Driver <li>Give rides</li>
                  <li>Comment on them</li> <li>Rate drivers</li>
                  <li>Respond to comments</li>
                </p>
                <User
                  type="Select"
                  event={() => setData({ ...data, role: "drivers" })}
                />
              </div>
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
