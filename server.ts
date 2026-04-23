import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Resend } from "resend";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FROM = "vault@cachecow.io";
const NOTIFY = process.env.COMPANY_EMAIL || "kw@cachecow.io";

const GATE = {
  password:    process.env.GATE_PASSWORD || 'milkmoney',
  cookieName:  'fg_auth',
  cookieValue: 'ok_v1',
  cookieDays:  7,
  brand:       'CacheCow / ForcedField Technologies',
  title:       'Intelligence',
  titleEm:     'Portal',
  subtitle:    'This resource is private. Enter your access code to continue.',
  footerNote:  'Confidential · April 2026',
  blobA:       '#c0912d',
  blobB:       '#5a8a6a',
};

function gateHtml(back: string, failed = false) {
  const { brand, title, titleEm, subtitle, footerNote, blobA, blobB } = GATE;
  const esc = (s: string) => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(brand)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#1a1a18;--ink2:#5a5a56;--ink3:#9a9a94;--bg:#f5f4f0;--border:rgba(26,26,24,0.14);--gold:#c0912d}
@media(prefers-color-scheme:dark){:root{--ink:#f0efe8;--ink2:#a8a89e;--ink3:#6a6a62;--bg:#1a1a18;--border:rgba(240,239,232,0.12)}}
html,body{height:100%;font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased}
.scene{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:0}
.sl{position:absolute;background:var(--border)}.sl.h{left:0;right:0;height:.5px}.sl.v{top:0;bottom:0;width:.5px}
.blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:.18}
.wrap{position:relative;z-index:10;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem}
.card{width:100%;max-width:420px;background:rgba(245,244,240,.72);border:.5px solid var(--border);border-radius:16px;padding:2.75rem 2.5rem 2.25rem;backdrop-filter:blur(24px) saturate(1.4);box-shadow:0 2px 32px rgba(26,26,24,.08)}
@media(prefers-color-scheme:dark){.card{background:rgba(26,26,24,.72);box-shadow:0 2px 32px rgba(0,0,0,.4)}}
.brand{font-family:'Playfair Display',serif;font-size:13px;font-weight:600;letter-spacing:.08em;color:var(--ink3);text-transform:uppercase;margin-bottom:1.5rem}
h1{font-family:'Playfair Display',serif;font-size:1.85rem;font-weight:600;line-height:1.2;margin-bottom:.5rem}
h1 em{font-style:italic;color:var(--ink2)}.sub{font-size:14px;color:var(--ink2);line-height:1.7;margin-bottom:2rem}
.err{font-size:13px;color:#c0392b;background:rgba(192,57,43,.08);border:.5px solid rgba(192,57,43,.2);border-radius:6px;padding:8px 12px;margin-bottom:1rem}
form{display:flex;flex-direction:column;gap:12px}
input[type=password]{width:100%;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--ink);background:var(--bg);border:.5px solid var(--border);border-radius:8px;outline:none;transition:border-color .2s;letter-spacing:.1em}
input[type=password]:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(192,145,45,.12)}
button{width:100%;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;letter-spacing:.04em;color:var(--bg);background:var(--ink);border:none;border-radius:8px;cursor:pointer;transition:opacity .2s}
button:hover{opacity:.82}.foot{margin-top:1.75rem;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3);text-align:center}
</style>
</head>
<body>
<div class="scene" aria-hidden="true">
  <div class="sl h" style="top:18%"></div><div class="sl h" style="top:42%"></div>
  <div class="sl h" style="top:67%"></div><div class="sl h" style="top:84%"></div>
  <div class="sl v" style="left:22%"></div><div class="sl v" style="left:50%"></div><div class="sl v" style="left:78%"></div>
  <div class="blob" style="width:480px;height:480px;top:-10%;left:-8%;background:${esc(blobA)}"></div>
  <div class="blob" style="width:360px;height:360px;bottom:-5%;right:-5%;background:${esc(blobB)}"></div>
