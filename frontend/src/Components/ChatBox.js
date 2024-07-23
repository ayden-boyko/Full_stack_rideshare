import React, { useState, useContext, useEffect } from "react";
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
  const [chat, setChat] = useState([]);
  const { data } = useContext(DataContext);

  async function message_Driver() {
    let message = document.getElementById("message_Recipient").value;

    if (message === "") {
      alert("Please enter a message");
    } else {
      try {
        user_socket.emit(
          "chat",
          JSON.stringify({
            sendee:
              data.role === "driver" ? recipient[7] : recipient.driver_SocketId,
            message: message,
            sender: data.role,
            // room: data.role === "driver" ? recipient[0] : recipient.room,
          })
        );
        setChat([...chat, { sender: data.role, message: message }]);
        document.getElementById("message_Recipient").value = "";
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    user_socket.on("chat", (data) =>
      setChat([...chat, { sender: data.sender, message: data.message }])
    );
  }, [chat, user_socket]);

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
        Chat With{" "}
        {data.role === "driver" ? recipient[2] : recipient.driver_Name}
      </p>
      <div
        style={{
          height: "75%",
          border: "1px solid black",
          overflowY: "auto",
          overflowWrap: "break-word",
          padding: "10px",
        }}
      >
        {chat.length === 0 ? "No messages yet" : messages}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "10px",
          gap: "10px",
        }}
      >
        <input
          type="text"
          id="message_Recipient"
          name="message"
          placeholder="Enter message"
          className="input-box-chat"
          required
        ></input>
        <button
          type="submit"
          className="button-select"
          onClick={() => message_Driver()}
        >
          SEND
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
