package com.beifengtz.vr360.dao.rowMapper;

import com.alibaba.fastjson.JSONObject;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * @Author beifengtz
 * @Date Created in 9:07 2018/8/9
 * @Description:
 */
public class MessageBoardRowMapper implements RowMapper {
    @Override
    public Object mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        if(rowNum>=0){
                JSONObject tempJson = new JSONObject();
                tempJson.put("id",resultSet.getInt("message_board_id"));
                tempJson.put("content",resultSet.getString("message_board_content"));
                tempJson.put("date",resultSet.getString("message_board_date"));
            return tempJson;
        }else{
            return null;
        }
    }
}
