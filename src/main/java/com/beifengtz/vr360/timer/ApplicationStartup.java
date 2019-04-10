package com.beifengtz.vr360.timer;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * @Author beifengtz
 * @Date Created in 12:31 2018/8/19
 * @Description:
 */
@Component//被spring容器管理
@Order(1)//如果多个自定义ApplicationRunner，用来标明执行顺序
public class ApplicationStartup implements ApplicationRunner {

    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("-------------->" + "项目成功启动，now=" + new Date());
//        更新网站统计
        UpdateStatistic updateStatistic = new UpdateStatistic();
        updateStatistic.updateWeekStatistic();
        updateStatistic.updateDayStatistic();
    }
}
