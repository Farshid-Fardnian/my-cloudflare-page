document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js loaded");

  fetch("/api/users")
    .then(res => res.json())
    .then(data => {
      console.log("Users:", data);
    })
    .catch(err => console.error(err));
});




document.getElementById("btn").addEventListener("click", () => {
  alert("دکمه کلیک شد!");
});






