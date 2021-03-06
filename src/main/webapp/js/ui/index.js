$(document).ready(function(){
    //_chartConfig.fetchDefinition("1234-abcd-2345-bcde-3456-cdef");
    _chartConfig.fetchDefinition("1234-UIJK-2345-bcde-3456-cdef");
    //return;
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
    $("#container").layout({fit:true});
    $("#container").layout("add", {
        region:"west",
        width:100
    });
    $("#container").layout("add", {
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
            .append($("<div style='display: none'></div>").attr("class", "zzjz-level-div"))
            .append($("<div></div>").attr("class", "zzjz-xaxis-div"))
            .append($("<div></div>").attr("class", "zzjz-yaxis-div"))
    );
    $("#" + panelIds.chartCenter).append(
        $("<div class='zzjz-echart-div'></div>")
    );

    //resetEChartDiv();
    $("<div class='zzjz-faked-line-bottom'></div>").appendTo($(".zzjz-level-div"))
    $("<a></a>").attr("class", "zzjz-axis-leader").linkbutton({
        plain:true,
        text: "层级"
    }).appendTo($(".zzjz-level-div"));
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
        {column_cn:"出售方式", column_en:"selltype", column_type:2},
        {column_cn:"省/直辖", column_en:"province", column_type:2, map_column: true},
        {column_cn:"城市", column_en:"city", column_type:2, map_column: true}
    ]
    $("#chart_column_list").datalist({
        valueField: "value",
        textField: "name",
        data:columnData,
        textFormatter:function(value,row,index){
            return $("<div></div>").append(
                $("<div></div>").attr("class", "zzjz-column-div").attr("column_cn", row.column_cn)
                    .attr("column_en", row.column_en).attr("column_type", row.column_type).attr("map_column", row.map_column?"true":"")
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
            });
            $("#"+data.id).draggable({
                revert:true,
                proxy: function(source){
                    var p = $(source).clone();
                    p.appendTo($("body"))
                    return p;
                }
            })

            $(this).removeClass('zzjz-axis-over');
            _chartConfig.addYAxis($("#"+data.id)).resetEChartDiv().drawChart();
        }
    });


    $(".zzjz-xaxis-div").droppable({
        accept: ".zzjz-column-div",
        onDragEnter:function(e,source){
            $(source).draggable('proxy').css('border','1px solid red');
            $(this).addClass('zzjz-axis-over');

        },
        onDragOver:function(e, source){
            $(source).draggable('proxy').css('border','1px solid red');
            $(this).addClass('zzjz-axis-over');
        },
        onDragLeave:function(e,source){
            $(source).draggable('proxy').css('border','1px solid #ccc');
            $(this).removeClass('zzjz-axis-over');
        },
        onDrop:function(e,source){
            if(window._dropped){
                window._dropped = false;
                return;
            }else{
                window._dropped = false;
            }
            var columnType = $(source).attr("column_type");
            var data = {
                name: $(source).attr("column_cn"),
                data_type:  columnType == "1" ? "number" : (columnType=="2"?"string":"date"),
                is_new: false,
                fid: $(source).attr("column_en"),
                is_build_aggregated: 0,
                uniq_id: _chartConfig.generateId(),
                map_column: $(source).attr("map_column")
            }
            if(data.data_type == "date"){
                data.granularity = "day"
            }
            var element = document.createElement("a");
            _chartConfig.bind(element, data);
            _chartConfig.xAxis.append(element, true);
            $(this).removeClass('zzjz-axis-over');
        }
    });
    $('#mm').menu({
        minWidth: 70,
        onClick:function(item){
            if(item.name == "order"){
                return;
            }
            if(item.name == "VALUE_FORMAT"){
                $("#value_format_dialog").dialog("open")
                return;
            }
            if(item.name.search("_seq") > -1){
                var sort = chart.meta.level[0].sort;

                $(".zzjz-yaxis-div").find(".zzjz-axis-item").linkbutton({iconCls:""});
                sort.fid = _hoverItem.attr("column_en");
                sort.uniq_id = _hoverItem.attr("id");
                sort.axis = "y";
                switch (item.name){
                    case "default_seq":
                        _hoverItem.linkbutton({iconCls:""});
                        sort.type = "";
                        break;
                    case "desc_seq":
                        _hoverItem.linkbutton({iconCls:"icon-desc"});
                        sort.type = "desc";
                        break;
                    case "asc_seq":
                        _hoverItem.linkbutton({iconCls:"icon-asc"});
                        sort.type = "asc";
                        break;
                }
                _chartConfig.drawChart();
                return;
            }
            window._hoverItem.attr("formula", item.name);
            _hoverItem.find(".l-btn-text").text(_hoverItem.attr("column_cn") + " ("+ item.text+")");
            _chartConfig.updateYAxis(_hoverItem, true);
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
    $('#mm').menu('appendItem', {
        separator: true
    });
    $('#mm').menu("appendItem",{
        name:"order",
        text:"排序",
        id:"mm_order"
    });
    $('#mm').menu("appendItem",{
        parent: $("#mm_order")[0],
        name:"default_seq",
        text:"默认"
    });
    $('#mm').menu("appendItem",{
        parent: $("#mm_order")[0],
        name:"asc_seq",
        text:"升序"
    });
    $('#mm').menu("appendItem",{
        parent: $("#mm_order")[0],
        name:"desc_seq",
        text:"降序"
    });
    initXAxisMenu();
    initPathMenu();
    _chartConfig.resetEChartDiv();
    $("#value_format_dialog").dialog({
        buttons: [{
            text:'保存',
            iconCls:'icon-ok',
            handler:function(){
                //_hoverItem.removeAttr("check").removeAttr("d-digit").removeAttr("p-digit").removeAttr("millesimal");
                _hoverItem.attr("check", "num").attr("d-digit", "1").attr("p-digit", "0").attr("millesimal", "true")
                var check = $("#value_format_dialog input[name=format_number]:checked");
                if(check.length > 0){
                    if(check.attr("id") == "format_number"){
                        _hoverItem.attr("check", "num")
                    }else{
                        _hoverItem.attr("check", "percent")
                    }
                    var dDigit = $("#number_precision").numberspinner("getValue");
                    _hoverItem.attr("d-digit", dDigit? dDigit : "1");
                    var pDigit = $("#percent_precision").numberspinner("getValue");
                    _hoverItem.attr("p-digit", pDigit? pDigit : "1");
                    if($("#thousand_sep").prop("checked")){
                        _hoverItem.attr("millesimal", "true");
                    }else{
                        _hoverItem.attr("millesimal", "");
                    }
                }
                $("#value_format_dialog").dialog("close");
                _chartConfig.drawChart();
            }
        },{
            text:'取消',
            handler:function(){
                $("#value_format_dialog").dialog("close");
            }
        }],
        onOpen:function(){
            $("#value_format_dialog").find("input[type=radio]").prop("checked", false);
            $("#value_format_dialog").find("input[type=checkbox]").prop("checked", false);
            $("#number_precision").numberspinner("setValue", "");
            $("#percent_precision").numberspinner("setValue", "");
            var check = _hoverItem.attr("check");
            var millesimal = _hoverItem.attr("millesimal");
            if(check == "num"){
                $("#value_format_dialog input[id=format_number]").prop("checked", true);
                $("#number_precision").numberspinner("setValue", _hoverItem.attr("d-digit")?_hoverItem.attr("d-digit"):"");
                if(millesimal){
                    $("#value_format_dialog input[id=thousand_sep]").prop("checked", true);
                }
            }else if(check == "percent"){
                $("#value_format_dialog input[id=format_percent]").prop("checked", true);
                $("#percent_precision").numberspinner("setValue", _hoverItem.attr("p-digit")? _hoverItem.attr("p-digit") : "");
            }
        }
    });
    $("#value_format_dialog input[name=format_number]").bind("change", function(){
        var id = $(this).attr("id");
        if(id == "format_number"){
            $("#percent_precision").numberspinner("setValue", "").numberspinner("disable");
            $("#value_format_dialog input[id=thousand_sep]").prop("checked", false).prop("disabled", false);
            $("#number_precision").numberspinner("setValue", "").numberspinner("enable");
        }else{
            $("#number_precision").numberspinner("setValue", "").numberspinner("disable");
            $("#percent_precision").numberspinner("setValue", "").numberspinner("enable");
            $("#value_format_dialog input[id=thousand_sep]").prop("checked", false).prop("disabled", true);
        }
    });


    /**
     * chart east layout definition
     */
        //chart title
    $("<div style='position: relative'></div>").attr("id", "chart_name_div").append(
        $("<div></div>").attr("class", "zzjz-title-div").text("图表标题")
    ).append(
        $("<div style='margin: 5px'></div>").append($("<input />").attr("id", "chart_name"))
    ).append(
        $("<div></div>").attr("class", "zzjz-faked-line-bottom")
    ).append(
        $("<div style='height: 10px'></div>")
    ).appendTo($("#"+panelIds.chartEast));
    $("#chart_name").textbox({}).textbox("setValue", "未命名图表");
    //chart type
    $("<div style='position: relative'></div>").attr("id", "chart_type_div").append(
        $("<div></div>").attr("class", "zzjz-title-div").text("图表类型")
    ).append(
        $("<div></div>").append($("<ul></ul>").attr("class", "zzjz-chart-type-ul"))
    ).append(
        $("<div style='height: 10px'></div>")
    ).append(
        $("<div></div>").attr("class", "zzjz-faked-line-bottom")
    ).appendTo($("#"+panelIds.chartEast));
    var chartTypeUl = $(".zzjz-chart-type-ul");
    var chartTypes = _chartConfig.chartTypes.map(function(t){if(t.classId){return t;}});
    for(var i = 0; i < chartTypes.length; i++){
        if(chartTypes[i]){
            $("<li></li>").append(
                $("<span></span>").attr("class", "zzjz-chart-type zzjz-chart-type-"+chartTypes[i].typeName)
                    .attr("class_id", chartTypes[i].classId).attr("original_class", "zzjz-chart-type-"+chartTypes[i].typeName)
            ).appendTo(chartTypeUl);
        }
    };

    $(".zzjz-chart-type").bind("click", function(){
        if($(this).hasClass("zzjz-chart-type-active")){
            return;
        }
        if($(this).hasClass($(this).attr("original_class")+"-selective")){
            $("span[class_id]").removeClass("zzjz-chart-type-active");
            $(this).addClass("zzjz-chart-type-active");
            _chartConfig.definition.meta.level[0].chart_type = $(this).attr("class_id");
            //chart.meta.level[0].chart_type = $(this).attr("class_id");
            _chartConfig.drawChart();
        }
    })

    //chart subline
    $("<div style='position: relative'></div>").attr("id", "chart_subline_div").append(
        $("<div></div>").attr("class", "zzjz-title-div").text("辅助线").append($("<a style='float: right'></a>"))
    ).append($("<div style='height: 10px'></div>")).append(
        $("<div></div>").attr("class", "zzjz-faked-line-bottom")
    ).appendTo($("#"+panelIds.chartEast));
    $("#chart_subline_div").find(".zzjz-title-div").find("a").linkbutton({
        iconCls: 'icon-edit',
        plain:true,
        onClick:function(){
            $("#chart_subline_dialog").dialog("open");
        }
    });
    $("#chart_subline_dialog").dialog({
        toolbar: [{
            text:'新增',
            iconCls:'icon-add',
            handler:function(){
                setupSubline(+new Date())
            }
        }],
        buttons:[
            {
                text:'保存',
                iconCls:'icon-ok',
                handler:function(){
                    var sublines = $("#chart_subline_dialog").find(".zzjz-edit-subline-div");
                    if(sublines.length == 0){
                        $.messager.alert('提示','没有需要创建的辅助线','info');
                        return;
                    }
                    var results = [];
                    var flag = true;
                    var message = "";
                    sublines.each(function(index){
                        var obj = {};
                        if(flag){
                            obj.name = $(this).find(".zzjz-chart-subline-name").textbox("getValue");
                            if(obj.name == "" || obj.name == null){
                                flag = false;
                                message = "第"+(index+1)+"条名称为空";
                            }
                            obj.value_type = $(this).find(".zzjz-chart-subline-type").combobox("getValue");
                            obj.value_type_text = $(this).find(".zzjz-chart-subline-type").combobox("getText");
                            if(obj.value_type == "calculate"){
                                obj.value = "";
                                obj.uniq_id = $(this).find(".zzjz-chart-subline-axis").combobox("getValue");
                                obj.fid = $("#" + obj.uniq_id).attr("column_en");
                                obj.text = $("#" + obj.uniq_id).text();
                                obj.is_build_aggregated = 0;
                                obj.formula = $(this).find(".zzjz-chart-subline-axis-value").combobox("getValue");
                                obj.formula_text = $(this).find(".zzjz-chart-subline-axis-value").combobox("getText");
                            }else{
                                obj.value = $(this).find(".zzjz-chart-subline-value").textbox("getValue");
                                if(obj.value == "" || isNaN(obj.value * 1)){
                                    flag = false;
                                    message = "第"+(index+1)+"条,请选择正确的数值";
                                }
                                obj.value *= 1;
                                obj.fid = $(".zzjz-yaxis-div .zzjz-axis-item").first().attr("column_en");
                                obj.uniq_id = $(".zzjz-yaxis-div .zzjz-axis-item").first().attr("id")
                            }
                            results.push(obj);
                        }
                    });
                    if(!flag){
                        $.messager.alert('错误',message,'error');
                        return;
                    }
                    chart.meta.level[0].guide_line = results;
                    var currentList = $("#chart_subline_div").find("#chart_subline_datalist");
                    if(currentList.length > 0){
                        currentList.datalist("destroy");
                    }
                    $("#chart_subline_div").find(".zzjz-title-div").after($("<div></div>").attr("id", "chart_subline_datalist"));
                    $("#chart_subline_datalist").datalist({
                        data:results,
                        textField:"value_type_text",
                        valueField:"name",
                        textFormatter:function(value, row, index){
                            var div = $("<div></div>");
                            div.append($("<div></div>").attr("class", "zzjz-one-third-div").text(row.name));
                            if(row.value_type == "calculate"){
                                div.append($("<div></div>").attr("class", "zzjz-one-third-div").text(row.text));
                                div.append($("<div></div>").attr("class", "zzjz-one-third-div").text(row.formula_text));
                            }else{
                                div.append($("<div></div>").attr("class", "zzjz-one-third-div").text(row.value));
                            }
                            return "<div>" + div.html() + "</div>";
                        }
                    });
                    _chartConfig.drawChart();
                    $("#chart_subline_dialog").dialog("close");
                }
            },{
                text:'取消',
                handler:function(){
                    $("#chart_subline_dialog").dialog("close");
                }
            }
        ]
    });

    //chart data number limit
    $("<div style='position: relative'></div>").attr("id", "chart_number_limit_div").append(
        $("<div></div>").attr("class", "zzjz-title-div")
            .append($("<input type='checkbox' id='limit_check' class='zzjz-checkbox' />"))
            .append($("<label class='zzjz-label-check'></label>").text("维度条件显示").attr("for", "limit_check"))
    ).append(
        $("<div id='limit_num_operate_div' style='display: none;margin: 5px'></div>").append(
            $("<select id='limit_type'></select>").append($("<option selected></option>").text("前").attr("value", "forward"))
                .append($("<option></option>").text("后").attr("value", "backward"))
        ).append($("<input id='limit_spinner' />")).append(
            $("<select id='limit_unit'></select>").append($("<option selected />").text("项目").attr("value", "items"))
                .append($("<option selected />").text("%").attr("value", "percent"))
        )
    ).append($("<div style='height: 10px'></div>")).append(
        $("<div></div>").attr("class", "zzjz-faked-line-bottom")
    ).appendTo($("#"+panelIds.chartEast));
    $("#limit_type").add($("#limit_unit")).combobox({
        width:50,
        panelHeight:55,
        onChange:function(nValue, oValue){
            var item = chart.meta.level[0].top;
            switch (nValue){
                case "forward": item.reversed = 0;break;
                case "backward": item.reversed = 1;break;
                case "percent": item.type = "percent";break;
                case "items": item.type = "items";break;
            }
            _chartConfig.drawChart();
        }
    });
    $('#limit_spinner').numberspinner({
        min: 1,
        width:60,
        onChange:function(nValue, oValue){
            chart.meta.level[0].top.value = nValue;
        }
    }).numberspinner("setValue", "10");
    $("#limit_check").bind("change", function(){
        if($(this).prop("checked")){
            $("#limit_num_operate_div").show()
            chart.meta.level[0].top.enabled = true;
        }else{
            $("#limit_num_operate_div").hide()
            chart.meta.level[0].top.enabled = false;
        }
    });
    //动态折线
    $("<div style='position: relative'></div>").attr("id", "dynamic_line_div").append(
        $("<div></div>").attr("class", "zzjz-title-div")
            .append($("<input type='checkbox' id='dynamic_check' class='zzjz-checkbox' />"))
            .append($("<label class='zzjz-label-check'></label>").text("动态显示").attr("for", "dynamic_check"))
    ).append(
        $("<div id='dynamic_line_operate_div' style='display: none;'></div>").append(
            $("<div style='margin: 5px'><span>起始:</span><input id='dynamic_start' class='zzjz-dynamic-date' /></div>")
        ).append(
            $("<div style='margin: 5px'><span>结束:</span><input id='dynamic_end' class='zzjz-dynamic-date' /></div>")
        )
    ).append($("<div style='height: 10px'></div>")).append(
        $("<div></div>").attr("class", "zzjz-faked-line-bottom")
    ).appendTo($("#"+panelIds.chartEast));
    var timeFormat = d3.time.format("%Y-%m-%d %H:%M:%S")

    $("#dynamic_line_div").find(".zzjz-dynamic-date").datetimebox({
        formatter:function (date){
            return timeFormat(date);
        },
        parser:function(s){
            if (!s) return new Date();
            return new Date(Date.parse(s));
        },
        showSeconds: true,
        width:150
    });
    $("#dynamic_check").bind("change", function(){
        if($(this).prop("checked")){
            $("#dynamic_line_operate_div").show();
            var now = new Date();
            now.setTime(now.getTime() - 24*60*60*1000);
            $("#dynamic_start").datetimebox("setValue", now);
            now.setTime(now.getTime() + 24*60*60*1000);
            $("#dynamic_end").datetimebox("setValue", new Date());
            _chartConfig.definition.meta.level[0].auto_flush = true;
        }else{
            $("#dynamic_line_operate_div").hide()
            _chartConfig.definition.meta.level[0].auto_flush = false;
        }
    });
    $(".zzjz-echart-div").append(
        $("<div class='zzjz-echart-div-left' style='position: absolute;left: 0px;top:0px;bottom: 0px;width: 200px;border-right: 1px solid #95B8E7;'></div>")
    ).append(
        $("<div class='zzjz-echart-div-right' style='position: absolute;left: 200px;top:0px;bottom: 0px;right: 0px;'></div>")
    )

    $(".zzjz-echart-div-left").append(
        $("<div class='zzjz-data-filter'></div>").append(
            $("<div class='zzjz-title-div' style='margin: 0;padding: 5px 5px 10px 5px;'></div>").text("筛选器"))
            .append($("<div class='zzjz-filter-data-panel-div'></div>"))
    );

    $(".zzjz-data-filter").droppable({
        accept: ".zzjz-column-div",
        onDragEnter:function(e,source){
            //$(source).draggable('options').cursor='auto';
            $(source).draggable('proxy').css('border','1px solid red');
            $(this).addClass('zzjz-axis-over');
            debugger;
        },
        onDragLeave:function(e,source){
            //$(source).draggable('options').cursor='not-allowed';
            $(source).draggable('proxy').css('border','1px solid #ccc');
            $(this).removeClass('zzjz-axis-over');
        },
        onDrop:function(e,source){
            $(this).removeClass('zzjz-axis-over');
            var columnEn = $(source).attr("column_en");
            var columnType = $(source).attr("column_type");
            window._filterConfig = {isEdit: false, columnEn: columnEn, columnType: columnType, columnCn: $(source).attr("column_cn")}
            initFilter(columnEn, columnType);
        }
    });
    setupDataFilter();



    $(".zzjz-echart-div-right").droppable({
        accept: ".zzjz-axis-item",
        onDragEnter:function(e,source){
            $(source).draggable('proxy').css("color", "red").find(".l-btn-text").css('text-decoration','line-through');
        },
        onDragLeave:function(e,source){
            $(source).draggable('proxy').css("color", "").find(".l-btn-text").css('text-decoration','none');
        },onDrop:function(e,source){
            _chartConfig.removeAxis(source).resetEChartDiv();
            setTimeout(function(){
                _chartConfig.drawChart();
            }, 1000)
        }
    });


    _chartConfig.init();

});
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
//                    {
//                        "name": "价格（元/公斤）",
//                        "data_type": "number",
//                        "aggregator": "COUNT_DISTINCT",
//                        "aggregator_name": "去重计数",
//                        "is_new": false,
//                        "uniq_id": 1457575285931,
//                        "fid": "price",
//                        "is_build_aggregated": 0,
//                        "formatter": "",
//                        "alias_name": "价格（元/公斤）(去重计数)"
//                    },
//                    {
//                        "fid": "price",
//                        "uniq_id": 1457584118006,
//                        "name": "价格（元/公斤）",
//                        "data_type": "number",
//                        "is_new": false,
//                        "is_build_aggregated": 0,
//                        "aggregator": "SUM",
//                        "aggregator_name": "求和",
//                        "formatter": ""
//                    }
                ],
                "title_formula": "AVERAGE",
                "chart_type": "C210",
                "yaxis_min": 0,
                "yaxis_min_disabled": true,
                "x": [
//                    {
//                        "name": "类别",
//                        "data_type": "string",
//                        "is_new": false,
//                        "fid": "type",
//                        "granularity": "day",
//                        "is_build_aggregated": 0
//                    }
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

var xAxisMenuData = [
    {text:"按年", name:"year"},
    {text:"按季", name:"quarter"},
    {text:"按月", name:"month"},
    {text:"按周", name:"week"},
    {text:"按日", name:"day"},
    {text:"更多", name:"more", children:[
        {text:"按时", name:"hour"},
        {text:"按分", name:"minute"},
        {text:"按秒", name:"second"}
    ]},
    {text:"自定义", name:"manual"}
];

function initXAxisMenu(){
    var menu = $("<div></div>").attr("id", "mm_xaxis").appendTo($("body"));
    menu.menu({
        miniWidth:80,
        onClick:function(item){
            if($(item.target).attr("hasChild")){
                return;
            }else{
                _hoverItem.attr("granularity", item.name);
                _hoverItem[0].__zzjz__.granularity = item.name;
                _hoverItem.find(".l-btn-text").text(_hoverItem.attr("column_cn") + " ("+ item.text+")");
                _chartConfig.drawChart();
            }
        },
        onShow: function(){
            $("[by]").removeClass("zzjz-axis-item-selected");
            window._hoverItem = $(".zzjz-axis-item:hover");

            $("[by="+ window._hoverItem.attr("granularity")+"]").addClass("zzjz-axis-item-selected");
        }
    });

    for(var i = 0; i < xAxisMenuData.length; i++){
        menu.menu("appendItem", {
            text: xAxisMenuData[i].text,
            name:xAxisMenuData[i].name,
            id: "xaxis_menu_"+xAxisMenuData[i].name
        });
        $("#xaxis_menu_"+xAxisMenuData[i].name).attr("by", xAxisMenuData[i].name)
        if(xAxisMenuData[i].children){
            $("#xaxis_menu_"+xAxisMenuData[i].name).attr("hasChild", "true")
            for(var k = 0; k < xAxisMenuData[i].children.length; k++){
                menu.menu("appendItem", {
                    parent: $("#xaxis_menu_"+xAxisMenuData[i].name)[0],
                    text: xAxisMenuData[i].children[k].text,
                    name:xAxisMenuData[i].children[k].name,
                    id:"xaxis_menu_"+xAxisMenuData[i].children[k].name
                });
                $("#xaxis_menu_"+xAxisMenuData[i].children[k].name).attr("by", xAxisMenuData[i].children[k].name);
            }
        }
    }
}

function initPathMenu(){
    var menuData = [
        {text:"子父集", name: "tree-structure", children:[
            {text: "ID前置包含", name: "id-prefix"},
            {text: "父对象ID设定", name: "pid-set"}
        ]}
    ]

    var menu = $("<div></div>").attr("id", "path_menu").appendTo($("body"))
        .menu({
            miniWidth:80,
            onClick:function(item){
                if($(item.target).attr("hasChild")){
                    return;
                }else{
                    $("#path_menu_dialog").dialog("open");
                }
            },
            onShow: function(){

            }
        });
    for(var i = 0; i < menuData.length; i++){
        menu.menu("appendItem", {
            text: menuData[i].text,
            name:menuData[i].name,
            id: "path_menu_"+menuData[i].name
        });
        $("#path_menu_"+menuData[i].name).attr("path_type", menuData[i].name);
        if(menuData[i].children && menuData[i].children.length > 0){
            $("#path_menu_"+menuData[i].name).attr("hasChild", "true");
            for(var k = 0; k < menuData[i].children.length; k++){
                menu.menu("appendItem", {
                    parent: $("#path_menu_"+menuData[i].name)[0],
                    text: menuData[i].children[k].text,
                    name:menuData[i].children[k].name,
                    id:"path_menu_"+menuData[i].children[k].name
                });
                $("#path_menu_"+menuData[i].children[k].name).attr("path_type", menuData[i].children[k].name);
            }
        }
    }

    $("<div style='padding: 10'></div>").attr("id", "path_menu_dialog").appendTo($("body"))
        .dialog({
            title: "前置包含设定",
            width: 400,
            height: 200,
            closed: true,
            modal: true,
            onOpen: function(){
                $("#path_column").combobox("loadData", _chartConfig.columns)
            },
            buttons: [{
                text:'保存',
                iconCls:'icon-ok',
                handler:function(){

                }
            },{
                text:'取消',
                handler:function(){
                    $("#path_menu_dialog").dialog("close");
                }
            }]

        }).append($("<label></label>").text("数据列:"))
        .append($("<select id='path_column'></select>"));
    $("#path_column").combobox({
        data: [],
        valueField: "column_en",
        textField: "column_cn"
    })
}





function setupSubline(id){

    function fetchAxis(){
        var result = [];
        $(".zzjz-yaxis-div .zzjz-axis-item").each(function(){
            result.push({
                uniq_id: $(this).attr("id"),
                text: $(this).text()
            })
        });
        return result;
    }


    var div = $("<div style='margin-top: 10px' class='zzjz-edit-subline-div'></div>").attr("id", "edit_subline_div_"+id);
    $("<input style='margin-left: 10px' class='zzjz-chart-subline-name' />").appendTo(div);
    $("<select style='margin-left: 10px' class='zzjz-chart-subline-type'></select>").append(
        $("<option></option>").attr("value", "calculate").text("计算值")
    ).append(
        $("<option selected></option>").attr("value", "constant").text("固定值")
    ).appendTo(div);
    $("<input style='margin-left: 10px' class='zzjz-chart-subline-value' />").appendTo(div)
    $("<a class='zzjz-chart-subline-remove'></a>").appendTo(div);
    div.appendTo($("#chart_subline_dialog"));
    div.find(".zzjz-chart-subline-name").textbox({width:100, prompt:"请输入名称"});
    div.find(".zzjz-chart-subline-value").textbox({width:100, prompt:"请输入数值"});
    div.find("select").combobox({width:100, onChange:function(newValue, oldValue){
        if(newValue == "calculate"){
            div.find(".zzjz-chart-subline-value").textbox("destroy");
            div.find(".zzjz-chart-subline-remove").before($("<select class='zzjz-chart-subline-axis'></select>"));
            div.find(".zzjz-chart-subline-axis").combobox({
                data:fetchAxis(),
                valueField:"uniq_id",
                textField:"text",
                width:100
            });

            div.find(".zzjz-chart-subline-remove").before($("<select class='zzjz-chart-subline-axis-value'></select>")
                .append($("<option></option>").attr("value", "AVG").text("平均值"))
                .append($("<option></option>").attr("value", "MAX").text("最大值"))
                .append($("<option></option>").attr("value", "MIN").text("最小值")));
            div.find(".zzjz-chart-subline-axis-value").combobox({width:100});
        }else{
            div.find(".zzjz-chart-subline-axis").combobox("destroy");
            div.find(".zzjz-chart-subline-axis-value").combobox("destroy");
            div.find(".zzjz-chart-subline-remove").before($("<input style='margin-left: 10px' class='zzjz-chart-subline-value' />"));
            div.find(".zzjz-chart-subline-value").textbox({width:100, prompt:"请输入数值"});
        }
    }});
    div.find(".zzjz-chart-subline-remove").linkbutton({plain:true, iconCls: "icon-remove",onClick:function(){$(this).parent().remove()}});
}
