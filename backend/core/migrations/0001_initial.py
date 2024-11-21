from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_type', models.CharField(choices=[('supplier', 'Supplier'), ('retailer', 'Retailer')], max_length=10)),
                ('business_name', models.CharField(max_length=100)),
                ('phone', models.CharField(max_length=15)),
                ('gst_number', models.CharField(max_length=15)),
                ('address', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='RetailerProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pan_number', models.CharField(max_length=10)),
                ('annual_turnover', models.DecimalField(decimal_places=2, max_digits=12)),
                ('years_in_business', models.IntegerField()),
                ('business_type', models.CharField(max_length=50)),
                ('shop_ownership', models.CharField(choices=[('owned', 'Owned'), ('rented', 'Rented')], max_length=20)),
                ('existing_bank_account', models.BooleanField(default=True)),
                ('bank_statement_score', models.IntegerField(blank=True, null=True)),
                ('credit_score', models.IntegerField(blank=True, null=True)),
                ('user_profile', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.userprofile')),
            ],
        ),
        migrations.CreateModel(
            name='CreditLimit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_limit', models.DecimalField(decimal_places=2, max_digits=10)),
                ('available_limit', models.DecimalField(decimal_places=2, max_digits=10)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('credit_score', models.IntegerField()),
                ('assessment_date', models.DateTimeField(auto_now_add=True)),
                ('retailer', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.userprofile')),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('description', models.CharField(max_length=200)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('due_date', models.DateTimeField()),
                ('retailer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_transactions', to='core.userprofile')),
                ('supplier', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='supplied_transactions', to='core.userprofile')),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('payment_date', models.DateTimeField(auto_now_add=True)),
                ('payment_method', models.CharField(max_length=50)),
                ('status', models.CharField(max_length=10)),
                ('reference_id', models.CharField(max_length=100)),
                ('transaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.transaction')),
            ],
        ),
    ]