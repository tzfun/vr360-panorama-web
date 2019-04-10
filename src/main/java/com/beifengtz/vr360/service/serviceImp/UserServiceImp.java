package com.beifengtz.vr360.service.serviceImp;

import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.POJO.DO.User;
import com.beifengtz.vr360.POJO.VO.ResultVO;
import com.beifengtz.vr360.dao.UserMapper;
import com.beifengtz.vr360.dao.VrPhotoMapper;
import com.beifengtz.vr360.service.UserService;
import com.beifengtz.vr360.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;

import static com.beifengtz.vr360.util.RegexUtil.isChinaPhoneLegal;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 10:51 2018/5/12
 * @Modified By:
 */
@Service
public class UserServiceImp implements UserService{

    @Autowired
    UserMapper userMapper;

    @Autowired
    VrPhotoMapper vrPhotoMapper;

    ResultVOUtil resultVOUtil = new ResultVOUtil();

    @Override
    public ResultVO register(User user,String code,HttpSession session) {
        int result = 0;
//        如果是手机登录方式
        if("3".equals(user.getUser_authentication_type_id()) ){
            Date date = new Date();
            long nowTime = date.getTime()/1000;
            try{
                String oldCode= (String) session.getAttribute("code");
                long oldTime = (long) session.getAttribute("sendTime");
                if(oldCode == null){
                    return resultVOUtil.codeError("未经过认证");
                }else if(nowTime-oldTime>300){
                    return resultVOUtil.codeError("验证码已失效");
                }else if(!oldCode.equals(code)){
                    return resultVOUtil.codeError("验证码错误");
                }else{
                    result=userMapper.insertUser(user);
                }
            }catch (NullPointerException e){
                return resultVOUtil.codeError("未经过认证");
            }

        }else{
            result=userMapper.insertUser(user);
        }

        if(result>0){
            JSONObject resJson = new JSONObject();
            resJson.put("token",TokenUtil.setToken(user,session));
            resJson.put("username",user.getUser_name());
            resJson.put("headerImg",user.getUser_header_img());
            return resultVOUtil.success(resJson);
        }else if(result<0){
            return resultVOUtil.exist(result);
        }else{
            return resultVOUtil.systemError(result);
        }
    }

    @Override
    public ResultVO authenticationBySMS(String phoneNumber,String verificationCode, HttpSession session) {
        Date date = new Date();
        long sendTime = date.getTime()/1000;
        String code = String.valueOf(sendTime%1000000);
        session.setAttribute("phoneNumber",phoneNumber);
        session.setAttribute("sendTime",sendTime);
        session.setAttribute("code",code);
        try{
            String oldVerificationCode = (String) session.getAttribute("verificationCode");
//            转换为小写比较
            oldVerificationCode = oldVerificationCode.toLowerCase();
            verificationCode = verificationCode.toLowerCase();
            if (!oldVerificationCode.equals(verificationCode)){
                return resultVOUtil.codeError("验证码错误");
            }else{
                if(isChinaPhoneLegal(phoneNumber) && oldVerificationCode!=null){
                    SMSUtil smsUtil = new SMSUtil();
                    String result=smsUtil.sendSMS(phoneNumber,code);
                    if(result.equals("success")){
                        session.removeAttribute("verificationCode");
                        return resultVOUtil.success("success");
                    }else{
                        return resultVOUtil.systemError("短信发送失败");
                    }
                }else{
                    return resultVOUtil.formatError("手机格式错误");
                }
            }
        }catch (NullPointerException e){
            e.printStackTrace();
            return resultVOUtil.codeError("验证码不存在");
        }
    }

