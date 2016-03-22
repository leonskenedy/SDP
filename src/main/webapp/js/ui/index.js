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
    $("#chart_column_list").datalist({
        valueField: "value",
        textField: "name",
        data:[{name:"n1eeeeeeeeeeeeeeeeeeee", value:"v1", data_type: 1},{name:"n2", value:"v2", data_type: 2},{name:"n3", value:"v3", data_type: 3}],
        textFormatter:function(value,row,index){
            return $("<div></div>").append(
                $("<div></div>").attr("class", "zzjz-column-div").attr("column_name_cn", row.name)
                    .attr("column_name_en", row.value).attr("column_type", row.data_type)
                    .append($("<span></span>").attr("class", "l-btn-left l-btn-icon-left").append($("<span></span>").attr("class", "l-btn-text").text(row.name))
                        .append($("<span></span>").attr("class", "l-btn-icon icon-data-type-"+row.data_type)))
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
            p.attr("column_name_en", $(source).attr("column_name_en"));
            p.attr("column_type", $(source).attr("column_type"));
            p.attr("column_name_cn", $(source).attr("column_name_cn"))
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
                en: $(source).attr("column_name_en"),
                cn: $(source).attr("column_name_cn"),
                type: $(source).attr("data_type")
            }
            var id = +new Date()
            $(this).append($("<a></a>").attr("id", id).attr("class", "zzjz-axis-item"));
            $("#"+id).menubutton({
                plain: true,
                text: data.cn,
                hasDownArrow: false,
                menu:"#mm"
            })
            $(this).removeClass('zzjz-axis-over');
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
                en: $(source).attr("column_name_en"),
                cn: $(source).attr("column_name_cn"),
                type: $(source).attr("data_type")
            }
            var id = +new Date()
            $(this).append($("<a></a>").attr("id", id).attr("class", "zzjz-axis-item"));
            $("#"+id).menubutton({
                plain: true,
                text: data.cn,
                hasDownArrow: false,
                menu:"#mm"
            })
            $(this).removeClass('zzjz-axis-over');
        }
    });
    $('#mm').menu({
        minWidth: 70,
        onClick:function(item){
            //...
        },
        onShow: function(){
            $(this).width($(".zzjz-axis-item:hover").width())
            console.log($(".zzjz-axis-item:hover"))
        },
        onHide: function(){

        }
    });

})

function setupColumns(container){
    var columns = [{name:"n1", value:"v1", data_type: 1},{name:"n2", value:"v2", data_type: 2},{name:"n3", value:"v3", data_type: 3}];
    var ul = $("<ul></ul>").attr("class", "zzjz-column-ul");
    for(var i = 0; i < columns.length; i++){
        var row = columns[i];
        $("<li class='zzjz-column-div'></li>").append($("<span></span>").attr("class", "l-btn-left l-btn-icon-left").append($("<span></span>").attr("class", "l-btn-text").text(row.name))
            .append($("<span></span>").attr("class", "l-btn-icon icon-data-type-"+row.data_type))).appendTo(ul);
    }
    ul.appendTo(container);
}
