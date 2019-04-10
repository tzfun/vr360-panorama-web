package com.beifengtz.vr360.dao.rowMapper;

import com.alibaba.fastjson.JSONObject;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * @Author beifengtz
 * @Date Created in 9:20 2018/8/19
 * @Description:
 */
public class CityStatisticRow implements RowMapper {
    @Override
    public Object mapRow(ResultSet resultSet, int i) throws SQLException {
        if(i>=0){
            JSONObject res = new JSONObject();
//            res.put("pro",resultSet.getString("pro"));
            res.put("city",resultSet.getString("city"));
//            res.put("operator",resultSet.getString("operator"));
            res.put("num",resultSet.getInt("num"));
            return res;
        }else{
            return null;
        }
    }
}
