package com.beifengtz.vr360.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * @Author beifengtz
 * @Date Created in 19:00 2018/8/1
 * @Description:
 */
public class NetUtil {
    /**
     * @Author beifengtz
     * @Date Created in 2018/8/1 19:01
     * @Description: 获取ip地址
     * @param request
     * @return String ip地址
     */
    public static String getIpAddress(HttpServletRequest request){
        String ip = request.getHeader("X-Forwarded-For");
        if(StringUtils.isNotEmpty(ip) && !"unKnown".equalsIgnoreCase(ip)){
            //多次反向代理后会有多个ip值，第一个ip才是真实ip
            int index = ip.indexOf(",");
            if(index != -1){
                return ip.substring(0,index);
            }else{
                return ip;
            }
        }
        ip = request.getHeader("X-Real-IP");
        if(StringUtils.isNotEmpty(ip) && !"unKnown".equalsIgnoreCase(ip)){
            return ip;
        }
        return request.getRemoteAddr();
    }

    public static JSONObject getUrlInfo(HttpServletRequest request){
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        String contextPath = request.getContextPath();
        String servletPath = request.getServletPath();
        String queryString = request.getQueryString();
        JSONObject res = new JSONObject();
        res.put("serverName",serverName);
        res.put("serverPort",serverPort);
        res.put("contextPath",contextPath);
        res.put("servletPath",servletPath);
        res.put("queryString",queryString);
        return res;
    }

    public static JSONObject getAddressByIp(String ip){
        DefaultHttpClient httpclient = new DefaultHttpClient();
//        String smsUrl="http://whois.pconline.com.cn/jsFunction.jsp?callback=jsShow&ip="+ip;
        String smsUrl="http://whois.pconline.com.cn/ipJson.jsp?callback=testJson&ip="+ip;

        HttpGet httpGet = new HttpGet(smsUrl);
        JSONObject resultObject = new JSONObject();
        try {
            HttpResponse response = httpclient.execute(httpGet);
            if (response.getStatusLine().getStatusCode() == 200) {
                /*读返回数据*/
                String conResult = EntityUtils.toString(response
                        .getEntity());
                resultObject = JSON.parseObject(conResult.split("testJson\\(")[1].split("\\);\\}")[0]);
//                resultObject.put("address",conResult.split("'")[1].split(" ")[0]);
//                resultObject.put("operator",conResult.split("'")[1].split(" ")[1]);
//                System.out.println(conResult.split("'")[1].split(" "));
            } else {
                resultObject = null;
                String err = response.getStatusLine().getStatusCode()+"";
                System.out.println("获取地址失败:"+err);
            }
        } catch (ClientProtocolException e) {
            resultObject = null;
            e.printStackTrace();
        } catch (IOException e) {
            resultObject = null;
            e.printStackTrace();
        }
        return resultObject;
    }
}
