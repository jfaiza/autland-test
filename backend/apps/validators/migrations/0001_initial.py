# Generated by Django 4.2.13 on 2024-06-11 08:31

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Validator',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chain_id', models.IntegerField(default=-1)),
                ('validator_name', models.CharField(default='unknown', max_length=255)),
                ('node_address', models.CharField(max_length=255)),
                ('treasury', models.CharField(max_length=255)),
                ('commission_rate', models.CharField(max_length=255)),
                ('commission_rate_history', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(blank=True, default=list), blank=True, default=list, size=None)),
                ('voting_power', models.CharField(default='0', max_length=255)),
                ('voting_power_history', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(blank=True, default=list), blank=True, default=list, size=None)),
                ('bonded_stake', models.CharField(max_length=255)),
                ('bonded_stake_history', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(blank=True, default=list), blank=True, default=list, size=None)),
                ('self_bonded_stake', models.CharField(max_length=255)),
                ('registration_block', models.CharField(max_length=255)),
                ('total_slashed', models.CharField(max_length=255)),
                ('state', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('oracle_address', models.CharField(max_length=255)),
                ('enode', models.CharField(max_length=255)),
                ('consensus_key', models.CharField(max_length=255)),
                ('provable_fault_count', models.CharField(max_length=255)),
                ('self_unbonding_stake', models.CharField(max_length=255)),
                ('self_unbonding_shares', models.CharField(max_length=255)),
                ('self_unbonding_stake_locked', models.CharField(max_length=255)),
                ('unbonding_stake', models.CharField(max_length=255)),
                ('unbonding_shares', models.CharField(max_length=255)),
                ('liquid_contract', models.CharField(max_length=255)),
                ('liquid_supply', models.CharField(max_length=255)),
                ('jail_release_block', models.CharField(max_length=255)),
            ],
        ),
    ]
