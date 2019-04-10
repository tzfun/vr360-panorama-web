package com.beifengtz.vr360.service;

import com.beifengtz.vr360.POJO.VO.ResultVO;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * @Author beifengtz
 * @Date Created in 8:49 2018/8/9
 * @Description:
 */

public interface MessageService {

    ResultVO getMessageBoard(HttpSession session, HttpServletResponse response);

    ResultVO setMessageBoard(String content, String date);

    ResultVO getUserMessageList(int tempPage, int pageCapacity, String authId);

    ResultVO readUserMessage(int messageId);
}
