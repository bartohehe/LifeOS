from django.contrib import admin
from .models import Activity


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'duration_minutes', 'xp_gained', 'logged_at')
    list_filter = ('category', 'logged_at')
    search_fields = ('title', 'user__username')
