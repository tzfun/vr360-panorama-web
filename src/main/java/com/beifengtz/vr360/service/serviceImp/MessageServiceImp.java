package com.beifengtz.vr360.service.serviceImp;

import com.alibaba.fastjson.JSONObject;
import com.beifengtz.vr360.POJO.VO.ResultVO;
import com.beifengtz.vr360.dao.MessageMapper;
import com.beifengtz.vr360.service.MessageService;
import com.beifengtz.vr360.util.RegexUtil;
import com.beifengtz.vr360.util.ResultVOUtil;
import com.beifengtz.vr360.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

/**
 * @Author beifengtz
 * @Date Created in 8:49 2018/8/9
 * @Description:
 */
@Service
public class MessageServiceImp implements MessageService {
    @Autowired
    private MessageMapper messageMapper;

    @Override
    public ResultVO getMessageBoard(HttpSession session, HttpServletResponse response) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        String token = TokenUtil.setMessageBoardToken(session);
        JSONObject messageBoard = new JSONObject();
        List<Object> messageBoardList = messageMapper.selectAllMessageBoard();
        if(messageBoardList == null){
            return resultVOUtil.systemError(null);
        }else{
            messageBoard.put("messageList",messageBoardList);
            messageBoard.put("messageNum",messageBoardList.size());
            Cookie cookie =new Cookie("vr360_message_auth",token);
            cookie.setPath("/");
            cookie.setMaxAge(3600);
            response.addCookie(cookie);
            return resultVOUtil.success(messageBoard);
        }
    }

    @Override
    public ResultVO setMessageBoard(String content, String date) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        if(content.equals("") || date.equals("")){
            return resultVOUtil.paramError(null);
        }else if(RegexUtil.filterSqlString(content) && RegexUtil.filterSqlString(date)){
//            if(Math.random() <= 0.4){
//                int resInt = messageMapper.insertMessageBoard(content,date);
//                if(resInt > 0){
//                    return resultVOUtil.luckyMessage(null);
//                }
//            }
//            return resultVOUtil.unluckyMessage(null);
            int resInt = messageMapper.insertMessageBoard(content,date);
                if(resInt > 0){
                    return resultVOUtil.success(null);
                }else{
                    return resultVOUtil.systemError(null);
                }
        }else{
            return resultVOUtil.paramError("字符非法");
        }
    }

    @Override
    public ResultVO getUserMessageList(int tempPage, int pageCapacity, String authId) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        try{
            ArrayList messageList = messageMapper.selectUserMessage(tempPage,pageCapacity,authId);

            JSONObject messageTotal = messageMapper.getUserMessageTotal(authId);

            JSONObject resJson = new JSONObject();
            resJson.put("messages",messageList);
            resJson.put("data",messageTotal);
            if (messageList!=null){
                return resultVOUtil.success(resJson);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultVOUtil.systemError(null);
    }

    @Override
    public ResultVO readUserMessage(int messageId) {
        ResultVOUtil resultVOUtil = new ResultVOUtil();
        try{
            int res = messageMapper.updateUserMessageReadStatus(messageId);
            if(res >0){
                return resultVOUtil.success(messageId);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultVOUtil.systemError(null);
    }
}
