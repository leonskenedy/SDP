$(document).ready(function(){
    var panelIds = {
        bodyCenter: "body_panel_center",
        chartTop: "chart_panel_top",
        chartWest: "chart_panel_west",
        chartCenter: "chart_panel_center",
        chartEast: "chart_panel_east",
        chartColumnTop: "chart_column_panel_top",
        chartColumnCenter: "chart_column_panel_center"
    };
    /**
     * define body layout
     */
    $("body").layout({fit:true});
    $("body").layout("add", {
        region:"west",
        width:100
    });
    $("body").layout("add", {
        region:"center",
        id: panelIds.bodyCenter
    });
    /**
     * define chart layout
     */
    $("#" + panelIds.bodyCenter).layout({fit:true});
    $("#" + panelIds.bodyCenter).layout("add",{
        region:"north",
        height: 60,
        border: false,
        id: panelIds.chartTop
    });
    $("#" + panelIds.chartTop).append(
        $("<div class='zzjz-faked-line-bottom'></div>")
    )
    $("#" + panelIds.bodyCenter).layout("add",{
        region:"west",
        border: false,
        width: 150,
        id: panelIds.chartWest
    });
    $("#" + panelIds.bodyCenter).layout("add",{
        region:"center",
        border: false,
        id: panelIds.chartCenter
    });
    $("#" + panelIds.chartCenter).append(
        $("<div class='zzjz-faked-line-left'></div>")
    ).append(
        $("<div></div>").attr("class", "zzjz-axis-div")
            .append($("<div></div>").attr("class", "zzjz-xaxis-div"))
            .append($("<div></div>").attr("class", "zzjz-yaxis-div"))
    );
    $("#" + panelIds.chartCenter).append(
        $("<div class='zzjz-echart-div'></div>")
    );

    //resetEChartDiv();
    $("<div class='zzjz-faked-line-bottom'></div>").appendTo($(".zzjz-xaxis-div"))
    $("<a></a>").attr("class", "zzjz-axis-leader").linkbutton({
        plain:true,
        text: "维度"
    }).appendTo($(".zzjz-xaxis-div"));
    $("<div class='zzjz-faked-line-bottom'></div>").appendTo($(".zzjz-yaxis-div"))
    $("<a></a>").attr("class", "zzjz-axis-leader").linkbutton({
        plain:true,
        text: "数值"
    }).appendTo($(".zzjz-yaxis-div"))

    $("#" + panelIds.bodyCenter).layout("add",{
        region:"east",
        border: false,
        width: 200,
        id: panelIds.chartEast
    });
    $("#" + panelIds.chartEast).append(
        $("<div class='zzjz-faked-line-left'></div>")
    )

    /**
     * define chart column layout
     */
    $("#" + panelIds.chartWest).layout({fit:true});
    $("#" + panelIds.chartWest).layout("add",{
        region: "north",
        height: 80,
        border: false,
        id: panelIds.chartColumnTop
    });
    $("#" + panelIds.chartWest).layout("add",{
        region: "west",
        border: false,
        id: panelIds.chartColumnCenter
    });
    $("#" + panelIds.chartColumnTop).append(
        $("<div class='zzjz-faked-line-bottom'></div>")
    ).append(
        $("<div class='zzjz-title-div'></div>").text("工作表")
    ).append(
        $("<div style='margin: 5px'></div>").append($("<input />").attr("id", "chart_sheet_name"))
    );
    $("#chart_sheet_name").textbox({
        buttonText:'切换',
        buttonIcon:'icon-edit',
        width: 139,
        editable: false
    }).textbox("setText", "测试表格长度过长的情况会是什么样").textbox("button").bind("click", function(e){
        alert("xxx")
    });

    $("#" + panelIds.chartColumnCenter).append(
        $("<div class='zzjz-title-div'></div>").text("字段")
    ).append(
        $("<div></div>").attr("id", "chart_column_list")
    );
    /**
     * 1:number, 2:string, 3:date
     */
    var columnData = [
        {column_cn:"名称", column_en:"name", column_type:2},
        {column_cn:"日期", column_en:"time", column_type:3},
        {column_cn:"价格（元/公斤）", column_en:"price", column_type:1},
        {column_cn:"类别", column_en:"type", column_type:2},
        {column_cn:"出售方式", column_en:"selltype", column_type:2}
    ]
    $("#chart_column_list").datalist({
        valueField: "value",
        textField: "name",
        data:columnData,
        textFormatter:function(value,row,index){
            return $("<div></div>").append(
                $("<div></div>").attr("class", "zzjz-column-div").attr("column_cn", row.column_cn)
                    .attr("column_en", row.column_en).attr("column_type", row.column_type)
                    .append($("<span></span>").attr("class", "l-btn-left l-btn-icon-left").append($("<span></span>").attr("class", "l-btn-text").text(row.column_cn))
                        .append($("<span></span>").attr("class", "l-btn-icon icon-data-type-"+row.column_type)))
            ).html();
        }
    })
    //setupColumns($("#chart_column_list"))
    //alert("cccc")
    //drag-drop
    $(".zzjz-column-div").draggable({
        revert:true,
        proxy: function(source){
            var p = $('<div class="zzjz-column-div" style="border:1px solid #ccc;overflow: hidden;width: 95px"></div>');
            p.attr("column_en", $(source).attr("column_en"));
            p.attr("column_type", $(source).attr("column_type"));
            p.attr("column_cn", $(source).attr("column_cn"))
            p.html($(source).html()).appendTo('body');
            return p;
        },
        onStartDrag:function(){
            //$(this).draggable('options').cursor = 'not-allowed';
            $(this).draggable('proxy').css('z-index',10).css("background-color", "steelblue");
        }
    })
    $(".zzjz-yaxis-div").droppable({
        accept: ".zzjz-column-div",
        onDragEnter:function(e,source){
            //$(source).draggable('options').cursor='auto';
            $(source).draggable('proxy').css('border','1px solid red');
            $(this).addClass('zzjz-axis-over');
        },
        onDragLeave:function(e,source){
            //$(source).draggable('options').cursor='not-allowed';
            $(source).draggable('proxy').css('border','1px solid #ccc');
            $(this).removeClass('zzjz-axis-over');
        },
        onDrop:function(e,source){
            var data = {
                column_en: $(source).attr("column_en"),
                column_cn: $(source).attr("column_cn"),
                column_type: $(source).attr("column_type"),
                formula: "COUNT",
                id: +new Date(),
                class: "zzjz-axis-item"
            }
            var axisItem = $("<a></a>");
            for(var prop in data){
                axisItem.attr(prop, data[prop]);
            }
            $(this).append(axisItem);
            $("#"+data.id).menubutton({
                plain: true,
                text: data.column_cn + " (计数)",
                hasDownArrow: false,
                menu:"#mm"
            })
            $(this).removeClass('zzjz-axis-over');
            resetEChartDiv();
            gatherData();
        }
    });


    $(".zzjz-xaxis-div").droppable({
        accept: ".zzjz-column-div",
        onDragEnter:function(e,source){
            //$(source).draggable('options').cursor='auto';
            $(source).draggable('proxy').css('border','1px solid red');
            $(this).addClass('zzjz-axis-over');
        },
        onDragLeave:function(e,source){
            //$(source).draggable('options').cursor='not-allowed';
            $(source).draggable('proxy').css('border','1px solid #ccc');
            $(this).removeClass('zzjz-axis-over');
        },
        onDrop:function(e,source){
            var data = {
                column_en: $(source).attr("column_en"),
                column_cn: $(source).attr("column_cn"),
                column_type: $(source).attr("column_type"),
                class: "zzjz-axis-item",
                id: +new Date()
            }
            var axisItem = $("<a></a>");
            for(var prop in data){
                axisItem.attr(prop, data[prop]);
            }
            $(this).append(axisItem);
            $("#"+data.id).menubutton({
                plain: true,
                text: data.column_cn,
                hasDownArrow: false
            })
            $(this).removeClass('zzjz-axis-over');
        }
    });
    $('#mm').menu({
        minWidth: 70,
        onClick:function(item){
            //console.log($(".zzjz-axis-item:hover"))
            window._hoverItem.attr("formula", item.name);
            _hoverItem.find(".l-btn-text").text(_hoverItem.attr("column_cn") + " ("+ item.text+")");
            resetEChartDiv();
            gatherData();
        },
        onShow: function(){
            $("[formula]").removeClass("zzjz-axis-item-selected");
            window._hoverItem = $(".zzjz-axis-item:hover");
            if( window._hoverItem.attr("column_type") != "1"){
                //$("#mm").menu("hideItem", $("#mm").menu("findItem", "AVG"));
                $("#mm").menu("disableItem", $("#mm [formula=AVG]")[0]);
                $("#mm").menu("disableItem", $("#mm [formula=SUM]")[0]);
                //console.log(dis)
            }else{
                $("#mm").menu("enableItem", $("#mm [formula=AVG]")[0]);
                $("#mm").menu("enableItem", $("#mm [formula=SUM]")[0]);
            }
            $("#mm [formula="+ window._hoverItem.attr("formula")+"]").addClass("zzjz-axis-item-selected");
        },
        onHide: function(){
        }
    });
    resetEChartDiv();
});

