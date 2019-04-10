var PSV;
var PSV_Fish;
var photoUrl = "http://vr.beifengtz.com/images/demo/demo1.jpg";
var heartNum=124;
var isGyroscopeEnabled = true;
var tempStyle=1;
var PSV_CONFIG = {
    panorama:"../images/demo/demo1.jpg",
    latitude_range:[Math.PI],
    type:"sola"
};
var OSS_URL="https://vr360-beifengtz.oss-cn-beijing.aliyuncs.com/";
var PHOTO_TYPE={
    SINGLE_PHOTO:'single',
    FRONT_PHOTO:'front',
    BACK_PHOTO:'back',
    LEFT_PHOTO:'left',
    RIGHT_PHOTO:'right',
    TOP_PHOTO:'top',
    BOTTOM_PHOTO:'bottom',
    SOLA_PHOTO:'sola',
    COMBINATION_PHOTO:'combination'
};
var URL_TYPE={
    API_VERSION:"/v1",
    NONPUBLIC_PREFIX:"/v1/nonpub",
    PUB_PREFIX:"/v1/pub"
}
var fishEye = 1;
var btnHide = false;
$(document).ready(function () {
    var vrPhotoId = GetRequest().id;
    if(vrPhotoId==null){
        $.confirm({
            title:"VR 360提示您",
            content: '资源不存在，即将展示demo示例',
            type: 'green',
            animation: 'RotateX',
            buttons: {
                ok: {
                    text: '确认',
                    btnClass: 'btn-primary',
                    action: function() {
                        renderPhoto(false,80);
                    }
                }
            }
        });
    }else{
        getPhotoInfo(vrPhotoId);
    }
    $('#heartNum').text(heartNum);
})
$(function () {
    $('#heart').click(function () {
        $('#heart').css("animation","heartAnim 1.5s linear");
        $('#heart').css("-webkit-animation","heartAnim 1.5s linear");
        $('#heart').css("-o-animation","heartAnim 1.5s linear");
        $('#heart').css("color","red");
        var heartIdList = getCookie("vr360_heartId_list");
        if(heartIdList == null){
            $('#heartNum').text(heartNum+1);
            addHeart();
        }else{
            // 未点赞
            var flag = false;
            for(var i=0;i<heartIdList.split("-").length;i++){
                if(GetRequest().id == heartIdList.split("-")[i]){
                    // 已经点赞过
                    flag = true;
                    break;
                }
            }
            if(!flag){
                $('#heartNum').text(heartNum+1);
                addHeart();
            }
        }
    });

    $('#share').click(function () {
        $('#bg-mask').css("display","block");
        $('.shareBox').css("bottom","0");
        $('#shareBtnList').html("<li><a href=\"javascript:vrShare('qq')\"><img src=\"../images/logo/qq.png\" alt=\"\"></a><br>QQ</li>\n" +
            "        <li><a href=\"javascript:vrShare('qzone')\"><img src=\"../images/logo/qzone.png\" alt=\"\"></a><br>QQ空间</li>\n" +
            "        <li><a href=\"javascript:vrShare('weibo')\"><img src=\"../images/logo/weibo.png\" alt=\"\"></a><br>微博</li>\n" +
            "        <li><a href=\"javascript:vrShare('qrcode')\"><img src=\"../images/logo/share/qrcode_share.jpg\" alt=\"\"></a><br>二维码</li>\n");
        $('.qrcode-container').click(function () {
            $('.qrcode-container').fadeOut();
            $('.shareBox').css("bottom","-125px");
            $('#bg-mask').css("display","none");
        });
        $('#bg-mask').click(function () {
            $('.qrcode-container').fadeOut();
            $('.shareBox').css("bottom","-125px");
            $('#bg-mask').css("display","none");
        });
        $('#qrCodeIco').click(function () {
            $('.qrcode-container').fadeOut();
            $('.shareBox').css("bottom","-125px");
            $('#bg-mask').css("display","none");
        });
    })
    addVisitLog();
    $("#PSV-Container").click(function () {
        if(btnHide){
            $(".psv-btn,.logo,.bottom-nav-bar,.nav-container").fadeIn();
            btnHide = false;
        }else{
            $(".psv-btn,.logo,.bottom-nav-bar,.nav-container").fadeOut();
            btnHide = true;
        }
    })
})


/**
 * 点赞
 * */
