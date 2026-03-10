import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, message, lang } = body;

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY not set');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'dpastor.eu <noreply@dpastor.eu>',
        to: ['hola@dpastor.eu'],
        reply_to: email,
        subject: `[dpastor.eu] Nuevo mensaje de ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a8fe8;">Nuevo mensaje desde dpastor.eu</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Idioma:</strong> ${lang || 'es'}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p><strong>Mensaje:</strong></p>
            <p style="white-space: pre-wrap; color: #333;">${message}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="font-size: 12px; color: #999;">Enviado desde dpastor.eu — responde directamente a este email para contestar al remitente.</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Contact API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};