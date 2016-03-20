
import functools
from lin.core import web
from com.asv.web.Services import getnavs;


def view(name):

    def func(function):

        @web.view('index.html')
        @functools.wraps(function)
        def wrapper(request,*args,**kwargs):

            result = None;
            try:
                # result = function(request,*args,**kwargs)
                d = {};
                d[request] = request;
                d.update(args);
                result = web.params_injection(function,d,**kwargs);
            except BaseException as e:
                print(e);
                # exstr = traceback.format_exc();
                # print(exstr)
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