from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from base.api.serializers import UserSerializer
from rest_framework.response import Response


class GetUserProfile(RetrieveAPIView):
    """
        RetrieveAPIView for retrieving the profile of the authenticated user.

        Attributes:
        - serializer_class (Serializer): Serializer for the user profile.
        - permission_classes (list): List of permission classes required for
          accessing this view.

        Methods:
        - get_object(self): Retrieve the user profile associated with the
          authenticated user.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user