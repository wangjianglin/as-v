from django.http.response import HttpResponseBase

__author__ = 'lin'

import functools
from django.shortcuts import render
from django.http import HttpResponse
import re;
from lin.core import utils;
from lin.lin import LinException;
import traceback;
from enum import Enum
import inspect;

#from lin.core import tag;


#HttpMethod = Enum('ALL', 'POST','GET')
class HttpMethod(Enum):
    ALL = 255
    POST = 1
    GET = 2
    HEADER = 4
    SESSION = 32
    PATH = 64
    HTTP = 31

    # def __ror__(self, other):
    #     return True;

class RequestParam:

    def __init__(self,cls,name=None,method=HttpMethod.ALL,default_value=None):
        self._name = name;
        self._cls = cls;
        self._method = method;
        self._default_value = default_value;

class HttpParam(RequestParam):

    # def __init__(self,cls,name=None,method=HttpMethod.HTTP):
    #     self._name = name;
    #     self._cls = cls;
    #     self._method = method;
    def __init__(self, cls, name=None, default_value=None):
        super(HttpParam,self).__init__(cls,name,HttpMethod.HTTP,default_value);

#@staticmethod
def __value_impl(form,name,cls):
    #form = QueryDict();
    # if not hasattr(form,name):
    #     return None;

    # if cls is int:
    #     return  form.in
    if form is None:
        return None;
    v = form.get(name);
    if v is None or cls is None:
        return v;
    try:
        return cls(v);
    except BaseException as ex:
        pass
    return None;

def __value(request,name,method,cls,param,default_value=None):
    if name is None:
        name = param;
    # if method.value == 255:
    #     v = __value_impl(request.REQUEST,name,cls);
    #
    #     if not v is None:
    #         return v;

    if method.value & HttpMethod.POST.value > 0:
        v = __value_impl(request.POST,name,cls);

        if v is not None:
            return v;

    if method.value & HttpMethod.GET.value > 0:
        v = __value_impl(request.GET,name,cls);

        if v is not None:
            return v;

    if method.value & HttpMethod.HEADER.value > 0:
        v = __value_impl(request.META,name,cls);

        if v is None:
            return default_value;
        return v;

    if method.value & HttpMethod.SESSION.value > 0:
        v = __value_impl(request.session,name,cls);

        if v is not None:
            return v;

    if method.value & HttpMethod.PATH.value > 0:
        v = __value_impl(request.PATH,name,cls);

    if v is None:
        return default_value;
    return v;


class HeaderParam(RequestParam):
    def __init__(self,cls,name=None,default_value=None):
        super(HeaderParam,self).__init__(cls,name,HttpMethod.HEADER,default_value);

class PostParam(RequestParam):
    def __init__(self,cls,name=None,default_value=None):
        super(PostParam,self).__init__(cls,name,HttpMethod.POST,default_value);

class GetParam(RequestParam):
    def __init__(self,cls,name=None,default_value=None):
        super(GetParam,self).__init__(cls,name,HttpMethod.GET,default_value);

class SessionParam(RequestParam):
    def __init__(self,cls,name=None,default_value=None):
        super(SessionParam,self).__init__(cls,name,HttpMethod.SESSION,default_value);

class PathParam(RequestParam):
    def __init__(self,cls,name=None,default_value=None):
        super(PathParam,self).__init__(cls,name,HttpMethod.PATH,default_value);

# import inspect

#
# class JsonResult(object):
#     def code;
#     pass



# from django.utils import simplejson
from django.db import models
# from django.core.serializers import serialize,deserialize
from django.db.models.query import QuerySet
# from django.test import TestCase
# import collections;


