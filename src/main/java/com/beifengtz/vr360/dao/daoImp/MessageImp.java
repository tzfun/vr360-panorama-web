package com.beifengtz.vr360.dao.daoImp;

import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.dao.MessageMapper;
import com.beifengtz.vr360.dao.rowMapper.MessageBoardRowMapper;
import com.beifengtz.vr360.dao.rowMapper.UserMessageRow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * @Author beifengtz
 * @Date Created in 8:50 2018/8/9
 * @Description:
 */
@Repository
public class
MessageImp implements MessageMapper {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public List<Object> selectAllMessageBoard() {
        String sql = "select * from message_board_db where hasallowed = 1";
        return jdbcTemplate.query(sql , new MessageBoardRowMapper());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public int insertMessageBoard(String content, String date) {
        String sql = "insert into message_board_db(message_board_content,message_board_date) values (?,?)";
        return jdbcTemplate.update(sql,new Object[] {content,date});
    }

    @Override
    public ArrayList selectUserMessage(int tempPage, int pageCapacity, String authId) {
        String sql = "select * from user_message_db where user_message_recipient=? order by has_read asc,user_message_time desc limit ?,?";
        return (ArrayList) jdbcTemplate.query(sql,new Object[] {authId,(tempPage-1)*pageCapacity,pageCapacity},new UserMessageRow());
    }

    @Override
    public JSONObject getUserMessageTotal(String authId) {
        String sql = "select count(user_message_id) as num,count(has_read=0 OR NULL) as not_read from user_message_db where user_message_recipient=?";
        return jdbcTemplate.queryForObject(sql, new Object[]{authId}, new RowMapper<JSONObject>() {
            @Override
            public JSONObject mapRow(ResultSet resultSet, int i) throws SQLException {
                JSONObject resJSON = new JSONObject();
                resJSON.put("total",resultSet.getInt("num"));
                resJSON.put("notRead",resultSet.getInt("not_read"));
                return resJSON;
            }
        });
    }

    @Override
    public int updateUserMessageReadStatus(int messageId) {
        String sql = "update user_message_db set has_read=1 where user_message_id=?";
        return jdbcTemplate.update(sql,new Object[] {messageId});
    }
}
