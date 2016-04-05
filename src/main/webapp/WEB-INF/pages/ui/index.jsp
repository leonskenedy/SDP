<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<html>
<head>
    <title></title>
    <script src="${ctx}/js/lib/jquery1.9.min.js"></script>
    <script src="${ctx}/js/lib/jquery.easyui.min.js"></script>
    <script src="${ctx}/js/lib/echarts.js"></script>
    <script src="${ctx}/js/lib/d3.js"></script>
    <script src="${ctx}/js/lib/china.js"></script>
    <script src="${ctx}/js/utils.js"></script>
    <link type="text/css" rel="stylesheet" href="${ctx}/css/easyui.css">
    <link type="text/css" rel="stylesheet" href="${ctx}/css/icon.css">
    <link type="text/css" rel="stylesheet" href="${ctx}/css/ui.css">
    <script src="${ctx}/js/ui/config.js"></script>
    <script src="${ctx}/js/ui/dataFilter.js"></script>
    <script src="${ctx}/js/ui/index.js"></script>
    <style>
        #chart_column_panel_center .panel-body{
            border: none;
        }
    </style>
</head>
<body style="margin: 0">
<div id="container"></div>
<!-- yAxis menu -->
<div id="mm">
    <div formula="SUM" data-options="name:'SUM'">求和</div>
    <div formula="AVG" data-options="name:'AVG'">平均值</div>
    <div formula="COUNT" data-options="name:'COUNT'">计数</div>
    <div formula="D-COUNT" data-options="name:'COUNT_DISTINCT'">去重计数</div>
    <div class="menu-sep"></div>
    <div format="VALUE_FORMAT" data-options="name:'VALUE_FORMAT'">数值显示格式</div>
</div>
<!-- xAxis menu -->
<%--<div id="mm_xaxis">--%>
    <%--<div by="YEAR" data-options="name:'YEAR'">按年</div>--%>
    <%--<div by="SEASON" data-options="name:'SEASON'">按季</div>--%>
    <%--<div by="MONTH" data-options="name:'MONTH'">按月</div>--%>
    <%--<div by="WEEK" data-options="name:'WEEK'">按周</div>--%>
    <%--<div by="DAY" data-options="name:'DAY'">按日</div>--%>
    <%--<div by="MANUAL" data-options="name:'MANUAL'">自定义</div>--%>
<%--</div>--%>
<!-- yAxis data formatter dialog -->
<div id="value_format_dialog" class="easyui-dialog" title="数值格式设定" data-options="iconCls:'icon-save',closed:true, modal:true" style="width:400px;height:220px;padding: 10px">
    <div style="margin-bottom: 10px">
        <input type="radio" id="format_number" name="format_number" class="zzjz-radiobox">
        <label for="format_number" class="zzjz-label-radio">数值设定</label>
        <br />
        <label style="margin-left: 30px">小数位:</label>
        <input class="easyui-numberspinner" id="number_precision" data-options="height:30,width:120,min:0" />
        <input type="checkbox" id="thousand_sep" class="zzjz-checkbox">
        <label for="thousand_sep" class="zzjz-label-check">千分位分割</label>
    </div>
    <div>
        <input type="radio" id="format_percent" name="format_number" class="zzjz-radiobox">
        <label for="format_percent" class="zzjz-label-radio">百分数设定</label>
        <br />
        <label style="margin-left: 30px">小数位:</label>
        <input class="easyui-numberspinner" id="percent_precision" data-options="height:30,width:120,min:0" />
    </div>
</div>


<div id="chart_subline_dialog" class="easyui-dialog" title="添加辅助线" data-options="closed:true, modal:true" style="width:600px;height:300px;padding: 10px">

</div>
</body>
</html>
