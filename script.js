document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js loaded");

  
});




document.getElementById("btn").addEventListener("click", () => {
 fetch("/api/users")
    .then(res => res.json())
    .then(data => {
      console.log("Users:", data);
    })
    .catch(err => console.error(err));
});







