  export async function onRequestPost() {
  async fetch(request, env) {
    const  mobile = ["09171835602"];

     // تولید OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // ذخیره در KV (۲ دقیقه)
  await context.env.OTP.put(mobile, otp, {
    expirationTtl: 120
  });

    
    const url = 'https://sms.parsgreen.ir/Apiv2/Message/SendSms';

    const apiKey = context.env.ParsGreen_APIKey; // بهتر است در env بگذاری

    const payload = {
      SmsBody: `<#> کد تایید شما: ${otp}`,
      Mobiles: mobile,
      SmsNumber: "00985000281156"
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'basic apikey:' + apiKey
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.toString()
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
