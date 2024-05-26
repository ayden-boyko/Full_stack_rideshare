import React, { useState, useEffect } from "react";

function User(props) {
  let { role } = props;
  return (
    <div>
      <h1>{role}</h1>
    </div>
  );
}

export default User;
