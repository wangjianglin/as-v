__author__ = 'lin'

import functools
import json as Json
from django.shortcuts import render
from django.http import HttpResponse


#from lin.core import tag;

__import__('lin.core.tags');

#from django.views.decorators.csrf import csrf_protect
import sys
#from com.asv.web import Index
import inspect

#
# class JsonResult(object):
#     def code;
#     pass

import json

class WebJSONEncoder(json.JSONEncoder):
    def default(self,obj):
        #convert object to a dict
        d = {}
        # d['__class__'] = obj.__class__.__name__
        # d['__module__'] = obj.__module__
        d.update(obj.__dict__)
        if not d.get('_state') is None :
            d.pop('_state')

        return d

def json(function):
    @functools.wraps(function)
    def wrapper(*args,**kwargs):
        try:
            result = function(*args,**kwargs)
        except BaseException as e:
            print(e);
        #print('result:'+result)
        # return HttpResponse(str(result));
        # _default_encoder = json.JSONEncoder(
        #     skipkeys=False,
        #     ensure_ascii=True,
        #     check_circular=True,
        #     allow_nan=True,
        #     indent=None,
        #     separators=None,
        #     default=None,
        # )
        # d = WebJSONEncoder();
        # d = _default_encoder
        # return HttpResponse(Json.dumps(result,cls=WebJSONEncoder),content_type="application/json")
        return HttpResponse(Json.dumps({'code':0,'result':result},cls=WebJSONEncoder),content_type="application/json")
    return wrapper;

paths = {}

def path(name):
    #print(name)
    # print('000000000000000000000000000')
    # return function
    def wrapper(function):
        # v = "a";
        # v.__len__()
        n = name;
        if n.startswith("/"):
            n = n[1:n.__len__()];
        paths[n] = function;
        return function
    return wrapper;

def addViewModel(model):
    # sys.modules[model]
    __import__(model)


#@csrf_protect
def action(request,name):
    print('========' + name + "=========")

    fun = paths[name+'.action'];
    return fun(request)


def html(request,name):
    print('========' + name + "=========")

    fun = paths[name+'.html'];
    return fun(request)



# def view(function):
#     @functools.wraps(function)
#     def wrapper(*args,**kwargs):
#         try:
#             result = function(*args,**kwargs)
#         except BaseException as e:
#             print(e);
#         return HttpResponse(Json.dumps({'code':0,'result':result},cls=WebJSONEncoder),content_type="application/json")
#     return wrapper;


def view(name):
    #print(name)
    # print('000000000000000000000000000')
    # return function

    def func(function):
        #paths[name] = function;

        @functools.wraps(function)
        def wrapper(*args,**kwargs):

            try:
                result = function(*args,**kwargs)
            except BaseException as e:
                print(e);
            #if(result is None):

            return render(args[0], name,result)
        return wrapper;
    return func;