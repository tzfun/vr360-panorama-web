var PSV_Config={
    photoUrl:'',
    photoUrls:[],
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
var URL_TYPE={
    API_VERSION:"/v1",
    NONPUBLIC_PREFIX:"/v1/nonpub",
    PUB_PREFIX:"/v1/pub"
}
$().ready(function(){
    $('.photoContainer').click(function(){
        $('#chooseFile').click();
    })
    if(getCookie('vr360_user_token')==null){
        $('#user_status').text("未登录");
        $('#user_action').html("<a href='javascript:showLoginBox();'>登录</a>");
    }else{
        getUserStatus();
    }
})
$(function(){
    $('#chooseFile').change(function(e){
        var selectedFile = $('#chooseFile').get(0).files[0];
        var d=new Date(selectedFile.lastModifiedDate);
        var lastTime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
        // console.log(selectedFile);
        $('.photoInfo_status').text('已选择图片');
        $('.photoInfo_name').text('图片:'+selectedFile.name);
        $('.photoInfo_size').text('大小:'+(selectedFile.size/(1024*1024)).toFixed(2)+'M');
        $('.photoInfo_time').text('上次修改:'+lastTime);
        // console.log(selectedFile.type);
            var tempUrl;
            var reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onload=function(e){
                tempUrl=e.target.result;
                PSV_Config.photoUrl=tempUrl;
                $('.img-choose').css('display','none');
                $('#img-show').get(0).src=tempUrl;
                $('#img-show').css('display','block');
                $('.photo-config').attr("disabled",false);
            };
    })
})
var photoMsg={
    photoType:'',
    pageType:''
};
function showSingle(){
    $('#checkBox').css('display','none');
    if(photoMsg.pageType!='single'){
        photoMsg.photoType='single';
    }
    $('.breadcrumb li:nth-of-type(2)').text('单张全景');
    $('#mainContainer').css('display','block');
}
function toCheck(){
    photoMsg={
        photoType:'',
        pageType:''
    }
    $('#mainContainer').css('display','none');
    $('#checkBox').css('display','block');
}
function createVrPhoto(){
    var selectedFile = $('#chooseFile').get(0).files[0];
    if(selectedFile==null){
        $('#msg-container').append("<div class=\"alert alert-danger fade in\" role=\"alert\" id=\"sizeWrong\" >\n" +
            "                <strong>错误!</strong> 图片不能为空，请先选择图片\n" +
            "            </div>")
        setTimeout(function(){
            $('.alert').alert('close');
        },5000);
    }else{
        PSV_Config.PSV_type=$("input[name='photoType']:checked").val();
        createPSV();
    }
}
/**
 * 创建全景实体方法
 * */
function createPSV(){
    var PSV
    var div_index = document.getElementById('PSV_demo_container');
    $('#PSV_demo_container').empty();
    var Width = window.screen.width;
    var height = "500px";
    if(PSV_Config.PSV_type==360){
        PSV = new PhotoSphereViewer({
            panorama:PSV_Config.photoUrl,
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
            panorama:PSV_Config.photoUrl,
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

/**
 * 上传文件
 * */
function uplodaFile() {
    var selectedFile = $('#chooseFile').get(0).files[0];
    var vrPhotoDes = $('#vrPhotoDes').val();
    if(selectedFile==null){
        $('#msg-container').append("<div class=\"alert alert-danger fade in\" role=\"alert\" id=\"sizeWrong\" >\n" +
            "                <strong>错误!</strong> 图片不能为空，请先选择图片\n" +
            "            </div>")
        setTimeout(function(){
            $('.alert').alert('close');
        },5000);
    }else if(selectedFile.size>3145728){
        $('#msg-container').append("<div class=\"alert alert-danger fade in\" role=\"alert\" id=\"sizeWrong\" >\n" +
            "                <strong>错误!</strong> 上传的图片大小超过3M，建议使用推荐的在线工具进行压缩。\n" +
            "            </div>")
        setTimeout(function(){
            $('.alert').alert('close');
        },5000);
    }else if(filterSqlStr(vrPhotoDes)){
        $('#msg-container').append("<div class=\"alert alert-danger fade in\" role=\"alert\" id=\"sizeWrong\" >\n" +
            "                <strong>错误!</strong> 请不要输入*、>、<、'、-、+、/、#及与sql相关的敏感字符\n" +
            "            </div>")
        setTimeout(function(){
            $('.alert').alert('close');
        },5000);
    }else{
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
                                uploadVrphoto(vrPhotoDes);
                            },1500);

                        }else{
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
}

/**
 * 上传信息
 * */
function uploadVrphoto(vrPhotoDes){
    var form = $('#uploadFileForm')[0];
    var file = new FormData(form);
    file.append("photoType",PHOTO_TYPE.SINGLE_PHOTO);
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
        dataType:'json',
        success:function (res) {
            // console.log(res);

            if (res.code == 0){
                var photoId = res.data;
                var vrPhotoParam = {
                    photoType:PHOTO_TYPE.SOLA_PHOTO,
                    photoDeg:PSV_Config.PSV_type
                };
                var photoIds = [
                    photoId
                ];
                $.ajax({
                    url:URL_TYPE.NONPUBLIC_PREFIX+"/uploadVrInfo",
                    type:'post',
                    data:{
                        vrPhotoParam:JSON.stringify(vrPhotoParam),
                        photoIds:JSON.stringify(photoIds),
                        vrPhotoType:'sola',
                        vrPhotoDes:vrPhotoDes
                    },
                    headers:{
                        token:JSON.parse(getCookie("vr360_user_token")).token
                    },
                    dataType:'json',
                    success:function (e) {
                        // console.log(e);
                        $('#myChooseModal').modal('hide');
                        if (e.code==0){
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

                        }else{
                            $.alert('未知错误上传失败！');
                        }
                    },
                    error:function (e) {
                        console.log(e);
                        $('#myChooseModal').modal('hide');
                        $.alert('未知错误上传失败！');
                    }
                })
            }else if(res.code==5){
                delCookie("vr360_user_token");
                getUserStatus();
                $('#myChooseModal').modal('hide');
                $.alert('登录失效，请重新登录');
            }else {
                $('#myChooseModal').modal('hide');
                $.alert('未知错误上传失败！');
            }
        },
        error:function (res) {
            console.log(res);
            $('#myChooseModal').modal('hide');
            $.alert('未知错误上传失败！');
        }
    })
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