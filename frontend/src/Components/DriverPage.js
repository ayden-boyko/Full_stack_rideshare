import React, { useState, useEffect } from "react";

const windows = Object.freeze({
  PAST_RIDES: Symbol("past_rides"),
  BILLS: Symbol("bills"),
  REQUEST_RIDER: Symbol("request_riders"),
});

function DriverPage({
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
  const [riders, setRiders] = useState([]);

  const submitLink = `http://127.0.0.1:5000/rideinfo/driver/${userId}/ignore/${userName}`;

  //SHOULD RETRIEVE PAST RIDES GIVEN NOT TAKEN
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

  async function retrieveRiders() {
    const submitLink = `http://127.0.0.1:5000/singledriver/pre`;
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
      setRiders([result]);
    } catch (error) {
      console.log("Error:", error);
    }
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
  const listRiders = riders?.map((person, index) => {
    console.log(riders);
    console.log(person);
    return (
      <tr key={index}>
        <th>{person[1]}</th>
        <th>{person[2]}</th>
        <th>{person[3]}</th>
        <th>{person[4]}</th>
        <th>{person[5]}</th>
        <th>{person[6]}</th>
        <th>
          <button>SELECT</button>
        </th>
      </tr>
    );
  });

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
    } else if (window === windows.REQUEST_RIDER) {
      return (
        <table style={{ width: "auto" }}>
          <tbody>
            <tr>
              <th>Rider_Id</th>
              <th>Name</th>
              <th>Rating</th>
              <th>Instructions</th>
              <th>Start</th>
              <th>End</th>
              <th>choose</th>
            </tr>
            {listRiders}
          </tbody>
        </table>
      );
    }
  };

  return (
    <>
      <div className=" account-page">
        <div className=" account-page-sidebar">
          <div>
            <button type="button" onClick={() => 0}>
              CARPOOL?
            </button>
          </div>
          <div>
            <button
              type="button"
              name="get_riders"
              onClick={() => {
                setWindow(windows.REQUEST_RIDER);
                retrieveRiders();
              }}
            >
              REQUEST RIDER
            </button>
          </div>
          <div>
            <button
              type="button"
              name="get_bills"
              onClick={() => {
                setWindow(windows.BILLS);
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
              name="get_past_rides "
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

export default DriverPage;
