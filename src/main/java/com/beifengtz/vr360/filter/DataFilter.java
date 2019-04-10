package com.beifengtz.vr360.filter;

import org.springframework.core.annotation.Order;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @Author: beifengtz
 * @Desciption: 请求数据格式规范
 * @Date: Created in 18:43 2018/5/12
 * @Modified By:
 */

@Order(1)
@WebFilter(urlPatterns = "/*", filterName = "DataFilter")
public class DataFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse rep = (HttpServletResponse) response;

        //设置允许跨域的配置
        // 这里填写你允许进行跨域的主机ip（正式上线时可以动态配置具体允许的域名和IP）
        rep.setHeader("Access-Control-Allow-Origin", "*");
        // 允许的访问方法
        rep.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE, PATCH");
        // Access-Control-Max-Age 用于 CORS 相关配置的缓存
        rep.setHeader("Access-Control-Max-Age", "3600");
        // 头部信息
        rep.setHeader("Access-Control-Allow-Headers", "token,Origin, X-Requested-With, Content-Type, Accept");

        // 字符编码
        response.setCharacterEncoding("UTF-8");

        chain.doFilter(request, response);

    }

    @Override
    public void destroy() {

    }
}