export async function onRequestGet(context) {
  try {
    const env = context.env;

    // موبایل ثابت (فعلاً)
    const mobile = "09171835602";

    // تولید OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ذخیره OTP در KV (۲ دقیقه)
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
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "basic apikey:" + env.ParsGreen_APIKey
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    console.log("ParsGreen SMS Result:", result);

    return new Response(
      JSON.stringify({
        success: true,
        message: "پیامک ارسال شد",
        otp_debug: otp, // ⚠️ فقط برای تست — بعداً حذف کن
        smsResult: result
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("SMS Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { status: 500 }
    );
  }
}
