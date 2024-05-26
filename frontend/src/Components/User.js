import React, { useState, useEffect } from "react";

function User(props) {
  let { role } = props;
  return (
    <div className=" border-4 rounded-md border-black">
      <h1>{role}</h1>
    </div>
  );
}

export default User;
