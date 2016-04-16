from django.shortcuts import render
from django.http import HttpResponse

from com.asv.web.models import ArticleClass,Article;
from lin.core import web
import datetime;

from com.asv.web import Services;


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
def article_class_list(id:int):

    # r = ArticleClass.objects.select_related().all().filter(parent=id,show=True).order_by('order').order_by('date');
    # return r;
    return Services.article_class_list(id);


@web.path('article/article_list.action')
@web.json
# def article_list(id:web.PostParam(int,'id')):
def article_list(id:int):
    #return Article.objects.all().filter(article_class_id=id).order_by('-date').values('id','title','abstract','date','modifyDate');
    return Services.article_list(id);

# @web.path('article/article_browse.action')
# @web.json
# # def article_list(id:web.PostParam(int,'id')):
# def article_browse(id:int):
#     #return Article.objects.all().filter(article_class_id=id).order_by('-date').values('id','title','abstract','date','modifyDate');
#     #pass
#     article=Article.objects.get(id=id);
#     if not article is None:
#         article.browse += 1;
#         article.save(force_update=True,update_fields=['browse']);


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

    #生成摘要,需要处理$$或$对
    #利用正则表达式的search实现
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


@web.path('article/get_bycid.action')
@web.json
def article_get_bycid(id:int):

   return Services.article_view_bycid(id,False);


@web.path('article/delete_byid.action')
@web.json
def articl_delete_byid(id:int):
    ArticleClass.objects.get(id=id).delete();

@web.path('article/save_update_class.action')
@web.json
def articl_save_update_class(id:int,title:str,type:int,order:int,parent:int,show:bool):

    cls = None;

    if id is not None and id > 0:
        cls = ArticleClass.objects.get(id = id);
    else:
        cls = ArticleClass();
        cls.date = datetime.datetime.now();
        cls.type = 0;
        cls.order = 1000;
        cls.show = False;
        cls.title = '';

    cls.modifyDate = datetime.datetime.now();

    if title is not None:
        cls.title = title;

    if type is not None:
        cls.type = type;

    if order is not None:
        cls.order = order;

    if show is not None:
        cls.show = show;

    if parent is not None:
        cls.parent_id = parent;

    print("${title}")
    if id is not None and id > 0:
        cls.save(force_update=True,update_fields=['title','modifyDate','type','order','show','parent']);
    else:
        cls.save();
    return cls;
# if __name__ == '__main__':