    @Override
    public ResultVO loginByThird(String type, String access_code, HttpSession session) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        User user = new User();
        String defDes = "此人很懒，什么都没留下";
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        user.setUser_register_time(String.valueOf(timestamp));
        try{
            if(type.equals("weibo")){//        微博登录
                JSONObject weiboTokenObject = new JSONObject();
//        用access_code获取token进行认证
                weiboTokenObject= ThirdAuthorUtil.getWeiboToken(access_code);
                if("".equals(weiboTokenObject.get("token")) || weiboTokenObject.get("token")==null){
                    return resultVOUtil.systemError("weibo用户授权失败");
                }else{
//            用token获取用户信息并存入数据库
                    String token = (String) weiboTokenObject.get("token");
                    String uid = (String) weiboTokenObject.get("uid");
                    session.setAttribute("token",weiboTokenObject);
                    JSONObject weiboInfoObject = ThirdAuthorUtil.getWeiboInfo(token,uid);
                    switch ((String) weiboInfoObject.get("gender")){
                        case "m":
                            user.setUser_sex("b");
                            break;
                        case "f":
                            user.setUser_sex("g");
                            break;
                        case "n":
                            user.setUser_sex("n");
                            break;
                    }
                    String username = (String) weiboInfoObject.get("name");
                    String headerImg = (String) weiboInfoObject.get("profile_image_url");
                    String idstr = (String) weiboInfoObject.get("idstr");
                    user.setAuthentication_type_id("4");
                    user.setUser_name(username);
                    user.setUser_authentication_id(idstr);
                    user.setUser_header_img(headerImg);
                    user.setUser_autograph(uid);

                    if(userMapper.selectUserIsExists(idstr)){
//                        这里更新用户信息
                        System.out.println("该微博用户已经存在");
                        user = userMapper.getUserInfo(idstr);
                    }else{
                        user.setUser_fans("0");
                        user.setUser_follow("0");
                        user.setUser_works("0");
                        user.setUser_des(defDes);
                        userMapper.insertUser(user);
                    }
                    session.removeAttribute("token");
                    JSONObject resJson =new JSONObject();
                    resJson.put("token",TokenUtil.setToken(user,session));
                    resJson.put("sex",user.getUser_sex());
                    resJson.put("fans",user.getUser_fans());
                    resJson.put("follow",user.getUser_follow());
                    resJson.put("des",user.getUser_des());
                    resJson.put("works",user.getUser_works());
                    resJson.put("username",user.getUser_name());
                    resJson.put("headerImg",user.getUser_header_img());
                    return resultVOUtil.success(resJson);
                }
            }else if(type.equals("qq")){//        qq登录
                String token = ThirdAuthorUtil.getQQToken(access_code);
                if("".equals(token) || token == null){
                    return resultVOUtil.systemError("qq获取认证失败");
                }else{
                    String openId = ThirdAuthorUtil.getQQOpenId(token);
                    if(openId!="" && openId!=null){
                        JSONObject qqInfoObject = ThirdAuthorUtil.getQQInfo(token,openId);
                        if(qqInfoObject.getInteger("ret")==0){
                            String headerImg = qqInfoObject.getString("figureurl_qq_1");
                            String username = qqInfoObject.getString("nickname");
                            String userSex = qqInfoObject.getString("gender");
                            user.setUser_name(username);
                            user.setUser_header_img(headerImg);
                            user.setAuthentication_type_id("1");
                            user.setUser_authentication_id(openId);
                            user.setUser_autograph(openId);
                            switch (userSex){
                                case "男":
                                    user.setUser_sex("b");
                                    break;
                                case "女":
                                    user.setUser_sex("g");
                                    break;
                                default:
                                    user.setUser_sex("b");
                                    break;
                            }
                            if(userMapper.selectUserIsExists(openId)){
//                        这里更新用户信息
                                System.out.println("该qq用户已经存在");
                                user = userMapper.getUserInfo(openId);
                            }else{
                                user.setUser_fans("0");
                                user.setUser_follow("0");
                                user.setUser_works("0");
                                user.setUser_des(defDes);
                                userMapper.insertUser(user);
                            }
                            session.removeAttribute("token");
                            JSONObject resJson =new JSONObject();
                            resJson.put("token",TokenUtil.setToken(user,session));
                            resJson.put("sex",user.getUser_sex());
                            resJson.put("fans",user.getUser_fans());
                            resJson.put("follow",user.getUser_follow());
                            resJson.put("des",user.getUser_des());
                            resJson.put("works",user.getUser_works());
                            resJson.put("username",user.getUser_name());
                            resJson.put("headerImg",user.getUser_header_img());
                            return resultVOUtil.success(resJson);
                        }
                    }
                }
                return resultVOUtil.systemError("获取认证失败");
            }else if(type.equals("weixin")) {//        微信登录
                return resultVOUtil.systemError("获取认证失败");
            }else{
                return resultVOUtil.codeError("类型错误");
            }
        }catch (Exception e){
            e.printStackTrace();
            return resultVOUtil.systemError("获取认证失败");
        }
    }

    @Override
    public ResultVO getVerificationCode(HttpSession session) {
        session.removeAttribute("verificationCode");
        String password="1246886075...zhi";
        String letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
        String[] letterStrArray = letterStr.split(",");
        String verificationCode = "";
        for(int i=0;i<4;i++){
            verificationCode += letterStrArray[(int) (Math.random()*(letterStrArray.length))];
        }
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        if(verificationCode!=""){
            session.setAttribute("verificationCode",verificationCode);
            try {
                String encryptResult = AESUtil.aesEncrypt(verificationCode,password);
                return resultVOUtil.success(encryptResult);
            } catch (Exception e) {
                e.printStackTrace();
                return resultVOUtil.systemError("转码错误");
            }

        }else{
            return resultVOUtil.systemError(verificationCode);
        }
    }

    @Override
    public ResultVO loginByPhone(HttpSession session, String phoneNumber, String password) {
        try{
            User user = userMapper.getUserInfo(phoneNumber);
            if(user!=null){
                password=MD5Util.GetMD5Code(MD5Util.GetMD5Code(password));
                if(password.equals(user.getUser_autograph())){
                    JSONObject resJson = new JSONObject();
                    resJson.put("token",TokenUtil.setToken(user,session));
                    resJson.put("sex",user.getUser_sex());
                    resJson.put("fans",user.getUser_fans());
                    resJson.put("follow",user.getUser_follow());
                    resJson.put("works",user.getUser_works());
                    resJson.put("des",user.getUser_des());
                    resJson.put("username",user.getUser_name());
                    resJson.put("headerImg",user.getUser_header_img());
                    return resultVOUtil.success(resJson);
                }else{
                    return resultVOUtil.loginFiled("密码错误");
                }
            }else{
                return resultVOUtil.loginFiled("用户名或密码错误");
            }
        }catch (Exception e){
            e.printStackTrace();
            return resultVOUtil.systemError(null);
        }
    }

    @Override
    public ResultVO logout(HttpSession session) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        session.invalidate();
        return resultVOUtil.success(null);
    }

    @Override
    public ResultVO uploadQuestion(String question, String describe, String userAuthId) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();

        if(RegexUtil.filterSqlString(describe) && RegexUtil.filterSqlString(question)){
            return resultVOUtil.paramError("含非法字符");
        }else{
            try{
                int res = userMapper.insertQuestion(question,describe,userAuthId);
                if(res >0){
                    return resultVOUtil.success(null);
                }
            }catch (Exception e1){
                e1.printStackTrace();
            }
            return resultVOUtil.systemError(null);
        }
    }

    @Override
    public ResultVO uploadPersonInfo(String userAuthId, String changeUsername, String changeSex, String changeDescribe, String oldPassword, String newPassword) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        if(RegexUtil.filterSqlString(changeUsername) && RegexUtil.filterSqlString(changeDescribe) && RegexUtil.filterSqlString(changeSex)){
            try{
                System.out.println(oldPassword);
                User user = userMapper.getUserInfo(userAuthId);
                if(oldPassword.length() < 8 ){
                    if(userMapper.setUserInfo(userAuthId,changeUsername,changeSex,changeDescribe)>0){
                        return resultVOUtil.success(null);
                    }
                }else{
                    if(user.getUser_autograph().equals(MD5Util.GetMD5Code(MD5Util.GetMD5Code(oldPassword)))){
                        if(user.getUser_authentication_type_id().equals("3")){
                            if(userMapper.setUserInfo(userAuthId,changeUsername,changeSex,changeDescribe,MD5Util.GetMD5Code(MD5Util.GetMD5Code(newPassword)))>0){
                                return resultVOUtil.success(null);
                            }
                        }else{
                            return resultVOUtil.unauthorized("该注册类型不允许修改");
                        }
                    }else{
                        return resultVOUtil.paramError("旧密码错误");
                    }
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        }else{
            return resultVOUtil.paramError("参数不合法");
        }
        return null;
    }

    @Override
    public ResultVO getPeopleData(String uid) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        if(RegexUtil.filterSqlString(uid)){
            if(userMapper.selectUserIsExists(uid)){
                User user = userMapper.getUserInfo(uid);
                JSONObject resJson = new JSONObject();
                resJson.put("sex",user.getUser_sex());
                resJson.put("des",user.getUser_des());
                resJson.put("username",user.getUser_name());
                resJson.put("headerImg",user.getUser_header_img());
                resJson.put("registerTime",user.getUser_register_time());
                resJson.put("registerType",user.getAuthentication_type_id());
                resJson.put("authId",user.getUser_authentication_id());
                JSONObject countData = userMapper.getRelationshipAndWorks(uid);
                resJson.put("fans",countData.getInteger("fans"));
                resJson.put("follow",countData.getInteger("follow"));
                resJson.put("works",countData.getInteger("works"));
                return resultVOUtil.success(resJson);
            }else{
                return resultVOUtil.userNotFound(null);
            }

        }else{
            return resultVOUtil.paramError("参数非法");
        }
    }

    @Override
    public ResultVO addFollowRelationship(String fanAuthId, String followAuthId) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        if(RegexUtil.filterSqlString(followAuthId)){
            if(userMapper.selectUserIsExists(followAuthId)){
                if(userMapper.selectRelationship(fanAuthId,followAuthId)){
                    return resultVOUtil.exist("你已经是Ta的粉丝");
                }else{
                    try{
                        int res = userMapper.insertRelationship(fanAuthId,followAuthId);
                        User user = userMapper.getUserInfo(fanAuthId);
                        if(user == null){
                            userMapper.delRelationship(fanAuthId,followAuthId);
                            return resultVOUtil.userNotFound(null);
                        }else{
                            String messageContent = "vr360好友【"+user.getUser_name()+"】关注了您，希望和您一起去开创更大全景世界!";
                            String messageImg = user.getUser_header_img();
                            String messageTitle = "有好友关注你啦！";
                            String author = "系统";
                            String userMessageLink = "/p/people.html?uid="+fanAuthId;
                            vrPhotoMapper.insertUserMessage(author,
                                    String.valueOf(new Date().getTime()),
                                    messageTitle,
                                    messageContent,
                                    followAuthId,
                                    userMessageLink,
                                    messageImg);
                            if(res >0){
                                return resultVOUtil.success(null);
                            }else{
                                return resultVOUtil.systemError(null);
                            }
                        }
                    }catch (Exception e){
                        e.printStackTrace();
                        return resultVOUtil.systemError(null);
                    }
                }
            }else{
                return resultVOUtil.userNotFound(null);
            }
        }else{
            return resultVOUtil.paramError("参数非法");
        }
    }

    @Override
    public ResultVO checkFollowRelationship(String fanAuthId, String followAuthId) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        if(RegexUtil.filterSqlString(followAuthId)){
            if(userMapper.selectUserIsExists(followAuthId)){
                boolean isExist = userMapper.selectRelationship(fanAuthId,followAuthId);
                return resultVOUtil.success(isExist);
            }else{
                return resultVOUtil.userNotFound(null);
            }
        }else{
            return resultVOUtil.paramError("参数非法");
        }
    }

    @Override
    public ResultVO delFollowRelationship(String fanAuthId, String followAuthId) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        if(RegexUtil.filterSqlString(followAuthId)){
            if(userMapper.selectUserIsExists(followAuthId)){
                if(userMapper.selectRelationship(fanAuthId,followAuthId)){
                    int res = userMapper.delRelationship(fanAuthId,followAuthId);
                    if(res>0){
                        return resultVOUtil.success(null);
                    }else{
                        return resultVOUtil.systemError(null);
                    }
                }else{
                    return resultVOUtil.resourceNotFound("你还不是Ta的粉丝");
                }

            }else{
                return resultVOUtil.userNotFound(null);
            }
        }else{
            return resultVOUtil.paramError("参数非法");
        }
    }

    @Override
    public ResultVO getFans(String authId,int tempPage,int pageCapacity) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        if(userMapper.selectUserIsExists(authId)){
            JSONObject totalData = userMapper.getRelationshipAndWorks(authId);
            if(totalData.getInteger("fans") <= 0){
                return resultVOUtil.resourceNotFound(null);
            }else {
                ArrayList fansList = userMapper.selectUserFans(authId,tempPage,pageCapacity);
                if(fansList == null){
                    return resultVOUtil.systemError(null);
                }else{
                    JSONObject res = new JSONObject();
                    res.put("total",totalData.getInteger("fans"));
                    res.put("data",fansList);
                    return resultVOUtil.success(res);
                }
            }
        }else{
            return resultVOUtil.userNotFound(null);
        }
    }

    @Override
    public ResultVO getFollows(String authId, int tempPage, int pageCapacity) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        if(userMapper.selectUserIsExists(authId)){
            JSONObject totalData = userMapper.getRelationshipAndWorks(authId);
            if(totalData.getInteger("follow") <= 0){
                return resultVOUtil.resourceNotFound(null);
            }else {
                ArrayList fansList = userMapper.selectUserFollows(authId,tempPage,pageCapacity);
                if(fansList == null){
                    return resultVOUtil.systemError(null);
                }else{
                    JSONObject res = new JSONObject();
                    res.put("total",totalData.getInteger("follow"));
                    res.put("data",fansList);
                    return resultVOUtil.success(res);
                }
            }
        }else{
            return resultVOUtil.userNotFound(null);
        }
    }
}
