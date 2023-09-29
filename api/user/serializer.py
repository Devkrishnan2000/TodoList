from rest_framework import serializers
from .models import User
from todolist.serializer import TaskViewSerializer
import re

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        ordering = ["id"]
    
    def create(self, validated_data):
        # create's a new user
        return User.objects.create_user(**validated_data)

    def validate(self, attrs):
        username_regexp = r'^[\w\.\+\-]+\@[\w]+\.[a-z]{2,3}$'
        name_regexp = "^[A-Za-z\s]+$"
        if not re.match(username_regexp, attrs["username"]):
            raise serializers.ValidationError(
                "username should be email"
            )
        if not re.match(name_regexp, attrs.get("first_name")):
            raise serializers.ValidationError(
                "first name can only contain alphabets"
            )
        if not re.match(name_regexp, attrs.get("last_name")):
            raise serializers.ValidationError(
                "last name can only contain alphabets"
            )
        return super().validate(attrs)    

class UserTaskViewSerializer(serializers.ModelSerializer):
    tasks = TaskViewSerializer()
    class Meta:
        model = User
        fields = "__all__"
        ordering = ["id"]
    
class UserDetailsViewSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ["first_name","last_name"]
        ordering = ["id"]
    