from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_application_confirmation(candidate_email, candidate_name, job_title, company):
    """Send confirmation email to candidate upon successful application."""
    send_mail(
        subject=f"Application Submitted – {job_title} at {company}",
        message=f"""Dear {candidate_name},

Thank you for applying for the position of {job_title} at {company} through Optimus Manpower.

Your application has been received and is currently under review. Our team will get back to you shortly.

Best regards,
Optimus Manpower Team
Chennai, India""",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[candidate_email],
        fail_silently=True,
    )


@shared_task
def notify_admin_new_application(admin_email, candidate_name, job_title, application_id):
    """Notify admin when a new application is submitted."""
    send_mail(
        subject=f"New Application Received – {job_title}",
        message=f"""Hello Admin,

A new application has been received for the position of {job_title}.

Applicant: {candidate_name}
Application ID: {application_id}

Please login to the admin panel to review this application.

Optimus Manpower Platform""",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[admin_email],
        fail_silently=True,
    )
