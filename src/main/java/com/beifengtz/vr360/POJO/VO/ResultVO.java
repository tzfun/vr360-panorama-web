package com.beifengtz.vr360.POJO.VO;


import com.beifengtz.vr360.enums.ResultEnums;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 18:41 2018/5/7
 * @Modified By:
 */
public class ResultVO {

    /** 错误码. */
    private Integer code;

    /** 提示信息. */
    private String msg;

    /** 具体内容. */
    private Object data;

    public ResultVO() {
    }

    public ResultVO(ResultEnums resultEnums, Object data){
        this.code=resultEnums.getCode();
        this.msg=resultEnums.getMsg();
        this.data=data;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
