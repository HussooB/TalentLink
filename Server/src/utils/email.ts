import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("Missing SMTP configuration in environment variables");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === "465",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.verify();
    console.log(`SMTP connection verified for ${process.env.SMTP_HOST}`);

    const info = await transporter.sendMail({
      from: `"TalentLink" <hussein.beshir100@gmail.com>`, // use noreply@talentlink.com later
      to,
      subject,
      html, // ✅ use the html passed from controller
      text: html.replace(/<[^>]*>?/gm, ""), // fallback plain text
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err: any) {
    console.error("Error sending email:", err.message);
    throw new Error(`Failed to send email: ${err.message}`);
  }
}
