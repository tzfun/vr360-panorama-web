package com.beifengtz.vr360.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.POJO.VO.ResultVO;
import com.beifengtz.vr360.constants.CommonConstants;
import com.beifengtz.vr360.service.VrPhotoService;
import com.beifengtz.vr360.util.ResultVOUtil;
import com.beifengtz.vr360.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;

/**
 * @Author: beifengtz
 * @Desciption: vr图片controller
 * @Date: Created in 15:12 2018/5/20
 * @Modified By:
 */
@RestController
public class VrPhotoController {

    @Autowired
    VrPhotoService vrPhotoService;

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:48
     * @Description: 上传文件接口，非公共
     * @param   file 文档流（MultipartFile）
     * @param   token 身份签名（String）
     * @param   photoType 图片类型（String）
     * @param   session 会话（HttpSession）
     * @return
     */
    @PostMapping(CommonConstants.NONPUBLIC_PREFIX+"/uploadFile")
    @ResponseBody
    public ResultVO uploadFile(@RequestParam("file") MultipartFile file,
                               @RequestHeader("token") String token,
                               @RequestParam("photoType") String photoType,
                               HttpSession session){
        String authId = TokenUtil.getAuthIdByToken(token,session);
        if(authId == null){
            ResultVOUtil resultVOUtil = new ResultVOUtil();
            return resultVOUtil.loginFiled("token失效");
        }else{
            return vrPhotoService.uploadPhoto(file,authId,photoType);
        }
    }


   @PostMapping(CommonConstants.NONPUBLIC_PREFIX+"/uploadVrInfo")
    @ResponseBody
    public ResultVO uploadFile(@RequestParam("vrPhotoParam") String vrPhotoParam,
                               @RequestParam("photoIds") String photoIdList,
                               @RequestParam("vrPhotoType") String vrPhotoType,
                               @RequestParam("vrPhotoDes") String vrPhotoDes,
                               @RequestHeader("token") String token,
                               HttpSession session){
        String userAuthId = TokenUtil.getAuthIdByToken(token,session);
        return vrPhotoService.uploadInfo(userAuthId,vrPhotoType,JSONObject.parseObject(vrPhotoParam),JSONArray.parseArray(photoIdList),vrPhotoDes);
    }

    @GetMapping(CommonConstants.NONPUBLIC_PREFIX+"/selectVrPhotoByUserAuthId")
    @ResponseBody
    public ResultVO selectVrPhotoByUserAuthId(@RequestHeader("token") String token,
                               HttpSession session,
                                              @RequestParam("stats") int stats){
        String userAuthId = TokenUtil.getAuthIdByToken(token,session);
        return vrPhotoService.selectVrPhotoByUserAuthId(userAuthId,stats);
    }

    @GetMapping(CommonConstants.PUB_PREFIX+"/selectPeopleVrPhotoByPaging")
    @ResponseBody
    public ResultVO selectPeopleVrPhotoByPaging(@RequestParam("uid") String uid,
                                                @RequestParam("tempPage") int tempPage,
                                                @RequestParam("pageCapacity") int pageCapacity){
        return vrPhotoService.selectPeopleVrPhotoByPaging(uid,tempPage,pageCapacity);
    }

    @GetMapping(CommonConstants.PUB_PREFIX+"/getVrPhotoInfo")
    @ResponseBody
    public ResultVO getVrPhotoInfo(@RequestHeader("token") String token,
                                   @RequestParam("vrPhotoId") int vrPhotoId,
                                   HttpSession session){
        if(token.equals("0")){
            return vrPhotoService.getVrPhotoInfo("0",vrPhotoId);
        }else{
            String userAuthId = TokenUtil.getAuthIdByToken(token,session);
            return vrPhotoService.getVrPhotoInfo(userAuthId,vrPhotoId);
        }
    }

    @GetMapping(CommonConstants.PUB_PREFIX+"/getLastVrPhoto")
    @ResponseBody
    public ResultVO getLastVrPhoto(@RequestParam(value = "tempPage",defaultValue = "1") int tempPage,
                                   @RequestParam(value = "pageCapacity",defaultValue = "6") int pageCapacity){
        return vrPhotoService.selectVrPhoto(tempPage,pageCapacity,"last");
    }

    @GetMapping(CommonConstants.PUB_PREFIX+"/getHotVrPhoto")
    @ResponseBody
    public ResultVO getHotVrPhoto(@RequestParam(value = "tempPage",defaultValue = "1") int tempPage,
                                   @RequestParam(value = "pageCapacity",defaultValue = "6") int pageCapacity){
        return vrPhotoService.selectVrPhoto(tempPage,pageCapacity,"hot");
    }

    @GetMapping(CommonConstants.PUB_PREFIX+"/getRecommendVrPhoto")
    @ResponseBody
    public ResultVO getRecommendVrPhoto(@RequestParam(value = "tempPage",defaultValue = "1") int tempPage,
                                  @RequestParam(value = "pageCapacity",defaultValue = "3") int pageCapacity){
        return vrPhotoService.selectVrPhoto(tempPage,pageCapacity,"recommend");
    }

    @PostMapping(CommonConstants.PUB_PREFIX+"/addHeart")
    @ResponseBody
    public ResultVO addHeart(@RequestParam("id") int vrphotoId,
                             @RequestParam("timestamp") String timestamp,
                             @RequestParam("token") String token,
                             HttpSession session){
        return vrPhotoService.addHeart(TokenUtil.getAuthIdByToken(token,session),vrphotoId,timestamp);
    }
}
