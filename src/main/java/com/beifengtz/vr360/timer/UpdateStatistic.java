package com.beifengtz.vr360.timer;

import com.beifengtz.vr360.dao.DataCenterMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * @Author beifengtz
 * @Date Created in 9:56 2018/8/19
 * @Description: 定时更新数据统计
 */
@Component
public class UpdateStatistic{

//    注入DataCenterMapper Bean
//    private ApplicationContext applicationContext = SpringUtil.getApplicationContext();
//    private DataCenterMapper dataCenterMapper = applicationContext.getBean(DataCenterMapper.class);

    @Autowired
    DataCenterMapper dataCenterMapper;
    private static UpdateStatistic  updateStatistic ;

    @PostConstruct //通过@PostConstruct实现初始化bean之前进行的操作
    public void init() {
        updateStatistic = this;
        updateStatistic.dataCenterMapper = this.dataCenterMapper;
        // 初使化时将已静态化的testService实例化
    }
    /**
     * @Author beifengtz
     * @Date Created in 2018/8/19 10:14
     * @Description: 日报定时统计，每天5:00
     * @param
     * @return
     */
    @Scheduled(cron = "0 0 5 * * ?")
    public boolean updateDayStatistic() {
        LocalDateTime localDateTime =LocalDateTime.now();
            if(updateStatistic.dataCenterMapper.updateStatistics(updateStatistic.dataCenterMapper.selectDay()) == 1){
                System.out.println("==>VR360每日数据统计更新成功,当前时间为:" + localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                return true;
            }else{
                System.err.println("==>VR360每日数据统计更新失败,当前时间为:" + localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                return false;
            }
    }


    /**
     * @Author beifengtz
     * @Date Created in 2018/8/19 10:15
     * @Description: 周报定时统计，每周一5:30
     * @param
     * @return Boolean
     */
    @Scheduled(cron = "0 30 6 ? * MON")
    public boolean updateWeekStatistic(){
        LocalDateTime localDateTime =LocalDateTime.now();
        if(updateStatistic.dataCenterMapper.updateStatistics(updateStatistic.dataCenterMapper.selectWeek()) == 1) {
            System.out.println("==>VR360每周数据统计更新成功,当前时间为:" + localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            return true;
        }else{
            System.err.println("==>VR360每周数据统计更新失败,当前时间为:" + localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            return false;
        }
    }
}
