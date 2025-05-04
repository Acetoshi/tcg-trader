from rest_framework.response import Response
from rest_framework import status
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView
from rest_framework.permissions import IsAuthenticated
from modules.accounts.serializers import UserDetailsSerializer

# View to return the authenticated user's details.


class UserDetailsView(SlidingAuthBaseView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "tcgpId": user.tcgp_id,
                "bio": user.bio,
                "avatarUrl": user.avatar_url,
            }

            return Response(user_data, status=status.HTTP_200_OK)

        except AttributeError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        except Exception:
            return Response(
                {"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request):
        user = request.user
        serializer = UserDetailsSerializer(
            user, data=request.data, context={"request": request}, partial=True
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

        except AttributeError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        except Exception:
            return Response(
                {"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
