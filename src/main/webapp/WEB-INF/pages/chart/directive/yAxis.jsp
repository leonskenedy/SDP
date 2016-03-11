<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="zzjz-visual-chart-dragdrop" data-jqyoui-options="{revert: 'invalid', helper: 'clone',appendTo:'.zzjz-visual-chart-definition', containment:'.zzjz-visual-chart-definition'}"
     data-drag="true" jqyoui-draggable data-jqyoui-draggable="{onStop:'verifyRemove(\'y\')', onDrag:'verifyDrag(\'x\')'}"
     axis_type="y" column_name="{{yAxis.fid}}" aggregator="{{yAxis.aggregator}}"
        >
    <div ng-click="yAxis.isShow=!yAxis.isShow">
        <span>{{yAxis.name}}</span>
        <span style="font-size: 12px">({{yAxis.aggregator_name}})</span>
        <span class="zzjz-visual-chart-whitedown"></span>
    </div>
    <div class="zzjz-visual-chart-yaxis-formula" ng-show="yAxis.isShow" click-outside="alert(111)">
        <ul style="list-style: none;text-align: left;padding: 0 0 0 10px;">
            <li ng-click="selectYAXisFormula(yAxis, 'SUM', '求和')" ng-show="yAxis.data_type=='number'" ng-class="{'active':yAxis.aggregator == 'SUM'}">求和</li>
            <li ng-click="selectYAXisFormula(yAxis, 'AVG', '平均值')" ng-show="yAxis.data_type=='number'" ng-class="{'active':yAxis.aggregator == 'AVG'}">平均值</li>
            <li ng-click="selectYAXisFormula(yAxis, 'COUNT', '计数')" ng-class="{'active':yAxis.aggregator == 'COUNT'}">计数</li>
            <li ng-click="selectYAXisFormula(yAxis, 'COUNT_DISTINCT', '去重计数')"i ng-class="{'active':yAxis.aggregator == 'COUNT_DISTINCT'}">去重计数</li>
        </ul>
    </div>
</div>

