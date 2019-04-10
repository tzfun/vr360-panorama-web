$(document).ready(function () {
    var clientQQ = document.getElementById('clientQQ');
    var QQ = document.getElementById('QQ');
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        clientQQ.href = "mqqwpa://im/chat?chat_type=wpa&uin=1246886075&version=1&src_type=web&web_src=oicqzone.com";
        QQ.href = "mqqwpa://im/chat?chat_type=wpa&uin=1246886075&version=1&src_type=web&web_src=oicqzone.com";
    } else {
        clientQQ.href = "tencent://message/?uin=1246886075&Site=http://vps.shuidazhe.com&Menu=yes";
        QQ.href = "tencent://message/?uin=1246886075&Site=http://vps.shuidazhe.com&Menu=yes";
    }
})
console.log("欢迎使用VR 360全景\n小本网站还请大神勿黑，手下留情呀~~\n如有什么疑问请联系\nQQ：1246886075\nvr.beifengtz.com");
