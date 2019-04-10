package com.beifengtz.vr360.POJO.DO;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 18:36 2018/5/12
 * @Modified By:
 */
public class User {

    private int user_id;//用户表id （对应数据库）

    private String user_name;//用户名

    private String user_sex;//用户性别

    private String authentication_type_id;//（int）认证方式 qq、微信等

    private String user_authentication_id;//认证号 手机号、QQ号等

    private String user_header_img;//头像

    private String user_register_time;//注册时间

    private String user_autograph;//签名或密码

    private String user_fans;//粉丝数

    private String user_follow;//关注数

    private String user_works;//作品数

    private String user_des;//个人介绍

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getUser_sex() {
        return user_sex;
    }

    public void setUser_sex(String user_sex) {
        this.user_sex = user_sex;
    }

    public String getUser_authentication_type_id() {
        return authentication_type_id;
    }

    public void setAuthentication_type_id(String user_authentication_type_id) {
        this.authentication_type_id = user_authentication_type_id;
    }

    public String getUser_authentication_id() {
        return user_authentication_id;
    }

    public void setUser_authentication_id(String user_authentication_id) {
        this.user_authentication_id = user_authentication_id;
    }

    public String getUser_header_img() {
        return user_header_img;
    }

    public void setUser_header_img(String user_header_img) {
        this.user_header_img = user_header_img;
    }

    public String getUser_register_time() {
        return user_register_time;
    }

    public void setUser_register_time(String user_register_time) {
        this.user_register_time = user_register_time;
    }

    public String getUser_autograph() {
        return user_autograph;
    }

    public void setUser_autograph(String user_autograph) {
        this.user_autograph = user_autograph;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public String getAuthentication_type_id() {
        return authentication_type_id;
    }

    public String getUser_fans() {
        return user_fans;
    }

    public void setUser_fans(String user_fans) {
        this.user_fans = user_fans;
    }

    public String getUser_follow() {
        return user_follow;
    }

    public void setUser_follow(String user_follow) {
        this.user_follow = user_follow;
    }

    public String getUser_works() {
        return user_works;
    }

    public void setUser_works(String user_works) {
        this.user_works = user_works;
    }

    public String getUser_des() {
        return user_des;
    }

    public void setUser_des(String user_des) {
        this.user_des = user_des;
    }
}
