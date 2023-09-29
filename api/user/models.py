from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from .manager import UserManager
# Create your models here.
class User(AbstractBaseUser):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100, null=True, blank=False)
    last_name = models.CharField(max_length=100, null=True, blank=False)
    date_created = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["password"]
    objects = UserManager()

    class Meta:
        db_table = "tblUsers"        

