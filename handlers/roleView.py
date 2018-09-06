from handlers.basehandlers import Basehandler
from handlers import view
import json
import datetime,time
class ApiRoleHandler(Basehandler):

    def get(self):
        """
        :return:
        """
        sqlcount=1
        url=self.request.uri
        redisValue=self.redis.get(url)
        if redisValue != None:
            str_json=redisValue.decode('utf-8').replace("'", '"')
            return self.write(json.loads(str_json))
        setarttime = datetime.datetime.now()
        #获取参数
        dataDict={}
        body=self.request.arguments
        GetRet=""
        for  a  in  self.request.arguments:
            print(a,body[a][0])
            values = body[a][0].decode()
            dataDict[a]=values
        #装备
        if dataDict["select_zhuangbei_shuxing_id"] != '不限' or dataDict["zhuangbeigaizao"] != "" or dataDict["zhuangbeixiangqian"] != "":
            #判断装备的全部不为空值
            GetRet=view.GetZhuangbeiSql(dataDict,self.db)
            sqlcount+=1
        if dataDict["shoushixiangxin"] != "":
            #判断首饰的相关参数不全部为空值
            GetRet=view.GetShoushi(dataDict,GetRet,self)
            sqlcount += 1
        print('dataDict["zuoqi"]',dataDict["zuoqi"])
        if dataDict["minchongwufashang"] != "" or dataDict["maxchongwufashang"] != "" or dataDict[
            "minchongwuwushang"] != "" or dataDict["maxchongwuwushang"] != "" or dataDict["minyidongsudu"] != "" or dataDict["maxyidongsudu"] != "" or dataDict["zuoqi"] != "":
            #判断宠物的相关参数不全部为空值
            GetRet=view.GetPegs(dataDict,GetRet,self.db,sqlcount)
            sqlcount += 1
        print("GetRet测试",GetRet)
        if dataDict["minfabaodengji"] != "" or dataDict["maxfabaodengji"] != "" or dataDict[
            "select_fabaoshuxing_id"] != "0" or dataDict["minfabaowushang"] != "" or dataDict[
            "maxfabaowushang"] != "" or dataDict["select_fabaohouzhui_id"] != "不限":
            #判断法宝的相关参数是否全部为空值
            GetRet=view.Getfabao(dataDict,GetRet,self.db)
            sqlcount += 1
        if dataDict["wawaminqinmidu"] != "":
            #判断娃娃的相关参数部不为空
            GetRet=view.Getwawa(dataDict,GetRet,self.db)
            sqlcount += 1
        GetRet = view.GetRoleSql(dataDict, self.db,GetRet,sqlcount)
        data=view.Getdata(GetRet)
        page_str=(int(dataDict["page"])-1)*500
        page_end=int(dataDict["page"])*500
        if len(data)==0:
            return self.write(dict(errcode=4001, errmsg="OK", data="未搜索到任何信息，请重新选择搜索条件", count=0, page=1))
        closetime=datetime.datetime.now()
        dictdata= dict(
                           errcode=0,
                           errmsg="OK",
                           # data=data[page_str:page_end],
                            data=data,
                           count=len(data[page_str:page_end]),
                           page=dataDict["page"],
                           setarttime=str(setarttime),
                           closetime=str(closetime),
                           pages=len(data) // 500 + 1,
                           LenData=len(data),
                           echos=[-2, -1, 0, 1, 2, 3]
                       )
        #缓存时间
        self.redis.set(url,dictdata)
        self.redis.expire(url,60)
        return self.write(dictdata)

# styleimg syjsq#寄售期
#styleimg symgs免公式
#styleimg sygsq公示期
#物理伤害
#等级
#法术伤害
class ApiQufu(Basehandler):
    """区服的api接口"""
    def get(self):
        qufu=self.get_argument("qufu",default="双线一区")
        sql1="""select fu,id from  wdsousuo_fu  where quId_id in (select id  from wdsousuo_qu where qufu = '%s')"""%qufu
        print(sql1)
        ret = self.db.query(sql1)
        data=[]
        for d in ret:
            data.append(
                {
                    "name":d["fu"],
                    "id":d["id"]
                }
            )
        return self.write(dict(errcode=0, errmsg="OK", data=data))


