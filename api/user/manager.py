from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError("usename Mandatory")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user