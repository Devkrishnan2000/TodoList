from django.urls import path
from . import views

urlpatterns = [
    path("register/",views.CreateUser.as_view(),name="create_user"),
    path("userdetails/",views.GetUserDetails.as_view(),name="create_user"),
    path("login/",views.LoginUser.as_view(),name="login_user")
]