from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Job, CandidateApplication, Testimonial, CareerAdvice,
    EmployerEnquiry
)

User = get_user_model()

# ── Auth ──────────────────────────────────────────────────────────────────────

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']

# ── Jobs ──────────────────────────────────────────────────────────────────────

class JobSerializer(serializers.ModelSerializer):
    posted_by_name = serializers.SerializerMethodField()
    application_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'

    def get_posted_by_name(self, obj):
        if obj.posted_by:
            return f"{obj.posted_by.first_name} {obj.posted_by.last_name}".strip()
        return None

    def get_application_count(self, obj):
        return obj.applications.count()


class JobListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company_name', 'location', 'country',
            'experience', 'salary', 'salary_min', 'salary_max',
            'job_type', 'category', 'industry', 'is_international',
            'status', 'created_at', 'deadline',
        ]

# ── Applications ──────────────────────────────────────────────────────────────

class CandidateApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.company_name', read_only=True)
    job_location = serializers.CharField(source='job.location', read_only=True)

    class Meta:
        model = CandidateApplication
        fields = '__all__'
        read_only_fields = ['status', 'created_at', 'updated_at']


class CandidateApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateApplication
        exclude = ['status']

    def validate_resume(self, value):
        allowed_types = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]
        if value.content_type not in allowed_types:
            raise serializers.ValidationError("Only PDF, DOC, DOCX files are allowed.")
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File size must not exceed 5MB.")
        return value

    def validate(self, attrs):
        job = attrs.get('job')
        email = attrs.get('email')
        if job and email and CandidateApplication.objects.filter(email=email, job=job).exists():
            raise serializers.ValidationError("An application with this email already exists for this job.")
        return attrs

# ── Public Content ────────────────────────────────────────────────────────────

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class CareerAdviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerAdvice
        fields = '__all__'

class EmployerEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerEnquiry
        fields = '__all__'
        read_only_fields = ['is_read', 'created_at']
