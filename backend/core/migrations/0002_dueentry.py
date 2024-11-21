from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DueEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('description', models.TextField()),
                ('purchase_date', models.DateField()),
                ('due_date', models.DateField()),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('paid', 'Paid'), ('overdue', 'Overdue')], default='pending', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('retailer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_dues', to='core.userprofile')),
                ('supplier', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='given_dues', to='core.userprofile')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]