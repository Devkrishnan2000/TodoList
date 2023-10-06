from rest_framework import serializers
from .models import Task
from user.models import User
import re


def field_validation(attrs):
    re_exp = re.compile("[A-Za-z0-9\s]+")

    if bool(re_exp.fullmatch(attrs.get("task_name"))) is False:
        raise serializers.ValidationError(
            "Task name should only contain alpha numeric characters"
        )
    if attrs.get("task_desc"):
        if bool(re_exp.fullmatch(attrs.get("task_desc"))) is False:
            raise serializers.ValidationError(
                "Task description should only contain alpha numeric characters"
            )


class TaskViewSerializer(serializers.ModelSerializer):
    task_name = serializers.CharField(max_length=50)

    def validate(self, attrs):
        field_validation(attrs)
        user_tasks = Task.objects.filter(user_id=attrs.get("user").id).values()

        for user_task in user_tasks:
            if user_task["task_name"] == attrs.get("task_name"):
                raise serializers.ValidationError("Task Name Already Exists")

        return super().validate(attrs)

    class Meta:
        model = Task
        fields = "__all__"
        ordering = ["-id"]


class TaskUpdateSerializer(serializers.ModelSerializer):
    task_name = serializers.CharField(max_length=50)
    id = serializers.IntegerField()

    def validate(self, attrs):
        # regex for alphanumeric character
        field_validation(attrs)
        user_tasks = Task.objects.filter(user_id=attrs.get("user").id).values()

        for user_task in user_tasks:
            if user_task["task_name"] == attrs.get("task_name") and user_task[
                "id"
            ] != attrs.get("id"):
                raise serializers.ValidationError("Task Name Already Exists")

        return super().validate(attrs)

    class Meta:
        model = Task
        fields = "__all__"
        ordering = ["-id"]
