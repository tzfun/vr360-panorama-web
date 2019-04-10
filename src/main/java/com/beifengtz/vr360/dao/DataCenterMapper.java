package com.beifengtz.vr360.dao;

import com.alibaba.fastjson.JSONObject;
import org.mapstruct.Mapper;

import java.util.ArrayList;

/**
 * @Author beifengtz
 * @Date Created in 17:48 2018/8/1
 * @Description:
 */
@Mapper
public interface DataCenterMapper {

    int insertVisitLog(String ip, String nowTimeStamp,String page,
                       String address,
                       String operator,
                       String pro,
                       String city,
                       int pCode);

    JSONObject selectStatisticsInfo();

    JSONObject selectCityAndWorks();

    ArrayList selectDayAndWeek();

    JSONObject selectDay();

    JSONObject selectWeek();

    int updateStatistics(JSONObject statistics);

    ArrayList selectEveryDay();
}
