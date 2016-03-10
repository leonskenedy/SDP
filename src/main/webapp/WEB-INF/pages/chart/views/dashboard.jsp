<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="zzjz-visual-db-left">
    <div ng-repeat="x in datas">
        <div ng-click="resetStatus(x)">{{x.name}}</div>
        <div ng-show="x.open">
            <ul>
                <li ng-repeat="v in x.datas" ng-click="loadChartDatas(v)">
                    {{v.name}}
                </li>
            </ul>
        </div>
    </div>
</div>
<div class="zzjz-visual-db-right">
    <div style="display: inline-block;width: 200px;height:150px;background-color: brown" ng-repeat="c in views">
        <div>{{c.name}}<span ng-click="editChart(c)" class="zzjz-visual-cursor">编辑</span></div>

    </div>
</div>