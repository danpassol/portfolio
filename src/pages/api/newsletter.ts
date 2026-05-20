import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { email, firstName } = body;

    // ── Validación básica ──────────────────────────────────────────
    if (!email?.trim()) {
      return new Response(JSON.stringify({ error: 'missing_email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'invalid_email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Credenciales ───────────────────────────────────────────────
    const apiKey =
      (locals as any)?.runtime?.env?.RESEND_API_KEY ||
      import.meta.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('RESEND_API_KEY not set');
      return new Response(JSON.stringify({ error: 'server_config' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Crear contacto global en Resend ────────────────────────────
    const res = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        ...(firstName?.trim() && { first_name: firstName.trim() }),
        unsubscribed: false,
      }),
    });

    // 200/201 éxito; 409 contacto ya existe → también éxito
    if (res.ok || res.status === 409) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const errorBody = await res.text();
    console.error('Resend contacts error:', res.status, errorBody);

    return new Response(JSON.stringify({ error: 'resend_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Newsletter API error:', err);
    return new Response(JSON.stringify({ error: 'internal_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};