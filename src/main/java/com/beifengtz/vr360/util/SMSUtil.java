package com.beifengtz.vr360.util;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsRequest;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.http.MethodType;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;

/**
 * @Author: beifengtz
 * @Desciption: 短信工具
 * @Date: Created in 14:34 2018/5/12
 * @Modified By:
 */
public class SMSUtil {
    //初始化ascClient需要的几个参数
    //产品名称:云通信短信API产品,开发者无需替换
    final String product = "Dysmsapi";
    //产品域名,开发者无需替换
    final String domain = "dysmsapi.aliyuncs.com";
    //替换成你的AK
    final String accessKeyId = "你的SMS短信服务accessKeyId";//你的accessKeyId
    final String accessKeySecret = "你的SMS短信服务accessKeySecret";//你的accessKeySecret

    /**
    * @Author:beifengtz
    * @Desciption: 发送短信工具（注册验证）
     * @param phoneNumber  手机号码
     * @param code 验证码
    * @Date: Created in 10:54 2018/5/13
    */
    public String sendSMS(String phoneNumber, String code){
        //可自助调整超时时间
//        System.setProperty("sun.net.client.defaultConnectTimeout", "10000");
//        System.setProperty("sun.net.client.defaultReadTimeout", "10000");

        try {
            //初始化acsClient,暂不支持region化
            IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou", accessKeyId, accessKeySecret);
            DefaultProfile.addEndpoint("cn-hangzhou", "cn-hangzhou", product, domain);
            IAcsClient acsClient = new DefaultAcsClient(profile);
            //组装请求对象
            SendSmsRequest request = new SendSmsRequest();
            //使用post提交
            request.setMethod(MethodType.POST);
            //必填:待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码,批量调用相对于单条调用及时性稍有延迟,验证码类型的短信推荐使用单条调用的方式；发送国际/港澳台消息时，接收号码格式为00+国际区号+号码，如“0085200000000”
            request.setPhoneNumbers(phoneNumber);
            //必填:短信签名-可在短信控制台中找到
            request.setSignName("vr360");
            //必填:短信模板-可在短信控制台中找到
            request.setTemplateCode("SMS_134318049");
            //可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时,此处的值为
            //友情提示:如果JSON中需要带换行符,请参照标准的JSON协议对换行符的要求,比如短信内容中包含\r\n的情况在JSON中需要表示成\\r\\n,否则会导致JSON在服务端解析失败
            request.setTemplateParam("{\"code\":'"+code+"'}");
            //可选-上行短信扩展码(扩展码字段控制在7位或以下，无特殊需求用户请忽略此字段)
            //request.setSmsUpExtendCode("90997");
            //可选:outId为提供给业务方扩展字段,最终在短信回执消息中将此值带回给调用者
            //request.setOutId("yourOutId");
            //请求失败这里会抛ClientException异常
            SendSmsResponse sendSmsResponse = null;
            sendSmsResponse = acsClient.getAcsResponse(request);
            System.out.println("Code=" + sendSmsResponse.getCode());
            System.out.println("Message=" + sendSmsResponse.getMessage());
            System.out.println("RequestId=" + sendSmsResponse.getRequestId());
            System.out.println("BizId=" + sendSmsResponse.getBizId());
            if(sendSmsResponse.getCode() != null && sendSmsResponse.getCode().equals("OK")) {
                //请求成功
                return "success";
            }else{
                return "fail";
            }
        } catch (ClientException e) {
            e.printStackTrace();
            return "fail";
        }
    }
}
