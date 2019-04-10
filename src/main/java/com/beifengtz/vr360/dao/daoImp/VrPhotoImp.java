package com.beifengtz.vr360.dao.daoImp;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.POJO.DO.VrPhoto;
import com.beifengtz.vr360.constants.CommonConstants;
import com.beifengtz.vr360.constants.PhotoConstants;
import com.beifengtz.vr360.dao.VrPhotoMapper;
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

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 10:35 2018/5/21
 * @Modified By:
 */
@Repository
public class VrPhotoImp implements VrPhotoMapper{

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public int insertVrPhoto(String authenticationId, String vrphotoKey, String vrphotoType) {
        String insertSql = "INSERT INTO vrphoto_db(user_authentication_id,vrphoto_key,vrphoto_type) VALUES ('"+authenticationId+"','"+vrphotoKey+"','"+vrphotoType+"')";
        String selectSql = "SELECT vrphoto_id FROM vrphoto_db WHERE vrphoto_key='"+vrphotoKey+"'";
        int photo_id = -1;
        try{
            int result = jdbcTemplate.update(insertSql);
            if(result>0){
                photo_id = jdbcTemplate.queryForObject(selectSql, Integer.class);
                if(photo_id<=0){
                    photo_id = -1;
                }
            }
        }catch (Exception e){
            e.printStackTrace();
            photo_id = -1;
        }
        return photo_id;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public int insertVrInfoBySola(String userAuthId,String vrPhotoType, String VrPhotoInfo, int solaPhotoId ,String vrphotoDes) {
        int resultInt = -1;
        int nowTime = (int) (System.currentTimeMillis() / 1000);
        try{
            String sql = "INSERT INTO vrphoto_info_db(user_authentication_id,vrphoto_info_type,vrphoto_info_content,vrphoto_id_one,vrphoto_info_des,vrphoto_info_time) VALUES " +
                    "('"+userAuthId+"','"+vrPhotoType+"','"+VrPhotoInfo+"','"+solaPhotoId+"','"+vrphotoDes+"','"+nowTime+"')";
            String selectSql = "select vrphoto_info_id from vrphoto_info_db where user_authentication_id='"+userAuthId+"' and vrphoto_info_time='"+nowTime+"'";
            resultInt = jdbcTemplate.update(sql);
            if(resultInt>0){
                return jdbcTemplate.queryForObject(selectSql, Integer.class);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return -1;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public int insertVrInfoByComb(String userAuthId,String vrPhotoType, String VrPhotoInfo, int solaPhotoIdOne, int solaPhotoIdTwo, int solaPhotoIdThree, int solaPhotoIdFour, int solaPhotoIdFive, int solaPhotoIdSix,String vrphotoDes) {
        int resultInt = -1;
        int nowTime = (int) (System.currentTimeMillis() / 1000);
        try{
            String sql = "INSERT INTO " +
                    "vrphoto_info_db(user_authentication_id,vrphoto_info_type,vrphoto_info_content,vrphoto_id_one,vrphoto_id_two,vrphoto_id_three,vrphoto_id_four,vrphoto_id_five,vrphoto_id_six,vrphoto_info_des,vrphoto_info_time) VALUES " +
                    "('"+userAuthId+"','"+vrPhotoType+"','"+VrPhotoInfo+"','"+solaPhotoIdOne+"','"+solaPhotoIdTwo+"','"+solaPhotoIdThree+"','"+solaPhotoIdFour+"','"+solaPhotoIdFive+"','"+solaPhotoIdSix+"','"+vrphotoDes+"','"+nowTime+"' )";
            String selectSql = "select vrphoto_info_id from vrphoto_info_db where user_authentication_id='"+userAuthId+"' and vrphoto_info_time='"+nowTime+"'";
            resultInt = jdbcTemplate.update(sql);
            if(resultInt>0){
                return jdbcTemplate.queryForObject(selectSql, Integer.class);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return -1;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public JSONArray selectVrListByUserAuthId(String userAuthId,int stats) {
        String sql = "SELECT vrphoto_info_db.vrphoto_info_id,vrphoto_info_db.vrphoto_info_des,vrphoto_info_db.vrphoto_info_stats," +
                "vrphoto_info_db.vrphoto_info_time,vrphoto_info_db.vrphoto_info_heartnum,vrphoto_info_db.vrphoto_info_viewnum,vrphoto_info_db.vrphoto_info_recommend,vrphoto_db.vrphoto_key " +
                "from vrphoto_info_db join vrphoto_db on " +
                "vrphoto_info_db.vrphoto_id_one=vrphoto_db.vrphoto_id and vrphoto_info_db.user_authentication_id='"+userAuthId+"' and vrphoto_info_db.vrphoto_info_stats="+stats+";";
        JSONArray resArray = jdbcTemplate.query(sql, new ResultSetExtractor<JSONArray>() {
            @Override
            public JSONArray extractData(ResultSet rs)
                    throws SQLException, DataAccessException {
                JSONArray resArray = new JSONArray();
                while(rs.next()) {
                    JSONObject tempObject = new JSONObject();
                    tempObject.put("id",rs.getInt("vrphoto_info_id"));
                    tempObject.put("description",rs.getString("vrphoto_info_des"));
                    tempObject.put("stats",rs.getInt("vrphoto_info_stats"));
                    tempObject.put("createTime",rs.getInt("vrphoto_info_time"));
                    tempObject.put("isRecommend",rs.getInt("vrphoto_info_recommend"));
                    tempObject.put("viewNum",rs.getInt("vrphoto_info_viewnum"));
                    tempObject.put("heartNum",rs.getInt("vrphoto_info_heartnum"));
                    String url = CommonConstants.OSS_PHOTOURL.concat(rs.getString("vrphoto_key").concat(CommonConstants.OSS_THUMBNAIL));
                    tempObject.put("url",url);
                    resArray.add(tempObject);
                }
                return resArray;
            }});
        return resArray;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public JSONObject getVrInfoById(int vrPhotoId) {
        String addViewNumSql = "update vrphoto_info_db set vrphoto_info_viewnum=vrphoto_info_viewnum+1 where vrphoto_info_id="+vrPhotoId;
        String sql = "SELECT vrphoto_info_db.vrphoto_info_id,vrphoto_info_db.vrphoto_info_type," +
                "vrphoto_info_db.vrphoto_info_content,vrphoto_info_db.vrphoto_info_stats," +
                "vrphoto_info_db.vrphoto_info_des,vrphoto_info_db.vrphoto_info_time," +
                "vrphoto_info_db.vrphoto_info_heartnum,vrphoto_info_db.user_authentication_id,\n" +
                "                    vrphoto_db.vrphoto_key,vrphoto_db.vrphoto_type \n" +
                "                    FROM vrphoto_info_db JOIN vrphoto_db \n" +
                "                    ON vrphoto_info_id = " + vrPhotoId+
                "                    AND (vrphoto_info_db.vrphoto_id_one = vrphoto_db.vrphoto_id\n" +
                "                    OR vrphoto_info_db.vrphoto_id_two = vrphoto_db.vrphoto_id\n" +
                "                    OR vrphoto_info_db.vrphoto_id_three = vrphoto_db.vrphoto_id\n" +
                "                    OR vrphoto_info_db.vrphoto_id_four = vrphoto_db.vrphoto_id\n" +
                "                    OR vrphoto_info_db.vrphoto_id_five = vrphoto_db.vrphoto_id\n" +
                "                    OR vrphoto_info_db.vrphoto_id_six = vrphoto_db.vrphoto_id)";
        jdbcTemplate.update(addViewNumSql);
        JSONObject resObject = jdbcTemplate.query(sql, new ResultSetExtractor<JSONObject>() {
            @Override
            public JSONObject extractData(ResultSet rs)
                    throws SQLException, DataAccessException {
                JSONObject resObject = new JSONObject();
                VrPhoto vrPhoto = new VrPhoto();
                int photoNum=0;
                while (rs.next()) {
                    vrPhoto.setUserAuthId(rs.getString("user_authentication_id"));
                    vrPhoto.setVrPhotoStats(rs.getInt("vrphoto_info_stats"));
                    vrPhoto.setVrPhotoId(rs.getInt("vrphoto_info_id"));
                    vrPhoto.setVrPhotoDes(rs.getString("vrphoto_info_des"));
                    vrPhoto.setVrPhotoContent(JSONObject.parseObject(rs.getString("vrphoto_info_content")));
                    vrPhoto.setVrPhotoHeartNum(rs.getInt("vrphoto_info_heartnum"));
                    vrPhoto.setVrPhotoTime(rs.getInt("vrphoto_info_time"));
                    String photoType = rs.getString("vrphoto_info_type");
                    vrPhoto.setVrPhotoType(photoType);
                    if(photoType.equals(PhotoConstants.COMBINATION_PHOTO)){
                        photoNum++;
                        JSONObject tempObject = new JSONObject();
                        tempObject.put("type",rs.getString("vrphoto_type"));
                        tempObject.put("key",rs.getString("vrphoto_key"));
                        switch (photoNum) {
                            case 1:
                                vrPhoto.setVrPhotoOne(tempObject);
                                break;
                            case 2:
                                vrPhoto.setVrPhotoTwo(tempObject);
                                break;
                            case 3:
                                vrPhoto.setVrPhotoThree(tempObject);
                                break;
                            case 4:
                                vrPhoto.setVrPhotoFour(tempObject);
                                break;
                            case 5:
                                vrPhoto.setVrPhotoFive(tempObject);
                                break;
                            case 6:
                                vrPhoto.setVrPhotoSix(tempObject);
                                break;
                        }
                    }else {
                        JSONObject tempObject = new JSONObject();
                        tempObject.put("type",rs.getString("vrphoto_type"));
                        tempObject.put("key",rs.getString("vrphoto_key"));
                        vrPhoto.setVrPhotoOne(tempObject);
                    }
                    resObject.put("res",vrPhoto.getVrPhotoObject());
                }
                return resObject;
            }
        });
        return resObject;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public JSONArray selectVrPhoto(int tempPage, int pageCapacity, String type) {
        String selectSql="";
        String countSql="";
        switch (type){
            case "last":
                selectSql = "SELECT vrphoto_info_db.vrphoto_info_id,vrphoto_info_db.vrphoto_info_des,vrphoto_info_db.vrphoto_info_stats," +
                        "vrphoto_info_db.vrphoto_info_time,vrphoto_info_db.vrphoto_info_heartnum,vrphoto_db.vrphoto_key,user_db.user_name " +
                        "from vrphoto_info_db join vrphoto_db join user_db on " +
                        "vrphoto_info_db.vrphoto_id_one=vrphoto_db.vrphoto_id and vrphoto_info_db.vrphoto_info_stats=2 AND vrphoto_info_db.user_authentication_id=user_db.user_authentication_id " +
                        "order by vrphoto_info_db.vrphoto_info_time desc " +
                        "limit "+(tempPage-1)*pageCapacity+","+pageCapacity;
                countSql = "select count(*) from vrphoto_info_db join vrphoto_db join user_db on " +
                        "vrphoto_info_db.vrphoto_id_one=vrphoto_db.vrphoto_id and vrphoto_info_db.vrphoto_info_stats=2 AND vrphoto_info_db.user_authentication_id=user_db.user_authentication_id ";
                break;
            case "hot":
                selectSql = "SELECT vrphoto_info_db.vrphoto_info_id,vrphoto_info_db.vrphoto_info_des,vrphoto_info_db.vrphoto_info_stats," +
                        "vrphoto_info_db.vrphoto_info_time,vrphoto_info_db.vrphoto_info_heartnum,vrphoto_db.vrphoto_key,user_db.user_name " +
                        "from vrphoto_info_db join vrphoto_db join user_db on " +
                        "vrphoto_info_db.vrphoto_id_one=vrphoto_db.vrphoto_id and vrphoto_info_db.vrphoto_info_stats=2 AND vrphoto_info_db.user_authentication_id=user_db.user_authentication_id " +
                        "order by vrphoto_info_db.vrphoto_info_heartnum desc,vrphoto_info_db.vrphoto_info_viewnum desc " +
                        "limit "+(tempPage-1)*pageCapacity+","+pageCapacity;
                countSql = "select count(*) from vrphoto_info_db join vrphoto_db join user_db on " +
                        "vrphoto_info_db.vrphoto_id_one=vrphoto_db.vrphoto_id and vrphoto_info_db.vrphoto_info_stats=2 AND vrphoto_info_db.user_authentication_id=user_db.user_authentication_id ";
                break;
            case "recommend":
                selectSql = "SELECT vrphoto_info_db.vrphoto_info_id,vrphoto_info_db.vrphoto_info_des,vrphoto_info_db.vrphoto_info_stats," +
                        "vrphoto_info_db.vrphoto_info_time,vrphoto_info_db.vrphoto_info_heartnum,vrphoto_db.vrphoto_key,user_db.user_name " +
                        "from vrphoto_info_db join vrphoto_db join user_db on " +
                        "vrphoto_info_db.vrphoto_id_one=vrphoto_db.vrphoto_id and vrphoto_info_db.vrphoto_info_stats=2 and " +
                        " vrphoto_info_db.vrphoto_info_recommend=1 AND vrphoto_info_db.user_authentication_id=user_db.user_authentication_id " +
                        "order by vrphoto_info_db.vrphoto_info_heartnum,vrphoto_info_db.vrphoto_info_viewnum desc " +
                        "limit "+(tempPage-1)*pageCapacity+","+pageCapacity;
                countSql = "select count(*) from vrphoto_info_db join vrphoto_db join user_db on " +
                        "vrphoto_info_db.vrphoto_id_one=vrphoto_db.vrphoto_id and vrphoto_info_db.vrphoto_info_stats=2 and " +
                        " vrphoto_info_db.vrphoto_info_recommend=1 AND vrphoto_info_db.user_authentication_id=user_db.user_authentication_id ";
                break;
        }
        String finalCountSql = countSql;
        JSONArray resArray = jdbcTemplate.query(selectSql, new ResultSetExtractor<JSONArray>() {
            @Override
            public JSONArray extractData(ResultSet rs)
                    throws SQLException, DataAccessException {

                int totalNum = jdbcTemplate.queryForObject(finalCountSql, Integer.class);
                JSONArray resArray = new JSONArray();
                while(rs.next()) {
                    JSONObject tempObject = new JSONObject();
                    tempObject.put("total",totalNum);
                    tempObject.put("id",rs.getInt("vrphoto_info_id"));
                    tempObject.put("description",rs.getString("vrphoto_info_des"));
                    tempObject.put("stats",rs.getInt("vrphoto_info_stats"));
                    tempObject.put("createTime",rs.getInt("vrphoto_info_time"));
                    tempObject.put("heartNum",rs.getString("vrphoto_info_heartnum"));
                    tempObject.put("username",rs.getString("user_name"));
                    String url = "https://vr360-beifengtz.oss-cn-beijing.aliyuncs.com/".concat(rs.getString("vrphoto_key").concat("?x-oss-process=style/vr-thumbnail"));
                    tempObject.put("url",url);
                    resArray.add(tempObject);
                }
                return resArray;
            }});
        return resArray;
    }

    @Override
    public JSONObject selectVrPhotoByAdmin(int tempPage, int pageCapacity) {
        JSONObject resObject = new JSONObject();
        String selectSql = "SELECT vrphoto_info_db.vrphoto_info_id,vrphoto_info_db.vrphoto_info_stats," +
                "vrphoto_info_db.vrphoto_info_time,vrphoto_info_db.vrphoto_info_des," +
                "vrphoto_info_db.vrphoto_info_type,user_db.user_id,user_db.user_name," +
                "vrphoto_info_db.vrphoto_info_heartnum,vrphoto_info_db.vrphoto_info_viewnum,vrphoto_info_db.vrphoto_info_recommend," +
                "user_db.user_sex,user_db.user_header_img,user_db.authentication_type_id" +
                " from vrphoto_info_db join vrphoto_db join user_db on " +
                "vrphoto_info_db.vrphoto_id_one=vrphoto_db.vrphoto_id " +
                "AND vrphoto_info_db.user_authentication_id=user_db.user_authentication_id order by vrphoto_info_db.vrphoto_info_stats," +
                "vrphoto_info_db.vrphoto_info_recommend desc ,vrphoto_info_db.vrphoto_info_time desc " +
                "limit "+(tempPage-1)*pageCapacity+","+pageCapacity;
        String countSql = "select count(vrphoto_info_id) from vrphoto_info_db where vrphoto_info_stats=2";
        int totalNum = jdbcTemplate.queryForObject(countSql, Integer.class);
        resObject.put("total",totalNum);
        JSONArray resArray = jdbcTemplate.query(selectSql, new ResultSetExtractor<JSONArray>() {
            @Override
            public JSONArray extractData(ResultSet rs)
                    throws SQLException, DataAccessException {
                JSONArray resArray = new JSONArray();
                while(rs.next()) {
                    JSONObject tempObject = new JSONObject();
                    JSONObject userObject = new JSONObject();
                    userObject.put("id",rs.getString("user_id"));
                    userObject.put("username",rs.getString("user_name"));
                    userObject.put("sex",rs.getString("user_sex"));
                    userObject.put("authenticationType",rs.getString("authentication_type_id"));
                    userObject.put("headerImg",rs.getString("user_header_img"));
                    tempObject.put("user",userObject);
                    tempObject.put("id",rs.getInt("vrphoto_info_id"));
                    tempObject.put("description",rs.getString("vrphoto_info_des"));
                    tempObject.put("stats",rs.getInt("vrphoto_info_stats"));
                    tempObject.put("createTime",rs.getInt("vrphoto_info_time"));
                    tempObject.put("photoType",rs.getString("vrphoto_info_type"));
                    tempObject.put("heartNum",rs.getString("vrphoto_info_heartnum"));
                    tempObject.put("viewNum",rs.getString("vrphoto_info_viewnum"));
                    tempObject.put("recommend",rs.getString("vrphoto_info_recommend"));
                    resArray.add(tempObject);
                }
                return resArray;
            }});
        resObject.put("data",resArray);
        return resObject;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public boolean updateVrPhotoStats(int vrPhotoId, int stats) {
        String sql = "update vrphoto_info_db set vrphoto_info_stats="+stats+" where vrphoto_info_id="+vrPhotoId;
        int res = jdbcTemplate.update(sql);
        if(res>0){
            return true;
        }
        return false;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public void updateHeartNum() {
        String sql = "update vrphoto_info_db set vrphoto_info_heartnum = vrphoto_info_heartnum+1";
        jdbcTemplate.update(sql);
    }

    @Override
    public int insertUserMessage(String author, String timestamp, String messageTitle, String messageContent, String authId, String userMessageLink, String messageImg) {
        String sql = "insert into user_message_db(user_message_author,user_message_time,user_message_title,user_message_content,user_message_recipient,user_message_link,user_message_img) " +
                "values (?,?,?,?,?,?,?)";
        return jdbcTemplate.update(sql,new Object[] {author,timestamp,messageTitle,messageContent,authId,userMessageLink,messageImg});
    }

    @Override
    public ArrayList selectPeopleVrPhoto(String uid, int tempPage, int pageCapacity, int stats) {
        String sql = "SELECT vrphoto_info_db.vrphoto_info_id,vrphoto_info_db.vrphoto_info_des,vrphoto_info_db.vrphoto_info_stats," +
                "vrphoto_info_db.vrphoto_info_time,vrphoto_info_db.vrphoto_info_heartnum,vrphoto_info_db.vrphoto_info_viewnum,vrphoto_info_db.vrphoto_info_recommend,vrphoto_db.vrphoto_key " +
                "from vrphoto_info_db join vrphoto_db on " +
                "vrphoto_info_db.vrphoto_id_one=vrphoto_db.vrphoto_id and vrphoto_info_db.user_authentication_id=? and vrphoto_info_db.vrphoto_info_stats=? " +
                "limit ?,?;";
        ArrayList resArray = jdbcTemplate.query(sql,new Object[] {uid,stats,(tempPage-1)*pageCapacity,pageCapacity}, new ResultSetExtractor<ArrayList>() {
            @Override
            public ArrayList extractData(ResultSet rs)
                    throws SQLException, DataAccessException {
                ArrayList resArray = new ArrayList();
                while(rs.next()) {
                    JSONObject tempObject = new JSONObject();
                    tempObject.put("id",rs.getInt("vrphoto_info_id"));
                    tempObject.put("description",rs.getString("vrphoto_info_des"));
                    tempObject.put("stats",rs.getInt("vrphoto_info_stats"));
                    tempObject.put("createTime",rs.getInt("vrphoto_info_time"));
                    tempObject.put("isRecommend",rs.getInt("vrphoto_info_recommend"));
                    tempObject.put("viewNum",rs.getInt("vrphoto_info_viewnum"));
                    tempObject.put("heartNum",rs.getInt("vrphoto_info_heartnum"));
                    String url = CommonConstants.OSS_PHOTOURL.concat(rs.getString("vrphoto_key").concat(CommonConstants.OSS_THUMBNAIL));
                    tempObject.put("url",url);
                    resArray.add(tempObject);
                }
                return resArray;
            }});
        return resArray;
    }

    @Override
    public int getTotalPeopleVrPhoto(String uid, int stats) {
        String sql ="select count(vrphoto_info_id) as total from vrphoto_info_db where user_authentication_id=? and vrphoto_info_stats=?";
        return jdbcTemplate.queryForObject(sql, new Object[]{uid,stats}, new RowMapper<Integer>() {
            @Override
            public Integer mapRow(ResultSet resultSet, int i) throws SQLException {
                return resultSet.getInt("total");
            }
        });
    }

    @Override
    public int delVrphoto(int photoId) {
        String sql = "delete from vrphoto_info_db where vrphoto_info_id="+photoId;
        return  jdbcTemplate.update(sql);
    }

    @Override
    public int setRecommend(int photoId, int value) {
        String sql = "update vrphoto_info_db set vrphoto_info_recommend="+value+" where vrphoto_info_id="+photoId;
        return jdbcTemplate.update(sql);

    }
}
