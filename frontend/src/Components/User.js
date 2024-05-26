import React, { useState, useEffect } from "react";

function User(props) {
  let { role } = props;
  return (
    <button type="button" className="item">
      {role}
    </button>
  );
}

export default User;
