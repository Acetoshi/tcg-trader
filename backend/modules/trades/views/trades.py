from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from modules.accounts.auth_utils.silding_auth_base_view import SlidingAuthBaseView
from modules.trades.serializers.create_trade import CreateTradeSerializer
from modules.trades.serializers.update_trade import UpdateTradeSerializer


class TradesView(SlidingAuthBaseView):
    permission_classes = [IsAuthenticated]

    # this method will create a trade from an opportunity
    def post(self, request):
        serializer = CreateTradeSerializer(data=request.data, context={"user": request.user})

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            new_trade = serializer.save()
            return Response({"id": new_trade.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # this method will edit the status of a trade transaction
    def patch(self, request):
        serializer = UpdateTradeSerializer(data=request.data, context={"user": request.user})

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            trade = serializer.save()
            return Response({"statusCode": trade.status.code}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
