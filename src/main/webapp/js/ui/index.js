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
    )
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
    $("#chart_column_list").datalist({
        valueField: "value",
        textField: "name",
        data:[{name:"n1", value:"v1", data_type: 1},{name:"n2", value:"v2", data_type: 2},{name:"n3", value:"v3", data_type: 3}],
        textFormatter:function(value,row,index){
            return $("<div></div>").append(
                $("<div></div>").attr("class", "zzjz-column-div").attr("column_name_cn", row.name)
                    .attr("column_name_en", row.value).attr("column_type", row.data_type)
                    .append($("<span></span>").attr("class", "icon-data-type icon-data-type-"+row.data_type))
                    .append($("<span></span>").text(row.name))
            ).html();
        }
    })
})
