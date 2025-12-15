export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const mobile = "09171835602"; // مثال: "09171835602"

    if (!mobile) {
      return new Response(JSON.stringify({
        success: false,
        message: "شماره موبایل ارسال نشده"
      }), { status: 400 });
    }

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
      'https://sms.parsgreen.ir/Apiv2/Message/SendSms',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'basic apikey:' + env.ParsGreen_APIKey
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    return new Response(JSON.stringify({
      success: true,
      smsResult: result
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.toString()
    }), { status: 500 });
  }
}
