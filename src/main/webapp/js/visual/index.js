var app = angular.module("app", ['ngRoute', 'ngDragDrop']);
app.config(function ($routeProvider) {
    $routeProvider.when('/views/dashbord', {
        templateUrl: 'views/dashboard',
        controller: "dbController"
    }).when("/views/datasource", {
        templateUrl: "views/datasource",
        controller: 'dsController'
    }).when("/views/worksheet", {
        templateUrl: "views/worksheet",
        controller: "wsController"
    }).when("/views/chart", {
        templateUrl: "views/chart",
        controller: "ChartController"
    })

});
app.controller("leftMenu", function ($scope, $location) {
    $scope.selectedItem = "dashbord";
    $scope.selectItem = function (itemName) {
        $scope.selectedItem = itemName;
        $location.path("views/" + itemName)
    }
});
app.controller("dbController", function($scope, $http, $location){
//    $http.get("json/dashboard.json").success(function(response){
//       $scope.datas = response;
//    });
    $scope.datas = [
        {"id":1, "name":"我的文件夹", "datas":[
            {"id":1, "name":"我的视图1"},{"id":2, "name":"我的视图2"}
        ]},
        {"id":2, "name":"你的文件夹", "datas":[]}
    ];

    $scope.resetStatus = function(data){
        data.open = !data.open;
    }

    $scope.loadChartDatas = function(data){
//        $http.get("json/view.json").success(function(response){
//           $scope.views = response;
//        });
        $scope.views = [
            {"id":1, "name":"柱状图"},{"id":2, "name":"饼图"},{"id":3, "name":"线性图"}
        ];
    }

    $scope.editChart = function(chart){
        $location.path("views/chart")
    }
});
app.controller("dsController", function ($scope, $http) {
//    $http.get("json/datasource.json")
//        .success(function (response) {
//            $scope.datas = response;
//        });
    $scope.datas = [
        {"id":1, "name":"数据源1", "type":"类型", "syncTime":"2016-01-17 15:14:12", "sheets":[
            {"id":1, "name":"sheet1"},
            {"id":2, "name":"sheet2"}
        ]},
        {"id":2, "name":"数据源2", "type":"类型", "syncTime":"2016-01-17 15:14:12", "sheets":[
            {"id":3, "name":"sheet3"},
            {"id":4, "name":"sheet4"}
        ]},
        {"id":3, "name":"数据源3", "type":"类型", "syncTime":"2016-01-17 15:14:12", "sheets":[
            {"id":1, "name":"sheet5"}]},
        {"id":4, "name":"数据源4", "type":"类型", "syncTime":"2016-01-17 15:14:12", "sheets":[
            {"id":6, "name":"sheet6"},
            {"id":7, "name":"sheet7"}
        ]}
    ];
    $scope.editDS = function(seq){
        alert("You are editing DS for id:" + $scope.datas[seq].id);
    }
    $scope.deleteDS = function(seq){
        alert("You are deleting DS for id:" + $scope.datas[seq].id)
    }
});

app.controller("wsController", function($scope, $http){
//    $http.get("json/datasource.json")
//        .success(function (response) {
//            $scope.worksheets = response;
//
//        });
    $scope.worksheets = [
        {"id":1, "name":"数据源1", "type":"类型", "syncTime":"2016-01-17 15:14:12", "sheets":[
            {"id":1, "name":"sheet1"},
            {"id":2, "name":"sheet2"}
        ]},
        {"id":2, "name":"数据源2", "type":"类型", "syncTime":"2016-01-17 15:14:12", "sheets":[
            {"id":3, "name":"sheet3"},
            {"id":4, "name":"sheet4"}
        ]},
        {"id":3, "name":"数据源3", "type":"类型", "syncTime":"2016-01-17 15:14:12", "sheets":[
            {"id":1, "name":"sheet5"}]},
        {"id":4, "name":"数据源4", "type":"类型", "syncTime":"2016-01-17 15:14:12", "sheets":[
            {"id":6, "name":"sheet6"},
            {"id":7, "name":"sheet7"}
        ]}
    ];
    $scope.resetStatus = function(sheet){
        sheet.open = !sheet.open;
    }
    $scope.loadSheetData = function(sheetId){
        alert(sheetId);
//        $http({
//            method:"GET",
//            url:"json/sheetdata.json",
//            params:{id:sheetId}
//        }).success(function(response){
//            $scope.selectedSheet = response[0];
//        })
    }
})

