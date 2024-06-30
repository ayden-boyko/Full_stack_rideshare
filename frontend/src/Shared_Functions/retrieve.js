export async function fetch_Rides(submitLink) {
  try {
    const response = await fetch(submitLink, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });
    const result = await response.json();
    console.log("Success:", JSON.parse(JSON.stringify(result)));
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.log("Error:", error);
  }
}

export async function retrieveBills(role, id) {
  const submitLink =
    `http://127.0.0.1:5000/transaction/reciept/${role}/${id}/${Number.MAX_SAFE_INTEGER}` +
    (role == "rider" ? "/0" : "");
  try {
    const response = await fetch(submitLink, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });
    const result = await response.json();
    console.log("Success:", result);
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.log("Error:", error);
  }
}

export async function respond_to_review(role, review_id) {
  const form = document.getElementById("reviewForm");
  const formacc = new FormData(form);
  const review = formacc.get("review");
  if (review === "") {
    alert("Please enter a review");
    return;
  }
  console.log("review:", review);
  const submitLink = `http://127.0.0.1:5000/single${role}/post/${review_id}/${review}/0/good/00:00:00/no/0.0`;
  try {
    const response = await fetch(submitLink, {
      method: "PUT",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });
    const result = await response.json();
    console.log("Success:", result);
    /* upon success, get new list of past rides*/
    return review_id, review;
  } catch (error) {
    console.log("Error:", error);
  }
}

export function openForm() {
  document.getElementById("myReview").style.display = "block";
}

export function closeForm() {
  document.getElementById("myReview").style.display = "none";
}
