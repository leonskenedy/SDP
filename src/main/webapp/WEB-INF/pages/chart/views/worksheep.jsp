<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="zzjz-visual-ws-left" style="background-color: #b5b5b5">
    <div ng-repeat="x in worksheets">
        <div ng-click="resetStatus(x)">{{x.name}}</div>
        <div ng-show="x.open">
            <ul>
                <li ng-repeat="v in x.sheets" ng-click="loadSheetData(v.id)">
                    {{v.name}}
                </li>
            </ul>
        </div>
    </div>
</div>
<div class="zzjz-visual-ws-right">
    <table>
        <thead>
        <th ng-repeat="col in selectedSheet.columns">
            {{col.label}}
        </th>
        </thead>
        <tbody>
        <tr ng-repeat="data in selectedSheet.datas">
            <td ng-repeat="col in selectedSheet.columns">
                {{data[col.name]}}
            </td>
        </tr>
        </tbody>
    </table>
</div>