var personInfo = {};

var paginationData = {
    tempPage:1,
    pageCapacity:10
}

$(function () {
   var urlData = GetRequest();
   if(urlData.uid!=null && filterSqlStr(urlData.uid) && urlData.uid!=""){
       getUserData(urlData.uid);
       getUserWorksList(1,paginationData.pageCapacity);
       checkRelationship();
   }else{
       location.href = "../error/404.html";
   }
});
/**
 * 获取用户作品
 * */
function getUserWorksList(tempPage,pageCapacity){
    $.ajax({
        url:URL_TYPE.PUB_PREFIX+"/selectPeopleVrPhotoByPaging",
        type:"get",
        data:{
            tempPage:tempPage,
            pageCapacity:pageCapacity,
            uid:GetRequest().uid
        },
        success:function (res) {
            // console.log(res);
            if(res.code == -1){
                $.alert("未知错误");
            }else if(res.code == 0){
                renderUserWorksList(res.data);
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
                        getUserWorksList(current,paginationData.pageCapacity);
                    }
                });
            }

        },
        error:function (res) {
            $.alert("获取作品列表错误"+res.status);
        }
    })
}
/**
 * 渲染用户作品
 * */
function renderUserWorksList(data){

    if(data.total <=0){
        $("#photoContainer").html("<div align=\"center\" style=\"margin-top: 84px;\">\n" +
            "            <img src=\"../images/source/error.png\" alt=\"\" style=\"width: 220px\">\n" +
            "            <p>这人很懒，什么作品也没上传！</p>\n" +
            "            <div class=\"button uploadBtn\" onclick=\"location.href='community.html'\">去社区逛逛</div>\n" +
            "        </div>");
    }else{
        $("#photoContainer").empty();
        for (var i = 0; i < data.vrphotoList.length; i++){
            var isRecommend;
            if(data.vrphotoList[i].isRecommend == 0){
                isRecommend = "recommendHide";
            }else{
                isRecommend = "";
            }
            $('#photoContainer').append("<div class=\"col-xs-6 col-sm-4 col-md-4\" style=\"padding: 15px;margin: 0;\">\n" +
                "<div style=\"position: relative\"><div class=\"recommendIcon "+isRecommend+"\">推荐</div></div>" +
                "                                <a href='panorama.html?id="+data.vrphotoList[i].id+"' class=\"img-link\" style=\"background-image: url("+data.vrphotoList[i].url+")\"></a>\n" +
                "                                <div class=\"descr-container\" >"+data.vrphotoList[i].description+"</div>\n" +
                "                                <div class=\"photoInfo\">\n" +
                "<i class=\"fa fa-eye\" aria-hidden=\"true\"></i>&nbsp;<span>"+data.vrphotoList[i].viewNum+"</span>&nbsp;&nbsp;" +
                "<i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i>&nbsp;<span>"+data.vrphotoList[i].heartNum+"</span>" +
                "                                </div>\n" +
                "                            </div>");
        }
        $("#photoContainer").append("<div class='col-xs-12 col-sm-12 col-md-12' style='margin: 15px;' align=\"center\">\n" +
            "            <div id=\"pagination\" class=\"\"></div>\n" +
            "        </div>");
    }


}

/**
 * 获取并渲染用户基本数据
 * */
function getUserData(uid) {
    $.ajax({
        url:URL_TYPE.PUB_PREFIX+"/getPeopleData",
        type:"get",
        data:{
            uid:uid
        },
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
            }else if(res.code==3){
                $.alert("用户不存在");
            }else{
                $.alert("获取信息失败，"+res.msg);
            }
        },
        error:function (res) {
            $.alert("获取用户信息失败，"+res.status);
        }
    })
}
/**
 * 检查是否已关注
 * */
function checkRelationship() {
    try {
        if (JSON.parse(getCookie("vr360_user_token")).token != null) {
            $.ajax({
                url: URL_TYPE.NONPUBLIC_PREFIX + "/checkFollowRelationship",
                type: "get",
                headers: {
                    token:JSON.parse(getCookie("vr360_user_token")).token
                },
                data: {
                    uid:GetRequest().uid
                },
                dataType: 'json',
                success: function (res) {
                    // console.log(res);
                    if (res.code == 0 && res.data) {
                        $("#followBtn").attr("onclick","unFollowTa()");
                        $("#followBtn").text("取消关注");
                    }
                },
                error: function (res) {

                }
            })
        }
    }catch (e) {

    }
}

/**
 * 关注Ta
 * */
function followTa(){
    try {
        if (JSON.parse(getCookie("vr360_user_token")).token == null) {
            $.alert("未登录或登录失效");
            getUserStatus();
        } else {
            $.ajax({
                url: URL_TYPE.NONPUBLIC_PREFIX + "/addFollowRelationship",
                type: "post",
                headers: {
                    token:JSON.parse(getCookie("vr360_user_token")).token
                },
                data: {
                    uid:GetRequest().uid
                },
                dataType: 'json',
                success: function (res) {
                    // console.log(res);
                    if (res.code == 0) {
                        $.alert("关注成功!");
                        $("#followBtn").attr("onclick","unFollowTa()");
                        $("#followBtn").text("取消关注");
                    } else if(res.code == 5){
                        $.alert("未登录或登录失效");
                        getUserStatus();
                    }else{
                        $.alert("未知错误，关注失败");
                    }
                },
                error: function (res) {
                    $.alert("关注失败，" + res.status);
                }
            })
        }
    }catch (e) {
        $.alert("未登录或登录失效");
        getUserStatus();
    }
}

/**
 * 取消关注
 * */
function unFollowTa() {
    try {
        if (JSON.parse(getCookie("vr360_user_token")).token == null) {
            $.alert("未登录或登录失效");
            getUserStatus();
        } else {
            $.ajax({
                url: URL_TYPE.NONPUBLIC_PREFIX + "/delFollowRelationship",
                type: "post",
                headers: {
                    token:JSON.parse(getCookie("vr360_user_token")).token
                },
                data: {
                    uid:GetRequest().uid
                },
                dataType: 'json',
                success: function (res) {
                    // console.log(res);
                    if (res.code == 0) {
                        $.alert("已取消关注!");
                        $("#followBtn").attr("onclick","followTa()");
                        $("#followBtn").text("关注Ta");
                    } else if(res.code == 5){
                        $.alert("未登录或登录失效");
                        getUserStatus();
                    }else{
                        $.alert("未知错误，取消关注失败");
                    }
                },
                error: function (res) {
                    $.alert("取消关注失败，" + res.status);
                }
            })
        }
    }catch (e) {
        $.alert("未登录或登录失效");
        getUserStatus();
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

/**
 * 过滤sql敏感符
 * */
function filterSqlStr(str) {
    var sqlList = ["-","+","*","&"];
    for (var sql in sqlList) {
        if(str.indexOf(sqlList[sql]) != -1){
            return false;
        }
    }
    return true;
}