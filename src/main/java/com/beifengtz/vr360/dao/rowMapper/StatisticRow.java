package com.beifengtz.vr360.dao.rowMapper;

import com.alibaba.fastjson.JSONObject;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * @Author beifengtz
 * @Date Created in 0:34 2018/8/19
 * @Description:
 */
public class StatisticRow implements RowMapper {
    @Override
    public Object mapRow(ResultSet resultSet, int i) throws SQLException {
        if(i>=0){
            JSONObject res = new JSONObject();
            res.put("users",resultSet.getInt("users"));
            res.put("works",resultSet.getInt("works"));
            res.put("browsers",resultSet.getInt("browsers"));
            res.put("index_page",resultSet.getInt("index_page"));
            res.put("create_page",resultSet.getInt("create_page"));
            res.put("learning_page",resultSet.getInt("learning_page"));
            res.put("community_page",resultSet.getInt("community_page"));
            res.put("about_page",resultSet.getInt("about_page"));
            res.put("message_page",resultSet.getInt("message_page"));
            res.put("data_page",resultSet.getInt("data_page"));
            res.put("person_page",resultSet.getInt("person_page"));
            return res;
        }else {
            return null;
        }
    }
}
