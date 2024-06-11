import React, { useState } from "react";

function DriverPage({
  userType,
  userId,
  userName,
  userRating,
  userInstructions,
  userLocation,
  userStatus,
}) {
  return (
    <>
      <div className=" account-page">
        <div className=" account-page-sidebar">
          <div>
            <button type="button">CARPOOL MODE</button>
          </div>
          <div>
            <button type="button">FIND RIDERS</button>
          </div>
          <div>
            <label>RIDE INFO</label>
            <br></br>
            <p>NONE</p>
          </div>
        </div>
        <div className=" account-page-main">
          <div>
            <p>yoyoyoyoyoy</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default DriverPage;
