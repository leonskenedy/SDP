var _chartConfig = {
    dateTime: +new Date(),
    generateId: function () {
        return this.dateTime++;
    },
    parseType: function () {
        $("span[class_id]").each(function () {
            $(this).removeClass("zzjz-chart-type-active").removeClass($(this).attr("original_class") + "-selective")
        });
        var level = chart.meta.level[0];
        var arr = [];
        for (var i = 0; i < this.typeFilter.length; i++) {
            var result = this.typeFilter[i](level);
            if (result) {
                var span = $("span[class_id=" + result.classId + "]");
                span.addClass(span.attr("original_class") + "-selective");
                arr.push(result);
            }
        }
        if (arr.length > 1) {
            var span = $("span[class_id=" + arr[1].classId + "]");
            level.chart_type = arr[1].classId;
            span.addClass("zzjz-chart-type-active");
        } else {
            var span = $("span[class_id=" + arr[0].classId + "]");
            span.addClass("zzjz-chart-type-active");
            level.chart_type = arr[0].classId;
        }
    },
    parseMap: function (option) {
        var mapData = [];
        for (var i = 0; i < option.xAxis[0].data.length; i++) {
            var item = {
                name: option.xAxis[0].data[i].replace(/(省|市)$/, ""),
                value: option.series[0].data[i]
            };
            mapData.push(item);
        }
        var mapOption = {
            title: {
                text: option.title.text,
                left: 'center'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: [option.series[0].name]
            },
            tooltip: {
                trigger: 'item'/*,
                 formatter: function (arg) {
                 var data = mapData[arg.name];
                 return arg.name + "<br />" + "一般:" + data[0] + "<br />严重:" + data[1] + "<br />非常严重:" + data[2];
                 }*/
            },
            visualMap: {
                min: 0,
                max: d3.max(mapData, function (e) {
                    return e.value
                }),
                left: 'left',
                top: 'bottom',
                text: ['高', '低'],           // 文本，默认为数值文本
                calculable: true
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            series: [
                {
                    name: option.series[0].name,
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    itemStyle: {
                        normal: {label: {show: true}},
                        emphasis: {label: {show: true}}
                    },
                    data: mapData
                }
            ]
        };
        return mapOption;
    },
    chartTypes: [
        {"id": 1, "name": "表格", "typeName": "table", classId: "C200"},
        {"id": 2, "name": "指标卡", "typeName": "card"},
        {"id": 3, "name": "计量图", "typeName": "metering"},
        {"id": 4, "name": "折线图", "typeName": "brokenLine", classId: "C220"},
        {"id": 5, "name": "簇状柱型图", "typeName": "column1", classId: "C210"},
        {"id": 6, "name": "堆积柱型图", "typeName": "column2"},
        {"id": 7, "name": "百分比柱型图", "typeName": "column3"},
        {"id": 8, "name": "瀑布图", "typeName": "waterfall"},
        {"id": 9, "name": "条形图", "typeName": "bar"},
        {"id": 10, "name": "堆积条形图", "typeName": "bar2"},
        {"id": 11, "name": "百分比形图", "typeName": "bar3"},
        {"id": 12, "name": "桑基图", "typeName": "sankey"},
        {"id": 13, "name": "饼图", "typeName": "pie"},
        {"id": 14, "name": "地图(面积)", "typeName": "maparea", classId: "C271"},
        {"id": 15, "name": "地图(气泡)", "typeName": "mapbubble"},
        {"id": 16, "name": "雷达图", "typeName": "radar"},
        {"id": 17, "name": "双轴图", "typeName": "dualaxis"},
        {"id": 18, "name": "散点图", "typeName": "discrete"},
        {"id": 19, "name": "漏斗图", "typeName": "dropdown"},
        {"id": 20, "name": "云词", "typeName": "cloud"}
    ],
    typeFilter: [
        function () {
            //表格始终含有
            return {name: "表格", classId: "C200"}
        },
        function (level) {
            if (level.x.length <= 1 && level.y.length > 0) {
                return {name: "簇状柱型图", classId: "C210"}
            }
        },
        function (level) {
            //折线图,确保有只有一个x轴,并且要有y轴
            if (level.x.length == 1 && level.y.length > 0) {
                return {name: "折线图", classId: "C220"}
            }
        },
        function (level) {
            //折线图,确保有只有一个x轴,并且要有y轴
            if (level.x.length == 1 && level.y.length == 1 && level.x[0].map_column) {
                return {name: "地图(面积)", classId: "C271"}
            }
        }
    ],
    resetEChartDiv: function () {
        $(".zzjz-echart-div").height($(".zzjz-echart-div").parent().height() - $(".zzjz-axis-div").height());
        return this;
    },

    drawChart: function () {
        $.ajax({
            url: "../chart/update",
            type: "post",
            data: encodeURIComponent(JSON.stringify(chart)),
            dataType: "json",
            success: function (data) {
                try {
                    echart.dispose($(".zzjz-echart-div-right")[0]);
                } catch (e) {

                }
                var option = eval("(" + data.option + ")");
                debugger;
                echart = echarts.init($(".zzjz-echart-div-right")[0]);
                if (chart.meta.level[0].chart_type == "C271") {
                    echart.setOption(_chartConfig.parseMap(option));
                } else if (chart.meta.level[0].auto_flush) {
                    seriesFormat(option.series);
                    echart.setOption(option);
                    timeTicket(3000);
                } else {
                    echart.setOption(option);
                }
            }
        });
        return this;
    },
    addXAxis: function (jEle, refresh) {
        if (!chart.meta.level[0].x) {
            chart.meta.level[0].x = [];
        }
        chart.meta.level[0].x.push({
            name: $(jEle).attr("column_cn"),
            data_type: dataType[$(jEle).attr("column_type")],
            is_new: false,
            fid: $(jEle).attr("column_en"),
            granularity: $(jEle).attr("granularity") ? $(jEle).attr("granularity") : "day",
            is_build_aggregated: 0,
            uniq_id: $(jEle).attr("id"),
            map_column: $(jEle).attr("map_column")
        });
        this.resetEChartDiv();
        if (refresh) {
            this.drawChart();
        }
        this.parseType();
        return this;
    },
    removeAxis: function (jEle, refresh) {
        var uniqId = $(jEle).attr("id");
        for (var i = 0; i < chart.meta.level[0].x.length; i++) {
            if (chart.meta.level[0].x[i].uniq_id == uniqId) {
                chart.meta.level[0].x.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < chart.meta.level[0].y.length; i++) {
            if (chart.meta.level[0].y[i].uniq_id == uniqId) {
                chart.meta.level[0].y.splice(i, 1);
                break;
            }
        }
        $(jEle).remove();
        this.resetEChartDiv();
        if (refresh) {
            this.drawChart();
        }
        this.parseType();
        return this;
    },
    addYAxis: function (jEle, refresh) {
        if (!chart.meta.level[0].y) {
            chart.meta.level[0].y = [];
        }
        chart.meta.level[0].y.push({
            name: $(jEle).attr("column_cn"),
            data_type: dataType[$(jEle).attr("column_type")],
            aggregator: $(jEle).attr("formula"),
            aggregator_name: aggregatorName[$(jEle).attr("formula")],
            is_new: false,
            uniq_id: $(jEle).attr("id"),
            fid: $(jEle).attr("column_en"),
            is_build_aggregated: 0,
            formatter: {
                check: $(jEle).attr("check") ? $(jEle).attr("check") : "num",
                num: {
                    digit: $(jEle).attr("d-digit") ? $(jEle).attr("d-digit") * 1 : 0,
                    millesimal: $(jEle).attr("millesimal") ? true : false
                },
                percent: {
                    digit: $(jEle).attr("p-digit") ? $(jEle).attr("p-digit") * 1 : 0
                }
            },
            alias_name: $(jEle).text()
        });
        this.resetEChartDiv();
        if (refresh) {
            this.drawChart();
        }
        this.parseType();
        return this;
    },
    updateYAxis:function(jEle, refresh){
        var item = null;
        var targetId = $(jEle).attr("id");
        var items = chart.meta.level[0].y;
        for(var i = 0; i < items.length; i++){
            if(items[i].uniq_id == targetId){
                item = items[i];
            }
        }
        item.aggregator = $(jEle).attr("formula");
        item.aggregator_name = aggregatorName[$(jEle).attr("formula")];
        item.formatter = {
            check: $(jEle).attr("check") ? $(jEle).attr("check") : "num",
            num: {
                digit: $(jEle).attr("d-digit") ? $(jEle).attr("d-digit") * 1 : 0,
                millesimal: $(jEle).attr("millesimal") ? true : false
            },
            percent: {
                digit: $(jEle).attr("p-digit") ? $(jEle).attr("p-digit") * 1 : 0
            }
        }
        if(refresh){
            this.drawChart();
        }
        return this;
    }
};

var seriesTotal = [];

function seriesFormat(series) {
    $.each(series, function (i) {
        var seriesData = this;
        $.each(seriesData.data, function (j) {
            this.name = new Date(this.name);
            this.value[0] = this.name;
            if (i == series.length - 1 && j == seriesData.data.length - 1) {
                chart.meta.level[0].last_time = this.name;
            }
        });
        if (seriesTotal[i]) {
            seriesTotal[i].data.push(seriesData.data);
        } else {
            seriesTotal[i] = seriesData;
        }

    });
}
function timeTicket(time) {
    setInterval(function () {
        $.each(seriesTotal, function () {
            if(this.data.length>5){
                for (var i = 0; i < 5; i++) {
                    this.data.shift();
                }
            }

        });
        $.ajax({
            url: "../chart/update",
            type: "post",
            data: encodeURIComponent(JSON.stringify(chart)),
            dataType: "json",
            success: function (data) {
                var itemOption = ("(" + data.option + ")");
                if (itemOption.series) {
                    seriesFormat(itemOption.series);
                }
            }
        });

        echart.setOption({
            series: seriesTotal
        });
    }, time);
}

