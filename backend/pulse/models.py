from django.db import models
from django.utils import timezone


class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    is_responded = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.subject}"


class LetUsKnow(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    organization = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    is_responded = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} from {self.organization or 'N/A'}"


class Feedback(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    feedback = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name} - Feedback"


class Dam(models.Model):
    name = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    capacity = models.CharField(max_length=100, blank=True)
    river = models.CharField(max_length=100, blank=True)
    type = models.CharField(max_length=100, blank=True)
    height = models.CharField(max_length=100, blank=True)
    year_completed = models.CharField(max_length=10, blank=True)
    purpose = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
