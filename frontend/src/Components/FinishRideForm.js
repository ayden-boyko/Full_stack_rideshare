import React from "react";
import { closeForm, respond_to_review } from "../Shared_Functions/retrieve";

function FinishRideForm(props) {
  return (
    <div className="review-form-popup" id="finishRide">
      <form className="review-form-container" id="finishRide">
        <h1 style={{ color: "black" }}>Response To Review</h1>
        <br></br>
        <textarea
          type="text"
          name="review"
          id="finish_review"
          className="review-box"
          placeholder={"Add Review"}
          maxLength={"100"}
          size={"100"}
        ></textarea>
        <br></br>
        <input
          type="number"
          name="rating"
          id="finish_rating"
          className="review-box"
          placeholder={"Add Rating"}
          maxLength="3"
          size={"3"}
        ></input>
        <br></br>
        <button
          type="button"
          className="btn"
          onClick={() => {
            props.finishRide(
              props.driver_id,
              props.reviewee[1],
              document.getElementById("finish_rating").value,
              document.getElementById("finish_review").value,
              props.carpool,
              props.reviewee[8]
            );
            closeForm("finishRide");
          }}
        >
          Submit Review
        </button>
        <button
          type="button"
          className="btn cancel"
          onClick={() => closeForm("finishRide")}
        >
          Close
        </button>
      </form>
    </div>
  );
}

export default FinishRideForm;
