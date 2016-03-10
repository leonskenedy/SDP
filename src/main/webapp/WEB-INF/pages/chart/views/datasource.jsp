<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div>
    <table>
        <thead>
        <th>名称</th>
        <th>类型</th>
        <th>最近同步时间</th>
        <th>操作</th>
        </thead>
        <tbody>
        <tr ng-repeat="x in datas">
            <td>{{x.name}}</td>
            <td>{{x.type}}</td>
            <td>{{x.syncTime}}</td>
            <td><a ng-click="editDS($index)">配置表</a> <a ng-click="deleteDS($index)">删除</a></td>
        </tr>
        </tbody>
    </table>
</div>
