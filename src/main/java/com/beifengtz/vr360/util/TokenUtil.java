package com.beifengtz.vr360.util;

import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.POJO.DO.Admin;
import com.beifengtz.vr360.POJO.DO.User;

import javax.servlet.http.HttpSession;
import java.util.UUID;

/**
 * @Author: beifengtz
 * @Desciption: token工具类
 * @Date: Created in 19:23 2018/5/12
 * @Modified By:
 */
public class TokenUtil {
    /**
    * @Author:beifengtz
    * @Desciption: 生成用户token
     * @param session session会话
     * @param user user实体
     * @return token值
    * @Date: Created in 20:04 2018/5/12
    */
    public static String setToken(User user, HttpSession session){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("uid",user.getUser_authentication_id());
        String uuid = String.valueOf(UUID.randomUUID());
        uuid = uuid.replace("-","");
        jsonObject.put("token",uuid);
        jsonObject.put("role","user");
        session.setAttribute("token",jsonObject);
        return uuid;
    }

    /**
     * @Author:beifengtz
     * @Desciption: 生成管理员token
     * @param session session会话
     * @param admin admin实体
     * @return token值
     * @Date: Created in 20:04 2018/5/12
     */
    public static String setAdminToken(Admin admin, HttpSession session){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("uid",admin.getAdmin_id());
        String uuid = String.valueOf(UUID.randomUUID());
        uuid = uuid.replace("-","");
        jsonObject.put("token",uuid);
        jsonObject.put("role","admin");
        session.setAttribute("token",jsonObject);
        return uuid;
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/9 8:55
     * @Description: 生成留言消息token
     * @param session session会话
     * @return
     */
    public static String setMessageBoardToken(HttpSession session){
        JSONObject jsonObject = new JSONObject();
        String uuid = String.valueOf(UUID.randomUUID());
        uuid = uuid.replace("-","");
        jsonObject.put("token",uuid);
        jsonObject.put("role","system");
        session.setAttribute("token",jsonObject);
        return uuid;
    }
    /**
    * @Author:beifengtz
    * @Desciption: 验证token方法
     * @param session session会话
     * @param token 被验证的token字符串
     * @return true存在 false不存在
    * @Date: Created in 20:05 2018/5/12
    */
    public static boolean volidateToken(String token,HttpSession session){
        try{
            JSONObject jsonToken = (JSONObject) session.getAttribute("token");
            if(jsonToken == null){
                return false;
            }
            if(token.equals(jsonToken.get("token"))){
                return true;
            }else{
                return false;
            }
        }catch (NullPointerException e){
            e.printStackTrace();
            return false;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
    /**
    * @Author:beifengtz
    * @Desciption: 通过token获取用户认证id
    * @Date: Created in 11:23 2018/5/21
    */
    public static String getAuthIdByToken(String token,HttpSession session){
        try{
            JSONObject jsonToken = (JSONObject) session.getAttribute("token");
            if(jsonToken==null){
                return null;
            }else if(token.equals(jsonToken.getString("token"))){
                return jsonToken.getString("uid");
            }else{
                return null;
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/2 12:20
     * @Description: 获取管理员token
     * @param
     * @return
     */
    public static String getAdminAuthIdByToken(String token,HttpSession session){
        try{
            JSONObject jsonToken = (JSONObject) session.getAttribute("token");
            if(jsonToken==null){
                return null;
            }else if(token.equals(jsonToken.getString("token")) && jsonToken.getString("role").equals("admin")){
                return jsonToken.getString("uid");
            }else{
                return null;
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
}
