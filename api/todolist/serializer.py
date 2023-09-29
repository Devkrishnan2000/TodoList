from rest_framework import serializers
from .models import Task
from user.models import User
import re


class TaskViewSerializer(serializers.ModelSerializer):
    task_name = serializers.CharField(max_length=50)

    def validate(self, attrs):
        # regex for alphanumeric character
        re_exp = re.compile("[A-Za-z0-9\s]+")

        if bool(re_exp.fullmatch(attrs.get("task_name"))) is False:
            raise serializers.ValidationError(
                "Task name should only contain alpha numeric characters"
            )
        if attrs.get("task_desc"):
            if bool(re_exp.fullmatch(attrs.get("task_desc"))) is False:
                raise serializers.ValidationError(
                    "Task desc should only contain alpha numeric characters"
                )
        userTasks = Task.objects.filter(user_id=attrs.get("user").id).values()
        for userTask in userTasks:
            if userTask["task_name"] == attrs.get("task_name"):
                raise serializers.ValidationError("Task Name Already Exists")
        return super().validate(attrs)

    class Meta:
        model = Task
        fields = "__all__"
        ordering = ["-id"]
