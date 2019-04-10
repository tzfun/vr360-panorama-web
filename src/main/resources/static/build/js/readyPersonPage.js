
$(document).ready(function () {
    var request = GetRequest();
    if(request.state!="" && request.state!=null){
        loginByThird(request);
    }else{
        getUserStatus();
        var userInfo = JSON.parse(getCookie('vr360_user_token'));
        if(userInfo==null){
            // showLoginBox();
        }else{
            renderUserData();
        }
    }
});
var URL_TYPE={
    API_VERSION:"/v1",
    NONPUBLIC_PREFIX:"/v1/nonpub",
    PUB_PREFIX:"/v1/pub"
};
var authType = {
    1:"QQ",
    2:"微信",
    3:"手机号码",
    4:"微博"
}

var personInfo = {};
var messageList = [];
var paginationData = {
    tempPage:1,
    pageCapacity:10
}

/**
 * 获取用户个人的创作作品（包含未发布和未通过）
 * */
function getUserPhotoByStats(stats) {
    var resData = null;
    $.ajax({
        url:URL_TYPE.NONPUBLIC_PREFIX+"/selectVrPhotoByUserAuthId",
        type:"get",
        headers:{
            token:JSON.parse(getCookie("vr360_user_token")).token
        },
        async: false,
        data:{
            stats:stats
        },
        dataType:'json',
        success:function (res) {
            // console.log(res);
            resData=res;
            return res;
        },
        error:function (res) {
            console.log(res);
            return null;
        }
    })
    return resData;
}
/**
 * 获取并渲染用户基本数据
 * */
function renderUserData() {
        $.ajax({
            url:URL_TYPE.NONPUBLIC_PREFIX+"/getUserInfo",
            headers:{
                token:JSON.parse(getCookie("vr360_user_token")).token
            },
            type:"get",
            dataType:'json',
            success:function (res) {
                // console.log(res);
                if(res.code==0){
                    personInfo = res.data;
                    $("#fans").text(personInfo.fans);
                    $("#works").text(personInfo.works);
                    $("#follow").text(personInfo.follow);
                    if(res.data.sex=="b"){
                        $('.usersex').html("<small><i class=\"fa fa-mars-stroke\" aria-hidden=\"true\"></i>&nbsp;&nbsp;男</small>");
                    }else if(res.data.sex=="g"){
                        $('.usersex').html("<small><i class=\"fa fa-venus\" aria-hidden=\"true\"></i>&nbsp;&nbsp;女</small>");
                    }else{
                        $('.usersex').html("<small><i class=\"fa fa-venus-mars\" aria-hidden=\"true\"></i>&nbsp;&nbsp;保密</small>");
                    }
                    $('#personDes').text(res.data.des);
                    $('#userName').text(res.data.username);
                    if(res.data.headerImg != "0"){
                        $('#userHeadImg').attr("src",res.data.headerImg);
                    }
                    //渲染我的主页
                    renderMyIndex();
                }else{
                    $('#msgModal').text("登录失败");
                    $('#msgModal').fadeIn();
                    setTimeout(function () {
                        $('#msgModal').fadeOut();
                    },2000);
                    showLoginBox();
                }
            },
            error:function (res) {
                $('#msgModal').text("登录失败"+res.status);
                $('#msgModal').fadeIn();
                setTimeout(function () {
                    $('#msgModal').fadeOut();
                },2000);
                showLoginBox();
            }
        })
}
/**
 * 点击左侧菜单栏切换
 * */
