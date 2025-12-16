# Fix Email Feedback on Production

## Problem
Feedback form submitting successfully (200 OK) but emails not being received.

## Root Cause
Production server `.env` file missing email configuration variables.

## Quick Fix (2 minutes)

### Step 1: SSH into Production
```bash
ssh u277936268@vegaktools.com
```

### Step 2: Navigate to Backend
```bash
cd /home/u277936268/domains/vegaktools.com/public_html/VegaKash.AI/backend
```

### Step 3: Edit .env File
```bash
nano .env
```

### Step 4: Add Email Configuration
Add these lines to the `.env` file (or update if they exist):

```env
# Email Configuration for Feedback System
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=support@vegaktools.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_TO=support@vegaktools.com
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### Step 5: Secure the .env File
```bash
chmod 600 .env
```

### Step 6: Restart Backend Service
```bash
sudo systemctl restart vegakash-backend
```

### Step 7: Verify Service is Running
```bash
sudo systemctl status vegakash-backend
```

Should show "active (running)" in green.

### Step 8: Test Email Configuration
```bash
curl http://localhost:8000/api/feedback/health
```

Should return:
```json
{
  "status": "healthy",
  "email_configured": true,
  "timestamp": "2025-12-16T..."
}
```

## Test on Website
1. Visit https://vegaktools.com
2. Submit feedback using any method (feedback button, page feedback, or micro-survey)
3. Check your email inbox: support@vegaktools.com

## Troubleshooting

### If backend won't start:
```bash
sudo journalctl -u vegakash-backend -n 50
```

### If email_configured is false:
Check if EMAIL_USER and EMAIL_PASSWORD are set:
```bash
cat .env | grep EMAIL
```

### Test manual email send:
```bash
python3 << 'PYEOF'
import smtplib
from email.mime.text import MIMEText

msg = MIMEText("Test from VegaKash.AI")
msg['Subject'] = 'Test Email'
msg['From'] = 'support@vegaktools.com'
msg['To'] = 'support@vegaktools.com'

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('support@vegaktools.com', 'your-app-password')
server.send_message(msg)
server.quit()
print("✅ Test email sent successfully!")
PYEOF
```

## Notes

- **Business Email**: Update the email configuration to use your business email `support@vegaktools.com`
- **App Password**: Generate a new Gmail App Password for the business email
- **Security**: The `.env` file is protected with `chmod 600` (owner read/write only)
- **Background Tasks**: Feedback emails are sent asynchronously, so the API returns 200 OK immediately even if email fails
- To generate Gmail App Password: https://myaccount.google.com/apppasswords

## Estimated Time
Total: 2-3 minutes
