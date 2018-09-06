import  random
from urllib import parse
def zhanliView(str):
    """
    该方法处理ajax接口传递的战力"e,d,c"，将其处理为(1,2,3)的形式
    :param str: "e,d,c"
    :return: 返回字符串(1,2,3)
    """
    zhanliList=parse.unquote(str).split(",")
    tup = ()
    for zhanli  in  zhanliList:
        if  zhanli=="E":
            tup+=(1,)
        elif zhanli=="D":
            tup += (2,)
        elif zhanli=="C":
            tup += (3,)
        elif zhanli=="B":
            tup += (4,)
        elif zhanli=="A":
            tup += (5,)
        elif zhanli=="S":
            tup += (6,)
        elif zhanli=="S+":
            tup += (7,)
        elif zhanli=="SS":
            tup += (8,)
        elif zhanli=="SS+":
            tup += (9,)
        elif zhanli=="SSS":
            tup += (10,)

    if  len(tup)==1:
        return "(%s)"%tup[0]
    return tup.__str__()

def Getgongshi(data):
    """
    该接口返回公式状态
    :param data: 为角色数据库查询记录
    :return: 返回class 属性
    """
    CurrentStateName=data["CurrentStateName"]
    if CurrentStateName==1:
        #免公式
        return "symgs"
    elif CurrentStateName==2:
        #寄售期
        return "syjsq"
    else:
        #公示期
        return "sygsq"



def GetImageIndex():
    """
    :return:
    """
    # 记录配置某些常量信息
    url="http://img.gyyxcdn.cn/qibao/Images/itemImages/%s.jpg"
    index=random.randint(0,6)
    image_list = ["6002", "6001", "6003", "7003", "4004", "7002", "5004"]
    data=url % image_list[index]
    return data


def  GetRoleSql(dataDict,db,data,sqlcount):
    """
    :param sql: 初始sql语句
    :param dataDict: 参数列表
    :return:
    """
    # 等级
    # 服务器
    sql = """
               SELECT * FROM  wdsousuo_user 
           """
    #判断8个条件为空
    dataTranslate=dataDict["js_selli_gongshi"] != "0" or dataDict["nav_sub_type"] != "0" or \
            dataDict["minPhyPower"] != "" or dataDict["mindefAs"] != "" or \
            dataDict["minPrice"] != "" or dataDict["minTao"] != "" or \
            dataDict["minSpeed"] != "" or dataDict["minMag_power"] != "" or \
            dataDict["minHp"] != "" or dataDict["Minwudao"] != "" \
            or dataDict["MinLevel"] != "" or dataDict["zhanlilevel"] != "" or dataDict["serverId"] != "请选择"
    i=1
    if dataTranslate:
        if sqlcount == 1:
            if data != None:
                sql += " where  id in  %s " % ListTotuple(data, int)
                i += 1
            else:
                sql +=" where "

        if dataDict["serverId"] != "" and dataDict["serverId"] !="请选择":
            if i != 1:
                sql+=" AND "
            i+=1
            sql += " ServerName = '%s' " % (dataDict["serverId"])
        # 公式
        if dataDict["js_selli_gongshi"] != "0":
            if i != 1:
                sql+=" AND "
            i+=1
            sql += " CurrentStateName = %d " % (int(dataDict["js_selli_gongshi"]))
        # 门派
        if dataDict["nav_sub_type"] != "0":
            if i != 1:
                sql+=" AND "
            i+=1
            sql += " Martial = %s " % (int(dataDict["nav_sub_type"]))
        # 物理伤害
        if dataDict["minPhyPower"] != "" and dataDict["maxPhyPower"] != "":
            if i != 1:
                sql+=" AND "
            i+=1
            sql += " phy_power BETWEEN %s  AND %s  " % (dataDict["minPhyPower"], dataDict["maxPhyPower"])
        # 防御
        if dataDict["mindefAs"] != "" and dataDict["maxdefAs"] != "":
            if i != 1:
                sql+=" AND "
            i+=1
            sql += " def_as BETWEEN %s  AND %s  " % (dataDict["mindefAs"], dataDict["maxdefAs"])
        # 价格
        if dataDict["minPrice"] != "" and dataDict["maxPrice"] != "":
            if i != 1:
                sql+=" AND "
            i+=1
            sql += " Price BETWEEN %s  AND %s  " % (dataDict["minPrice"], dataDict["maxPrice"])
        # 道行
        if dataDict["minTao"] != "" and dataDict["maxTao"] != "":
            if i != 1:
                sql+=" AND "
            i+=1
            sql += " tao BETWEEN %s  AND %s  " % (dataDict["minTao"], dataDict["maxTao"])
        # 速度
        if dataDict["minSpeed"] != "" and dataDict["maxSpeed"] != "":
            if i != 1:
                sql+=" AND "
            i+=1
            sql += " speed BETWEEN %s  AND %s  " % (dataDict["minSpeed"], dataDict["maxSpeed"])
        # 法术伤害
        if dataDict["minMag_power"] != "" and dataDict["maxMag_power"] != "":
            if i != 1:
                sql+=" AND "
            i+=1
            sql += " mag_power  BETWEEN %s  AND %s  " % (dataDict["minMag_power"], dataDict["maxMag_power"])
        # hp
        if dataDict["minHp"] != "" and dataDict["maxHp"] != "":
            if i != 1:
                sql+=" AND "
            i+=1
            sql += " max_life BETWEEN %s  AND %s  " % (dataDict["minHp"], dataDict["maxHp"])
        # 悟道
        if dataDict["Minwudao"] != "" and dataDict["Maxwudao"] != "":
            if i != 1:
                sql+=" AND "
            i+=1
            sql += " wudao BETWEEN %s  AND %s  " % (dataDict["Minwudao"], dataDict["Maxwudao"])
        # 等级
        if dataDict["MinLevel"] != "" and dataDict["MaxLevel"] != "":
            if i != 1:
                sql+=" AND "
            i+=1
            sql += " level BETWEEN %s  AND %s  " % (dataDict["MinLevel"], dataDict["MaxLevel"])
        # 战力级别
        # #战力处理
        if dataDict["zhanlilevel"] != "":
            zhanlilevel = zhanliView(dataDict["zhanlilevel"])
            if i != 1:
                sql+=" AND "
            i+=1
            sql += " zhanli_lv in %s  " % zhanlilevel

    else:
        if sqlcount != 1:
            if data != None:
                sql += " where  id  in  %s " % ListTotuple(data, int)
        else:
            pass


    sql+="ORDER BY  Price  DESC "
    print("GetroleSql",sql)

    ret = db.query(sql)
    return ret

