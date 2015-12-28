from django.shortcuts import render
from django.http import HttpResponse

from com.asv.web.models import Dev
from lin.core import web

from django.views.decorators.csrf import csrf_protect



@web.path('dev/list.action')
@web.json
# def test(request,**params):
def devList(request):
    print('***************')
    #csrf_protect()
    # return HttpResponse('ok==.')
    # dev = Dev();
    # dev.title = "title"
    # dev.order = 1;
    #
    # dev.save();
    #
    # dev2 = Dev();
    # dev2.title = "title"
    # dev2.order = 1;
    #
    # dev2.save();
    #
    # # return dev
    # return [dev,dev2]
    return ['one','two']
