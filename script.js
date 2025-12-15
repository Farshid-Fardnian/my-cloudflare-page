document.addEventListener("DOMContentLoaded", () => {
  

  // ارسال OTP
  document.getElementById("sendOtp")?.addEventListener("click", async () => {
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
  });

  // تایید OTP
  document.getElementById("verifyOtp")?.addEventListener("click", async () => {
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
  });

});

