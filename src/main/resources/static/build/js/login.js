var action;
var URL_TYPE={
    API_VERSION:"/v1",
    NONPUBLIC_PREFIX:"/v1/nonpub",
    PUB_PREFIX:"/v1/pub"
}
var addressInfo={};
$(function () {

    if(!Modernizr.canvas || !Modernizr.webgl || !Modernizr.eventlistener){
        alert("经检测您的浏览器版本过低，请升级浏览器后浏览。");
    }
    if(!Modernizr.cssanimations || !Modernizr.fullscreen){
        console.log("系统提示：经检测您的浏览器版本较低，部分功能不完整，可能会影响您的浏览体验");
    }

    getUserStatus();

    $("#loginPhone,#loginPassword").keydown(function() {//给输入框绑定按键事件
        if(event.keyCode == "13") {//判断如果按下的是回车键则执行下面的代码
            login();
        }
    })
    addVisitLog();
})
/**
 * 访客信息
 *
 * */
function addVisitLog() {
    getIpAddress();
    var page = location.pathname;
    $.ajax({
        url:URL_TYPE.PUB_PREFIX+"/visitLog",
        type:"get",
        data:{
            page:page,
            ip:ip
        },
        dataType:"json",
        success:function (res) {
            // console.log(res);
            addressInfo = res.data;
            if(location.pathname.indexOf("statistics")!=-1){
                renderAddress();
            }
        },
        error:function (res) {
            console.log(res.status);
        }
    })
}
/**
 * 获取用户状态
 * */
function getUserStatus(){
    try {
        var userInfo = JSON.parse(getCookie('vr360_user_token'));
        if(userInfo==null){
            delCookie("vr360_user_token");
            $('#user_status').text("未登录");
            $('#user_action').html("<a href='javascript:showLoginBox();'>登录</a>");
        } else if(userInfo.token!="" && userInfo.token!=null){
            $('#user_status').text(userInfo.username);
            $('#user_action').html("<a href='javascript:logout();'>退出登录</a>")
        }else{
            delCookie("vr360_user_token");
            $('#user_status').text("未登录");
            $('#user_action').html("<a href='javascript:showLoginBox();'>登录</a>");
        }
    }catch (e) {
        delCookie("vr360_user_token");
        $('#user_status').text("未登录");
        $('#user_action').html("<a href='javascript:showLoginBox();'>登录</a>");
    }

}
/**
 * 显示登录框
 * */
function showLoginBox(){
    $('.login-container,#bg-mask').fadeIn(500);
}
/**
 * 隐藏登录框
 * */
function hideLoginBox(){
    $('.login-container,#bg-mask').fadeOut(500);
}
/**
 * 退出登录
 * */
function logout(){
    $.confirm({
        title: '确认',
        content: '确认退出登录?',
        type: 'green',
        icon: 'glyphicon glyphicon-question-sign',
        buttons: {
            ok: {
                text: '确认',
                btnClass: 'btn-primary',
                action: function() {
                    delCookie("vr360_user_token");
                    $('#user_status').text("未登录");
                    $('#user_action').html("<a href='javascript:showLoginBox();'>登录</a>");
                    if(location.href.indexOf("people.html") == -1){
                        location.href=location.href.split('?')[0];
                    }else{
                        location.href=location.href;
                    }
                }
            },
            cancel: {
                text: '取消',
                btnClass: 'btn-primary'
            }
        }
    });
}

/**
 * 去登录按钮
 * */
function goLogin(){
    $('#loginAndRegister').html("<div align=\"center\" >\n" +
        "                    <h2>欢迎登录VR360</h2>\n" +
        "                </div>\n" +
        "                <form>\n" +
        "                    <div class=\"form-group\">\n" +
        "                        <label for=\"loginPhone\">手机号</label>\n" +
        "                        <input type=\"number\" class=\"form-control\" id=\"loginPhone\" placeholder=\"输入你的手机号\">\n" +
        "                    </div>\n" +
        "                    <div class=\"form-group\">\n" +
        "                        <label for=\"loginPassword\">密码</label>\n" +
        "                        <input type=\"password\" class=\"form-control\" id=\"loginPassword\" placeholder=\"输入你的密码\">\n" +
        "                    </div>\n" +
        "                    <nav aria-label=\"...\">\n" +
        "                        <ul class=\"pager\" >\n" +
        "                            <li class=\"previous\"><a href=\"#\" style=\"color: #FA9856\">找回密码</a></li>\n" +
        "                            <li class=\"next\"><a href=\"javascript:goRegister();\" style=\"color: #FA9856\">去注册 </a></li>\n" +
        "                        </ul>\n" +
        "                    </nav>\n" +
        "                    <div align=\"center\">\n" +
        "                        <button type=\"submit\" class=\"btn btn-default\" style=\"width: 100%;background-color: #FA9856;color:white;\">登录</button>\n" +
        "                    </div>\n" +
        "                </form>");
}

