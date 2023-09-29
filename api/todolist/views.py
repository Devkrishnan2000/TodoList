from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_400_BAD_REQUEST as bad_request
from rest_framework.status import HTTP_404_NOT_FOUND as not_found
from rest_framework.status import HTTP_201_CREATED as created
from rest_framework.status import HTTP_409_CONFLICT as conflict
from .serializer import TaskViewSerializer as tvs
from user.serializer import UserTaskViewSerializer as UTV
from user.models import User
from .models import Task
from .pagination import CustomPagination
from django.db import IntegrityError
import logging

logger = logging.getLogger(__name__)


def response_success(message, data):
    """called during successful response
    Args:
        message (str): type of message to be printed
        data (any): data to be shown

    Returns:
        _type_: dict
    """
    return {"message": message, "data": data}


def response_failure(message, error):
    """called during failed response

    Args:
        message (str): Type of message to be printed
        error (any): error code or message

    Returns:
        _type_: dict
    """
    return {"message": message, "error": error}


def get_by_status(task_status, task_sort,user_id):
    """Displays task by status

    Args:
        task_status (Boolean): True if task is completed
        False if task is pending
        task_sort (str): if "asc" then sorts ascending if desc
        then sorts decending

    Returns:
        _type_: boolean or queryset
    """
    if task_status == "True" or task_status == "False":
        if task_sort:  # sorts task based on query param
            if task_sort == "asc":
                result = Task.objects.filter(
                    task_status=eval(task_status)).order_by(
                    "task_created"
                ).filter(user_id=user_id)
            elif task_sort == "desc":
                result = Task.objects.order_by("-task_created").filter(
                    task_status=eval(task_status),user_id=user_id
                )
            else:
                result = False  # returns false on incorrect params
        else:
            result = Task.objects.filter(task_status=eval(task_status),user_id=user_id)
        return result
    else:
        return False


def get_all_tasks(task_sort,user_id):
    """Display's all task's
    Args:
        task_sort (str):if "asc" then sorts ascending if desc
        then sorts decending

    Returns:
        _type_: boolean or queryset
    """
    if task_sort:  # sorts task based on query param
        if task_sort == "asc":
            result = Task.objects.order_by("task_created").filter(user_id=user_id)
        elif task_sort == "desc":
            result = Task.objects.order_by("-task_created").filter(user_id=user_id)
        else:
            result = False  # returns false on incorrect params
    else:
        result = Task.objects.filter(user_id=user_id)
    return result


class CreateTask(APIView):
    """API for creating a task

    Args:
        APIView (_type_):

    Returns:
        _type_: Response
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request):
       
        request_data = request.data.copy() #using copy() because query dict is immutable
        # appends user id to the existing request data
        request_data["user"] = request.user.id
         # serializing data from request body using TaskCreationSerializer
        serialized = tvs(data=request_data)
        if serialized.is_valid():
            try:
                serialized.save()  # task saved to db
                return Response(
                    response_success(True, serialized.data),
                    status=created,
                )
            except IntegrityError as e:
                return Response(
                    response_failure("Task with same name Already Exists",str(e)),
                    status=conflict                  
                )   
        else:
            # displays validation error
            return Response(
                response_failure(
                    "Task Creation Failed", list(serialized.errors.items())
                ),
                status=bad_request,
            )


class ViewTasks(APIView, CustomPagination):
    """API for viewing task's

    Args:
        APIView (_type_):

    Returns:
        _type_: Response
    """

    permission_classes = (IsAuthenticated,)

  
    def get(self, request):
        # gets status,userid,sort from query params
        task_status = request.GET.get("status")
        user_id = request.user.id
        task_sort = request.GET.get("sort")
        if user_id:
            if task_status:
                result = get_by_status(task_status, task_sort,user_id)
            else:
                result = get_all_tasks(task_sort,user_id)
            if result is False:
                return Response(
                    response_failure(
                        "Failed !", "Incorrect params"), status=bad_request
                )

            result_page = CustomPagination.paginate_queryset(
                self, queryset=result, request=request
            )
            serialized = tvs(result_page, many=True)
            if len(serialized.data) > 0:
                result = {
                    "tasks": serialized.data,
                    # to return  total number of pages
                    "pages": self.page.paginator.num_pages,
                }
                return Response(response_success("Task List", result))
            else:
                # displays error if list empty
                return Response(
                    response_failure(
                        "List Empty !", serialized.data)
        
                )
        else:
            return Response(response_failure("User id required","No id found"),status=bad_request)        


class CloseTask(APIView):
    """API to close Task

    Args:
        APIView (_type_):

    Returns:
        _type_: Response
    """

    permission_classes = (IsAuthenticated,)

    def put(self, request, task_id):
        # gets task id from url
        user_id = request.user.id
        try:
            task_obj = Task.objects.get(id=task_id,user_id=user_id)
            task_obj.task_status = True
            task_obj.save()
            return Response("Task with id " + str(task_id) + " Closed !")
        except Task.DoesNotExist:
            # displays error if task not found
            return Response("Task not Found !! ", status=not_found)


class DeleteTask(APIView):
    """API to Delete Task

    Args:
        APIView (_type_):

    Returns:
        _type_: Response
    """

    permission_classes = (IsAuthenticated,)

    def delete(self, request, task_id):
        # gets task id from url
        user_id = request.user.id
        try:
            result = Task.objects.get(id=task_id,user_id=user_id).delete()
            if result[0]:
                return Response("Deleted Successfully")
            else:
                return Response(
                    response_failure(
                        "Failed !!", "Task not Found"), status=not_found
                )
        except Task.DoesNotExist:
            return Response("Task not Found !! ", status=not_found)


class UpdateTask(APIView):
    """API to Update Task

    Args:
        APIView (_type_):

    Returns:
        _type_: Response
    """

    permission_classes = (IsAuthenticated,)

    def put(self, request, task_id):
        user_id = request.user.id
        serialized = tvs(data=request.data, partial=True)
        if serialized.is_valid():
            try:
                db_value = Task.objects.get(id=task_id,user_id=user_id)
                # check's whether the local version and db version are same
                if db_value.version == serialized.validated_data["version"]:
                    # increments the version during update
                    db_value.version += 1
                    db_value.task_name = serialized.validated_data["task_name"]
                    db_value.task_desc = serialized.validated_data["task_desc"]
                    try:
                        db_value.save()
                        return Response(True)
                    except IntegrityError:
                        return Response("Task Already Exists",status=conflict)
                else:
                    return Response("Version mismatch !!", status=conflict)
            except Task.DoesNotExist:
                return Response("Task Doesn't Exist !!", status=not_found)

        else:
            return Response(
                response_failure(
                    "Validation Error", list(serialized.errors.items())),
                status=bad_request,
            )
