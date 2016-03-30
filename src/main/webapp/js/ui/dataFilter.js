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
                text:'Ok',
                iconCls:'icon-ok',
                handler:function(){
                    alert('ok');
                }
            },{
                text:'Cancel',
                handler:function(){
                    alert('cancel');
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
            region: "north",
            height:60,
            id: "accurate_north",
            border: true
        }).layout("add", {
            region: "west",
            id: "accurate_west",
            width: "50%",
            border:true
        }).layout("add",{
            region: "center",
            id: "accurate_center",
            width: "50%",
            border: true
        });
}