function resetEChartDiv(){
    $(".zzjz-echart-div").height($(".zzjz-echart-div").parent().height() - $(".zzjz-axis-div").height() - 2);
}
function gatherData(){
    chart.meta.level[0].y = [];
    chart.meta.level[0].x = [];
    $(".zzjz-yaxis-div .zzjz-axis-item").each(function(){
        chart.meta.level[0].y.push({
            name: $(this).attr("column_cn"),
            data_type: dataType[$(this).attr("column_type")],
            aggregator: $(this).attr("formula"),
            aggregator_name: aggregatorName[$(this).attr("formula")],
            is_new:false,
            uniq_id: 1457575285931,
            fid: $(this).attr("column_en"),
            is_build_aggregated: 0,
            formatter: {
                check: "num",
                num:{
                    digit:1,
                    millesimal: true
                },
                percent:{
                    digit:0
                }
            },
            alias_name: $(this).text(),
            advance_aggregator: {
                type: "percentage"
            }
        })
    });

    $(".zzjz-xaxis-div .zzjz-axis-item").each(function(){
        chart.meta.level[0].x.push({
            name: $(this).attr("column_cn"),
            data_type: dataType[$(this).attr("column_type")],
            is_new:false,
            fid: $(this).attr("column_en"),
            granularity: "day",
            is_build_aggregated: 0
        })
    })
    $.ajax({
        url: "../chart/update",
        type:"post",
        data:JSON.stringify(chart),
        dataType:"json",
        success:function(data){
            try{
                echart.dispose($(".zzjz-echart-div")[0]);
            }catch (e){

            }
            echart = echarts.init($(".zzjz-echart-div")[0]);
            console.log(eval("("+data.option+")"))
            echart.setOption(eval("("+data.option+")"));
        }
    })
}
var echart = null;
var dataType = {
    "1":"number","2":"string","3":"date"
};
var aggregatorName = {
    SUM:"求和", AVG:"平均值", COUNT:"计数", DISTINCT_COUNT:"去重计数"
}
var chart = {
    "meta": {
        "level_fields": [],//
        "level": [
            {
                "show_y_axis_optional": false,
                "sort": {
                    "axis": "y",
                    "type": "asc",
                    "fid": "fk165862ea",
                    "uniq_id": 1457418558891,
                    "col_index": 1
                },
                "top_compare": {
                    "enabled": false,
                    "reversed": 0,
                    "type": "items",
                    "value": 0
                },
                "yaxis_max_disabled": true,
                "yaxis_unit": "元",
                "yaxis_max": 14134370.080002,
                "top": {
                    "enabled": false,
                    "reversed": "0",
                    "type": "percent",
                    "value": 2
                },
                "guide_line": [],
                "y": [
                    {
                        "name": "价格（元/公斤）",
                        "data_type": "number",
                        "aggregator": "COUNT_DISTINCT",
                        "aggregator_name": "去重计数",
                        "is_new": false,
                        "uniq_id": 1457575285931,
                        "fid": "price",
                        "is_build_aggregated": 0,
                        "formatter": "",
                        "alias_name": "价格（元/公斤）(去重计数)"
                    },
                    {
                        "fid": "price",
                        "uniq_id": 1457584118006,
                        "name": "价格（元/公斤）",
                        "data_type": "number",
                        "is_new": false,
                        "is_build_aggregated": 0,
                        "aggregator": "SUM",
                        "aggregator_name": "求和",
                        "formatter": ""
                    }
                ],
                "title_formula": "AVERAGE",
                "chart_type": "C210",
                "yaxis_min": 0,
                "yaxis_min_disabled": true,
                "x": [
                    {
                        "name": "类别",
                        "data_type": "string",
                        "is_new": false,
                        "fid": "type",
                        "granularity": "day",
                        "is_build_aggregated": 0
                    }
                ],
                "yaxis_name": "价格（元/公斤）A"
            }
        ],
        "filter_list": [],
        "filter_list_inner": {
            "0": []
        }
    },
    "name": "图标名称123",
    "tb_id": "product",
    "table_name":"产品",
    "description": ""
};