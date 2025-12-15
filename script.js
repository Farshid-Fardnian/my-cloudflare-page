document.addEventListener("DOMContentLoaded", () => {



  console.log("همه چیز مرتب شد");



 
});

  document.getElementById("sendBtn").addEventListener("click", sendOtp);
  document.getElementById("verifyBtn").addEventListener("click", verifyOtp);


 function sendOtp() {
    const mobile = document.getElementById("mobile").value;

    const res = fetch("/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile })
    });

    const data = res.json();
    alert(data.message);

    if (data.success) {
      document.getElementById("mobile-box").style.display = "none";
      document.getElementById("otp-box").style.display = "block";
    }
  }

  function verifyOtp() {
    const mobile = document.getElementById("mobile").value;
    const otp = document.getElementById("otp").value;

    const res = fetch("/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp })
    });

    const data = res.json();
    alert(data.message);

    if (data.success) {
      alert("🎉 ورود موفق");
    }
  }



