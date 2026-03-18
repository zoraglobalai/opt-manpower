from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        # ── CandidateProfile new fields ────────────────────────────────────────
        migrations.AddField(
            model_name='candidateprofile',
            name='headline',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='candidateprofile',
            name='current_location',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='candidateprofile',
            name='linkedin_url',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='candidateprofile',
            name='portfolio_url',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='candidateprofile',
            name='cv_file',
            field=models.FileField(blank=True, null=True, upload_to='candidate_cvs/'),
        ),
        migrations.AddField(
            model_name='candidateprofile',
            name='profile_photo',
            field=models.ImageField(blank=True, null=True, upload_to='profile_photos/'),
        ),
        migrations.AddField(
            model_name='candidateprofile',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),

        # ── RecruiterProfile ───────────────────────────────────────────────────
        migrations.CreateModel(
            name='RecruiterProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=255)),
                ('company_website', models.URLField(blank=True)),
                ('phone', models.CharField(blank=True, max_length=20)),
                ('industry', models.CharField(blank=True, max_length=100)),
                ('location', models.CharField(blank=True, max_length=255)),
                ('description', models.TextField(blank=True)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='company_logos/')),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='recruiter_profile',
                    to='core.user',
                )),
            ],
        ),

        # ── Job new fields ─────────────────────────────────────────────────────
        migrations.AddField(
            model_name='job',
            name='posted_by',
            field=models.ForeignKey(
                blank=True, null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='posted_jobs',
                to='core.user',
            ),
        ),
        migrations.AddField(
            model_name='job',
            name='industry',
            field=models.CharField(default='Other', max_length=100),
        ),
        migrations.AddField(
            model_name='job',
            name='experience_min',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='job',
            name='experience_max',
            field=models.PositiveIntegerField(default=99),
        ),
        migrations.AddField(
            model_name='job',
            name='salary_min',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='salary_max',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='job',
            name='views_count',
            field=models.PositiveIntegerField(default=0),
        ),

        # ── Application unique_together ────────────────────────────────────────
        migrations.AddField(
            model_name='application',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterUniqueTogether(
            name='application',
            unique_together={('user', 'job')},
        ),

        # ── Testimonial new fields ─────────────────────────────────────────────
        migrations.AddField(
            model_name='testimonial',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='testimonial',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),

        # ── CareerAdvice new fields ────────────────────────────────────────────
        migrations.AddField(
            model_name='careeradvice',
            name='slug',
            field=models.SlugField(blank=True, unique=True, null=True),
        ),
        migrations.AddField(
            model_name='careeradvice',
            name='excerpt',
            field=models.CharField(blank=True, max_length=300),
        ),

        # ── EmployerEnquiry new fields ─────────────────────────────────────────
        migrations.AddField(
            model_name='employerenquiry',
            name='is_read',
            field=models.BooleanField(default=False),
        ),
    ]
