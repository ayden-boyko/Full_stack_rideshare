import React, { useEffect, useState } from "react";

const windows = Object.freeze({
  PAST_RIDES: Symbol("past_rides"),
  BILLS: Symbol("bills"),
  REQUEST_RIDE: Symbol("request_ride"),
});

async function changeInstructions(id, name) {
  const form = document.getElementById("InstructForm");
  const formacc = new FormData(form);

  let tempInstruct = formacc.get("instructions");

  const submitLink = `http://127.0.0.1:5000/rideinfo/rider/${id}/${tempInstruct}/${name}`;
  try {
    const response = await fetch(submitLink, {
      method: "PUT",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });
    const result = await response.json();
    console.log("Success:", result);
    alert("Instructions Updated!");
  } catch (error) {
    console.log("Error:", error);
  }
}

function RiderPage({
  userType,
  userId,
  userName,
  userRating,
  userInstructions,
  userLocation,
  userStatus,
}) {
  const [window, setWindow] = useState(windows.PAST_RIDES);
  const [rides, setRides] = useState([]);
  const [bills, setBills] = useState([]);
  const submitLink = `http://127.0.0.1:5000/rideinfo/rider/${userId}/ignore/${userName}`;
  useEffect(() => {
    const fetch_Rides = async () => {
      try {
        const response = await fetch(submitLink, {
          method: "GET",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
        });
        const result = await response.json();
        console.log("Success:", JSON.parse(JSON.stringify(result)));
        setRides(JSON.parse(JSON.stringify(result)));
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetch_Rides();
  }, [submitLink]);

  async function retrieveBills(id) {
    const submitLink = `http://127.0.0.1:5000/transaction/reciept/${id}/${Number.MAX_SAFE_INTEGER}/0`;
    try {
      const response = await fetch(submitLink, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      });
      const result = await response.json();
      console.log("Success:", result);
      setBills(JSON.parse(JSON.stringify(result)));
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async function request_ride(event) {
    const form = document.getElementById("RideForm");
    const formacc = new FormData(form);
    let tempDest = formacc.get("coordinate");
    try {
      const pattern = new RegExp("\\d,\\d");

      if (!pattern.test(tempDest)) {
        alert("not in correct format, must be (X,X)");
        event.preventDefault();
        return false;
      }
    } catch (error) {
      console.log("Error:", error);
      event.preventDefault();
      Promise.reject();
      return false;
    }
    event.preventDefault();
    const submitLink = `http://127.0.0.1:5000/singlerider/${userId}/${userName}/0,0/${tempDest}`;
    try {
      const response = await fetch(submitLink, {
        method: "PUT",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      });
      const result = await response.json();
      console.log("Success:", JSON.parse(JSON.stringify(result)));
    } catch (error) {
      console.log(error);
    }
    console.log("done");
  }

  const listPastRides = rides?.map((person) => (
    <tr key={person[0]}>
      <th>{person[2]}</th>
      <th>{person[4]}</th>
      <th>{person[5]}</th>
      <th>{person[6]}</th>
      <th>{person[7]}</th>
      <th>{person[8]}</th>
      <th>{person[9]}</th>
      <th>{person[10]}</th>
      <th>{person[11]}</th>
      <th>{person[12]}</th>
      <th>{person[13]}</th>
      <th>{person[14]}</th>
    </tr>
  ));

  const listBills = bills?.map((person, index) => (
    <tr key={index}>
      <th>{person[1]}</th>
      <th>{person[2]}</th>
      <th>{person[3]}</th>
    </tr>
  ));

  /** conditionally renders either
   * 1. past rides, in order to allow user to coment on them.
   * 2. bills, ie cost of said rides.
   * 3.the request ride window. */

  const renderWindow = () => {
    if (window === windows.PAST_RIDES) {
      return (
        <table style={{ width: "auto" }}>
          <tbody>
            <tr>
              <th>Driver</th>
              <th>Rider</th>
              <th>Instructions</th>
              <th>Start</th>
              <th>End</th>
              <th>Time</th>
              <th>Review of Driver</th>
              <th>Rating of Driver</th>
              <th>Review of Rider</th>
              <th>Rating of Rider</th>
              <th>Driver's Response</th>
              <th>Rider's Response</th>
            </tr>
            {listPastRides}
          </tbody>
        </table>
      );
    } else if (window === windows.BILLS) {
      return (
        <table style={{ width: "auto" }}>
          <tbody>
            <tr>
              <th>Rider</th>
              <th>Cost</th>
              <th>Time</th>
            </tr>
            {listBills}
          </tbody>
        </table>
      );
    } else if (window === windows.REQUEST_RIDE) {
      return (
        <form id="RideForm">
          <span>
            <label>DESTINATION</label>
            <br></br>
            <input
              type="text"
              id="coordinate"
              name="coordinate"
              pattern="\d,\d"
              title="Destination must be in the format (X,X)"
              maxLength="3"
              placeholder="X,X"
              required
            ></input>
          </span>
          <br></br>
          <span>
            <label>CARPOOL?</label>
            <br></br>
            <button type="button">YES</button> <button type="button">NO</button>
          </span>
          <br></br>
          <span>
            <button type="submit" onClick={(event) => request_ride(event)}>
              CONFIRM RIDE
            </button>
          </span>
        </form>
      );
    }
  };

  return (
    <>
      <div className=" account-page">
        <div className=" account-page-sidebar">
          <div>
            <form id="InstructForm">
              <label type="text">Instructions</label>
              <br></br>
              <textarea
                type="text"
                name="instructions"
                placeholder={
                  userInstructions == null
                    ? "add instructions"
                    : userInstructions
                }
                style={{ resize: "both", rows: 4, cols: 25 }}
              ></textarea>
              <br></br>
              <button
                type="button"
                onClick={() => changeInstructions(userId, userName)}
              >
                UPDATE
              </button>
            </form>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setWindow(windows.REQUEST_RIDE)}
            >
              REQUEST RIDE
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setWindow(windows.BILLS);
                console.log(bills);
                if (bills.length === 0) {
                  retrieveBills(userId);
                }
              }}
            >
              VIEW BILLS
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setWindow(windows.PAST_RIDES);
              }}
            >
              VIEW PAST RIDES
            </button>
          </div>
        </div>
        <div className=" account-page-main">
          <div>{renderWindow()}</div>
        </div>
      </div>
    </>
  );
}

export default RiderPage;
