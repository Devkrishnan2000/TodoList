# Generated by Django 4.2.4 on 2023-09-09 06:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todolist', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='task_status',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='task',
            name='version',
            field=models.IntegerField(default=1),
        ),
    ]
