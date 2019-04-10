var URL_TYPE={
    API_VERSION:"/v1",
    NONPUBLIC_PREFIX:"/v1/nonpub",
    PUB_PREFIX:"/v1/pub"
}
var cookie = new cookiesUtil();
$(function () {
    $("input").keydown(function (e) {
        if(e.keyCode == 13){
            adminLogin();
        }
    })
})
function adminLogin() {
    var username = $('#username').val();
    var password = $('#password').val();
    var md5 = new md5Util();
    if(username == "" || username == null || username=="Username"){
        $('#msgModal').text("请输入用户名");
        $('#msgModal').fadeIn();
        setTimeout(function () {
            $('#msgModal').fadeOut();
        },2000);
    } else if(password.length<10){
        $('#msgModal').text("请输入不小于10位的密码");
        $('#msgModal').fadeIn();
        setTimeout(function () {
            $('#msgModal').fadeOut();
        },2000);
    }else if(filterSqlStr(username)){
        $('#msgModal').text("请不要输入敏感字符");
        $('#msgModal').fadeIn();
        setTimeout(function () {
            $('#msgModal').fadeOut();
        },2000);
    }else{
        $.ajax({
            type:'post',
            url:URL_TYPE.PUB_PREFIX+"/admin/login",
            data:{
                adminid:username,
                password:md5.hex_md5(md5.hex_md5(password))
            },
            dataType:'json',
            success:function (res) {
                console.log(res);
                if(res.code==0){
                    cookie.setCookie("vr360_admin_token",res.data,"h1");
                    location.href = "index.html";
                }else if(res.code==2){
                    $('#msgModal').text("用户名或密码错误");
                    $('#msgModal').fadeIn();
                    setTimeout(function () {
                        $('#msgModal').fadeOut();
                    },2000);
                }else{
                    $('#msgModal').text(res.msg);
                    $('#msgModal').fadeIn();
                    setTimeout(function () {
                        $('#msgModal').fadeOut();
                    },2000);
                }
            },
            error:function (res) {
                $('#msgModal').text("登录失败, code:"+res.status);
                $('#msgModal').fadeIn();
                setTimeout(function () {
                    $('#msgModal').fadeOut();
                },2000);
            }
        })
    }
}
<!-- 过滤一些敏感字符函数 -->
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
console.log("欢迎使用VR 360全景\n小本网站还请大神勿黑，手下留情呀~~\n如有什么疑问请联系\nQQ：1246886075\nvr.beifengtz.com");