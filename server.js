const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/send-pdf-email', upload.single('pdf'), async (req, res) => {
  try {
    const { to, bcc, from, subject, text } = req.body;
    const pdfBuffer = req.file?.buffer;

    if (!to) return res.status(400).send("Recipient 'to' address is required.");
    if (!pdfBuffer) return res.status(400).send("No PDF attached.");

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });

    const mailOptions = {
      from: from || '"Dental Pain Eraser" <info@synapsedental.com>',
      to: to.trim(),
      ...(bcc && { bcc: bcc.trim() }),
      subject: subject || "Dental Pain Eraser dental competitor report",
      text: text || "Here is your Dental Pain Eraser dental competitor report.",
      attachments: [{
        filename: "Competitor_Analysis_Report.pdf",
        content: pdfBuffer
      }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    res.send("Email sent!");
  } catch (error) {
    console.error("Email send failed:", error);
    res.status(500).send("Email send failed.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
