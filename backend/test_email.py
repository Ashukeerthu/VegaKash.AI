"""
Test Hostinger Email SMTP Connection
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Email configuration
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.hostinger.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USER = os.getenv("EMAIL_USER", "")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
EMAIL_TO = os.getenv("EMAIL_TO", "")

print("=" * 60)
print("🧪 Testing Hostinger Email SMTP Connection")
print("=" * 60)
print(f"📧 SMTP Host: {EMAIL_HOST}")
print(f"🔌 SMTP Port: {EMAIL_PORT}")
print(f"👤 Email User: {EMAIL_USER}")
print(f"🔑 Password Set: {'Yes' if EMAIL_PASSWORD else 'No'}")
print(f"📬 Send To: {EMAIL_TO}")
print("=" * 60)

if not EMAIL_USER or not EMAIL_PASSWORD:
    print("❌ ERROR: Email credentials not configured in .env file")
    exit(1)

try:
    print("\n🔄 Step 1: Connecting to SMTP server...")
    server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT, timeout=10)
    print("✅ Connected successfully!")
    
    print("\n🔄 Step 2: Starting TLS encryption...")
    server.starttls()
    print("✅ TLS enabled!")
    
    print("\n🔄 Step 3: Authenticating with credentials...")
    server.login(EMAIL_USER, EMAIL_PASSWORD)
    print("✅ Authentication successful!")
    
    print("\n🔄 Step 4: Creating test email...")
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = EMAIL_TO
    msg['Subject'] = '✅ Test Email from VegaKash.AI Backend'
    
    body = """
    This is a test email from VegaKash.AI feedback system.
    
    If you're receiving this, the email configuration is working correctly!
    
    Configuration Details:
    - SMTP Host: {host}
    - SMTP Port: {port}
    - From Email: {from_email}
    
    Timestamp: {timestamp}
    
    ---
    VegaKash.AI Feedback System
    """.format(
        host=EMAIL_HOST,
        port=EMAIL_PORT,
        from_email=EMAIL_USER,
        timestamp=__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )
    
    msg.attach(MIMEText(body, 'plain'))
    print("✅ Email created!")
    
    print("\n🔄 Step 5: Sending email...")
    server.send_message(msg)
    print("✅ Email sent successfully!")
    
    server.quit()
    
    print("\n" + "=" * 60)
    print("🎉 SUCCESS! Email test completed successfully!")
    print(f"📬 Check your inbox: {EMAIL_TO}")
    print("=" * 60)
    
except smtplib.SMTPAuthenticationError as e:
    print(f"\n❌ AUTHENTICATION FAILED!")
    print(f"Error: {e}")
    print("\n💡 Possible solutions:")
    print("   1. Double-check your email password in .env file")
    print("   2. Verify the email exists in Hostinger panel")
    print("   3. Try resetting the email password in Hostinger")
    
except smtplib.SMTPConnectError as e:
    print(f"\n❌ CONNECTION FAILED!")
    print(f"Error: {e}")
    print("\n💡 Possible solutions:")
    print("   1. Check if smtp.hostinger.com is accessible")
    print("   2. Verify port 587 is not blocked by firewall")
    
except smtplib.SMTPException as e:
    print(f"\n❌ SMTP ERROR!")
    print(f"Error: {e}")
    
except Exception as e:
    print(f"\n❌ UNEXPECTED ERROR!")
    print(f"Error: {e}")
    print(f"Error Type: {type(e).__name__}")
