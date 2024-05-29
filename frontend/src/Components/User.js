import React from "react";

function User(props) {
  let { role, event } = props;

  return (
    <button type="button" className="item" onClick={event}>
      {role}
    </button>
  );
}

export default User;
