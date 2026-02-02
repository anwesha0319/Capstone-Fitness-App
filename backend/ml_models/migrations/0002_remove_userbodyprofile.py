# Generated migration to remove UserBodyProfile model

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ml_models', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='UserBodyProfile',
        ),
    ]
