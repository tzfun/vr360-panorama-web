package com.beifengtz.vr360.util;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import java.io.IOException;

/**
 * @Author: beifengtz
 * @Desciption: 第三方授权获取工具类
 * @Date: Created in 16:05 2018/5/13
 * @Modified By:
 */
public class ThirdAuthorUtil {
    /**
    * @Author:beifengtz
    * @Desciption: 获取用户的token认证
     * @param authorizationCode 认证code，授权后回调页面获取
    * @Date: Created in 22:41 2018/5/15
    */
    public static JSONObject getWeiboToken(String authorizationCode){
        DefaultHttpClient httpclient = new DefaultHttpClient();
        String CLIENT_ID="微博身份认证ID";
        String CLIENT_SECRET="微博身份认证秘钥";
        String REDIRECT_URI="认证成功之后的回调地址（比如是自己网站的某个页面）";
        String AUTHORIZATION_CODE=authorizationCode;
        String smsUrl="https://api.weibo.com/oauth2/access_token?client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&grant_type=authorization_code&redirect_uri="+REDIRECT_URI+"&code="+AUTHORIZATION_CODE;


        HttpPost httppost = new HttpPost(smsUrl);
        JSONObject resultObject = new JSONObject();
        String strResult = "";
        String token = "";
        String uid = "";
        try {
            HttpResponse response = httpclient.execute(httppost);

            if (response.getStatusLine().getStatusCode() == 200) {
                /*读返回数据*/
                String conResult = EntityUtils.toString(response
                        .getEntity());

                System.out.println(conResult);
//                返回的json数据
                JSONObject sobj = JSONObject.parseObject(conResult);
                token = sobj.getString("access_token");//返回的token
                String expires_in = sobj.getString("expires_in");//token生命周期，单位：s
                uid = sobj.getString("uid");//等价于传入的authorizationCode
                if(token==null || token ==""){
                    System.out.println("weibo发送失败,token:"+token);
                }else{
                    resultObject.put("uid",uid);
                    resultObject.put("token",token);
                    System.out.println("发送成功");
                }
            } else {
                String err = response.getStatusLine().getStatusCode()+"";
                strResult += "weibo获取token失败:"+err;
            }
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return resultObject;
    }

    /**
    * @Author:beifengtz
    * @Desciption: 获取用户信息
     * @param accessToken 认证token，getWeiboToken接口获取
     * @param uid 用户唯一识别uid，getWeiboToken接口获取
    * @Date: Created in 23:30 2018/5/15
    */
    public static JSONObject getWeiboInfo(String accessToken,String uid){
        DefaultHttpClient httpclient = new DefaultHttpClient();

        String smsUrl="https://api.weibo.com/2/users/show.json?access_token="+accessToken+"&uid="+uid;

        HttpGet httpGet = new HttpGet(smsUrl);
        JSONObject resultObject = new JSONObject();
        try {
            HttpResponse response = httpclient.execute(httpGet);

            if (response.getStatusLine().getStatusCode() == 200) {
                /*读返回数据*/
                String conResult = EntityUtils.toString(response
                        .getEntity());

                System.out.println(conResult);
//                返回的json数据
                JSONObject sobj = JSONObject.parseObject(conResult);
                resultObject = sobj;
            } else {
                String err = response.getStatusLine().getStatusCode()+"";
                System.out.println("weibo获取info失败:"+err);
            }
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return resultObject;
    }


    /**
    * @Author:beifengtz
    * @Desciption: 获取qq认证token
     * @param authorizationCode 认证code, 授权后回调页面获取
    * @Date: Created in 23:52 2018/5/15
    */
    public static String getQQToken(String authorizationCode){
        DefaultHttpClient httpclient = new DefaultHttpClient();
        String CLIENT_ID="QQ身份认证服务ID";
        String CLIENT_SECRET="QQ身份认证服务秘钥";
        String REDIRECT_URI="QQ身份认证成功后的回调地址（与微博认证类似）";
        String smsUrl="https://graph.qq.com/oauth2.0/token?client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&grant_type=authorization_code&redirect_uri="+REDIRECT_URI+"&code="+authorizationCode;


        HttpGet httpGet = new HttpGet(smsUrl);
        String strResult = "";
        String access_token = "";
        try {

            HttpResponse response = httpclient.execute(httpGet);

            if (response.getStatusLine().getStatusCode() == 200) {
                /*读返回数据*/
                String conResult = EntityUtils.toString(response
                        .getEntity());
//                处理返回的字符串
                access_token = StringUtils.substringBeforeLast(conResult, "&");
                access_token = access_token.substring(access_token.indexOf("=")+1);
                if(access_token==null || "".equals(access_token)){
                    System.out.println("qq发送失败,token:"+access_token);
                }else{
                    strResult = access_token;
                    System.out.println("发送成功");
                }
            } else {
                String err = response.getStatusLine().getStatusCode()+"";
                System.out.println("qq获取token失败:"+err);
            }
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return strResult;
    }

    /**
    * @Author:beifengtz
    * @Desciption: 获取用户唯一识别标志openId
     * @param accessToken 授权后获取的token，getQQToken接口获取
    * @Date: Created in 0:01 2018/5/16
    */
    public static String getQQOpenId(String accessToken){
        DefaultHttpClient httpclient = new DefaultHttpClient();
        String smsUrl="https://graph.qq.com/oauth2.0/me?access_token="+accessToken;


        HttpGet httpGet = new HttpGet(smsUrl);
        String openId = "";
        try {

            HttpResponse response = httpclient.execute(httpGet);

            if (response.getStatusLine().getStatusCode() == 200) {
                /*读返回数据*/
                String conResult = EntityUtils.toString(response
                        .getEntity());
//                处理返回的字符串
                int startIndex = conResult.indexOf("(");
                int endIndex = conResult.lastIndexOf(")");
                JSONObject jsonObject = JSONObject.parseObject(conResult.substring(startIndex+1, endIndex));
                openId = jsonObject.getString("openid");
                if(openId==null || "".equals(openId)){
                    System.out.println("发送失败,token:"+openId);
                }else{
                    System.out.println("发送成功");
                }
            } else {
                String err = response.getStatusLine().getStatusCode()+"";
                System.out.println("发送失败:"+err);
            }
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return openId;
    }

    public static JSONObject getQQInfo(String accessToken,String openid){
        DefaultHttpClient httpclient = new DefaultHttpClient();
        String oauth_consumer_key="101473485";
        String smsUrl="https://graph.qq.com/user/get_user_info?access_token="+accessToken+"&oauth_consumer_key="+oauth_consumer_key+"&openid="+openid+"&format=json";
        HttpGet httpGet = new HttpGet(smsUrl);
        JSONObject resultObject = new JSONObject();

        try {
            HttpResponse response = httpclient.execute(httpGet);

            if (response.getStatusLine().getStatusCode() == 200) {
                /*读返回数据*/
                String conResult = EntityUtils.toString(response
                        .getEntity());
//                返回的json数据
                JSONObject sobj = JSONObject.parseObject(conResult);
                resultObject = sobj;
            } else {
                String err = response.getStatusLine().getStatusCode()+"";
                System.out.println("qq获取info失败:"+err);
            }
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return resultObject;
    }
}
