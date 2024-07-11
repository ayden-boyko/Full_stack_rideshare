import React from "react";
import { closeForm } from "../Shared_Functions/retrieve";

function FinishRideForm(props) {
  if (props.passedRole === "driver") {
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
            defaultValue={"They were good"}
          ></textarea>
          <br></br>
          <input
            type="number"
            name="rating"
            id="finish_rating"
            className="review-box"
            placeholder={"Add Rating (1-5)"}
            maxLength="1"
            size={"1"}
            required={true}
            min={"1"}
            max={"5"}
          ></input>
          <br></br>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (
                document.getElementById("finish_rating").value > 5 ||
                document.getElementById("finish_rating").value < 1
              ) {
                alert("Rating must be between 1 and 5");
              } else {
                props.finishRide(
                  props.id,
                  props.reviewee[1],
                  document.getElementById("finish_rating").value,
                  document.getElementById("finish_review").value,
                  props.reviewee[8]
                );
                closeForm("finishRide");
              }
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
  } else {
    return (
      <div className="review-form-popup" id="finishRide">
        <form className="review-form-container" id="finishRide">
          <h1 style={{ color: "black" }}>Ride Finished, Review your Driver!</h1>
          <br></br>
          <textarea
            type="text"
            name="review"
            id="finish_review"
            className="review-box"
            placeholder={"Add Review"}
            maxLength={"100"}
            size={"100"}
            required={true}
            defaultValue={"They were good"}
          ></textarea>
          <br></br>
          <input
            type="number"
            name="rating"
            id="finish_rating"
            className="review-box"
            placeholder={"Add Rating (1-5)"}
            maxLength="1"
            size={"1"}
            required={true}
            min={"1"}
            max={"5"}
          ></input>
          <br></br>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (
                document.getElementById("finish_rating").value > 5 ||
                document.getElementById("finish_rating").value < 1
              ) {
                alert("Rating must be between 1 and 5");
              } else {
                props.finishRide(
                  props.id,
                  document.getElementById("finish_rating").value,
                  document.getElementById("finish_review").value
                );
                closeForm("finishRide");
              }
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
}

export default FinishRideForm;
