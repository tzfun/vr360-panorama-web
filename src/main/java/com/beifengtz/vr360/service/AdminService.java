package com.beifengtz.vr360.service;

import com.beifengtz.vr360.POJO.VO.ResultVO;

import javax.servlet.http.HttpSession;

/**
 * @Author beifengtz
 * @Date Created in 21:02 2018/5/22
 * @Description:
 */
public interface AdminService {

    /**
     * @Author beifengtz
     * @Date Created in 2018/5/22 21:23
     * @Description: 管理员登录
     * @param adminid 管理员id
     * @param password 密码
     * @return
     */
    ResultVO adminLogin(String adminid, String password, HttpSession session);

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/2 12:21
     * @Description: 获取用户列表
     * @param
     * @return
     */
    ResultVO getUserList(String adminAuthId, int tempPage, int pageCapacity);

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 20:59
     * @Description: 删除用户
     * @param
     * @return
     */
    ResultVO delUser(String token, HttpSession session, String uid);

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 21:15
     * @Description: 分页获取全景图列表
     * @param
     * @return
     */
    ResultVO getPanoramaList(HttpSession session, String token, int tempPage, int pageCapacity);

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 21:37
     * @Description: 设置图片状态
     * @param
     * @return
     */
    ResultVO setPanoramaStats(HttpSession session, String token, int photoId, int stats);

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 22:02
     * @Description: 删除全景图片
     * @param
     * @return
     */
    ResultVO delPanorama(HttpSession session, String token, int photoId);

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/8 22:31
     * @Description: 设置全景图推荐
     * @param
     * @return
     */
    ResultVO setRecommend(HttpSession session, String token, int photoId,int value);

    /**
     * @Author beifengtz
     * @Date Created in 2018/9/9 15:50
     * @Description: 通过图片id获取图片信息
     * @param
     * @return
     */
    ResultVO getVrPhotoById(HttpSession session, String token, int photoId);
}
