package com.beifengtz.vr360.common;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 19:42 2018/5/10
 * @Modified By:
 */
@Configuration
public class DefaultView extends WebMvcConfigurerAdapter{

    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
        super.addViewControllers(registry);
    }
}
