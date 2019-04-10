package com.beifengtz.vr360.util;

import com.beifengtz.vr360.POJO.VO.ResultVO;
import com.beifengtz.vr360.enums.ResultEnums;

/**
 * @Author: beifengtz
 * @Desciption: http响应的工具类
 * @Date: Created in 10:28 2018/5/12
 * @Modified By:
 */
public class ResultVOUtil {

    public ResultVO success(Object object){
        return new ResultVO(ResultEnums.SUCCESS,object);
    }
    public ResultVO systemError(Object object){
        return new ResultVO(ResultEnums.UNKNOWN_ERROR,object);
    }

    public ResultVO exist(Object object){
        return new ResultVO(ResultEnums.RESOURCE_EXIST,object);
    }

    public ResultVO formatError(Object object){
        return new ResultVO(ResultEnums.PARAM_ERROR,object);
    }

    public ResultVO codeError(Object object){
        return new ResultVO(ResultEnums.INVALID_CODE,object);
    }

    public ResultVO paramError(Object object){
        return new ResultVO((ResultEnums.PARAM_ERROR),object);
    }

    public ResultVO loginFiled(Object object){
        return new ResultVO(ResultEnums.LOGIN_FAILED,object);
    }

    public ResultVO resourceNotFound(Object object){
        return new ResultVO(ResultEnums.RESOURCE_NOT_FOUND,object);
    }

    public ResultVO unauthorized(Object object){
        return new ResultVO(ResultEnums.UNAUTHORIZED,object);
    }

    public ResultVO luckyMessage(Object object){
        return new ResultVO(ResultEnums.LUCKY_MESSAGE,object);
    }

    public ResultVO unluckyMessage(Object object){
        return new ResultVO(ResultEnums.UNLUCKY_MESSAGE,object);
    }

    public ResultVO userNotFound(Object object) {return new ResultVO(ResultEnums.USER_NOT_FOUND,object);}
}