function addHeart() {
    var token = "null";
    try {
        token = JSON.parse(getCookie("vr360_user_token")).token;
        if(token==null){
            token = "null";
        }
    }catch (e) {
        // console.error(e);
    }
    $.ajax({
        url:URL_TYPE.PUB_PREFIX+"/addHeart",
        type:"post",
        data:{
            id:parseInt(GetRequest().id),
            timestamp:new Date().getTime(),
            token:token
        },
        dataType:"json",
        success:function (res) {
            if(res.code == 0){
                var oldList = getCookie("vr360_heartId_list");
                if(oldList!=null){
                    for(var i=0;i<oldList.split("-").length;i++){
                        if(oldList.split("-")[i] != GetRequest().id){
                            oldList = oldList+"-"+GetRequest().id;
                            setCookie("vr360_heartId_list",oldList,"h1");
                            break;
                        }
                    }
                }else{
                    setCookie("vr360_heartId_list",GetRequest().id,"h1");
                }
            }
            // console.log(res);
        },error:function (res) {
            console.log(res);
        }
    })

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
 * 图片分享
 * */
function vrShare(type) {
    var url = location.href;
    var str_after = location.href.split(".html")[1];
    // console.log(str_after);
    var desc = $('#vrPhotoDes').text();
    var title = "我用VR360制作了个超美的360全景图，快来看看吧";
    var summary = "随心创作，随处分享。VR 360专为全景爱好者打造的易上手、易制作、易分享的全景共享平台...";
    var weiboKey = 2791069346;
    switch (type){
        case 'qq':
            window.open("http://connect.qq.com/widget/shareqq/index.html?url="+url+"&title="+title+"&desc="+desc+"&pics="+photoUrl+"&site=VR360&summary="+summary);
            break;
        case 'qzone':
            window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+encodeURIComponent(url)+"&title="+title+"&desc="+desc+"&summary="+summary+"&site=VR360&pics="+photoUrl);
            break;
        case 'weibo':
            window.open("http://service.weibo.com/share/mobile.php?url="+url+"&title="+desc+"&pic="+photoUrl+"&appkey="+weiboKey);
            break;
        case 'qrcode':
            $('.qrcode-container').css('opacity','1');
            $('.qrcode-container').fadeIn();
            $('#qrcode').empty();
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                text: url,
                width: 256,
                height: 256,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            $('#qrcode').append("<img id=\"qrCodeIco\" src=\"../images/logo/logo.png\" />");
            break;
    }
}

/**
 * 获取图片信息
 * */
function getPhotoInfo(vrPhotoId) {
    var tokenObject = JSON.parse(getCookie("vr360_user_token"));
    var token=0;
    if(tokenObject==null){
        token=0;
    }else{
        token=tokenObject.token;
    }
    $.ajax({
        url:URL_TYPE.PUB_PREFIX+"/getVrPhotoInfo",
        type:'get',
        headers:{
            token: token
        },
        data:{
            vrPhotoId:vrPhotoId
        },
        dataType:"json",
        success:function (res) {
            // console.log(res)
            if(res.code==0){
                var heartIdList = getCookie("vr360_heartId_list");
                if(heartIdList!=null){
                    for(var i in heartIdList.split("-")){
                        if(res.data.id == heartIdList.split("-")[i]){
                            $('#heart').css("color","red");
                            break;
                        }
                    }
                }

                $('#userHead').click(function () {
                    location.href="people.html?uid="+res.data.userAuth;
                })
                if(res.data.author.headerImg != 0){
                    $('#userHead').attr('src',res.data.author.headerImg);
                }
                heartNum=res.data.heart;
                $('#heartNum').text(heartNum);
                $('#username').text(res.data.author.username);
                $('#vrPhotoDes').text(res.data.des);
                PSV_CONFIG.type=res.data.type;
                photoUrl = OSS_URL.concat(res.data.photoOne.key);
                if(res.data.type==PHOTO_TYPE.SOLA_PHOTO){
                    PSV_CONFIG.panorama=OSS_URL.concat(res.data.photoOne.key);
                    if(res.data.content.photoDeg==720){
                        PSV_CONFIG.latitude_range=[Math.PI]
                    }else{
                        PSV_CONFIG.latitude_range=[0,0]
                    }
                    renderPhoto(false,80);
                }else{
                    PSV_CONFIG.panorama=getPhotoUrls(res.data);
                    if(res.data.content.photoDeg==720){
                        PSV_CONFIG.latitude_range=[Math.PI]
                    }else{
                        PSV_CONFIG.latitude_range=[0,0]
                    }
                    renderPhoto(false,80);
                }
            }else if(res.code==10){
                $.confirm({
                    title:"VR 360提示您",
                    content: '资源不存在，即将展示demo示例',
                    type: 'green',
                    animation: 'RotateX',
                    buttons: {
                        ok: {
                            text: '确认',
                            btnClass: 'btn-primary',
                            action: function() {
                                renderPhoto(false,80);
                            }
                        }
                    }
                });
            }
        },
        error:function (res) {
            console.log(res);
            $.confirm({
                title:"VR 360提示您",
                content: '资源不存在，即将展示demo示例',
                type: 'green',
                animation: 'RotateX',
                buttons: {
                    ok: {
                        text: '确认',
                        btnClass: 'btn-primary',
                        action: function() {
                            renderPhoto(false,80);
                        }
                    }
                }
            });
        }
    })
}
/**
 * 获取图片地址及类型
 * */