def GetZhuangbeiSql(dataDict,db):
    i=1
    if dataDict["zhuangbeigaizao"] != "":
        sql="SELECT  *   FROM wdsousuo_zhuangbei  WHERE usertype_id in(SELECT usertype_id FROM `wdsousuo_zhuangbei` GROUP  BY `usertype_id` HAVING COUNT(`usertype_id`)>=5) and zrebuild_level >= %s  GROUP  BY `usertype_id` HAVING COUNT(`usertype_id`)>=5"%dataDict["zhuangbeigaizao"]
        i+=1
    else:
       sql="""
            SELECT  *  FROM wdsousuo_zhuangbei  WHERE
        """

    if dataDict["select_zhuangbei_shuxing_id"] != '不限':
        if i !=1:
            sql += " and "
        sql += "  shuxing_type = '%s' " % dataDict["select_zhuangbei_shuxing_id"]
        i+=1
    if dataDict["select_zhuangbei_shuxing_id"] == '不限' and dataDict["zhuangbeigaizao"] == "":
        sql=sql.replace("WHERE","")
    print("GetZhuangbeiSql", sql)
    ret = db.query(sql)
    retSet = set()
    print('dataDict["zhuangbeixiangqian"]',dataDict["zhuangbeixiangqian"])
    if dataDict["zhuangbeixiangqian"]!= '':
        for row in ret:
            if  row["baoshi_list_1"]>=dataDict["zhuangbeixiangqian"] or row["baoshi_list_2"]>=dataDict["zhuangbeixiangqian"] or row["baoshi_list_3"]>=dataDict["zhuangbeixiangqian"]:
                        retSet.add(row["usertype_id"])
        return list(retSet)
    else:
        print(len(ret), ret)
        for  row in ret:
            retSet.add(row["usertype_id"])
        print(len(retSet),retSet)
        return list(retSet)




def  GetShoushi(dataDict,data,self):
    if Lenlist(data) !=0:
        sql="""
            SELECT  usertype_id  FROM wdsousuo_shoushi  WHERE
        """
        if dataDict["shoushixiangxin"] != "":
            sql += "   shuxing_type >= %s   " % dataDict["shoushixiangxin"]
            sql += "  and usertype_id in  %s " % ListTotuple(data, int)
        print("GetShoushi", sql,)
        ret = self.db.query(sql)
        retSet=set()
        for row in ret:
            retSet.add(row["usertype_id"])
        return retSet
    return self.write(dict(errcode=4001, errmsg="error", data="首饰未查找到数据"))
