from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from ...models import APIKey

class Command(BaseCommand):
    help = 'Generate API key for a user'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str)

    def handle(self, *args, **kwargs):
        username = kwargs['username']
        user = User.objects.get(username=username)
        api_key, created = APIKey.objects.get_or_create(user=user)
        if created:
            self.stdout.write(self.style.SUCCESS(f'API key created: {api_key.key}'))
        else:
            self.stdout.write(self.style.WARNING(f'API key already exists: {api_key.key}'))
