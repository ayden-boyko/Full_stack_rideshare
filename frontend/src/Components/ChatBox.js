import React, { useState, useContext } from "react";
import { DataContext } from "../App";

//drivers passenger
/*person[0] = current_rides_id 
    person[1] = current_passenger_id
    person[2] = passenger_name
    person[3] = passenger_rating
    person[4] = instructions
    person[5] = pickup
    person[6] = end
    person[7] = socket_sid
    person[8] = cost*/

function ChatBox(props) {
  const { user_socket, recipient } = props;
  const [chat, setUser] = useState([
    { sender: "rider", message: "hello" },
    { sender: "driver", message: "how are you" },
    { sender: "rider", message: "good" },
    { sender: "driver", message: "fine" },
    { sender: "rider", message: "thank you" },
    { sender: "driver", message: "bye" },
    { sender: "rider", message: "bye" },
    { sender: "driver", message: "bye" },
    { sender: "rider", message: "bye" },
  ]);
  const { data, setData } = useContext(DataContext);

  async function message_Driver() {
    let message = document.getElementById("message_Recipient").value;

    if (message === "") {
      alert("Please enter a message");
    } else {
      user_socket.emit(
        "chat",
        JSON.stringify({
          sendee:
            data.role === "driver" ? recipient[7] : recipient.driver_SocketId,
          message: message,
          sender: data.socketInstance.id,
          room: data.role === "driver" ? recipient[0] : recipient.room,
        })
      );
      setUser([...chat, { sender: data.role, message: message }]);
    }
  }

  let messages = chat.map((chat, index) => {
    let thing =
      data.role === chat.sender
        ? { textAlign: "right" }
        : { textAlign: "left" };
    return (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent:
            thing.textAlign === "right" ? "flex-end" : "flex-start",
        }}
      >
        <p
          style={{
            backgroundColor: chat.sender === "rider" ? "#98f1ff" : "#ffad8f",
            padding: "10px",
            borderRadius: "10px",
            maxWidth: "60%",
          }}
        >
          {chat.message}
        </p>
      </div>
    );
  });

  return (
    <div className="rider-content-GettingRide" style={{ flexBasis: "30%" }}>
      <p>
        CHAT WITH{" "}
        {data.role === "driver" ? recipient[2] : recipient.driver_Name}
      </p>
      <div
        style={{
          height: "80%",
          border: "1px solid black",
          overflowY: "auto",
          overflowWrap: "break-word",
          padding: "10px",
        }}
      >
        {chat.length === 0 ? "No messages yet" : messages}
      </div>
      <input
        type="text"
        id="message_Recipient"
        name="message"
        placeholder="Enter message"
        required
      ></input>
      <button type="submit" className="" onClick={(event) => event}>
        SEND
      </button>
    </div>
  );
}

export default ChatBox;
