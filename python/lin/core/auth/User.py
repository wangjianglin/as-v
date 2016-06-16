
from lin.core import web
from lin.lin import LinException


#from django.views.decorators.csrf import csrf_protect


@web.path('user/login.action')
@web.json
def user_login(request,username,password):

    if username != 'lin' or password != '123456':
        raise LinException(-0x1232345,'用户名或密码错误')

    # if username != 'lin' or password !=
    # # r = Dev.objects.all().order_by('order')#.values_list('id','title','order','dev_id');
    request.session['user'] = {'id':'2','name':'lin'}
    request.session['user.id'] = '2'
    request.session['user.name'] = 'lin'

    return {'id':'2','name':'lin'}

    # return r;
    # return Dev.objects.all();
    # return [Dev(),Dev()];

@web.path('user/logout.action')
@web.json
def user_logout(request):

    del request.session['user.id'];
    del request.session['user.name'];
    del request.session['user']
    # # r = Dev.objects.all().order_by('order')#.values_list('id','title','order','dev_id');
    # return r;
    # return Dev.objects.all();
    # return [Dev(),Dev()];
