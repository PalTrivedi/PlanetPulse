from django.contrib import admin
from .models import Dam, Contact, LetUsKnow, Feedback


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at', 'is_responded')
    list_filter = ('is_responded', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)


@admin.register(LetUsKnow)
class LetUsKnowAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'organization', 'created_at', 'is_responded')
    list_filter = ('is_responded', 'created_at')
    search_fields = ('name', 'email', 'organization', 'message')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email', 'feedback')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)


admin.site.register(Dam)
