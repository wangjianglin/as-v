
import functools
import json as Json
from django.shortcuts import render
from lin.core import web
from django.http import HttpResponse
from collections import Counter

def defaultView(name):


    def func(function):
        #paths[name] = function;

        @web.view('index.html')
        @functools.wraps(function)
        def wrapper(*args,**kwargs):

            try:
                result = function(*args,**kwargs)
            except BaseException as e:
                print(e);
            # if(result is None):
            #     result = {};
            #return dict({'contentUrl':name}.items()+result.items());
            #r = result;
            #r = dict(Counter({'contentUrl':name})+Counter(r))
            #return {'contentUrl':name};
            r = {'asv_content_url':name};
            #r['obj'] = result;
            if result is not None:
                r.update(result);
            return r;
        return wrapper;
    return func;