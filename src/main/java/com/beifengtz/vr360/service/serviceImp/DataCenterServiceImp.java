package com.beifengtz.vr360.service.serviceImp;

import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.POJO.VO.ResultVO;
import com.beifengtz.vr360.dao.DataCenterMapper;
import com.beifengtz.vr360.service.DataCenterService;
import com.beifengtz.vr360.util.NetUtil;
import com.beifengtz.vr360.util.RegexUtil;
import com.beifengtz.vr360.util.ResultVOUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

/**
 * @Author beifengtz
 * @Date Created in 17:46 2018/8/1
 * @Description:
 */
@Service
public class DataCenterServiceImp implements DataCenterService {
    @Autowired
    DataCenterMapper dataCenterMapper;

    @Override
    public ResultVO visitLog(HttpServletRequest request,String page, String ip) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        if (RegexUtil.filterSqlString(page)){
            DateFormat dateTimeformat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String nowTimeStamp = dateTimeformat.format(new Date());
            JSONObject addressJson = NetUtil.getAddressByIp(ip);
            int res=-1;
            if(addressJson == null){
                res = dataCenterMapper.insertVisitLog(ip,nowTimeStamp,page,
                        "error",
                        "error",
                        "error",
                        "error",
                        -1);
            }else{
                res = dataCenterMapper.insertVisitLog(ip,nowTimeStamp,page,
                        addressJson.getString("addr").split(" ")[0],
                        addressJson.getString("addr").split(" ")[1],
                        addressJson.getString("pro"),
                        addressJson.getString("city"),
                        addressJson.getInteger("proCode"));
            }
            if(res > 0){
                JSONObject resJson = new JSONObject();
                resJson.put("ip",ip);
                resJson.put("address",addressJson.getString("addr").split(" ")[0]);
                resJson.put("operator",addressJson.getString("addr").split(" ")[1]);
                return resultVOUtil.success(resJson);
            }else{
                return resultVOUtil.systemError(ip);
            }
        }else{
            return resultVOUtil.paramError("参数非法");
        }
    }

    @Override
    public ResultVO getStatisticsInfo() {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        try{
            JSONObject res = new JSONObject();
            res.put("basic",dataCenterMapper.selectStatisticsInfo());
            res.put("cityAndWorks",dataCenterMapper.selectCityAndWorks());
            res.put("dayAndWeek",dataCenterMapper.selectDayAndWeek());
            res.put("everyday",dataCenterMapper.selectEveryDay());
            if(res.get("basic")!=null && res.get("cityAndWorks")!=null && res.get("dayAndWeek")!=null){
                return resultVOUtil.success(res);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultVOUtil.systemError(null);
    }

    @Override
    public ResultVO updateStatistics() {
        LocalDateTime localDateTime =LocalDateTime.now();
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        try{
            if(dataCenterMapper.updateStatistics(dataCenterMapper.selectDay()) == 1){
                System.out.println("==>VR360每日数据统计更新成功,当前时间为:" + localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            }else{
                System.err.println("==>VR360每日数据统计更新失败,当前时间为:" + localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            }
            if(dataCenterMapper.updateStatistics(dataCenterMapper.selectWeek()) == 1) {
                System.out.println("==>VR360每周数据统计更新成功,当前时间为:" + localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            }else{
                System.err.println("==>VR360每周数据统计更新失败,当前时间为:" + localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            }
            return resultVOUtil.success(null);
        }catch (Exception e){
            return resultVOUtil.systemError(null);
        }
    }
}