def params_injection(fun,*args,**kwargs):
    request = args[0];
            # kwargs['id'] = 10;
    arg_spce = inspect.getfullargspec(fun);

    has_request = False;
    annons = fun.__annotations__;

    arg_defaults = arg_spce.defaults;
    arg_defaults_len = 0;
    if arg_defaults is not None:
        arg_defaults_len = len(arg_defaults);

    args_arr = arg_spce.args;# + arg_spce.kwonlyargs;
    args_len = len(args_arr);
    arg_index = 0;
    for arg in args_arr:
        arg_index += 1;
        if arg == 'request':
            has_request = True;
            continue;

        arg_value = None;
        if arg in annons:
            param_value = annons[arg];
            param_type = type(param_value);
            if param_type is type:
                arg_value = __value(request,arg,HttpMethod.HTTP,param_value,None);
            elif issubclass(param_type,RequestParam):
                arg_value = __value(request,param_value._name,param_value._method,param_value._cls,arg, param_value._default_value);
        else:
            arg_value = __value(request,arg,HttpMethod.HTTP,None,None);

        if arg_value is not None or arg_index + arg_defaults_len <= args_len:
            kwargs[arg] = arg_value;

    # for param,paramValue in function.__annotations__.items():
    #     if type(paramValue) is type:
    #         #print(paramType)
    #         kwargs[param] = __value(request,param,HttpMethod.ALL,int,None);
    #     elif type(paramValue) is HttpParam:
    #         kwargs[param] = __value(request,paramValue._name,paramValue._method,paramValue._cls,param);

    result = None;
    if has_request is True:
        result = fun(*args,**kwargs)
    else:
        result = fun(**kwargs);

    return result;

def json(function):
    @functools.wraps(function)
    def wrapper(*args,**kwargs):


        json_str = None;
        status = 200;
        try:
            result = params_injection(function,*args,**kwargs);
        except BaseException as e:
            result = None;
            # exstr = traceback.format_exc();
            # print(exstr)
            status = 600
            if issubclass(type(e),LinException):
                json_str = utils.json({'code':e.code,'message':e.message,'cause':e.cause});
            else:
                json_str = utils.json({'code':-1,'message':'未知异常','cause':str(e),'stackTrace':traceback.format_exc()});
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

        if json_str is None:
            try:
                json_str = utils.json({'code':0,'result':result});
            except BaseException as e:
                print(e);
                status = 600
                exstr = traceback.format_exc();
                print(exstr)
                json_str = '{code:-2}';

        return HttpResponse(json_str,content_type="application/json",charset="utf-8",status=status);
        # return HttpResponse(Json.dumps({'code':0,'result':result}),content_type="application/json")

    return wrapper;

def view(name = None):
    #print(name)
    # print('000000000000000000000000000')
    # return function

    def func(function):
        #paths[name] = function;

        @functools.wraps(function)
        def wrapper(*args,**kwargs):

            result = None;

            # arg_spce = inspect.getfullargspec(function);

            try:
                result = params_injection(function,*args,**kwargs);
            except BaseException as e:
                print(e);
            #if(result is None):
            if result is None:
                return HttpResponse('');
            if issubclass(type(result),HttpResponseBase):
                return result;
            if name is None:
                return HttpResponse(result);
            return render(args[0], name,result)
        return wrapper;
    return func;

paths = {}
paths_pattern = {}
paths_params = {}
# paths_params_pattern = {};
__mseach = re.compile(r'{(?:\w|\d)*}');

def __search(name):
    # s = re.compile(r'{(?:\w|\d)*}')

    # print(name)
    param = __mseach.search(name);

    if param is None:
        return None;
    params = [];
    prePos = 0;
    url_pattern = '^';

    while not param is None:
        param_name = name[param.regs[0][0]+1:param.regs[0][1]-1];
        url_pattern += name[prePos:param.regs[0][0]];
        if param_name.startswith("?"):#这样运算次数会少些
            if param_name.startswith("?wd:") or param_name.startswith("?dw:"):
                param_name = param_name[4,len(param_name)];
                url_pattern += '(\w|\d){1,}';
            elif param_name.startswith("?w:"):
                param_name = param_name[3,len(param_name)];
                url_pattern += '(\w){1,}';
            else:
                url_pattern += '(\d){1,}';
        else:
            url_pattern += '(\d){1,}';
        params.append((param_name,param.regs[0][0]-prePos));
        prePos = param.regs[0][1]# + 1;
        param = __mseach.search(name,param.regs[0][1]);
    url_pattern += name[prePos:len(name)] + '$';
    return (params,url_pattern);

