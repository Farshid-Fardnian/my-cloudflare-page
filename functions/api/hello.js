export async function onRequest() {
  return new Response(
    JSON.stringify({ message: "سلام از Worker 👋" }),
    { headers: { "Content-Type": "application/json" } }
  );
}
