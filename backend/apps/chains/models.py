from django.db import models

class AutonityNetworks(models.Model):
    chain_id = models.CharField(max_length=255, unique=True)
    network_name = models.CharField(max_length=255)
    rpc_url = models.URLField()
    symbol = models.CharField(max_length=10)
    isHistoricActive = models.BooleanField(default=True)

    def __str__(self):
        return self.network_name
