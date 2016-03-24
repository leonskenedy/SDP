package com.zzjz.visual.chart.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.github.abel533.echarts.AxisPointer;
import com.github.abel533.echarts.axis.CategoryAxis;
import com.github.abel533.echarts.axis.SplitLine;
import com.github.abel533.echarts.axis.ValueAxis;
import com.github.abel533.echarts.code.*;
import com.github.abel533.echarts.feature.MagicType;
import com.github.abel533.echarts.json.GsonOption;
import com.github.abel533.echarts.json.GsonUtil;
import com.github.abel533.echarts.series.Bar;
import com.google.common.collect.Lists;
import com.zzjz.utils.Contants;
import com.zzjz.utils.EnhancedOption;
import com.zzjz.utils.JsonUtils;
import com.zzjz.visual.chart.service.IChartService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
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
        } catch (UnsupportedEncodingException e) {
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
        //图内筛选器
        JSONObject filter_list_inner = meta.getJSONObject("filter_list_inner");
        /*"filter_list_inner": {
            "0": []
        }*/

        List<GsonOption> options = Lists.newArrayList();
        StringBuffer filterSql = new StringBuffer(200);
        for (int i = 0; i < filter_list.size(); i++) {
            JSONObject filterItem = filter_list.getJSONObject(i);

            String adv_type = filterItem.getString("adv_type");
            ////range_type 0 不包含  1包含
            String range_type = filterItem.getString("range_type");
            //精确筛选
            if (Contants.ADV_TYPE_EXACT.equals(adv_type)) {
                filterSql.append(" and ").append(filterItem.getString("fid")).append(" ");
                //全部包含
                if (Contants.RANGE_TYPE_IN.equals(range_type)) {
                    filterSql.append(Contants.RANGE_TYPE_IN);
                    //全部不包含
                } else if (Contants.RANGE_TYPE_NOT_IN.equals(range_type)) {
                    filterSql.append(Contants.RANGE_TYPE_NOT_IN);
                }
                JSONArray rangeJsonArr = filterItem.getJSONArray("range");
                for (int j = 0; j < rangeJsonArr.size(); j++) {
                    String rangeStr = rangeJsonArr.getString(j);
                    String[] rangeArr = rangeStr.substring(1, rangeStr.length() - 1).split(",");
                    filterSql.append("(").append(StringUtils.join(rangeArr, ",")).append(") ");
                }
                //条件筛选
            } else if (Contants.ADV_TYPE_CONDITION.equals(adv_type)) {

                //表达式筛选
            } else if (Contants.ADV_TYPE_EXPRESSION.equals(adv_type)) {
                JSONArray rangeJsonArr = filterItem.getJSONArray("range");
                for (int j = 0; j < rangeJsonArr.size(); j++) {
                    filterSql.append(" and ").append(rangeJsonArr.getString(j));
                }
            }
        }
        //循环层级对应的xy轴信息
        for (int i = 0; i < level.size(); i++) {
            GsonOption option = new EnhancedOption();
            //设置主标题，主标题居中
            option.title().text(json.getString("name")).x(X.center);
            //Tool.mark 无效
            option.toolbox().show(true).feature(Tool.dataZoom, Tool.dataView, new MagicType(Magic.line, Magic.bar, Magic.stack, Magic.tiled).show(true), Tool.restore, Tool.saveAsImage);
            option.calculable(true).tooltip().axisPointer(new AxisPointer().type(PointerType.shadow)).trigger(Trigger.axis);
            option.tooltip().padding(10).backgroundColor("white").borderColor("#7ABCE9").borderWidth(2);
//            StringBuffer formatterFun = new StringBuffer("function (params){var res = params[0].name;");
//            StringBuffer formatterFun = new StringBuffer("function (params){");
            ValueAxis valueAxis = new ValueAxis();
            valueAxis.splitLine().show(false);
            JSONObject item = level.getJSONObject(i);
            String yaxis_unit = item.getString("yaxis_unit");
            //设置最大值
            if (!item.getBoolean("yaxis_max_disabled")) {
                valueAxis.max(item.getString("yaxis_max"));
            }
            //设置最小值
            if (!item.getBoolean("yaxis_min_disabled")) {
                valueAxis.min(item.getString("yaxis_min"));
            }
            //设置单位
            if (StringUtils.isNotBlank(yaxis_unit)) {
                valueAxis.axisLabel().formatter("{value} " + yaxis_unit);
            }
            valueAxis.name(item.getString("yaxis_name")).nameLocation(NameLocation.middle).nameGap(55);
            option.yAxis().add(valueAxis);
            //循环X轴
            JSONArray x = item.getJSONArray("x");
            for (int j = 0; j < x.size(); j++) {

                JSONObject xItem = x.getJSONObject(i);
                String xFid = xItem.getString("fid");
                String granularity = null;
                //字段数据类型
                String data_type = xItem.getString("data_type");
                if (Contants.DATA_TYPE_DATE.equals(data_type)) {
                    granularity = xItem.getString("granularity");
                }
                //自定义分组名称
                String granularity_name = xItem.getString("granularity_name");
                JSONObject granularity_type = service.queryToolbarGranularity(chart_id, granularity_name);
                JSONArray y = item.getJSONArray("y");
                option.tooltip().formatter("function(params){return tooltipFormatter(params,'" + y + "');}");
                //循环Y轴
                for (int k = 0; k < y.size(); k++) {
                    JSONObject yItem = y.getJSONObject(k);
                    //设置数值数组每个元素的名称
                    String yName = yItem.getString("name");
                    String yFid = yItem.getString("fid");
                    String aggregator = yItem.getString("aggregator");
                    //高级计算 cancel:取消percentage:百分比
                    JSONObject advance_aggregator = yItem.getJSONObject("advance_aggregator");

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

                    List<List<String>> list = service.getGroupArrayList(tb_id, xFid, aggregator, granularity, granularity_type);
                    option.xAxis().add(new CategoryAxis().data(list.get(1).toArray()).splitLine(new SplitLine().show(false)));
                    //设置Y轴数据
                    Bar bar = new Bar(yName);
                    //高级计算百分比
                    if (advance_aggregator != null && Contants.ADV_AGG_TYPE_PERCENTAGE.equals(advance_aggregator.getString("type"))) {
                        bar.data(service.percentage(list.get(0)).toArray());
                    } else {
                        bar.data(list.get(0).toArray());
                    }

                    option.series().add(bar);

                    option.legend().y(Y.bottom).data().add(yName);
//                bar.markPoint().data(new PointData().type(MarkType.max).name("最大值"), new PointData().type(MarkType.min).name("最小值"));
//                bar.markLine().data(new PointData().type(MarkType.average).name("平均值"));

                }
            }
//            formatterFun.append("return res;}");
//            System.out.println(formatterFun);
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

    /**
     * chart工具栏操作
     *
     * @return
     */
    @RequestMapping(value = "toolbar/{chartId}/{type}", method = RequestMethod.POST)
    @ResponseBody
    public Object updateToolbar(@PathVariable String chartId, @PathVariable String type, @RequestBody String jsonString) {
        JSONObject respJson = new JSONObject();
        respJson.put("flag", "0");
        respJson.put("msg", "success");
        service.saveToolbar(chartId, type, jsonString);
        return respJson;
    }

}
