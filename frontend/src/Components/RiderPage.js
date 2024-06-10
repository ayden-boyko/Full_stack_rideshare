import React, { useEffect, useState } from "react";

function RiderPage({
  userType,
  userId,
  userName,
  userRating,
  userInstructions,
  userLocation,
  userStatus,
  passedFunction,
  logData,
}) {
  return (
    <>
      <div className=" account-page">
        <div className=" account-page-sidebar">
          <div>
            <label type="text">Instructions</label>
            <input
              type="text"
              placeholder={
                userInstructions == null ? "add instructions" : userInstructions
              }
            ></input>
            <button type="button">UPDATE</button>
          </div>
          <div>
            <button type="button">REQUEST RIDE</button>
          </div>
          <div>
            <button type="button">VIEW BILLS</button>
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

export default RiderPage;
