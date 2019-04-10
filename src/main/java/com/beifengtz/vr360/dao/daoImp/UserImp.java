package com.beifengtz.vr360.dao.daoImp;

import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.POJO.DO.User;
import com.beifengtz.vr360.dao.UserMapper;
import com.beifengtz.vr360.dao.rowMapper.UserFansRowMapper;
import com.beifengtz.vr360.dao.rowMapper.UserRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.beifengtz.vr360.util.MD5Util.GetMD5Code;


/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 10:55 2018/5/12
 * @Modified By:
 */
@Repository
public class UserImp implements UserMapper {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public int insertUser(User user) {
        String autograph = user.getUser_autograph();
        if(this.selectUserIsExists(user.getUser_authentication_id())){
            return -1;
        }else{
            if("3".equals(user.getUser_authentication_type_id())){
                autograph=GetMD5Code(GetMD5Code(autograph));
                if(autograph==null){
                    System.out.println("加密失败");
                    return 0;
                }
            }
            String username=user.getUser_name();
            String sql="INSERT INTO user_db " +
                    "(user_name,user_sex,authentication_type_id,user_authentication_id,user_header_img,user_register_time,user_autograph) " +
                    "VALUES ('"+username+"','"+user.getUser_sex()+"','"+user.getUser_authentication_type_id()+"','"+user.getUser_authentication_id()+"','"+user.getUser_header_img()+"','"+user.getUser_register_time()+"','"+autograph+"')";
            int result;
            try {
                result=jdbcTemplate.update(sql);
            }catch (Exception e){
                e.printStackTrace();
                result=0;
            }
            return result;
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public boolean selectUserIsExists(String authenticationId) {
        String sql = "SELECT COUNT(*) FROM user_db WHERE user_authentication_id='"+authenticationId+"'";
        int count = jdbcTemplate.queryForObject(sql, Integer.class);
        if(count!=0){
            return true;
        }
        return false;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public User getUserInfo(String user_authentication_id) {
        String sql = "SELECT * FROM user_db WHERE user_authentication_id=?;";
        User user = (User) jdbcTemplate.queryForObject(
                sql, new Object[] { user_authentication_id }, new UserRowMapper());
        return user;
    }

    @Override
    public User[] getUsersInfo() {
        String listSql = "select * from user_db";
        List result = jdbcTemplate.query(listSql, new ResultSetExtractor<List>() {
            @Override
            public List extractData(ResultSet rs)
                    throws SQLException, DataAccessException {
                List result = new ArrayList();
                while(rs.next()) {
                    Map row = new HashMap();
                    row.put(rs.getInt("id"), rs.getString("name"));
                    result.add(row);
                }
                return result;
            }});
        return null;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public int insertQuestion(String question, String describe, String userAuthId) {
        String sql = "insert into user_question_db(user_authentication_id,user_question,user_question_describe) values('"+userAuthId+"','"+question+"','"+describe+"')";
        return jdbcTemplate.update(sql);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public int setUserInfo(String userAuthId, String changeUsername, String changeSex, String changeDescribe, String newPassword) {
        String sql = "update user_db set user_name='"+changeUsername+"',user_sex='"+changeSex+"',user_des='"+changeDescribe+"',user_autograph='"+newPassword+"'" +
                " where user_authentication_id='"+userAuthId+"'";
        return jdbcTemplate.update(sql);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public int setUserInfo(String userAuthId, String changeUsername, String changeSex, String changeDescribe) {
        String sql = "update user_db set user_name='"+changeUsername+"',user_sex='"+changeSex+"',user_des='"+changeDescribe+"'" +
                " where user_authentication_id='"+userAuthId+"'";
        return jdbcTemplate.update(sql);
    }

    @Override
    public JSONObject getRelationshipAndWorks(String userAuthId) {
        String sql = "SELECT (SELECT COUNT(relationship_id) FROM relationship_db WHERE fan_auth_id = ?) AS follow,\n" +
                "(SELECT COUNT(relationship_id) FROM relationship_db WHERE follow_auth_id = ?) AS fans,\n" +
                "(SELECT COUNT(vrphoto_info_id) FROM vrphoto_info_db WHERE user_authentication_id = ? AND vrphoto_info_stats=2) AS works";
        return jdbcTemplate.queryForObject(sql, new Object[]{userAuthId, userAuthId, userAuthId}, new RowMapper<JSONObject>() {
            @Override
            public JSONObject mapRow(ResultSet resultSet, int i) throws SQLException {
                JSONObject res = new JSONObject();
                res.put("follow",resultSet.getInt("follow"));
                res.put("fans",resultSet.getInt("fans"));
                res.put("works",resultSet.getInt("works"));
                return res;
            }
        });
    }

    @Override
    public int insertRelationship(String fanAuthId, String followAuthId) {
        String sql ="insert into relationship_db(fan_auth_id,follow_auth_id) values(?,?)";
        return jdbcTemplate.update(sql,new Object[] {fanAuthId,followAuthId});
    }

    @Override
    public boolean selectRelationship(String fanAuthId, String followAuthId) {
        String sql = "select * from relationship_db where fan_auth_id=? and follow_auth_id=?";
        try{
            return jdbcTemplate.queryForObject(sql, new Object[]{fanAuthId, followAuthId}, new RowMapper<Boolean>() {
                @Override
                public Boolean mapRow(ResultSet resultSet, int i) throws SQLException {
                    if(i>=0){
                        return true;
                    }else{
                        return false;
                    }
                }
            });
        }catch (Exception e){
            return false;
        }
    }

    @Override
    public int delRelationship(String fanAuthId, String followAuthId) {
        String sql = "delete from relationship_db where fan_auth_id=? and follow_auth_id = ?";
        return jdbcTemplate.update(sql,new Object[]{fanAuthId, followAuthId});
    }

    @Override
    public ArrayList selectUserFans(String authId,int tempPage, int pageCapacity) {
        String sql = "SELECT users.user_name,users.user_sex,users.user_authentication_id,users.user_header_img\n" +
                "FROM user_db users \n" +
                "JOIN relationship_db relationship \n" +
                "ON relationship.follow_auth_id= ?  AND " +
                "relationship.fan_auth_id = users.user_authentication_id\n" +
                "LIMIT ?,?;";
        return (ArrayList) jdbcTemplate.query(sql,new Object[] {authId,(tempPage-1)*pageCapacity,pageCapacity},new UserFansRowMapper());
    }

    @Override
    public ArrayList selectUserFollows(String authId,int tempPage, int pageCapacity) {
        String sql = "SELECT users.user_name,users.user_sex,users.user_authentication_id,users.user_header_img\n" +
                "FROM user_db users \n" +
                "JOIN relationship_db relationship \n" +
                "ON relationship.fan_auth_id= ? \n" +
                "AND relationship.follow_auth_id = users.user_authentication_id \n" +
                "LIMIT ?,?;";
        return (ArrayList) jdbcTemplate.query(sql,new Object[] {authId,(tempPage-1)*pageCapacity,pageCapacity},new UserFansRowMapper());
    }

    @Override
    public ArrayList<User> getUsersInfo(int tempPage, int pageCapacity) {
        String listSql = "select * from user_db limit ?,?";
        ArrayList<User> result = (ArrayList<User>)jdbcTemplate.query(listSql, new Object[]{(tempPage - 1) * pageCapacity, pageCapacity}, new RowMapper<User>() {
            @Override
            public User mapRow(ResultSet rs, int i) throws SQLException {
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
            }
        });
        return result;
    }

    @Override
    public int getAllUsersCount() {
        String sql ="select count(user_id) as num from user_db";
        return jdbcTemplate.queryForObject(sql, new RowMapper<Integer>() {
            @Override
            public Integer mapRow(ResultSet resultSet, int i) throws SQLException {
                return resultSet.getInt("num");
            }
        });
    }

    @Override
    public int delUserByAuthId(String uid) {
        String sql = "delete from user_db where user_authentication_id = ?";
        return jdbcTemplate.update(sql,uid);
    }
}
