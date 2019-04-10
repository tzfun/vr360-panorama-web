package com.beifengtz.vr360.filter;

import com.alibaba.fastjson.JSON;
import com.beifengtz.vr360.POJO.VO.ResultVO;
import com.beifengtz.vr360.constants.CommonConstants;
import com.beifengtz.vr360.enums.ResultEnums;
import com.beifengtz.vr360.util.TokenUtil;
import org.springframework.core.annotation.Order;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;

/**
 * @Author: beifengtz
 * @Desciption: 私有接口权限控制
 * @Date: Created in 18:55 2018/5/12
 * @Modified By:
 */
@Order(2)
@WebFilter(urlPatterns ="/"+ CommonConstants.NONPUBLIC_PREFIX+"/*", filterName = "TokenAuthorFilter")
public class TokenAuthorFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse rep = (HttpServletResponse) response;
        rep.setHeader("Content-type", "application/json;charset=UTF-8");
        String token = req.getHeader("token");//header方式
        ResultVO resultVO = new ResultVO();
        String method = ((HttpServletRequest) request).getMethod();
        boolean isFilter =false;
        if (method.equals("OPTIONS")) {
            rep.setStatus(HttpServletResponse.SC_OK);
            return;
        } else {
            if (null == token || token.isEmpty()) {
                resultVO.setCode(ResultEnums.INVALID_TOKEN.getCode());
                resultVO.setMsg("用户授权认证没有通过!未传入token参数");
            } else {
                if (TokenUtil.volidateToken(token,req.getSession())) {
                    resultVO.setCode(ResultEnums.SUCCESS.getCode());
                    resultVO.setMsg("用户授权认证通过!");
                    isFilter = true;
                } else {
                    resultVO.setCode(ResultEnums.INVALID_TOKEN.getCode());
                    resultVO.setMsg("用户授权认证没有通过!客户端请求参数token信息无效");
                }
            }
            if (resultVO.getCode() == ResultEnums.INVALID_TOKEN.getCode()) {// 验证失败
                PrintWriter writer = null;
                OutputStreamWriter osw = null;
                try {
                    osw = new OutputStreamWriter(response.getOutputStream(),
                            "UTF-8");
                    writer = new PrintWriter(osw, true);
                    String jsonStr = JSON.toJSONString(resultVO);
                    writer.write(jsonStr);
                    writer.flush();
                    writer.close();
                    osw.close();
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                    System.out.println("过滤器返回信息失败:" + e.getMessage());
                } catch (IOException e) {
                    e.printStackTrace();
                    System.out.println("过滤器返回信息失败:" + e.getMessage());
                } finally {
                    if (null != writer) {
                        writer.close();
                    }
                    if (null != osw) {
                        osw.close();
                    }

                }
                return;
            }
        }
        if(isFilter){
            chain.doFilter(request, response);
        }else{
            System.out.println("token认证不成功");
        }
    }

    @Override
    public void destroy() {

    }
}
