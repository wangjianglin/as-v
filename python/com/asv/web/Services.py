
from com.asv.web.models import ArticleClass,Article;
from lin.core.models import Page


def getnavs():
    r = ArticleClass.objects.select_related().all().filter(parent=None,show=True).order_by('order','date')#.order_by('-date');
    # # r = Dev.objects.all().order_by('order')#.values_list('id','title','order','dev_id');
    return r;

def article_class_list(id):
    r = ArticleClass.objects.select_related().all().filter(parent=id,show=True).order_by('order','date')#.order_by('-date');
    return r;

def article_list(id):
    return Article.objects.all().filter(article_class_id=id).order_by('date').values('id','title','abstract','date','modifyDate','browse','show');

def article_public_list(id,page_no=0,page_size=12):
    r = Article.objects.all().filter(article_class_id=id,show=True).order_by('-modifyDate').values('id','title','abstract','date','modifyDate','browse','userName');
    # paginator = Paginator(r,3);
    # # paginator.page(1);
    # p = paginator.page(1)

    p = Page(r,page_no,page_size);
    return p;

def article_view(id):
    if id is None:
        return None;
    article = Article.objects.get(id=id);

    if article is not None:

        article.browse += 1;
        article.save(force_update=True,update_fields=['browse']);

    return article;

def article_view_bycid(id,is_browse=False):
    if id is None:
        return None;
    try:
        article = Article.objects.get(article_class=id);

        if is_browse and article is not None:

            article.browse += 1;
            article.save(force_update=True,update_fields=['browse']);

        return article;
    except BaseException as e:
        return None;