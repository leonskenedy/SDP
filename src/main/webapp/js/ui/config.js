var _chartConfig = {
    mapJSON:{
        "江苏":"jiangsu"
    },
    loadedMap:{},
    chartId:"",
    currentLevel: 0,
    definition:null,
    dateTime: +new Date(),
    /*temporary usage, reconstruct later*/
    columns: [
        {column_cn:"名称", column_en:"name", column_type:2},
        {column_cn:"日期", column_en:"time", column_type:3},
        {column_cn:"价格（元/公斤）", column_en:"price", column_type:1},
        {column_cn:"类别", column_en:"type", column_type:2},
        {column_cn:"出售方式", column_en:"selltype", column_type:2},
        {column_cn:"省/直辖", column_en:"province", column_type:2, map_column: true},
        {column_cn:"城市", column_en:"city", column_type:2, map_column: true}
    ],
    /*temporary usage, reconstruct later*/
    columnMap:{
        name: {column_cn:"名称", column_en:"name", column_type:2},
        time: {column_cn:"日期", column_en:"time", column_type:3},
        price: {column_cn:"价格（元/公斤）", column_en:"price", column_type:1},
        type: {column_cn:"类别", column_en:"type", column_type:2},
        selltype: {column_cn:"出售方式", column_en:"selltype", column_type:2},
        province: {column_cn:"省/直辖", column_en:"province", column_type:2, map_column: true},
        city: {column_cn:"城市", column_en:"city", column_type:2, map_column: true}
    },
    xAxis:{
        /*temporary usage, reconstruct later*/
        xAxisMenuData: [
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
        ],
        /*temporary usage, reconstruct later*/
        menuMap:{
            year: "按年",
            quarter: "按季",
            month: "按月",
            week: "按周",
            day: "按日",
            hour: "按时",
            minute: "按分",
            second: "按秒"
        },
        append: function(element){
            var data = element.__zzjz__;
            var column = _chartConfig.columnMap[data.fid];
            $(element).appendTo($(".zzjz-xaxis-div"));
            $(element).attr("column_en", column.column_en).attr("column_cn", column.column_cn)
                .attr("column_type", column.column_type).attr("map_column", data.map_column? "true":"")
                .attr("id", data.uniq_id).addClass("zzjz-axis-item")
                .menubutton({
                    plain: true,
                    text: column.column_cn,
                    hasDownArrow: false
                }).draggable({
                    revert:true,
                    proxy: function(source){
                        var p = $(source).clone();
                        p.appendTo($("body"))
                        return p;
                    }
                }).droppable({
                    accept: ".zzjz-column-div",
                    onDrop:function(e,source){
                        $(".zzjz-xaxis-div").droppable("enable");
                        $(".zzjz-xaxis-div").removeClass('zzjz-axis-over');
                        var data = {
                            fid: $(this).attr("column_en"),
                            name: $(this).attr("column_cn"),
                            data_type: dataType[$(this).attr("column_type")],
                            is_new: false
                        }
                        var axisItem = $("<a></a>");
                        _chartConfig.bind(axisItem[0], data);
                        _chartConfig.level.append(axisItem[0], true)
                        axisItem.addClass("zzjz-level-item-selected")

                        data = {
                            fid: $(source).attr("column_en"),
                            name: $(source).attr("column_cn"),
                            data_type: dataType[$(source).attr("column_type")],
                            is_new: false
                        }
                        axisItem = $("<a></a>");
                        _chartConfig.bind(axisItem[0], data);
                        _chartConfig.level.append(axisItem[0], true);
                        _chartConfig.level.addLevelFields(1, data.fid);
                        $(".zzjz-level-div").show();
                        _chartConfig.drawChart().resetEChartDiv();
                        window._dropped = true;
                    },
                    onDragEnter:function(e, source){
                        $(".zzjz-xaxis-div").droppable("disable")
                        $(".zzjz-xaxis-div").addClass('zzjz-axis-over');
                    },
                    onDragLeave:function(e, source){
                        $(".zzjz-xaxis-div").droppable("enable");
                        $(".zzjz-xaxis-div").addClass('zzjz-axis-over');
                    }
                });
            if(data.granularity && column.data_type == "3"){
                $(element).attr("granularity", data.granularity).menubutton({
                    text: column.column_cn + " (" + _chartConfig.xAxis.menuMap[data.granularity]+")",
                    menu:"#mm_xaxis"
                });
            }
        }
    },
    yAxis:{
        menuMap: {
            SUM: "求和",
            AVG: "平均值",
            COUNT: "计数",
            COUNT_DISTINCT: "去重计数"
        },
        append: function(element){
            var data = element.__zzjz__;
            var column = _chartConfig.columnMap[data.fid];
            $(element).appendTo($(".zzjz-yaxis-div"));
            $(element).attr("column_en", column.column_en).attr("column_cn", column.column_cn)
                .attr("column_type", column.column_type).attr("formula", data.aggregator)
                .attr("id", data.uniq_id).addClass("zzjz-axis-item")
                .menubutton({
                    plain: true,
                    text: column.column_cn + " (" + _chartConfig.yAxis.menuMap[data.aggregator] + ")",
                    hasDownArrow: false,
                    menu: "#mm"
                }).draggable({
                    revert:true,
                    proxy: function(source){
                        var p = $(source).clone();
                        p.appendTo($("body"))
                        return p;
                    }
                })
        }
    },
    level:{
        append: function(element, isNew){
            var data = element.__zzjz__;
            if(isNew){
                _chartConfig.definition.meta.level_fields.push(data);
            }
            $(element).attr("id", _chartConfig.generateId);
            $(element).addClass("zzjz-level-item");
            $(element).menubutton({
                plain: true,
                text: data.name,
                hasDownArrow: false
            });
            $(element).appendTo($(".zzjz-level-div"));
        },
        addDrillDown:function(){
            echart.on("click", function(arg){
                var name = arg.name;
                var x = _chartConfig.definition.meta.level[0].x[_chartConfig.currentLevel];
                $.ajax({
                    url: "../chart/drillDown",
                    data: {chartId: _chartConfig.chartId, fid: x.fid, drillLevel: _chartConfig.currentLevel+1, drillValue:[name]},
                    dataType: "json",
                    type: "post",
                    success: function(data){
                        try {
                            echart.dispose($(".zzjz-echart-div-right")[0]);
                        } catch (e) {

                        }
                        var option = eval("(" + data.option + ")");
                        debugger;
                        echart = echarts.init($(".zzjz-echart-div-right")[0]);
                        if (_chartConfig.definition.meta.level[0].chart_type == "C271") {
                            echart.setOption(_chartConfig.parseMap(option, name));
                        } else if (_chartConfig.definition.meta.level[0].auto_flush) {
                            seriesFormat(option.series);
                            echart.setOption(option);
                            timeTicket(3000);
                        } else {
                            echart.setOption(option);
                        }
                    }
                })
            })
        },
        addLevelFields:function(levelIndex, columnEn){
            var before = _chartConfig.definition.meta.level[levelIndex - 1];
            var column = _chartConfig.columnMap[columnEn];
            var after = {x:[], y:[]};
            after.chart_type = before.chart_type;

            var x = {
                data_type: dataType[column.column_type],
                fid: columnEn,
                is_build_aggregated: 0,
                is_new: false,
                name: column.column_cn,
                uniq_id: _chartConfig.generateId()
            };
            if(column.map_column){
                x.map_column = "true";
            }
            if(column.column_type == 3){
                x.granularity = "day";
            }
            after.x.push(x);
            for(var i = 0; i < before.y.length; i++){
                var y = {};
                for(var prop in before.y[i]){
                    if(prop == "__zzjz__"){
                        continue;
                    }
                    if(prop == "formatter"){
                        y.formatter = {
                            check: "num",
                            num:{
                                digit: 0,
                                millesimal: false
                            },
                            percent:{
                                digit: 0
                            }
                        }
                    }else{
                        y[prop] = before.y[i][prop];
                    }
                }
                after.y.push(y);
            }
            _chartConfig.definition.meta.level.push(after);
        }
    },
    filter:{
        remove:function(element){
            var data = element.__zzjz__;
            var filterList =  _chartConfig.definition.meta.filter_list;
            $(element).panel("destroy");
            for(var i = 0; i < filterList.length; i++){
                if(filterList[i] == data){
                    filterList.splice(i, 1);
                    _chartConfig.drawChart()
                }
            }
        },
        initEdit:function(element){
            var data = element.__zzjz__;
            window._filterConfig = {isEdit: true, columnEn: data.fid, columnType: data.data_type, columnCn: data.name}
            $("#data_filter_dialog").dialog("open");
            var index = 0;
            if(data.data_type == "string"){
                $("#accurate_west").find(".zzjz-filter-datalist").datalist({
                    url: "uniqueData",
                    queryParams:{columnName: data.fid, columnType: data.data_type},
                    valueField: data.fid,
                    textField: data.fid,
                    border: false,
                    onClickRow:function(index, row){
                        var added = $("#accurate_center").find(".zzjz-filter-datalist").datalist("getData").rows;
                        for(var i = 0; i < added.length; i++){
                            if(row[data.fid] == added[i][data.fid]){
                                $.messager.alert("提示", "该数据已添加.", "info");
                                return;
                            }
                        }
                        $("#accurate_center").find(".zzjz-filter-datalist").datalist("appendRow", row);
                    }
                });
                $(".zzjz-condition-input").textbox("setValue", "");
                if(data.adv_type == "exact"){
                    $(".zzjz-filter-select").combobox("setValue", data.range_type);

                    $("#accurate_center").find(".zzjz-filter-datalist").datalist({
                        data:JSON.parse(data.range[0]).map(function(s){var obj = {}; obj[data.fid] = s; return obj}),
                        width: "100%",
                        valueField:data.fid,
                        textField:data.fid,
                        border: false,
                        onClickRow:function(index, row){
                            $("#accurate_center").find(".zzjz-filter-datalist").datalist("deleteRow", index);
                        }
                    });
                }else{
                    $("#accurate_center").find(".zzjz-filter-datalist").datalist({
                        data:[],
                        width: "100%",
                        valueField:data.fid,
                        textField:data.fid,
                        border: false,
                        onClickRow:function(index, row){
                            $("#accurate_center").find(".zzjz-filter-datalist").datalist("deleteRow", index);
                        }
                    });
                }

                if(data.adv_type == "condition"){
                    index = 1;
                    var range = JSON.parse(data.range[0]);
                    $(".zzjz-condition-select-type").combobox("setValue", range.condition_type);
                    $(".zzjz-condition-datagrid").datagrid({
                        data:range.conditions.map(function(o){
                            var obj = {};
                            obj.column_cn = data.name;
                            obj.operator = o.calc_type;
                            obj.keyword = o.value;
                            return obj;
                        }),
                        height:300,
                        onDblClickRow: function(index, row){
                            $(".zzjz-condition-datagrid").datagrid("deleteRow", index);
                        },
                        columns:[[{
                            field:"column_cn", title:"列名", width:"20%"
                        },{
                            field:"operator", title: "操作符",width:"30%",formatter:function(value, row, index){
                                switch (value){
                                    case "0": return "等于";
                                    case "1": return "不等于";
                                    case "6": return "包含";
                                    case "7": return "不包含";
                                    case "10": return "开头包含";
                                    case "11": return "结尾包含";
                                }
                            }
                        },{
                            field:"keyword", title: "关键字", width:"40%"
                        }]]
                    });
                }else{
                    $(".zzjz-condition-datagrid").datagrid({
                        data:[],
                        height:300,
                        onDblClickRow: function(index, row){
                            $(".zzjz-condition-datagrid").datagrid("deleteRow", index);
                        },
                        columns:[[{
                            field:"column_cn", title:"列名", width:"20%"
                        },{
                            field:"operator", title: "操作符",width:"30%",formatter:function(value, row, index){
                                switch (value){
                                    case "0": return "等于";
                                    case "1": return "不等于";
                                    case "6": return "包含";
                                    case "7": return "不包含";
                                    case "10": return "开头包含";
                                    case "11": return "结尾包含";
                                }
                            }
                        },{
                            field:"keyword", title: "关键字", width:"40%"
                        }]]
                    });
                }
                if(data.adv_type == "expression"){
                    index = 3;
                    $(".zzjz-expression-input").textbox("setValue", data.oSql);
                }else{
                    $(".zzjz-expression-input").textbox("setValue", "");
                }
            }



            $("#filter_tab").tabs("select", index);
        },
        append:function(element, isNew){
            var data = element.__zzjz__;
            if(data.data_type == "string" && data.adv_type == "exact"){
                $(element).attr("class", "zzjz-filter-data-panel").appendTo($(".zzjz-filter-data-panel-div")).panel({
                    title: _chartConfig.columnMap[data.fid].column_cn,
                    collapsible:true,
                    bodyCls:"zzjz-filter-panel-body",
                    tools:[
                        {
                            iconCls:"icon-edit",
                            handler:function(){
                                _chartConfig.filter.initEdit($(this).parent().parent().parent().find(".zzjz-filter-data-panel")[0]);
                            }

                        },{
                            iconCls: "icon-remove",
                            handler:function(){
                                _chartConfig.filter.remove($(this).parent().parent().parent().find(".zzjz-filter-data-panel")[0]);
                            }
                        }
                    ]
                }).append(
                    $("<p></p>").text(data.range_type == "0" ? "排除下列项" : "包含下列项")
                ).append(
                    JSON.parse(data.range[0]).map(function(s){return $("<p></p>").text(s)})
                )
            }else if(data.data_type == "string" && data.adv_type == "condition"){
                var range = JSON.parse(data.range[0]);

                $(element).attr("class", "zzjz-filter-data-panel").appendTo($(".zzjz-filter-data-panel-div")).panel({
                    title: _chartConfig.columnMap[data.fid].column_cn,
                    collapsible:true,
                    bodyCls:"zzjz-filter-panel-body",
                    tools:[
                        {
                            iconCls:"icon-edit",
                            handler:function(){
                                _chartConfig.filter.initEdit($(this).parent().parent().parent().find(".zzjz-filter-data-panel")[0]);
                            }
                        },
                        {
                            iconCls: "icon-remove",
                            handler:function(){
                                _chartConfig.filter.remove($(this).parent().parent().parent().find(".zzjz-filter-data-panel")[0])
                            }
                        }
                    ]
                }).append(
                    $("<p></p>").text(range.condition_type == "1" ? "满足任一条件" : "满足所有条件")
                ).append(
                    range.conditions.map(
                        function(s){
                            var p = $("<p></p>");
                            switch (s.calc_type){
                                case "0":return p.text("等于 " + s.value);
                                case "1":return p.text("不等于 " + s.value);
                                case "6":return p.text("包含 " + s.value);
                                case "7":return p.text("不包含 " + s.value);
                                case "10":return p.text("开头包含 " + s.value);
                                case "11":return p.text("结尾包含 " + s.value);
                            }
                        }
                    )
                )
            }else if(data.data_type == "string" && data.adv_type == "expression"){
                $(element).attr("class", "zzjz-filter-data-panel").appendTo($(".zzjz-filter-data-panel-div")).panel({
                    title: data.name,
                    collapsible:true,
                    bodyCls:"zzjz-filter-panel-body",
                    tools:[
                        {
                            iconCls:"icon-edit",
                            handler:function(){
                                _chartConfig.filter.initEdit($(this).parent().parent().parent().find(".zzjz-filter-data-panel")[0]);
                            }
                        },
                        {
                            iconCls: "icon-remove",
                            handler:function(){
                                _chartConfig.filter.remove($(this).parent().parent().parent().find(".zzjz-filter-data-panel")[0]);
                            }
                        }
                    ]
                }).append(
                    $("<p></p>").text("自定义表达式")
                )
            }
            if(isNew){
                _chartConfig.definition.meta.filter_list.push(data);
            }
        }
    },
    generateId: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },
    bind: function(element, data){
        element.__zzjz__ = data;
        data.__zzjz__ = function(){
            return element;
        }
    },
    init:function(){
        var level = _chartConfig.definition.meta.level[0];
        var levelField = _chartConfig.definition.meta.level_fields;
        var filterList = _chartConfig.definition.meta.filter_list;
        if(!level){
            return;
        }
        for(var i = 0; i < level.x.length; i++){
            var axis = document.createElement("a");
            this.bind(axis, level.x[i]);
            _chartConfig.xAxis.append(axis);
        }
        for(var i = 0; i < level.y.length; i++){
            var axis = document.createElement("a");
            this.bind(axis, level.y[i]);
            _chartConfig.yAxis.append(axis);
        }
        for(var i = 0; i < levelField.length; i++){
            var axis = document.createElement("a");
            this.bind(axis, levelField[i]);
            _chartConfig.level.append(axis);
        }
        for(var i = 0; i < filterList.length; i++){
            var element = document.createElement("div");
            this.bind(element, filterList[i]);
            _chartConfig.filter.append(element);
        }
        if(levelField.length > 0){
            $(".zzjz-level-div").show();
        }
        this.parseType(level.chart_type).drawChart().resetEChartDiv();
    },
    fetchDefinition:function(id){
        $.ajax({
            url: "../chart/fetchChart",
            data:{chartId: id},
            dataType: "json",
            async: false,
            success:function(data){
                _chartConfig.chartId = data.chart_id;
                data.definition.chart_id = data.chart_id;
                _chartConfig.definition = data.definition;
            }
        })
    },
    parseType: function (assigned) {
        $("span[class_id]").each(function () {
            $(this).removeClass("zzjz-chart-type-active").removeClass($(this).attr("original_class") + "-selective")
        });
        var level = _chartConfig.definition.meta.level[0];
        var arr = [];
        for (var i = 0; i < this.typeFilter.length; i++) {
            var result = this.typeFilter[i](level);
            if (result) {
                var span = $("span[class_id=" + result.classId + "]");
                span.addClass(span.attr("original_class") + "-selective");
                arr.push(result);
            }
        }
        if(assigned){
            $("span[class_id=" + assigned + "]").addClass("zzjz-chart-type-active");
        }else{
            if (arr.length > 1) {
                var span = $("span[class_id=" + arr[1].classId + "]");
                level.chart_type = arr[1].classId;
                span.addClass("zzjz-chart-type-active");
            } else {
                var span = $("span[class_id=" + arr[0].classId + "]");
                span.addClass("zzjz-chart-type-active");
                level.chart_type = arr[0].classId;
            }
        }
        return this;
    },
    parseMap: function (option, drillName) {
        var mapType = "china";
        if(drillName){
            if(!_chartConfig.loadedMap[drillName]){
                $.ajax({
                    url:"../js/map/"+ _chartConfig.mapJSON[drillName]+".js",
                    dataType: "script",
                    async: false,
                    success:function(){
                        _chartConfig.loadedMap[drillName] = true;
                        mapType = _chartConfig.mapJSON[drillName];
                    }
                });
            }
        }
        var mapData = [];
        for (var i = 0; i < option.xAxis[0].data.length; i++) {

            //临时解决方法,为演示
            var item = {
                name: !drillName ? option.xAxis[0].data[i].replace(/(省|市)$/, "") : option.xAxis[0].data[i]+"市",
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
                    mapType: mapType,
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
    modifyChart:function(redraw){
        $.ajax({
            url: "../chart/modifyChart",
            data: {chartId: _chartConfig.chartId, definition: JSON.stringify(_chartConfig.definition)},
            dataType: "json",
            type: "post",
            success: function(data){
                if(data.success && redraw){
                    _chartConfig.drawChart();
                }
            }
        });
        return this;
    },
    drawChart: function () {
        $.ajax({
            url: "../chart/update",
            type: "post",
            data: encodeURIComponent(JSON.stringify(_chartConfig.definition)),
            dataType: "json",
            success: function (data) {
                try {
                    echart.dispose($(".zzjz-echart-div-right")[0]);
                } catch (e) {

                }
                var option = eval("(" + data.option + ")");
                debugger;
                echart = echarts.init($(".zzjz-echart-div-right")[0]);
                if (_chartConfig.definition.meta.level[0].chart_type == "C271") {
                    echart.setOption(_chartConfig.parseMap(option));
                } else if (_chartConfig.definition.meta.level[0].auto_flush) {
                    seriesFormat(option.series);
                    echart.setOption(option);
                    timeTicket(3000);
                } else {
                    echart.setOption(option);
                }
                _chartConfig.level.addDrillDown();
            }
        });
        return this;
    },
    addXAxis: function (jEle, refresh) {
        var currentX = _chartConfig.definition.meta.level[0].x;
        currentX.push({
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
        var currentX = _chartConfig.definition.meta.level[0].x;
        var currentY = _chartConfig.definition.meta.level[0].y;
        for (var i = 0; i < currentX.length; i++) {
            if (currentX[i].uniq_id == uniqId) {
                currentX.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < currentY.length; i++) {
            if (currentY[i].uniq_id == uniqId) {
                currentY.splice(i, 1);
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
        var currentY = _chartConfig.definition.meta.level[0].y;
        currentY.push({
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
        var currentY = _chartConfig.definition.meta.level[0].y;
        var item = null;
        var targetId = $(jEle).attr("id");
        var items = currentY;
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

