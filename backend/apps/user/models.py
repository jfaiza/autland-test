# myapp/models.py

from django.db import models
from django.contrib.auth.models import User

class APIKey(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    key = models.CharField(max_length=40, unique=True)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        super().save(*args, **kwargs)

    def generate_key(self):
        import binascii
        import os
        return binascii.hexlify(os.urandom(20)).decode()