function showMyIndex(type) {
    //初始化分页插件
    paginationData.tempPage = 1;
    $('.nav-list li').removeClass("leftBarActive");
    switch (type){
        case "person":
            $('.nav-list li:nth-of-type(1)').addClass("leftBarActive");
            renderMyIndex();
            break;
        case "create":
            $('.nav-list li:nth-of-type(2)').addClass("leftBarActive");
            $('#mainContainer').html("<div>\n" +
                "                        <ul class=\"nav nav-tabs statsBar\">\n" +
                "                            <li role=\"presentation\" class=\"active\"><a href=\"javascript:changeStats(1)\">待审核</a></li>\n" +
                "                            <li role=\"presentation\"><a href=\"javascript:changeStats(2)\">已通过</a></li>\n" +
                "                            <li role=\"presentation\"><a href=\"javascript:changeStats(3)\">未通过</a></li>\n" +
                "\n" +
                "                        </ul>\n" +
                "                        <div class=\"col-xs-12 col-sm-12 col-md-12\" id=\"photoContainer\">\n" +
                "                        </div>\n" +
                "                    </div>");
            changeStats(1);
            break;
        case "fans":
            $('.nav-list li:nth-of-type(3)').addClass("leftBarActive");
            getFans(1,paginationData.pageCapacity);
            break;
        case "likeSomeOne":
            $('.nav-list li:nth-of-type(4)').addClass("leftBarActive");
            getFollows(1,paginationData.pageCapacity);
            break;
        case "setting":
            $('.nav-list li:nth-of-type(5)').addClass("leftBarActive");
            // console.log(personInfo);
            if(personInfo.authId!=null && personInfo.authId!=""){
                $('#mainContainer').html("<div>\n" +
                    "                        <div class=\"col-xs-12 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2\">\n" +
                    "                            <form class=\"form-horizontal\" id=\"changeForm\">\n" +
                    "                                <div class=\"form-group\">\n" +
                    "                                    <label class=\"col-xs-2 col-sm-3 col-md-3 control-label\">账户</label>\n" +
                    "                                    <div class=\"col-xs-10 col-sm-9 col-md-9\" id=\"authId\" style=\"color: #312b30;font-size: 15px;line-height: 36px\">\n" +
                    "                                        17321914392\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"form-group\">\n" +
                    "                                    <label for=\"change_username\" class=\"col-xs-12 col-sm-3 col-md-3 control-label\">用户名</label>\n" +
                    "                                    <div class=\"col-xs-12 col-sm-9 col-md-6\">\n" +
                    "                                        <input type=\"text\" class=\"form-control\" name=\"change_username\" id=\"change_username\" placeholder=\"请输入你的用户名\">\n" +
                    "                                        <span class=\"input-warning\"></span>\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"form-group\">\n" +
                    "                                    <label class=\"col-xs-12 col-sm-3 col-md-3 control-label\">性别</label>\n" +
                    "                                    <div class=\"col-xs-12 col-sm-9 col-md-9\" id=\"change_sex\">\n" +
                    "                                        <label style=\"margin-left: 30px;\" title=\"男孩\">\n" +
                    "                                            <i class=\"fa fa-mars\" aria-hidden=\"true\" style=\"color: blueviolet;font-size: 20px\"></i>&nbsp;&nbsp;\n" +
                    "                                            <input type=\"radio\" name=\"change_sex\" value=\"b\">\n" +
                    "                                        </label>\n" +
                    "                                        <label style=\"margin-left: 30px;\" title=\"女孩\">\n" +
                    "                                            <i class=\"fa fa-venus\" aria-hidden=\"true\" style=\"color: red;font-size: 20px\"></i>&nbsp;&nbsp;\n" +
                    "                                            <input type=\"radio\" name=\"change_sex\" value=\"g\">\n" +
                    "                                        </label>\n" +
                    "                                        <label style=\"margin-left: 30px;\" title=\"保密\">\n" +
                    "                                            <i class=\"fa fa-venus-mars\" aria-hidden=\"true\" style=\"color: #1b6d85;font-size: 20px\"></i>&nbsp;&nbsp;\n" +
                    "                                            <input type=\"radio\" name=\"change_sex\" value=\"s\">\n" +
                    "                                        </label>\n" +
                    "                                        <span class=\"input-warning\"></span>\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"form-group\">\n" +
                    "                                    <label for=\"change_describe\" class=\"col-xs-12 col-sm-3 col-md-3 control-label\">个性签名</label>\n" +
                    "                                    <div class=\"col-xs-12 col-sm-9 col-md-9\">\n" +
                    "                                        <input type=\"text\" class=\"form-control\" name=\"change_describe\" id=\"change_describe\" maxlength='32' placeholder=\"编辑你的个性签名\">\n" +
                    "                                        <span class=\"input-warning\"></span>\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"form-group\">\n" +
                    "                                    <label class=\"col-xs-6 col-sm-3 col-md-3 control-label\">注册时间:</label>\n" +
                    "                                    <div class=\"col-xs-6 col-sm-9 col-md-9\" id=\"registerTime\" style=\"color: #74dac6;font-size: 15px;line-height: 36px\">\n" +
                    "                                        2018年8月3日\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"form-group\">\n" +
                    "                                    <label class=\"col-xs-6 col-sm-3 col-md-3 control-label\">注册方式:</label>\n" +
                    "                                    <div class=\"col-xs-6 col-sm-9 col-md-9\" id=\"registerType\" style=\"color: #74dac6;font-size: 15px;line-height: 36px\">\n" +
                    "                                        QQ\n" +
                    "                                    </div>\n" +
                    "                                </div>\n" +
                    "                                <div align=\"center\"><a href=\"javascript:changePassword();\">修改密码</a></div>\n" +
                    "                                <div id=\"changePasswordContainer\" class=\"col-xs-12 col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3\" align=\"center\">\n" +
                    "                                    <input type=\"password\" class=\"form-control\" name=\"oldPassword\" placeholder=\"输入旧密码\">\n" +
                    "                                    <input type=\"password\" class=\"form-control\" name=\"newPassword\" placeholder=\"输入新密码\">\n" +
                    "                                    <input type=\"password\" class=\"form-control\" name=\"newPassword\" placeholder=\"再次输入新密码\">\n" +
                    "                                    <span class=\"input-warning\"></span>\n" +
                    "                                </div>\n" +
                    "                                <div class=\"col-xs-12 col-sm-12 col-md-12\" style=\"margin-top: 50px;\">\n" +
                    "                                    <div class=\"saveBtn\" onclick=\"saveChange()\">保存</div>\n" +
                    "                                </div>\n" +
                    "                            </form>\n" +
                    "                        </div>\n" +
                    "                    </div>");
                renderPersonInfo();
            }else{
                noticeLogin();
            }
            break;
        case "message":
            $('.nav-list li:nth-of-type(6)').addClass("leftBarActive");
            $("#mainContainer").html("<div>\n" +
                "                        <h4>全部消息（ <span class=\"msgNum \" id=\"notReadMes\">0</span> / <span class=\"msgNum \" id=\"totalMes\">0</span> ）</h4>\n" +
                "                        <ul id=\"msgContainer\">\n" +
                "                        </ul>\n" +
                "                    </div>");
            getUserMessage(1,10);
            break;
    }
}
/**
 * 获取粉丝列表
 * */
