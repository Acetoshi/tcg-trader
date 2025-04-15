from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from accounts.serializers import UserDetailsSerializer

# View to return the authenticated user's details.


class UserDetailsView(APIView):

    def get(self, request):
        try:
            user = request.user

            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "tcgpId": user.tcgp_id,
                "bio": user.bio,
                "avatarUrl": user.avatarUrl,
            }

            return Response(user_data, status=status.HTTP_200_OK)

        except AttributeError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        except Exception:
            return Response(
                {"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        serializer = UserDetailsSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = request.user

            new_username = serializer.validated_data.get("username")
            new_tcgp_id = serializer.validated_data.get("tcgpId")
            new_bio = serializer.validated_data.get("bio")

            user.username = new_username
            user.bio = new_bio
            user.tcgp_id = new_tcgp_id

            print(user)

            user.save()

            return Response(status=status.HTTP_200_OK)

        except AttributeError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        except Exception:
            return Response(
                {"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
