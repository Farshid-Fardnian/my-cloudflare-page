export async function onRequest(context) {
  const { DB } = context.env;

  const { results } = await DB
    .prepare("SELECT * FROM users")
    .all();

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" }
  });
}
