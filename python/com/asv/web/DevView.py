

from lin.core import web
from com.asv import asv;


@web.path('dev/list.html')
@asv.defaultView('app/dev/list.html')
def devListView(request):
    pass