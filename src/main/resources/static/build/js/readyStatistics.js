var _hmt = _hmt || [];
(function() {
    var hm = document.createElement('script');
    hm.src = '//hm.baidu.com/hm.js?4bad1df23f079e0d12bdbef5e65b072f';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(hm, s);
})();
var chartsHasRender = {
    pagesCharts:false,
    dayCharts:false,
    weekCharts:false,
    progressCharts:false,
    everydayCharts:false
};
$(function () {
    getStaticsInfo();
    // 定时更新运行时间
    setInterval("updateTime()",1000);
    var progressCharts = document.getElementById("progressCharts");
    //网页进度
    var chart = echarts.init(progressCharts);
    progressOption.series[0].silent = true;
    chart.setOption(progressOption);
    chart.setOption({
        baseOption: progressOption,
        media: [{
            query: {
                maxWidth: 300
            },
            option: {
                series: [{
                    label: {
                        fontSize: 26
                    }
                }]
            }
        }]
    });
    chartsHasRender.progressCharts = true;

    //时间线
    var $timeline_block = $('.cd-timeline-block');
    //hide timeline blocks which are outside the viewport
    $timeline_block.each(function(){
        if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.75) {
            $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
        }
    });
    //on scolling, show/animate timeline blocks when enter the viewport
    $(window).on('scroll', function(){
        $timeline_block.each(function(){
            if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.75 && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) {
                $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
            }
        });
        if($("#pagesCharts").offset().top-$(window).scrollTop()+100<$("#pagesCharts").height() && !chartsHasRender.pagesCharts){
            //渲染页面统计图表
            var pagesCharts = document.getElementById("pagesCharts");
            var myPagesCharts = echarts.init(pagesCharts);
            if(pagesOption && typeof pagesOption === "object"){
                myPagesCharts.setOption(pagesOption,true);
                chartsHasRender.pagesCharts = true;
            }
        }
        if($("#dayCharts").offset().top-$(window).scrollTop()+100<$("#dayCharts").height() && !chartsHasRender.dayCharts){
            // 渲染昨日访客图表
            var dayCharts = document.getElementById("dayCharts");
            var myDayCharts = echarts.init(dayCharts);
            if (dayOption && typeof dayOption === "object") {
                myDayCharts.setOption(dayOption, true);
                chartsHasRender.dayCharts = true;
            }
        }
        if($("#weekCharts").offset().top-$(window).scrollTop()+100<$("#weekCharts").height() && !chartsHasRender.weekCharts){
            //渲染上周访客图表
            var weekCharts = document.getElementById("weekCharts");
            var myWeekCharts = echarts.init(weekCharts);
            if (weekOption && typeof weekOption === "object") {
                myWeekCharts.setOption(weekOption, true);
                chartsHasRender.weekCharts = true;
            }
        }
        if($("#everydayCharts").offset().top-$(window).scrollTop()+100<$("#everydayCharts").height() && !chartsHasRender.everydayCharts){
            //渲染访客大数据
            var everydayCharts = document.getElementById("everydayCharts");
            var myEveryCharts = echarts.init(everydayCharts);
            if (everydayOption && typeof everydayOption === "object") {
                myEveryCharts.setOption(everydayOption, true);
                chartsHasRender.everydayCharts = true;
            }
        }
    });
})
var dayOption = {
    title : {
        text: '昨日访客',
        subtext: '每天5:00更新'
    },
    tooltip : {
        trigger: 'axis'
    },
    toolbox: {
        show : true,
        feature : {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView : {show: true, readOnly: true},
            magicType : {show: true, type: ['line', 'bar']},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : ['00:00-01:59','02:00-03:59','04:00-05:59','06:00-07:59','08:00-09:59','10:00-11:59','12:00-13:59','14:00-15:59','16:00-17:59','18:00-19:59','20:00-21:59','22:00-23:59']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'访问量',
            type:'bar',
            data:[2, 5, 9, 26, 28, 70, 175, 182, 48, 18, 6, 2],
            // markPoint : {
            //     data : [
            //         {name : '年最高', value : 182, xAxis: 7, yAxis: 183},
            //         {name : '年最低', value : 2, xAxis: 11, yAxis: 3}
            //     ]
            // },
            markLine : {
                data : [
                    {type : 'average', name : '平均值'}
                ]
            }
        }
    ]
};
var weekOption = {
    title : {
        text: '上周访客',
        subtext: '每周一更新',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        right: 'right',
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    series : [
        {
            name: '访问量',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'周一'},
                {value:310, name:'周二'},
                {value:234, name:'周三'},
                {value:135, name:'周四'},
                {value:1548, name:'周五'},
                {value:1548, name:'周六'},
                {value:1548, name:'周日'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
var progressOption = {
    series: [{
        type: 'liquidFill',
        data: [0.7, 0.5, 0.4, 0.3],
        radius: '83%',
        outline: {
            show: false
        }
    }]
};
var pagesOption = {
    title: {
        text: '页面统计',
        subtext: 'VR360'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['访问页面']
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: {readOnly: true},
            magicType: {type: ['line', 'bar']},
            saveAsImage: {}
        }
    },
    xAxis:  {
        type: 'category',
        boundaryGap: false,
        data: ['首页','创作','社区','教程','关于','个人中心','留言墙','数据中心']
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value} '
        }
    },
    series: [
        {
            name:'访问量',
            type:'line',
            data:[10, 20, 32, 15, 13, 25, 30,67],
            markPoint: {
                data: [
                    {name: '访问量', value: -2, xAxis: 1, yAxis: -1.5}
                ]
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'},
                    [{
                        symbol: 'none',
                        x: '90%',
                        yAxis: 'max'
                    }, {
                        symbol: 'circle',
                        label: {
                            normal: {
                                position: 'start',
                                formatter: '最大值'
                            }
                        },
                        type: 'max',
                        name: '最高点'
                    }]
                ]
            }
        }
    ]
};
var everydayDate = [];
var everydayData = [];
var everydayOption = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'left',
        text: 'VR360访客大数据',
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: {readOnly: true},
            magicType: {type: ['line', 'bar']},
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: everydayDate
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
    }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }],
    series: [
        {
            name:'访问量',
            type:'line',
            smooth:true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: 'rgb(255, 70, 131)'
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(255, 158, 68)'
                    }, {
                        offset: 1,
                        color: 'rgb(255, 70, 131)'
                    }])
                }
            },
            data: everydayData
        }
    ]
};
/**
 * 渲染访问信息
 * */
