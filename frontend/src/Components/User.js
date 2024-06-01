import React from "react";

function User(props) {
  let { type, event } = props;

  return (
    <button type="button" className="item" onClick={event}>
      {type}
    </button>
  );
}

export default User;
