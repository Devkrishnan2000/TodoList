# Generated by Django 4.2.4 on 2023-09-09 07:23

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('todolist', '0002_task_task_status_task_version'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='task_created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='task',
            name='task_updated',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
