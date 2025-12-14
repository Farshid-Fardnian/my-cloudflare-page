export async function onRequest(context) {
  const { request, env } = context;
  const { DB } = env;

  const url = new URL(request.url);
  const method = request.method;

  // GET → لیست کاربران یا یک کاربر
  if (method === "GET") {
    const id = url.searchParams.get("id");

    if (id) {
      const user = await DB
        .prepare("SELECT * FROM users WHERE id = ?")
        .bind(id)
        .first();

      return new Response(JSON.stringify(user), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const { results } = await DB
      .prepare("SELECT * FROM users ORDER BY id DESC")
      .all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // POST → ایجاد کاربر جدید
  if (method === "POST") {
    const body = await request.json();

    if (!body.name) {
      return new Response(
        JSON.stringify({ error: "name is required" }),
        { status: 400 }
      );
    }

    await DB
      .prepare(
        "INSERT INTO users (name, created_at) VALUES (?, datetime('now'))"
      )
      .bind(body.name)
      .run();

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // PUT → ویرایش کاربر
  if (method === "PUT") {
    const body = await request.json();

    if (!body.id || !body.name) {
      return new Response(
        JSON.stringify({ error: "id and name required" }),
        { status: 400 }
      );
    }

    await DB
      .prepare("UPDATE users SET name = ? WHERE id = ?")
      .bind(body.name, body.id)
      .run();

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // DELETE → حذف کاربر
  if (method === "DELETE") {
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "id required" }),
        { status: 400 }
      );
    }

    await DB
      .prepare("DELETE FROM users WHERE id = ?")
      .bind(id)
      .run();

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response("Method Not Allowed", { status: 405 });
}
