from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.status import HTTP_201_CREATED as created
from rest_framework.status import HTTP_409_CONFLICT as conflict
from rest_framework.status import HTTP_400_BAD_REQUEST as bad_request
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .serializer import UserSerializer as US
from .models import User
from .serializer import UserDetailsViewSerializer as UDV
from .serializer import UserLoginSerializer as ULS
from django.db import IntegrityError
from .token_gen import get_tokens_for_user;


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


class LoginUser(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        user_credentials = ULS(data=request.data)
        if user_credentials.is_valid():
            is_user_authenticated = authenticate(
                username=user_credentials.validated_data["username"],
                password=user_credentials.validated_data["password"],
            )
            if is_user_authenticated:
                user = User.objects.get(username=user_credentials.validated_data["username"])
                token = get_tokens_for_user(user)
                return Response(token,status=200)
            else:
                return Response("Invalid Login Credentials",status=401)
        else:
            return Response("Validation Failed",400)    
                
                
