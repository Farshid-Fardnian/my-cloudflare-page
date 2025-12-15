document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js loaded");

  
});




// document.getElementById("btn").addEventListener("click", () => {
//  fetch("/api/users", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ name: "صادق" })
// });

// });


async function sendOtp() {
  const mobile = document.getElementById("mobile").value;

  const res = await fetch("/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile })
  });

  const data = await res.json();
  alert(data.message);

  if (data.success) {
    document.getElementById("mobile-box").style.display = "none";
    document.getElementById("otp-box").style.display = "block";
  }
}

async function verifyOtp() {
  const mobile = document.getElementById("mobile").value;
  const otp = document.getElementById("otp").value;

  const res = await fetch("/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, otp })
  });

  const data = await res.json();
  alert(data.message);

  if (data.success) {
    alert("🎉 ورود موفق!");
    // redirect or set cookie
  }
}






