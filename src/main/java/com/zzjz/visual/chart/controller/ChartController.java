package com.zzjz.visual.chart.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.github.abel533.echarts.AxisPointer;
import com.github.abel533.echarts.Grid;
import com.github.abel533.echarts.axis.AxisLabel;
import com.github.abel533.echarts.axis.CategoryAxis;
import com.github.abel533.echarts.axis.SplitLine;
import com.github.abel533.echarts.axis.ValueAxis;
import com.github.abel533.echarts.code.*;
import com.github.abel533.echarts.data.PointData;
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

        List<GsonOption> options = Lists.newArrayList();
        StringBuffer filterSql = new StringBuffer(200);
        for (int i = 0; i < filter_list.size(); i++) {

            if (i != 0) {
                filterSql.append(" AND ");
            }

            JSONObject filterItem = filter_list.getJSONObject(i);

            String adv_type = filterItem.getString("adv_type");
            ////range_type 0 不包含  1包含
            String range_type = filterItem.getString("range_type");
            String data_type = filterItem.getString("data_type");
            if (Contants.DATA_TYPE_DATE.equals(data_type)) {//日期类型

            } else if (Contants.DATA_TYPE_NUMBER.equals(data_type)) {//数字类型
                if (Contants.ADV_TYPE_CONDITION.equals(adv_type)) {//条件筛选
                    filterSql.append(" (");
                    String fid = filterItem.getString("fid");
                    JSONArray rangeJsonArr = filterItem.getJSONArray("range");
                    for (int j = 0; j < rangeJsonArr.size(); j++) {
                        String rangeStr = rangeJsonArr.getString(j);
                        JSONObject rangeJson = JSONObject.parseObject(rangeStr);

                        JSONArray conditions = rangeJson.getJSONArray("conditions");
                        for (int k = 0; k < conditions.size(); k++) {
                            if (k != 0) {
                                filterSql.append(" AND ");
                            }
                            filterSql.append(fid);

                            JSONObject condition = conditions.getJSONObject(k);
                            int calc_type = condition.getIntValue("calc_type");
                            String value = condition.getString("value");
                            if (calc_type == 0) {//等于
                                filterSql.append("=").append(value);
                            } else if (calc_type == 1) {//不等于
                                filterSql.append("!=").append(value);
                            } else if (calc_type == 2) {//大于
                                filterSql.append(">").append(value);
                            } else if (calc_type == 3) {//小于
                                filterSql.append("<").append(value);
                            } else if (calc_type == 4) {//大于等于
                                filterSql.append(">=").append(value);
                            } else if (calc_type == 5) {//小于等于
                                filterSql.append("<=").append(value);
                            }
                        }

                    }
                    filterSql.append(")");
                } else if (Contants.ADV_TYPE_EXPRESSION.equals(adv_type)) {//表达式筛选
                    JSONArray rangeJsonArr = filterItem.getJSONArray("range");
                    for (int j = 0; j < rangeJsonArr.size(); j++) {
                        filterSql.append(" (").append(rangeJsonArr.getString(j)).append(") ");
                    }
                }
            } else if (Contants.DATA_TYPE_STRING.equals(data_type)) {//字符串类型
                //精确筛选
                if (Contants.ADV_TYPE_EXACT.equals(adv_type)) {
                    filterSql.append(filterItem.getString("fid")).append(" ");
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
                        filterSql.append(" (").append(StringUtils.join(rangeArr, ",")).append(") ");
                    }
                    //条件筛选
                } else if (Contants.ADV_TYPE_CONDITION.equals(adv_type)) {
                    filterSql.append(" (");
                    String fid = filterItem.getString("fid");
                    JSONArray rangeJsonArr = filterItem.getJSONArray("range");
                    for (int j = 0; j < rangeJsonArr.size(); j++) {
                        String rangeStr = rangeJsonArr.getString(j);
                        JSONObject rangeJson = JSONObject.parseObject(rangeStr);
                        //1 满足任一条件  2满足所有条件
                        String condition_type = rangeJson.getString("condition_type");
                        JSONArray conditions = rangeJson.getJSONArray("conditions");
                        for (int k = 0; k < conditions.size(); k++) {
                            if (k != 0) {
                                if ("1".equals(condition_type)) {//满足任一条件
                                    filterSql.append(" OR ");
                                } else if ("2".equals(condition_type)) {//满足所有条件
                                    filterSql.append(" AND ");
                                }
                            }
                            filterSql.append(fid);

                            JSONObject condition = conditions.getJSONObject(k);
                            int calc_type = condition.getIntValue("calc_type");
                            String value = condition.getString("value");
                            if (calc_type == 0) {//等于
                                filterSql.append("='").append(value).append("'");
                            } else if (calc_type == 1) {//不等于
                                filterSql.append("!='").append(value).append("'");
                            } else if (calc_type == 6) {//包含
                                filterSql.append(" LIKE '%").append(value).append("%'");
                            } else if (calc_type == 7) {//不包含
                                filterSql.append(" NOT LIKE '%").append(value).append("%'");
                            } else if (calc_type == 10) {//开头包含
                                filterSql.append(" NOT LIKE '").append(value).append("%'");
                            } else if (calc_type == 11) {//结尾包含
                                filterSql.append(" NOT LIKE '%").append(value).append("'");
                            }

                        }

                    }
                    filterSql.append(")");
                    //表达式筛选
                } else if (Contants.ADV_TYPE_EXPRESSION.equals(adv_type)) {
                    JSONArray rangeJsonArr = filterItem.getJSONArray("range");
                    for (int j = 0; j < rangeJsonArr.size(); j++) {
                        filterSql.append(" (").append(rangeJsonArr.getString(j)).append(") ");
                    }
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
            option.grid(new Grid().x(40).x2(100).y2(150));

            ValueAxis valueAxis = new ValueAxis();
            valueAxis.splitLine().show(false);
            JSONObject item = level.getJSONObject(i);
            String yaxis_unit = item.getString("yaxis_unit");
            //辅助线数组
            JSONArray guideLineArr = item.getJSONArray("guide_line");
            //维度显示条目数
            JSONObject top = item.getJSONObject("top");
            //排序
            JSONObject sort = item.getJSONObject("sort");

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
            //柱状图X只有一个
            JSONArray x = item.getJSONArray("x");

            JSONObject xItem = x.getJSONObject(0);//X只有一个
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
            List<String> aggregatorList = new ArrayList<>();
            List<String> barNames = new ArrayList<>();
            List<JSONObject> advance_aggregators = new ArrayList<>();
            List<String> yIds = new ArrayList<>();
            String sortFid = null;
            //循环Y轴
            for (int k = 0; k < y.size(); k++) {
                JSONObject yItem = y.getJSONObject(k);
                //设置数值数组每个元素的名称
                barNames.add(yItem.getString("name"));
                String yFid = yItem.getString("fid");
                String aggregator = yItem.getString("aggregator");
                //高级计算 cancel:取消percentage:百分比
                advance_aggregators.add(yItem.getJSONObject("advance_aggregator"));
                yIds.add(yFid);
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
                aggregatorList.add(aggregator);


                if (sort.getString("uniq_id").equals(yItem.getString("uniq_id"))) {
                    String sortType = sort.getString("type");
                    if (Contants.SOTR_TYPE_ASC.equals(sortType)) {
                        sortFid = aggregator;
                    } else if (Contants.SOTR_TYPE_DESC.equals(sortType)) {
                        sortFid = aggregator + " DESC";
                    }
                }

            }


            String aggregator = StringUtils.join(aggregatorList, ",");
            List<List<String>> list = service.getGroupArrayList(tb_id, xFid, aggregator, granularity, granularity_type, top, sortFid, filterSql.toString());
            List<String> xAxis = list.get(list.size() - 1);//X轴
            CategoryAxis categoryAxis = new CategoryAxis().data(xAxis.toArray()).splitLine(new SplitLine().show(false));
            if (list.get(list.size() - 1).size() > 15) {
                categoryAxis.axisLabel(new AxisLabel().rotate(45).interval(0).margin(2));
            }
            option.xAxis().add(categoryAxis);
            for (int j = 0; j < barNames.size(); j++) {
                //设置Y轴数据
                Bar bar = new Bar(barNames.get(i));
                JSONObject advance_aggregator = advance_aggregators.get(i);
                //高级计算百分比
                if (advance_aggregator != null && Contants.ADV_AGG_TYPE_PERCENTAGE.equals(advance_aggregator.getString("type"))) {
                    bar.data(service.percentage(list.get(j)).toArray());
                } else {
                    bar.data(list.get(j).toArray());
                }

                for (int z = 0; z < guideLineArr.size(); z++) {
                    JSONObject guide_line = guideLineArr.getJSONObject(z);
                    String value_type = guide_line.getString("value_type");
                    String fid = guide_line.getString("fid");
                    if (yIds.get(i).equals(fid)) {
                        String name = guide_line.getString("name");
                        //固定值辅助线 jar包功能不完善，使用json代替
                        if (Contants.GUIDE_LINE_TYPE_CONSTANT.equals(value_type)) {
//                                PointData pointData= new PointData(guide_line.getString("name"));
//                                bar.markLine().data(lineData);
                            double value = guide_line.getDouble("value");
                            JSONArray coordArray = new JSONArray();
                            //起点
                            JSONObject coordStart = new JSONObject();
                            coordStart.put("name", name);
                            //x,y轴
                            coordStart.put("coord", new Object[]{xAxis.get(0), value});
                            //终点
                            JSONObject coordStop = new JSONObject();
                            coordStop.put("coord", new Object[]{xAxis.get(xAxis .size()-1), value});
                            coordArray.add(coordStart);
                            coordArray.add(coordStop);

                            bar.markLine().data(coordArray);
                            //计算值辅助线  最大值 最小值 平均值
                        } else if (Contants.GUIDE_LINE_TYPE_CALCULATE.equals(value_type)) {
                            PointData pointData = new PointData();
                            pointData.name(name);
                            String formula = guide_line.getString("formula");//AVG MIN MAX
                            if (Contants.AGG_TYPE_AVG.equals(formula)) {
                                pointData.type(MarkType.average);
                            } else if (Contants.AGG_TYPE_MAX.equals(formula)) {
                                pointData.type(MarkType.max);
                            } else if (Contants.AGG_TYPE_MIN.equals(formula)) {
                                pointData.type(MarkType.min);
                            }
                            bar.markLine().data(pointData);
                        }
                    }
                }
                option.series().add(bar);
                option.legend().y(Y.bottom).data().add(barNames.get(i));
            }

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
     * @param chartId
     * @param type       granularity_type 自定义日期粒度类型
     * @param type       adv_date 日期筛选器
     * @param jsonString
     * @return
     */
    @RequestMapping(value = "toolbar/{type}", method = RequestMethod.POST)
    @ResponseBody
    public Object updateToolbar(@RequestParam(required = false) String chartId, @RequestParam(required = false) String optId, @PathVariable String type, @RequestBody String jsonString) {
        JSONObject respJson = new JSONObject();
        respJson.put("flag", "0");
        respJson.put("msg", "success");
        if(StringUtils.isNotBlank(optId)){//更新设置
            service.updaToolbar(chartId, optId, type, jsonString);
            respJson.put("optId", optId);
        }else{//新增设置
            respJson.put("optId", service.saveToolbar(chartId, type, jsonString));
        }
        return respJson;
    }

}
