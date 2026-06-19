from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def api_root(request):
    return JsonResponse({
        'status': 'ok',
        'service': 'optimus manpower backend',
        'health': '/api/health/',
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('django-admin/', admin.site.urls),
    path('api/', include('core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
