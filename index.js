/* NOTE The Document method querySelector() returns the first Element within the document that matches 
the specified selector, or group of selectors. If no matches are found, null is returned. */
const sign_in_btn = document.querySelector("#click-here-btn");
const sign_up_btn = document.querySelector("#learn-more-btn");
const container = document.querySelector(".container");

/* NOTE addEventListener() is an inbuilt function in JavaScript which takes the event to listen for */
sign_up_btn.addEventListener("click", () => {
  container.classList.add("shift-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("shift-mode");
});
