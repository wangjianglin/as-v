
import functools
from lin.core import web
from com.asv.web.Services import getnavs;
import traceback

def view(name):

    def func(function):

        @web.view('index.html')
        @functools.wraps(function)
        def wrapper(request,*args,**kwargs):

            result = None;
            try:
                # result = function(request,*args,**kwargs)
                # d = [];
                # d[0] = request;
                # d.update(args);
                # d.append(*args);
                result = web.params_injection(function,request,*args,**kwargs);
            except BaseException as e:
                exstr = traceback.format_exc();
                print(exstr)
            # if(result is None):
            #     result = {};
            #return dict({'contentUrl':name}.items()+result.items());
            #r = result;
            #r = dict(Counter({'contentUrl':name})+Counter(r))
            #return {'contentUrl':name};

            r = {
                'asv_content_url':name,
                'request':request,
                'navs':getnavs()
                 };
            #r['obj'] = result;
            if result is not None:
                #r.update(result);
                r['obj'] = result;
            return r;
        return wrapper;
    return func;