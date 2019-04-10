package com.beifengtz.vr360.dao;

import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.POJO.DO.User;

import java.util.ArrayList;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 10:52 2018/5/12
 * @Modified By:
 */
public interface UserMapper {

    /**
    * @Author:beifengtz
    * @Desciption: 插入用户
     * @param user 用户对象
    * @Date: Created in 10:42 2018/5/15
    */
    int insertUser(User user);

    /**
    * @Author:beifengtz
    * @Desciption: 查询用户是否存在
     * @param authenticationId 用户认证id
    * @Date: Created in 10:44 2018/5/15
    */
    boolean selectUserIsExists(String authenticationId);

    /**
    * @Author:beifengtz
    * @Desciption: 获取用户信息
     * @param user_authentication_id 用户认证id
     * @return User 用户对象
    * @Date: Created in 10:44 2018/5/15
    */
    User getUserInfo(String user_authentication_id);

    /**
    * @Author:beifengtz
    * @Desciption: 获取用户组信息
    * @Date: Created in 10:45 2018/5/15
    */
    User[] getUsersInfo();

    int insertQuestion(String question, String describe, String userAuthId);

    int setUserInfo(String userAuthId, String changeUsername, String changeSex, String changeDescribe, String newPassword);

    int setUserInfo(String userAuthId, String changeUsername, String changeSex, String changeDescribe);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/30 22:46
     * @Description: 获取用户粉丝数、关注数、作品数
     * @param
     * @return
     */
    JSONObject getRelationshipAndWorks(String userAuthId);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 0:26
     * @Description: 新增关注关系
     * @param
     * @return
     */
    int insertRelationship(String fanAuthId, String followAuthId);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 1:09
     * @Description: 查询关系
     * @param
     * @return
     */
    boolean selectRelationship(String fanAuthId, String followAuthId);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 1:22
     * @Description: 删除关系
     * @param
     * @return
     */
    int delRelationship(String fanAuthId, String followAuthId);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 21:05
     * @Description: 查询用户粉丝列表
     * @param
     * @return
     */
    ArrayList selectUserFans(String authId,int tempPage, int pageCapacity);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 21:05
     * @Description: 查询用户关注列表
     * @param
     * @return
     */
    ArrayList selectUserFollows(String authId, int tempPage, int pageCapacity);


    /**
     * @Author beifengtz
     * @Date Created in 2018/9/2 12:24
     * @Description: 查询用户信息，分页
     * @param
     * @return
     */
    ArrayList<User> getUsersInfo(int tempPage, int pageCapacity);

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/2 12:26
     * @Description: 获取用户总数量
     * @param
     * @return
     */
    int getAllUsersCount();

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 21:04
     * @Description: 通过身份认证id删除用户
     * @param
     * @return
     */
    int delUserByAuthId(String uid);
}
