import React, { useState, useContext } from "react";
import { DataContext } from "../App";

function ChatBox(props) {
  const { rider_socket, driver } = props;
  const [chat, setUser] = useState([]);
  const { data, setData } = useContext(DataContext);

  async function message_Driver() {
    let message = document.getElementById("message_Driver").value;
    let recipient = driver.driver_SocketId;

    if (message === "") {
      alert("Please enter a message");
    } else {
      rider_socket.emit(
        "chat",
        JSON.stringify({
          sendee: recipient,
          message: message,
          sender: data.socketInstance.id,
          room: driver.room,
        })
      );
      setUser([...chat, { sender: "rider", message }]);
    }
  }

  chat.map((chat) => {
    let style =
      chat.sender === "rider"
        ? { jsutifyContent: "end" }
        : { justifyContent: "start" };
    return (
      <div>
        <p style={style}>{chat.message}</p>
      </div>
    );
  });

  return (
    <div className="rider-content-GettingRide" style={{ flexBasis: "30%" }}>
      <p>CHAT WITH {driver.driver_Name}</p>
      <div
        style={{
          height: "80%",
          border: "1px solid black",
          overflowY: "auto",
          overflowWrap: "break-word",
          padding: "10px",
        }}
      >
        {chat.length === 0 ? "No messages yet" : chat}
      </div>
      <input
        type="text"
        id="message_Driver"
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
