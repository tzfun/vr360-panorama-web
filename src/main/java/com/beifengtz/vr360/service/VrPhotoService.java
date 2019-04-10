package com.beifengtz.vr360.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.POJO.VO.ResultVO;
import org.springframework.web.multipart.MultipartFile;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 15:13 2018/5/20
 * @Modified By:
 */
public interface VrPhotoService {
    /**
    * @Author:beifengtz
    * @Desciption: 单张图片上传
     * @param file 上传的文件
     * @param fileInfoJson vr参数
     * @param authId 用户身份认证id
    * @Date: Created in 15:16 2018/5/20
    */
    ResultVO uploadPhoto(MultipartFile file, String authId,String photoType);

    /**
    * @Author:beifengtz
    * @Desciption: 上传照片信息
     * @param vrPhotoType 全景图片类型，sola、combination等
     * @param vrPhotoParam 图片信息
     * @param photoIdList 图片存储表对应的id
    * @Date: Created in 18:55 2018/5/21
    */
    ResultVO uploadInfo(String userAuthId, String vrPhotoType, JSONObject vrPhotoParam, JSONArray photoIdList, String vrPhotoDes);

    /**
     * @Author beifengtz
     * @Date Created in 2018/6/2 11:11
     * @Description: 查询用户所有照片信息（包含未审核）
     * @param
     * @return
     */
    ResultVO selectVrPhotoByUserAuthId(String userAuthId, int stats);

    /**
     * @Author beifengtz
     * @Date Created in 2018/6/2 11:10
     * @Description: 获取单张照片详情信息，仅个人用户使用（包含未审核状态的照片）
     * @param
     * @return
     */
    ResultVO getVrPhotoInfo(String userAuthId, int vrPhotoId);

    /**
     * @Author beifengtz
     * @Date Created in 2018/6/2 11:09
     * @Description: 分页查询照片信息（社区时使用）
     * @param
     * @return
     */
    ResultVO selectVrPhoto(int tempPage, int pageCapacity, String type);


    /**
     * @Author beifengtz
     * @Date Created in 2018/6/2 11:12
     * @Description: 以管理员身份更改照片状态
     * @param
     * @return
     */
    ResultVO updatePhotoStatsByAdmin(String adminId, int vrPhotoId, int stats);

    /**
     * 图片点赞
     * */
    ResultVO addHeart(String authID,int vrphotoId, String timestamp);

    /**
     * 分页查询用户已发布图片
     * */
    ResultVO selectPeopleVrPhotoByPaging(String uid, int tempPage, int pageCapacity);
}
