from rest_framework_simplejwt.views import TokenObtainPairView


# Custom Login View that sets JWT tokens in HttpOnly cookies.
class CookieTokenObtainPairView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:  # If login is successful

            # Set tokens as secure cookies
            response.set_cookie(
                key="access_token",
                value=response.data["access"],
                httponly=True,
                secure=True,
                samesite="Strict",
                max_age=60 * 60 * 24 * 7,  # 7 days
            )

            # Remove tokens from response body (don't leak to client)
            response.data.pop("access", None)
            response.data.pop("refresh", None)

        return response
