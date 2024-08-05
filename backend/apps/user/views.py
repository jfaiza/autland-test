from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# myapp/views.py

from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from .authentication import APIKeyAuthentication
from .permissions import IsProjectOwner

class ProtectedView(GenericAPIView):
    authentication_classes = [APIKeyAuthentication]
    permission_classes = [IsProjectOwner]

    def get(self, request, *args, **kwargs):
        return Response({"message": "You have access to this view"})
