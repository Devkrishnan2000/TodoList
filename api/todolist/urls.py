from django.urls import path
from . import views

urlpatterns = [
    path("view-tasks/", views.ViewTasks.as_view(), name="view-tasks"),
    path("create-task/", views.CreateTask.as_view(), name="create-task"),
    path(
        "close-task/<int:task_id>/",
        views.CloseTask.as_view(),
        name="close-task"
    ),
    path(
        "delete-task/<int:task_id>/",
        views.DeleteTask.as_view(),
        name="delete-task"
    ),
    path(
        "update-task/<int:task_id>/",
        views.UpdateTask.as_view(),
        name="update-task"
    ),
]
