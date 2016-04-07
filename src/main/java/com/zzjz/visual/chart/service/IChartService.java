package com.zzjz.visual.chart.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zzjz.core.common.service.CommonService;

import java.util.List;

/**
 * Created by cnwan on 2016/3/7.
 */

public interface IChartService extends CommonService {
    /**
     * @param chartId     图表ID
     * @param requestInfo 图表请求参数
     */
    void save(String chartId, Object requestInfo, Object respInfo);

    /**
     * 根据x轴进行分组聚合查询
     *
     * @param tb_id            表ID
     * @param xFid             分组ID
     * @param yFid             查询字段ID
     * @param granularity      分组粒度
     * @param granularity_name
     * @param top
     * @param sort
     * @param s
     * @param toString
     * @param start_time
     * @param isMap
     * @return 返回分组查询的字段的数据集合, 多个字段就是多个集合
     */
    List<List<String>> getGroupArrayList(String tb_id, String xFid, String yFid, String granularity, JSONObject granularity_name, JSONObject top, String sort, String s, String toString, String start_time, boolean isMap);

    /**
     * 高级计算百分比
     * @param strings
     * @return
     */
    List<Double> percentage(List<String> strings);

    /**
     * 保存chart工具栏
     *
     * @param chartId
     * @param type       工具栏类型
     * @param jsonString json参数
     */
    String saveToolbar(String chartId, String type, String jsonString);

    /**
     * 保存chart工具栏
     *
     * @param chartId
     * @param granularity_name 工具栏日期类型自定义名称
     */
    JSONObject queryToolbarGranularity(String chartId, String granularity_name);

    /**
     * 筛选器ID
     *  @param filterId 筛选器ID
     * @param fid
     */
    String joinTimeSql(String filterId, String fid);

    /**
     * 更新工具栏
     *
     * @param chartId    图表ID
     * @param optId      工具栏ID
     * @param type       工具栏类型
     * @param jsonString 工具栏详细参数
     */
    void updaToolbar(String chartId, String optId, String type, String jsonString);

    /**
     * 拼接筛选器sql语句
     *
     * @param filterList
     * @return
     */
    String joinFilterSql(JSONArray filterList);

    /**
     * 根据图表id获取到图表定义<br />
     * 如果id为空或null,将返回自动生成的图表定义和新的id<br />
     * 如果图表id对应数据不存在,自动生成图表定义<br />
     * @param chartId 图表id
     * @return json,格式如:{chart_id:"xxxxx", definition:{具体的图表定义}}
     */
    JSONObject fetchChart(String chartId);


    /**
     * 更新图表定义.<br />
     * 如果该id的图表不存在,将创建该图表.<br />
     * @param chartId 图表id
     * @param jsonString 图表定义的json string
     */
    void modifyChart(String chartId, String jsonString);
}
