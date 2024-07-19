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
    (role === "rider" ? "/0" : "");
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

  const submitLink =
    role === "rider"
      ? `http://127.0.0.1:5000/singlerider/post/${review_id}/${review}/0/0`
      : `http://127.0.0.1:5000/singledriver/post/${review_id}/0/${review}/0/0/0`;
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
    return { review_id, review };
  } catch (error) {
    console.log("Error:", error);
  }
}

export async function cancel_Ride(role, rider_id, rider_name) {
  const submitLink =
    role === "rider"
      ? `http://localhost:5000/singlerider/${rider_id}/${rider_name}/0/0/0`
      : `http://localhost:5000/singledriver/0/0/${rider_id}/0/0/0`;
  try {
    const response = await fetch(submitLink, {
      method: "DELETE",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });
    const result = await response.json();
    console.log("Success:", result);
    return result;
  } catch (error) {
    console.log("Error:", error);
  }
}

export function openForm(id) {
  document.getElementById(id).style.display = "block";
}

export function closeForm(id) {
  document.getElementById(id).style.display = "none";
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "long" });
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedDate = `${day}-${month} ${hours}:${minutes}`;

  return formattedDate;
}
