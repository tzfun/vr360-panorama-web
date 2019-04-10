package com.beifengtz.vr360.dao.rowMapper;

import com.alibaba.fastjson.JSONObject;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * @Author beifengtz
 * @Date Created in 9:18 2018/8/19
 * @Description:
 */
public class WorksStatisticRow implements RowMapper {
    @Override
    public Object mapRow(ResultSet resultSet, int i) throws SQLException {
        if(i>=0){
            JSONObject res = new JSONObject();
            res.put("des",resultSet.getString("des"));
            res.put("num",resultSet.getInt("num"));
            res.put("id",resultSet.getInt("id"));
            return res;
        }else{
            return null;
        }
    }
}
