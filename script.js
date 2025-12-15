document.addEventListener("DOMContentLoaded", () => {

  const sendBtn = document.getElementById("sendBtn");
  const verifyBtn = document.getElementById("verifyBtn");

  console.log("همه چیز OK");

  sendBtn.addEventListener("click", sendOtp);
  verifyBtn.addEventListener("click", verifyOtp);

  function sendOtp() {
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

  function verifyOtp() {
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
      alert("🎉 ورود موفق");
    }
  }

});

