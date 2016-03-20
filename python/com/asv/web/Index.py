from django.shortcuts import render
from django.http import HttpResponse
from lin.core import web
from com.asv import asv;
# from lin.core import view

@web.path('index.html')
@asv.view('app/home.html')
#@web.view('index.html')
def index(request):
    # return HttpResponse(str(c))
    # return # -*- coding: utf-8 -*-
    #print('=======')
    #return {'nav':'app/home.html'};
    #return render(request, 'index.html')
    #return HttpResponse(u'<script type="text/javascript">window.location.href = "/s/web/index.html";</script>')
    pass

def admin(request):
    # return HttpResponse(str(c))
    # return # -*- coding: utf-8 -*-
    #print('=======')
    #return render(request, 'index.html')
    return HttpResponse(u'<script type="text/javascript">window.location.href = "/s/admin/index.html";</script>')


# def action(request,action):
#     print('========' + action + "=========")
#
#     # m = type(sys)('com.asv.web.Index')
#
#
#     # actions = action.sp
#     # //stringmodule = imp.loadmodule('string',*imp.findmodule('string'))
#
#     # m = __import__('com.asv.web.Index');
#     m = sys.modules['com.asv.web.Index'];
#
#     f = getattr(m,'test')
#
#     if not hasattr(f,'__call__'):
#         print('error.')
#     print('ok.');
#     return f(request);
#     # return HttpResponse('ok.')

@web.path('/test/index.action')
@web.json
# def test(request,**params):
def test(request,**dict):
    # print('***************')
    # return HttpResponse('ok==.')
    return "ok...."
