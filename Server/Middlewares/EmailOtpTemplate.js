// Function to generate OTP Email Template
export function generateOtpTemplate(otp) {
    return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your Email</title>
    </head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f5f9ff;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f5f9ff;padding:40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.06);">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:24px;text-align:center;">
                  <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:600;">🔐 Email Verification</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px;text-align:center;color:#333333;">
                
                  <p style="font-size:16px;margin:0 0 20px;">
                    Use the following One-Time Password (OTP) to verify your account. 
                    This OTP is valid for the next <strong>5 minutes</strong>.
                  </p>
                  <!-- OTP Box -->
                  <div style="display:inline-block;background:#f0f4ff;border:2px dashed #2563eb;border-radius:8px;padding:14px 26px;font-size:26px;letter-spacing:8px;font-weight:bold;color:#1e3a8a;margin:20px 0;">
                    ${otp}
                  </div>
                  <p style="font-size:14px;color:#555;margin:20px 0 0;">
                    If you did not request this, please ignore this email or contact support immediately.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:16px;text-align:center;font-size:13px;color:#777;">
                  © 2025 Your Company. All rights reserved.<br />
                  <a href="#" style="color:#2563eb;text-decoration:none;font-weight:500;">Visit our website</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}
