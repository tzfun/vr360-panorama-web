package com.beifengtz.vr360.service;

import com.beifengtz.vr360.POJO.DO.User;
import com.beifengtz.vr360.POJO.VO.ResultVO;

import javax.servlet.http.HttpSession;

/**
 * @Author: beifengtz
 * @Desciption: 用户操作业务层
 * @Date: Created in 10:17 2018/5/12
 * @Modified By:
 */
public interface UserService {
    /**
    * @Author:beifengtz
    * @Desciption: 注册
     * @param registerType 注册类型，qq、手机等
     * @param authenticationId 认证id，qq号、手机号等
     * @param autograph 签名、密码等
     * @param headerImg 头像地址
     * @param code 短信验证码
     * @param session httpSession
    * @Date: Created in 10:43 2018/5/12
    */
    ResultVO register(User user, String code, HttpSession session);

    /**
    * @Author:beifengtz
    * @Desciption: 通过短信进行身份认证
     * @param phoneNumber 手机号码
     * @param verificationCode 输入的安全验证码
     * @param session httpSession
    * @Date: Created in 14:52 2018/5/12
    */
    ResultVO authenticationBySMS(String phoneNumber,String verificationCode, HttpSession session);

    /**
    * @Author:beifengtz
    * @Desciption: 通过第三方认证登录
    * @Date: Created in 16:52 2018/5/13
    */
    ResultVO loginByThird(String type, String access_code, HttpSession session);

    /**
    * @Author:beifengtz
    * @Desciption: 获取前端安全验证码
    * @Date: Created in 10:31 2018/5/15
    */
    ResultVO getVerificationCode(HttpSession session);

    /**
    * @Author:beifengtz
    * @Desciption: 通过手机号登录
     * @param phoneNumber 手机号码
     * @param password 密码
     * @param session httpSession
    * @Date: Created in 10:31 2018/5/15
    */
    ResultVO loginByPhone(HttpSession session, String phoneNumber, String password);

    ResultVO logout(HttpSession session);

    ResultVO uploadQuestion(String question, String describe, String userAuthId);

    ResultVO uploadPersonInfo(String userAuthId, String changeUsername, String changeSex, String changeDescribe, String oldPassword, String newPassword);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 0:21
     * @Description: 获取用户基本信息
     * @param uid 用户身份认证id
     * @return
     */
    ResultVO getPeopleData(String uid);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 0:21
     * @Description: 关注某人
     * @param   fanAuthId 关注人身份认证id
     * @param   followAuthId 被关注人身份认证id
     * @return
     */
    ResultVO addFollowRelationship(String fanAuthId, String followAuthId);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 1:07
     * @Description: 检查是否关注
     * @param
     * @return
     */
    ResultVO checkFollowRelationship(String fanAuthId, String followAuthId);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 1:20
     * @Description: 删除关系，取消关注
     * @param
     * @return
     */
    ResultVO delFollowRelationship(String fanAuthId, String followAuthId);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:53
     * @Description: 获取用户的粉丝列表
     * @param   authId 唯一身份认证（String）
     * @param tempPage 当前页（int）
     * @param pageCapacity 每页容量（int）
     * @return
     */
    ResultVO getFans(String authId,int tempPage,int pageCapacity);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:53
     * @Description: 获取用户的关注的人列表
     * @param   authId 唯一身份认证（String）
     * @param tempPage 当前页（int）
     * @param pageCapacity 每页容量（int）
     * @return
     */
    ResultVO getFollows(String authId, int tempPage, int pageCapacity);

}
