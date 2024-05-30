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
    <table style={{ width: "50%" }}>
      <tbody>
        <tr>
          <th>Users</th>
          <th>Select</th>
        </tr>
        {listUsers}
      </tbody>
    </table>
  );
}

export default Accounts;
