<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="${ctx}/css/bootstrap.min.css">
    <link type="text/css" rel="stylesheet" href="${ctx}/css/index.css">
    <script src="${ctx}/js/lib/jquery1.9.min.js"></script>
    <script src="${ctx}/js/lib/jquery-ui.min.js"></script>
    <script src="${ctx}/js/lib/angular1.4.6.min.js"></script>
    <script src="${ctx}/js/lib/angular-dragdrop.min.js"></script>
    <script src="${ctx}/js/lib/angular-route.js"></script>
    <script src="${ctx}/js/lib/echarts.js"></script>
    <script src="${ctx}/js/visual/index.js"></script>
</head>
<body ng-app="app">
<div class="zzjz-visual-sidebar" ng-controller="leftMenu">
    <div id="logo_div">
        logo
    </div>
    <div class="zzjz-visual-wrap">
        <ul class="zzjz-visual-list">
            <li class="zzjz-visual-list-item"
                ng-class="{'zzjz-visual-list-item-active':selectedItem == 'dashbord'}"
                ng-click="selectItem('dashbord')">
                <span>仪表盘</span>
            </li>
            <li class="zzjz-visual-list-item"
                ng-class="{'zzjz-visual-list-item-active':selectedItem == 'worksheet'}"
                ng-click="selectItem('worksheet')">
                <span>工作表</span></li>
            <li class="zzjz-visual-list-item"
                ng-class="{'zzjz-visual-list-item-active':selectedItem == 'datasource'}"
                ng-click="selectItem('datasource')"><span>数据源</span></li>
        </ul>
    </div>
</div>
<div class="right-div" ng-view>
    aa
</div>
</body>
</html>
