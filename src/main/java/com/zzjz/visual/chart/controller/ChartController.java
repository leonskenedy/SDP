package com.zzjz.visual.chart.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.github.abel533.echarts.AxisPointer;
import com.github.abel533.echarts.Grid;
import com.github.abel533.echarts.axis.*;
import com.github.abel533.echarts.code.*;
import com.github.abel533.echarts.data.PointData;
import com.github.abel533.echarts.feature.MagicType;
import com.github.abel533.echarts.json.GsonOption;
import com.github.abel533.echarts.json.GsonUtil;
import com.github.abel533.echarts.series.Bar;
import com.github.abel533.echarts.series.Line;
import com.github.abel533.echarts.series.Map;
import com.github.abel533.echarts.series.Series;
import com.google.common.collect.Lists;
import com.zzjz.utils.Contants;
import com.zzjz.utils.DataUtils;
import com.zzjz.utils.EnhancedOption;
import com.zzjz.utils.JsonUtils;
import com.zzjz.visual.chart.service.IChartService;
import com.zzjz.visual.chart.service.TestService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * chart控制器
 * Created by cnwan on 2016/3/7.
 */
@Controller
@RequestMapping("chart")
public class ChartController {

    @Autowired
    private IChartService service;
    @Autowired
    private TestService testService;

    /**
     * 修改Chart
     *
     * @return
     */
    @RequestMapping(value = "update", method = RequestMethod.POST)
    @ResponseBody
    public Object updateChart(@RequestBody String jsonString) {
        JSONObject respJson = new JSONObject();
        respJson.put("flag", "0");
        respJson.put("msg", "success");

        JSONObject json = null;
        try {
            json = (JSONObject) JSONObject.parse(java.net.URLDecoder.decode(jsonString, "utf-8").replaceAll("=$", ""));
//            json = (JSONObject) JSONObject.parse(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
        }
        //图表ID
        String chart_id = JsonUtils.getJsonValue(json, "chart_id", UUID.randomUUID().toString());
        //数据源表ID
        String tb_id = json.getString("tb_id");
        //图表详细数据
        JSONObject meta = json.getJSONObject("meta");
        //层级数组
        JSONArray level_fields = meta.getJSONArray("level_fields");
        //XY轴显示参数
        JSONArray level = meta.getJSONArray("level");
        //筛选器
        JSONArray filter_list = meta.getJSONArray("filter_list");
        //拼装筛选器sql语句
        String filterSql = service.joinFilterSql(filter_list);
        //图内筛选器
        JSONObject filter_list_inner = meta.getJSONObject("filter_list_inner");

        List<GsonOption> options = Lists.newArrayList();

        //循环层级对应的xy轴信息
        for (int i = 0; i < level.size(); i++) {
            GsonOption option = new EnhancedOption();
//            option.timeline();
            //设置主标题，主标题居中
            option.title().text(json.getString("name")).x(X.center);
//            option.title().text(json.getString("name"));
            //Tool.mark 无效 Tool.dataZoom,数值过大有问题，Y轴显示不了
            option.toolbox().show(true).feature(Tool.dataView, new MagicType(Magic.line, Magic.bar, Magic.stack, Magic.tiled).show(true), Tool.restore, Tool.saveAsImage);
            option.calculable(true).tooltip().axisPointer(new AxisPointer().type(PointerType.shadow)).trigger(Trigger.axis);
            option.tooltip().padding(10).backgroundColor("white").borderColor("#7ABCE9").borderWidth(2);
            option.grid(new Grid().x(40).x2(100).y2(150));
            JSONObject item = level.getJSONObject(i);


            //拼装option data数据
            setData(chart_id, tb_id, filterSql, option, item);

            options.add(option);
        }
        options.get(0).exportToHtml("test.html");
        String optionStr = GsonUtil.format(options.get(0));
        service.save(chart_id, jsonString, optionStr);
        respJson.put("info", json);
        respJson.put("option", options.get(0).toString());
        System.out.println(options.get(0));
        return respJson;
    }

