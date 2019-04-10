package com.beifengtz.vr360.dao.rowMapper;

import com.beifengtz.vr360.POJO.DO.User;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 11:15 2018/5/15
 * @Modified By:
 */
public class UserRowMapper implements RowMapper {

    public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
        if(rowNum>=0){
            User user = new User();
            user.setUser_id(rs.getInt("user_id"));
            user.setUser_name(rs.getString("user_name"));
            user.setUser_sex(rs.getString("user_sex"));
            user.setAuthentication_type_id(String.valueOf(rs.getInt("authentication_type_id")));
            user.setUser_authentication_id(rs.getString("user_authentication_id"));
            user.setUser_header_img(rs.getString("user_header_img"));
            user.setUser_register_time(String.valueOf(rs.getDate("user_register_time")));
            user.setUser_autograph(rs.getString("user_autograph"));
            user.setUser_fans(rs.getString("user_fans"));
            user.setUser_follow(rs.getString("user_follow"));
            user.setUser_des(rs.getString("user_des"));
            user.setUser_works(rs.getString("user_works"));
            return user;
        }else{
            return null;
        }
    }
}
