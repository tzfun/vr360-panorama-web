package com.beifengtz.vr360.dao.rowMapper;

import com.alibaba.fastjson.JSONObject;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * @Author beifengtz
 * @Date Created in 21:08 2018/8/31
 * @Description:
 */
public class UserFansRowMapper implements RowMapper {
    @Override
    public Object mapRow(ResultSet resultSet, int i) throws SQLException {
        if(i>=0){
            JSONObject res = new JSONObject();
            res.put("name",resultSet.getString("user_name"));
            res.put("sex",resultSet.getString("user_sex"));
            res.put("authId",resultSet.getString("user_authentication_id"));
            res.put("header",resultSet.getString("user_header_img"));
            return res;
        }else{
            return null;
        }
    }
}
