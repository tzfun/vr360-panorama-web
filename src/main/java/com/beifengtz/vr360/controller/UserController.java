package com.beifengtz.vr360.controller;

import com.beifengtz.vr360.POJO.DO.User;
import com.beifengtz.vr360.POJO.VO.ResultVO;
import com.beifengtz.vr360.constants.CommonConstants;
import com.beifengtz.vr360.dao.UserMapper;
import com.beifengtz.vr360.service.UserService;
import com.beifengtz.vr360.util.ResultVOUtil;
import com.beifengtz.vr360.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.sql.Timestamp;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 10:11 2018/5/12
 * @Modified By:
 */
@Controller
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    UserMapper userMapper;

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:24
     * @Description: 注册接口，公共
     * @param   registerType 注册类型（int)
     * @param   authenticationId 唯一身份识别id（String）
     * @param   autograph 密码认证，双层MD5加密（String）
     * @param   headerImg 头像地址，选填（String）
     * @param   code 短信验证码(String)
     * @param   session 会话session（HttpSession）
     * @return
     */
    @PostMapping(CommonConstants.PUB_PREFIX+"/register")
    @ResponseBody
    public ResultVO userRegister(@RequestParam("authenticationType") int registerType,
                                 @RequestParam("authenticationId") String authenticationId,
                                 @RequestParam("autograph") String autograph,
                                 @RequestParam(value = "headerImg",defaultValue = "0") String headerImg,
                                 @RequestParam(value = "code",defaultValue = "0") String code,
                                 HttpSession session){
        if(registerType==3){
            Timestamp timestamp = new Timestamp(System.currentTimeMillis());
            String username=registerType+"_"+authenticationId;
            User user = new User();
            user.setUser_name(username);
            user.setAuthentication_type_id(String.valueOf(registerType));
            user.setUser_authentication_id(authenticationId);
            user.setUser_autograph(autograph);
            user.setUser_header_img(headerImg);
            user.setUser_register_time(String.valueOf(timestamp));
            user.setUser_sex("n");

            return userService.register(user,code,session);
        }else{
            ResultVOUtil resultVOUtil = new ResultVOUtil();
            return resultVOUtil.paramError("注册类型权限不足");
        }
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:25
     * @Description: 短信发送接口，公共
     * @param   session 会话session（HttpSession）
     * @param   verificationCode 验证码（String）
     * @param   phoneNumber 手机号码（String）
     * @return
     */
    @PostMapping(CommonConstants.PUB_PREFIX+"/sendSMS")
    @ResponseBody
    public ResultVO authenticationBySMS(HttpSession session,
            @RequestParam("verificationCode") String verificationCode,
            @RequestParam("phoneNumber") String phoneNumber){
        return userService.authenticationBySMS(phoneNumber,verificationCode,session);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:29
     * @Description: 第三方登录接口，公共
     * @param   type 登录类型（String）
     * @param   access_code 识别码，OAuth2.0回调生成（String）
     * @return
     */
    @PostMapping(CommonConstants.PUB_PREFIX+"/loginByThird")
    @ResponseBody
    public ResultVO loginByThird(@RequestParam(value = "type",defaultValue = "0") String type,
                                 @RequestParam("code") String access_code,
                                 HttpSession session){
        return userService.loginByThird(type,access_code,session);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:32
     * @Description: 手机登录接口，公共
     * @param   session 会话session（HttpSession）
     * @param   phoneNumber 手机号码，也是AuthID（String）
     * @param   password 密码（String）
     * @return
     */
    @PostMapping(CommonConstants.PUB_PREFIX+"/loginByPhone")
    @ResponseBody
    public ResultVO loginByPhone(HttpSession session,
                                 @RequestParam("phoneNumber") String phoneNumber,
                                 @RequestParam("password") String password){
        return userService.loginByPhone(session,phoneNumber,password);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:33
     * @Description: 获取加密后的验证码接口，公共
     * @param   session 会话session
     * @return
     */
    @GetMapping(CommonConstants.PUB_PREFIX+"/getVerificationCode")
    @ResponseBody
    public ResultVO getVerificationCode(HttpSession session){
        return userService.getVerificationCode(session);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:34
     * @Description: 注销登录接口，非公共
     * @param   session 会话（HttpSession）
     * @return
     */
    @GetMapping(CommonConstants.NONPUBLIC_PREFIX+"/logout")
    @ResponseBody
    public ResultVO logout(HttpSession session) throws Exception {
        return userService.logout(session);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:34
     * @Description: 获取用户信息接口，非公共
     * @param   session 会话（HttpSession）
     * @param   token 身份签名（String）
     * @return
     */
    @GetMapping(CommonConstants.NONPUBLIC_PREFIX+"/getUserInfo")
    @ResponseBody
    public ResultVO getUserInfo(HttpSession session,
                                @RequestHeader("token") String token) throws Exception {
        String userAuth = TokenUtil.getAuthIdByToken(token,session);
        return userService.getPeopleData(userAuth);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:35
     * @Description: 获取用户基本数据，公共
     * @param   uid 用户唯一身份签名（String）
     * @return
     */
    @GetMapping(CommonConstants.PUB_PREFIX+"/getPeopleData")
    @ResponseBody
    public ResultVO getPeopleData(@RequestParam("uid") String uid){
        return userService.getPeopleData(uid);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:36
     * @Description: 上传问题（教程页），非公共
     * @param   question 问题（String）
     * @param   describe 问题描述（String）
     * @param   token 身份签名（String）
     * @param   session 会话（HttpSession）
     * @return
     */
    @ResponseBody
    @PostMapping(CommonConstants.NONPUBLIC_PREFIX+"/uploadQuestion")
    public ResultVO uploadQuestion(@RequestParam("question") String question,
                                   @RequestParam("describe") String describe,
                                   @RequestHeader("token") String token,
                                   HttpSession session){
        String userAuthId =  TokenUtil.getAuthIdByToken(token,session);
        return userService.uploadQuestion(question,describe,userAuthId);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:37
     * @Description: 上传用户个人信息（个人页面修改信息），非公共
     * @param   token 身份签名（String）
     * @param   changeUsername 修改后的用户名（String）
     * @param   changeSex 修改后的性别（String）
     * @param   changeDescribe 修改后的个性签名（String）
     * @param   oldPassword 旧密码，可选但必须和新密码一起上传（String）
     * @param   newPassword 新密码，可选但必须和旧密码一起上传（String）
     * @param   session 会话（HttpSession）
     * @return
     */
   @PostMapping(CommonConstants.NONPUBLIC_PREFIX+"/uploadPersonInfo")
    @ResponseBody
    public ResultVO uploadPersonInfo(@RequestHeader("token") String token,
                                    @RequestParam("changeUsername") String changeUsername,
                                   @RequestParam("changeSex") String changeSex,
                                   @RequestParam("changeDescribe") String changeDescribe,
                                   @RequestParam(value = "oldPassword",required = false) String oldPassword,
                                   @RequestParam(value = "newPassword",required = false) String newPassword,
                                   HttpSession session){
        String userAuthId =  TokenUtil.getAuthIdByToken(token,session);
        return userService.uploadPersonInfo(userAuthId,changeUsername,changeSex,changeDescribe,oldPassword,newPassword);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:39
     * @Description: 添加关注接口，非公共
     * @param   token 身份签名（String）
     * @param   followAuthId 被关注者唯一身份识别签名（String）
     * @param   session 会话（HttpSession）
     * @return
     */
    @PostMapping(CommonConstants.NONPUBLIC_PREFIX+"/addFollowRelationship")
    @ResponseBody
    public ResultVO addFollowRelationship(@RequestHeader("token") String token,
                                          @RequestParam("uid") String followAuthId,
                                          HttpSession session){
        String fanAuthId = TokenUtil.getAuthIdByToken(token,session);
        return userService.addFollowRelationship(fanAuthId,followAuthId);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:40
     * @Description: 取消关注接口，非公共
     * @param   token 身份签名（String）
     * @param   followAuthId 被关注者唯一身份识别签名（String）
     * @param   session 会话（HttpSession）
     * @return
     */
    @PostMapping(CommonConstants.NONPUBLIC_PREFIX+"/delFollowRelationship")
    @ResponseBody
    public ResultVO delFollowRelationship(@RequestHeader("token") String token,
                                          @RequestParam("uid") String followAuthId,
                                          HttpSession session){
        String fanAuthId = TokenUtil.getAuthIdByToken(token,session);
        return userService.delFollowRelationship(fanAuthId,followAuthId);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:41
     * @Description: 查询是否存在关注关系接口，非公共
     * @param   token 身份签名（String）
     * @param   followAuthId 被关注者唯一身份识别签名（String）
     * @param   session 会话（HttpSession）
     * @return
     */
    @GetMapping(CommonConstants.NONPUBLIC_PREFIX+"/checkFollowRelationship")
    @ResponseBody
    public ResultVO checkFollowRelationship(@RequestHeader("token") String token,
                                          @RequestParam("uid") String followAuthId,
                                          HttpSession session){
        String fanAuthId = TokenUtil.getAuthIdByToken(token,session);
        return userService.checkFollowRelationship(fanAuthId,followAuthId);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:53
     * @Description: 获取用户的粉丝列表，非公共
     * @param   token 身份签名（String）
     * @param tempPage 当前页（int）
     * @param pageCapacity 每页容量（int）
     * @param   session 会话（HttpSession）
     * @return
     */
    @GetMapping(CommonConstants.NONPUBLIC_PREFIX+"/user/getFans")
    @ResponseBody
    public ResultVO getFans(@RequestHeader("token") String token,
                            @RequestParam("tempPage") int tempPage,
                            @RequestParam("pageCapacity") int pageCapacity,
                            HttpSession session){
        String authId = TokenUtil.getAuthIdByToken(token,session);
        return userService.getFans(authId,tempPage,pageCapacity);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:53
     * @Description: 获取用户的关注的人列表，非公共
     * @param   token 身份签名（String）
     * @param tempPage 当前页（int）
     * @param pageCapacity 每页容量（int）
     * @param   session 会话（HttpSession）
     * @return
     */
    @GetMapping(CommonConstants.NONPUBLIC_PREFIX+"/user/getFollows")
    @ResponseBody
    public ResultVO getFollows(@RequestHeader("token") String token,
                            @RequestParam("tempPage") int tempPage,
                            @RequestParam("pageCapacity") int pageCapacity,
                            HttpSession session){
        String authId = TokenUtil.getAuthIdByToken(token,session);
        return userService.getFollows(authId,tempPage,pageCapacity);
    }
}
