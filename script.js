// document.addEventListener("DOMContentLoaded", () => {
  

//   // ارسال OTP
//   document.getElementById("sendOtp")?.addEventListener("click", async () => {
//     const mobile = document.getElementById("mobile").value;

//     const res = await fetch("/send-otp", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mobile })
//     });

//     const data = await res.json();
//     alert(data.message);

//     if (data.success) {
//       document.getElementById("mobile-box").style.display = "none";
//       document.getElementById("otp-box").style.display = "block";
//     }
//   });

//   // تایید OTP
//   document.getElementById("verifyOtp")?.addEventListener("click", async () => {
//     const mobile = document.getElementById("mobile").value;
//     const otp = document.getElementById("otp").value;

//     const res = await fetch("/verify-otp", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mobile, otp })
//     });

//     const data = await res.json();
//     alert(data.message);

//     if (data.success) {
//       alert("🎉 ورود موفق");
//     }
//   });

// });


let currentMobile = "";
let otpSent = false;
let countdownInterval;
let isVerifying = false;

/* ======================
   Mobile Validation
====================== */
function validateMobile(mobile) {
  mobile = mobile.replace(/\D/g, "");

  if (mobile.length === 10 && mobile.startsWith("9")) {
    return "0" + mobile;
  }
  if (mobile.length === 11 && mobile.startsWith("09")) {
    return mobile;
  }
  if (mobile.length === 13 && mobile.startsWith("989")) {
    return "0" + mobile.substring(2);
  }
  return null;
}

/* ======================
   Countdown
====================== */
function startCountdown(seconds) {
  const btn = document.getElementById("sendOtpBtn");
  let remaining = seconds;

  clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    btn.innerText = `ارسال مجدد (${remaining})`;
    btn.disabled = true;

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      btn.innerText = "ارسال مجدد کد";
      btn.disabled = false;
    }

    remaining--;
  }, 1000);
}

/* ======================
   Send OTP
====================== */

 document.getElementById("sendOtpBtn")?.addEventListener("click", async ()=> {
     const mobileInput = document.getElementById("mobile");
  const validatedMobile = validateMobile(mobileInput.value);

  if (!validatedMobile) {
    alert("شماره موبایل معتبر نیست");
    mobileInput.focus();
    return;
  }

  if (otpSent && currentMobile === validatedMobile) {
    alert("کد قبلاً ارسال شده است");
    return;
  }

  currentMobile = validatedMobile;
  mobileInput.disabled = true;

  try {
    const res = await fetch("/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: currentMobile })
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "خطا در ارسال OTP");
    }

    otpSent = true;

    document.getElementById("otpSection").style.display = "block";
    document.getElementById("verifyOtpBtn").style.display = "";
    document.getElementById("otpCode").focus();

    startCountdown(120);

    if ("OTPCredential" in window) {
      startWebOTP();
    }

  } catch (err) {
    alert(err.message);
    mobileInput.disabled = false;

 }
});


/* ======================
   Verify OTP
====================== */


document.getElementById("verifyOtpBtn")?.addEventListener("click", async ()=> {
        if (isVerifying) return;

  const otpInput = document.getElementById("otpCode");
  const otp = otpInput.value.trim();

  if (otp.length !== 6) {
    alert("کد OTP معتبر نیست");
    return;
  }

  isVerifying = true;

  try {
    const res = await fetch("/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mobile: currentMobile,
        otp
      })
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "کد اشتباه است");
    }

    alert("🎉 ورود موفق");

   

  } catch (err) {
    alert(err.message);
    otpInput.focus();
    otpInput.select();
  } finally {
    isVerifying = false;
  }


});


/* ======================
   Web OTP API
====================== */


/* ======================
   Events
====================== */