function renderAddress() {
    $("#addressInfo").empty();
    if (addressInfo.ip != null && addressInfo.ip!="error") {
        $("#addressInfo").append("当前访问ip："+addressInfo.ip);
    }
    if(addressInfo.address!=null && addressInfo.address!="error"){
        $("#addressInfo").append("&nbsp;&nbsp;"+addressInfo.address);
    }
    if(addressInfo.operator!=null && addressInfo.operator!="error"){
        $("#addressInfo").append("&nbsp;&nbsp;"+addressInfo.operator);
    }
}
/**
 * 更新运行时间
 * */
function updateTime() {
    var now = Math.ceil(new Date().getTime()/1000);
    var start = 1529028000;
    var daysNum = Math.floor((now-start)/86400);
    var hoursNum = Math.floor(((now-start)%86400)/3600);
    var minutesNum = Math.floor((((now-start)%86400)%3600)/60);
    var secondsNum = Math.floor((((now-start)%86400)%3600)%60);
    $("#runTime").html("<span class=\"time-number\">"+daysNum+"</span>天<span class=\"time-number\">"+hoursNum+"</span>时<span class=\"time-number\">"+minutesNum+"</span>分<span class=\"time-number\">"+secondsNum+"</span>秒")
}

/**
 * 获取网站基本信息
 * */
