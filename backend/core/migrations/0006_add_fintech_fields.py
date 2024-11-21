from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_retailerprofile_available_credit_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='registration_number',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='license_number',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='credit_limit',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='interest_rate',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
    ]