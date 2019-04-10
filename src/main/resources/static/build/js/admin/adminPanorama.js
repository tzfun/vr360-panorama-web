var OSS_URL="https://vr360-beifengtz.oss-cn-beijing.aliyuncs.com/";
var URL_TYPE={
    API_VERSION:"/v1",
    NONPUBLIC_PREFIX:"/v1/nonpub",
    PUB_PREFIX:"/v1/pub"
};
var panoramas=[];
var paginationData = {
    tempPage:1,
    pageCapacity:10
}
$(function () {
    getPanoramaList(1,paginationData.pageCapacity);
})
/**
 * 获取全景列表
 * */
function getPanoramaList(tempPage,pageCapacity){
    try{
        var token = getCookie("vr360_admin_token");
        if(token == null || token.length<10){
            location.href = "login.html"
        }else{
            $.ajax({
                url:URL_TYPE.NONPUBLIC_PREFIX+"/admin/getPanoramaList",
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
                        panoramas = res.data.data;
                        renderPanoramaList(res.data);
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
                                getPanoramaList(current,paginationData.pageCapacity);
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
        console.log(e);
    }
}

/**
 * 渲染全景图片
 * */
function renderPanoramaList(data) {
    $("#listContainer").empty();
    $("#pagingContainer").empty();
    $("#totalNum").text(data.total);
    for(var index in data.data){
        var btn1 = "通过";
        var btn2 = "推荐";
        if (data.data[index].user.headerImg == "0") {
            data.data[index].user.headerImg = "../images/source/admin-head.png";
        }
        if(data.data[index].photoType == "sola"){
            data.data[index].photoType = "单张"
        }else{
            data.data[index].photoType = "六方位"
        }
        if(data.data[index].stats == 1){
            data.data[index].stats = "未发布"
            btn1 = "通过";
        }else{
            data.data[index].stats = "已发布"
            btn1 = "不通过";
        }
        if(data.data[index].recommend == "1"){
            data.data[index].recommend = "推荐";
            btn2 = "取消推荐";
        }else{
            data.data[index].recommend = "未推荐";
            btn2 = "上推荐";
        }
        var date = new Date(data.data[index].createTime * 1000);

        var createTime = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        $("#listContainer").append("<tr>\n" +
            "                                                <td>\n" +
            "                                                    <a class=\"dropdown-toggle arrow-none waves-effect\" data-toggle=\"dropdown\" target='_blank' role=\"button\"\n" +
            "                                                       aria-haspopup=\"false\" aria-expanded=\"false\">\n" +
            "                                                        <img src='"+data.data[index].user.headerImg+"' alt=\"user\" class=\"rounded-circle\">\n" +
            "                                                    </a>\n" +
            "                                                </td>\n" +
            "                                                <td>"+data.data[index].photoType+"</td>\n" +
            "                                                <td>"+data.data[index].stats+"</td>\n" +
            "                                                <td><a href='javascript:showPhoto("+index+");'>点击查看</a></td>\n" +
            "                                                <td>"+data.data[index].description+"</td>\n" +
            "                                                <td>"+createTime+"</td>\n" +
            "                                                <td>"+data.data[index].heartNum+"</td>\n" +
            "                                                <td>"+data.data[index].viewNum+"</td>\n" +
            "                                                <td>"+data.data[index].recommend+"</td>\n" +
            "                                                <td>\n" +
            "                                                    <button class=\"btn-warning btn-mini\" onclick=\"setPhotoStats("+index+")\">"+btn1+"</button>\n" +
            "                                                    <button class=\"btn-primary btn-mini\" onclick=\"setRecommend("+index+")\">"+btn2+"</button>\n" +
            "                                                    <button class=\"btn-danger btn-mini\" onclick=\"checkDelPanorama("+index+")\">删除</button>\n" +
            "                                                </td>\n" +
            "                                            </tr>");
    }
    $("#pagingContainer").append("<div class='col-xs-12 col-sm-12 col-md-12' align=\"center\">\n" +
        "            <div id=\"pagination\" class=\"\"></div>\n" +
        "        </div>");
}
/**
 * 图片查看器
 * */
function showPhoto(i){

    try {
        var token = getCookie("vr360_admin_token");
        if (token == null || token.length < 10) {
            location.href = "login.html"
        } else {
            $.ajax({
                url:URL_TYPE.NONPUBLIC_PREFIX+"/admin/getVrPhotoById",
                type:"get",
                headers:{
                    token:token
                },
                data:{
                    photoId:panoramas[i].id
                },
                dataType:"json",
                success:function (res) {
                    console.log(res);
                    if(res.code == 0){
                        var images = [];
                        if(res.data.res.type == "sola"){
                            images = [OSS_URL+res.data.res.photoOne.key];
                        }else{
                            images = [
                                OSS_URL+res.data.res.photoOne.key,
                                OSS_URL+res.data.res.photoTwo.key,
                                OSS_URL+res.data.res.photoThree.key,
                                OSS_URL+res.data.res.photoFour.key,
                                OSS_URL+res.data.res.photoFive.key,
                                OSS_URL+res.data.res.photoSix.key
                            ]
                        }
                        var settings = {};
                        $.fn.galpop('openBox',settings,images);
                    }else if(res.code == 5){
                        location.href = "login.html"
                    }
                }
            })
        }
    }catch (e) {
        console.log(e);
    }
}

/**
 * 设置图片状态
 * */
function setPhotoStats(i){
    var stats = 1;
    if(panoramas[i].stats == "未发布"){
        stats = 2
    }else{
        stats = 1
    }
    try {
        var token = getCookie("vr360_admin_token");
        if (token == null || token.length < 10) {
            location.href = "login.html"
        } else {
            $.ajax({
                url:URL_TYPE.NONPUBLIC_PREFIX+"/admin/setPanoramaStats",
                type:"post",
                headers:{
                    token:token
                },
                data:{
                    stats:stats,
                    photoId:panoramas[i].id
                },
                dataType:"json",
                success:function (res) {
                    console.log(res);
                    if(res.code == 0){
                        getPanoramaList(paginationData.tempPage,paginationData.pageCapacity);
                    }else if(res.code == 5){
                        location.href = "login.html"
                    }
                }
            })
        }
    }catch (e) {
        console.log(e);
    }

}

/**
 * 设置推荐
 * */
function setRecommend(i){
    var recommend = 0;
    if(panoramas[i].recommend == "未推荐"){
        recommend = 1
    }else{
        recommend = 0
    }
    try {
        var token = getCookie("vr360_admin_token");
        if (token == null || token.length < 10) {
            location.href = "login.html"
        } else {
            $.ajax({
                url:URL_TYPE.NONPUBLIC_PREFIX+"/admin/recommend",
                type:"post",
                headers:{
                    token:token
                },
                data:{
                    value:recommend,
                    photoId:panoramas[i].id
                },
                dataType:"json",
                success:function (res) {
                    console.log(res);
                    if(res.code == 0){
                        getPanoramaList(paginationData.tempPage,paginationData.pageCapacity);
                    }else if(res.code == 5){
                        location.href = "login.html"
                    }
                }
            })
        }
    }catch (e) {
        console.log(e);
    }
}
/**
 * 确认删除
 * */
function checkDelPanorama(i) {
    $.confirm({
        title:"VR 360提示您",
        content: '确认删除该图片？',
        type: 'green',
        icon: 'glyphicon glyphicon-question-sign',
        animation: 'RotateX',
        buttons: {
            ok: {
                text: '确认',
                btnClass: 'btn-primary',
                action: function(){return delPanorama(i)}
            },
            cancel: {
                text: '取消',
                btnClass: 'btn-primary'
            }
        }
    });
}

/**
 * 删除图片
 * */
function delPanorama(i) {

    try {
        var token = getCookie("vr360_admin_token");
        if (token == null || token.length < 10) {
            location.href = "login.html"
        } else {
            $.ajax({
                url:URL_TYPE.NONPUBLIC_PREFIX+"/admin/delPanorama",
                type:"post",
                headers:{
                    token:token
                },
                data:{
                    photoId:panoramas[i].id
                },
                dataType:"json",
                success:function (res) {
                    console.log(res);
                    if(res.code == 0){
                        getPanoramaList(paginationData.tempPage,paginationData.pageCapacity);
                    }else if(res.code == 5){
                        location.href = "login.html"
                    }
                }
            })
        }
    }catch (e) {
        console.log(e);
    }
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