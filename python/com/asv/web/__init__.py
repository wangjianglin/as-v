from lin.core import web;
import traceback;

try:
    web.addViewModel('com.asv.web.Index');

    web.addViewModel('com.asv.web.Article');
    web.addViewModel('com.asv.web.ArticleView');
except BaseException as e:
    print(e);
    exstr = traceback.format_exc();
    print(exstr)

__import__('lin.core.tags');

