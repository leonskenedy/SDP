<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<html>
<head>
    <title></title>
    <script src="${ctx}/js/lib/jquery1.9.min.js"></script>
    <script src="${ctx}/js/lib/jquery.easyui.min.js"></script>
    <script src="${ctx}/js/lib/echarts.js"></script>
    <script src="${ctx}/js/utils.js"></script>
    <link type="text/css" rel="stylesheet" href="${ctx}/css/easyui.css">
    <link type="text/css" rel="stylesheet" href="${ctx}/css/icon.css">
    <link type="text/css" rel="stylesheet" href="${ctx}/css/ui.css">
    <script src="${ctx}/js/ui/index.js"></script>
    <style>
        #chart_column_panel_center .panel-body{
            border: none;
        }
    </style>
</head>
<body style="margin: 0">
<div id="mm">
    <div formula="SUM" data-options="name:'SUM'">求和</div>
    <div formula="AVG" data-options="name:'AVG'">平均值</div>
    <div formula="COUNT" data-options="name:'COUNT'">计数</div>
    <div formula="D-COUNT" data-options="name:'COUNT_DISTINCT'">去重计数</div>
</div>
</body>
</html>
