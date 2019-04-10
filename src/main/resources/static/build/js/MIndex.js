var renderStatus={
    examOne:false,
    examTwo:false
}
var URL_TYPE={
    API_VERSION:"/v1",
    NONPUBLIC_PREFIX:"/v1/nonpub",
    PUB_PREFIX:"/v1/pub"
}
var firstPhotoIsClose = false;
window.onload=function(){
    if(!Modernizr.canvas || !Modernizr.webgl || !Modernizr.eventlistener){
        alert("你的浏览器版本过低，请升级浏览器后浏览。");
    }
    if(!Modernizr.cssanimations || !Modernizr.fullscreen){
        console.log("系统提示：经检测您的浏览器版本较低，部分功能不完整，可能会影响您的浏览体验");
    }
    renderFirstPhoto();
    window.addEventListener("scroll",function(e){
    //     //变量t就是滚动条滚动时，到顶部的距离
        var t =document.documentElement.scrollTop||document.body.scrollTop;
        // console.log(t);
        if(t>=200){
            document.getElementsByClassName('yi-box')[0].style.display='block';
        }
        if(t>=500){
            document.getElementsByClassName('yi-box')[1].style.display='block';
        }
        if(t>=800){
            document.getElementsByClassName('yi-box')[2].style.display='block';
        }

        if(document.getElementsByClassName("thirdPage")[0].offsetTop-t < window.innerHeight-140){
            if(!renderStatus.examOne){
                renderExamOne();
                renderStatus.examOne=true;
            }
        }

        if(t>=1300){
            var E1=document.getElementsByClassName('title_3');
            var E2=document.getElementsByClassName('mini-photo-playground');
            E1[0].style.display='block';
            E1[1].style.display='block';
            E2[0].style.display='block';
        }
        if(document.getElementsByClassName("fourthPage")[0].offsetTop-t < window.innerHeight-140){
            if(!renderStatus.examTwo){
                renderExamTwo();
                renderStatus.examTwo=true;
            }
        }
        if(t>=2100){
            var E=document.getElementsByClassName('blockList');
            E[0].style.display='block';
            E[1].style.display='block';
        }
        if(t>=2900){
            var E = document.getElementsByClassName('fifthPage-description');
            E[0].style.display='block';
        }
    });
    var clientQQ = document.getElementById('clientQQ');
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        clientQQ.href = "mqqwpa://im/chat?chat_type=wpa&uin=1246886075&version=1&src_type=web&web_src=oicqzone.com";
    } else {
        clientQQ.href = "tencent://message/?uin=1246886075&Site=http://vps.shuidazhe.com&Menu=yes";
    }
    addVisitLog();
}
/**
 * 菜单切换
 * */
function targetMenu() {
    var menu = document.getElementsByClassName("nav-list")[0];
    if (menu.offsetHeight==0){
        document.getElementsByClassName("nav-list")[0].style.height = menu.children.length * 40 +"px";
    }else{
        document.getElementsByClassName("nav-list")[0].style.height = "0px";
    }
}
/**
 * 访客信息
 * 原生ajax
 * */
function addVisitLog() {
    getIpAddress();
    var xmlhttp=new XMLHttpRequest();
    var page = location.pathname;
    xmlhttp.open("get",URL_TYPE.PUB_PREFIX+"/visitLog?page="+page+"&ip="+ip,true);
    xmlhttp.send();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            // console.log(xmlhttp.responseText);
        }else{
            // console.log(xmlhttp.status);
        }
    }
}
var PSV;
function renderFirstPhoto(){
    var div_index = document.getElementById('PSV_show');
    // var Height = window.innerHeight;
    PSV= new PhotoSphereViewer({
        panorama:'images/demo/demo2.jpg',
        default_fov:179,//初始视野，1-179
        container:div_index,
        time_anim:false,
        anim_speed:'0.6rpm',
        navbar: [
            'gyroscope'
        ],
        loading_img:"../images/source/loading.gif",
        default_long:Math.PI/2,
        default_lat:-Math.PI/2,
        fisheye:2,
        usexmpdata:false,
        size:{
            width:"100%",
            height:"600px"
        },
        min_fov:30,//最小视野
        max_fov:80,//最大视野
        gyroscope:true,
        transition: {
            duration: 1500, // duration of transition in milliseconds
            loader: true // should display the loader ?
        },
        latitude_range:0
    });
    PSV.on('panorama-loaded',function(){
        var load=document.getElementById('loading');
        load.style.display='none';
        PSV.animate({
            longitude:Math.PI*1.3,
            latitude:0
        },2000)
        setTimeout(function () {
            var describ = document.getElementsByClassName('firstPageDescrp');
            describ[0].style.color='white';
            describ[0].style.display='block';
        },2000);
        setTimeout(function () {
            targetGyroscope();
        },4000);
    });
}
function renderExamOne(){
    var div_demo_one = document.getElementById('demoContainerOne');
    var PSV_demo_one = new PhotoSphereViewer({
        panorama:'images/demo/sola-demo.jpg',
        default_fov:179,//初始视野，1-179
        container:div_demo_one,
        time_anim:1000,
        anim_speed:'0.6rpm',
        navbar: false,
        usexmpdata:false,
        size:{
            width:"254px",
            height:'340px'
        },
        gyroscope:true
    });
    PSV_demo_one.on('panorama-loaded',function(){
        // $('.psv-gyroscope-button').click();
    });
}
function renderExamTwo(){
    var div_demo_two = document.getElementById('demoContainerTwo');
    var PSV_demo_two = new PhotoSphereViewer({
        panorama:{
            left:   'images/demo/number/5.png',
            front:  'images/demo/number/1.png',
            right:  'images/demo/number/6.png',
            back:   'images/demo/number/2.png',
            top:    'images/demo/number/3.png',
            bottom: 'images/demo/number/4.png'
        },
        default_fov:179,//初始视野，1-179
        container:div_demo_two,
        time_anim:1000,
        anim_speed:'0.6rpm',
        navbar: false,
        usexmpdata:false,
        size:{
            width:"350px",
            height:'350px'
        },
        gyroscope:true
    });
    PSV_demo_two.on('panorama-loaded',function(){

    });
}
/**
 * 切换陀螺仪
 * */
function targetGyroscope(){
    var gyroscope_button= document.querySelector('.psv-gyroscope-button');
    var ev = new MouseEvent('click',{
        cancelable: true,
        bubble: true,
        view: window
    });
    gyroscope_button.dispatchEvent(ev);
}
console.log("欢迎使用VR 360全景\n小本网站还请大神勿黑，手下留情呀~~\n如有什么疑问请联系\nQQ：1246886075\nvr.beifengtz.com");