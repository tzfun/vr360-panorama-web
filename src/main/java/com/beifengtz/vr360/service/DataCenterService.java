package com.beifengtz.vr360.service;

import com.beifengtz.vr360.POJO.VO.ResultVO;

import javax.servlet.http.HttpServletRequest;

/**
 * @Author beifengtz
 * @Date Created in 17:46 2018/8/1
 * @Description:
 */
public interface DataCenterService  {
    /**
     * @Author beifengtz
     * @Date Created in 2018/8/1 17:47
     * @Description: 访问日志业务
     * @param
     * @return
     */
    ResultVO visitLog(HttpServletRequest request,String page, String ip);

    ResultVO getStatisticsInfo();

    ResultVO updateStatistics();
}
