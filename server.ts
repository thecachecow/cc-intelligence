import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000");

  app.use(express.json());

  // API Route for NDA Signing
  app.post("/api/sign-nda", async (req, res) => {
    const { uid, email, fullName, signedAt, ipAddress } = req.body;

    if (!uid || !email || !fullName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // 1. Generate PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();
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
        font: font,
        lineHeight: 15,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();

      // 2. Send Email (Optional)
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          const mailOptions = {
            from: `"CacheCow Investor Relations" <${process.env.SMTP_USER}>`,
            to: [email, process.env.COMPANY_EMAIL || "kw@cachecow.io"],
            subject: "Signed NDA - CacheCow Investor Portal",
            text: `Hello ${fullName},\n\nPlease find attached the signed Non-Disclosure Agreement for the CacheCow Investor Portal.\n\nBest regards,\nThe CacheCow Team`,
            attachments: [
              {
                filename: `NDA_${fullName.replace(/\s+/g, "_")}.pdf`,
                content: Buffer.from(pdfBytes),
              },
            ],
          };

          await transporter.sendMail(mailOptions);
          console.log(`NDA email sent to ${email}`);
        } catch (emailError) {
          console.error("Failed to send NDA email:", emailError);
          // We don't fail the whole request if email fails
        }
      } else {
        console.warn("SMTP not configured. Skipping NDA email delivery.");
      }

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
