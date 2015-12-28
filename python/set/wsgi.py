#!/usr/bin/python
"""
WSGI config for zqxt_views project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

# import os
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "set.settings")
#
# from django.core.wsgi import get_wsgi_application
# application = get_wsgi_application()



import os
from os.path import join,dirname,abspath

PROJECT_DIR = os.path.dirname(os.path.dirname(__file__))#3
import sys # 4
sys.path.insert(0,PROJECT_DIR) # 5


os.environ["DJANGO_SETTINGS_MODULE"] = "set.settings" # 7

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
