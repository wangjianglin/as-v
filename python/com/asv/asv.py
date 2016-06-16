
import functools
from lin.core import web
from com.asv.web.Services import getnavs;
import traceback

class ViewResult:

    @property
    def result(self):
        return self._resutl;

    @result.setter
    def setresult(self, value):
        self._result = value;

    @property
    def title(self):
        return self._title;

    @title.setter
    def settitle(self, value):
        self._title = value;

    @property
    def keywords(self):
        return self._keywords

    @keywords.setter
    def setkeywords(self, value):
        self._keywords = value;


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
                if issubclass(type(result),ViewResult):
                    r['keywords'] = result.keywords
                    r['title'] = result.title
                    r['obj'] = result.result;
                else:
                    r['obj'] = result;
            return r;
        return wrapper;
    return func;

