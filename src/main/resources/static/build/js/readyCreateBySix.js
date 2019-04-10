var PSV_Config={
    photoUrls:{
        front:'',
        back:'',
        top:'',
        bottom:'',
        left:'',
        right:''
    },
    sizeIsOk:{
        front:false,
        back:false,
        top:false,
        bottom:false,
        left:false,
        right:false
    },
    PSV_type:720
};
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
$().ready(function(){
    $('#frontContainer').click(function(){
        $('#chooseFileFront').click();
    })
    $('#backContainer').click(function(){
        $('#chooseFileBack').click();
    })
    $('#leftContainer').click(function(){
        $('#chooseFileLeft').click();
    })
    $('#rightContainer').click(function(){
        $('#chooseFileRight').click();
    })
    $('#topContainer').click(function(){
        $('#chooseFileTop').click();
    })
    $('#bottomContainer').click(function(){
        $('#chooseFileBottom').click();
    })
    if(getCookie('vr360_user_token')==null){
        $('#user_status').text("未登录");
        $('#user_action').html("<a href='javascript:showLoginBox();'>登录</a>");
    }else{
        getUserStatus();
    }
})
$(function(){
    //添加图片监听和处理
    showImg("frontContainer","chooseFileFront","frontInfoContainer","front");
    showImg("backContainer","chooseFileBack","backInfoContainer","back");
    showImg("topContainer","chooseFileTop","topInfoContainer","top");
    showImg("bottomContainer","chooseFileBottom","bottomInfoContainer","bottom");
    showImg("leftContainer","chooseFileLeft","leftInfoContainer","left");
    showImg("rightContainer","chooseFileRight","rightInfoContainer","right");
});
var photoMsg={
    photoType:'',
    pageType:''
};
/** 显示图片及相关信息方法
* @param imgContainer 图片容器id
* @param imgInput 选择容器id
* @param infoContainer 图片信息容器id
* @param photoType 图片方位类型
* */
function showImg(imgContainer,imgInput,infoContainer,photoType){
    $('#'+imgInput).change(function(e){
        var selectedFile = $('#'+imgInput).get(0).files[0];
        var d=new Date(selectedFile.lastModifiedDate);
        var lastTime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
        // console.log(selectedFile);
        $('#'+infoContainer+' .photoInfo_name').text('图片:'+selectedFile.name);
        $('#'+infoContainer+' .photoInfo_size').text('大小:'+(selectedFile.size/(1024*1024)).toFixed(2)+'M');
        $('#'+infoContainer+' .photoInfo_time').text('上次修改:'+lastTime);
        // console.log(selectedFile.type);
        var tempUrl;
        var reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload=function(e){
            tempUrl=e.target.result;
            //加载图片获取图片真实宽度和高度
            var image = new Image();
            image.onload=function(){
                var width = image.width;
                var height = image.height;
                var n=gcd(width,height);
                $('#'+infoContainer+' .photoInfo_status').text('长宽比 '+ width/n+":"+height/n);
            };
            image.src= tempUrl;
            switch (photoType){
                case "front":
                    PSV_Config.photoUrls.front=tempUrl;
                    if(selectedFile.size<=1048576){
                        PSV_Config.sizeIsOk.front=true;
                    }else{
                        PSV_Config.sizeIsOk.front=false;
                    }
                    break;
                case "back":
                    PSV_Config.photoUrls.back=tempUrl;
                    if(selectedFile.size<=1048576){
                        PSV_Config.sizeIsOk.back=true;
                    }else{
                        PSV_Config.sizeIsOk.back=false;
                    }
                    break;
                case "top":
                    PSV_Config.photoUrls.top=tempUrl;
                    if(selectedFile.size<=1048576){
                        PSV_Config.sizeIsOk.top=true;
                    }else{
                        PSV_Config.sizeIsOk.top=false;
                    }
                    break;
                case "bottom":
                    PSV_Config.photoUrls.bottom=tempUrl;
                    if(selectedFile.size<=1048576){
                        PSV_Config.sizeIsOk.bottom=true;
                    }else{
                        PSV_Config.sizeIsOk.bottom=false;
                    }
                    break;
                case "left":
                    PSV_Config.photoUrls.left=tempUrl;
                    if(selectedFile.size<=1048576){
                        PSV_Config.sizeIsOk.left=true;
                    }else{
                        PSV_Config.sizeIsOk.left=false;
                    }
                    break;
                case "right":
                    PSV_Config.photoUrls.right=tempUrl;
                    if(selectedFile.size<=1048576){
                        PSV_Config.sizeIsOk.right=true;
                    }else{
                        PSV_Config.sizeIsOk.right=false;
                    }
                    break;
            }

            $('#'+imgContainer+' .img-choose').css('display','none');
            $('#'+imgContainer+' .img-show').get(0).src=tempUrl;
            $('#'+imgContainer+' .img-show').css('display','block');
            // $('#'+imgContainer+' .photo-config').attr("disabled",false);
        };
    })
}
/*** 求最大公约数 ***/
function gcd(a, b) {
    if(a % b)
        return gcd(b, a % b);
    else
        return b;
}
//生成全景图
function createVrPhoto(){
    if(PSV_Config.photoUrls.front==''){
        $('#msg-container').append("<div class=\"alert alert-danger fade in\" role=\"alert\" id=\"sizeWrong\" >\n" +
            "                <strong>错误!</strong> 请选择一张前景图片。\n" +
            "            </div>")
        setTimeout(function(){
            $('.alert').alert('close');
        },5000);
    }else if(PSV_Config.photoUrls.back==''){
        $('#msg-container').append("<div class=\"alert alert-danger fade in\" role=\"alert\" id=\"sizeWrong\" >\n" +
            "                <strong>错误!</strong> 请选择一张后景图片。\n" +
            "            </div>")
        setTimeout(function(){
            $('.alert').alert('close');
        },5000);
    }else if(PSV_Config.photoUrls.left==''){
        $('#msg-container').append("<div class=\"alert alert-danger fade in\" role=\"alert\" id=\"sizeWrong\" >\n" +
            "                <strong>错误!</strong> 请选择一张左景图片。\n" +
            "            </div>")
        setTimeout(function(){
            $('.alert').alert('close');
        },5000);
    }else if(PSV_Config.photoUrls.right==''){
        $('#msg-container').append("<div class=\"alert alert-danger fade in\" role=\"alert\" id=\"sizeWrong\" >\n" +
            "                <strong>错误!</strong> 请选择一张右景图片。\n" +
            "            </div>")
        setTimeout(function(){
            $('.alert').alert('close');
        },5000);
    }else if(PSV_Config.photoUrls.top==''){
        $('#msg-container').append("<div class=\"alert alert-danger fade in\" role=\"alert\" id=\"sizeWrong\" >\n" +
            "                <strong>错误!</strong> 请选择一张上景图片。\n" +
            "            </div>")
        setTimeout(function(){
            $('.alert').alert('close');
        },5000);
    }else if(PSV_Config.photoUrls.bottom==''){
        $('#msg-container').append("<div class=\"alert alert-danger fade in\" role=\"alert\" id=\"sizeWrong\" >\n" +
            "                <strong>错误!</strong> 请选择一张下景图片。\n" +
            "            </div>")
        setTimeout(function(){
            $('.alert').alert('close');
        },5000);
    }else{
        PSV_Config.PSV_type=$("input[name='photoType']:checked").val();
        createPSV();
    }
}
//上传全景图
function uploadVrPhoto(){
    var vrPhotoDes = $('#vrPhotoDes').val();
    var frontIsPass=PSV_Config.sizeIsOk.front;
    var backIsPass=PSV_Config.sizeIsOk.back;
    var leftIsPass=PSV_Config.sizeIsOk.left;
    var rightIsPass=PSV_Config.sizeIsOk.right;
    var topIsPass=PSV_Config.sizeIsOk.top;
    var bottomIsPass=PSV_Config.sizeIsOk.bottom;
    if(filterSqlStr(vrPhotoDes)){
        $('#msg-container').append("<div class=\"alert alert-danger fade in\" role=\"alert\" id=\"sizeWrong\" >\n" +
            "                <strong>错误!</strong> 请不要输入*、>、<、'、-、+、/、#及与sql相关的敏感字符\n" +
            "            </div>")
        setTimeout(function(){
            $('.alert').alert('close');
        },5000);
    }else{
        if(frontIsPass && backIsPass && leftIsPass && rightIsPass && topIsPass && bottomIsPass){
            $.confirm({
                title:"VR 360提示您",
                content: '确认上传图片?',
                type: 'green',
                icon: 'glyphicon glyphicon-question-sign',
                animation: 'RotateX',
                buttons: {
                    ok: {
                        text: '确认',
                        btnClass: 'btn-primary',
                        action: function() {
                            var userInfo = JSON.parse(getCookie('vr360_user_token'));
                            if(userInfo==null){
                                $.alert("请先登录！");
                            } else if(userInfo.token!="" && userInfo.token!=null){
                                $('#myChooseModal').modal('show');
                                setTimeout(function(){
                                    uploadInfo(vrPhotoDes);
                                },1500);
                            }else{
                                $('#bg-mask').css("display","none");
                                $('#msgModal').fadeOut();
                                $.alert("请先登录！");
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
        else{
            //    这里上传不通过
            $('#msg-container').append("<div class=\"alert alert-danger fade in\" role=\"alert\" id=\"sizeWrong\" >\n" +
                "                <strong>错误!</strong> 图片不符合要求，请检查图片大小、格式以及是否上传完整。\n" +
                "            </div>")
            setTimeout(function(){
                $('.alert').alert('close');
            },5000);
        }
    }
}
/**
 * 上传文件
 * */
function uploadFile(photoType,formElementId) {
    var id=false;
    var form = $('#'+formElementId)[0];
    var file = new FormData(form);
    file.append("photoType",photoType);
    $.ajax({
        type:'post',
        url:URL_TYPE.NONPUBLIC_PREFIX+"/uploadFile",
        headers:{
            token:JSON.parse(getCookie("vr360_user_token")).token
        },
        data:file,
        async: false,
        cache: false,
        processData: false,
        contentType: false,
        timeout: 600000,
        success:function (res) {
            // console.log(res);
            if (res.code == 0){
                id = res.data;
            }else if(res.code == 2){
                id = -1;
            }
        },
        error:function (res) {
            console.log(res);
        }
    })
    return id;
}

/**
 * 上传图片信息
 * */
function uploadInfo(vrPhotoDes) {
    var front = uploadFile(PHOTO_TYPE.FRONT_PHOTO,"uploadFileFormFront");
    if(front == -1){
        $.alert("登录已失效，请重新登录");
    }else {
        var back = uploadFile(PHOTO_TYPE.BACK_PHOTO, "uploadFileFormBack");
        var left = uploadFile(PHOTO_TYPE.LEFT_PHOTO, "uploadFileFormLeft");
        var right = uploadFile(PHOTO_TYPE.RIGHT_PHOTO, "uploadFileFormRight");
        var top = uploadFile(PHOTO_TYPE.TOP_PHOTO, "uploadFileFormTop");
        var bottom = uploadFile(PHOTO_TYPE.BOTTOM_PHOTO, "uploadFileFormBottom");
        if (front != false && back != false && left != false && right != false && top != false && bottom != false) {
            var vrPhotoParam = {
                photoType: PHOTO_TYPE.SOLA_PHOTO,
                photoDeg: PSV_Config.PSV_type
            };
            var photoIds = [front, back, left, right, top, bottom];
            $.ajax({
                url: URL_TYPE.NONPUBLIC_PREFIX + "/uploadVrInfo",
                type: 'post',
                data: {
                    vrPhotoParam: JSON.stringify(vrPhotoParam),
                    photoIds: JSON.stringify(photoIds),
                    vrPhotoType: PHOTO_TYPE.COMBINATION_PHOTO,
                    vrPhotoDes: vrPhotoDes
                },
                headers: {
                    token: JSON.parse(getCookie("vr360_user_token")).token
                },
                dataType: 'json',
                success: function (e) {
                    // console.log(e);
                    $('#myChooseModal').modal('hide');
                    if (e.code == 0) {
                        $.confirm({
                            title:"VR 360提示您",
                            content: '恭喜您，上传成功！图片正在审核中，在此之前仅由您本人能浏览该全景。',
                            type: 'green',
                            animation: 'RotateX',
                            buttons: {
                                ok: {
                                    text: '确认',
                                    btnClass: 'btn-primary',
                                    action: function() {
                                        location.href="panorama.html?id="+e.data;
                                    }
                                }
                            }
                        });
                    } else {
                        $.alert('未知错误，上传失败！');
                    }
                },
                error: function (e) {
                    console.log(e);
                    $('#myChooseModal').modal('hide');
                    $.alert('未知错误，上传失败！');
                }
            })
        } else {
            $('#myChooseModal').modal('hide');
            $.alert("上传失败！");
        }
    }
}
/**
 * 生成预览全景图
 * */
function createPSV(){
    var PSV;
    var div_index = document.getElementById('PSV_demo_container');
    $('#PSV_demo_container').empty();
    var Width = window.screen.width;
    var height = "500px";
    if(PSV_Config.PSV_type==360){
        PSV = new PhotoSphereViewer({
            panorama:PSV_Config.photoUrls,
            default_fov:179,//初始视野，1-179
            container:div_index,
            time_anim:false,
            anim_speed:'0.6rpm',
            navbar: [
                'gyroscope',
                'caption',
                'fullscreen'
            ],
            usexmpdata:false,
            size:{
                width:"100%",
                height:height
            },
            gyroscope:true,
            latitude_range:[Math.PI / 3,-Math.PI / 3],
            tilt_down_max:Math.PI / 2,
            tilt_up_max:Math.PI / 2
        });
    }else if(PSV_Config.PSV_type==720){
        PSV = new PhotoSphereViewer({
            panorama:PSV_Config.photoUrls,
            default_fov:179,//初始视野，1-179
            container:div_index,
            time_anim:false,
            anim_speed:'0.6rpm',
            navbar: [
                'gyroscope',
                'caption',
                'fullscreen'
            ],
            usexmpdata:false,
            size:{
                width:"100%",
                height:height
            },
            gyroscope:true
        });
    }
    PSV.on('panorama-loaded',function(){
        if(Width<=789){
            var gyroscope_button= document.querySelector('.psv-gyroscope-button');
            var ev = new MouseEvent('click',{
                cancelable: true,
                bubble: true,
                view: window
            });
            gyroscope_button.dispatchEvent(ev);
        }else{
            PSV.startAutorotate();
        }
    });
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
    var str="and,delete,or,exec,insert,select,union,update,count,*,>,<,',-,+,/,#";
    return str;
}
console.log("欢迎使用VR 360全景\n小本网站还请大神勿黑，手下留情呀~~\n如有什么疑问请联系\nQQ：1246886075\nvr.beifengtz.com");