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
      <li key={person[0]}>
        <p>{person[1]}</p>
      </li>
    ));
  return <ul>{listUsers}</ul>;
}

export default Accounts;
