var URL_TYPE={
    API_VERSION:"/v1",
    NONPUBLIC_PREFIX:"/v1/nonpub",
    PUB_PREFIX:"/v1/pub"
};
var users=[];
var paginationData = {
    tempPage:1,
    pageCapacity:10
}
$(function () {
    getUserList(1,paginationData.pageCapacity);
})
/**
 * 获取用户列表
 * */
function getUserList(tempPage,pageCapacity){
    try{
        var token = getCookie("vr360_admin_token");
        if(token == null || token.length<10){
            location.href = "login.html"
        }else{
            $.ajax({
                url:URL_TYPE.NONPUBLIC_PREFIX+"/admin/getUserList",
                type:"get",
                headers:{
                    token:token
                },
                data:{
                    tempPage:tempPage,
                    pageCapacity:pageCapacity
                },
                dataType:"json",
                success:function (res) {
                    console.log(res);
                    if (res.code == 5){
                        location.href = "login.html"
                    } else if(res.code == 0) {
                        users = res.data.users;
                        renderUserList(res.data);
                        $("#pagination").pagination({
                            currentPage: paginationData.tempPage,
                            totalPage: Math.ceil(res.data.total/paginationData.pageCapacity),
                            isShow: true,
                            count: 5,
                            homePageText: "<<",
                            endPageText: ">>",
                            prevPageText: "<",
                            nextPageText: ">",
                            callback: function(current) {
                                // console.log(current);
                                paginationData.tempPage = current;
                                getUserList(current,paginationData.pageCapacity);
                            }
                        });
                    }
                },
                error:function (res) {
                    alert(res.status);
                }
            })
        }
    }catch (e) {

    }
}
/**
 * 渲染用户列表
 * */
function renderUserList(data){
    $(".totalNum").text(data.total);
    $("#userContainer").empty();
    for(var index in data.users){
        switch (data.users[index].user_sex) {
            case "b":
                data.users[index].user_sex = "boy";
                break;
            case "g":
                data.users[index].user_sex = "girl";
                break;
            case "s":
                data.users[index].user_sex = "secrecy";
                break;
        }
        switch (data.users[index].user_authentication_type_id) {
            case "1":
                data.users[index].user_authentication_type_id = "QQ";
                break;
            case "2":
                data.users[index].user_authentication_type_id = "微信";
                break;
            case "3":
                data.users[index].user_authentication_type_id = "手机";
                break;
            case "4":
                data.users[index].user_authentication_type_id = "微博";
                break;
        }
        if (data.users[index].user_header_img == "0") {
            data.users[index].user_header_img = "../images/source/admin-head.png";
        }
        $("#userContainer").append("<tr title='"+data.users[index].user_des +"'>\n" +
            "                         <td>\n" +
            "                         <a class=\"dropdown-toggle arrow-none waves-effect\" href='../p/people.html?uid="+data.users[index].user_authentication_id+"' target='_blank'>\n" +
            "                         <img src='"+data.users[index].user_header_img+"' alt=\"user\" class=\"rounded-circle\">\n" +
            "                         </a>\n" +
            "                         </td>\n" +
            "                         <td>"+data.users[index].user_name+"</td>\n" +
            "                         <td>"+data.users[index].user_sex+"</td>\n" +
            "                         <td>"+data.users[index].user_des+"</td>\n" +
            "                         <td>"+data.users[index].user_authentication_type_id+"</td>\n" +
            "                         <td>"+data.users[index].user_register_time +"</td>\n" +
            "                         <td><button class=\"btn btn-danger btn-xs\" onclick=\"delUser("+index+")\">删除</button></td>\n" +
            "                       </tr>");
    }
    $("#pagingContainer").append("<div class='col-xs-12 col-sm-12 col-md-12' align=\"center\">\n" +
        "            <div id=\"pagination\" class=\"\"></div>\n" +
        "        </div>");
}
/**
 * 删除用户
 * */
function delUser(index){

}

function filterSqlStr(value){
    var sqlStr=sql_str().split(',');
    var flag=false;
    for(var i=0;i<sqlStr.length;i++){
        if(value.toLowerCase().indexOf(sqlStr[i])!=-1){
            flag=true;
            break;
        }
    }
    return flag;
}
function sql_str(){
    var str="and,delete,or,exec,insert,select,union,update,count,*,',join,>,<,',?,？,-,+,/,!,#";
    return str;
}
/** cookie工具类
 * s20是代表20秒
 * h是指小时，如12小时则是：h12
 * d是天数，30天则：d30
 * */

//创建cookie
function setCookie(name,value,time)
{
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec*1);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getsec(str)
{
    var str1=str.substring(1,str.length)*1;
    var str2=str.substring(0,1);
    if (str2=="s")
    {
        return str1*1000;
    }
    else if (str2=="h")
    {
        return str1*60*60*1000;
    }
    else if (str2=="d")
    {
        return str1*24*60*60*1000;
    }
}
//获取cookie
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
//删除cookie
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}