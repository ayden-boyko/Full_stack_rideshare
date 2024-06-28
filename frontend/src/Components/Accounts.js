import React, { useEffect, useState } from "react";

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
  func({
    role: submitRole,
    id: id,
    name: userInfo[1],
    date: userInfo[4],
    rating: userInfo[2],
    instructions: userInfo[3],
    zipcode: 12345, //setup location enetering upon account creation
    is_active: userInfo[5],
    carpool: userInfo[6],
  });
}

async function submitUser(props) {
  let { userType } = props;
  let submitRole = String(userType).slice(0, -1);

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
    zipcode: null,
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

function Accounts(props) {
  let { userType } = props;
  let text = `http://127.0.0.1:5000/accountinfo/${userType}`;
  const [user, setUser] = useState();

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

  const listUsers =
    user &&
    user[userType]?.map((person) => (
      <tr key={person[0]} className={`account-option-${userType}`}>
        <td
          onClick={() => selectUser(userType, person[0], props.passedFunction)}
          onMouseOver={() => console.log(`account-option-${userType}`)}
        >
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
                Add New {userType}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <NewUserform userType={userType} passedFunction={props.passedFunction} />
    </>
  );
}

export default Accounts;
