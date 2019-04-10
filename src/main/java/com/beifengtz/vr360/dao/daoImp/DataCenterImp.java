package com.beifengtz.vr360.dao.daoImp;

import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.dao.DataCenterMapper;
import com.beifengtz.vr360.dao.rowMapper.CityStatisticRow;
import com.beifengtz.vr360.dao.rowMapper.StatisticRow;
import com.beifengtz.vr360.dao.rowMapper.WorksStatisticRow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;

/**
 * @Author beifengtz
 * @Date Created in 17:49 2018/8/1
 * @Description:
 */
@Repository
public class DataCenterImp implements DataCenterMapper {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public int insertVisitLog(String ip, String nowTimeStamp,
                              String page,
                              String address,
                              String operator,
                              String pro,
                              String city,
                              int pCode) {
        String sql = "insert into visit_log_db(visit_time,visit_page,visit_ip," +
                "visit_address,visit_operator,visit_pro,visit_city,visit_pcode) " +
                "values(?,?,?,?,?,?,?,?)";
        int res = jdbcTemplate.update(sql,new Object[] {nowTimeStamp,page,ip,address,operator,pro,city,pCode});
        return res;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public JSONObject selectStatisticsInfo() {
        String sql = "select (select count(user_id) from user_db) as users ," +
                " (select count(vrphoto_info_id) from vrphoto_info_db) as works ," +
                " (select count(visit_id) from visit_log_db) as browsers," +
                " (SELECT SUM(visit_page = \"/\" OR visit_page=\"/index.html\" OR visit_page=\"/m.html\") FROM visit_log_db)  AS index_page," +
                " (SELECT SUM(visit_page = \"/p/create360.html\" OR visit_page=\"/p/create360bysix.html\") FROM visit_log_db) as create_page ," +
                " (SELECT SUM(visit_page = \"/p/learning.html\") FROM visit_log_db) as learning_page ," +
                " (SELECT SUM(visit_page = \"/p/panorama.html\" OR visit_page = \"/p/community.html\") FROM visit_log_db) as community_page," +
                " (SELECT SUM(visit_page = \"/p/about.html\") FROM visit_log_db) as about_page," +
                " (SELECT SUM(visit_page = \"/p/message-board.html\") FROM visit_log_db) as message_page," +
                " (SELECT SUM(visit_page = \"/p/statistics.html\") FROM visit_log_db) as data_page," +
                " (SELECT SUM(visit_page = \"/p/personpage.html\" OR visit_page = \"/p/people.html\") FROM visit_log_db) as person_page";
        return (JSONObject) jdbcTemplate.queryForObject(sql,new StatisticRow());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public JSONObject selectCityAndWorks() {
        String citySql = "SELECT visit_address AS city,COUNT(visit_address) AS num FROM visit_log_db GROUP BY visit_address ORDER BY num DESC LIMIT 0,10;";
        String worksSql = "SELECT vrphoto_info_des as des,vrphoto_info_id as id,vrphoto_info_viewnum as num FROM vrphoto_info_db \n" +
                " WHERE vrphoto_info_stats = 2 GROUP BY id ORDER BY num DESC LIMIT 0,10 ;";
        ArrayList cityList = (ArrayList) jdbcTemplate.query(citySql,new CityStatisticRow());
        ArrayList worksList = (ArrayList) jdbcTemplate.query(worksSql,new WorksStatisticRow());
        if(cityList!=null && worksList!=null){
            JSONObject res = new JSONObject();
            res.put("city",cityList);
            res.put("works",worksList);
            return res;
        }else{
            return null;
        }

    }

    @Override
    public ArrayList selectDayAndWeek() {
        String sql = "select * from statistics_db ORDER BY order_num";
        ArrayList resArray = (ArrayList) jdbcTemplate.query(sql, new RowMapper<Object>() {
            @Override
            public Object mapRow(ResultSet resultSet, int i) throws SQLException {
                if(i>=0){
                    JSONObject tempJson = new JSONObject();
                    tempJson.put("num",resultSet.getInt("statistics_num"));
                    tempJson.put("name",resultSet.getString("statistics_id"));
                    tempJson.put("update",resultSet.getString("statistics_update"));
                    return tempJson;
                }else{
                    return null;
                }
            }
        });
        return resArray;
    }

    @Override
    public JSONObject selectDay() {
        String sql = "select \n" +
                "(select count(visit_id) from visit_log_db where DAYOFYEAR(now())-1 = DAYOFYEAR(visit_time) and hour(visit_time)>=0 and hour(visit_time)<=1) as day_one,\n" +
                "(select count(visit_id) from visit_log_db where DAYOFYEAR(now())-1 = DAYOFYEAR(visit_time) and hour(visit_time)>=2 and hour(visit_time)<=3) as day_two,\n" +
                "(select count(visit_id) from visit_log_db where DAYOFYEAR(now())-1 = DAYOFYEAR(visit_time) and hour(visit_time)>=4 and hour(visit_time)<=5) as day_three,\n" +
                "(select count(visit_id) from visit_log_db where DAYOFYEAR(now())-1 = DAYOFYEAR(visit_time) and hour(visit_time)>=6 and hour(visit_time)<=7) as day_four,\n" +
                "(select count(visit_id) from visit_log_db where DAYOFYEAR(now())-1 = DAYOFYEAR(visit_time) and hour(visit_time)>=8 and hour(visit_time)<=9) as day_five,\n" +
                "(select count(visit_id) from visit_log_db where DAYOFYEAR(now())-1 = DAYOFYEAR(visit_time) and hour(visit_time)>=10 and hour(visit_time)<=11) as day_six,\n" +
                "(select count(visit_id) from visit_log_db where DAYOFYEAR(now())-1 = DAYOFYEAR(visit_time) and hour(visit_time)>=12 and hour(visit_time)<=13) as day_seven,\n" +
                "(select count(visit_id) from visit_log_db where DAYOFYEAR(now())-1 = DAYOFYEAR(visit_time) and hour(visit_time)>=14 and hour(visit_time)<=15) as day_eight,\n" +
                "(select count(visit_id) from visit_log_db where DAYOFYEAR(now())-1 = DAYOFYEAR(visit_time) and hour(visit_time)>=16 and hour(visit_time)<=17) as day_nine,\n" +
                "(select count(visit_id) from visit_log_db where DAYOFYEAR(now())-1 = DAYOFYEAR(visit_time) and hour(visit_time)>=18 and hour(visit_time)<=19) as day_ten,\n" +
                "(select count(visit_id) from visit_log_db where DAYOFYEAR(now())-1 = DAYOFYEAR(visit_time) and hour(visit_time)>=20 and hour(visit_time)<=21) as day_eleven,\n" +
                "(select count(visit_id) from visit_log_db where DAYOFYEAR(now())-1 = DAYOFYEAR(visit_time) and hour(visit_time)>=22 and hour(visit_time)<=23) as day_twelve;";
        return (JSONObject) jdbcTemplate.queryForObject(sql,new RowMapper<Object>(){

            @Override
            public Object mapRow(ResultSet resultSet, int i) throws SQLException {
                if(i>=0){
                    JSONObject res = new JSONObject();
                    res.put("day_one",resultSet.getInt("day_one"));
                    res.put("day_two",resultSet.getInt("day_two"));
                    res.put("day_three",resultSet.getInt("day_three"));
                    res.put("day_four",resultSet.getInt("day_four"));
                    res.put("day_five",resultSet.getInt("day_five"));
                    res.put("day_six",resultSet.getInt("day_six"));
                    res.put("day_seven",resultSet.getInt("day_seven"));
                    res.put("day_eight",resultSet.getInt("day_eight"));
                    res.put("day_nine",resultSet.getInt("day_nine"));
                    res.put("day_ten",resultSet.getInt("day_ten"));
                    res.put("day_eleven",resultSet.getInt("day_eleven"));
                    res.put("day_twelve",resultSet.getInt("day_twelve"));
                    return res;
                }else{
                    return null;
                }
            }
        });
    }

    @Override
    public JSONObject selectWeek() {
        String sql = "SELECT \n" +
                "(SELECT COUNT(visit_id) FROM visit_log_db WHERE WEEK(visit_time) = WEEK(NOW())-1 AND DAYOFWEEK(visit_time)=1) AS week_seven,\n" +
                "(SELECT COUNT(visit_id) FROM visit_log_db WHERE WEEK(visit_time) = WEEK(NOW())-1 AND DAYOFWEEK(visit_time)=2) AS week_one,\n" +
                "(SELECT COUNT(visit_id) FROM visit_log_db WHERE WEEK(visit_time) = WEEK(NOW())-1 AND DAYOFWEEK(visit_time)=3) AS week_two,\n" +
                "(SELECT COUNT(visit_id) FROM visit_log_db WHERE WEEK(visit_time) = WEEK(NOW())-1 AND DAYOFWEEK(visit_time)=4) AS week_three,\n" +
                "(SELECT COUNT(visit_id) FROM visit_log_db WHERE WEEK(visit_time) = WEEK(NOW())-1 AND DAYOFWEEK(visit_time)=5) AS week_four,\n" +
                "(SELECT COUNT(visit_id) FROM visit_log_db WHERE WEEK(visit_time) = WEEK(NOW())-1 AND DAYOFWEEK(visit_time)=6) AS week_five,\n" +
                "(SELECT COUNT(visit_id) FROM visit_log_db WHERE WEEK(visit_time) = WEEK(NOW())-1 AND DAYOFWEEK(visit_time)=7) AS week_six;";
        return (JSONObject) jdbcTemplate.queryForObject(sql,new RowMapper<Object>(){

            @Override
            public Object mapRow(ResultSet resultSet, int i) throws SQLException {
                if(i>=0){
                    JSONObject res = new JSONObject();
                    res.put("week_one",resultSet.getInt("week_one"));
                    res.put("week_two",resultSet.getInt("week_two"));
                    res.put("week_three",resultSet.getInt("week_three"));
                    res.put("week_four",resultSet.getInt("week_four"));
                    res.put("week_five",resultSet.getInt("week_five"));
                    res.put("week_six",resultSet.getInt("week_six"));
                    res.put("week_seven",resultSet.getInt("week_seven"));
                    return res;
                }else{
                    return null;
                }
            }
        });
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public int updateStatistics(JSONObject statistics) {
        if(statistics!=null){
            try{
                String sql = "update statistics_db set statistics_num=? where statistics_id=?";
                Iterator<String> sIterator = statistics.keySet().iterator();
                while (sIterator.hasNext()){
                    String key = sIterator.next();
                    jdbcTemplate.update(sql,new Object[]{statistics.getInteger(key),key});
                }
                return 1;
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return 0;
    }

    @Override
    public ArrayList selectEveryDay() {
        String sql = "SELECT\n" +
                "\tCOUNT(1) AS countNumber,\n" +
                "\tDATE_FORMAT(visit_time,'%Y-%m-%d') AS dateTime\n" +
                "FROM\n" +
                "\tvisit_log_db\n" +
                "GROUP BY DATE_FORMAT(visit_time,'%Y-%m-%d')";
        return (ArrayList) jdbcTemplate.query(sql, new RowMapper<Object>() {
            @Override
            public Object mapRow(ResultSet resultSet, int i) throws SQLException {
                if(i>=0){
                    JSONObject res = new JSONObject();
                    res.put("num",resultSet.getInt("countNumber"));
                    res.put("time",resultSet.getString("dateTime").replace("-","/"));
                    return res;
                }else{
                    return null;
                }
            }
        });
    }
}
