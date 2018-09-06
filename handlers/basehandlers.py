

from tornado.web import RequestHandler, StaticFileHandler

import json
class Basehandler(RequestHandler):
    # 在设置完数据库Torndb和redis数据库后
    # 调用两个数据库应该是使用
    # self.Application.db
    # self.Application.redis
    # 可以对该段代码进行简化，直接将其写在Basehandler，封装成方法
    # 例如db.redis
    # 目前将其编写为成员方法，那么如何作为属性去对待了？
    # 使用@property的形式进行处理

    @property
    def db(self):
        return self.application.db

    @property
    def redis(self):
        return self.application.redis



    """handler基类"""

    def prepare(self):
        """预解析json数据"""
        if self.request.headers.get("Content-Type", "").startswith("application/json"):
            self.json_args = json.loads(self.request.body)
        else:
            self.json_args = {}

    def write_error(self, status_code, **kwargs):
        pass

    def set_default_headers(self):
        pass




class StaticFileBaseHandler(StaticFileHandler):
    """自定义静态文件处理类, 在用户获取html页面的时候设置_xsrf的cookie"""
    def __init__(self, *args, **kwargs):
        super(StaticFileBaseHandler, self).__init__(*args, **kwargs)

