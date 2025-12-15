export async function onRequestPost({ request, env }) {
  // === تنظیمات ===
  const API_KEY = 'MY_SECRET_API_KEY';

  // === بررسی API Key ===
  const headers = Object.fromEntries(request.headers.entries());
  if (!headers['x-api-key'] || headers['x-api-key'] !== API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // === دریافت body ===
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { action, ...params } = body;
  if (!action) {
    return new Response(JSON.stringify({ error: 'Missing action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // === تعریف اکشن‌ها ===
  const routes = {
    get_users: {
      method: 'SELECT',
      sql: 'SELECT id, name, email FROM users',
      params: []
    },
    get_user_by_id: {
      method: 'SELECT',
      sql: 'SELECT id, name, email FROM users WHERE id = ?',
      params: ['id']
    },
    add_user: {
      method: 'INSERT',
      sql: 'INSERT INTO users (name, email) VALUES (?, ?)',
      params: ['name', 'email']
    },
    update_user: {
      method: 'UPDATE',
      sql: 'UPDATE users SET name = ?, email = ? WHERE id = ?',
      params: ['name', 'email', 'id']
    },
    delete_user: {
      method: 'DELETE',
      sql: 'DELETE FROM users WHERE id = ?',
      params: ['id']
    }
  };

  if (!routes[action]) {
    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const route = routes[action];

  // === بررسی پارامترهای لازم ===
  for (const p of route.params) {
    if (!(p in params)) {
      return new Response(JSON.stringify({ error: `Missing parameter: ${p}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  try {
    // === اجرای کوئری روی D1 ===
    const values = route.params.map(p => params[p]);
    const result = await env.DB.prepare(route.sql).bind(...values).run();

    let response;
    switch (route.method) {
      case 'SELECT':
        // برای SELECT از all() استفاده کنید
        const selectResult = await env.DB.prepare(route.sql).bind(...values).all();
        response = {
          success: true,
          count: selectResult.results.length,
          data: selectResult.results
        };
        break;

      case 'INSERT':
        response = {
          success: true,
          insert_id: result.lastInsertId
        };
        break;

      case 'UPDATE':
      case 'DELETE':
        response = {
          success: true,
          affected_rows: result.numUpdated || 0
        };
        break;
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Query failed', message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
