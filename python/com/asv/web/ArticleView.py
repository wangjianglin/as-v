from django.http import HttpResponseRedirect

from lin.core import web
from com.asv import asv;
from com.asv.web import Services;
from lin.core import utils;
from com.asv.web.models import Article,ArticleClass

#根节点
#article{id}.html  网页重定向

_redirect_urls_ = {0: '/clsdir.html',1: '/condir.html',2: '/cls.html',3: '/content.html'};
@web.path('article{id}.html')
@web.view()
def article_view(id: web.PathParam(int,'id') = 0):
    article = ArticleClass.objects.get(id=id);
    return HttpResponseRedirect('/article' + str(id) + _redirect_urls_[article.type]);


#分类目录节点
#article{id}/clsdir.html
#article{id}/clsdir/list{aid}.html
#article{id}/clsdir/list{aid}/view{vid}.html
#article{id}/clsdir/list{aid}/{page}.html
#article{id}/clsdir/list{aid}/{page}/view{vid}.html


def __process_clist(clist,id):
    for item in clist:
        if item.id == id:
            return True;
        if __process_clist(list(item.items()),id):
            print('========')
            item.expanded = True;
            return True;
    return False;

@web.path('article{id}/clsdir.html')
@web.path('article{id}/clsdir/list{aid}.html')
# @web.path('article{id}/clsdir/list{aid}/view{vid}.html')
@web.path('article{id}/clsdir/list{aid}/{page}.html')
# @web.path('article{id}/clsdir/list{aid}/{page}/view{vid}.html')
@asv.view('app/article/clsdir.html')
def article_clsdir_list(request,id:web.PathParam(int,'id'),aid:web.PathParam(int,'aid'),page:web.PathParam(int,'page') = 0):

    clist = Services.article_class_list(id);

    aid_type = 0
    if aid is None:

        #item = clist[0];

        def get_aid(tmp_list):
            if tmp_list is None or len(tmp_list) == 0:
                return None
            for tmp_item in tmp_list:
                if tmp_item.type == 2 or tmp_item.type == 3:
                    return tmp_item
                tmp_r = get_aid(list(tmp_item.items()))
                if tmp_r is not None:
                    return tmp_r;

        item = get_aid(clist)
        aid_type = item.type;
        aid = item.id;
        # while item is not None:
        #     aid = item.id;
        #     l = list(item.items());
        #     if l is not None and len(l) > 0:
        #         item = list(item.items())[0];
        #     else:
        #         break
    __process_clist(clist,aid);
    if aid_type == 0:
        alist = Services.article_public_list(aid,page)
        return {'clist':clist,'alist':alist,'id':id,'aid':aid,'list':True}

    article = Services.article_view_bycid(aid,True);
    # return (utils.json(clist),alist);
    return {'clist':clist,'article':article,'id':id,'aid':aid,'vid':article.id,'list':False};

@web.path('article{id}/clsdir/list{aid}/view{vid}.html')
@web.path('article{id}/clsdir/list{aid}/{page}/view{vid}.html')
@asv.view('app/article/clsdir.html')
def article_clsdir_view(id:web.PathParam(int,'id'),
                        aid:web.PathParam(int,'aid'),
                        vid:web.PathParam(int,'vid')):
    clist = Services.article_class_list(id);

    __process_clist(clist,aid);
    article = Services.article_view(vid);

    # return (utils.json(clist),alist);
    return {'clist':clist,'article':article,'id':id,'aid':aid,'vid':vid,'list':False};

@web.path('article{id}/clsdir/view{aid}.html')
@asv.view('app/article/clsdir.html')
def article_clsdir_view_bycid(id:web.PathParam(int,'id'),
                        aid:web.PathParam(int,'aid')):
    clist = Services.article_class_list(id);

    __process_clist(clist,aid);
    article = Services.article_view_bycid(aid,True);
    # return (utils.json(clist),alist);
    return {'clist':clist,'article':article,'id':id,'aid':aid,'vid':(0 if article is None else article.id),'list':False};

# @web.path('article/list.html')
# @asv.defaultView('app/article/list.html')
# def devListView(request):
#     pass




#内容目录节点
@web.path('article{id}/condir.html')
@web.path('article{id}/condir/view{cid}.html')
@asv.view('app/article/condir.html')
def article_condir(id:web.PathParam(int,'id'),cid:web.PathParam(int,'cid')):
    clist = Services.article_class_list(id);
    if clist is None or len(clist) == 0:
        return None;
    if cid is None:
        cid = list(clist[0].items())[0].id;
    article = Services.article_view_bycid(cid,True);
    return {'clist':clist,'article':article,'id':id,'cid':cid};

#分类节点
@web.path('article{id}/cls.html')
# @web.path('article{id}/cls/view{aid}.html')
@web.path('article{id}/cls/{page}.html')
# @web.path('article{id}/cls{page}/view{aid}.html')
@asv.view('app/article/cls-list.html')
def article_cls_list(id:web.PathParam(int,'id'),page:web.PathParam(int,'page')=0):
    alist = Services.article_public_list(id,page,12);
    return {'alist':alist,'id':id};


@web.path('article{id}/cls/view{aid}/.html')
# @web.path('article{id}/cls{page}.html')
@web.path('article{id}/cls/{page}/view{aid}.html')
@asv.view('app/article/cls-view.html')
def article_cls_view(id:web.PathParam(int,'id'),aid:web.PathParam(int,'aid')):
    article = Services.article_view(aid);
    return {'article':article,'id':id,'aid':aid};

#内容节点
#article{id}/content.html

@web.path('article{id}/content.html')
@asv.view('app/article/content.html')
def article_cls_list(id:web.PathParam(int,'id')):

    # src = Article.objects.get(id=3);
    #
    # for _ in range(100):
    #
    #     article = Article();
    #     import datetime;
    #     article.date = datetime.datetime.now();
    #
    #     article.title = src.title;
    #
    #     #生成摘要,需要处理$$或$对
    #     #利用正则表达式的search实现
    #     article.abstract = src.abstract;
    #     article.content = src.content;
    #     article.modifyDate = datetime.datetime.now();
    #     article.article_class_id = src.article_class_id;
    #     article.show = 1;
    #
    #     article.userId = src.userId;
    #     article.userName = src.userName;
    #
    #     # if show:
    #     #     article.publishDate = datetime.datetime.now();
    #     article.save();

    return Services.article_view_bycid(id,True);