import type { APIRoute } from 'astro';
import { getConfirmationEmail } from '~/lib/emails/confirmation';

export const prerender = false;

const RATE_LIMIT_MAX = 3;       // máx mensajes
const RATE_LIMIT_TTL = 86400;   // 24 horas en segundos

function hashSimple(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {

    // ── Rate limiting ──────────────────────────────────────────────
    const kv = (locals as any)?.runtime?.env?.CONTACT_RL;

    if (kv) {
      const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
      const ua = request.headers.get('User-Agent') ?? 'unknown';
      const key = `rate:${ip}:${hashSimple(ua)}`;

      const raw = await kv.get(key);
      const record = raw ? JSON.parse(raw) : { count: 0, firstSeen: Date.now() };

      if (record.count >= RATE_LIMIT_MAX) {
        return new Response(JSON.stringify({ error: 'rate_limit' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      record.count += 1;
      await kv.put(key, JSON.stringify(record), { expirationTtl: RATE_LIMIT_TTL });
    }
    // ──────────────────────────────────────────────────────────────

    const body = await request.json();
    const { name, surname, email, message, lang } = body;

    if (!name?.trim() || !surname?.trim() || !email?.trim() || !message?.trim()) {
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

    const apiKey = (locals as any)?.runtime?.env?.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('RESEND_API_KEY not set');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Email 1 — notificación a hola@dpastor.eu ──────────────────
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
        subject: `[dpastor.eu] Nuevo mensaje de ${name} ${surname}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a8fe8;">Nuevo mensaje desde dpastor.eu</h2>
            <p><strong>Nombre:</strong> ${name} ${surname}</p>
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

    // ── Email 2 — confirmación al cliente (con fallo silencioso) ──────
    try {
      const { subject, html } = getConfirmationEmail(name, message, lang || 'es');

      const confirmRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'dpastor.eu <noreply@dpastor.eu>',
          to: [email],
          subject,
          html,
        }),
      });

      if (!confirmRes.ok) {
        console.warn('Confirmation email failed:', await confirmRes.text());
      }
    } catch (confirmErr) {
      console.warn('Confirmation email error:', confirmErr);
    }
    // ──────────────────────────────────────────────────────────────

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