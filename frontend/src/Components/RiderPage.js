import React, { useEffect, useState } from "react";

const windows = Object.freeze({
  PAST_RIDES: Symbol("past_rides"),
  BILLS: Symbol("bills"),
  REQUEST_RIDE: Symbol("reuqest_ride"),
});

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
  }, []);

  const listPastRides = rides?.map((person) => (
    <tr key={person[0]}>
      <th>{person[2]}</th>
      <th>{person[4]}</th>
      <th>{person[6]}</th>
      <th>{person[7]}</th>
      <th>{person[8]}</th>
      <th>{person[9]}</th>
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
              <th>Start</th>
              <th>End</th>
              <th>Time</th>
              <th>Rider's Comment</th>
            </tr>
            {listPastRides}
          </tbody>
        </table>
      );
    } else if (window === windows.BILLS) {
      return <></>;
    } else if (window === windows.REQUEST_RIDE) {
      return <></>;
    }
  };

  return (
    <>
      <div className=" account-page">
        <div className=" account-page-sidebar">
          <div>
            <label type="text">Instructions</label>
            <br></br>
            <textarea
              type="text"
              name="instructions"
              placeholder={
                userInstructions == null ? "add instructions" : userInstructions
              }
              style={{ resize: "both", rows: 4, cols: 25 }}
            ></textarea>
            <br></br>
            <button type="button">UPDATE</button>
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
            <button type="button" onClick={() => setWindow(windows.BILLS)}>
              VIEW BILLS
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
