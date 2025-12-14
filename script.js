document.getElementById("btn").addEventListener("click", () => {
  alert("دکمه کلیک شد!");
});

// تست GET
fetch("/api/users")
  .then(res => res.json())
  .then(data => {
    console.log("Users:", data);
  });

// تست POST
fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "فرشید" })
});


