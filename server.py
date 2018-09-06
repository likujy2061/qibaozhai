import tornado.web
import tornado.ioloop
import tornado.options
# import torndb
# import tornado.httpserver
from urls import handlers
import config
import torndb
import redis
from tornado.options import options, define

print("http://127.0.0.1:8889/")
define("port", default=8889, type=int, help="run server on the given port")
define("address", default="0.0.0.0", type=str, help="run server address")

class Application(tornado.web.Application):
    def __init__(self,*args,**kwargs):
        super(Application,self).__init__(*args,**kwargs)
        #数据库配置初期写在server.py中，企业项目必须单独拆分开，可以写在config中
        self.db = torndb.Connection(
            **config.mysql_options
            # 字典解包，将数据库配置单独写在配置文件
        )

        self.redis=redis.StrictRedis(
            **config.redis_options
        )

def main():
    #修改日志不显示某级别的log
    # options.logging=config.log_level
    #将日志进行报错，将配置写在config.py中
    # options.log_file_prefix=config.log_file
    tornado.options.parse_command_line()
    app = Application(
        handlers,
        **config.settings
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port,options.address)
    tornado.ioloop.IOLoop.current().start()

if __name__ == "__main__":
    main()