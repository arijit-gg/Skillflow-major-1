const nodemailer = require('nodemailer');

/**
 * Send candidate status notification email
 */
const sendCandidateEmail = async ({ to, candidateName, jobTitle, status, companyName }) => {
  const isSmtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_USER !== 'mock_user';

  const subject = `Update on your application for ${jobTitle} at ${companyName || 'SmartHire Tech'}`;
  
  let textMessage = `Hello ${candidateName},\n\n`;
  textMessage += `Your job application status for "${jobTitle}" has been updated to: ${status}.\n\n`;
  
  if (status === 'Interviewing') {
    textMessage += `Congratulations! Our recruitment team would like to schedule an interview with you. We will be in touch shortly with dates and details.\n\n`;
  } else if (status === 'Offered') {
    textMessage += `Great news! We are excited to extend an offer for the ${jobTitle} position! Check your email inbox for formal offer documents.\n\n`;
  } else if (status === 'Hired') {
    textMessage += `Welcome aboard! You have officially been hired for the ${jobTitle} role.\n\n`;
  } else if (status === 'Rejected') {
    textMessage += `Thank you for taking the time to apply and interview with us. Although we have decided to move forward with other candidates at this time, we will keep your profile on file for future opportunities.\n\n`;
  }

  textMessage += `Best regards,\n${companyName || 'SmartHire Tech'} Recruitment Team`;

  if (!isSmtpConfigured) {
    console.log(`\n================ SIMULATED CANDIDATE EMAIL ================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${textMessage}`);
    console.log(`===========================================================\n`);
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'SmartHire ATS'}" <${process.env.FROM_EMAIL || 'notifications@smarthire.com'}>`,
      to,
      subject,
      text: textMessage,
    });

    console.log(`[Email Service] Message sent: %s`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Service Error] ${error.message}`);
    // Non-blocking fallback
    return { success: false, error: error.message };
  }
};

module.exports = { sendCandidateEmail };
