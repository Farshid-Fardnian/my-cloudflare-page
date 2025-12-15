document.addEventListener("DOMContentLoaded", () => {



  console.log("برو 2");



 
});


document.getElementById("sendOtp").addEventListener("click", () => {
  alert("دکمه کلیک شد!");
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
});



document.getElementById("verifyOtp").addEventListener("click", () => {
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
});

 