    private void setData(String chart_id, String tb_id, String filterSql, GsonOption option, JSONObject item) {
        //柱状图X只有一个
        JSONArray x = item.getJSONArray("x");

        JSONObject xItem = x.getJSONObject(0);//X只有一个
        String xFid = xItem.getString("fid");

        //自定义分组名称
        String granularity_name = xItem.getString("granularity_name");
        JSONObject granularity_type = service.queryToolbarGranularity(chart_id, granularity_name);
        String granularity = null;
        //字段数据类型
        String data_type = xItem.getString("data_type");
        if (Contants.DATA_TYPE_DATE.equals(data_type)) {
            granularity = xItem.getString("granularity");
        }

        JSONArray type_optional = new JSONArray();
        //判断是否双轴
        if (item.getBoolean("show_y_axis_optional")) {
            type_optional = item.getJSONArray("type_optional");
        } else {
            type_optional.add(item.getString("chart_type"));
        }

        List<String> aggregatorList = new ArrayList<>();//聚合函数集合

        String sortFid = null;
        //回传到前台处理数字格式化参数
        JSONArray formatterJson = new JSONArray();
        //排序
        JSONObject sort = item.getJSONObject("sort");

        //是否自定刷新时间轴有效
        Boolean auto_flush = item.getBoolean("auto_flush") == null ? false : item.getBoolean("auto_flush");
//        Boolean auto_flush = true;
        //自动刷新开始时间
        String start_time = item.getString("start_time");


        //结果最大最小值筛选器
        StringBuffer aggr_filterSql = new StringBuffer();

        for (int i = 0; i < type_optional.size(); i++) {
            JSONArray y = null;
            if (i == 0) {
                y = item.getJSONArray("y");
            } else if (i == 1) {
                y = item.getJSONArray("y_optional");
            }
            formatterJson.addAll(y);

            //循环Y轴
            for (int k = 0; k < y.size(); k++) {
                JSONObject yItem = y.getJSONObject(k);

                String yFid = yItem.getString("fid");
                String aggregator = yItem.getString("aggregator");

                //去重计数
                if (Contants.AGG_TYPE_COUNT_DISTINCT.equals(aggregator)) {
                    aggregator = Contants.AGG_TYPE_COUNT + "(DISTINCT " + yFid + ")";
                    //中位数&百分位数
                } else if (Contants.AGG_TYPE_PERCENT.equals(aggregator)) {
                    Double percent = yItem.getDouble("percent");
//                        Percentile percentile = new Percentile();
//                        percentile.setData();
//                        DescriptiveStatistics ds = new DescriptiveStatistics();

                } else {
                    //SUM,AVG,COUNT,MAX,MIN
                    aggregator = aggregator + "(" + yFid + ")";
                }

                aggregatorList.add(aggregator + " AS '" + k + "'");

                //结果筛选器
                JSONObject aggr_filter = yItem.getJSONObject("aggr_filter");
                if (aggr_filter != null) {
                    String max = aggr_filter.getString("max");
                    String min = aggr_filter.getString("min");
                    if (StringUtils.isNotBlank(filterSql)) {
                        aggr_filterSql.append(" AND ");
                    }
                    if (StringUtils.isNotBlank(max)) {
                        aggr_filterSql.append(" ").append(aggregator).append("<=").append(max);
                    }
                    if (StringUtils.isNotBlank(min)) {
                        aggr_filterSql.append(" ").append(aggregator).append(">=").append(min);
                    }
                }

                if (sort.getString("uniq_id").equals(yItem.getString("uniq_id"))) {
                    String sortType = sort.getString("type");
                    if (Contants.SOTR_TYPE_ASC.equals(sortType)) {
                        sortFid = aggregator;
                    } else if (Contants.SOTR_TYPE_DESC.equals(sortType)) {
                        sortFid = aggregator + " DESC";
                    }
                }
            }
        }

        //维度显示条目数
        JSONObject top = item.getJSONObject("top");

        option.tooltip().formatter("function(params){return tooltipFormatter(params,'" + formatterJson + "');}");


        String aggregator = StringUtils.join(aggregatorList, ",");

        //地图设置
        boolean isMap = false;
        if(type_optional != null && type_optional.size() == 1 && "C271".equals(type_optional.get(0))){
            isMap = true;
        }
        //地图设置


        List<List<String>> list = service.getGroupArrayList(tb_id, xFid, aggregator, granularity, granularity_type, top, sortFid, filterSql, aggr_filterSql.toString(),start_time, isMap);
        List<String> xAxisData = list.get(list.size() - 1);//X轴

        Axis xAxis;
        //自动刷新X轴使用时间轴
        if (auto_flush) {
            xAxis = new TimeAxis().splitLine(new SplitLine().show(false));
        } else {//X轴默认为类目轴
            xAxis = new CategoryAxis().data(xAxisData.toArray()).splitLine(new SplitLine().show(false));
        }
        if (xAxisData.size() > 8) {
            xAxis.axisLabel(new AxisLabel().rotate(45).interval(0));
        }

        option.xAxis().add(xAxis);
        for (int i = 0; i < type_optional.size(); i++) {
            String yaxis_name = null;
            String yaxis_unit = null;
            String yaxis_max = null;
            String yaxis_min = null;
            Boolean yaxis_max_disabled = null;
            Boolean yaxis_min_disabled = null;
            JSONArray y = null;
            //辅助线数组
            JSONArray guide_lineArr = null;
            if (i == 0) {
                y = item.getJSONArray("y");
                yaxis_max_disabled = item.getBoolean("yaxis_max_disabled");
                yaxis_min_disabled = item.getBoolean("yaxis_min_disabled");
                yaxis_unit = item.getString("yaxis_unit");
                yaxis_max = item.getString("yaxis_max");
                yaxis_min = item.getString("yaxis_min");
                yaxis_name = item.getString("yaxis_name");
                guide_lineArr = item.getJSONArray("guide_line");
            } else if (i == 1) {
                y = item.getJSONArray("y_optional");
                yaxis_max_disabled = item.getBoolean("yaxis_max_disabled_right");
                yaxis_min_disabled = item.getBoolean("yaxis_min_disabled_right");
                yaxis_unit = item.getString("yaxis_unit_right");
                yaxis_max = item.getString("yaxis_max_right");
                yaxis_min = item.getString("yaxis_min_right");
                yaxis_name = item.getString("yaxis_name_right");
                guide_lineArr = item.getJSONArray("guide_line_right");
            }
            ValueAxis valueAxis = new ValueAxis();
            valueAxis.splitLine().show(false);
            //设置最大值
            if (!yaxis_max_disabled) {
                valueAxis.max(yaxis_max);
            }
            //设置最小值
            if (!yaxis_min_disabled) {
                valueAxis.min(yaxis_min);
            }

            valueAxis.name(yaxis_name).nameLocation(NameLocation.middle).nameGap(55);
            option.yAxis().add(valueAxis);

            //设置单位
            if (StringUtils.isNotBlank(yaxis_unit)) {
                valueAxis.axisLabel().formatter("{value} " + yaxis_unit);
            }
            for (int j = 0; j < y.size(); j++) {
                JSONObject yItem = y.getJSONObject(j);

                String name = yItem.getString("nick_name");//别名

                if (StringUtils.isBlank(name)) {
                    name = yItem.getString("name");
                }
                //设置Y轴数据
                Series series = null;
                if ("C210".equals(type_optional.get(i))) {//柱状图
                    series = new Bar(name);
                } else if ("C220".equals(type_optional.get(i))) {//折线图
                    series = new Line(name);
                }else if("C271".equals(type_optional.get(i))){
                    series = new Map(name);
                }
                //高级计算 cancel:取消percentage:百分比
                JSONObject advance_aggregator = yItem.getJSONObject("advance_aggregator");
                //高级计算百分比
                if (advance_aggregator != null && Contants.ADV_AGG_TYPE_PERCENTAGE.equals(advance_aggregator.getString("type"))) {
                    series.data(service.percentage(list.get(j)).toArray());
                } else {
                    if (auto_flush) {
                        for (int k = 0; k < list.get(j).size(); k++) {
                            JSONObject json = new JSONObject();
//                            json.put("name", xAxisData.get(k));
                            json.put("name", DataUtils.parseDate(xAxisData.get(k),DataUtils.date_sdf_wz).getTime());
                            json.put("value", new Object[]{xAxisData.get(k), list.get(j).get(k)});
                            series.data().add(json);
                        }
                    } else {
                        series.data(list.get(j).toArray());
                    }
                }

                for (int z = 0; z < guide_lineArr.size(); z++) {
                    JSONObject guide_line = guide_lineArr.getJSONObject(z);
                    String value_type = guide_line.getString("value_type");
                    String uniq_id = guide_line.getString("uniq_id");
                    if (yItem.getString("uniq_id").equals(uniq_id)) {
                        String guide_linName = guide_line.getString("name");
                        //固定值辅助线 jar包功能不完善，使用json代替
                        if (Contants.GUIDE_LINE_TYPE_CONSTANT.equals(value_type)) {
                            double value = guide_line.getDouble("value");
                            JSONArray coordArray = new JSONArray();

                            //起点
                            JSONObject coordStart = new JSONObject();
                            coordStart.put("name", value);
                            coordStart.put("realName", guide_linName);
                            //x,y轴
                            coordStart.put("coord", new Object[]{xAxisData.get(0), value});
                            //终点
                            JSONObject coordStop = new JSONObject();
                            coordStop.put("coord", new Object[]{xAxisData.get(xAxisData.size() - 1), value});
                            coordArray.add(coordStart);
                            coordArray.add(coordStop);
                            series.markLine().data(coordArray);
                            //计算值辅助线  最大值 最小值 平均值
                        } else if (Contants.GUIDE_LINE_TYPE_CALCULATE.equals(value_type)) {
                            PointData pointData = new PointData();
                            pointData.name(guide_linName);
                            String formula = guide_line.getString("formula");//AVG MIN MAX
                            if (Contants.AGG_TYPE_AVG.equals(formula)) {
                                pointData.type(MarkType.average);
                            } else if (Contants.AGG_TYPE_MAX.equals(formula)) {
                                pointData.type(MarkType.max);
                            } else if (Contants.AGG_TYPE_MIN.equals(formula)) {
                                pointData.type(MarkType.min);
                            }
                            series.markLine().data(pointData);
                        }
                    }
                }
                if("C271".equals(type_optional.get(i))){
                    //series = new Map(name);
                    //String aa = "bbb";
                    //testService.resetMapAxis((CategoryAxis) option.xAxis().get(0));
                    option.series().add(series);
                }else{
                    option.series().add(series);
                }

                //图例在图表下方 默认在上方
                option.legend().y(Y.bottom).data().add(name);

            }
        }
    }


    /**
     * @param chartId
     * @param type       granularity_type 自定义日期粒度类型
     * @param type       adv_date_type 日期筛选器
     * @param jsonString
     * @return
     */
    @RequestMapping(value = "toolbar/{type}", method = RequestMethod.POST)
    @ResponseBody
    public Object updateToolbar(@RequestParam(required = false) String chartId, @RequestParam(required = false) String optId, @PathVariable String type, @RequestBody String jsonString) {
        JSONObject respJson = new JSONObject();
        respJson.put("flag", "0");
        respJson.put("msg", "success");
        if (StringUtils.isNotBlank(optId)) {//更新设置
            service.updaToolbar(chartId, optId, type, jsonString);
            respJson.put("optId", optId);
        } else {//新增设置
            respJson.put("optId", service.saveToolbar(chartId, type, jsonString));
        }
        return respJson;
    }

}
