import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(max_length=20, choices=[
        ('admin', 'Admin'),
    ], default='admin')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class Job(models.Model):
    INDUSTRY_CHOICES = [
        ('IT', 'Information Technology'),
        ('Healthcare', 'Healthcare'),
        ('Finance', 'Finance & Banking'),
        ('Engineering', 'Engineering'),
        ('Sales', 'Sales & Marketing'),
        ('HR', 'Human Resources'),
        ('Education', 'Education'),
        ('Construction', 'Construction'),
        ('Hospitality', 'Hospitality & Tourism'),
        ('Logistics', 'Logistics & Supply Chain'),
        ('Manufacturing', 'Manufacturing'),
        ('Legal', 'Legal'),
        ('Other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    posted_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='posted_jobs', help_text="Admin who posted this job"
    )
    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    experience = models.CharField(max_length=50)
    experience_min = models.PositiveIntegerField(default=0, help_text="Min years of experience")
    experience_max = models.PositiveIntegerField(default=99, help_text="Max years of experience")
    salary = models.CharField(max_length=100, blank=True)
    salary_min = models.PositiveIntegerField(null=True, blank=True, help_text="Min salary (monthly, USD)")
    salary_max = models.PositiveIntegerField(null=True, blank=True, help_text="Max salary (monthly, USD)")
    job_type = models.CharField(max_length=50, choices=[
        ('Full Time', 'Full Time'),
        ('Part Time', 'Part Time'),
        ('Contract', 'Contract'),
    ])
    category = models.CharField(max_length=100)
    industry = models.CharField(max_length=100, choices=INDUSTRY_CHOICES, default='Other')
    visa_type = models.CharField(max_length=100, blank=True, help_text="For international jobs")
    deadline = models.DateField(null=True, blank=True)
    is_international = models.BooleanField(default=False)
    requirements = models.TextField(blank=True)
    benefits = models.TextField(blank=True)
    views_count = models.PositiveIntegerField(default=0)

    status = models.CharField(max_length=20, choices=[
        ('Published', 'Published'),
        ('Draft', 'Draft'),
        ('Closed', 'Closed'),
    ], default='Published')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['country', 'status']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['industry', 'status']),
        ]

    def __str__(self):
        return self.title

class CandidateApplication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')

    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    is_experienced = models.BooleanField(default=False)
    years_of_experience = models.CharField(max_length=50, blank=True)
    previous_company = models.CharField(max_length=255, blank=True)
    role = models.CharField(max_length=255, blank=True)
    qualification = models.CharField(max_length=255)
    
    resume = models.FileField(upload_to='resumes/')

    STATUS_CHOICES = [
        ('Applied', 'Applied'),
        ('Under Review', 'Under Review'),
        ('Shortlisted', 'Shortlisted'),
        ('Interview Scheduled', 'Interview Scheduled'),
        ('Rejected', 'Rejected'),
        ('Hired', 'Hired'),
    ]
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Applied')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} -> {self.job.title}"

class Testimonial(models.Model):
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    review = models.TextField()
    photo = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class CareerAdvice(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, null=True)
    content = models.TextField()
    excerpt = models.CharField(max_length=300, blank=True)
    image = models.ImageField(upload_to='blog/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class EmployerEnquiry(models.Model):
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    hiring_requirement = models.CharField(max_length=255)
    number_of_positions = models.IntegerField(default=1)
    job_location = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
