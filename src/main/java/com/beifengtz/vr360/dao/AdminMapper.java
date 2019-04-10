package com.beifengtz.vr360.dao;

import com.beifengtz.vr360.POJO.DO.Admin;

/**
 * @Author beifengtz
 * @Date Created in 9:14 2018/5/23
 * @Description:
 */
public interface AdminMapper {

    Admin getAdminInfo (String adminId);

    boolean selectAdminIsExist(String adminId);
}
