var map;
function mapInit(){
    map = new AMap.Map('mapContainer', {
        resizeEnable: true,
        rotateEnable:true,
        pitchEnable:true,
        zoom: 17,
        pitch:50,
        rotation:-15,
        viewMode:'3D',//开启3D视图,默认为关闭
        buildingAnimation:true,//楼块出现是否带动画
        expandZoomRange:true,
        zooms:[3,20],
        center:[102.9922342300,29.9772602198]
    });
    // map.on('indoor_create',function(){
    //     map.indoorMap.showIndoorMap('B000A856LJ',5);
    // });
    AMap.plugin('AMap.ToolBar',function(){//异步加载插件
        var toolbar = new AMap.ToolBar();
        map.addControl(toolbar);
    });
    map.addControl(new AMap.ControlBar({
        showZoomBar:false,
        showControlButton:true,
        position:{
            right:'10px',
            top:'10px'
        }
    }))
}
mapInit();
console.log("欢迎使用VR 360全景\n小本网站还请大神勿黑，手下留情呀~~\n如有什么疑问请联系\nQQ：1246886075\nvr.beifengtz.com");