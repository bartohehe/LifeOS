from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .services import analyze_day, plan_day


class AnalyzeDayView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            result = analyze_day(user=request.user)
            return Response(result)
        except NotImplementedError as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_501_NOT_IMPLEMENTED,
            )


class PlanDayView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            result = plan_day(user=request.user)
            return Response(result)
        except NotImplementedError as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_501_NOT_IMPLEMENTED,
            )
