package com.beifengtz.vr360.dao;

import com.alibaba.fastjson.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author beifengtz
 * @Date Created in 8:50 2018/8/9
 * @Description:
 */
public interface MessageMapper {

    List<Object> selectAllMessageBoard();

    int insertMessageBoard(String content, String date);

    ArrayList selectUserMessage(int tempPage, int pageCapacity, String authId);

    JSONObject getUserMessageTotal(String authId);

    int updateUserMessageReadStatus(int messageId);
}
