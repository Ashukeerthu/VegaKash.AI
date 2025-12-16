# Hostinger Email Setup Guide

## Email Account Details
- **Email**: support@vegaktools.com
- **Type**: Hostinger Business Email
- **Domain**: vegaktools.com

## SMTP Configuration

### For Backend (.env file)
```env
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=support@vegaktools.com
EMAIL_PASSWORD=your-hostinger-email-password
EMAIL_TO=support@vegaktools.com
```

### SMTP Settings Reference
- **Incoming Server (IMAP)**: imap.hostinger.com
  - Port: 993 (SSL)
- **Outgoing Server (SMTP)**: smtp.hostinger.com
  - Port: 587 (TLS/STARTTLS) - **Use this for backend**
  - Port: 465 (SSL) - Alternative

## Getting Your Hostinger Email Password

1. Log in to [Hostinger Panel](https://hpanel.hostinger.com/)
2. Navigate to **Emails** section
3. Click on **Manage** next to vegaktools.com
4. Find `support@vegaktools.com`
5. Click **Manage** or **Change Password**
6. Copy the password or set a new one

## Production Setup Steps

### 1. Update Backend .env
```bash
ssh u277936268@vegaktools.com
cd /home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI/backend
nano .env
```

Add/update these lines:
```env
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=support@vegaktools.com
EMAIL_PASSWORD=your-actual-password-here
EMAIL_TO=support@vegaktools.com
```

### 2. Secure and Restart
```bash
chmod 600 .env
sudo systemctl restart vegakash-backend
```

### 3. Test Configuration
```bash
curl http://localhost:8000/api/feedback/health
```

Expected response:
```json
{
  "status": "healthy",
  "email_configured": true,
  "timestamp": "2025-12-16T..."
}
```

## Testing Email Sending

### Python Test Script
```bash
cd /home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI/backend
python3 << 'EOF'
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuration
smtp_host = "smtp.hostinger.com"
smtp_port = 587
email_user = "support@vegaktools.com"
email_password = "your-password-here"

# Create message
msg = MIMEMultipart()
msg['From'] = email_user
msg['To'] = email_user
msg['Subject'] = "Test Email from VegaKash.AI"
msg.attach(MIMEText("This is a test email from the feedback system.", 'plain'))

# Send email
try:
    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(email_user, email_password)
    server.send_message(msg)
    server.quit()
    print("✅ Email sent successfully!")
except Exception as e:
    print(f"❌ Error: {e}")
EOF
```

## Troubleshooting

### Email Not Sending
1. **Check password**: Verify in Hostinger panel
2. **Check port**: Use 587 (not 465)
3. **Check firewall**: Ensure port 587 is open
4. **Check logs**: `sudo journalctl -u vegakash-backend -n 50`

### Common Errors

#### "Authentication failed"
- Wrong password or username
- Solution: Double-check credentials in Hostinger panel

#### "Connection refused"
- Port 587 blocked
- Solution: Check server firewall settings

#### "SSL/TLS error"
- Wrong port (using 465 instead of 587)
- Solution: Use port 587 with STARTTLS

## Email Aliases Setup

You can also set up these aliases in Hostinger:
- `legal@vegaktools.com` → Forward to support@vegaktools.com
- `privacy@vegaktools.com` → Forward to support@vegaktools.com
- `affiliate@vegaktools.com` → Forward to support@vegaktools.com

This way, all emails go to one inbox but maintain professional addresses.

## Important Notes

- **No App Password needed**: Use your regular Hostinger email password
- **SSL vs TLS**: Use port 587 (TLS/STARTTLS) for compatibility
- **Rate Limits**: Hostinger has sending limits (check your plan)
- **Security**: Never commit .env file to Git

## Resources

- [Hostinger Email Documentation](https://support.hostinger.com/en/collections/1742579-email)
- [SMTP Settings Guide](https://support.hostinger.com/en/articles/1583218-how-to-use-smtp)
- [Email Troubleshooting](https://support.hostinger.com/en/articles/1583300-troubleshooting-email-issues)

## Quick Production Update Command

```bash
ssh u277936268@vegaktools.com << 'ENDSSH'
cd /home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI/backend
cat > .env.email << 'EOF'
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=support@vegaktools.com
EMAIL_PASSWORD=YOUR_PASSWORD_HERE
EMAIL_TO=support@vegaktools.com
EOF
cat .env.email >> .env
rm .env.email
chmod 600 .env
sudo systemctl restart vegakash-backend
echo "✅ Email configuration updated"
ENDSSH
```

Replace `YOUR_PASSWORD_HERE` with your actual Hostinger email password.
