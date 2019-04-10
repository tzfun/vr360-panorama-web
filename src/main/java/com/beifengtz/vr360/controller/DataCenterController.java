package com.beifengtz.vr360.controller;

import com.beifengtz.vr360.POJO.VO.ResultVO;
import com.beifengtz.vr360.constants.CommonConstants;
import com.beifengtz.vr360.service.DataCenterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * @Author beifengtz
 * @Date Created in 17:43 2018/8/1
 * @Description:
 */
@RestController
public class DataCenterController {

    @Autowired
    DataCenterService dataCenterService;

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:43
     * @Description: 添加访问日志，公共
     * @param   request 请求（HTTPServletRequest）
     * @param   page 访问页面路径，相对（String）
     * @param   ip 访问ip（String）
     * @return
     */
    @GetMapping(CommonConstants.PUB_PREFIX+"/visitLog")
    @ResponseBody
    public ResultVO visitLog(HttpServletRequest request,
                             @RequestParam("page") String page,
                             @RequestParam("ip") String ip){
        return dataCenterService.visitLog(request,page,ip);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:44
     * @Description: 获取统计信息，公共
     * @param
     * @return
     */
    @GetMapping(CommonConstants.PUB_PREFIX+"/getStatisticsInfo")
    @ResponseBody
    public ResultVO getStatisticsInfo(){
        return dataCenterService.getStatisticsInfo();
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:44
     * @Description: 更新统计信息
     * @param
     * @return
     */
    @GetMapping(CommonConstants.PUB_PREFIX+"/updateStatistics")
    @ResponseBody
    public ResultVO updateStatistics(){
        return dataCenterService.updateStatistics();
    }
}
