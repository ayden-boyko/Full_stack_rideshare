import React, { useContext } from "react";
import { DataContext } from "../App";

function NavBar(props) {
  const { data, setData } = useContext(DataContext);
  const style = `navbar-${data.role}`;

  return (
    <>
      <div className={style}>
        <p className="navtext">{data.name}</p>
        <p className="navtext">Rating: {data.rating}</p>
        <button className="button-select" onClick={() => toggleForm()}>
          Account
        </button>
      </div>
      <AccountForm logData={props.logData} />
    </>
  );
}

function toggleForm() {
  let form = document.getElementById("myForm").style.display;
  form === "block"
    ? (document.getElementById("myForm").style.display = "none")
    : (document.getElementById("myForm").style.display = "block");
}

async function changeAccountStatus(role, id) {
  let submitLink = `http://127.0.0.1:5000/accountinfo/${role}/0/0/${id}/0`;
  console.log(role, id);

  const update_Account_Status = async () => {
    try {
      const response = await fetch(submitLink, {
        method: "DELETE",
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
  update_Account_Status();
}

async function updateLocation(role, id) {
  const form = document.getElementById("accountForm");
  const formacc = new FormData(form);

  let tempLoc = formacc.get("zipcode");

  let submitLink = `http://127.0.0.1:5000/account/${role}/${id}/${tempLoc}`;

  const update_Account_Location = async () => {
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
      console.log("success:", result);
      return result;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  update_Account_Location();
}

function AccountForm(props) {
  const { data, setData } = useContext(DataContext);
  return (
    <div className="form-popup" id="myForm">
      <form className="form-container" id="accountForm">
        <h1 style={{ color: "black" }}>Account Info</h1>

        <label type="text">
          <b style={{ color: "black" }}>Change Current Location</b>
        </label>

        <br></br>
        <input
          type="text"
          inputMode="numeric"
          placeholder={data.zipcode.toString()}
          name="zipcode"
          className="input-box"
          minLength="5"
          maxLength="5"
          required
        />
        <br></br>
        <button
          type="button"
          className="userbtn"
          onClick={() => updateLocation(data.role, data.id)}
        >
          Change
        </button>
        <br></br>
        <label type="text">
          <b style={{ color: "black" }}>Account</b>
        </label>
        <br></br>
        <button
          type="button"
          className={data.is_active ? "accounttoggleoff" : "accounttoggleon"}
          onClick={() => {
            changeAccountStatus(data.role, data.id);
            setData({ ...data, is_active: !data.is_active });
          }}
        >
          {data.is_active ? "Deactivate" : "Activate"}
        </button>
        <br></br>
        <label type="text">
          <b style={{ color: "black" }}>Change User</b>
        </label>
        <br></br>
        <button
          type="button"
          className="accounttoggleoff"
          onClick={() => setData(props.logData)}
        >
          Log Out
        </button>
      </form>
    </div>
  );
}

export default NavBar;
