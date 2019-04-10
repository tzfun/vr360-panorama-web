package com.beifengtz.vr360.controller;

import com.beifengtz.vr360.util.NetUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * @Author beifengtz
 * @Date Created in 10:51 2018/9/2
 * @Description:
 */
@Controller
public class NetController {

    @GetMapping("/getIp")
    @ResponseBody
    public String getIp(HttpServletRequest request){
        return NetUtil.getIpAddress(request);
    }
}
