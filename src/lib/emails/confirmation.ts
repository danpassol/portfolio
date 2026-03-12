const PRIMARY = '#4a8fe8';

function formatDate(lang: string): string {
  return new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function layout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;border:1px solid #e4e4e7;overflow:hidden;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function header(title: string, subtitle: string): string {
  return `
  <tr>
    <td style="padding:32px 32px 24px;border-bottom:1px solid #f0f0f0;">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding-bottom:20px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:${PRIMARY};border-radius:6px;width:28px;height:28px;text-align:center;vertical-align:middle;">
                  <span style="color:#fff;font-size:14px;font-weight:600;">d</span>
                </td>
                <td style="padding-left:8px;font-size:14px;font-weight:500;color:#18181b;">dpastor.eu</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:44px;height:44px;background:${PRIMARY}20;border-radius:50%;text-align:center;vertical-align:middle;">
                  <span style="color:${PRIMARY};font-size:20px;line-height:44px;">✓</span>
                </td>
                <td style="padding-left:12px;">
                  <p style="margin:0;font-size:17px;font-weight:500;color:#18181b;">${title}</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#71717a;">${subtitle}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function body(greeting: string, messagelabel: string, message: string, sentfrom: string, date: string, datelabel: string, sentfromlabel: string, cta: string): string {
  const safeMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `
  <tr>
    <td style="padding:24px 32px;">
      <p style="margin:0 0 20px;font-size:14px;color:#52525b;line-height:1.6;">${greeting}</p>

      <table cellpadding="0" cellspacing="0" width="100%" style="background:#f9f9fb;border-radius:8px;border:1px solid #e4e4e7;margin-bottom:20px;">
        <tr>
          <td style="padding:16px 20px;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;color:#a1a1aa;">${messagelabel}</p>
            <p style="margin:0;font-size:13px;color:#71717a;line-height:1.6;font-style:italic;">"${safeMessage}"</p>
          </td>
        </tr>
      </table>

      <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
        <tr>
          <td width="48%" style="background:#f9f9fb;border-radius:8px;border:1px solid #e4e4e7;padding:12px 16px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;color:#a1a1aa;">${sentfromlabel}</p>
            <p style="margin:0;font-size:13px;font-weight:500;color:#18181b;">${sentfrom}</p>
          </td>
          <td width="4%"></td>
          <td width="48%" style="background:#f9f9fb;border-radius:8px;border:1px solid #e4e4e7;padding:12px 16px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;color:#a1a1aa;">${datelabel}</p>
            <p style="margin:0;font-size:13px;font-weight:500;color:#18181b;">${date}</p>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:13px;color:#71717a;line-height:1.6;">${cta}</p>
    </td>
  </tr>`;
}

function footer(location: string): string {
  return `
  <tr>
    <td style="padding:16px 32px;border-top:1px solid #f0f0f0;">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="font-size:12px;color:#a1a1aa;">Dani Pastor · dpastor.eu</td>
          <td align="right" style="font-size:12px;color:#a1a1aa;">${location}</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

export function getConfirmationEmail(name: string, message: string, lang: string): { subject: string; html: string } {
  const isEs = lang === 'es';
  const date = formatDate(lang);

  const subject = isEs
    ? 'Mensaje recibido · dpastor.eu'
    : 'Message received · dpastor.eu';

  const html = layout(`
    ${header(
      isEs ? 'Mensaje recibido' : 'Message received',
      isEs ? 'Te responderé lo antes posible' : "I'll get back to you as soon as possible"
    )}
    ${body(
      isEs
        ? `Hola <strong style="color:#18181b;font-weight:500;">${name}</strong>, gracias por ponerte en contacto. He recibido tu mensaje correctamente y te responderé en breve.`
        : `Hi <strong style="color:#18181b;font-weight:500;">${name}</strong>, thanks for reaching out. I've received your message and will get back to you shortly.`,
      isEs ? 'Tu mensaje' : 'Your message',
      message,
      'dpastor.eu/contact',
      date,
      isEs ? 'Fecha' : 'Date',
      isEs ? 'Enviado desde' : 'Sent from',
      isEs
        ? `Para consultas urgentes puedes escribirme directamente a <a href="mailto:hola@dpastor.eu" style="color:${PRIMARY};text-decoration:none;">hola@dpastor.eu</a>.`
        : `For urgent matters, feel free to reach me directly at <a href="mailto:hola@dpastor.eu" style="color:${PRIMARY};text-decoration:none;">hola@dpastor.eu</a>.`
    )}
    ${footer(isEs ? 'Valencia, España' : 'Valencia, Spain')}
  `);

  return { subject, html };
}