import React from "react";
import { closeForm, respond_to_review } from "../Shared_Functions/retrieve";

function ResponseForm(passedrole, reviewee, updateResponse) {
  return (
    <div className="review-form-popup" id="myReview">
      <form className="review-form-container" id="reviewForm">
        <h1 style={{ color: "black" }}>Response To Review</h1>
        <br></br>
        <textarea
          type="text"
          name="review"
          className="review-box"
          placeholder={"Add Review"}
          maxLength={100}
        ></textarea>
        <br></br>
        <button
          type="button"
          className="btn"
          onClick={() => {
            updateResponse(respond_to_review(passedrole, reviewee));
            closeForm();
          }}
        >
          Submit Review
        </button>
        <button
          type="button"
          className="btn cancel"
          onClick={() => closeForm()}
        >
          Close
        </button>
      </form>
    </div>
  );
}

export default ResponseForm;
