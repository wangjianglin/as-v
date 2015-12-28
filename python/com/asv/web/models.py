from django.db import models
import json

class Dev(models.Model):
    title = models.CharField(max_length=30)
    order = models.IntegerField()


class DevItem(models.Model):
    title = models.CharField(max_length=30)
    date = models.DateField();
    order = models.IntegerField();

    dev = models.ForeignKey(Dev, related_name='dev_id')

    # class Meta:
    #     permissions = (
    #         ("can_drive", "Can drive"),
    #         ("can_vote", "Can vote in elections"),
    #         ("can_drink", "Can drink alcohol"),
    #     )