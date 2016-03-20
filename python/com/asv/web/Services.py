
from com.asv.web.models import ArticleClass;

def getnavs():
    r = ArticleClass.objects.select_related().all().filter(parent=None,show=True).order_by('order').order_by('-date');
    # # r = Dev.objects.all().order_by('order')#.values_list('id','title','order','dev_id');
    return r;