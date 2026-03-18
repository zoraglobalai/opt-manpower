from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # ── Auth ──────────────────────────────────────────────────────────────────
    path('login/', views.LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', views.MeView.as_view(), name='me'),

    # ── Guest Applications ────────────────────────────────────────────────────
    path('apply-job/', views.ApplyJobView.as_view(), name='apply-job'),

    # ── Public Jobs ───────────────────────────────────────────────────────────
    path('jobs/', views.JobListView.as_view(), name='job-list'),
    path('jobs/<uuid:pk>/', views.JobDetailView.as_view(), name='job-detail'),

    # ── Public Content ────────────────────────────────────────────────────────
    path('testimonials/', views.TestimonialListView.as_view(), name='testimonials'),
    path('career-advice/', views.CareerAdviceListView.as_view(), name='career-advice'),
    path('career-advice/<int:pk>/', views.CareerAdviceDetailView.as_view(), name='career-advice-detail'),
    path('employer-enquiry/', views.EmployerEnquiryCreateView.as_view(), name='employer-enquiry'),

    # ── Admin ─────────────────────────────────────────────────────────────────
    path('admin/dashboard/', views.AdminDashboardStatsView.as_view(), name='admin-dashboard'),
    path('admin/analytics/', views.AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('admin/jobs/', views.AdminAllJobsView.as_view(), name='admin-jobs-list'),
    path('admin/jobs/create/', views.AdminJobCreateView.as_view(), name='admin-job-create'),
    path('admin/jobs/<uuid:pk>/', views.AdminJobUpdateDeleteView.as_view(), name='admin-job-detail'),
    path('admin/applications/', views.AdminApplicationsView.as_view(), name='admin-applications'),
    path('admin/applications/<uuid:pk>/status/', views.AdminApplicationStatusUpdateView.as_view(), name='admin-app-status'),
    path('admin/enquiries/', views.AdminEnquiriesView.as_view(), name='admin-enquiries'),
]
