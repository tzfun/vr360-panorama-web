package com.beifengtz.vr360.enums;


/**
 * @Author: beifengtz
 * @Desciption: 返回状态枚举类
 * @Date: Created in 19:20 2018/5/7
 * @Modified By:
 */
public enum ResultEnums {
    
    UNKNOWN_ERROR(-1, "未知错误"),
    SUCCESS(0,"成功"),
    PARAM_ERROR(1, "参数不正确"),
    LOGIN_FAILED(2, "登录失败"),
    USER_NOT_FOUND(3, "用户不存在"),
    PASSWORD_INCORRECT(4, "密码不正确"),
    INVALID_TOKEN(5, "用户授权认证没有通过!"),
    UNAUTHORIZED(6, "没有权限"),
    DELETE_FAILED(8, "删除失败"),
    RESOURCE_NOT_FOUND(10, "资源不存在"),
    RESOURCE_EXIST(11,"资源已存在"),
    INVALID_CODE(12,"无效的验证码"),
    LUCKY_MESSAGE(13,"恭喜被抽中"),
    UNLUCKY_MESSAGE(14,"未被抽中");

    private int code;
    private String msg;

    public int getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }

    ResultEnums(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }
}
