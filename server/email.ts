// Email service for sending verification codes
// This is a placeholder implementation - replace with actual email service (SendGrid, AWS SES, etc.)

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  const { to, subject, html } = options;

  // TODO: Replace with actual email service implementation
  // For now, just log the email details to console
  console.log('========================================');
  console.log('EMAIL WOULD BE SENT:');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Content:', html);
  console.log('========================================');

  // In production, integrate with an email service like:
  // - SendGrid
  // - AWS SES
  // - Mailgun
  // - Postmark
  // etc.

  return true;
};

export const sendVerificationCode = async (
  email: string,
  code: string
): Promise<boolean> => {
  const subject = 'Verify Your Email - Echo Platform';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .code-container {
            background-color: white;
            border: 2px solid #4F46E5;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
          }
          .code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #4F46E5;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Email Verification</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for registering with Echo Platform. To complete your business registration, please verify your email address using the code below:</p>

          <div class="code-container">
            <div class="code">${code}</div>
          </div>

          <p>This verification code will expire in 10 minutes.</p>
          <p>If you didn't request this verification code, please ignore this email.</p>

          <div class="footer">
            <p>This is an automated email, please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Echo Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({ to: email, subject, html });
};
