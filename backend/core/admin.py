from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Job, CandidateApplication,
    Testimonial, CareerAdvice, EmployerEnquiry,
)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ['email']
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'is_staff']
    search_fields = ['email', 'first_name', 'last_name']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'company_name', 'location', 'country', 'job_type', 'status', 'created_at']
    list_filter = ['status', 'job_type', 'is_international', 'industry', 'country']
    search_fields = ['title', 'company_name', 'location', 'description']
    date_hierarchy = 'created_at'
    raw_id_fields = ['posted_by']
    list_editable = ['status']


@admin.register(CandidateApplication)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'job', 'status', 'created_at']
    list_filter = ['status', 'is_experienced']
    search_fields = ['name', 'email', 'job__title']
    date_hierarchy = 'created_at'
    list_editable = ['status']
    raw_id_fields = ['job']

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'is_active']
    list_editable = ['is_active']

@admin.register(CareerAdvice)
class CareerAdviceAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at']
    search_fields = ['title']
    prepopulated_fields = {'slug': ('title',)}

@admin.register(EmployerEnquiry)
class EmployerEnquiryAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'contact_person', 'email', 'number_of_positions', 'is_read', 'created_at']
    list_filter = ['is_read']
    list_editable = ['is_read']
    search_fields = ['company_name', 'email']
