var renderStatus={
    examOne:false,
    examTwo:false
}
var URL_TYPE={
    API_VERSION:"/v1",
    NONPUBLIC_PREFIX:"/v1/nonpub",
    PUB_PREFIX:"/v1/pub"
}
window.onload=function(){
    if(!Modernizr.canvas || !Modernizr.webgl || !Modernizr.eventlistener){
        alert("你的浏览器版本过低，请升级浏览器后浏览。");
    }
    if(!Modernizr.cssanimations || !Modernizr.fullscreen){
        console.log("系统提示：经检测您的浏览器版本较低，部分功能不完整，可能会影响您的浏览体验");
    }
    // console.log(Modernizr.cssanimations);
    init();
    window.addEventListener("scroll",function(e){
        //变量t就是滚动条滚动时，到顶部的距离
        var t =document.documentElement.scrollTop||document.body.scrollTop;
        // console.log(t);
        // console.log(t-document.getElementsByClassName("main-page4")[0].offsetTop);
        // console.log(window.innerHeight-500);
        if(document.getElementsByClassName("main-page4")[0].offsetTop-t < window.innerHeight-300){
            var descr4=document.getElementsByClassName('page4-des');
            descr4[0].style.display='block';
            descr4[1].style.opacity='1';
            if(!renderStatus.examOne){
                renderExamOne();
                renderStatus.examOne=true;
            }
        }
        if(document.getElementsByClassName("main-page5")[0].offsetTop-t < window.innerHeight-300){
            if(!renderStatus.examTwo){
                renderExamTwo();
                renderStatus.examTwo=true;
            }
        }
        if(document.getElementsByClassName("fifthPage")[0].offsetTop-t < window.innerHeight-300){
            document.getElementsByClassName('fifthPage-description')[0].style.display='block';
            document.getElementsByClassName("fifthPage-panorama")[0].style.display="block";
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
 * 访客信息
 * 原生ajax
 * */
function addVisitLog() {
    getIpAddress();
    var xmlhttp=new XMLHttpRequest();
    var page = location.pathname;
    xmlhttp.open("get",URL_TYPE.PUB_PREFIX+"/visitLog?page="+page+"&ip="+ip,true);
    xmlhttp.send();
    // console.log(xmlhttp.responseText);
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
function init(){
    var div_index = document.getElementById('PSV-show');
        var PSV = new PhotoSphereViewer({
            panorama:{
                left:   'images/demo/tree/px.jpg',
                front:  'images/demo/tree/nz.jpg',
                right:  'images/demo/tree/nx.jpg',
                back:   'images/demo/tree/pz.jpg',
                top:    'images/demo/tree/py.jpg',
                bottom: 'images/demo/tree/ny.jpg'
            },
            default_fov:179,//初始视野，1-179
            container:div_index,
            time_anim:1000,
            anim_speed:'0.6rpm',
            navbar: false,
            usexmpdata:false,
            size:{
                width:"100%",
                height:'500px'
            },
            min_fov:30,//最小视野
            max_fov:80//最大视野
            // tilt_down_max:Math.PI / 7,
            // tilt_up_max:Math.PI / 7
        });
        // console.log(PSV.config);
        PSV.on('panorama-loaded',function(){
            var load=document.getElementById('loading');
            load.style.display='none';
            var descr=document.getElementsByClassName('main-page1');
            descr[0].style.display='block';

            var descr2=document.getElementsByClassName('yi-descr');
            descr2[0].style.display='block';
            descr2[1].style.display='block';
            descr2[2].style.display='block';
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
                width:"258px",
                height:'337px'
            },
            gyroscope:true
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
                width:"400px",
                height:'400px'
            },
            gyroscope:true
        });
}
console.log("欢迎使用VR 360全景\n小本网站还请大神勿黑，手下留情呀~~\n如有什么疑问请联系\nQQ：1246886075\nvr.beifengtz.com");