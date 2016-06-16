"""
Django settings for zqxt_views project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'u-%$&n7ktd+$+99f7otyki(xp(-@lybj0c2rp=*y9kt#$9h!gs'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    # 'django.contrib.admin',
    # 'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    # 'django.contrib.messages',
    'django.contrib.staticfiles',
    'lin.core.auth',
    'com.asv.web',
    'lin.core'
    # ,
    # 'calc'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    # 'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    # 'django.contrib.auth.middleware.AuthenticationMiddleware',
    # 'django.contrib.messages.middleware.MessageMiddleware',
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'set.urls'



WSGI_APPLICATION = 'set.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     #'ENGINE': 'sqlite3',
    #     'NAME': os.path.join(BASE_DIR, 'db.sqlite3')
    #     #'NAME':':memory:'
    # }
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'as-v',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': '127.0.0.1',
        'PORT': '3306',
        'OPTIONS':{
             'autocommit': True
        }
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/s/'
#STATIC_ROOT = os.path.join(BASE_DIR, 'static')
#print(STATIC_ROOT)
STATICFILES_DIRS = (
    # os.path.join(BASE_DIR, "./static"),
    os.path.join(BASE_DIR, "../dist/static"),
    # os.path.join(BASE_DIR, "../web/dist"),
)

TEMPLATE_DIRS = (
# './templates',
    os.path.join(BASE_DIR, "./static"),
    os.path.join(BASE_DIR, "../dist/static")
)


#'django.template.context_processors.csrf',
# 'django.contrib.auth.context_processors.auth',
# 'django.template.context_processors.debug',
# 'django.template.context_processors.i18n',
# 'django.template.context_processors.media',
# 'django.template.context_processors.static',
# 'django.template.context_processors.tz',
# 'django.contrib.messages.context_processors.messages')

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.template.context_processors.debug',
    'django.template.context_processors.i18n',
    'django.template.context_processors.media',
    'django.template.context_processors.static'
)
# TEMPLATE_CONTEXT_PROCESSORS = (
#django.template.context_processors.csrf



#     'django.core.context_processors.debug',
#     'django.core.context_processors.i18n',
#     'django.core.context_processors.media',
#     'django.core.context_processors.static',
#     'django.contrib.auth.context_processors.auth',
#     'django.contrib.messages.context_processors.messages',
# )


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console':{
            'level':'DEBUG',
            'class':'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'propagate': True,
            'level':'DEBUG',
        },
    }
}