const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

/* ======================
   OPTIONS (CORS Preflight)
====================== */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

/* ======================
   POST /send-otp
====================== */
export async function onRequestPost({ request, env }) {
  try {
    const { mobile } = await request.json();

    if (!mobile || !/^09\d{9}$/.test(mobile)) {
      return new Response(JSON.stringify({
        success: false,
        message: "شماره موبایل نامعتبر است"
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await env.OTP.put(mobile, otp, {
      expirationTtl: 120
    });

    const payload = {
      SmsBody: `<#> کد تایید شما: ${otp}`,
      Mobiles: [mobile],
      SmsNumber: "00985000281156"
    };

    const response = await fetch(
      "https://sms.parsgreen.ir/Apiv2/Message/SendSms",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `basic apikey:${env.ParsGreen_APIKey}`
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    if (!response.ok || result?.R_Success === false) {
      throw new Error(result?.R_Message || "SMS Provider Error");
    }

    return new Response(JSON.stringify({
      success: true,
      message: "کد تایید ارسال شد"
    }), {
      headers: corsHeaders
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

