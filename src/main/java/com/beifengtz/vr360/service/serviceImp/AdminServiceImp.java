package com.beifengtz.vr360.service.serviceImp;

import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.POJO.DO.Admin;
import com.beifengtz.vr360.POJO.DO.User;
import com.beifengtz.vr360.POJO.VO.ResultVO;
import com.beifengtz.vr360.constants.CommonConstants;
import com.beifengtz.vr360.dao.AdminMapper;
import com.beifengtz.vr360.dao.MessageMapper;
import com.beifengtz.vr360.dao.UserMapper;
import com.beifengtz.vr360.dao.VrPhotoMapper;
import com.beifengtz.vr360.service.AdminService;
import com.beifengtz.vr360.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Date;

/**
 * @Author beifengtz
 * @Date Created in 21:02 2018/5/22
 * @Description:
 */
@Service
public class AdminServiceImp implements AdminService {

    @Autowired
    private AdminMapper adminMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private VrPhotoMapper vrPhotoMapper;
    @Autowired
    private MessageMapper messageMapper;

    @Override
    public ResultVO adminLogin(String adminid, String password, HttpSession session) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        boolean a = adminid.contains(".");
        boolean b = adminid.contains("-");
        boolean c = adminid.contains("@");
        boolean d = adminid.contains("?");
        boolean e = adminid.contains("#");
        boolean f = adminid.contains("|");
        boolean g = adminid.contains("？");
        boolean h = adminid.contains("'");
        boolean i = adminid.contains(":");
        boolean j = adminid.contains("：");
        boolean k = adminid.contains("*");
        boolean o =adminid.contains("/");
        if(a || b || c || d || e || f || g || h || i || j || k || o){
            return resultVOUtil.paramError("含非法字符");
        }else{
            password = MD5Util.GetMD5Code(MD5Util.GetMD5Code(password));
            Admin admin = adminMapper.getAdminInfo(adminid);
            if(admin == null){
                return resultVOUtil.loginFiled("用户名或密码错误");
            }else{
                if(password.equals(admin.getAdmin_password())){
                    return resultVOUtil.success(TokenUtil.setAdminToken(admin,session));
                }else{
                    return resultVOUtil.loginFiled("用户名或密码错误");
                }
            }

        }
    }

    @Override
    public ResultVO getUserList(String adminAuthId, int tempPage, int pageCapacity) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        JSONObject res = new JSONObject();
        int total = userMapper.getAllUsersCount();
        res.put("total",total);
        if(total == 0){
            return resultVOUtil.success(res);
        }else{
            ArrayList<User> users = userMapper.getUsersInfo(tempPage,pageCapacity);
            res.put("users",users);
            return resultVOUtil.success(res);
        }
    }

    @Override
    public ResultVO delUser(String token, HttpSession session, String uid) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        String adminAuthId = TokenUtil.getAdminAuthIdByToken(token,session);
        if(adminAuthId == null){
            return resultVOUtil.loginFiled(null);
        }else{
            if(RegexUtil.filterSqlString(uid)){
                int res =  userMapper.delUserByAuthId(uid);
                if(res>0){
                    return resultVOUtil.success(null);
                }else{
                    return resultVOUtil.systemError(null);
                }
            }else{
                return resultVOUtil.paramError(null);
            }

        }
    }

    @Override
    public ResultVO getPanoramaList(HttpSession session, String token, int tempPage, int pageCapacity) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        String adminAuthId = TokenUtil.getAdminAuthIdByToken(token,session);
        if(adminAuthId == null){
            return resultVOUtil.loginFiled(null);
        }else{
            JSONObject resJSON = vrPhotoMapper.selectVrPhotoByAdmin(tempPage,pageCapacity);
            if (resJSON !=null){
                return resultVOUtil.success(resJSON);
            }else{
                return resultVOUtil.systemError(null);
            }

        }
    }

    @Override
    public ResultVO setPanoramaStats(HttpSession session, String token, int photoId, int stats) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        String adminAuthId = TokenUtil.getAdminAuthIdByToken(token,session);
        if(adminAuthId == null){
            return resultVOUtil.loginFiled(null);
        }else{
            String messageContent;
            switch (stats){
                case 1:
                    messageContent = "由于某种原因，您发布的此张全景图片被禁封，暂时无法分享，如有疑问请联系管理员。【净化网络环境，人人有责，请不要发布不良图片及信息】";
                    break;
                case 2:
                    messageContent = "恭喜！您上传的全景照片通过管理员审核，快去分享给大家看看吧。【净化网络环境，人人有责，请不要发布不良图片及信息】";
                    break;
                default:
                   return resultVOUtil.paramError(null);
            }
            boolean res1 = vrPhotoMapper.updateVrPhotoStats(photoId,stats);
            JSONObject vrPhoto = vrPhotoMapper.getVrInfoById(photoId);
            String author = "系统";
            String messageImg = CommonConstants.OSS_PHOTOURL.concat(vrPhoto.getJSONObject("res").getJSONObject("photoOne").getString("key")).concat(CommonConstants.OSS_THUMBNAIL);
            String messageTitle = "@"+userMapper.getUserInfo(vrPhoto.getJSONObject("res").getString("userAuth")).getUser_name();
            String userMessageLink = "/p/panorama.html?id="+photoId;
            int res2 = vrPhotoMapper.insertUserMessage(author,
                    String.valueOf(new Date().getTime()),
                    messageTitle,
                    messageContent,
                    vrPhoto.getJSONObject("res").getString("userAuth"),
                    userMessageLink,
                    messageImg);
            if(res1 && res2>0){
                return resultVOUtil.success(null);
            }else{
                return resultVOUtil.systemError(null);
            }
        }
    }

    @Override
    public ResultVO delPanorama(HttpSession session, String token, int photoId) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        String adminAuthId = TokenUtil.getAdminAuthIdByToken(token,session);
        if(adminAuthId == null){
            return resultVOUtil.loginFiled(null);
        }else{
            OssUtil ossUtil = new OssUtil();
            ArrayList<String> delOssList = new ArrayList<String>();
            boolean delOssSuccess = false;
            JSONObject vrPhoto = vrPhotoMapper.getVrInfoById(photoId);
            if(vrPhoto.getJSONObject("res").getString("type").equals("sola")){
                delOssList.add(vrPhoto.getJSONObject("res").getJSONObject("photoOne").getString("key"));
                delOssSuccess = ossUtil.deleteObject(delOssList);
            }else{
                delOssList.add(vrPhoto.getJSONObject("res").getJSONObject("photoOne").getString("key"));
                delOssList.add(vrPhoto.getJSONObject("res").getJSONObject("photoTwo").getString("key"));
                delOssList.add(vrPhoto.getJSONObject("res").getJSONObject("photoThree").getString("key"));
                delOssList.add(vrPhoto.getJSONObject("res").getJSONObject("photoFour").getString("key"));
                delOssList.add(vrPhoto.getJSONObject("res").getJSONObject("photoFive").getString("key"));
                delOssList.add(vrPhoto.getJSONObject("res").getJSONObject("photoSix").getString("key"));
                delOssSuccess = ossUtil.deleteObject(delOssList);
            }
            if (delOssSuccess){
                if(vrPhotoMapper.delVrphoto(photoId)>0){
                    return resultVOUtil.success(null);
                }else{
                    return resultVOUtil.systemError("删除VrPhoto失败");
                }
            }else{
                return resultVOUtil.systemError("删除Oss失败");
            }
        }
    }

    @Override
    public ResultVO setRecommend(HttpSession session, String token, int photoId,int value) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        String adminAuthId = TokenUtil.getAdminAuthIdByToken(token,session);
        if(adminAuthId == null){
            return resultVOUtil.loginFiled(null);
        }else{
            if(vrPhotoMapper.setRecommend(photoId,value)>0){
                if(value == 1){
                    JSONObject vrPhoto = vrPhotoMapper.getVrInfoById(photoId);
                    String author = "系统";
                    String messageContent = "恭喜！您的全景照片受到了广大网友的欢迎，系统已将您的全景推上推荐，快去分享你的全景吧！【净化网络环境，人人有责，请不要发布不良图片及信息】";
                    String messageImg = CommonConstants.OSS_PHOTOURL.concat(vrPhoto.getJSONObject("res").getJSONObject("photoOne").getString("key")).concat(CommonConstants.OSS_THUMBNAIL);
                    String messageTitle = "@"+userMapper.getUserInfo(vrPhoto.getJSONObject("res").getString("userAuth")).getUser_name();
                    String userMessageLink = "/p/panorama.html?id="+photoId;
                    int  res = vrPhotoMapper.insertUserMessage(author,
                            String.valueOf(new Date().getTime()),
                            messageTitle,
                            messageContent,
                            vrPhoto.getJSONObject("res").getString("userAuth"),
                            userMessageLink,
                            messageImg);
                    if(res>0){
                        return resultVOUtil.success(null);
                    }else{
                        return resultVOUtil.systemError(null);
                    }
                }else{
                    return resultVOUtil.success(null);
                }

            }else {
                return resultVOUtil.systemError(null);
            }
        }
    }

    @Override
    public ResultVO getVrPhotoById(HttpSession session, String token, int photoId) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        String adminAuthId = TokenUtil.getAdminAuthIdByToken(token,session);
        if(adminAuthId == null){
            return resultVOUtil.loginFiled(null);
        }else{
            JSONObject res = vrPhotoMapper.getVrInfoById(photoId);
            if(res!=null){
                return resultVOUtil.success(res);
            }else{
                return resultVOUtil.systemError(null);
            }
        }
    }
}
