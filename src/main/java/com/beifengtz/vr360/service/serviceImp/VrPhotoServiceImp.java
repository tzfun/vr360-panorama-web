package com.beifengtz.vr360.service.serviceImp;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.POJO.DO.User;
import com.beifengtz.vr360.POJO.VO.ResultVO;
import com.beifengtz.vr360.constants.CommonConstants;
import com.beifengtz.vr360.constants.PhotoConstants;
import com.beifengtz.vr360.dao.AdminMapper;
import com.beifengtz.vr360.dao.UserMapper;
import com.beifengtz.vr360.dao.VrPhotoMapper;
import com.beifengtz.vr360.service.VrPhotoService;
import com.beifengtz.vr360.util.OssUtil;
import com.beifengtz.vr360.util.RegexUtil;
import com.beifengtz.vr360.util.ResultVOUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 15:13 2018/5/20
 * @Modified By:
 */
@Service
public class VrPhotoServiceImp implements VrPhotoService {

    @Autowired
    VrPhotoMapper vrPhotoMapper;

    @Autowired
    UserMapper userMapper;

    @Autowired
    AdminMapper adminMapper;

    @Override
    public ResultVO uploadPhoto(MultipartFile file, String authId,String photoType) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        OssUtil ossUtil = new OssUtil();
        if(file.isEmpty()){
            return resultVOUtil.paramError("文件不能为空");
        }else{
            String fileName = file.getOriginalFilename();
            String suffixName = fileName.substring(fileName.lastIndexOf("."));
            if(!"jpg".equals(suffixName) && "jpeg".equals(suffixName) && "png".equals(suffixName)){
                return resultVOUtil.paramError("文件格式错误");
            }else if(!photoType.equals(PhotoConstants.SINGLE_PHOTO) && !photoType.equals(PhotoConstants.FRONT_PHOTO)
                     && !photoType.equals(PhotoConstants.RIGHT_PHOTO) && !photoType.equals(PhotoConstants.TOP_PHOTO)
                    && !photoType.equals(PhotoConstants.BOTTOM_PHOTO) && !photoType.equals(PhotoConstants.BACK_PHOTO)
                    && !photoType.equals(PhotoConstants.LEFT_PHOTO)){
                return resultVOUtil.paramError("文件类型错误");
            }else{
                String fileKey = ossUtil.uploadFileWithVR(authId,photoType,file, CommonConstants.OSS_VRPHOTO_LIBRARY);
                if(fileKey!=null){
                    return resultVOUtil.success(vrPhotoMapper.insertVrPhoto(authId,fileKey,photoType));
                }
            }
        }
        return resultVOUtil.systemError(null);
    }

    @Override
    public ResultVO uploadInfo(String userAuthId, String vrPhotoType, JSONObject vrPhotoParam, JSONArray photoIdList, String vrPhotoDes) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        int resultInt = -1;
        switch (vrPhotoType){
            case PhotoConstants.SOLA_PHOTO:
                int solaPhotoId = (int) photoIdList.get(0);
                resultInt = vrPhotoMapper.insertVrInfoBySola(userAuthId,vrPhotoType,String.valueOf(vrPhotoParam),solaPhotoId,vrPhotoDes);
                break;
            case PhotoConstants.COMBINATION_PHOTO:
                int solaPhotoIdOne = photoIdList.getInteger(0);
                int solaPhotoIdTwo = photoIdList.getInteger(1);
                int solaPhotoIdThree = photoIdList.getInteger(2);
                int solaPhotoIdFour = photoIdList.getInteger(3);
                int solaPhotoIdFive = photoIdList.getInteger(4);
                int solaPhotoIdSix = photoIdList.getInteger(5);
                resultInt = vrPhotoMapper.insertVrInfoByComb(userAuthId,vrPhotoType,String.valueOf(vrPhotoParam),
                        solaPhotoIdOne, solaPhotoIdTwo, solaPhotoIdThree, solaPhotoIdFour, solaPhotoIdFive, solaPhotoIdSix,vrPhotoDes);
                break;
            default:
                return resultVOUtil.paramError("照片类型错误");
        }
        if(resultInt>0){
            return resultVOUtil.success(resultInt);
        }else {
            return resultVOUtil.systemError(resultInt);
        }
    }

    @Override
    public ResultVO selectVrPhotoByUserAuthId(String userAuthId,int stats) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        try{
            if(stats!=1 && stats!=2 && stats!=3){
                return resultVOUtil.paramError(null);
            }else{
                JSONArray resJSON = vrPhotoMapper.selectVrListByUserAuthId(userAuthId,stats);
                if(resJSON!=null){
                    return resultVOUtil.success(resJSON);
                }
            }

        }catch (Exception e){
            e.printStackTrace();
        }
        return resultVOUtil.systemError(null);
    }

    @Override
    public ResultVO getVrPhotoInfo(String userAuthId, int vrPhotoId) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        try{
            JSONObject resJSON = vrPhotoMapper.getVrInfoById(vrPhotoId).getJSONObject("res");
            if(resJSON==null || ((userAuthId==null || !userAuthId.equals(resJSON.getString("userAuth")) ) && (resJSON.getInteger("stats")!=2))){
                return resultVOUtil.resourceNotFound(null);
            }else{
                User user = userMapper.getUserInfo(resJSON.getString("userAuth"));
                JSONObject author = new JSONObject();
                author.put("headerImg",user.getUser_header_img());
                author.put("username",user.getUser_name());
                author.put("sex",user.getUser_sex());
                resJSON.put("author",author);
                return resultVOUtil.success(resJSON);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultVOUtil.systemError(null);
    }

    @Override
    public ResultVO selectVrPhoto(int tempPage, int pageCapacity,String type) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        try{
            JSONArray resJSON = vrPhotoMapper.selectVrPhoto(tempPage,pageCapacity,type);
            if(resJSON!=null){
                return resultVOUtil.success(resJSON);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultVOUtil.systemError(null);
    }

    @Override
    public ResultVO updatePhotoStatsByAdmin(String adminId, int vrPhotoId, int stats) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        if(adminMapper.selectAdminIsExist(adminId)){
            if(vrPhotoMapper.updateVrPhotoStats(vrPhotoId,stats)){
                JSONObject resJson= new JSONObject();
                resJson.put("vrPhotoId",vrPhotoId);
                resJson.put("statsNow",stats);
                return resultVOUtil.success(resJson);
            }
        }else{
            return resultVOUtil.unauthorized(null);
        }
        return resultVOUtil.systemError(null);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public ResultVO addHeart(String authId,int vrphotoId, String timestamp) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        try{
            vrPhotoMapper.updateHeartNum();
            JSONObject vrPhoto = vrPhotoMapper.getVrInfoById(vrphotoId);
            String messageContent;
            if(authId == null || authId.equals("null")){
                messageContent = "一位游客点赞了您的作品.";
            }else{
                User user = userMapper.getUserInfo(authId);
                messageContent = "vr360好友【"+user.getUser_name()+"】点赞了您的作品.";
                if(user == null){
                    messageContent = "一位游客点赞了您的作品.";
                }
            }
            String messageImg = CommonConstants.OSS_PHOTOURL.concat(vrPhoto.getJSONObject("res").getJSONObject("photoOne").getString("key")).concat(CommonConstants.OSS_THUMBNAIL);
            String messageTitle = "@"+userMapper.getUserInfo(vrPhoto.getJSONObject("res").getString("userAuth")).getUser_name();
            String author = "系统";
            String userMessageLink = "/p/panorama.html?id="+vrphotoId;
            vrPhotoMapper.insertUserMessage(author,
                    timestamp,
                    messageTitle,
                    messageContent,
                    vrPhoto.getJSONObject("res").getString("userAuth"),
                    userMessageLink,
                    messageImg);
            return resultVOUtil.success(null);
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultVOUtil.systemError(null);
    }

    @Override
    public ResultVO selectPeopleVrPhotoByPaging(String uid, int tempPage, int pageCapacity) {
        int stats = 2;
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        if(RegexUtil.filterSqlString(uid)){
            if(userMapper.selectUserIsExists(uid)){
                ArrayList vrphotoList = vrPhotoMapper.selectPeopleVrPhoto(uid,tempPage,pageCapacity,stats);
                int total = vrPhotoMapper.getTotalPeopleVrPhoto(uid,stats);
                JSONObject res = new JSONObject();
                res.put("vrphotoList",vrphotoList);
                res.put("total",total);
                return resultVOUtil.success(res);
            }else {
                return resultVOUtil.userNotFound(null);
            }
        }else{
            return resultVOUtil.paramError("字符非法");
        }
    }
}
