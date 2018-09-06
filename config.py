import os
#Application配置信息
settings=dict(
    static_path=os.path.join(os.path.dirname(__file__), "static"),
        template_path=os.path.join(os.path.dirname(__file__), "html"),
        debug=True
    )
# #mysql数据库配置
# mysql_options = dict(
#     host="140.143.240.228",
# # host="127.0.0.1",
#     database="wendaodata",
#     user="root",
#     password="likujy1995"
# )
#本机数据库配置
# mysql_options = dict(
# host="127.0.0.1",
#     database="wendaodata",
#     user="root",
#     password="root"
# )


mysql_options = dict(
host="116.85.15.47",
# host="127.0.0.1",
    database="wendaodata",
    user="root",
    password="admin"
)
redis_options=dict(
    host="127.0.0.1",
    port=6379
)

#配置日志路径
log_file=os.path.join(os.path.dirname(__file__), "logs/log")
log_level="debug"
