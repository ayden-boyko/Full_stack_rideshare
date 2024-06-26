import React, { useEffect, useState, useRef } from "react";
import { io, emit, send, of, to } from "socket.io-client";
import {
  fetch_Rides,
  retrieveBills,
  openForm,
} from "../Shared_Functions/retrieve.js";
import ResponseForm from "./ResponseForm";

const windows = Object.freeze({
  PAST_RIDES: Symbol("past_rides"),
  BILLS: Symbol("bills"),
  REQUEST_RIDE: Symbol("request_ride"),
  WAITING: Symbol("waiting"),
  GETING_RIDE: Symbol("getting_ride"),
});
// props.userId,
// props.userName,
// userRating,
// userInstructions,
// userLocation,
// userStatus,
// userCarpool,
function RiderPage(props) {
  const [window, setWindow] = useState(windows.PAST_RIDES);
  const [rides, setRides] = useState([]);
  const [bills, setBills] = useState([]);
  const socktInstance = useRef(null);
  const [driver, setDriver] = useState(null);
  const [destination, setDestination] = useState(null);
  const [review_id, setReview_id] = useState(null); //review_id

  const loadData = async () => {
    setRides(
      await fetch_Rides(
        `http://127.0.0.1:5000/rideinfo/rider/${props.userId}/ignore/${props.userName}`
      )
    );
  };

  const loadBills = async () => {
    setBills(await retrieveBills("rider", props.userId));
  };

  useEffect(() => {
    loadData();

    if (sessionStorage.getItem("status") === "waiting") {
      setWindow(windows.WAITING);
    }
    if (socktInstance.current === null) {
      const socket = io("http://127.0.0.1:5000/rider", {
        transports: ["websocket"],
        withCredentials: true,
        // cors: {
        //   origin: "http://localhost:3000/",
        //   methods: ["GET", "POST", "PUT", "DELETE"],
        //   allowedHeaders: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //   },
        // },
      });
      socktInstance.current = socket;
    }

    socktInstance.current.on("connect", (data) => {
      console.log("connected", data);
    });

    socktInstance.current.on("connect_error", (error) => {
      if (socktInstance.current.active) {
        console.log("trying to reconnect:", error);
      } else {
        console.log(error);
      }
    });

    socktInstance.current.on("disconnect", (data) => {
      console.log("disconnected", data);
    });
  }, [window, socktInstance.current]);

  async function changeInstructions(id, name) {
    const form = document.getElementById("InstructForm");
    const formacc = new FormData(form);

    let tempInstruct = formacc.get("instructions");

    if (tempInstruct === "") {
      alert("Please enter instructions!");
      return;
    }

    let tempLink = `http://127.0.0.1:5000/rideinfo/rider/${id}/${tempInstruct}/${name}`;
    try {
      const response = await fetch(tempLink, {
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
    let tempLink = `http://127.0.0.1:5000/singlerider/${props.userId}/${props.userName}/0,0/${tempDest}/${socktInstance.id}`;
    setDestination(tempDest);
    console.log("socket ID:", socktInstance.id);
    try {
      const response = await fetch(tempLink, {
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
      setWindow(windows.WAITING);
      sessionStorage.setItem("status", "waiting");
    } catch (error) {
      console.log(error);
    }
    console.log("done");
  }

  // Function to update a specific row's person[13] based on key updates when the review gets responded to, no need to fetch data again
  const updateResponse = (key, newResponse) => {
    // Find the index of the ride in the rides array based on key
    const index = rides.findIndex((person) => person[0] === key);

    if (index !== -1) {
      // Use spread operator for immutability
      const updatedRides = [...rides];
      // Update person[14] for the specific row
      updatedRides[index][13] = newResponse;
      // Update state to trigger re-render
      setRides(updatedRides);
    }
  };

  const listPastRides = rides?.map((person) => (
    <tr key={person[0]}>
      <td>{person[2]}</td> {/*driver name*/}
      <td>{person[4]}</td> {/*rider name*/}
      <td>{person[5] == null ? "None" : person[5]}</td> {/*isntructions*/}
      <td>{person[6]}</td> {/*start*/}
      <td>{person[7]}</td> {/*end*/}
      <td>{person[8]}</td> {/*time*/}
      <td>{person[9]}</td> {/*review of driver*/}
      <td>{person[10]}</td> {/*rating of driver*/}
      <td>{person[11]}</td> {/*review of rider*/}
      <td>{person[12]}</td> {/*rating of rider*/}
      <td>{person[14] === null ? "No Response Yet" : person[14]}</td>
      {/*Drivers response*/}
      <td>
        {person[13] === null ? (
          <button
            onClick={() => {
              openForm();
              setReview_id(person[0]);
            }}
          >
            Respond
          </button>
        ) : (
          person[13]
        )}
      </td>
      {/*Riders response*/}
    </tr>
  ));

  const listBills = bills?.map((person, index) => {
    if (person != null) {
      return (
        <tr key={index}>
          <td>{person[1]}</td>
          <td>{person[2]}</td>
          <td>{person[3]}</td>
        </tr>
      );
    } else {
      return (
        <tbody>
          <tr key={1}>
            <td>None</td>
            <td>None</td>
            <td>None</td>
          </tr>
        </tbody>
      );
    }
  });

  /** conditionally renders either
   * 1. past rides, in order to allow user to coment on them.
   * 2. bills, ie cost of said rides.
   * 3.the request ride window. */

  const renderWindow = () => {
    switch (window) {
      case windows.PAST_RIDES:
        if (rides.length !== 0) {
          return (
            <table className="infotable">
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
              <tbody>{listPastRides}</tbody>
            </table>
          );
        } else {
          return (
            <table className="infotable">
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
              <tbody>
                <tr>
                  <td colSpan={"100%"}>NO PAST RIDES YET</td>
                </tr>
              </tbody>
            </table>
          );
        }
      case windows.BILLS:
        if (bills.length !== 0) {
          return (
            <table className="infotable">
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
        } else
          return (
            <table className="infotable">
              <tbody>
                <tr>
                  <th>Rider</th>
                  <th>Cost</th>
                  <th>Time</th>
                </tr>
                <tr key={1}>
                  <td>None</td>
                  <td>None</td>
                  <td>None</td>
                </tr>
              </tbody>
            </table>
          );
      case windows.REQUEST_RIDE:
        return (
          <form id="RideForm">
            <div className="mychoice">
              <span>
                <div style={{ justifyContent: "center" }}>
                  <label style={{ fontWeight: "bold", color: "black" }}>
                    LOCATION
                  </label>
                </div>
                <div style={{ justifyContent: "center" }}>
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
                </div>
              </span>
            </div>
            <span>
              <div className="mychoice">
                <div style={{ justifyContent: "center" }}>
                  <label style={{ fontWeight: "bold", color: "black" }}>
                    CARPOOL?
                  </label>
                </div>
                <div>
                  <label>
                    <input type="radio" name="check" />
                    <span>Yes</span>
                  </label>
                  <label>
                    <input type="radio" name="check" defaultChecked />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </span>
            <br></br>
            <span>
              <button
                type="submit"
                className="button-select"
                onClick={(event) => request_ride(event)}
              >
                CONFIRM RIDE
              </button>
            </span>
          </form>
        );
      case windows.WAITING:
        return <h1>WAITING FOR DRIVER</h1>;
      case windows.GETING_RIDE:
        return (
          <>
            <span>RIDE INFO</span>
            <br></br>
            <p>DRIVER NAME: {driver[1]}</p>
            <br></br>
            <p>DRIVER RATING: {driver[2]}</p>
            <br></br>
            <p>DESTINATION: {destination}</p>
            <br></br>
            <p>COST: IMPLEMENT COST</p>
          </>
        );
      default:
        return <h1>SOMETHINGS WRONG...</h1>;
    }
  };

  return (
    <>
      <div className=" account-page">
        <div className=" account-page-sidebar">
          <form id="InstructForm" className="InstructForm">
            <label
              type="text"
              style={{
                fontWeight: "bold",
                marginTop: "10%",
                color: "white",
                padding: "10px",
              }}
            >
              Instructions
            </label>
            <textarea
              type="text"
              name="instructions"
              placeholder={
                props.userInstructions == null
                  ? "add instructions"
                  : props.userInstructions
              }
            ></textarea>
            <br></br>
            <button
              type="button"
              className="button-select"
              onClick={() => changeInstructions(props.userId, props.userName)}
              style={{
                marginBottom: "10%",
                fontSize: "99%",
                fontWeight: "bold",
              }}
            >
              UPDATE INSTRUCTIONS
            </button>
          </form>

          <div>
            <button
              type="button"
              className="button-select"
              onClick={() =>
                window === windows.WAITING
                  ? null
                  : setWindow(windows.REQUEST_RIDE)
              }
            >
              {window === windows.WAITING || window === windows.GETING_RIDE
                ? "RIDE REQUESTED"
                : "REQUEST RIDE"}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="button-select"
              onClick={() => {
                setWindow(windows.BILLS);
                console.log(bills);
                if (bills.length === 0) {
                  loadBills();
                }
              }}
            >
              VIEW BILLS
            </button>
          </div>
          <div>
            <button
              type="button"
              className="button-select"
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
      <ResponseForm
        passedrole="rider"
        reviewee={review_id}
        updateResponse={updateResponse}
      />
    </>
  );
}

export default RiderPage;
