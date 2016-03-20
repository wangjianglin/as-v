from django.conf.urls import patterns, include, url

# from django.contrib import admin

from lin.core import web;
# admin.autodiscover()



# web.addViewModel('com.asv.web');

# web.addViewModel('com.asv.web.Index');
# web.addViewModel('com.asv.web.Article');
# web.addViewModel('com.asv.web.ArticleView');

urlpatterns = patterns('',
    #
    url(r'^(.*)\.html', 'lin.core.web.html',name='html'),
    url(r'^(.*)\.action$', 'lin.core.web.action',name='action'),
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'com.asv.web.Index.index', name='index'),
    #url(r'^admin$', 'com.asv.web.Index.admin', name='admin')
    #                    ,
    # url(r'^index.html$', 'com.asv.web.Index.index', name='index')
)


# viewsM
