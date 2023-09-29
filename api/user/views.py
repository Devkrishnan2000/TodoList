from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.status import HTTP_201_CREATED as created
from rest_framework.status import HTTP_409_CONFLICT as conflict
from rest_framework.status import HTTP_400_BAD_REQUEST as bad_request
from rest_framework.response import Response
from .serializer import UserSerializer as US
from .models import User
from .serializer import UserDetailsViewSerializer as UDV
from django.db import IntegrityError


# Create your views here.
class CreateUser(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serialized_data = US(data=request.data)
        if serialized_data.is_valid():
            try:
                serialized_data.save()
                return Response(
                    {
                        "message": "User Created Successfully",
                        "data": serialized_data.data,
                    },
                    status=created,
                )
            except IntegrityError as e:
                return Response(
                    {"message": "User with same name already exist's", "data": str(e)},
                    status=conflict,
                )
        else:
            return Response(
                {"message": "Validation Error", "data": str(serialized_data.errors)},
                status=bad_request,
            )


class GetUserDetails(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user_id = request.user.id
        user = UDV(User.objects.get(id=user_id))
        return Response(user.data)
