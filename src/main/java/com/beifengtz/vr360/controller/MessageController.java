package com.beifengtz.vr360.controller;

import com.beifengtz.vr360.POJO.VO.ResultVO;
import com.beifengtz.vr360.constants.CommonConstants;
import com.beifengtz.vr360.service.MessageService;
import com.beifengtz.vr360.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * @Author beifengtz
 * @Date Created in 8:48 2018/8/9
 * @Description:
 */
@Controller
public class MessageController {

    @Autowired
    private MessageService messageService;

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:45
     * @Description: 获取留言板信息接口，公共
     * @param   session 会话（HttpSession）
     * @param   response 响应（HttpServletResponse）
     * @return
     */
    @GetMapping(CommonConstants.PUB_PREFIX+"/getMessageBoard")
    @ResponseBody
    public ResultVO getMessageBoard(HttpSession session, HttpServletResponse response){
        return messageService.getMessageBoard(session,response);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:45
     * @Description: 发送留言板信息接口，非公共
     * @param content 留言内容（String）
     * @return
     */
    @PostMapping(CommonConstants.NONPUBLIC_PREFIX+"/setMessageBoard")
    @ResponseBody
    public  ResultVO setMessageBoard(@RequestParam("content") String content,
                                     @RequestParam("date") String date){
        return messageService.setMessageBoard(content,date);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:46
     * @Description: 获取用户消息列表接口，非公共
     * @param tempPage 当前页（int）
     * @param pageCapacity 每页容量（int）
     * @param token 身份签名（String）
     * @param session 会话（HttpSession）
     * @return
     */
    @GetMapping(CommonConstants.NONPUBLIC_PREFIX+"/getUserMessageList")
    @ResponseBody
    public ResultVO getUserMessageList(@RequestParam("tempPage") int tempPage,
                                       @RequestParam("pageCapacity") int pageCapacity,
                                       @RequestHeader("token") String token,
                                       HttpSession session){
        String authId = TokenUtil.getAuthIdByToken(token,session);
        return messageService.getUserMessageList(tempPage,pageCapacity,authId);
    }

    /**
     * @Author beifengtz
     * @Date Created in 2018/8/31 20:47
     * @Description: 设置用户消息已读接口，非公共
     * @param   messageId 消息id
     * @return
     */
    @PostMapping(CommonConstants.NONPUBLIC_PREFIX+"/readUserMessage")
    @ResponseBody
    public ResultVO readUserMessage(@RequestParam("id") int messageId){
        return messageService.readUserMessage(messageId);
    }
}
