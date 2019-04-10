window.onload=function(){
    var clientQQ = document.getElementById('clientQQ');
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        clientQQ.href = "mqqwpa://im/chat?chat_type=wpa&uin=1246886075&version=1&src_type=web&web_src=oicqzone.com";
    } else {
        clientQQ.href = "tencent://message/?uin=1246886075&Site=http://vps.shuidazhe.com&Menu=yes";
    }
}

/**
 * 核验form表单
 */
function checkQuestionForm() {
    var form = $("#userQuestionForm").serializeJson();
    $("#question-mark,#describe-mark").text("");
    if(form.question == ""){
        $("#question-mark").text("问题不能为空！");
    }else if(form.describe == ""){
        $("#describe-mark").text("问题描述不能为空！")
    }else if(form.question.length > 32){
        $("#question-mark").text("问题太长了哟~你可以在描述中详细阐述");
    }else if (filteSqlStr(form.question)) {
        $("#question-mark").text("不能包含/,',#,@,*,-,|等非法字符！");
    }else if(filteSqlStr(form.describe)){
        $("#describe-mark").text("不能包含/,',#,@,*,-,|等非法字符！");
    }else{
        if(getCookie('vr360_user_token')==null){
            $('#user_status').text("未登录");
            $('#user_action').html("<a href='javascript:showLoginBox();'>登录</a>");
            showLoginBox();
        }else{
            var token = JSON.parse(getCookie("vr360_user_token")).token;
            form.describe.replace("\n","<br>");
            uploadQuestion(form.question,form.describe,token);
        }
    }
}

/**
 * 检查是否含有非法字符
 */
function filteSqlStr (value){
    var sqlStr = "/,',#,@,*,-,|";
    var flag = false;
    for(var i=0;i<sqlStr.length;i++){
        if(value.toLowerCase().indexOf(sqlStr[i])!=-1){
            flag = true;
            break;
        }
    }
    return flag;
}

/**
 * 提交表单
 */
function uploadQuestion(question,describe,token){
    $.ajax({
        url:URL_TYPE.NONPUBLIC_PREFIX+"/uploadQuestion",
        type:"post",
        headers:{
            token:token
        },
        data:{
            question:question,
            describe:describe
        },
        dataType:"JSON",
        success:function (res) {
            // console.log(res);
            if(res.code == 0){
                $.alert('恭喜您，问题提交成功，我们会尽快处理您的提问！');
            }else if(res.code == -1){
                $.alert('系统错误，提交失败！如有疑问请联系管理员');
            }else if(res.code == 2){
                $.alert('登录失效，请重新登录后提交！');
                showLoginBox();
            }else if(res.code == 5){
                $.alert('登录失效，请重新登录后提交！');
                showLoginBox();
            }
        },
        error:function (res) {
            console.log(res.status);
        }
    })
}
console.log("欢迎使用VR 360全景\n小本网站还请大神勿黑，手下留情呀~~\n如有什么疑问请联系\nQQ：1246886075\nvr.beifengtz.com");