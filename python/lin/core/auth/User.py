
from lin.core import web


#from django.views.decorators.csrf import csrf_protect


@web.path('user/login.action')
@web.json
def user_login(request,username,password):

    # if username != 'lin' or password !=
    # # r = Dev.objects.all().order_by('order')#.values_list('id','title','order','dev_id');
    request.session['user.id'] = '2';
    request.session['user.name'] = 'lin';
    # return r;
    # return Dev.objects.all();
    # return [Dev(),Dev()];



@web.path('user/logout.action')
@web.json
def user_logout(request):

    del request.session['user.id'];
    del request.session['user.name'];
    # # r = Dev.objects.all().order_by('order')#.values_list('id','title','order','dev_id');
    # return r;
    # return Dev.objects.all();
    # return [Dev(),Dev()];