function getFans(tempPage,pageCapacity){
    try {
        if(JSON.parse(getCookie("vr360_user_token")).token == null){
            $.alert("未登录或登录失效");
            getUserStatus();
        }else{
            $.ajax({
                url:URL_TYPE.NONPUBLIC_PREFIX+"/user/getFans",
                type:"get",
                headers:{
                    token:JSON.parse(getCookie("vr360_user_token")).token
                },
                data:{
                    tempPage:tempPage,
                    pageCapacity:pageCapacity
                },
                success:function (res) {
                    // console.log(res);
                    if(res.code == 5){
                        $.alert("未登录或登录失效");
                        getUserStatus();
                        noticeLogin();
                    }else if(res.code == -1){
                        $.alert("未知错误");
                    }else if(res.code == 10){
                        $("#mainContainer").html("<div class=\"noticeFont\">您暂无粉丝哦~</div>");
                    }else if(res.code == 0){
                        renderFans(res.data);
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
                                getFans(current,paginationData.pageCapacity);
                            }
                        });
                    }

                },
                error:function (res) {
                    $.alert("获取消息错误"+res.status);
                }
            })
        }
    }catch (e) {
        console.error(e);
        $.alert("未登录或登录失效");
        getUserStatus();
        noticeLogin();
    }
}
/**
 * 渲染粉丝列表
 * */
function renderFans(data){
    $("#mainContainer").html("<div class=\"row\" id=\"fansContainer\"></div>");
    $("#fansContainer").empty();
    for(var index in data.data){
        var fontClass = "normal-font";
        if(data.data[index].sex == "b"){
            fontClass = "blue-font";
        }else if(data.data[index].sex == "g"){
            fontClass = "red-font";
        }
        if (data.data[index].header=="0"){
            data.data[index].header = "/images/source/admin-head.png";
        }
        $("#fansContainer").append("<div class=\"col-xs-4 col-sm-2 col-md-2\" align=\"center\">\n" +
            "                            <a class=\"user-head\" href='/p/people.html?uid="+data.data[index].authId+"'><img src='"+data.data[index].header+"'></a>\n" +
            "                            <div class='user-name "+fontClass+"'>"+data.data[index].name+"</div>\n" +
            "                        </div>");
    }
    $("#fansContainer").append("<div class=\"col-xs-12 col-sm-12 col-md-12\" align=\"center\">\n" +
        "            <div id=\"pagination\" class=\"\"></div>\n" +
        "        </div>");
}

