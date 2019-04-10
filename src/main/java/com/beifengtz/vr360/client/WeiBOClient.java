package com.beifengtz.vr360.client;

import sun.net.www.http.HttpClient;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 16:19 2018/5/13
 * @Modified By:
 */
public class WeiBOClient extends HttpClient {
    public String doGet(String code){
        String CLIENT_ID="2791069346";
        String CLIENT_SECRET="f6d226dd21c08ca892d6714a40277399";
        String REDIRECT_URI="http://vr.beifengtz.com";
        String AUTHORIZATION_CODE=code;
        String smsUrl="https://api.weibo.com/oauth2/access_token?client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&grant_type=authorization_code&redirect_uri="+REDIRECT_URI+"&code="+AUTHORIZATION_CODE;

        return null;
    }
}
