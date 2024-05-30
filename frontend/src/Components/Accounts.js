import React, { useEffect, useState } from "react";

function Accounts(props) {
  let { userType } = props;
  let text = `http://localhost:5000/accountinfo/${userType}`;
  const [data, setData] = useState();
  useEffect(() => {
    // chnage to route to reference the supabse db
    const fetch_Info = async () => {
      const response = await fetch(text, {
        headers: { Accept: "application/json" },
      });
      const json = await response.json();
      if (response.ok) {
        let info = JSON.parse(JSON.stringify(json));
        setData(info);
      }
    };
    fetch_Info();
  }, []);

  const listUsers =
    data &&
    data[userType]?.map((person) => (
      <tr key={person[0]}>
        <th>{person[1]}</th>
        <th>
          <button className="item">SELECT</button>
        </th>
      </tr>
    ));
  return (
    <>
      <table style={{ width: "50%" }}>
        <tbody>
          <tr>
            <th>Users</th>
            <th>Select</th>
          </tr>
          {listUsers}
          <tr>
            <td colSpan="100%">
              <button className="item" onClick={() => openForm()}>
                Add New {userType}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <NewUserform />
    </>
  );
}

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function NewUserform() {
  return (
    <div className="form-popup" id="myForm">
      <form className="form-container">
        <h1 style={{ color: "black" }}>New User</h1>

        <label type="text">
          <b style={{ color: "black" }}>Name</b>
        </label>
        <br></br>
        <input type="text" placeholder="Enter Name" name="name" required />
        <br></br>

        <label type="date">
          <b style={{ color: "black" }}>Birthday</b>
        </label>
        <br></br>
        <input type="date" style={{ color: "grey" }} name="date" required />
        <br></br>

        <label type="location">
          <b style={{ color: "black" }}>ZipCode</b>
        </label>
        <br></br>
        <input
          type="text"
          placeholder="Enter Zipcode"
          name="location"
          required
        />
        <br></br>

        <button type="submit" className="btn">
          Login
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

export default Accounts;
