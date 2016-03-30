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
                        var datas = $("#accurate_center").find(".zzjz-filter-datalist").datalist("getData").rows;
                        if(datas.length == 0){
                            $.messager.alert("提示", "无任何过滤数据项", "info");
                            return;
                        }
                        var filterList = chart.meta.level[0].filter_list;
                        filterList.push({
                            name: $(".zzjz-column-div[column_en="+_filterConfig.columnEn+"]").attr("column_cn"),
                            data_type: dataType[_filterConfig.columnType],
                            adv_type: "exact",
                            range_type: $(".zzjz-filter-select").combobox("getValue")

                        })
                    }
                }
            },{
                text:'取消',
                handler:function(){
                    $("#data_filter_dialog").dialog("close")
                }
            }]
        }).append($("<div></div>").attr("id", "filter_tab"))
        .find("#filter_tab").tabs({
            plain:true,
            narrow:true,
            fit:true
        }).tabs("add", {
            title: "精确筛选",
            content: "<div class='filter_definition_div' id='accurate_filter'></div>"
        }).tabs("add", {
            title: "条件筛选",
            content: "<div class='filter_definition_div' id='condition_filter'></div>"
        }).tabs("add", {
            title: "表达式",
            content: "<div class='filter_definition_div' id='expression_filter'></div>"
        });

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
    ).find(".zzjz-filter-select").combobox({
            onChange:function(newValue,oldValue){

            }
        })
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
           // alert(11)
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
