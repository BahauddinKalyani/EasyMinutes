import email, smtplib, ssl

from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(email):
    # port = 465  # For SSL
    # smtp_server = "smtp.gmail.com"
    # sender_email = "termproject3406@gmail.com"  # Enter your address
    # receiver_email = "timsbahad@gmail.com"  # Enter receiver address
    # password = "bads gbeq yibe jmcf"
    # message = """\
    # Subject: EasyMinutes - your meeting minutes are ready!

    # This message is sent from Python."""

    # context = ssl.create_default_context()
    # with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
    #     server.login(sender_email, password)
    #     server.sendmail(sender_email, receiver_email, message)
    
    subject = "EasyMinutes - your meeting minutes are ready!"
    body = "Your meeting minutes are ready! Please find the attached document."
    sender_email = "termproject3406@gmail.com"
    receiver_email = email
    password = "bads gbeq yibe jmcf"

    # Create a multipart message and set headers
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject
    message["Bcc"] = receiver_email  # Recommended for mass emails

    # Add body to email
    message.attach(MIMEText(body, "plain"))

    filename = "meeting_minutes.docx"  # In same directory as script

    # Open PDF file in binary mode
    with open(filename, "rb") as attachment:
        # Add file as application/octet-stream
        # Email client can usually download this automatically as attachment
        part = MIMEBase("application", "octet-stream")
        part.set_payload(attachment.read())

    # Encode file in ASCII characters to send by email    
    encoders.encode_base64(part)

    # Add header as key/value pair to attachment part
    part.add_header(
        "Content-Disposition",
        f"attachment; filename= {filename}",
    )

    # Add attachment to message and convert message to string
    message.attach(part)
    text = message.as_string()

    # Log in to server using secure context and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context, timeout=240) as server:
    # with smtplib.SMTP("smtp.gmail.com", 587, timeout=120) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, text)
        
    print('email sent to', email)