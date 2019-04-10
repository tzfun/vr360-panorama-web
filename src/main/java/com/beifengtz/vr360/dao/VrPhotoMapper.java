package com.beifengtz.vr360.dao;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.util.ArrayList;

/**
 * @Author: beifengtz
 * @Desciption: vr全景图片mapper
 * @Date: Created in 10:28 2018/5/21
 * @Modified By:
 */
public interface VrPhotoMapper {
    /**
    * @Author:beifengtz
    * @Desciption: 插如vr照片信息
     * @param authenticationId 用户认证id
     * @param vrphotoKey 图片唯一约束键key
     * @param vrphotoType 图片类型
     * @return 存储图片主键id
    * @Date: Created in 10:29 2018/5/21
    */
    int insertVrPhoto(String authenticationId,String vrphotoKey,String vrphotoType);

    /**
    * @Author:beifengtz
    * @Desciption: 插入vr全景照片参数及照片地址（单张）
     * @param vrPhotoType 全景类型（sola、combination等）
     *  @param VRPhotoInfo 全景详情数据
     *  @param solaPhotoId 照片地址对应的id
    * @Date: Created in 19:10 2018/5/21
    */
    int insertVrInfoBySola(String userAuthId,String vrPhotoType, String VRPhotoInfo, int solaPhotoId,String vrphotoDes);

    /**
    * @Author:beifengtz
    * @Desciption: 插入vr全景照片参数及照片地址（组合）
     * @param vrPhotoType 全景类型（sola、combination等）
     * @param VRPhotoInfo 全景详情数据
     *
    * @Date: Created in 19:11 2018/5/21
    */
    int insertVrInfoByComb(String userAuthId,String vrPhotoType, String VRPhotoInfo, int solaPhotoIdOne, int solaPhotoIdTwo, int solaPhotoIdThree, int solaPhotoIdFour, int solaPhotoIdFive, int solaPhotoIdSix,String vrphotoDes);

    /**
     * @Author beifengtz
     * @Date Created in 2018/5/25 18:32
     * @Description: 获取用户所有发布vr列表
     * @param   userAuthId 用户认证id
     * @return   vr信息集合
     */
    JSONArray selectVrListByUserAuthId(String userAuthId,int stats);

    /**
     * @Author beifengtz
     * @Date Created in 2018/5/26 13:20
     * @Description: 获取详情数据
     * @param
     * @return
     */
    JSONObject getVrInfoById(int vrPhotoId);

    /**
     * @Author beifengtz
     * @Date Created in 2018/6/1 15:21
     * @Description: 查询全景照片列表（公共）
     * @param
     * @return
     */
    JSONArray selectVrPhoto(int tempPage, int pageCapacity, String type);

    /**
     * @Author beifengtz
     * @Date Created in 2018/6/2 10:55
     * @Description: 以管理员身份查询全景图（高级权限）
     * @param
     * @return
     */
    JSONObject selectVrPhotoByAdmin(int tempPage, int pageCapacity);

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 21:40
     * @Description: 更新图片状态
     * @param
     * @return
     */
    boolean updateVrPhotoStats(int vrPhotoId, int stats);

   /**
    * @Author beifengtz
    * @Date Created in 2018/8/19 19:06
    * @Description: 更新全景图爱心个数
    * @param
    * @return
    */
    void updateHeartNum();

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/19 19:05
     * @Description: 新增一条消息
     * @param author 发出者名称
     * @param timestamp 时间戳13位
     * @param messageTitle 消息标题
     * @param messageContent 消息内容
     * @param authId 接收者身份认证id
     * @param userMessageLink 消息链接，不填时用none代替
     * @param messageImg 图片地址，不填时用none代替
     * @return
     */
    int insertUserMessage(String author, String timestamp, String messageTitle, String messageContent, String authId, String userMessageLink, String messageImg);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/30 23:28
     * @Description: 分页查询用户的图片
     * @param
     * @return
     */
    ArrayList selectPeopleVrPhoto(String uid, int tempPage, int pageCapacity,int stats);

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/30 23:28
     * @Description: 查询用户某种状态图片总数
     * @param
     * @return
     */
    int getTotalPeopleVrPhoto(String uid,int stats);

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 22:26
     * @Description: 删除照片
     * @param
     * @return
     */
    int delVrphoto(int photoId);

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 22:34
     * @Description: 设置推荐值
     * @param
     * @return
     */
    int setRecommend(int photoId, int value);
}
