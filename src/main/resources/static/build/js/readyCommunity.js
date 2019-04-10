var URL_TYPE={
    API_VERSION:"/v1",
    NONPUBLIC_PREFIX:"/v1/nonpub",
    PUB_PREFIX:"/v1/pub"
}
var PAGING_DATA={
    recommend:{
        tempPage:1,
        pageCapacity:3,
        total:3
    },
    hot:{
        tempPage:1,
        pageCapacity:6,
        total:6
    },
    last:{
        tempPage:1,
        pageCapacity:6,
        total:6
    }
}

window.onload=function(){
    var clientQQ = document.getElementById('clientQQ');
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        clientQQ.href = "mqqwpa://im/chat?chat_type=wpa&uin=1246886075&version=1&src_type=web&web_src=oicqzone.com";
    } else {
        clientQQ.href = "tencent://message/?uin=1246886075&Site=http://vps.shuidazhe.com&Menu=yes";
    }
    renderRecommendPhoto();
    renderHotPhoto();
    renderLastPhoto();
    $(".wait-loading").fadeOut("slow");
}

/**
 * 请求并渲染推荐照片
 * */
function renderRecommendPhoto() {
    $.ajax({
        url:URL_TYPE.PUB_PREFIX+'/getRecommendVrPhoto',
        type:'get',
        data:{
            tempPage:PAGING_DATA.recommend.tempPage,
            pageCapacity:PAGING_DATA.recommend.pageCapacity
        },
        async:false,
        dataType:'json',
        success:function (res) {
            // console.log(res);
            if(res.code == 0){
                if(res.data.length>0){
                    $('#recommendPhotoContainer').empty();
                    PAGING_DATA.recommend.total = res.data[0].total;
                    for(var i = 0;i<res.data.length;i++){
                        var descr;
                        if(res.data[i].description.length >= 15){
                            descr= res.data[i].description.substring(0,15)+"...";
                        }else if(res.data[i].description.length == 0){
                            descr="......"
                        }else{
                            descr= res.data[i].description;
                        }
                        $('#recommendPhotoContainer').append("<div class=\"col-xs-12 col-sm-4 col-md-4\" style=\"padding: 5px;margin: 0;\">\n" +
                            "            <a href='panorama.html?id="+res.data[i].id+"' class=\"img-link\" style=\"background-image: url("+res.data[i].url+")\"></a>\n" +
                            "            <div class=\"author-msg\"><i class=\"fa fa-user-circle\" aria-hidden=\"true\"></i>&nbsp;<span style=\"color: #f4f9f4\">"+res.data[i].username+"</span></div>\n" +
                            "            <div class=\"descr-container\" >"+descr+"</div>\n" +
                            "        </div>");
                    }
                    $('#recommendPhotoContainer').append("<div class=\"col-xs-12 col-sm-12 col-md-12\">" +
                        "<div align=\"right\"><button type=\"button\" class=\"btn btn-link\" onclick=\"nextPage('recommend')\">换一批</button></div></div>");
                }else{
                    $('#recommendPhotoContainer').html("<div align=\"center\">\n" +
                        "            <img src=\"../images/source/nothing.png\" alt=\"nothing here\" style=\"width: 200px;\">\n" +
                        "        </div>");
                }
            }else {
                $('#recommendPhotoContainer').html("<div align=\"center\">\n" +
                    "            <img src=\"../images/source/nothing.png\" alt=\"nothing here\" style=\"width: 200px;\">\n" +
                    "        </div>");
            }
        },
        error:function (res) {
            console.log(res);
            $('#recommendPhotoContainer').html("<div align=\"center\">\n" +
                "            <img src=\"../images/source/nothing.png\" alt=\"nothing here\" style=\"width: 200px;\">\n" +
                "        </div>");
        }
    })
}

/**
 * 获取并渲染热门照片
 * */
function renderHotPhoto() {
    $.ajax({
        url:URL_TYPE.PUB_PREFIX+'/getHotVrPhoto',
        type:'get',
        data:{
            tempPage:PAGING_DATA.hot.tempPage,
            pageCapacity:PAGING_DATA.hot.pageCapacity
        },
        async:false,
        dataType:'json',
        success:function (res) {
            // console.log(res);
            if(res.code == 0){
                if(res.data.length>0){
                    $('#hotPhotoContainer').empty();
                    PAGING_DATA.hot.total = res.data[0].total;
                    for(var i = 0;i<res.data.length;i++){
                        var descr;
                        if(res.data[i].description.length >= 10){
                            descr= res.data[i].description.substring(0,10)+"...";
                        }else if(res.data[i].description.length == 0){
                            descr="......"
                        }else{
                            descr= res.data[i].description;
                        }
                        $('#hotPhotoContainer').append("<div class=\"col-xs-6 col-sm-4 col-md-4\" style=\"padding: 5px;margin: 0;\">\n" +
                            "            <a href='panorama.html?id="+res.data[i].id+"' class=\"img-link\" style=\"background-image: url("+res.data[i].url+")\"></a>\n" +
                            "            <div class=\"author-msg\"><i class=\"fa fa-user-circle\" aria-hidden=\"true\"></i>&nbsp;<span style=\"color: #f4f9f4\">"+res.data[i].username+"</span></div>\n" +
                            "            <div class=\"descr-container\" >"+descr+"</div>\n" +
                            "        </div>");
                    }
                    $('#hotPhotoContainer').append("<div class=\"col-xs-12 col-sm-12 col-md-12\">" +
                        "<div align=\"right\"><button type=\"button\" class=\"btn btn-link\" onclick=\"nextPage('hot')\">换一批</button></div></div>");
                }else{
                    $('#hotPhotoContainer').html("<div align=\"center\">\n" +
                        "            <img src=\"../images/source/nothing.png\" alt=\"nothing here\" style=\"width: 200px;\">\n" +
                        "        </div>");
                }
            }else {
                $('#hotPhotoContainer').html("<div align=\"center\">\n" +
                    "            <img src=\"../images/source/nothing.png\" alt=\"nothing here\" style=\"width: 200px;\">\n" +
                    "        </div>");
            }
        },
        error:function (res) {
            console.log(res);
            $('#hotPhotoContainer').html("<div align=\"center\">\n" +
                "            <img src=\"../images/source/nothing.png\" alt=\"nothing here\" style=\"width: 200px;\">\n" +
                "        </div>");
        }
    })
}