/**
 * 获取关注者列表
 * */
function getFollows(tempPage,pageCapacity) {
    try {
        if(JSON.parse(getCookie("vr360_user_token")).token == null){
            $.alert("未登录或登录失效");
            getUserStatus();
        }else{
            $.ajax({
                url:URL_TYPE.NONPUBLIC_PREFIX+"/user/getFollows",
                type:"get",
                headers:{
                    token:JSON.parse(getCookie("vr360_user_token")).token
                },
                data:{
                    tempPage:tempPage,
                    pageCapacity:pageCapacity
                },
                success:function (res) {
                    // console.log(res);
                    if(res.code == 5){
                        $.alert("未登录或登录失效");
                        getUserStatus();
                        noticeLogin();
                    }else if(res.code == -1){
                        $.alert("未知错误");
                    }else if(res.code == 10){
                        $("#mainContainer").html("<div class=\"noticeFont\">您暂无关注的人哦~</div>");
                    }else if(res.code == 0){
                        renderFollows(res.data);
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
                                getFollows(current,paginationData.pageCapacity);
                            }
                        });
                    }

                },
                error:function (res) {
                    $.alert("获取消息错误"+res.status);
                }
            })
        }
    }catch (e) {
        console.error(e);
        noticeLogin();
    }
}
/**
 * 渲染关注列表
 * */
function renderFollows(data){
    $("#mainContainer").html("<div class=\"row\" id=\"followContainer\"></div>");
    $("#followContainer").empty();
    for(var index in data.data){
        var fontClass = "normal-font";
        if(data.data[index].sex == "b"){
            fontClass = "blue-font";
        }else if(data.data[index].sex == "g"){
            fontClass = "red-font";
        }
        if (data.data[index].header=="0"){
            data.data[index].header = "/images/source/admin-head.png";
        }
        $("#followContainer").append("<div class=\"col-xs-4 col-sm-2 col-md-2\" align=\"center\">\n" +
            "                            <a class=\"user-head\" href='/p/people.html?uid="+data.data[index].authId+"'><img src='"+data.data[index].header+"' ></a>\n" +
            "                            <div class='user-name "+fontClass+"'>"+data.data[index].name+"</div>\n" +
            "                        </div>");
    }
    $("#followContainer").append("<div class=\"col-xs-12 col-sm-12 col-md-12\" align=\"center\">\n" +
        "            <div id=\"pagination\" class=\"\"></div>\n" +
        "        </div>");
}

/**
 * 提示未登录
 * */
function noticeLogin(){
    $('#mainContainer').html("<div align=\"center\" style=\"margin-top: 145px;\">\n" +
        "                        <img src=\"../images/source/error.png\" style=\"width: 220px\">\n" +
        "                        <p>阿偶~出错了，您还未登录,请先前往登录哦~</p>\n" +
        "                        <div class=\"button uploadBtn\" onclick=\"showLoginBox()\">立即登录</div>\n" +
        "                    </div>");
}

/**
 * 渲染个人设置表单数据
 * */
function renderPersonInfo() {
    $("#authId").text(personInfo.authId);
    $("#change_username").val(personInfo.username);
    $("#change_sex input[value="+personInfo.sex+"]").click();
    $("#change_describe").val(personInfo.des);
    $("#registerTime").text(personInfo.registerTime);
    $("#registerType").text(authType[personInfo.registerType]);
}
/**
 * 修改密码
 * */
function changePassword() {
    var passwordContainerStats = $("#changePasswordContainer").css("display");
    if(personInfo.registerType!="3"){
        $('#msgModal').text("无法进行该操作");
        $('#msgModal').fadeIn();
        setTimeout(function () {
            $('#msgModal').fadeOut();
        },2000);
    }else{
        if(passwordContainerStats == "block"){
            $("input[name='oldPassword']").val("");
            $("input[name='newPassword']").val("");
            $("#changePasswordContainer").css("display","none");
        }else{
            $("#changePasswordContainer").css("display","block");
        }
    }
}
/**
 * 保存个人信息
 * */
