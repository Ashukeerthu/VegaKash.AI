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
EMAIL_USER=bhaskar070693@gmail.com
EMAIL_PASSWORD=ajmwkjxnqocbhcdf
EMAIL_TO=bhaskar070693@gmail.com
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
3. Check your email inbox: bhaskar070693@gmail.com

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
msg['From'] = 'bhaskar070693@gmail.com'
msg['To'] = 'bhaskar070693@gmail.com'

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('bhaskar070693@gmail.com', 'ajmwkjxnqocbhcdf')
server.send_message(msg)
server.quit()
print("✅ Test email sent successfully!")
PYEOF
```

## Notes

- **App Password**: The password `ajmwkjxnqocbhcdf` is a Gmail App Password, not your regular Gmail password
- **Security**: The `.env` file is protected with `chmod 600` (owner read/write only)
- **Background Tasks**: Feedback emails are sent asynchronously, so the API returns 200 OK immediately even if email fails
- To regenerate Gmail App Password: https://myaccount.google.com/apppasswords

## Estimated Time
Total: 2-3 minutes