function getPhotoUrls(data){
    var res ={
        front:'',
        back:'',
        left:'',
        right:'',
        top:'',
        bottom:''
    }
    switch (data.photoOne.type){
        case 'front':
            res.front=OSS_URL.concat(data.photoOne.key);
            break;
        case 'back':
            res.back=OSS_URL.concat(data.photoOne.key);
            break;
        case 'left':
            res.left=OSS_URL.concat(data.photoOne.key);
            break;
        case 'right':
            res.right=OSS_URL.concat(data.photoOne.key);
            break;
        case 'top':
            res.top=OSS_URL.concat(data.photoOne.key);
            break;
        case 'bottom':
            res.bottom=OSS_URL.concat(data.photoOne.key);
            break;
    }
    switch (data.photoTwo.type){
        case 'front':
            res.front=OSS_URL.concat(data.photoTwo.key);
            break;
        case 'back':
            res.back=OSS_URL.concat(data.photoTwo.key);
            break;
        case 'left':
            res.left=OSS_URL.concat(data.photoTwo.key);
            break;
        case 'right':
            res.right=OSS_URL.concat(data.photoTwo.key);
            break;
        case 'top':
            res.top=OSS_URL.concat(data.photoTwo.key);
            break;
        case 'bottom':
            res.bottom=OSS_URL.concat(data.photoTwo.key);
            break;
    }
    switch (data.photoThree.type){
        case 'front':
            res.front=OSS_URL.concat(data.photoThree.key);
            break;
        case 'back':
            res.back=OSS_URL.concat(data.photoThree.key);
            break;
        case 'left':
            res.left=OSS_URL.concat(data.photoThree.key);
            break;
        case 'right':
            res.right=OSS_URL.concat(data.photoThree.key);
            break;
        case 'top':
            res.top=OSS_URL.concat(data.photoThree.key);
            break;
        case 'bottom':
            res.bottom=OSS_URL.concat(data.photoThree.key);
            break;
    }
    switch (data.photoFour.type){
        case 'front':
            res.front=OSS_URL.concat(data.photoFour.key);
            break;
        case 'back':
            res.back=OSS_URL.concat(data.photoFour.key);
            break;
        case 'left':
            res.left=OSS_URL.concat(data.photoFour.key);
            break;
        case 'right':
            res.right=OSS_URL.concat(data.photoFour.key);
            break;
        case 'top':
            res.top=OSS_URL.concat(data.photoFour.key);
            break;
        case 'bottom':
            res.bottom=OSS_URL.concat(data.photoFour.key);
            break;
    }
    switch (data.photoFive.type){
        case 'front':
            res.front=OSS_URL.concat(data.photoFive.key);
            break;
        case 'back':
            res.back=OSS_URL.concat(data.photoFive.key);
            break;
        case 'left':
            res.left=OSS_URL.concat(data.photoFive.key);
            break;
        case 'right':
            res.right=OSS_URL.concat(data.photoFive.key);
            break;
        case 'top':
            res.top=OSS_URL.concat(data.photoFive.key);
            break;
        case 'bottom':
            res.bottom=OSS_URL.concat(data.photoFive.key);
            break;
    }
    switch (data.photoSix.type){
        case 'front':
            res.front=OSS_URL.concat(data.photoSix.key);
            break;
        case 'back':
            res.back=OSS_URL.concat(data.photoSix.key);
            break;
        case 'left':
            res.left=OSS_URL.concat(data.photoSix.key);
            break;
        case 'right':
            res.right=OSS_URL.concat(data.photoSix.key);
            break;
        case 'top':
            res.top=OSS_URL.concat(data.photoSix.key);
            break;
        case 'bottom':
            res.bottom=OSS_URL.concat(data.photoSix.key);
            break;
    }
    return res;
}

