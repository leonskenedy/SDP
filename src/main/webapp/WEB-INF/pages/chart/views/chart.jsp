<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div style="position: absolute;top: 0px;height: 60px;left: 0px;right: 0px;text-align: center;line-height: 60px;border-bottom: 1px solid #e6e6e6;background: #fff">
    <a title="完成"
       style="text-align:left;line-height: 60px;margin-left: 15px;min-width: 110px;cursor: pointer;position: absolute;top: 0px;left: 0px;text-decoration: none;;"
       ng-click="saveData()">
        <span class="zzjz-visual-chart-back"></span>
        <span>完成</span>
    </a>
    <h2 style="font-size: 20px;font-family: 微软雅黑">编辑图表</h2>
</div>
<div style="position: absolute; top: 60px;bottom: 0px;left: 0px; right: 0px">
    <div class="zzjz-visual-chart-left">
        <div class="zzjz-visual-chart-columns">
            <div style="border-bottom: 1px #ccc solid;padding-left: 15px">
                <div style="overflow: hidden">
                    <h5>工作表</h5>
                    <p ng-bind="chart.table_name"></p>
                    <a title="切换工作表">
                        <span class="zzjz-visual-chart-exchange"></span>
                    </a>
                </div>
            </div>
            <div>
                <div style="padding-left: 15px;padding-right: 15px;margin-top: 10px">
                    <p>字段</p>
                    <div>
                        <input class="zzjz-visual-chart-querycolumn">
                    </div>
                </div>
                <div style="margin-left: 30px">
                    <div data-jqyoui-options="{revert: 'invalid', helper: 'clone',appendTo:'body'}" data-drag="true" jqyoui-draggable ng-repeat="x in tableColumns" style="margin-bottom: 10px;cursor: pointer">
                        <span class="zzjz-visual-chart-column-{{getColumnTypeText(x.column_type)}}"></span>
                        <span ng-bind="x.column_cn" column_en="{{x.column_en}}"></span>
                    </div>
                </div>

            </div>
            <div style="cursor: pointer;text-align: center;margin: 0 15px 0 15px;height: 28px;border: 1px #ccc solid;">
                <a>
                    <span class="zzjz-visual-chart-select"></span>
                </a>
            </div>
        </div>
        <div class="zzjz-visual-chart-definition">
            <div style="position: relative;background-color: #fff;box-shadow: 0 0 2px 0 rgba(0,0,0,.08);">
                <div class="zzjz-visual-chart-xdiv zzjz-visual-chart-axis" style="padding: 6px;border-bottom: 1px solid #e5e5e5;height: 45px">
                    <span style="margin-left: 15px; float: left;line-height: 28px">维度</span>
                    <div style="margin-left: 65px;height: 28px" data-drop="true" jqyoui-droppable data-jqyoui-options="{greedy:true}" data-jqyoui-droppable="{onDrop:'addDropXAxis(\'y\')'}">
                        <div class="zzjz-visual-chart-dragdrop" ng-repeat="x in chart.meta.level[0].x" ng-bind="x.name"></div>
                    </div>

                </div>
                <div class="zzjz-visual-chart-ydiv zzjz-visual-chart-axis" style="padding: 6px;border-bottom: 1px solid #e5e5e5;height: 45px">
                    <span style="margin-left: 15px; float: left;line-height: 28px">数值</span>
                    <div style="margin-left: 65px;height: 28px" data-drop="true" jqyoui-droppable data-jqyoui-options="{greedy:true}" data-jqyoui-droppable="{onDrop:'addDropYAxis(\'y\')'}">
                        <!--<div class="zzjz-visual-chart-dragdrop" ng-repeat="x in chart.yAxis" ng-bind="x.label"></div>-->
                        <yaxis ng-repeat="yAxis in chart.meta.level[0].y"></yaxis>
                    </div>
                </div>
            </div>
            <div class="zzjz-visual-chart-filter" style="padding: 6px" data-drop="true" jqyoui-droppable data-jqyoui-options="{greedy:true}" data-jqyoui-droppable="{onDrop:'addFilter(\'y\')'}">
                <p style="margin-left: 15px">筛选器</p>
                <div style="margin-top: 15px">
                    <p style="text-align: center;color: #ddd;">拖拽字段到这里<br />进行筛选</p>
                </div>
            </div>
            <div id="echarts_div" class="zzjz-visual-chart-graph" data-drop="true" jqyoui-droppable data-jqyoui-options="{greedy:true}" data-jqyoui-droppable="{onDrop:'removeDragData(\'y\')'}"></div>
        </div>
    </div>
    <div class="zzjz-visual-chart-right" style="overflow-x: hidden;overflow-y: auto">
        <div style="padding: 16px 10px;border-bottom: 1px solid #e5e5e5">
            <div style="font-weight: 700;margin-bottom: 12px;font-size: 12px">图标标题</div>
            <div><input class="zzjz-visual-chart-name-input" ng-model="chart.name"/></div>
        </div>
        <div style="padding: 16px 10px;border-bottom: 1px solid #e5e5e5">
            <div style="font-weight: 700;margin-bottom: 12px;font-size: 12px">图表类型</div>
            <div>
                <ul class="zzjz-visual-chart-type-ul">
                    <li ng-repeat="x in chartTypes" ng-click="selectChartType(x)" style="cursor: pointer">
                        <span class="zzjz-visual-chart-type zzjz-visual-chart-type-{{isChartTypeActive(x.typeName)}}"></span>
                    </li>
                </ul>
            </div>
        </div>
        <div style="padding: 16px 10px;border-bottom: 1px solid #e5e5e5;position: relative">
            <div style="font-weight: 700;margin-bottom: 12px;font-size: 12px">图内筛选器</div>
            <span class="zzjz-visual-chart-graphfilter"></span>
        </div>
    </div>
</div>