/**
 * 去注册按钮
 * */
function goRegister(){
    $('#loginAndRegister').html("<div align=\"center\" >\n" +
        "                    <h2>欢迎注册VR360</h2>\n" +
        "                </div>\n" +
        "                <div class=\"form-group\">\n" +
        "                    <label for=\"loginPhone\">手机号</label>\n" +
        "                    <input type=\"number\" class=\"form-control\" id=\"registerPhone\" placeholder=\"输入你的手机号\">\n" +
        "                </div>\n" +
        "                <div class=\"form-group\">\n" +
        "                    <label for=\"loginPassword\">密码</label>\n" +
        "                    <input type=\"password\" class=\"form-control\" id=\"registerPassword\" placeholder=\"输入你的密码\">\n" +
        "                </div>\n" +
        "                <div class=\"form-group\">\n" +
        "                    <label for=\"loginPassword\">通信令牌</label><small>(获取手机验证码使用)</small>\n" +
        "                    <div class=\"col-xs-12 col-sm12 col-md-12\">\n" +
        "                        <div class=\"col-xs-6 col-sm6 col-md-6\" style=\"padding: 0\">\n" +
        "                            <input type=\"text\" id=\"code_input\" class=\"form-control\" placeholder=\"请输入验证码\"/>\n" +
        "                        </div>\n" +
        "                        <div class=\"col-xs-6 col-sm6 col-md-6\" id=\"v_container\" style=\"height: 30px;\"></div>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "                <div class=\"form-group\" style=\"margin-top: 45px;\">\n" +
        "                    <label for=\"loginPassword\">手机验证</label>\n" +
        "                    <div class=\"col-xs-12 col-sm12 col-md-12\" style=\"margin-top: 5px;\">\n" +
        "                        <div class=\"col-xs-6 col-sm6 col-md-6\" style=\"padding: 0\">\n" +
        "                            <input type=\"text\" id=\"phone_code_input\" class=\"form-control\" placeholder=\"请输入手机验证码\"/>\n" +
        "                        </div>\n" +
        "                        <div class=\"col-xs-6 col-sm6 col-md-6\">\n" +
        "                            <button type=\"submit\" class=\"btn btn-default\"  id=\"getPhoneCodeBtn\" onclick=\"getPhoneSMS()\">获取手机验证码&nbsp;<span id=\"daojishi\"></span></button>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "                <nav aria-label=\"...\">\n" +
        "                    <ul class=\"pager\" >\n" +
        "                        <li class=\"next\"><a href=\"javascript:goLogin();\" style=\"color: #FA9856\">去登录 </a></li>\n" +
        "                    </ul>\n" +
        "                </nav>\n" +
        "                <div align=\"center\">\n" +
        "                    <button class=\"btn btn-default\" style=\"width: 100%;background-color: #FA9856;color:white;\" onclick='register()' id=\"registerBtn\">注册</button>\n" +
        "                </div>");
    window.clearInterval(action);
    $('#daojishi').text("");
    getVerificationCode();
    $('#v_container').click(function () {
        $('#v_container').empty();
        getVerificationCode();
    })
}

/**
 * 获取验证码
 * */
function getVerificationCode() {
    $.ajax({
        type:"get",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url:URL_TYPE.PUB_PREFIX+"/getVerificationCode",
        dataType:"json",
        beforeSend:function () {

        },
        success:function (res) {
            // console.log(res);
            var aes = new aesUtil();
            var verifyCode = new GVerify("v_container",aes.decrypt(res.data));
        },
        error:function (res) {
            console.log(res);
        }
    })
}

/**
 * 点击获取手机验证码按钮，开始计时并请求发送SMS
 * */
