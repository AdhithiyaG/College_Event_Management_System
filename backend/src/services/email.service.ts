import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendRegistrationConfirmation = async (
  to: string,
  studentName: string,
  eventTitle: string,
  eventDate: Date,
  eventVenue: string,
  qrCodeDataURL: string,
) => {
  const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Registration Confirmed - ${eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Registration Confirmed!</h2>
        <p>Hi <strong>${studentName}</strong>,</p>
        <p>Your registration for <strong>${eventTitle}</strong> has been confirmed.</p>
        
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Event Details</h3>
          <p style="margin: 4px 0;"><strong>Event:</strong> ${eventTitle}</p>
          <p style="margin: 4px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 4px 0;"><strong>Venue:</strong> ${eventVenue}</p>
        </div>

        <p>Please show the QR code below at the event entrance for check-in:</p>
        <div style="text-align: center; margin: 20px 0;">
          <img src="${qrCodeDataURL}" alt="QR Code" style="width: 200px; height: 200px;" />
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          This QR code is unique to your registration. Please do not share it.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