app.controller("ChartController", function($scope, $http){
    $scope.chart = {};

//    $http.get("json/chartdef.json").success(function(response){
//        $scope.chart = response;
//    });
//    $scope.chart = {
//        "name": "自定义图形",
//        "chartType":5,
//        "columns": [
//            {
//                "column_en": "col1",
//                "column_cn": "列1",
//                "column_type": 2
//            },
//            {
//                "column_en": "col2",
//                "column_cn": "列2",
//                "column_type": 2
//            },
//            {
//                "column_en": "col3",
//                "column_cn":"列3",
//                "column_type": 1
//            },
//            {
//                "column_en": "col4",
//                "column_cn":"列4",
//                "column_type": 1
//            }
//        ],
//        "tableName":["工作表1"],
//        "filter":[],
//        "xAxis":[{"value":"col1", "label":"列1", "column_type":"text"}],
//        "yAxis":[{"column_name":"col3", "name":"列3", "column_type":"number", "data_type":1, "aggregator_name":"计数", "aggregator":"COUNT"}]
//    };
//    $http.get("json/charttype.json").success(function(response){
//        $scope.chartTypes = response;
//    });

    $scope.chart = {
        "meta": {
            "level_fields": [],//
            "level": [
                {
                    "show_y_axis_optional": false,
                    "sort": {
                        "axis": "y",
                        "type": "asc",
                        "fid": "fk165862ea",
                        "uniq_id": 1457418558891,
                        "col_index": 1
                    },
                    "top_compare": {
                        "enabled": false,
                        "reversed": 0,
                        "type": "items",
                        "value": 0
                    },
                    "yaxis_max_disabled": true,
                    "yaxis_unit": "元",
                    "yaxis_max": 14134370.080002,
                    "top": {
                        "enabled": false,
                        "reversed": "0",
                        "type": "percent",
                        "value": 2
                    },
                    "guide_line": [],
                    "y": [
                        {
                            "name": "价格（元/公斤）",
                            "data_type": "number",
                            "aggregator": "COUNT_DISTINCT",
                            "aggregator_name": "去重计数",
                            "is_new": false,
                            "uniq_id": 1457575285931,
                            "fid": "price",
                            "is_build_aggregated": 0,
                            "formatter": "",
                            "alias_name": "价格（元/公斤）(去重计数)"
                        },
                        {
                            "fid": "price",
                            "uniq_id": 1457584118006,
                            "name": "价格（元/公斤）",
                            "data_type": "number",
                            "is_new": false,
                            "is_build_aggregated": 0,
                            "aggregator": "SUM",
                            "aggregator_name": "求和",
                            "formatter": ""
                        }
                    ],
                    "title_formula": "AVERAGE",
                    "chart_type": "C210",
                    "yaxis_min": 0,
                    "yaxis_min_disabled": true,
                    "x": [
                        {
                            "name": "类别",
                            "data_type": "string",
                            "is_new": false,
                            "fid": "type",
                            "granularity": "day",
                            "is_build_aggregated": 0
                        }
                    ],
                    "yaxis_name": "价格（元/公斤）A"
                }
            ],
            "filter_list": [],
            "filter_list_inner": {
                "0": []
            }
        },
        "name": "图标名称123",
        "tb_id": "product",
        "description": ""
    };
    $scope.chartTypes = [
        {"id":1, "name":"表格", "typeName":"table"},
        {"id":2, "name":"指标卡", "typeName":"card"},
        {"id":3, "name":"计量图", "typeName":"metering"},
        {"id":4, "name":"折线图", "typeName":"brokenLine"},
        {"id":5, "name":"簇状柱型图", "typeName":"column1"},
        {"id":6, "name":"堆积柱型图", "typeName":"column2"},
        {"id":7, "name":"百分比柱型图", "typeName":"column3"},
        {"id":8, "name":"瀑布图", "typeName":"waterfall"},
        {"id":9, "name":"条形图", "typeName":"bar"},
        {"id":10, "name":"堆积条形图", "typeName":"bar2"},
        {"id":11, "name":"百分比形图", "typeName":"bar3"},
        {"id":12, "name":"桑基图", "typeName":"sankey"},
        {"id":13, "name":"饼图", "typeName":"pie"},
        {"id":14, "name":"地图(面积)", "typeName":"maparea"},
        {"id":15, "name":"地图(气泡)", "typeName":"mapbubble"},
        {"id":16, "name":"雷达图", "typeName":"radar"},
        {"id":17, "name":"双轴图", "typeName":"dualaxis"},
        {"id":18, "name":"散点图", "typeName":"discrete"},
        {"id":19, "name":"漏斗图", "typeName":"dropdown"},
        {"id":20, "name":"云词", "typeName":"cloud"}
    ];
    $scope.parseYAxisType = function(axis){
        switch (axis.action){
            case "sum": return "合计";
            case "average": return "平均";
            case "max": return "最大值";
            case "min": return "最小值";
            case "count": return "计数";
            default: return "未知";
        }
    }
    $scope.addDropYAxis = function(item){
        debugger;
        var columnEn = $(item.toElement).attr("column_en");
        $scope.chart.yAxis = $scope.chart.yAxis ? $scope.chart.yAxis : [];
        for(var i = 0; i < $scope.chart.columns.length; i++){
            if(columnEn == $scope.chart.columns[i].column_en){
                $scope.chart.yAxis.push({
                    name:$scope.chart.columns[i].column_cn,
                    column_name: $scope.chart.columns[i].column_en,
                    data_type:$scope.chart.columns[i].column_type,
                    aggregator_name:"计数",
                    aggregator:"COUNT"
                });
                return;
            }
        }
    }
    $scope.addDropXAxis = function(item){
        var columnEn = $(item.toElement).attr("column_en");
        $scope.chart.xAxis = $scope.chart.xAxis ? $scope.chart.xAxis : [];
        for(var i = 0; i < $scope.chart.columns.length; i++){
            if(columnEn == $scope.chart.columns[i].column_en){
                $scope.chart.xAxis.push({label:$scope.chart.columns[i].column_cn, value: $scope.chart.columns[i].column_en});
                return;
            }
        }
    }
    $scope.selectChartType = function(arg){
        $scope.chart.type = arg.typeName;
    }
    $scope.data_type = {1:"number", 2:"text", 3:"datetime"};
    $scope.getColumnTypeText = function(arg){
        return $scope.data_type[arg];
    }
    $scope.isChartTypeActive = function(type){
        if(type == $scope.chart.type){
            return type + "-active";
        }else{
            return type;
        }
    }
    $scope.saveData = function(){

    }

    $scope.selectYAXisFormula = function(yAxis, f, t){
        yAxis.aggregator = f;
        yAxis.aggregator_name = t;
        yAxis.isShow = false;
    }

    $scope.verifyRemove = function(arg){
        //console.log(arg.toElement);
        //console.log(arg.target);
    }
    $scope.verifyDrag = function(arg){
        //console.log($(arg.toElement).attr("data-drop"))
        //if($(arg.toElement).attr("data-drop")){
        //    $(".ui-draggable-dragging #deleteDiv").remove();
        //}else{
        //    if($(".ui-draggable-dragging #deleteDiv").length == 0){
        //        $(".ui-draggable-dragging").append("<div style='color:red' id='deleteDiv'>X</div>")
        //    }
        //}
    }

    $scope.addFilter = function(arg){

    }
    $scope.removeDragData = function(arg){
        var axisType = $(arg.toElement).attr("axis_type");
        var columnName =  $(arg.toElement).attr("column_name");
        var aggregator = $(arg.toElement).attr("aggregator")
        if(axisType){
            if(axisType == 'y'){
                for(var i = 0, len = $scope.chart.yAxis.length; i < len; i++){
                    if($scope.chart.yAxis[i].column_name == columnName && $scope.chart.yAxis[i].aggregator == aggregator){
                        $scope.chart.yAxis.splice(i, 1);
                        return;
                    }
                }
            }
        }
    }


});

app.directive("yaxis", function(){
    return {
        restrict: 'E',
        replace:true,
        templateUrl: 'directive/yAxis'
    };
})
