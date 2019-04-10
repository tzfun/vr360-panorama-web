package com.beifengtz.vr360.dao.rowMapper;

import com.beifengtz.vr360.POJO.DO.Admin;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * @Author beifengtz
 * @Date Created in 9:42 2018/5/23
 * @Description:
 */
public class AdminRowMapper implements RowMapper {
    @Override
    public Object mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        if(rowNum>=0){
            Admin admin = new Admin();
            admin.setAdmin_id(resultSet.getInt("admin_id"));
            admin.setAdmin_name(resultSet.getString("admin_name"));
            admin.setAdmin_password(resultSet.getString("admin_password"));
            admin.setAdmin_header_img(resultSet.getString("admin_header_img"));
            admin.setAdmin_realname(resultSet.getString("admin_realname"));
            admin.setAdmin_lastlogin_time(resultSet.getString("admin_lastlogin_time"));
            admin.setAdmin_sex(resultSet.getString("admin_sex"));
            return admin;
        }else{
            return null;
        }
    }
}
