# Generated by Django 4.0.4 on 2022-04-25 00:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=32),
            preserve_default=False,
        ),
    ]
