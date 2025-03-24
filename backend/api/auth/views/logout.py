from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime, timedelta

class LogoutView(APIView):

    def get(self, request):

        response = Response({"message": "Logged out successfully"}, status=200)

        response.set_cookie('access_token', '', expires=datetime.now() - timedelta(days=2), path='/', secure=True, httponly=True, samesite='Strict')
        response.set_cookie('refresh_token', '', expires=datetime.now() - timedelta(days=2), path='/', secure=True, httponly=True, samesite='Strict')

        return response