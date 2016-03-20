

from lin.core import web
from com.asv import asv;


@web.path('article{id}.html')
@web.path('article{id}/list{aid}.html')
@asv.view('app/article/list.html')
def article_list(request,id:web.PathParam(int,'id'),aid:web.PathParam(int,'id')):
    pass


@web.path('article{id}/edit{aid}.html')
@asv.view('app/article/edit.html')
def article_list(request,id:web.PathParam(int,'id'),aid:web.PathParam(int,'id')):
    pass

# @web.path('article/list.html')
# @asv.defaultView('app/article/list.html')
# def devListView(request):
#     pass