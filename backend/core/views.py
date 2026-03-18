from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta

from rest_framework import generics, status, permissions, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import authenticate, get_user_model
from django.conf import settings

from .models import Job, CandidateApplication, Testimonial, CareerAdvice, EmployerEnquiry
from .serializers import (
    UserSerializer, JobSerializer, JobListSerializer,
    CandidateApplicationSerializer, CandidateApplicationCreateSerializer,
    TestimonialSerializer, CareerAdviceSerializer, EmployerEnquirySerializer
)
from .tasks import send_application_confirmation, notify_admin_new_application

User = get_user_model()

# ── Permissions ───────────────────────────────────────────────────────────────

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

# ── Auth Views ────────────────────────────────────────────────────────────────

class LoginThrottle(AnonRateThrottle):
    rate = '10/minute'

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LoginThrottle]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user and user.role == 'admin':
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        user = request.user
        data = request.data
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        user.save()
        return Response(UserSerializer(user).data)

# ── Public Job Views ──────────────────────────────────────────────────────────

class JobListView(generics.ListAPIView):
    serializer_class = JobListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'job_type', 'country', 'is_international', 'industry']
    search_fields = ['title', 'company_name', 'location', 'description']
    ordering_fields = ['created_at', 'title', 'salary_min']

    def get_queryset(self):
        from django.db import connection
        qs = Job.objects.filter(status='Published')

        q = self.request.query_params.get('q')
        if q:
            if connection.vendor == 'postgresql':
                try:
                    vector = SearchVector('title', weight='A') + SearchVector('description', weight='B') + SearchVector('location', weight='C')
                    query = SearchQuery(q)
                    qs = qs.annotate(rank=SearchRank(vector, query)).filter(rank__gte=0.01).order_by('-rank')
                except Exception:
                    qs = qs.filter(
                        Q(title__icontains=q) | Q(description__icontains=q) | Q(location__icontains=q) | Q(company_name__icontains=q)
                    )
            else:
                qs = qs.filter(
                    Q(title__icontains=q) | Q(description__icontains=q) | Q(location__icontains=q) | Q(company_name__icontains=q)
                )

        location = self.request.query_params.get('location')
        if location:
            qs = qs.filter(location__icontains=location)

        exp_min = self.request.query_params.get('experience_min')
        if exp_min:
            qs = qs.filter(experience_max__gte=int(exp_min))

        exp_max = self.request.query_params.get('experience_max')
        if exp_max:
            qs = qs.filter(experience_min__lte=int(exp_max))

        salary_min = self.request.query_params.get('salary_min')
        if salary_min:
            qs = qs.filter(salary_max__gte=int(salary_min))

        salary_max = self.request.query_params.get('salary_max')
        if salary_max:
            qs = qs.filter(salary_min__lte=int(salary_max))

        return qs


class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.filter(status='Published')
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Job.objects.filter(pk=instance.pk).update(views_count=instance.views_count + 1)
        return Response(JobSerializer(instance).data)


# ── Guest Application API ─────────────────────────────────────────────────────

class ApplyJobView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = CandidateApplicationCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            application = serializer.save()
            try:
                send_application_confirmation.delay(
                    application.email,
                    application.name,
                    application.job.title,
                    application.job.company_name
                )
                admin_users = User.objects.filter(role='admin', is_active=True)
                for admin in admin_users:
                    notify_admin_new_application.delay(
                        admin.email, application.name,
                        application.job.title, str(application.id)
                    )
            except Exception:
                pass
            return Response(CandidateApplicationSerializer(application).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── Public Content Views ──────────────────────────────────────────────────────

class TestimonialListView(generics.ListAPIView):
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.AllowAny]

class CareerAdviceListView(generics.ListAPIView):
    queryset = CareerAdvice.objects.all().order_by('-created_at')
    serializer_class = CareerAdviceSerializer
    permission_classes = [permissions.AllowAny]

class CareerAdviceDetailView(generics.RetrieveAPIView):
    queryset = CareerAdvice.objects.all()
    serializer_class = CareerAdviceSerializer
    permission_classes = [permissions.AllowAny]

class EmployerEnquiryCreateView(generics.CreateAPIView):
    queryset = EmployerEnquiry.objects.all()
    serializer_class = EmployerEnquirySerializer
    permission_classes = [permissions.AllowAny]

# ── Admin Views ───────────────────────────────────────────────────────────────

class AdminJobCreateView(generics.CreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAdmin]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

class AdminJobUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAdmin]

class AdminAllJobsView(generics.ListAPIView):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [IsAdmin]

class AdminApplicationsView(generics.ListAPIView):
    queryset = CandidateApplication.objects.all().select_related('job').order_by('-created_at')
    serializer_class = CandidateApplicationSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'job', 'is_experienced', 'years_of_experience']
    search_fields = ['name', 'email', 'job__title']

class AdminApplicationStatusUpdateView(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, pk):
        application = get_object_or_404(CandidateApplication, pk=pk)
        new_status = request.data.get('status')
        valid = [s[0] for s in CandidateApplication.STATUS_CHOICES]
        if new_status not in valid:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        application.status = new_status
        application.save()
        return Response(CandidateApplicationSerializer(application).data)

class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        return Response({
            'total_jobs': Job.objects.count(),
            'published_jobs': Job.objects.filter(status='Published').count(),
            'total_applications': CandidateApplication.objects.count(),
            'total_enquiries': EmployerEnquiry.objects.count(),
            'recent_applications': CandidateApplicationSerializer(
                CandidateApplication.objects.select_related('job').order_by('-created_at')[:5], many=True
            ).data,
        })

class AdminAnalyticsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        twelve_months_ago = timezone.now() - timedelta(days=365)
        monthly_apps = (
            CandidateApplication.objects
            .filter(created_at__gte=twelve_months_ago)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        monthly_jobs = (
            Job.objects
            .filter(created_at__gte=twelve_months_ago)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        top_categories = list(Job.objects.filter(status='Published').values('category').annotate(count=Count('id')).order_by('-count')[:8])
        top_industries = list(Job.objects.filter(status='Published').values('industry').annotate(count=Count('id')).order_by('-count')[:8])
        top_locations = list(Job.objects.filter(status='Published').values('country').annotate(count=Count('id')).order_by('-count')[:8])
        status_breakdown = list(CandidateApplication.objects.values('status').annotate(count=Count('id')).order_by('-count'))

        return Response({
            'monthly_applications': [{'month': item['month'].strftime('%b %Y'), 'count': item['count']} for item in monthly_apps],
            'monthly_jobs': [{'month': item['month'].strftime('%b %Y'), 'count': item['count']} for item in monthly_jobs],
            'top_categories': top_categories,
            'top_industries': top_industries,
            'top_locations': top_locations,
            'status_breakdown': status_breakdown,
        })

class AdminEnquiriesView(generics.ListAPIView):
    queryset = EmployerEnquiry.objects.all().order_by('-created_at')
    serializer_class = EmployerEnquirySerializer
    permission_classes = [IsAdmin]