function getStaticsInfo(){
    $.ajax({
        url:URL_TYPE.PUB_PREFIX+"/getStatisticsInfo",
        type:"get",
        dataType:"json",
        async:false,
        success:function (res) {
            // console.log(res);
            if(res.code == 0){

                // 渲染基本数据
                $("#usersNum").text(res.data.basic.users);
                $("#visitNum").text(res.data.basic.browsers);
                $("#pagesNum").text(16);
                $("#worksNum").text(res.data.basic.works);

                // 载入页面统计数据
                var tempPagesData = [];
                tempPagesData.push(res.data.basic.index_page);
                tempPagesData.push(res.data.basic.create_page);
                tempPagesData.push(res.data.basic.community_page);
                tempPagesData.push(res.data.basic.learning_page);
                tempPagesData.push(res.data.basic.about_page);
                tempPagesData.push(res.data.basic.person_page);
                tempPagesData.push(res.data.basic.message_page);
                tempPagesData.push(res.data.basic.data_page);
                pagesOption.series[0].data = tempPagesData;

                // 载入昨天和上周统计数据
                var tempDayData = [];
                var tempWeekData = [];
                for(var i in res.data.dayAndWeek){
                    if(res.data.dayAndWeek[i].name == "day_one") tempDayData.push(res.data.dayAndWeek[i].num);
                    else if(res.data.dayAndWeek[i].name == "day_two") tempDayData.push(res.data.dayAndWeek[i].num);
                    else if(res.data.dayAndWeek[i].name == "day_three") tempDayData.push(res.data.dayAndWeek[i].num);
                    else if(res.data.dayAndWeek[i].name == "day_four") tempDayData.push(res.data.dayAndWeek[i].num);
                    else if(res.data.dayAndWeek[i].name == "day_five") tempDayData.push(res.data.dayAndWeek[i].num);
                    else if(res.data.dayAndWeek[i].name == "day_six") tempDayData.push(res.data.dayAndWeek[i].num);
                    else if(res.data.dayAndWeek[i].name == "day_seven") tempDayData.push(res.data.dayAndWeek[i].num);
                    else if(res.data.dayAndWeek[i].name == "day_eight") tempDayData.push(res.data.dayAndWeek[i].num);
                    else if(res.data.dayAndWeek[i].name == "day_nine") tempDayData.push(res.data.dayAndWeek[i].num);
                    else if(res.data.dayAndWeek[i].name == "day_ten") tempDayData.push(res.data.dayAndWeek[i].num);
                    else if(res.data.dayAndWeek[i].name == "day_eleven") tempDayData.push(res.data.dayAndWeek[i].num);
                    else if(res.data.dayAndWeek[i].name == "day_twelve") tempDayData.push(res.data.dayAndWeek[i].num);

                    if(res.data.dayAndWeek[i].name=="week_one") tempWeekData.push({value:res.data.dayAndWeek[i].num,name:"周一"});
                    else if(res.data.dayAndWeek[i].name=="week_two") tempWeekData.push({value:res.data.dayAndWeek[i].num,name:"周二"});
                    else if(res.data.dayAndWeek[i].name=="week_three") tempWeekData.push({value:res.data.dayAndWeek[i].num,name:"周三"});
                    else if(res.data.dayAndWeek[i].name=="week_four") tempWeekData.push({value:res.data.dayAndWeek[i].num,name:"周四"});
                    else if(res.data.dayAndWeek[i].name=="week_five") tempWeekData.push({value:res.data.dayAndWeek[i].num,name:"周五"});
                    else if(res.data.dayAndWeek[i].name=="week_six") tempWeekData.push({value:res.data.dayAndWeek[i].num,name:"周六"});
                    else if(res.data.dayAndWeek[i].name=="week_seven") tempWeekData.push({value:res.data.dayAndWeek[i].num,name:"周日"});
                }
                dayOption.series[0].data = tempDayData;
                weekOption.series[0].data = tempWeekData;

                // 载入所有数据，everyday大数据
                for(var j in res.data.everyday){
                    everydayData.push(res.data.everyday[j].num);
                    everydayDate.push(res.data.everyday[j].time);
                }

                // 渲染作品Top10
                $("#worksList").empty();
                for(var k in res.data.cityAndWorks.works){
                    $("#worksList").append("<a href=\"/p/panorama.html?id="+res.data.cityAndWorks.works[k].id+"\" class=\"list-group-item\" title='"+res.data.cityAndWorks.works[k].des+"' target='_blank'>\n" +
                        "                            <span class=\"badge\" style=\"background-color: #dff0d8\">"+res.data.cityAndWorks.works[k].num+"</span>\n" + res.data.cityAndWorks.works[k].des.substring(0,15)+"......"+
                        "                        </a>");
                }

                // 渲染城市Top10
                $("#cityList").empty();
                for(var r in res.data.cityAndWorks.city){
                    if(res.data.cityAndWorks.city[r].city==""){
                        res.data.cityAndWorks.city[r].city = "未知";
                    }
                    $("#cityList").append("<tr>\n" +
                        "                            <th>"+(parseInt(r)+1)+"</th>\n" +
                        // "                            <td>"+res.data.cityAndWorks.city[r].pro+"</td>\n" +
                        "                            <td>"+res.data.cityAndWorks.city[r].city+"</td>\n" +
                        // "                            <td>"+res.data.cityAndWorks.city[r].operator+"</td>\n" +
                        "                            <td>"+res.data.cityAndWorks.city[r].num+"</td>\n" +
                        "                        </tr>");
                }

                // 隐藏加载动画
                $(".loading-bg").fadeOut("slow",function () {
                    $("body,html").css("overflow-y","auto");
                });
            }else{
                alert("系统错误!code:"+res.code);
                $(".loading-bg").fadeOut("slow",function () {
                    $("body,html").css("overflow-y","auto");
                });
            }
        },
        error:function (res) {
            console.log(res);
            alert("系统错误!code:"+res.status);
            $(".loading-bg").fadeOut("slow",function () {
                $("body,html").css("overflow-y","auto");
            });
        }
    })
}
console.log("欢迎使用VR 360全景\n小本网站还请大神勿黑，手下留情呀~~\n如有什么疑问请联系\nQQ：1246886075\nvr.beifengtz.com");