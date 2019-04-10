package com.beifengtz.vr360.dao.daoImp;

import com.beifengtz.vr360.POJO.DO.Admin;
import com.beifengtz.vr360.dao.AdminMapper;
import com.beifengtz.vr360.dao.rowMapper.AdminRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * @Author beifengtz
 * @Date Created in 9:15 2018/5/23
 * @Description:
 */
@Repository
public class AdminImp implements AdminMapper {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public Admin getAdminInfo(String adminId) {
        String sql = "SELECT * FROM admin_db WHERE admin_id=?;";
        try{
            return (Admin) jdbcTemplate.queryForObject(
                    sql, new Object[] { adminId }, new AdminRowMapper());
        }catch (EmptyResultDataAccessException e){
            e.printStackTrace();
        }
        return null;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public boolean selectAdminIsExist(String adminId) {
        String sql = "SELECT COUNT(*) FROM admin_db WHERE admin_id='"+adminId+"'";
        int count = jdbcTemplate.queryForObject(sql, Integer.class);
        if(count!=0){
            return true;
        }
        return false;
    }
}