def GetPegs(dataDict,data,db,sqlcount):
            if sqlcount ==1:
                if data == None:
                    return None
            sql="""
                select  *  from wdsousuo_pets where 
            """
            retSet = set()
            if dataDict["minchongwufashang"] != "" or dataDict["maxchongwufashang"] != "" or dataDict[
                "minchongwuwushang"] != "" or dataDict["maxchongwuwushang"] != "" or dataDict["minyidongsudu"] != "" or \
            dataDict["maxyidongsudu"] != "":
                a=1
                if dataDict["minchongwufashang"] != "" and dataDict["maxchongwufashang"] != "":
                    if a!=1:
                        sql += "  AND"
                    sql += " phy_power  BETWEEN %s  AND %s  " % (dataDict["minchongwufashang"], dataDict["maxchongwufashang"])
                    a+=1
                if dataDict["minchongwuwushang"] != "" and dataDict["maxchongwuwushang"] != "":
                    if a!=1:
                        sql += "  AND"
                    sql += "  mag_power  BETWEEN %s  AND %s  " % (dataDict["minchongwuwushang"], dataDict["maxchongwuwushang"])
                    a += 1
                if dataDict["minyidongsudu"] != "" and dataDict["maxyidongsudu"] != "":
                    if a != 1:
                        sql += "  AND"
                    sql += "   speed  BETWEEN %s  AND %s  " % (dataDict["minyidongsudu"], dataDict["maxyidongsudu"])
                    a += 1

                int = Lenlist(data)
                if  int !=0:
                    if a != 1:
                        sql += "  AND"
                    sql += "   usertype_id in  %s " % ListTotuple(data, int)
                print("GetPegssql", sql)
                ret = db.query(sql)
                for row in ret:
                    retSet.add(row["usertype_id"])
            if   dataDict["zuoqi"] != "" :
                zuoqisql="select *  from wdsousuo_pets where   name  = '%s'  " % dataDict["zuoqi"]
                zuoqiret = db.query(zuoqisql)
                print("zuoqisql", zuoqisql,zuoqiret)
                zuoqist=set()
                for row in zuoqiret:
                    if len(retSet)!=0:
                        if row["usertype_id"] in retSet:
                            zuoqist.add(row["usertype_id"])
                    else:
                        zuoqist.add(row["usertype_id"])
                return zuoqist
            return retSet

def Getfabao(dataDict,data,db):
        int=Lenlist(data)
        if int !=0:
            sql="""
                select  *  from wdsousuo_fabao where 
            """
            sql += "  usertype_id in  %s " %  ListTotuple(data,int)
            #等级
            if dataDict["minfabaodengji"] != "" and dataDict["maxfabaodengji"] != "":
                sql += "  AND level  BETWEEN %s  AND %s  " % (dataDict["minfabaodengji"], dataDict["maxfabaodengji"])
            #法宝物伤增加
            if dataDict["select_fabaoshuxing_id"] != "0":
                sql += "  AND code  = %s  " % (dataDict["select_fabaoshuxing_id"])
            #法宝属性
            if dataDict["minfabaowushang"] != "" and dataDict["maxfabaowushang"] != "":
                sql += "  AND attrib  BETWEEN %s  AND %s  " % (dataDict["minfabaowushang"], dataDict["maxfabaowushang"])

            if dataDict["select_fabaohouzhui_id"] != '不限':
                sql += "  AND rank_desc  = '%s'  " % (dataDict["select_fabaohouzhui_id"])
            print("Getfabaosql", sql)
            ret = db.query(sql)
            retSet = set()
            for row in ret:
                    retSet.add(row["usertype_id"])
            return retSet
        return data
def  Getwawa(dataDict,data,db):
        int=Lenlist(data)
        if int !=0:
            sql="""
                select  *  from wdsousuo_wawa where 
            """
            sql += "  usertypeId in  %s " % ListTotuple(data,int)

            if dataDict["wawaminqinmidu"] != "" :
                sql += "  AND intimacy  >= %s  " % (dataDict["wawaminqinmidu"])
            print("Getwawasql", sql)
            ret = db.query(sql)
            retSet = set()
            for row in ret:
                    retSet.add(row["usertypeId"])
            return retSet
        return None
def ListTotuple(list,int):
     if  int==0:
         return None
     elif int==1:
         return "(%s)"%list[0]
     else:
        return str(tuple(list))
def Lenlist(list):
    return len(list)

def ToZuoqiList(data):
    data["zuoqi"]="北极熊、吉祥蛙、至尊吉祥蛙、盘古猿、至尊盘古猿、玉蝶鱼、至尊玉蝶鱼、太极熊、至尊太极熊、鲁道夫、巨骨刺、至尊巨骨刺、九尾仙狐、北斗天蓬、疾风蚀日"
    return data["zuoqi"].split("、")
def Getdata(GetRet):
    data=[]
    for row  in GetRet:
            d = {
                        "ItemId": row["ItemId"],
                        "name":row["name"],
                        "level":row["level"],
                        "phy_power": row["phy_power"],
                        "def_as": row["def_as"],
                        "speed": row["speed"],
                        "Price": row["Price"],
                        "ServerName": row["ServerName"],
                        "mag_power": row["mag_power"],
                        "tao":row["tao"],
                        "CurrentStateName":Getgongshi(row),
                        "image":row["ItemImage"]
                    }
            data.append(d)
    return data


