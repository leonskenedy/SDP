function setupDataFilter(){
    $("<div></div>").attr("id", "data_filter_dialog").appendTo($("body"))
        .dialog({
            title:"编辑数据过滤",
            width:600,
            height:450,
            modal:true,
            closable:false,
            closed: true,
            border: false,
            buttons: [{
                text:'保存',
                iconCls:'icon-ok',
                handler:function(){
                    if(_filterConfig.isEdit){

                    }else{
                        var filterList = _chartConfig.definition.meta.filter_list?_chartConfig.definition.meta.filter_list:_chartConfig.definition.meta.filter_list=[];
                        var filterType = $("#filter_tab").tabs("getSelected").attr("id").replace("adv_type_", "");
                        if(filterType == "exact"){
                            var datas = $("#accurate_center").find(".zzjz-filter-datalist").datalist("getData").rows;
                            if(datas.length == 0){
                                $.messager.alert("提示", "无任何过滤数据项", "info");
                                return;
                            }
                            var filterItem = {
                                name: $(".zzjz-column-div[column_en="+_filterConfig.columnEn+"]").attr("column_cn"),
                                data_type: dataType[_filterConfig.columnType],
                                adv_type: "exact",
                                range_type: $(".zzjz-filter-select").combobox("getValue"),
                                range:[JSON.stringify(datas.map(function(o){return o[_filterConfig.columnEn]}))],
                                fid:_filterConfig.columnEn,
                                is_all:false,
                                total:10000
                            }
                            filterList.push(filterItem);
                            $("<div class='zzjz-filter-data-panel'></div>").attr("column_en", _filterConfig.columnEn)
                                .appendTo($(".zzjz-filter-data-panel-div")).panel({
                                    title:$(".zzjz-column-div[column_en="+_filterConfig.columnEn+"]").attr("column_cn"),
                                    collapsible:true,
                                    bodyCls:"zzjz-filter-panel-body",
                                    tools:[
                                        {
                                            iconCls:"icon-edit",
                                            handler:function(){
                                                alert(111)
                                            }
                                        }
                                    ]
                                }).append($("<p />").text(filterItem.range_type == "0" ? "排除下列项" : "包含下列项"))
                                .append(JSON.parse(filterItem.range[0]).map(function(s){return $("<p></p>").text(s)}));
                            $("#data_filter_dialog").dialog("close");
                        }else if(filterType == "condition"){
                            var datas = $(".zzjz-condition-datagrid").datalist("getData").rows;
                            if(datas.length == 0){
                                $.messager.alert("提示", "无任何过滤数据项", "info");
                                return;
                            }
                            var range = {
                                condition_type:$(".zzjz-condition-select-type").combobox("getValue"),
                                conditions: datas.map(function(o){return {calc_type: o.operator, value: o.keyword}})
                            }
                            var filterItem = {
                                name: $(".zzjz-column-div[column_en="+_filterConfig.columnEn+"]").attr("column_cn"),
                                data_type: dataType[_filterConfig.columnType],
                                adv_type: filterType,
                                range_type: "1",
                                range:[JSON.stringify(range)],
                                fid:_filterConfig.columnEn,
                                is_all:false,
                                total:10000
                            };
                            filterList.push(filterItem);
                            $("<div class='zzjz-filter-data-panel'></div>").attr("column_en", _filterConfig.columnEn)
                                .appendTo($(".zzjz-filter-data-panel-div")).panel({
                                    title:$(".zzjz-column-div[column_en="+_filterConfig.columnEn+"]").attr("column_cn"),
                                    collapsible:true,
                                    bodyCls:"zzjz-filter-panel-body",
                                    tools:[
                                        {
                                            iconCls:"icon-edit",
                                            handler:function(){
                                                alert(111)
                                            }
                                        }
                                    ]
                                }).append($("<p />").text(range.condition_type == "1" ? "满足任一条件" : "满足所有条件"))
                                .append(
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
                            );
                            $("#data_filter_dialog").dialog("close");

                        }else if(filterType == "number_condition"){
                            var type = $(".zzjz-number-condition-select").combobox("getValue");
                            var first = $.trim($(".zzjz-number-condition-input").first().textbox("getValue"));
                            var second = null;
                            if(type == "6"){
                                second = $.trim($(".zzjz-number-condition-input").eq(1).textbox("getValue"));
                            }
                            if(first == "" || isNaN(first * 1)){
                                $.messager.alert("错误", "请填写正确的数值", "error");
                                return;
                            }
                            if(second != null && (second == "" || isNaN(second * 1))){
                                $.messager.alert("错误", "请填写正确的数值", "error");
                                return;
                            }
                            var range = {condition_type: 2, conditions:[]};
                            if(second != null){
                                range.conditions.push({calc_type:4,value:first});
                                range.conditions.push({calc_type:5,value:second});
                            }else{
                                range.conditions.push({calc_type:type,value:first});
                            }
                            var filterItem = {
                                name: _filterConfig.columnCn,
                                data_type: dataType[_filterConfig.columnType],
                                adv_type: "condition",
                                range:[JSON.stringify(range)],
                                fid:_filterConfig.columnEn,
                                is_all:false
                            };
                            filterList.push(filterItem);
                            var div = $("<div class='zzjz-filter-data-panel'></div>").attr("column_en", _filterConfig.columnEn)
                                .appendTo($(".zzjz-filter-data-panel-div")).panel({
                                    title:_filterConfig.columnCn,
                                    collapsible:true,
                                    bodyCls:"zzjz-filter-panel-body",
                                    tools:[
                                        {
                                            iconCls:"icon-edit",
                                            handler:function(){
                                                alert(111)
                                            }
                                        }
                                    ]
                                }).append($("<p>条件满足</p>"));
                            if(second != null){
                                div.append($("<p />").text(first + "～" + second));
                            }else{
                                div.append($("<p />").text($(".zzjz-number-condition-select").combobox("getText") + " " + first))
                            }
                            $("#data_filter_dialog").dialog("close");
                        }else{
                            var sql = $.trim($(".zzjz-expression-input").textbox("getValue"));
                            var oSql = sql;
                            if(sql == ""){
                                $.messager.alert("提示", "无任何表达式内容", "error");
                                return;
                            }
                            var target = "["+_filterConfig.columnCn +"]";
                            while(sql.search(target) > -1){
                                sql = sql.replace(target, _filterConfig.columnEn);
                            }
                            var filterItem = {
                                name: _filterConfig.columnCn,
                                data_type: dataType[_filterConfig.columnType],
                                adv_type: filterType,
                                range_type: "1",
                                range:[sql],
                                fid:_filterConfig.columnEn,
                                oSql: oSql,
                                is_all:false,
                                total:10000
                            };
                            $.ajax({
                                url: "validateGrammar",
                                data:{tableName: "product", json: JSON.stringify(filterItem)},
                                async: false,
                                dataType: "json",
                                success: function(data){
                                    if(data.valid){
                                        filterList.push(filterItem);
                                        $("<div class='zzjz-filter-data-panel'></div>").attr("column_en", _filterConfig.columnEn)
                                            .appendTo($(".zzjz-filter-data-panel-div")).panel({
                                                title:$(".zzjz-column-div[column_en="+_filterConfig.columnEn+"]").attr("column_cn"),
                                                collapsible:true,
                                                bodyCls:"zzjz-filter-panel-body",
                                                tools:[
                                                    {
                                                        iconCls:"icon-edit",
                                                        handler:function(){
                                                            alert(111)
                                                        }
                                                    }
                                                ]
                                            }).append($("<p />").text("自定义表达式"));
                                        $("#data_filter_dialog").dialog("close");
                                    }else{
                                        $.messager.alert("错误", "语法检查失败.", "error");
                                    }
                                }
                            })
                        }
                    }
                }
            },{
                text:'取消',
                handler:function(){
                    $("#data_filter_dialog").dialog("close")
                }
            }],
            onOpen:function(){
                $("#condition_column_cn").add($(".zzjz-expression-hint").find("span")).text(_filterConfig.columnCn);
                var tabLis = $("#filter_tab").find("ul > li");
                tabLis.show();
                switch (_filterConfig.columnType){
                    case "1":
                        tabLis.eq(0).hide();
                        tabLis.eq(1).hide();
                        $("#filter_tab").tabs("select", 2);
                        break;
                    case "2":
                        tabLis.eq(2).hide();
                        $("#filter_tab").tabs("select", 0);
                        break;
                    case "number":
                        tabLis.eq(0).hide();
                        tabLis.eq(1).hide();
                        $("#filter_tab").tabs("select", 2);
                        break;
                    case "string":
                        tabLis.eq(2).hide();
                        $("#filter_tab").tabs("select", 0);
                        break;
                }

            }
        }).append($("<div></div>").attr("id", "filter_tab"))
        .find("#filter_tab").tabs({
            plain:true,
            narrow:true,
            fit:true
        }).tabs("add", {
            title: "精确筛选",
            content: "<div class='filter_definition_div' id='accurate_filter'></div>",
            id: "adv_type_exact"
        }).tabs("add", {
            title: "条件筛选",
            content: "<div class='filter_definition_div' style='margin: 10px' id='condition_filter'></div>",
            id: "adv_type_condition"
        }).tabs("add", {
            title: "条件筛选",
            content: "<div class='filter_definition_div' style='margin: 10px' id='number_condition_filter'></div>",
            id: "adv_type_number_condition"
        }).tabs("add", {
            title: "表达式",
            content: "<div class='filter_definition_div' id='expression_filter'></div>",
            id :"adv_type_expression"
        });
    //精确匹配
    $("#accurate_filter").layout({fit: true})
        .layout("add", {
            region: "west",
            id: "accurate_west",
            width: "50%",
            border:false
        }).layout("add",{
            region: "center",
            id: "accurate_center",
            width: "50%",
            border: false
        });
    $("#accurate_west").append(
        $("<div style='height: 30px;margin: 5px'></div>").append(
            $("<input class='zzjz-filter-input' />")
        )
    ).append(
        $("<div style='position: absolute;top:30px;bottom: 0px;left: 0px;right: 0px;overflow-y: auto;overflow-x: hidden'><div class='zzjz-filter-datalist'></div></div>")
    ).find(".zzjz-filter-input").searchbox({
            searcher:function(value){
                var filter = $.trim(value);
                var datalist = $("#accurate_west").find(".zzjz-filter-datalist");
                var queryParams = datalist.datalist("options")["queryParams"];
                queryParams.keyword= filter;
                datalist.datalist({queryParams:queryParams});
            },
            prompt:"请输入......"
        })

    $("#accurate_center").append(
        $("<div style='height: 30px;margin: 5px'></div>").append(
            $("<select class='zzjz-filter-select'></select>").append($("<option selected value='1'></option>").text("包含下列选项"))
                .append($("<option selected value='0'></option>").text("排除下列选项"))
        )
    ).append(
        $("<div style='position: absolute;top:30px;bottom: 0px;left: 0px;right: 0px;overflow-y: auto;overflow-x: hidden'><div class='zzjz-filter-datalist'></div></div>")
    ).find(".zzjz-filter-select").combobox({});

    //条件匹配
    $("#condition_filter").append(
        $("<label id='condition_column_cn'></label>").text("待定")
    ).append(
        $("<select class='zzjz-condition-select'></select>")
    ).append(
        $("<input class='zzjz-condition-input' />")
    ).append(
        $("<select class='zzjz-condition-select-type'><option value='2'>满足所有条件</option><option value='1'>满足任一条件</option></select>")
    ).append(
        $("<br /><div class='zzjz-condition-datagrid'></div>")
    ).find(".zzjz-condition-select").combobox({
            data:[{label:"等于", value:"0"},{label:"不等于", value:"1"},{label:"包含", value:"6"},{label:"不包含",value:"7"},{label:"开头包含", value:"10"},{label:"结尾包含", value:"11"}],
            textField:"label",
            valueField:"value",
            panelHeight:130,
            selectedIndex:0,
            width:100,
            value:"0"
        }).parent().find(".zzjz-condition-input").textbox({
            prompt: "请输入关键字",
            iconWidth: 22,
            width:150,
            icons:[
                {
                    iconCls:'icon-save',
                    handler: function(e){
                        var text = $(e.data.target).textbox('getValue');
                        if($.trim(text) == ""){
                            $.messager.alert("提示", "请输入关键字", "info")
                            return;
                        }
                        $(".zzjz-condition-datagrid").datagrid("appendRow", {
                            column_cn: _filterConfig.columnCn,
                            operator:$(".zzjz-condition-select").combobox("getValue"),
                            keyword: text
                        });
                        $(e.data.target).textbox('setValue', "");
                    }
                }
            ]
        }).parent().find(".zzjz-condition-select-type").combobox({
            panelHeight:60
        }).parent().find(".zzjz-condition-datagrid").datagrid({
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

    //表达式
    $("#expression_filter").append($("<input class='zzjz-expression-input' />")).append($("<br />"))
        .append($("<a class='zzjz-expression-add'></a>")).append($("<a class='zzjz-expression-validate'></a>"))
        .append($("<div class='zzjz-expression-hint'>示例: [<span></span>]='某某', 且名称需与筛选器名称相同</div>"))
        .find(".zzjz-expression-input").textbox({
            multiline: true,
            height: 250,
            width:564
        }).parent().find(".zzjz-expression-add").linkbutton({
            text:"插入字段",
            iconCls: "icon-add",
            onClick: function(){
                var input = $(".zzjz-expression-input");
                input.textbox("setValue", input.textbox("getValue") + "[" + _filterConfig.columnCn + "]");
            }
        }).parent().find(".zzjz-expression-validate").linkbutton({
            text:"检查语法",
            onClick:function(){
                var sql = $.trim($(".zzjz-expression-input").textbox("getValue"));
                if(sql == ""){
                    $.messager.alert("提示", "无任何表达式内容", "error");
                    return;
                }
                var target = "["+_filterConfig.columnCn +"]";
                while(sql.search(target) > -1){
                    sql = sql.replace(target, "[_field_id_]");
                }
                $.ajax({
                    url:"validateGrammar",
                    data:{tableName: "product", json: JSON.stringify({fid:_filterConfig.columnEn, range:[sql]})},
                    async:false,
                    type: "post",
                    dataType: "json",
                    success: function(data){
                        if(data.valid){
                            $.messager.alert("提示", "语法检查通过", "info");
                        }else{
                            $.messager.alert("提示", "语法检查失败", "error");
                        }
                    }
                })
            }
        });
    //数值类型条件匹配
    $("#number_condition_filter").append($("<div style='height: 100px'></div>")).append(
        $("<select class='zzjz-number-condition-select'></select>")
    ).append(
        $("<input class='zzjz-number-condition-input single' />")
    ).find(".zzjz-number-condition-select").combobox({
            data:[{value:"0", label:"等于"},{value:"1", label:"不等于"},{value:"2", label:"大于"},{value:"3", label:"小于"},{value:"4", label:"大于等于"},{value:"5", label:"小于等于"},{value:"6", label:"区间"}],
            textField:"label",
            valueField:"value",
            value: "0",
            width:100,
            panelHeight: 180,
            onChange:function(nValue, oValue){
                if(nValue == "6"){
                    $("#number_condition_filter").find(".zzjz-number-condition-input").textbox("destroy");
                    $("#number_condition_filter").append(
                        $("<input class='zzjz-number-condition-input between' /><span class='between'>～</span><input class='zzjz-number-condition-input end' between />")
                    ).find(".zzjz-number-condition-input").textbox({width:100,prompt: "请输入数值"})
                }
                if(oValue == "6"){
                    $("#number_condition_filter").find(".zzjz-number-condition-input").textbox("destroy");
                    $("#number_condition_filter").find("span.between").remove();
                    $("#number_condition_filter").append(
                        $("<input class='zzjz-number-condition-input single' />")
                    ).find(".zzjz-number-condition-input").textbox({width:210, prompt: "请输入数值"})
                }
            }
        }).parent().find(".zzjz-number-condition-input").textbox({width:210, prompt: "请输入数值"})
    /**
     * <input class='zzjz-number-condition-input between' /><span class='between'>～</span><input class='zzjz-number-condition-input end' between />
     */
}

function initFilter(columnEn, columnType, isEdit){
    $("#data_filter_dialog").dialog("open");
    $("#accurate_west").find(".zzjz-filter-datalist").datalist({
        url: "uniqueData",
        queryParams:{columnName: columnEn, columnType: columnType},
        valueField: columnEn,
        textField: columnEn,
        border: false,
        onClickRow:function(index, row){
            var added = $("#accurate_center").find(".zzjz-filter-datalist").datalist("getData").rows;
            for(var i = 0; i < added.length; i++){
                if(row[columnEn] == added[i][columnEn]){
                    $.messager.alert("提示", "该数据已添加.", "info");
                    return;
                }
            }
            $("#accurate_center").find(".zzjz-filter-datalist").datalist("appendRow", row);
        }
    });
    $("#accurate_center").find(".zzjz-filter-datalist").datalist({
        data:[],
        width: "100%",
        valueField:columnEn,
        textField:columnEn,
        border: false,
        onClickRow:function(index, row){
            $("#accurate_center").find(".zzjz-filter-datalist").datalist("deleteRow", index);
        }
    })
}
