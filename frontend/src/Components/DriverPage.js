import React, { useState, useEffect, useRef, useContext } from "react";
import { io, emit, send, of, to } from "socket.io-client";
import {
  fetch_Rides,
  retrieveBills,
  openForm,
} from "../Shared_Functions/retrieve";
import { DataContext } from "../App";
import ResponseForm from "./ResponseForm";

const windows = Object.freeze({
  PAST_RIDES: Symbol("past_rides"),
  BILLS: Symbol("bills"),
  REQUEST_RIDER: Symbol("request_riders"),
  GIVING_RIDE: Symbol("giving_ride"),
});

function DriverPage() {
  const [window, setWindow] = useState(windows.PAST_RIDES);
  const [rides, setRides] = useState([]);
  const [bills, setBills] = useState([]);
  const [riders, setRiders] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [review_id, setReview_id] = useState(null); //review_id
  const socketInstance = useRef(null);
  const { data, setData } = useContext(DataContext);

  const submitLink = `http://127.0.0.1:5000/rideinfo/driver/${data.id}/ignore/${data.name}`;

  const loadData = async () => {
    setRides(await fetch_Rides(submitLink));
  };

  const loadBills = async () => {
    setBills(await retrieveBills("driver", data.id));
  };

  //SHOULD RETRIEVE PAST RIDES GIVEN NOT TAKEN
  useEffect(() => {
    loadData();

    if (sessionStorage.getItem("status") === "chauffeuring") {
      setWindow(windows.GIVING_RIDE);
    }

    if (socketInstance.current === null) {
      const socket = io("http://127.0.0.1:5000/driver", {
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
      socketInstance.current = socket;
    }

    socketInstance.current.on("connect", (data) => {
      console.log("connected", data);
    });

    socketInstance.current.on("recieved", (data) => {
      console.log("matched:", data);
    });

    socketInstance.current.on("connect_error", (error) => {
      if (socketInstance.current.active) {
        console.log("trying to reconnect");
      } else {
        console.log(error.message);
      }
    });

    socketInstance.current.on("disconnect", (data) => {
      console.log("disconnected", data);
    });
  }, [window, socketInstance.current]);

  //USER RIDER 1,2,4,5,6
  async function selectRider(id, name, rider) {
    let tempLink = `http://127.0.0.1:5000/singledriver/${id}/${name}/${rider[1]}/0/${rider[5]}/${rider[6]}`;
    try {
      const response = await fetch(tempLink, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      });
      const result = await response.json();
      console.log("Select Rider Success:", result); //use result to create room and add rider and driver to it
      setPassengers(...passengers, [rider]);
      socketInstance.current.emit("join", [
        data.name,
        JSON.stringify(result[0]),
        result[1],
        rider[2],
      ]);
      socketInstance.current.emit(
        "message",
        JSON.stringify({
          sendee: result[1],
          string: "hello, have I connected?",
          sender: data.name,
          driver_id: data.id,
          rating: data.rating,
          sender_id: socketInstance.current.id,
        })
      );

      setWindow(windows.GIVING_RIDE);
      sessionStorage.setItem("status", "chauffeuring");
    } catch (error) {
      console.log("error:", error);
    }
  }

  async function retrieveRiders() {
    let tempLink = `http://127.0.0.1:5000/singledriver/pre`;
    try {
      const response = await fetch(tempLink, {
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

  const listPastRides = rides?.map((person) => {
    if (person !== null) {
      return (
        <tr key={person[0]}>
          <td>{person[2]}</td>
          <td>{person[4]}</td>
          <td>{person[5] == null ? "None" : person[5]}</td>
          <td>{person[6]}</td>
          <td>{person[7]}</td>
          <td>{person[8]}</td>
          <td>{person[9]}</td>
          <td>{person[10]}</td>
          <td>{person[11]}</td>
          <td>{person[12]}</td>

          <td>{person[14] === null ? "No Response Yet" : person[14]}</td>
          {/*Riders response*/}
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
          {/*Drivers response*/}
        </tr>
      );
    } else {
      return <tr>NO PAST RIDES YET</tr>;
    }
  });
  const listBills = bills?.map((person, index) => {
    if (person !== null) {
      return (
        <tr key={index}>
          <td>{person[0]}</td>
          <td>{person[1]}</td>
          <td>{person[2]}</td>
        </tr>
      );
    } else {
      return (
        <tr key={1}>
          <td>None</td>
          <td>None</td>
          <td>None</td>
        </tr>
      );
    }
  });
  const listRiders = riders?.map((person, index) => {
    if (person) {
      return (
        <tr key={index}>
          <td>{person[1]}</td>
          <td>{person[2]}</td>
          <td>{person[3]}</td>
          <td>{person[4]}</td>
          <td>{person[5]}</td>
          <td>{person[6]}</td>
          <td>
            <button onClick={() => selectRider(data.id, data.name, person)}>
              SELECT
            </button>
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={1}>
          <td>None</td>
          <td>None</td>
          <td>None</td>
          <td>None</td>
          <td>None</td>
          <td>None</td>
          <td>None</td>
        </tr>
      );
    }
  });

  const listPassengers = passengers?.map((person, index) => {
    return (
      <tr key={index}>
        <td>{person[2]}</td>
        <td>{person[3]}</td>
        <td>{person[5]}</td>
        <td>{person[6]}</td>
        <td>IMPLEMENT COST</td>
        <td>
          <button>FINISH</button>
        </td>
      </tr>
    );
  });
  /** conditionally renders either
   * 1. past rides, in order to allow user to coment on them.
   * 2. bills, ie cost of said rides.
   * 3.the request ride window. */

  const renderWindow = () => {
    switch (window) {
      case windows.PAST_RIDES:
        return (
          <table className="infotable">
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
                <th>Rider's Response</th>
                <th>Driver's Response</th>
              </tr>
              {listPastRides}
            </tbody>
          </table>
        );
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
      case windows.REQUEST_RIDER:
        return (
          <table className="infotable">
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
      case windows.GIVING_RIDE:
        //Change info table to be more detailed
        return (
          <table className="infotable">
            <tbody>
              <tr>
                <th colSpan={"100%"}>RIDE INFO</th>
              </tr>
              <tr>
                <th>RIDER NAME</th>
                <th>RIDER RATING</th>
                <th>PICKUP</th>
                <th>DESTINATION</th>
                <th>COST</th>
                <th>STATUS</th>
              </tr>
              {listPassengers}
            </tbody>
          </table>
        );
      default:
        return <h1>SOMETHINGS WRONG...</h1>;
    }
  };

  return (
    <>
      <div className=" account-page">
        <div className=" account-page-sidebar-driver">
          <div>
            <button type="button" className="button-select" onClick={() => 0}>
              CARPOOL
            </button>
          </div>
          <div>
            <button
              type="button"
              className="button-select"
              name="get_riders"
              onClick={() => {
                if (passengers.length == 0) {
                  setWindow(windows.REQUEST_RIDER);
                  retrieveRiders();
                }
              }}
            >
              {passengers.length == 0 ? "REQUEST RIDER" : "GIVING RIDE"}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="button-select"
              name="get_bills"
              onClick={() => {
                setWindow(windows.BILLS);
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
              name="get_past_rides "
              onClick={() => {
                setWindow(windows.PAST_RIDES);
              }}
            >
              VIEW PAST RIDES GIVEN
            </button>
          </div>
        </div>
        <div className=" account-page-main">
          <div>{renderWindow()}</div>
        </div>
      </div>
      <ResponseForm
        passedrole="driver"
        reviewee={review_id}
        updateResponse={updateResponse}
      />
    </>
  );
}

export default DriverPage;
