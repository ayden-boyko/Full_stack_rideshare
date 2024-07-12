import React, { useEffect, useState, useContext } from "react";
import { DataContext } from "../App";

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

async function selectUser(userType, id, func) {
  let submitRole = String(userType).slice(0, -1);
  let submitLink = `http://127.0.0.1:5000/accountinfo/${submitRole}/none/0/${id}/none`;

  const getUser = async () => {
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
      return result;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const userInfo = await getUser();
  let zip = submitRole == "rider" ? userInfo[6] : userInfo[5];
  let active = submitRole == "rider" ? userInfo[5] : userInfo[6];
  func({
    role: submitRole,
    id: id,
    name: userInfo[1],
    date: userInfo[4],
    rating: userInfo[2],
    instructions: userInfo[3],
    zipcode: zip, //wierd crap with the way i was storing rider and drivers zipcode
    is_active: active,
    carpool: false,
  });
}

async function submitUser(props) {
  let submitRole = String(props.userType).slice(0, -1);

  const form = document.getElementById("userForm");
  const formuser = new FormData(form);

  let tempDate = formuser.get("date").split("-");

  const name = formuser.get("name");
  const date = tempDate[1] + "-" + tempDate[2] + "-" + tempDate[0]; //reformat to mm-dd-yyyy

  let submitLink = `http://127.0.0.1:5000/accountinfo/${submitRole}/${name}/${date}/1/None`;

  const post_Info = async () => {
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
      console.log("success:", result);
      return result;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  let id = await post_Info();
  console.log("\nid:", id);
  //changes data from app to user that has just been created, this assums that when a user creates an account they want to select it
  props.passedFunction({
    role: submitRole,
    id: id,
    name: name,
    date: date,
    rating: 4,
    instructions: null,
    zipcode: 12345,
    is_active: true,
    carpool: false,
  });
}

function NewUserform(props) {
  return (
    <div className="form-popup" id="myForm">
      <form className="form-container" id="userForm">
        <h1 style={{ color: "black" }}>New User</h1>

        <label type="text">
          <b style={{ color: "black" }}>Name</b>
        </label>
        <br></br>
        <input
          type="text"
          placeholder="Enter Name"
          name="name"
          className="input-box"
          required
        />
        <br></br>

        <label type="date">
          <b style={{ color: "black" }}>Birthday</b>
        </label>
        <br></br>
        <input
          type="date"
          style={{ color: "grey" }}
          name="date"
          className="input-box"
          required
        />
        <br></br>

        <button
          type="button"
          className="btn"
          onClick={() => {
            submitUser(props);
            closeForm();
          }}
        >
          Add
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

function Accounts() {
  const [user, setUser] = useState(null);
  const { data, setData } = useContext(DataContext);
  let text = `http://127.0.0.1:5000/accountinfo/${data.role}`;
  useEffect(() => {
    const fetch_Info = async () => {
      const response = await fetch(text, {
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (response.ok) {
        let info = JSON.parse(JSON.stringify(json));
        setUser(info);
      }
    };
    fetch_Info();
  }, []);
  let role = String(data.role).slice(0, -1);
  const listUsers =
    user &&
    user[data.role]?.map((person) => (
      <tr key={person[0]} className={`account-option-${data.role}`}>
        <td onClick={() => selectUser(data.role, person[0], setData)}>
          {person[1]}
        </td>
      </tr>
    ));
  return (
    <>
      <table className="account-table">
        <tbody>
          <tr>
            <th colSpan="100%" style={{ color: "black" }}>
              Users
            </th>
          </tr>
          {listUsers}
          <tr>
            <td colSpan="100%">
              <button className="button-select" onClick={() => openForm()}>
                Add New {role}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <NewUserform userType={data.role} passedFunction={setData} />
    </>
  );
}

export default Accounts;