function getPhoneSMS(){
    var code_input = $('#code_input').val();
    var phoneNumber = $('#registerPhone').val();
    if(phoneNumber=="" || phoneNumber.length!=11){
        $('#msgModal').text("请输入正确的手机号码");
        $('#msgModal').fadeIn();
        setTimeout(function () {
            $('#msgModal').fadeOut();
        },2000);
    }else if(code_input=="" || code_input == null || code_input.length<4){
        $('#msgModal').text("请输入规范的验证码");
        $('#msgModal').fadeIn();
        setTimeout(function () {
            $('#msgModal').fadeOut();
        },2000);
    }else{
        $('#getPhoneCodeBtn').attr("disabled","disabed");
        var nowNum=60;
        action=self.setInterval(function () {
            $('#daojishi').text(nowNum);
            nowNum--;
            if(nowNum==0){
                window.clearInterval(action);
                $('#daojishi').text("");
                $('#getPhoneCodeBtn').removeAttr("disabled");
            }
        },1000);
        $.ajax({
            type:"post",
            url:URL_TYPE.PUB_PREFIX+"/sendSMS",
            data:{
                phoneNumber:phoneNumber,
                verificationCode:code_input
            },
            dataType:"json",
            beforeSend:function () {

            },
            success:function (res) {
                // console.log(res);
                if(res.code==12){
                    $('#msgModal').text("验证码错误");
                    $('#msgModal').fadeIn();
                    setTimeout(function () {
                        $('#msgModal').fadeOut();
                    },2000);
                    window.clearInterval(action);
                    $('#daojishi').text("");
                    $('#getPhoneCodeBtn').removeAttr("disabled");
                }
            },
            error:function (res) {
                console.log(res);
            }
        })
    }
}
/**
 * 登录
 * */
function login(){
    var md5 = new md5Util();
    var phoneNumber=$('#loginPhone').val();
    var password = $('#loginPassword').val();
    if(phoneNumber.length!=11){
        $('#msgModal').text("请输入正确的手机号码");
        $('#msgModal').fadeIn();
        setTimeout(function () {
            $('#msgModal').fadeOut();
        },2000);
    }else if(password.length<6){
        $('#msgModal').text("请输入不低于6位的密码");
        $('#msgModal').fadeIn();
        setTimeout(function () {
            $('#msgModal').fadeOut();
        },2000);
    }else{
        $.ajax({
            type:'post',
            url:URL_TYPE.PUB_PREFIX+"/loginByPhone",
            data:{
                phoneNumber:phoneNumber,
                password:md5.hex_md5(md5.hex_md5(password))
            },
            dataType:'json',
            success:function (res) {
                // console.log(res);
                if(res.code!=0){
                    $('#msgModal').text("账号或密码错误");
                    $('#msgModal').fadeIn();
                    setTimeout(function () {
                        $('#msgModal').fadeOut();
                    },2000);
                }else{
                    setCookie("vr360_user_token",JSON.stringify(res.data),"h1");
                    getUserStatus();
                    hideLoginBox();
                    if(location.pathname.indexOf("personpage.html") !=-1){
                        location.href=location.href.split('?')[0];
                    }else{
                        location.href=location.href;
                    }

                }
            },
            error:function (res) {
                console.log(res);
                $('#msgModal').text("登录失败");
                $('#msgModal').fadeIn();
                setTimeout(function () {
                    $('#msgModal').fadeOut();
                },2000);
            }
        })
    }

}
/**
 *
 * 注册
 * */
function register(){
    var md5 = new md5Util();
    var registerPhone = $('#registerPhone').val();
    var registerPassword = $('#registerPassword').val();
    var phone_code_input = $('#phone_code_input').val();
    if(registerPhone=="" || registerPhone.length!=11){
        $('#msgModal').text("请输入规范的手机号码");
        $('#msgModal').fadeIn();
        setTimeout(function () {
            $('#msgModal').fadeOut();
        },2000);
    }else if(registerPassword=="" || registerPassword.length<6){
        $('#msgModal').text("请输入不小于6位的密码");
        $('#msgModal').fadeIn();
        setTimeout(function () {
            $('#msgModal').fadeOut();
        },2000);
    }else if(phone_code_input==""){
        $('#msgModal').text("请输入正确的手机验证码");
        $('#msgModal').fadeIn();
        setTimeout(function () {
            $('#msgModal').fadeOut();
        },2000);
    }else{
        $.ajax({
            type:"post",
            url:URL_TYPE.PUB_PREFIX+"/register",
            data:{
                authenticationType:3,
                authenticationId:registerPhone,
                autograph:md5.hex_md5(md5.hex_md5(registerPassword)),
                code:phone_code_input
            },
            dataType:"json",
            success:function (res) {
                // console.log(res);
                if(res.code==0){
                    setCookie("vr360_user_token",JSON.stringify(res.data),"h1");
                    getUserStatus();
                    hideLoginBox();
                }else{
                    $('#msgModal').text("注册失败");
                    $('#msgModal').fadeIn();
                    setTimeout(function () {
                        $('#msgModal').fadeOut();
                    },2000);
                }
            },
            error:function (res) {
                console.log(res);
                $('#msgModal').text("注册失败");
                $('#msgModal').fadeIn();
                setTimeout(function () {
                    $('#msgModal').fadeOut();
                },2000);
            }
        })
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