from handlers.basehandlers import StaticFileBaseHandler as StaticFileHandler
from handlers import roleView
import os
handlers=[
(r"/api/ApiRoleHandler$", roleView.ApiRoleHandler),  # 个人主页获取个人信息
(r"/api/qufu$", roleView.ApiQufu),  # 区服的获取,
 (r"/(.*)", StaticFileHandler,
     dict(path=os.path.join(os.path.dirname(__file__), "html"), default_filename="奇宝斋-问道官方交易平台--商品列表.html"))
    ]
"""代码省略"""