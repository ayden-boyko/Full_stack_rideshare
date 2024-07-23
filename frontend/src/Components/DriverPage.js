import React, { useState, useEffect, useRef, useContext } from "react";
import { io, emit, send, of, to } from "socket.io-client";
import {
  fetch_Rides,
  retrieveBills,
  openForm,
  cancel_Ride,
  formatTimestamp,
} from "../Shared_Functions/retrieve";
import { DataContext } from "../App";
import ResponseForm from "./ResponseForm";
import FinishRideForm from "./FinishRideForm";
import ChatBox from "./ChatBox";
import windows from "../Types/WindowStates";

function DriverPage() {
  const [window, setWindow] = useState(windows.PAST_RIDES);
  const [rides, setRides] = useState([]);
  const [bills, setBills] = useState([]);
  const [riders, setRiders] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [reviewee, setReviewee] = useState(null); //review_id
  const socketInstance = useRef(null);
  const { data, setData } = useContext(DataContext);

  const submitLink = `https://full-stack-rideshare.vercel.app/api/rideinfo/driver/${data.id}/ignore/${data.name}`;

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
      const socket = io("https://full-stack-rideshare.vercel.app/api/driver", {
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
    let tempLink = `https://full-stack-rideshare.vercel.app/api/singledriver/${id}/${name}/${rider[1]}/0/${rider[5]}/${rider[6]}`;
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
      //console.log("Select Rider Success:", result); //use result to create room and add rider and driver to it
      //console.log(result[1]);
      rider.push(result[1]); // adds cost to passengers
      setPassengers(...passengers, [rider]);
      socketInstance.current.emit("join", [
        data.name,
        JSON.stringify(result[0]),
        // result[1],
        // rider[2],
      ]);
      console.log("sendee", JSON.stringify(result[0][1]));
      socketInstance.current.emit(
        "message",
        JSON.stringify({
          sendee: result[0][1],
          string: "hello, have I connected?",
          sender: data.name,
          driver_id: data.id,
          rating: data.rating,
          sender_id: socketInstance.current.id,
          cost: result[1],
          room: JSON.stringify(result[0][0]),
        })
      );

      setWindow(windows.GIVING_RIDE);
      sessionStorage.setItem("status", "chauffeuring");
    } catch (error) {
      console.log("error:", error);
    }
  }

  async function retrieveRiders() {
    let tempLink = `https://full-stack-rideshare.vercel.app/api/singledriver/pre`;
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

  async function finishRide(
    driver_id,
    rider_id,
    rating,
    review_of_rider,
    cost
  ) {
    let tempLink = `https://full-stack-rideshare.vercel.app/api/singledriver/post/${driver_id}/${rider_id}/0/${rating}/${review_of_rider}/${cost}`;
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
      console.log("Finish Success:", result);

      let passenger = passengers.filter((passenger) => {
        return passenger[1] === rider_id;
      });

      socketInstance.current.emit(
        "finish",
        JSON.stringify({
          sendee: passenger[0],
          string: "The ride has ended",
          sender: data.name,
          driver_id: data.id,
          rating: data.rating,
          sender_id: socketInstance.current.id,
        })
      );

      passenger = passengers.filter((passenger) => {
        return passenger[1] !== rider_id;
      });

      setPassengers(passenger);
      setWindow(windows.PAST_RIDES);
      sessionStorage.setItem("status", "none");
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async function remove_Rider(role, rider) {
    cancel_Ride(role, rider[1], rider[2]);
    let thingy = passengers.filter((passenger) => passenger[1] !== rider[1]);
    sessionStorage.setItem("status", "waiting");
    setPassengers(thingy);
    if (thingy.length === 0) {
      setWindow(windows.PAST_RIDES);
    }
    let passenger = passengers.filter((passenger) => {
      return passenger[1] === rider[1];
    });
    socketInstance.current.emit(
      "canceled",
      JSON.stringify({
        sendee: passenger[0][7],
        string: "The ride has been canceled",
        sender: data.name,
        driver_id: data.id,
        rating: data.rating,
        sender_id: socketInstance.current.id,
      })
    );
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
          <td>{formatTimestamp(person[8])}</td>
          <td>{person[9]}</td>
          <td>{person[10]}</td>
          <td>{person[11]}</td>
          <td>{person[12]}</td>

          <td>{person[13] === null ? "No Response Yet" : person[13]}</td>
          {/*Riders response*/}
          <td>
            {person[14] === null ? (
              <button
                onClick={() => {
                  openForm("myReview");
                  setReviewee(person[0]);
                }}
                className="button-select"
                style={{
                  width: "fit-content",
                  fontSize: ".8rem",
                  padding: "8px 15px",
                }}
              >
                Respond
              </button>
            ) : (
              person[14]
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
          <td>{person[1]}$</td>
          <td>{formatTimestamp(person[2])}</td>
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

  /** conditionally renders either
   * 1. past rides, in order to allow user to coment on them.
   * 2. bills, ie cost of said rides.
   * 3. the select rider window.
   * 4. the finish ride window.*/

  const renderWindow = () => {
    switch (window) {
      case windows.PAST_RIDES:
        return (
          <table className="infotable">
            <caption
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "20px",
                padding: "10px",
              }}
            >
              Past Rides
            </caption>
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
              <caption
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "20px",
                  padding: "10px",
                }}
              >
                Bills
              </caption>
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
              <caption
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "20px",
                  padding: "10px",
                }}
              >
                Bills
              </caption>
              <tbody>
                <tr>
                  <th>Rider</th>
                  <th>Cost</th>
                  <th>Time</th>
                </tr>
                <tr>
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
            <caption
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "20px",
                padding: "10px",
              }}
            >
              Request Rider
            </caption>
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

      /*person[0] = current_rides_id 
    person[1] = current_passenger_id
    person[2] = passenger_name
    person[3] = passenger_rating
    person[4] = instructions
    person[5] = pickup
    person[6] = end
    person[7] = socket_sid
    person[8] = cost*/
      case windows.GIVING_RIDE:
        //Change info table to be more detailed
        console.log(passengers[0]);
        return (
          <div className="ride-Info-Page-GettingRide">
            <div className="ride-Info-Page-content-GettingRide">
              <div
                className="rider-content-GettingRide"
                style={{ flexBasis: "49%" }}
              >
                <b className="ride-Info-Page-title-GettingRide">RIDE INFO</b>
                <p>RIDER NAME: {passengers[0][2]}</p>
                <p>RIDER RATING: {passengers[0][3]}</p>
                <p>START: {passengers[0][5]}</p>
                <p>DESTINATION: {passengers[0][6]}</p>
                <p>COST: {passengers[0][8]}$</p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    placeContent: "start",
                    justifyContent: "flex-end",
                    height: "48%",
                  }}
                >
                  <button
                    onClick={() => {
                      setReviewee(passengers[0]);
                      openForm("finishRide");
                      socketInstance.current.emit("leave", [
                        data.name,
                        passengers[0][0],
                      ]);
                    }}
                    className="button-select"
                  >
                    FINISH
                  </button>
                  <button
                    onClick={() => {
                      remove_Rider("driver", passengers[0]);
                      socketInstance.current.emit("disconnect", [
                        data.name,
                        passengers[0][0],
                      ]);
                    }}
                    className="button-select"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
              <ChatBox
                user_socket={socketInstance.current}
                recipient={passengers[0]}
              />
            </div>
          </div>
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
            <button
              type="button"
              className="button-select"
              name="get_riders"
              onClick={() => {
                if (
                  document.getElementById("myForm").style.display == "block"
                ) {
                  document.getElementById("myForm").style.display = "none";
                }
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
                if (
                  document.getElementById("myForm").style.display == "block"
                ) {
                  document.getElementById("myForm").style.display = "none";
                }
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
                if (
                  document.getElementById("myForm").style.display == "block"
                ) {
                  document.getElementById("myForm").style.display = "none";
                }
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
        reviewee={reviewee}
        updateResponse={updateResponse}
      />
      <FinishRideForm
        passedRole="driver"
        id={data.id}
        reviewee={reviewee}
        finishRide={finishRide}
        setWindow={setWindow}
      />
    </>
  );
}

export default DriverPage;