def path(name):

    def wrapper(function):
        # v = "a";
        # v.__len__()
        n = name;
        if n.startswith("/"):
            n = n[1:n.__len__()];

        params = __search(n);
        # mserch = __mseach.search(n);

        if not params is None:
            #paths[n] = re.compile(__mseach.sub("{(\w|d)*}",n))
            # paths_params_string = __mseach.sub("(\w|d)*",n);
            # m = re.compile('^' + __mseach.sub("(\w|d)*",n) + '$');
            m = re.compile(params[1]);
            paths_pattern[m] = function;

            paths_params[m] = params[0];

        else:
            paths[n] = function;
        return function
    return wrapper;

__view_models = []
__is_view_models = False

def _machpath(name):

    if not __is_view_models:
        for model in __view_models:
            __import__(model)

    fun = paths.get(name);
    if fun is not None:
        return (fun,None)

    for m in paths_pattern:
        if not m.match(name) is None:
            m2 = m.search(name);

            regs = m.search(name).regs;
            pre_pos = 0;

            params_name = paths_params[m];

            params = {};

            for n in range(1, len(regs)):
                if regs[n][0] == -1:
                    params[params_name[n-1][0]] = '';
                    pre_pos += params_name[n-1][1]
                else:
                    params[params_name[n-1][0]] = name[pre_pos+params_name[n-1][1]:regs[n][1]];
                    pre_pos = regs[n][1]# + 1;

            return (paths_pattern[m],params);

    return None;


def __fun(request,name):
    name = name.replace('//','/');
    fun = _machpath(name);

    if fun is None:
        return None;

    request.PATH = fun[1];
    # if not fun[1] is None:
    return fun[0](request);

#@csrf_protect
def action(request,name):
    # print('========' + name + "=========")

    # fun = paths[name+'.action'];
    # fun = _machpath(name + '.action');
    # return fun(request)
    return __fun(request,name + '.action');


def html(request,name):
    # print('========' + name + "=========")

    # fun = paths[name+'.html'];
    # fun = _machpath(name + '.html');
    # return fun(request)
    # addViewModel('com.asv.web.Index');
    #
    # addViewModel('com.asv.web.Article');
    # addViewModel('com.asv.web.ArticleView');
    return __fun(request,name + '.html');



#ll


# def view(function):
#     @functools.wraps(function)
#     def wrapper(*args,**kwargs):
#         try:
#             result = function(*args,**kwargs)
#         except BaseException as e:
#             print(e);
#         return HttpResponse(Json.dumps({'code':0,'result':result},cls=WebJSONEncoder),content_type="application/json")
#     return wrapper;


if __name__ == '__main__':

    path = 'article334/list2375.html';
    mpath = 'article{id1224}/list{i3da}.html';

    __search(mpath)

    m = re.compile('^' + __mseach.sub("(\w|d)*",mpath) + '$');
    paths_pattern[m] = lambda : 'ok.';

    paths_params[m] = __search(mpath);

    _machpath(path)
    # m1 = re.compile(r'{(\w|\d)*}')
    #
    # s1 = m1.search(mpath);
    #
    #
    # print(s1.regs[0][1]);
    # print(m1.search(mpath,s1.regs[0][1]));
    #
    #
    # print(m1.sub("{(\w|d)*}",mpath))
    #
    # m = re.compile(r'^article(\w|\d)*/list(\w|\d)*.html$');
    #
    # print(m.match(path));
    # print(m.findall(path));
    #
    # print(m.search(path).regs)
    #
    # print('==========')



def addViewModel(model):
    # sys.modules[model]
    __view_models.append(model);
    # __import__(model)
