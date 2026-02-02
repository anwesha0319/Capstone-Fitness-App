from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'created_at']
    search_fields = ['email', 'username']
    list_filter = ['created_at', 'gender', 'fitness_goal']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Account Info', {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'date_of_birth')}),
        ('Fitness Info', {'fields': ('height', 'weight', 'gender', 'fitness_goal')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
