import aiosmtplib
import ssl

from email.message import EmailMessage

from app.core.config import settings


async def send_email_otp(
    receiver_email: str,
    otp: str
):

    message = EmailMessage()

    message["From"] = settings.MAIL_FROM
    message["To"] = receiver_email
    message["Subject"] = "Alumni Portal Email Verification OTP"

    message.set_content(
        f"Your OTP for Alumni Portal verification is: {otp}"
    )

    ssl_context = ssl.create_default_context()

    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE


    await aiosmtplib.send(
        message,
    hostname=settings.MAIL_SERVER,
    port=settings.MAIL_PORT,
    start_tls=True,
    username=settings.MAIL_USERNAME,
    password=settings.MAIL_PASSWORD,
    tls_context=ssl_context
)