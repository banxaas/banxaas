# Generated by Django 4.0.4 on 2022-05-30 18:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_trade_status_alter_ad_sens_alter_ad_status_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trade',
            name='steps',
            field=models.CharField(choices=[('1', 'step 1'), ('2', 'step 2'), ('3', 'step 3'), ('4', 'step 4'), ('5', 'step 5'), ('6', 'step 6'), ('7', 'step 7'), ('8', 'step 8'), ('9', 'step 9'), ('10', 'step 10'), ('11', 'step 11'), ('12', 'step 12'), ('13', 'step 13')], max_length=2),
        ),
    ]
