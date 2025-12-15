import { corsHeaders } from "./cors";

export async function onRequestPost({ request, env }) {

  const headers = corsHeaders(request);

  // ✅ پاسخ به Preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { headers });
  }
  
  try {
    const { mobile } = await request.json();

    if (!mobile || !/^09\d{9}$/.test(mobile)) {
      return new Response(JSON.stringify({
        success: false,
        message: "شماره موبایل نامعتبر است"
      }), { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await env.OTP.put(mobile, otp, {
      expirationTtl: 120 // 2 دقیقه
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

    if (!response.ok) {
      throw new Error("SMS Provider Error");
    }

    return new Response(JSON.stringify({
      success: true,
      message: "کد تایید ارسال شد"
    }), { headers: { "Content-Type": "application/json" } });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), { status: 500 });
  }
}