/**
 * 渲染图片
 * */
function renderPhoto(fisheye,maxFov){
    var div_index = document.getElementById('PSV-Container');
    var Height = window.screen.height;
    PSV = new PhotoSphereViewer({
        panorama:PSV_CONFIG.panorama,
        // panorama:{
        //     left:   '../images/demo/tree/px.jpg',
        //     front:  '../images/demo/tree/nz.jpg',
        //     right:  '../images/demo/tree/nx.jpg',
        //     back:   '../images/demo/tree/pz.jpg',
        //     top:    '../images/demo/tree/py.jpg',
        //     bottom: '../images/demo/tree/ny.jpg'
        // },
        default_fov:179,//初始视野，1-179
        container:div_index,
        time_anim:false,
        anim_speed:'0.6rpm',
        navbar: [
            'gyroscope'
        ],
        loading_img:"../images/source/loading.gif",
        default_long:-Math.PI/2,
        default_lat:-Math.PI/2,
        fisheye:fisheye,
        usexmpdata:false,
        size:{
            width:"100%",
            height:"100%"
        },
        min_fov:30,//最小视野
        max_fov:150,//最大视野
        default_fov:maxFov, //初始视野
        gyroscope:true,
        sphere_correction:{
            pan:2*Math.PI,
            tilt:2 * Math.PI,
            roll: 2*Math.PI
        },
        transition: {
            duration: 1500, // duration of transition in milliseconds
            loader: true // should display the loader ?
        },
        latitude_range:PSV_CONFIG.latitude_range
    });
    PSV.on('panorama-loaded',function(){
        PSV.animate({
            longitude:Math.PI/2,
            latitude:0
        },2000);
    });
    return PSV;
}
/**
 * 切换开启陀螺仪
 * */
function targetGyroscope() {
    var btn = document.getElementsByClassName("gyroscope-btn")[0];
    var gyroscope_button= document.querySelector('.psv-gyroscope-button');
    var ev = new MouseEvent('click',{
        cancelable: true,
        bubble: true,
        view: window
    });
    gyroscope_button.dispatchEvent(ev);
    if(isGyroscopeEnabled){
        btn.style.transform="rotateZ(90deg)";
        btn.style.color="#2c365d";
        isGyroscopeEnabled=false;
    }else{
        btn.style.transform="rotateZ(0deg)";
        btn.style.color="white";
        isGyroscopeEnabled=true;
    }
}
/**
 * 切换样式
 * 普通、鱼眼、球形、小行星
 * */
function targetStyle(){
    // PSV.destroy();
    $("#PSV-Container").empty();
    var btn = document.getElementsByClassName("gyroscope-btn")[0];
    btn.style.transform="rotateZ(0deg)";
    btn.style.color="white";
    if(PSV_CONFIG.type==PHOTO_TYPE.SOLA_PHOTO){
        var E = document.getElementsByClassName("panorama-type-btn")[0];
        var text = E.textContent;
        if(tempStyle == 1){
            renderPhoto(2,80);

            // PSV.config.fisheye = 2;
            // PSV.load();

            E.textContent = "鱼眼";
            tempStyle = 2;
        }else if(tempStyle == 2){
            renderPhoto(5,80);

            // PSV.config.fisheye = 3.5;
            // PSV.load();

            E.textContent = "球形";
            tempStyle = 3
        }else if(tempStyle == 3){
            renderPhoto(2,145);

            // PSV.config.fisheye = 1;
            // PSV.config.default_fov = 150;
            // PSV.load();

            E.textContent = "小行星";
            tempStyle = 4;
        }else if(tempStyle == 4){
            renderPhoto(1,80);

            // PSV.config.fisheye = 0;
            // PSV.load();

            E.textContent = "普通";
            tempStyle = 1;
        }
    }else{
        $.alert("该全景类型为组合图，只支持普通模式");
    }

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