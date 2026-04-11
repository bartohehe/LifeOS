from rest_framework import generics, permissions
from .models import Player
from .serializers import PlayerSerializer


class PlayerView(generics.RetrieveAPIView):
    serializer_class = PlayerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return Player.objects.select_related('stats').get(user=self.request.user)
