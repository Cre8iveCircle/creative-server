const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    logger: true,
    debug: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

async function verifySMTP() {
    try {
        await transport.verify();
        console.log("✅ SMTP Connected");
    } catch (err) {
        console.error("❌ SMTP Verify Failed:", err);
    }
}

verifySMTP();

// await transport.verify();
// console.log("SMTP Connected");

console.log({
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
});
// ✅ Change this whenever your domain changes
const TICKET_BASE_URL = "https://cre8ivesummit.online/assets";


// 📧 Confirmation Email
const sendConfirmationEmail = async (email, fullname) => {
    try {
        await transport.sendMail({
            from: `"CRE8IVE SUMMIT" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "YOU’RE ALL SET FOR CRE8IVE SUMMIT TWO.0",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color:#FFBB00;">Hi ${fullname},</h2>

                    <p>
                        We're excited to confirm your registration for the
                        <strong>CRE8IVE SUMMIT TWO.0</strong>, happening on
                        <strong>Saturday, 22nd August, 2026</strong>.
                    </p>

                    <p>
                        Get ready for an inspiring experience filled with
                        thought-provoking talks and impactful networking.
                    </p>

                    <br/>

                    <p>Best regards,</p>

                    <strong>
                        CRE8IVE SUMMIT TWO.0<br/>
                        Registration Team
                    </strong>
                </div>
            `,
        });

        console.log("✅ Confirmation email sent:", email);
    } catch (error) {
        console.error("❌ Confirmation email failed:", error);
        throw error;
    }
};


// 📧 Ticket Email
const sendTicketEmail = async (
    email,
    fullname,
    ticketPath,
    ticket_bought
) => {
    try {
        const ticketDownloadMap = {
            "₦3,500": "spark-C5SPjuZO",
            "₦5,000": "spark-C5SPjuZO",
            "₦3,500 (Free)": "spark-C5SPjuZO",
            "₦10,000": "vip-BqOmvrC_",
            "₦50,000": "tech-XVU9QiQj",
            "₦100,000": "digital-2CrJbkjy",
        };

        console.log("🧾 Ticket Path:", ticketPath);

        const fileExists = fs.existsSync(ticketPath);

        console.log("📁 Ticket Exists:", fileExists);

        if (!fileExists) {
            console.warn(`⚠️ Ticket image missing: ${ticketPath}`);
        }

        const fileName = path.basename(ticketPath);

        const assetName =
            ticketDownloadMap[ticket_bought] || "spark-C5SPjuZO";

        const downloadLink = `${TICKET_BASE_URL}/${assetName}.png`;

        console.log("🔗 Download URL:", downloadLink);

        await transport.sendMail({
            from: `"CRE8IVE SUMMIT" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "IMPORTANT INFORMATION | GET YOUR TICKET",

            html: `
                <div style="font-family: Arial, sans-serif; line-height:1.6;">
                    <h2 style="color:#FFBB00;">Hello ${fullname},</h2>

                    <p>
                        Thank you for registering for
                        <strong>CRE8IVE SUMMIT TWO.0</strong>.
                    </p>

                    <p>
                        <strong>Your Ticket:</strong> ${ticket_bought}
                    </p>

                    <ul>
                        <li><strong>Registration:</strong> 9:00 AM</li>
                        <li><strong>Venue:</strong> Denco Cinema, Debow Junction, Ekpoma.</li>
                        <li>Dress smartly.</li>
                        <li>Come ready to network.</li>
                        <li>Participate and enjoy the experience.</li>
                    </ul>

                    <p style="color:red;font-weight:bold;">
                        PRESENT THIS TICKET AT THE REGISTRATION DESK.
                    </p>

                    ${
                        fileExists
                            ? `<img src="cid:eventTicket" style="max-width:100%;border-radius:8px;" />`
                            : ""
                    }

                    <p>
                        📥
                        <a href="${downloadLink}">
                            Download Your Ticket
                        </a>
                    </p>

                    <br/>

                    <strong>
                        CRE8IVE SUMMIT TWO.0<br/>
                        Registration Team
                    </strong>
                </div>
            `,

            attachments: fileExists
                ? [
                      {
                          filename: fileName,
                          path: ticketPath,
                          cid: "eventTicket",
                      },
                  ]
                : [],
        });

        console.log("✅ Ticket email sent:", email);
    } catch (error) {
        console.error("❌ Ticket email failed:", error);
        throw error;
    }
};

module.exports = {
    sendConfirmationEmail,
    sendTicketEmail,
};
