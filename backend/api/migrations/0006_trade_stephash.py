# Generated by Django 4.0.4 on 2023-08-02 18:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_ad_id_alter_paymentmethod_id_alter_trade_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='trade',
            name='stepHash',
            field=models.CharField(default='', max_length=256),
        ),
    ]
