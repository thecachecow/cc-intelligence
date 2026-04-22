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

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000");
  const resend = new Resend(process.env.RESEND_API_KEY);

  app.use(express.json());

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
