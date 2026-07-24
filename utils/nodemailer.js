const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
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

// 📧 Confirmation Email
const sendConfirmationEmail = async(email, fullname) => {
    try {
        await transport.sendMail({
            from: `"CRE8IVE SUMMIT" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "YOU’RE ALL SET FOR CRE8IVE SUMMIT TWP.0",
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #FFBB00;">Hi ${fullname},</h2>
          <p>We're excited to confirm your registration for the <strong>CRE8IVE SUMMIT TWO.0</strong>, happening on <strong>Saturday, 22nd August, 2026</strong>!</p>
          <p>Get ready for an inspiring experience filled with thought-provoking talks and impactful networking.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>CRE8IVE SUMMIT TWO.0<br/>Registration Team</strong></p>
        </div>
      `,
        });

        console.log("✅ Confirmation email sent to:", email);
    } catch (error) {
        console.error("❌ Error sending confirmation email:", error);
    }
};

// 📧 Ticket Email
const sendTicketEmail = async(email, fullname, ticketPath, ticket_bought) => {
    try {
        const ticketDownloadMap = {
            '₦3,500': 'spark-C5SPjuZO',
            '₦5,000': 'spark-C5SPjuZO',
            '₦3,500 (Free)': 'spark-C5SPjuZO', // 👈 ADD THIS LINE
            '₦10,000': 'vip-BqOmvrC_',
            '₦50,000': 'tech-XVU9QiQj',
            '₦100,000': 'digital-2CrJbkjy',
        };


        console.log('🧾 Final ticketPath:', ticketPath);
        const fileExists = fs.existsSync(ticketPath);
        console.log('🧾 File Exists:', fileExists);

        if (!fileExists) {
            console.warn(`⚠️ Ticket image not found at: ${ticketPath}`);
        }

        const fileName = path.basename(ticketPath);
        const fileBase = ticketDownloadMap[ticket_bought] || 'spark-C5SPjuZO';
        const downloadLink = `https://cre8ivesummit.online/assets/${fileBase}.png`;

        console.log(downloadLink);


        await transport.sendMail({
            from: `"CRE8IVE SUMMIT" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "IMPORTANT INFORMATION | GET YOUR TICKET",
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #FFBB00;">Hello ${fullname},</h2>
          <p>Thank you for registering for <strong>CRE8IVE SUMMIT TWO.0</strong>!</p>
          <p>Your ticket package: <strong>${ticket_bought}</strong></p>

          <ul>
            <li><strong>REGISTRATION starts at 9:00 AM</strong> – please arrive early to secure your spot.</li>
            <li><strong>VENUE:</strong> Denco Cinema, Debow Junction, Ekpoma.</li>
            <li><strong>Dress smartly</strong> – look sharp, make a great impression!</li>
            <li><strong>Be ready to network</strong> – come prepared to meet new people and share ideas.</li>
            <li><strong>Maximize the experience</strong> – engage actively, ask questions, and soak in the knowledge.</li>
          </ul>

          <p style="color: red; font-weight: bold;">
            NOTE: PRESENT THIS TICKET AT THE REGISTRATION STAND – IT IS REQUIRED FOR ENTRY.
          </p>

          <img src="cid:eventTicket" style="max-width: 100%; margin: 12px 0; border-radius: 8px;" alt="Ticket" />
          <p>📥 <a href="${downloadLink}" download>Click here to download your ticket</a></p>

          <p>We look forward to welcoming you to an unforgettable event!</p>
          <br/>
          <p><strong>CRE8IVE SUMMIT ONE.0<br/>Registration Team</strong></p>
        </div>
      `,
            attachments: fileExists ? [{
                filename: fileName,
                path: ticketPath,
                cid: 'eventTicket',
            }] : [],
        });

        console.log("✅ Ticket email sent to:", email);
    } catch (error) {
        console.error("❌ Error sending ticket email:", error);
    }
};

module.exports = {
    sendConfirmationEmail,
    sendTicketEmail,
};