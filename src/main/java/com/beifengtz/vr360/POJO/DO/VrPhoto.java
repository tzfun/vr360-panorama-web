package com.beifengtz.vr360.POJO.DO;

import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.constants.PhotoConstants;

/**
 * @Author beifengtz
 * @Date Created in 10:09 2018/5/26
 * @Description:
 */
public class VrPhoto {
    private int vrPhotoId;

    private String userAuthId;

    private String vrPhotoType;

    private int vrPhotoStats;

    private JSONObject vrPhotoContent;

    private String vrPhotoDes;

    private int vrPhotoTime;

    private int vrPhotoHeartNum;

    private int vrPhotoViewNum;

    private int vrPhotoRecommend;

    private JSONObject vrPhotoOne;

    private JSONObject vrPhotoTwo;

    private JSONObject vrPhotoThree;

    private JSONObject vrPhotoFour;

    private JSONObject vrPhotoFive;

    private JSONObject vrPhotoSix;

    public JSONObject getVrPhotoObject() {
        JSONObject res = new JSONObject();
        res.put("id",this.vrPhotoId);
        res.put("userAuth",this.userAuthId);
        res.put("des",this.vrPhotoDes);
        res.put("content",this.vrPhotoContent);
        res.put("time",this.vrPhotoTime);
        res.put("heart",this.vrPhotoHeartNum);
        res.put("type",this.vrPhotoType);
        res.put("photoOne",this.vrPhotoOne);
        res.put("stats",this.vrPhotoStats);
        if(this.vrPhotoType.equals(PhotoConstants.SOLA_PHOTO)){
            return res;
        }else if(this.vrPhotoType.equals(PhotoConstants.COMBINATION_PHOTO)){
            res.put("photoTwo",this.vrPhotoTwo);
            res.put("photoThree",this.vrPhotoThree);
            res.put("photoFour",this.vrPhotoFour);
            res.put("photoFive",this.vrPhotoFive);
            res.put("photoSix",this.vrPhotoSix);
            return res;
        }else{
            return null;
        }
    }

    public int getVrPhotoId() {
        return vrPhotoId;
    }

    public void setVrPhotoId(int vrPhotoId) {
        this.vrPhotoId = vrPhotoId;
    }

    public String getVrPhotoType() {
        return vrPhotoType;
    }

    public void setVrPhotoType(String vrPhotoType) {
        this.vrPhotoType = vrPhotoType;
    }

    public JSONObject getVrPhotoContent() {
        return vrPhotoContent;
    }

    public void setVrPhotoContent(JSONObject vrPhotoContent) {
        this.vrPhotoContent = vrPhotoContent;
    }

    public String getVrPhotoDes() {
        return vrPhotoDes;
    }

    public void setVrPhotoDes(String vrPhotoDes) {
        this.vrPhotoDes = vrPhotoDes;
    }

    public int getVrPhotoTime() {
        return vrPhotoTime;
    }

    public void setVrPhotoTime(int vrPhotoTime) {
        this.vrPhotoTime = vrPhotoTime;
    }

    public int getVrPhotoHeartNum() {
        return vrPhotoHeartNum;
    }

    public void setVrPhotoHeartNum(int vrPhotoHeartNum) {
        this.vrPhotoHeartNum = vrPhotoHeartNum;
    }

    public JSONObject getVrPhotoOne() {
        return vrPhotoOne;
    }

    public void setVrPhotoOne(JSONObject vrPhotoOne) {
        this.vrPhotoOne = vrPhotoOne;
    }

    public JSONObject getVrPhotoTwo() {
        return vrPhotoTwo;
    }

    public void setVrPhotoTwo(JSONObject vrPhotoTwo) {
        this.vrPhotoTwo = vrPhotoTwo;
    }

    public JSONObject getVrPhotoThree() {
        return vrPhotoThree;
    }

    public void setVrPhotoThree(JSONObject vrPhotoThree) {
        this.vrPhotoThree = vrPhotoThree;
    }

    public JSONObject getVrPhotoFour() {
        return vrPhotoFour;
    }

    public void setVrPhotoFour(JSONObject vrPhotoFour) {
        this.vrPhotoFour = vrPhotoFour;
    }

    public JSONObject getVrPhotoFive() {
        return vrPhotoFive;
    }

    public void setVrPhotoFive(JSONObject vrPhotoFive) {
        this.vrPhotoFive = vrPhotoFive;
    }

    public JSONObject getVrPhotoSix() {
        return vrPhotoSix;
    }

    public void setVrPhotoSix(JSONObject vrPhotoSix) {
        this.vrPhotoSix = vrPhotoSix;
    }

    public String getUserAuthId() {
        return userAuthId;
    }

    public void setUserAuthId(String userAuthId) {
        this.userAuthId = userAuthId;
    }

    public int getVrPhotoStats() {
        return vrPhotoStats;
    }

    public void setVrPhotoStats(int vrPhotoStats) {
        this.vrPhotoStats = vrPhotoStats;
    }

    public int getVrPhotoRecommend() {
        return vrPhotoRecommend;
    }

    public void setVrPhotoRecommend(int vrPhotoRecommend) {
        this.vrPhotoRecommend = vrPhotoRecommend;
    }

    public int getVrPhotoViewNum() {
        return vrPhotoViewNum;
    }

    public void setVrPhotoViewNum(int vrPhotoViewNum) {
        this.vrPhotoViewNum = vrPhotoViewNum;
    }
}
