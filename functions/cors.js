export function corsHeaders(request) {
  const origin = request.headers.get("Origin");

  const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://farshid5602.ir"
  ];

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}
