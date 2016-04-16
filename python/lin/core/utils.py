
import json as Json

from datetime import datetime
from django.db.models import QuerySet
from django.db import models


class WebJSONEncoder(Json.JSONEncoder):
    def default(self,obj):
        #convert object to a dict
        d = {}
        # d['__class__'] = obj.__class__.__name__
        # d['__module__'] = obj.__module__
        d.update(obj.__dict__)
        if not d.get('_state') is None :
            d.pop('_state')

        return d

class ModelEncoder(Json.JSONEncoder):
    """ 继承自simplejson的编码基类，用于处理复杂类型的编码
    """
    def default(self,obj):
        if isinstance(obj,QuerySet):
            """ Queryset实例
            直接使用Django内置的序列化工具进行序列化
            但是如果直接返回serialize('json',obj)
            则在simplejson序列化时会被从当成字符串处理
            则会多出前后的双引号
            因此这里先获得序列化后的对象
            然后再用simplejson反序列化一次
            得到一个标准的字典（dict）对象
            """
            #return json.loads(serialize('json',obj))
            # s = serialize('json',obj);
            # return Json.load(s);
            # collections.Container()

            # l = len(obj);
            # d = [];
            # for i in range(0,l):
            #     d.append(obj[i]);
            # return d;
            return list(obj);

        if isinstance(obj,models.Model):
            """
            如果传入的是单个对象，区别于QuerySet的就是
            Django不支持序列化单个对象
            因此，首先用单个对象来构造一个只有一个对象的数组
            这是就可以看做是QuerySet对象
            然后此时再用Django来进行序列化
            就如同处理QuerySet一样
            但是由于序列化QuerySet会被'[]'所包围
            因此使用string[1:-1]来去除
            由于序列化QuerySet而带入的'[]'
            """
            #return json.loads(serialize('json',[obj])[1:-1])
            d = {}
            # d['__class__'] = obj.__class__.__name__
            # d['__module__'] = obj.__module__
            #d.update(obj.__dict__)
            for key,value in obj.__dict__.items():
                if key.startswith('_'):
                    continue;
                d[key] = value;
            # if not d.get('_state') is None :
            #     d.pop('_state')

            return d
        if isinstance(obj,datetime):
            #return obj.microsecond + obj.timestamp() * 1000;
            return int(obj.timestamp()*1000)

        if hasattr(obj, 'isoformat'):
            #处理日期类型
            return obj.isoformat()

        if hasattr(obj,'__get__') or hasattr(obj,'__call__'):
            return obj();
        return json.JSONEncoder.default(self,obj)

def json(obj):
    return Json.dumps(obj,cls=ModelEncoder);

if __name__ == '__main__':

    date = datetime.now();
    print(int(date.timestamp()*1000));
    print(date.microsecond + date.timestamp() * 1000);