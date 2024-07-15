import React, { useState, useContext } from "react";
import { DataContext } from "../App";

function ChatBox(props) {
  const { rider_socket, recipient } = props;
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
      rider_socket.emit(
        "chat",
        JSON.stringify({
          sendee: recipient.driver_SocketId,
          message: message,
          sender: data.socketInstance.id,
          room: recipient.room,
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
      <p>CHAT WITH {recipient.driver_Name}</p>
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
