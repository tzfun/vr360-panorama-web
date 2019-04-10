package com.beifengtz.vr360.dao.rowMapper;

import com.alibaba.fastjson.JSONObject;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * @Author beifengtz
 * @Date Created in 8:46 2018/8/30
 * @Description:
 */
public class UserMessageRow implements RowMapper {
    @Override
    public Object mapRow(ResultSet resultSet, int i) throws SQLException {
        if(i>=0){
            JSONObject res = new JSONObject();
            res.put("id",resultSet.getInt("user_message_id"));
            res.put("author",resultSet.getString("user_message_author"));
            res.put("time",resultSet.getString("user_message_time"));
            res.put("title",resultSet.getString("user_message_title"));
            res.put("content",resultSet.getString("user_message_content"));
            res.put("read",resultSet.getInt("has_read"));
            res.put("link",resultSet.getString("user_message_link"));
            res.put("img",resultSet.getString("user_message_img"));
            return res;
        }
        return null;
    }
}
