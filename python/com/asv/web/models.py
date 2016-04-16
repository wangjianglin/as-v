from django.db import models
from lin.core import models as lin_models

# class Dev(models.Model,lin_models.Model):
#     title = models.CharField(max_length=30)
#     order = models.IntegerField()
#     date = models.DateTimeField()
#     items = lin_models.Items("dev_id",'order');

    # @property
    # def items(self):
    #     return DevItem.objects.all().order_by('order');
#分类原则,教程置顶,只是技术点,放到相应的分类下
class ArticleClass(models.Model,lin_models.Model):
    title = models.CharField(max_length=30)
    date = models.DateTimeField(db_column="create_date");

    modifyDate = models.DateTimeField(db_column="modify_date");

    show = models.BooleanField(db_column='is_show',default=False);

    order = models.IntegerField();

    #article = models.ForeignKey(Article, related_name='dev_id')
    parent= models.ForeignKey("self", blank=True, null=True, related_name="children_items")

    items = lin_models.Items("children_items",'order','date');

    type = models.IntegerField(db_column='node_type',default=0); #0:分类目录  1:内容目录   2:分类    3:内容    4:子内容目录

    # class Meta:
    #     permissions = (
    #         ("can_drive", "Can drive"),
    #         ("can_vote", "Can vote in elections"),
    #         ("can_drink", "Can drink alcohol"),
    #     )
    class Meta:
        db_table = 'asv_article_class'


class Article(models.Model):

    title = models.CharField(max_length=30)
    abstract = models.CharField(max_length=512,null=True);
    date = models.DateTimeField(db_column='create_date')#default
    modifyDate = models.DateTimeField(db_column='modify_date')#default
    #publishDate = models.DateTimeField(db_column='publish_date',null=True);#不需要,因为最后修改就是发布时间
    content = models.TextField(max_length=8192)
    # contentHtml = models.TextField(max_length=81920,db_column='content_html')
    show = models.BooleanField(db_column='is_show',default=False);

    browse = models.IntegerField(db_column='browse_count',default=0);

    userId = models.CharField(db_column='user_id',max_length=40);
    userName = models.CharField(db_column='user_name',max_length=100);#冗余字段

    article_class = models.ForeignKey(ArticleClass, related_name='class_id')



    # type = models.IntegerField(db_column='article_type',default=0); #文章类型  0:原创   1:翻译    2:转

    class Meta:
        db_table = 'asv_article'