</div>
<div class="wrap"><div class="card">
  <p class="brand">${esc(brand)}</p>
  <h1>${esc(title)} <em>${esc(titleEm)}</em></h1>
  <p class="sub">${esc(subtitle)}</p>
  ${failed ? '<p class="err">Incorrect code — try again.</p>' : ''}
  <form method="POST" action="/__unlock">
    <input type="hidden" name="next" value="${esc(back)}">
    <input type="password" name="password" placeholder="Access code" autofocus autocomplete="off" spellcheck="false">
    <button type="submit">Unlock &rarr;</button>
  </form>
  <p class="foot">${esc(footerNote)}</p>
</div></div>
</body></html>`;
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000");
  const resend = new Resend(process.env.RESEND_API_KEY);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Frosted Gate — password unlock endpoint
  app.post("/__unlock", (req, res) => {
    const pw = (req.body.password || '').trim();
    const back = req.body.next || '/';
    if (pw === GATE.password) {
      const maxAge = GATE.cookieDays * 86400;
      res.setHeader('Set-Cookie', `${GATE.cookieName}=${GATE.cookieValue}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`);
      return res.redirect(303, back);
    }
    res.status(401).send(gateHtml(back, true));
  });

  // Frosted Gate — protect all non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    const cookies = req.headers.cookie || '';
    const authed = cookies.split(';').some(c => c.trim() === `${GATE.cookieName}=${GATE.cookieValue}`);
    if (authed) return next();
    res.status(401).send(gateHtml(req.path));
  });

  // Notify on investor sign-in
  app.post("/api/notify-signin", async (req, res) => {
    const { email, name, photoURL } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });

    try {
      await resend.emails.send({
        from: FROM,
        to: [NOTIFY],
        subject: `Investor sign-in: ${name || email}`,
        html: `
          <p>An investor just signed in to the CacheCow portal.</p>
          <table>
            <tr><td><strong>Name</strong></td><td>${name || "—"}</td></tr>
            <tr><td><strong>Email</strong></td><td>${email}</td></tr>
            <tr><td><strong>Time</strong></td><td>${new Date().toUTCString()}</td></tr>
          </table>
        `,
      });
      res.json({ success: true });
    } catch (err) {
      console.error("Sign-in notification failed:", err);
      res.json({ success: false });
    }
  });

  // NDA signing — generate PDF and email to signer + company
  app.post("/api/sign-nda", async (req, res) => {
    const { uid, email, fullName, signedAt, ipAddress } = req.body;

    if (!uid || !email || !fullName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      page.drawText("NON-DISCLOSURE AGREEMENT", {
        x: 50,
        y: height - 50,
        size: 20,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      const ndaText = `
This Non-Disclosure Agreement (the "Agreement") is entered into as of ${new Date(signedAt).toLocaleDateString()}, by and between CacheCow (the "Company") and ${fullName} (the "Recipient").

1. Confidential Information: The Recipient agrees to keep all information shared by the Company strictly confidential.
2. Purpose: The information is shared solely for the purpose of evaluating a potential investment in the Company.
3. Non-Use: The Recipient shall not use the Confidential Information for any purpose other than the Purpose.
4. Term: This Agreement shall remain in effect for a period of three (3) years from the date hereof.

Signed by: ${fullName}
Email: ${email}
Date: ${new Date(signedAt).toLocaleString()}
IP Address: ${ipAddress || "N/A"}
      `;

      page.drawText(ndaText, {
        x: 50,
        y: height - 100,
        size: 12,
        font,
        lineHeight: 15,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const pdfBuffer = Buffer.from(pdfBytes);

      await resend.emails.send({
        from: FROM,
        to: [email, NOTIFY],
        subject: "Signed NDA — CacheCow Investor Portal",
        html: `
          <p>Hi ${fullName},</p>
          <p>Please find your signed Non-Disclosure Agreement attached.</p>
          <p>You now have access to CacheCow's confidential investor materials.</p>
          <br/>
          <p>— The CacheCow Team</p>
        `,
        attachments: [
          {
            filename: `NDA_${fullName.replace(/\s+/g, "_")}.pdf`,
            content: pdfBuffer.toString("base64"),
          },
        ],
      });

      console.log(`NDA email sent to ${email}`);
      res.json({ success: true });
    } catch (error: any) {
      console.error("NDA Signing Error:", error);
      res.status(500).json({ error: "Failed to process NDA signing" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
