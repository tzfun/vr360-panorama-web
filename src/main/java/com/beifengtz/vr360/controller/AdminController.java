package com.beifengtz.vr360.controller;

import com.beifengtz.vr360.POJO.VO.ResultVO;
import com.beifengtz.vr360.constants.CommonConstants;
import com.beifengtz.vr360.service.AdminService;
import com.beifengtz.vr360.util.ResultVOUtil;
import com.beifengtz.vr360.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

/**
 * @Author beifengtz
 * @Date Created in 20:58 2018/5/22
 * @Description:
 */
@Controller
public class AdminController {

    @Autowired
    AdminService adminService;

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:41
     * @Description: 管理员登录接口，公共
     * @param   session 会话（HttpSession）
     * @param   adminId 管理员id（String）
     * @param   password 管理员密码（String）
     * @return
     */
    @PostMapping(CommonConstants.PUB_PREFIX+"/admin/login")
    @ResponseBody
    public ResultVO adminLogin(HttpSession session,
                                        @RequestParam("adminid") String adminId,
                                        @RequestParam("password") String password){
        return adminService.adminLogin(adminId,password,session);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/2 12:15
     * @Description: 以管理员身份获取用户列表
     * @param
     * @return
     */
    @GetMapping(CommonConstants.NONPUBLIC_PREFIX+"/admin/getUserList")
    @ResponseBody
    public ResultVO getUserList(HttpSession session,
                                @RequestParam("tempPage") int tempPage,
                                @RequestParam("pageCapacity") int pageCapacity,
                                @RequestHeader("token") String token){
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        String adminAuthId = TokenUtil.getAdminAuthIdByToken(token,session);
        if(adminAuthId == null){
            return resultVOUtil.loginFiled(null);
        }else{
            return adminService.getUserList(adminAuthId,tempPage,pageCapacity);
        }
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 21:12
     * @Description: 删除用户
     * @param
     * @return
     */
    @PostMapping(CommonConstants.NONPUBLIC_PREFIX+"/admin/delUser")
    @ResponseBody
    public ResultVO delUser(HttpSession session,
                            @RequestParam("uid") String uid,
                            @RequestHeader("token") String token){
        return adminService.delUser(token,session,uid);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 21:33
     * @Description: 分页获取全景图列表
     * @param
     * @return
     */
    @GetMapping(CommonConstants.NONPUBLIC_PREFIX+"/admin/getPanoramaList")
    @ResponseBody
    public ResultVO getPanoramaList(HttpSession session,
                                    @RequestHeader("token") String token,
                                    @RequestParam("tempPage") int tempPage,
                                    @RequestParam("pageCapacity") int pageCapacity){
        return adminService.getPanoramaList(session,token,tempPage,pageCapacity);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 22:00
     * @Description: 设置图片状态
     * @param
     * @return
     */
    @PostMapping(CommonConstants.NONPUBLIC_PREFIX+"/admin/setPanoramaStats")
    @ResponseBody
    public ResultVO setPanoramaStats(HttpSession session,
                                    @RequestHeader("token") String token,
                                    @RequestParam("photoId") int photoId,
                                    @RequestParam("stats") int stats){
        return adminService.setPanoramaStats(session,token,photoId,stats);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 22:29
     * @Description: 删除全景图片
     * @param
     * @return
     */
    @PostMapping(CommonConstants.NONPUBLIC_PREFIX+"/admin/delPanorama")
    @ResponseBody
    public ResultVO delPanorama(HttpSession session,
                                @RequestHeader("token") String token,
                                @RequestParam("photoId") int photoId){
        return adminService.delPanorama(session,token,photoId);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 22:41
     * @Description: 推上推荐
     * @param
     * @return
     */
    @PostMapping(CommonConstants.NONPUBLIC_PREFIX+"/admin/recommend")
    @ResponseBody
    public ResultVO recommend(HttpSession session,
                                 @RequestHeader("token") String token,
                                 @RequestParam("photoId") int photoId,
                                 @RequestParam("value") int value){
        return adminService.setRecommend(session,token,photoId,value);
    }

    @GetMapping(CommonConstants.NONPUBLIC_PREFIX+"/admin/getVrPhotoById")
    @ResponseBody
    public ResultVO getVrPhotoById(HttpSession session,
                                   @RequestHeader("token") String token,
                                   @RequestParam("photoId") int photoId){
        return adminService.getVrPhotoById(session,token,photoId);
    }
}
