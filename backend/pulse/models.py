from django.db import models

# Create your models here.

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
