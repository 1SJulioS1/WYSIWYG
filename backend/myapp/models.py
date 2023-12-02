from django.db import models

# Create your models here.
from django.db import models


class Document(models.Model):
    content_html = models.TextField()