function saveChange(){
    var hassPass = true;
    var formData = $("#changeForm").serializeJson();
    // console.log(formData);
    $(".input-warning").text("");
    if(formData.change_username == ""){
        $("#change_username + .input-warning").text("请填入用户名")
        hassPass = false;
    }else if(!filterSqlStr(formData.change_username)){
        $("#change_username + .input-warning").text("请不要输入敏感字符");
        hassPass = false;
    }
    if(!filterSqlStr(formData.change_describe)){
        $("#change_describe + .input-warning").text("请不要输入敏感字符");
        hassPass = false;
    }
    if(formData.change_sex == "" || formData.change_sex == null){
        $("#change_sex .input-warning").text("请选择性别")
        hassPass = false;
    }
    if(formData.oldPassword != ""){
        if(formData.newPassword == ""){
            $("#changePasswordContainer .input-warning").text("请输入新密码");
            hassPass = false;
        }
        if(formData.newPassword[0] != formData.newPassword[1]){
            $("#changePasswordContainer .input-warning").text("两次输入的新密码不一致");
            hassPass = false;
        }
    }
    if(hassPass){
        uploadPersonInfo(formData);
    }
}
/**
 * 上传个人设置更改
 * */
function uploadPersonInfo(data){
    var md5 = new md5Util();
    var bodyData = {};
    bodyData["changeUsername"] = data.change_username;
    bodyData["changeSex"] = data.change_sex;
    bodyData["changeDescribe"] = data.change_describe;
    if(bodyData.changeDescribe == ""){
        bodyData.changeDescribe = "此人很懒，什么也没留下";
    }
    if(data.oldPassword!="" && data.newPassword!=""){
        bodyData["oldPassword"] = md5.hex_md5(md5.hex_md5(data.oldPassword));
        bodyData["newPassword"] = md5.hex_md5(md5.hex_md5(data.newPassword[0]));
    }else{
        bodyData["oldPassword"] = null;
        bodyData["newPassword"] = null;
    }
    // console.log(bodyData);
    $.ajax({
        url:URL_TYPE.NONPUBLIC_PREFIX+"/uploadPersonInfo",
        type:"post",
        headers:{
            token:JSON.parse(getCookie("vr360_user_token")).token
        },
        async: false,
        data:
            // JSON.stringify(bodyData),
            {
            changeSex:bodyData.changeSex,
            changeUsername:bodyData.changeUsername,
            changeDescribe:bodyData.changeDescribe,
            oldPassword:bodyData.oldPassword,
            newPassword:bodyData.newPassword
        },
        cache:false,
        dataType:'json',
        success:function (res) {
            // console.log(res);
            if(res.code == 0){
                $.alert("保存成功,3s后自动刷新页面");
                setTimeout(function () {
                    location.href = location.href;
                },3000);
            }else{
                $.alert("保存失败，"+res.data);
            }
        },
        error:function (res) {
            console.log(res.status);
            $.alert("保存失败，错误"+res.status);
        }
    })
}
/**
 * 渲染我的主页
 * */
function renderMyIndex() {
    var data = {};
    try {
        data = getUserPhotoByStats(2);
    }catch (e) {
        console.error(e);
    }
    $('#mainContainer').empty();
    if(data.code==0 && data.data.length>0){
        $('#mainContainer').html("<div class=\"col-xs-12 col-sm-12 col-md-12\" id=\"photoContainer\"></div>");
        for (var i = 0; i < data.data.length; i++){
            var isRecommend;
            if(data.data[i].isRecommend == 0){
                isRecommend = "recommendHide";
            }else{
                isRecommend = "";
            }
            $('#photoContainer').append("<div class=\"col-xs-6 col-sm-4 col-md-4\" style=\"padding: 5px;margin: 0;\">\n" +
                "<div style=\"position: relative\"><div class=\"recommendIcon "+isRecommend+"\">推荐</div></div>" +
                "                                <a href='panorama.html?id="+data.data[i].id+"' class=\"img-link\" style=\"background-image: url("+data.data[i].url+")\"></a>\n" +
                "                                <div class=\"descr-container\" >"+data.data[i].description+"</div>\n" +
                "                                <div class=\"photoInfo\">\n" +
                "<i class=\"fa fa-eye\" aria-hidden=\"true\"></i>&nbsp;<span>"+data.data[i].viewNum+"</span>&nbsp;&nbsp;" +
                "<i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i>&nbsp;<span>"+data.data[i].heartNum+"</span>" +
                "                                </div>\n" +
                "                            </div>");
        }
    }else{
        $('#mainContainer').html("<div align=\"center\" style=\"margin-top: 145px;\">\n" +
            "                        <img src=\"../images/source/upload-null.png\" alt=\"\">\n" +
            "                        <p>您还没有上传作品，快去上传吧！</p>\n" +
            "                        <div class=\"button uploadBtn\" onclick=\"location.href='create360.html'\">立即上传</div>\n" +
            "                    </div>");
    }
}
/**
 * 点击状态值切换
 * */
