import "./App.css";
import React, { createContext, useState } from "react";
import User from "./Components/User";
import Accounts from "./Components/Accounts";
import NavBar from "./Components/NavBar";
import DriverPage from "./Components/DriverPage";
import RiderPage from "./Components/RiderPage";
import { ReactComponent as DriverLogo } from "./Images/driver.svg";
import { ReactComponent as RiderLogo } from "./Images/rider.svg";

/// TP RUN FRONTEND------------npm start

export const DataContext = createContext(null);

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
      <>
        <div className="blurred-background" id="blurred"></div>
        <div className="start">
          <div className="bar">
            {data.role == null ? (
              <h1 style={{ color: "black" }}>SELECT ROLE</h1>
            ) : (
              <button
                className="button-select"
                style={{ marginTop: "10px" }}
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
                  <b>Rider </b>
                  <li>Request rides</li>
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
                  <b>Driver</b> <li>Give rides</li>
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
              <DataContext.Provider value={{ data, setData }}>
                <Accounts />
              </DataContext.Provider>
            </>
          )}
        </div>
      </>
    );
  } else {
    return (
      <DataContext.Provider value={{ data, setData }}>
        <NavBar logData={logOUT} />
        {data.role === "driver" ? <DriverPage /> : <RiderPage />}
      </DataContext.Provider>
    );
  }
}

export default App;
