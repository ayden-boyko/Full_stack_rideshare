import React from "react";

function NavBar({
  userType,
  userId,
  userName,
  userRating,
  userLocation,
  userStatus,
  passedFunction,
  logData,
}) {
  const style = userType === "driver" ? "navbar-driver" : `navbar-${userType}`;
  return (
    <>
      <div className={style}>
        <p className="navtext">{userName}</p>
        <p className="navtext">Rating: {userRating}</p>
        <button className="button-select" onClick={() => toggleForm()}>
          Account
        </button>
      </div>
      <AccountForm
        accountRole={userType}
        accountId={userId}
        accountStatus={userStatus}
        accountLocation={userLocation}
        passedFunction={passedFunction}
        logData={logData}
      />
    </>
  );
}

function toggleForm() {
  let form = document.getElementById("myForm").style.display;
  if (form === "block") {
    document.getElementById("myForm").style.display = "none";
  } else {
    document.getElementById("myForm").style.display = "block";
  }
}

async function changeAccountStatus(accountRole, accountId) {
  let submitLink = `http://127.0.0.1:5000/accountinfo/${accountRole}/${accountId}`;

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
  update_Account_Status(); //doesnt work in the backend, flask isnt changing true to false and vise versa
}

async function updateLocation(accountRole, accountId) {
  const form = document.getElementById("accountForm");
  const formacc = new FormData(form);

  let tempLoc = formacc.get("zipcode");

  let submitLink = `http://127.0.0.1:5000/account/${accountRole}/${accountId}/${tempLoc}`;

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
  let {
    accountRole,
    accountId,
    accountStatus,
    accountLocation,
    passedFunction,
    logData,
  } = props;
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
          placeholder={accountLocation}
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
          onClick={() => updateLocation(accountRole, accountId)}
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
          className={accountStatus ? "accounttoggleoff" : "accounttoggleon"}
          onClick={() => changeAccountStatus(accountRole, accountId)}
        >
          {accountStatus ? "Deactivate" : "Activate"}
        </button>
        <br></br>
        <label type="text">
          <b style={{ color: "black" }}>Change User</b>
        </label>
        <br></br>
        <button
          type="button"
          className="accounttoggleoff"
          onClick={() => passedFunction(logData)}
        >
          Log Out
        </button>
      </form>
    </div>
  );
}

export default NavBar;