function changeStats(type){
    $('.statsBar li').removeClass("active");
    $('#photoContainer').empty();
    switch (type){
        case 1:
            $('.statsBar li:nth-of-type(1)').addClass("active");
            var data = {};
            try {
                data = getUserPhotoByStats(1);
            }catch (e) {
                console.error(e);
            }
            if(data.code==0 && data.data.length>0){
                for (var i = 0; i < data.data.length; i++){
                    var isRecommend;
                    if(data.data[i].isRecommend == 0){
                        isRecommend = "recommendHide";
                    }else{
                        isRecommend = "";
                    }
                    $('#photoContainer').append("<div class=\"col-xs-6 col-sm-4 col-md-4\" style=\"padding: 5px;margin: 0;\">\n" +
                        "                                <a href='panorama.html?id="+data.data[i].id+"' class=\"img-link\" style=\"background-image: url("+data.data[i].url+")\"></a>\n" +
                        "                                <div class=\"descr-container\" >"+data.data[i].description+"</div>\n" +
                        "                                <div class=\"photoInfo\">\n" +
                        "<i class=\"fa fa-eye\" aria-hidden=\"true\"></i>&nbsp;<span>"+data.data[i].viewNum+"</span>&nbsp;&nbsp;" +
                        "<i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i>&nbsp;<span>"+data.data[i].heartNum+"</span>" +
                        "                                </div>\n" +
                        "                            </div>");
                }
            }else{
                $('#photoContainer').append("<div align=\"center\" style=\"margin-top: 145px;\">\n" +
                    "                        <img src=\"../images/source/nothing.png\" style=\"width: 160px;\">\n" +
                    "                        <div class=\"button uploadBtn\" onclick=\"location.href='create360.html'\">立即制作</div>\n" +
                    "                    </div>");
            }
            break;
        case 2:
            $('.statsBar li:nth-of-type(2)').addClass("active");

            var data = {};
            try {
                data = getUserPhotoByStats(2);
            }catch (e) {
                console.error(e);
            }
            if(data.code==0 && data.data.length>0){
                for (var i = 0; i < data.data.length; i++){
                    var isRecommend;
                    if(data.data[i].isRecommend == 0){
                        isRecommend = "recommendHide";
                    }else{
                        isRecommend = "";
                    }
                    $('#photoContainer').append("<div class=\"col-xs-6 col-sm-4 col-md-4\" style=\"padding: 5px;margin: 0;\">\n" +
                        "<div style=\"position: relative\"><div class=\"recommendIcon "+isRecommend+"\">推荐</div></div>" +
                        "                                <a href='panorama.html?id="+data.data[i].id+"' class=\"img-link\" style=\"background-image: url("+data.data[i].url+")\"></a>\n" +
                        "                                <div class=\"descr-container\" >"+data.data[i].description+"</div>\n" +
                        "                                <div class=\"photoInfo\">\n" +
                        "<i class=\"fa fa-eye\" aria-hidden=\"true\"></i>&nbsp;<span>"+data.data[i].viewNum+"</span>&nbsp;&nbsp;" +
                        "<i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i>&nbsp;<span>"+data.data[i].heartNum+"</span>" +
                        "                                </div>\n" +
                        "                            </div>");
                }
            }else{
                $('#photoContainer').append("<div align=\"center\" style=\"margin-top: 145px;\">\n" +
                    "                        <img src=\"../images/source/nothing.png\" style=\"width: 160px;\">\n" +
                    "                        <div class=\"button uploadBtn\" onclick=\"location.href='create360.html'\">立即制作</div>\n" +
                    "                    </div>");
            }
            break;
        case 3:
            $('.statsBar li:nth-of-type(3)').addClass("active");
            var data = {};
            try {
                data = getUserPhotoByStats(3);
            }catch (e) {
                console.error(e);
            }
            if(data.code==0 && data.data.length>0){
                for (var i = 0; i < data.data.length; i++){
                    var isRecommend;
                    if(data.data[i].isRecommend == 0){
                        isRecommend = "recommendHide";
                    }else{
                        isRecommend = "";
                    }
                    $('#photoContainer').append("<div class=\"col-xs-6 col-sm-4 col-md-4\" style=\"padding: 5px;margin: 0;\">\n" +
                        "                                <a href='panorama.html?id="+data.data[i].id+"' class=\"img-link\" style=\"background-image: url("+data.data[i].url+")\"></a>\n" +
                        "                                <div class=\"descr-container\" >"+data.data[i].description+"</div>\n" +
                        "                                <div class=\"photoInfo\">\n" +
                        "<i class=\"fa fa-eye\" aria-hidden=\"true\"></i>&nbsp;<span>"+data.data[i].viewNum+"</span>&nbsp;&nbsp;" +
                        "<i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i>&nbsp;<span>"+data.data[i].heartNum+"</span>" +
                        "                                </div>\n" +
                        "                            </div>");
                }
            }else{
                $('#photoContainer').append("<div align=\"center\" style=\"margin-top: 145px;\">\n" +
                    "                        <img src=\"../images/source/nothing.png\" style=\"width: 160px;\">\n" +
                    "                        <div class=\"button uploadBtn\" onclick=\"location.href='create360.html'\">立即制作</div>\n" +
                    "                    </div>");
            }
            break;
    }
}

