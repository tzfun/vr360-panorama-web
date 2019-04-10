var paperStyleList = [
    {
        background:"#f07810",
        font:"white"
    },
    {
        background:"#a696c8",
        font:"#fad3cf"
    },
    {
        background:"#ea8a8a",
        font:"#5f1854"
    },
    {
        background:"#e58cdb",
        font:"#f2f2f2"
    },{
        background:"#d5eeff",
        font:"#13334c"
    },{
        background:"#ffff8f",
        font:"#13334c"
    },{
        background:"#f7f9ff",
        font:"#13334c"
    },{
        background:"#ff5c00",
        font:"#ededed"
    }
];
var thumbtackStyleList = [
    {
        src:"thumbtack1.png",
        width: "80px",
        top: "-29px",
        left: "-18px"
    },{
        src:"thumbtack2.png",
        width: "41px",
        top: "-20px",
        left: "3px"
    },{
        src:"thumbtack3.png",
        width: "33px",
        top: "-16px",
        left: "4px"
    }
];
var URL_TYPE={
    API_VERSION:"/v1",
    NONPUBLIC_PREFIX:"/v1/nonpub",
    PUB_PREFIX:"/v1/pub"
};
window.onload = function (ev) {
    addVisitLog();
    showMessageBoard();
    document.getElementById("sendMessage").addEventListener("keydown",function (ev1) {
        if(ev1.keyCode == 13){
            insertPaper();
        }
    });
}
/**
 * 显示保存的数据信息
 * */
function showMessageBoard() {
    var containerWidth = document.getElementsByClassName("container")[0].offsetWidth;
    var containerHeight = document.getElementsByClassName("container")[0].offsetHeight;
    $.ajax({
        url:URL_TYPE.PUB_PREFIX+"/getMessageBoard",
        type:"get",
        dataType:"json",
        async:false,
        success:function (res) {
            // console.log(res);
            if(res.code == 0){
                for(var i = 0;i<res.data.messageNum;i++){
                    new paper(Math.random()*(containerWidth-200),Math.random()*(containerHeight-220),
                        thumbtackStyleList[Math.floor(Math.random()*thumbtackStyleList.length)],
                        paperStyleList[Math.floor(Math.random()*paperStyleList.length)],
                        res.data.messageList[i].content,timeTurn(parseInt(res.data.messageList[i].date)));

                }
            }else{
                alert("系统出错啦，获取留言失败");
            }
        }
    })
}
/**
 * 上传留言
 * */
function uploadMessageBoard(content,date) {
    var sendTime = timeTurn(Math.ceil(date.getTime()/1000));
    var containerWidth = document.getElementsByClassName("container")[0].offsetWidth;
    var containerHeight = document.getElementsByClassName("container")[0].offsetHeight;
    $.ajax({
        url:URL_TYPE.NONPUBLIC_PREFIX+"/setMessageBoard",
        type:"post",
        headers:{
            token:getCookie("vr360_message_auth")
        },
        data:{
            content:content,
            date:Math.ceil(date.getTime()/1000)
        },
        dataType:"json",
        // async:false,
        success:function (res) {
            // console.log(res);
            if(res.code == 0){
                new paper(Math.random()*(containerWidth-200),Math.random()*(containerHeight-220),
                    thumbtackStyleList[Math.floor(Math.random()*thumbtackStyleList.length)],
                    paperStyleList[Math.floor(Math.random()*paperStyleList.length)],content,sendTime);
            }else if(res.code == -1){
                alert("系统出错啦，上传留言失败");
            }
        }
    })
}
/**
 * 隐藏恭喜显示框
 * */
function hideCongratulation(){
    $(".congratulation").hide();
}
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
        },
        error:function (res) {
            console.log(res.status);
        }
    })
}
/**
 * 贴入标签
 * */
