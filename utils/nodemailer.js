const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendConfirmationEmail = async (email, fullname) => {
  try {
    await transport.sendMail({
      from: `"CRE8IVE SUMMIT" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "YOU’RE ALL SET FOR CRE8IVE SUMMIT ONE.0",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #FFBB00;">Hi ${fullname},</h2>
          <p>We're excited to confirm your registration for the <strong>CRE8IVE SUMMIT ONE.0</strong>, happening on <strong>Saturday, 23rd August, 2025</strong>!</p>
          <p>Get ready for an inspiring experience filled with thought-provoking talks and impactful networking.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>CRE8IVE SUMMIT ONE.0<br/>Registration Team</strong></p>
        </div>
      `,
    });
    console.log("Confirmation email sent.");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};

const sendTicketEmail = async (email, fullname, ticketPath) => {
  try {
    await transport.sendMail({
      from: `"CRE8IVE SUMMIT" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "IMPORTANT INFORMATION | GET YOUR TICKET",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #FFBB00;">Important Information</h2>
          <ul>
            <li><strong>REGISTRATION starts at 8:30 AM</strong> – please arrive early to secure your spot.</li>
            <li><strong>VENUE:</strong> Denco Cinema, Debow Junction, Ekpoma.</li>
            <li><strong>Dress smartly</strong> – look sharp, make a great impression!</li>
            <li><strong>Be ready to network</strong> – come prepared to meet new people and share ideas.</li>
            <li><strong>Maximize the experience</strong> – engage actively, ask questions, and soak in the knowledge.</li>
          </ul>
          <p style="color: red; font-weight: bold;">
            NOTE: PRESENT THIS TICKET AT THE REGISTRATION STAND – IT IS REQUIRED FOR ENTRY.
          </p>
          <img src="cid:eventTicket" style="max-width: 100%; margin: 12px 0; border-radius: 8px;" />
          <p>📥 <a href="https://creative-circle-01.netlify.app/assets/spark-Cs0fKAt6.svg" download>Click here to download your ticket</a></p>
          <br/>
          <p>We look forward to welcoming you to an unforgettable event!</p>
          <br/>
          <p><strong>CRE8IVE SUMMIT ONE.0<br/>Registration Team</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: 'spark.png',
          path: ticketPath, // e.g., './assets/spark.png'
          cid: 'eventTicket',
        }
      ]
    });
    console.log("Ticket email sent.");
  } catch (error) {
    console.error("Error sending ticket email:", error);
  }
};

module.exports = {
  sendConfirmationEmail,
  sendTicketEmail
};