/**
 * 获取消息列表
 * */
function getUserMessage(tempPage,pageCapacity){
    try {
        if(JSON.parse(getCookie("vr360_user_token")).token == null){
            $.alert("未登录或登录失效");
            getUserStatus();
            noticeLogin();
        }else{
            $.ajax({
                url:URL_TYPE.NONPUBLIC_PREFIX+"/getUserMessageList",
                type:"get",
                headers:{
                    token:JSON.parse(getCookie("vr360_user_token")).token
                },
                data:{
                    tempPage:tempPage,
                    pageCapacity:pageCapacity
                },
                success:function (res) {
                    // console.log(res);
                    if(res.code == 5){
                        $.alert("未登录或登录失效");
                        getUserStatus();
                        noticeLogin();
                    }else if(res.code == -1){
                        $.alert("未知错误");

                    }else if(res.code == 0){
                        renderMessage(res.data);
                        $("#pagination").pagination({
                            currentPage: paginationData.tempPage,
                            totalPage: Math.ceil(res.data.data.total/paginationData.pageCapacity),
                            isShow: true,
                            count: 5,
                            homePageText: "<<",
                            endPageText: ">>",
                            prevPageText: "<",
                            nextPageText: ">",
                            callback: function(current) {
                                // console.log(current);
                                paginationData.tempPage = current;
                                getUserMessage(current,paginationData.pageCapacity);
                            }
                        });
                    }

                },
                error:function (res) {
                    $.alert("获取消息错误"+res.status);
                }
            })
        }
    }catch (e) {
        console.error(e);
        noticeLogin();
    }

}

/**
 * 渲染消息列表
 * */
function renderMessage(data) {
    // console.log(data);
    messageList = data.messages;
    $("#notReadMes").text(data.data.notRead);
    $("#totalMes").text(data.data.total);
    $("#msgContainer").empty();
    for (var tempMessage in  data.messages) {
        var date = new Date(parseInt(data.messages[tempMessage].time));
        var msgNotice = "";
        var imgShow = "";
        if(data.messages[tempMessage].read == 0){
            msgNotice = "msgNot";
        }else{
            msgNotice = "hide";
        }
        if(data.messages[tempMessage].img == "0"){
            data.messages[tempMessage].img = "/images/source/small.png"
        }
        $("#msgContainer").append("<li>\n" +
            "                                <div class=\"msgList row\">\n" +
            "                                    <div  class=\"col-xs-12 col-sm-6 col-md-6\">\n" +
            "                                        <div>" +
            "<div class="+msgNotice+"></div>" +
            "<span class=\"msgType\">["+data.messages[tempMessage].author+"]</span>&nbsp;&nbsp;" +
            "<span class=\"msgTile\">" +
            "<a href='javascript:void(0);' onclick='readeMessage("+tempMessage+")' target='_blank'>"+data.messages[tempMessage].title+"</a>" +
            "</span> <span class=\"msgTime\">"+
            (parseInt(date.getMonth())+1)+"月"+date.getDate()+"日 "+date.getHours()+":"+date.getMinutes()+"</span></div>\n" +
            "                                        <div class=\"msgDes\">"+data.messages[tempMessage].content+"</div>\n" +
            "                                    </div>\n" +
            "                                    <div class='col-xs-12 col-sm-6 col-md-6' align=\"center\">\n" +
            "                                        <a href='"+data.messages[tempMessage].link+"' target='_blank'><img src='"+data.messages[tempMessage].img+"'\n" +
            "                                                        alt=\"\" class=\"msgImg \"></a>\n" +
            "                                    </div>\n" +
            "                                </div>\n" +
            "                            </li>");
    }
    $("#msgContainer").append("<div class=\"col-xs-12 col-sm-12 col-md-12\" align=\"center\">\n" +
        "            <div id=\"pagination\" class=\"\"></div>\n" +
        "        </div>");
}

