package com.zzjz.visual.chart.service;

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
     * 根据字段ID及表ID查询该表中该列的不重复数据值
     *
     * @param fid   字段ID
     * @param tb_id 表ID
     * @return
     */
    List<String> queryRowUniqVal(String fid, String tb_id);

    /**
     * 根据表ID字段ID及X轴参数统计Y轴
     *
     * @param tb_id 表名
     * @param fid   字段名
     * @param yFid  查询字段
     * @param xAxis 限定条件
     * @return
     */
    Object[] calculate(String tb_id, String fid, String yFid, Object... xAxis);

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
     * @return 返回分组查询的字段的数据集合, 多个字段就是多个集合
     */
    List<List<String>> getGroupArrayList(String tb_id, String xFid, String yFid, String granularity, JSONObject granularity_name, JSONObject top, String sort, String s);

    /**
     * 返回查询字段的数据集合，多个字段就是多个集合
     *
     * @param tb_id 表ID
     * @param xFid  查询条件字段
     * @param yFid  查询字段ID
     * @return 返回查询字段的数据集合，多个字段就是多个集合
     */
    List<List<String>> getArrayList(String tb_id, String xFid, String yFid);

    List<Double> percentage(List<String> strings);

    /**
     * 保存chart工具栏
     *  @param chartId
     * @param type       工具栏类型
     * @param jsonString json参数
     */
    String saveToolbar(String chartId, String type, String jsonString);

    /**
     * 保存chart工具栏
     *
     * @param chartId
     * @param granularity_name    工具栏日期类型自定义名称
     */
    JSONObject queryToolbarGranularity(String chartId, String granularity_name);

    /**
     * 更新工具栏
     * @param chartId 图表ID
     * @param optId 工具栏ID
     * @param type 工具栏类型
     * @param jsonString 工具栏详细参数
     */
    void updaToolbar(String chartId, String optId, String type, String jsonString);
}
