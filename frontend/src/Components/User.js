import React, { useState, useEffect } from "react";

function User(props) {
  let { role } = props;
  return (
    <div class=" border-4 rounded-md border-black">
      <h1 class=" text-blue-300">{role}</h1>
    </div>
  );
}

export default User;
