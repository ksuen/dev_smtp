
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
    const { userEmail, userName, to } = req.body;
    const pdfBuffer = req.file.buffer;

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });

    const recipients = [to];
    if (userEmail) recipients.push(userEmail);

    const info = await transporter.sendMail({
      from: '"Dental Pain Eraser" <info@synapsedental.com>',
      to: recipients.join(','),
      subject: "Your Competitor Analysis Report",
      text: userName
        ? `Hi ${userName}, here's your dental competitor report.`
        : `Here is your dental competitor report.`,
      attachments: [{
        filename: "Competitor_Analysis_Report.pdf",
        content: pdfBuffer
      }]
    });

    console.log("Email sent:", info.messageId);
    res.send("Email sent!");
  } catch (error) {
    console.error("Email send failed:", error);
    res.status(500).send("Email send failed.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