/**
 * 阅读消息
 * */
function readeMessage(messageIndex) {
    if(messageList[messageIndex].img == "0"){
        messageList[messageIndex].img = "/images/source/small.png"
    }
    var date = new Date(parseInt(messageList[messageIndex].time));
    $("#readerModal .modal-body").html("<span class=\"msgTime\">"+(parseInt(date.getMonth())+1)+"月"+date.getDate()+"日 "+date.getHours()+":"+date.getMinutes()+"&nbsp;&nbsp;&nbsp;</span>\n" + messageList[messageIndex].content +
        "                <div align=\"center\">\n" +
        "                    <a href='"+messageList[messageIndex].link+"' target='_blank'><img src='"+messageList[messageIndex].img+"'\n" +
        "                                    style=\"width: 80%;margin: 15px;\"></a>\n" +
        "                </div>");
    $("#readerModal").modal("show");
    updateUserMessageReadStatus(messageList[messageIndex].id);
    getUserMessage(1,10);
}

/**
 * 更新消息状态
 * */
function updateUserMessageReadStatus(id) {
    try {
        if(JSON.parse(getCookie("vr360_user_token")).token == null){
            $.alert("未登录或登录失效");
            getUserStatus();
            noticeLogin();
        }else{
            $.ajax({
                url:URL_TYPE.NONPUBLIC_PREFIX+"/readUserMessage",
                type:"post",
                headers:{
                    token:JSON.parse(getCookie("vr360_user_token")).token
                },
                data:{
                    id:id
                },
                async:false,
                success:function (res) {
                    // console.log(res);
                    if(res.code == 5){
                        $.alert("未登录或登录失效");
                        getUserStatus();
                        noticeLogin();
                    }
                },
                error:function (res) {
                    $.alert("更新消息失败"+res.status);
                }
            })
        }
    }catch (e) {
        console.error(e);
        noticeLogin();
    }
}

/**
 * 手机端菜单栏的显示和隐藏
 * */
function barShowAndHide() {
    if($('.navList-left').css("left")=="0px"){
        $('.navList-left').css("left","-135px");
    }else {
        $('.navList-left').css("left","0px");
    }
}
/**
 * 第三方登录
 * */
function loginByThird(request) {
    $.ajax({
        type:'post',
        url:URL_TYPE.PUB_PREFIX+"/loginByThird",
        data:{
            type:request.state,
            code:request.code
        },
        dataType:'JSON',
        success:function(res){
            // console.log(res);
            if(res.code!=0){
                $('#msgModal').text("登录失败");
                $('#msgModal').fadeIn();
                setTimeout(function () {
                    $('#msgModal').fadeOut();
                },2000);
                showLoginBox();
            }else{
                setCookie("vr360_user_token",JSON.stringify(res.data),"h1");
                hideLoginBox();
                location.href = location.href.split("?")[0];
            }
        },
        error:function(res){
            $('#msgModal').text("登录失败"+res.status);
            $('#msgModal').fadeIn();
            setTimeout(function () {
                $('#msgModal').fadeOut();
            },2000);
            showLoginBox();
        }
    })
}
/**
 * 获取地址参数
 * */
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
/**
 * 时间戳转日期
 * */
function fmtDate(obj){
    var date =  new Date(obj);
    var y = 1900+date.getYear();
    var m = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
}
/**
 * 过滤sql敏感符
 * */
function filterSqlStr(str) {
    var sqlList = ["-","+","*","#","&"];
    for (var sql in sqlList) {
        if(str.indexOf(sqlList[sql]) != -1){
            return false;
        }
    }
    return true;
}
console.log("欢迎使用VR 360全景\n小本网站还请大神勿黑，手下留情呀~~\n如有什么疑问请联系\nQQ：1246886075\nvr.beifengtz.com");