package com.beifengtz.vr360.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 14:54 2018/5/12
 * @Modified By:
 */
public class RegexUtil {
    /**
     * 大陆号码或香港号码均可
     */
    public static boolean isPhoneLegal(String str)throws PatternSyntaxException {
        return isChinaPhoneLegal(str) || isHKPhoneLegal(str);
    }

    /**
     * 大陆手机号码11位数，匹配格式：前三位固定格式+后8位任意数
     * 此方法中前三位格式有：
     * 13+任意数
     * 15+除4的任意数
     * 18+除1和4的任意数
     * 17+除9的任意数
     * 147
     */
    public static boolean isChinaPhoneLegal(String str) throws PatternSyntaxException {
        String regExp = "^((13[0-9])|(15[^4])|(18[0,2,3,5-9])|(17[0-8])|(147))\\d{8}$";
        Pattern p = Pattern.compile(regExp);
        Matcher m = p.matcher(str);
        return m.matches();
    }

    /**
     * 香港手机号码8位数，5|6|8|9开头+7位任意数
     */
    public static boolean isHKPhoneLegal(String str)throws PatternSyntaxException {
        String regExp = "^(5|6|8|9)\\d{7}$";
        Pattern p = Pattern.compile(regExp);
        Matcher m = p.matcher(str);
        return m.matches();
    }
    /**
     * sql敏感词过滤
     * */
    public static boolean filterSqlString(String str){
        String[] sqlList = {",","*","#","&","'","<",">","script","div"};
        for (String sqlStr : sqlList){
            if(str.indexOf(sqlStr) != -1){
                // System.out.println(str.indexOf(sqlStr));
                return false;
            }
        }
        return true;
    }

    public static boolean filterIp(String ip) {
        String pattern = "[1-9]{1,3}(.)[1-9]{1,3}(.)[1-9]{1,3}(.)[1-9]{1,3}";
        // 创建 Pattern 对象
        Pattern r = Pattern.compile(pattern);
        // 创建 matcher 对象
        Matcher m = r.matcher(ip);
        if(m.find()){
            return true;
        }else{
            return false;
        }
    }
}
