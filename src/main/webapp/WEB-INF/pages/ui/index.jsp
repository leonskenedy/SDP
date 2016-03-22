<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<html>
<head>
    <title></title>
    <script src="${ctx}/js/lib/jquery1.9.min.js"></script>
    <script src="${ctx}/js/lib/jquery.easyui.min.js"></script>
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
    <div data-options="name:'new'">New</div>
    <div data-options="name:'save'">Save</div>
    <div data-options="name:'print'">Print</div>
    <div class="menu-sep"></div>
    <div data-options="name:'exit'">Exit</div>
</div>
</body>
</html>
