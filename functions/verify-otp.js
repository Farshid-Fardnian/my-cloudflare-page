export async function onRequestPost({ request, env }) {
  try {
    const { mobile, otp } = await request.json();

    if (!mobile || !otp) {
      return new Response(JSON.stringify({
        success: false,
        message: "اطلاعات ناقص است"
      }), { status: 400 });
    }

    const savedOtp = await env.OTP.get(mobile);

    if (!savedOtp) {
      return new Response(JSON.stringify({
        success: false,
        message: "کد منقضی شده یا وجود ندارد"
      }), { status: 400 });
    }

    if (savedOtp !== otp) {
      return new Response(JSON.stringify({
        success: false,
        message: "کد تایید نادرست است"
      }), { status: 401 });
    }

    // حذف OTP بعد از موفقیت
    await env.OTP.delete(mobile);

    return new Response(JSON.stringify({
      success: true,
      message: "احراز هویت موفق"
    }), { headers: { "Content-Type": "application/json" } });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), { status: 500 });
  }
}
