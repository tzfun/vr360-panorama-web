package com.beifengtz.vr360;

import com.beifengtz.vr360.beifeng.BeifengShow;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ServletComponentScan
//定时器
@EnableScheduling
public class Vr360Application{
	public static void main(String[] args) {
		SpringApplication.run(Vr360Application.class, args);
		BeifengShow.printLogo();
	}
}