/**
 * 获取并渲染最新照片
 * */
function renderLastPhoto() {
    $.ajax({
        url:URL_TYPE.PUB_PREFIX+'/getLastVrPhoto',
        type:'get',
        data:{
            tempPage:PAGING_DATA.last.tempPage,
            pageCapacity:PAGING_DATA.last.pageCapacity
        },
        async:false,
        dataType:'json',
        success:function (res) {
            // console.log(res);
            if(res.code == 0){
                if(res.data.length>0){
                    $('#LastPhotoContainer').empty();
                    PAGING_DATA.last.total = res.data[0].total;
                    for(var i = 0;i<res.data.length;i++){
                        var descr;
                        if(res.data[i].description.length >= 10){
                            descr= res.data[i].description.substring(0,10)+"...";
                        }else if(res.data[i].description.length == 0){
                            descr="......"
                        }else{
                            descr= res.data[i].description;
                        }
                        $('#LastPhotoContainer').append("<div class=\"col-xs-6 col-sm-4 col-md-4\" style=\"padding: 5px;margin: 0;\">\n" +
                            "            <a href='panorama.html?id="+res.data[i].id+"' class=\"img-link\" style=\"background-image: url("+res.data[i].url+")\"></a>\n" +
                            "            <div class=\"author-msg\"><i class=\"fa fa-user-circle\" aria-hidden=\"true\"></i>&nbsp;<span style=\"color: #f4f9f4\">"+res.data[i].username+"</span></div>\n" +
                            "            <div class=\"descr-container\" >"+descr+"</div>\n" +
                            "        </div>");
                    }
                    $('#LastPhotoContainer').append("<div class=\"col-xs-12 col-sm-12 col-md-12\">" +
                        "<div align=\"right\"><button type=\"button\" class=\"btn btn-link\" onclick=\"nextPage('last')\">换一批</button></div></div>");
                }else{
                    $('#LastPhotoContainer').html("<div align=\"center\">\n" +
                        "            <img src=\"../images/source/nothing.png\" alt=\"nothing here\" style=\"width: 200px;\">\n" +
                        "        </div>");
                }
            }else{
                $('#LastPhotoContainer').html("<div align=\"center\">\n" +
                    "            <img src=\"../images/source/nothing.png\" alt=\"nothing here\" style=\"width: 200px;\">\n" +
                    "        </div>");
            }
        },
        error:function (res) {
            console.log(res);
            $('#LastPhotoContainer').html("<div align=\"center\">\n" +
                "            <img src=\"../images/source/nothing.png\" alt=\"nothing here\" style=\"width: 200px;\">\n" +
                "        </div>");
        }
    })
}

/**
 * 切换下一页
 * */
function nextPage(type) {
    switch (type){
        case "recommend":
            // console.log(PAGING_DATA.recommend.tempPage);
            PAGING_DATA.recommend.tempPage++;
            if(PAGING_DATA.recommend.total - ((PAGING_DATA.recommend.tempPage-1) * PAGING_DATA.recommend.pageCapacity) > 0){
                renderRecommendPhoto();
            }else{
                PAGING_DATA.recommend.tempPage=1;
                renderRecommendPhoto();
            }
            break;
        case "hot":
            PAGING_DATA.hot.tempPage++;
            if(PAGING_DATA.hot.total - ((PAGING_DATA.hot.tempPage-1) * PAGING_DATA.hot.pageCapacity) > 0) {
                renderHotPhoto();
            }else{
                PAGING_DATA.hot.tempPage=1;
                renderHotPhoto();
            }
            break;
        case "last":
            PAGING_DATA.last.tempPage++;
            if(PAGING_DATA.last.total - ((PAGING_DATA.last.tempPage-1) * PAGING_DATA.last.pageCapacity) > 0) {
                renderLastPhoto();
            }else{
                PAGING_DATA.last.tempPage=1;
                renderLastPhoto();
            }
            break;
        default:

    }
}
console.log("欢迎使用VR 360全景\n小本网站还请大神勿黑，手下留情呀~~\n如有什么疑问请联系\nQQ：1246886075\nvr.beifengtz.com");