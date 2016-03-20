from django.shortcuts import render
from django.http import HttpResponse

from com.asv.web.models import ArticleClass,Article;
from lin.core import web
import datetime;

from com.asv.web import  Services;


@web.path('article/navs.action')
@web.json
# def test(request,**params):
def article_navs():
    return Services.getnavs();
    # return Dev.objects.all();
    # return [Dev(),Dev()];

@web.path('article/list.action')
@web.json
# def test(request,**params):
def article_list(id:int):
    # print('***************')
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

    #return ['one','two']

    r = ArticleClass.objects.select_related().all().filter(parent=id,show=True).order_by('order').order_by('-date');
    # r = Dev.objects.all().order_by('order')#.values_list('id','title','order','dev_id');
    return r;

    # return Dev.objects.all();
    # return [Dev(),Dev()];


@web.path('article/article_list.action')
@web.json
# def article_list(id:web.PostParam(int,'id')):
def article_list(id:int):
    return Article.objects.all().filter(article_class_id=id).order_by('-date').values('id','title','abstract','date','modifyDate');
    #pass

@web.path('article/article_browse.action')
@web.json
# def article_list(id:web.PostParam(int,'id')):
def article_browse(id:int):
    #return Article.objects.all().filter(article_class_id=id).order_by('-date').values('id','title','abstract','date','modifyDate');
    #pass
    article=Article.objects.get(id=id);
    if not article is None:
        article.browse += 1;
        article.save(force_update=True,update_fields=['browse']);


@web.path('article/save.action')
@web.json
def article_save(id:int,title:str,abstract:str,content:str,classId:int,userId:web.SessionParam(str,'user.id'),userName:web.SessionParam(str,'user.name')):
    return __article_save_or_publish(id,title,abstract,content,classId,userId,userName,False);


@web.path('article/publish.action')
@web.json
def article_publish(id:int,title:str,abstract:str,content:str,classId:int,userId:web.SessionParam(str,'user.id'),userName:web.SessionParam(str,'user.name')):
    return __article_save_or_publish(id,title,abstract,content,classId,userId,userName,True);

def __article_save_or_publish(id,title,abstract,content,classId,userId,userName,show):
    article = Article();
    if id > 0:
        article.id = id;
    else:
        article.date = datetime.datetime.now();

    article.title = title;
    article.abstract = abstract;
    article.content = content;
    article.modifyDate = datetime.datetime.now();
    article.article_class_id = classId;
    article.show = show;

    article.userId = userId;
    article.userName = userName;

    # if show:
    #     article.publishDate = datetime.datetime.now();

    if id > 0:
        article.save(force_update=True,update_fields=['title','abstract','content','modifyDate','show']);
        #article=Article.objects.get(id=id)
    else:
        article.save();

@web.path('article/get.action')
@web.json
def article_get_byid(id:int):


   return Article.objects.get(id=id);
