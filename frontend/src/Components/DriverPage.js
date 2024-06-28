import React, { useState, useEffect } from "react";
import { io, emit, send, of, to } from "socket.io-client";

const windows = Object.freeze({
  PAST_RIDES: Symbol("past_rides"),
  BILLS: Symbol("bills"),
  REQUEST_RIDER: Symbol("request_riders"),
  GIVING_RIDE: Symbol("giving_ride"),
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
  const [passengers, setPassengers] = useState([]);
  const [review_id, setReview_id] = useState(null); //review_id
  const [socketInstance, setSocketInstance] = useState();
  const socket = io("http://127.0.0.1:5000/driver", {
    transports: ["websocket"],
    cors: {
      origin: "http://localhost:3000/",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true,
    },
  });

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

    setSocketInstance(socket);

    socket.on("connect", (data) => {
      console.log("connected", data);
    });

    socket.on("connect_error", (error) => {
      if (socket.active) {
        console.log("trying to reconnect");
      } else {
        console.log(error.message);
      }
    });

    socket.on("disconnect", (data) => {
      console.log("disconnected", data);
    });
  }, [submitLink]);

  async function retrieveBills(id) {
    const submitLink = `http://127.0.0.1:5000/transaction/reciept/driver/${id}/${Number.MAX_SAFE_INTEGER}`;
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
  //USER RIDER 1,2,4,5,6
  async function selectRider(id, name, rider) {
    const submitLink = `http://127.0.0.1:5000/singledriver/${id}/${name}/${rider[1]}/0/${rider[5]}/${rider[6]}`;
    try {
      const response = await fetch(submitLink, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      });
      const result = await response.json();
      console.log("Success:", result); //use result to create room and add rider and driver to it
      setPassengers(...passengers, rider);
      socketInstance.emit("join", [
        userName,
        JSON.stringify(result[0]),
        result[1],
        rider[2],
      ]);

      setWindow(windows.GIVING_RIDE);
    } catch (error) {
      console.log("error:", error);
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

  async function respond_to_review() {
    const form = document.getElementById("reviewForm");
    const formacc = new FormData(form);
    const review = formacc.get("review");
    if (review === "") {
      alert("Please enter a review");
      return;
    }
    console.log("review:", review);
    const submitLink = `http://127.0.0.1:5000/singledriver/post/${review_id}/0/${review}/0/None/00:00:00/no/0.0`;
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
      /* upon success, get new list of past rides*/
      updateResponse(review_id, review);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  function ResponseForm() {
    return (
      <div className="review-form-popup" id="myReview">
        <form className="review-form-container" id="reviewForm">
          <h1 style={{ color: "black" }}>Response To Review</h1>
          <br></br>
          <textarea
            type="text"
            name="review"
            className="review-box"
            placeholder={"Add Review"}
            maxLength={100}
          ></textarea>
          <br></br>
          <button
            type="button"
            className="btn"
            onClick={() => {
              respond_to_review();
              closeForm();
            }}
          >
            Submit Review
          </button>
          <button
            type="button"
            className="btn cancel"
            onClick={() => closeForm()}
          >
            Close
          </button>
        </form>
      </div>
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

  function openForm() {
    document.getElementById("myReview").style.display = "block";
  }

  function closeForm() {
    document.getElementById("myReview").style.display = "none";
  }

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
            <button onClick={() => selectRider(userId, userName, person)}>
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
        return (
          <>
            <span>RIDE INFO</span>
            <br></br>
            <p>RIDER NAME: {passengers[2]}</p>
            <br></br>
            <p>RIDER RATING: {passengers[3]}</p>
            <br></br>
            <p>PICKUP LOCATION: {passengers[5]}</p>
            <br></br>
            <p>DESTINATION: {passengers[6]}</p>
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
              className="button-select"
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
      <ResponseForm />
    </>
  );
}

export default DriverPage;