function insertPaper() {
    var date = new Date();
    // var sendTime = timeTurn(Math.ceil(date.getTime()/1000));
    var inputText = document.getElementById("sendMessage").value;
    // var containerWidth = document.getElementsByClassName("container")[0].offsetWidth;
    // var containerHeight = document.getElementsByClassName("container")[0].offsetHeight;
    if(inputText.trim() == ""){
    }else if(!filterSqlStr(inputText.trim())){
        alert("请不要输入铭感字符！！！");
    }else{
        uploadMessageBoard(inputText.trim(),date);
    }
    document.getElementById("sendMessage").value = "";
    barBuffer();

}
/**
 * 进度条缓冲效果
 * */
function barBuffer(){
    $("#sendMessage").attr("disabled",true);
    $(".waitBar").css({
        opacity:1,
        width:"440px"
    });
    setTimeout(function () {
        $(".waitBar").css({
            transition:"opacity linear 1s",
            opacity:0
        });
        $(".waitBar").animate({
            width:0
        });
        $("#sendMessage").attr("disabled",false);
    },5000);
    $(".waitBar").css("transition","width linear 5s, opacity linear 1s");
}
/**
 * paper对象
 * */
function paper(x, y, thumbtackStyle, paperStyle, text, date) {
    this.x = x;
    this.y = y;
    this.thumbtackStyle = thumbtackStyle;
    this.paperStyle = paperStyle;
    this.text = text;
    this.date = date;
    this.create = function () {
        if(filterSqlStr(text)){
            var tempPaper = document.createElement("div");
            tempPaper.setAttribute("class","message");
            tempPaper.innerHTML = "<img src=\"../images/source/"+this.thumbtackStyle.src+"\" class=\"thumbtack\" " +
                "style='width:"+this.thumbtackStyle.width+";top:"+this.thumbtackStyle.top+";left:"+this.thumbtackStyle.left+"'> " +
                "            <div class='message-content'>"+this.text+"</div>\n" +
                "            <div class=\"sendTime\"><i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>"+this.date+"</div>";
            tempPaper.style.left = this.x + "px";
            tempPaper.style.top = this.y + "px";
            tempPaper.style.backgroundColor = this.paperStyle.background;
            tempPaper.style.color = this.paperStyle.font;
            document.getElementsByClassName("container")[0].appendChild(tempPaper);
        }
    }
    this.create();
}
/**
 * 隐藏提示框
 * */
function hideNotice() {
    $(".notice").animate({
        left:"-100%"
    });
}
/**
 * 检查是否含有非法字符
 */
function filterSqlStr (value){
    var sqlStr = "/,',#,@,*,-,|,<,>,script,div";
    var flag = true;
    for(var i=0;i<sqlStr.split(",").length;i++){
        if(value.toLowerCase().indexOf(sqlStr.split(",")[i])!=-1){
            flag = false;
            break;
        }
    }
    return flag;
}
/**
 *  时间转换，精确到秒
 * */
function timeTurn(timestamp){
    var nowTimestamp = Math.ceil((new Date().getTime())/1000);
    var diff = nowTimestamp - timestamp;
    if(diff >= 0 && diff <= 60){
        return "刚刚";
    }else if(diff >60 && diff <3600){
        return Math.floor(diff/60)+"分钟前";
    }else if(diff>=3600 && diff <86400){
        return Math.floor(diff/3600)+"小时前";
    }else if(diff >=86400 && diff <2592000){
        return Math.floor(diff/86400)+"天前";
    }else if(diff >= 2592000 && diff<31104000){
        return Math.floor(diff/2592000)+"个月前";
    }else {
        var tempDate = new Date(timestamp*1000);
        return tempDate.getFullYear()+"年"+(tempDate.getMonth()+1)+"月"+tempDate.getDate()+"日";
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
console.log("欢迎使用VR 360全景\n小本网站还请大神勿黑，手下留情呀~~\n如有什么疑问请联系\nQQ：1246886075\nvr.beifengtz.com");