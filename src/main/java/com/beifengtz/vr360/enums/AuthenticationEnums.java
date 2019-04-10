package com.beifengtz.vr360.enums;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 11:10 2018/5/12
 * @Modified By:
 */
public enum  AuthenticationEnums {
    QQ(1,"QQ"),
    WEIXIN(2,"微信"),
    PHONE(3,"手机"),
    WEIBO(4,"微博");

    private int code;

    private String describe;

    AuthenticationEnums(){

    }

    AuthenticationEnums(int code, String describe) {
        this.code = code;
        this.describe = describe;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public String getDescribe() {
        return describe;
    }
}
