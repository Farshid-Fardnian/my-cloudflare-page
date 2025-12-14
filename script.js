document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js loaded");

  
});




document.getElementById("btn").addEventListener("click", () => {
 fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "صادق" })
});

});








