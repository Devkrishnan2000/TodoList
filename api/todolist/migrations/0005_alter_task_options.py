# Generated by Django 4.2.4 on 2023-09-11 11:43

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("todolist", "0004_alter_task_options_alter_task_table"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="task",
            options={"ordering": ["id"], "verbose_name": "TodoList"},
        ),
    ]
