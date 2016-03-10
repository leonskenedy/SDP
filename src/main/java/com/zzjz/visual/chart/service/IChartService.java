package com.zzjz.visual.chart.service;

import com.zzjz.core.common.service.CommonService;

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
    Object[] queryRowUniqVal(String fid, String tb_id);

    /**
     * 根据表ID字段ID及X轴参数统计Y轴数量
     *
     * @param tb_id      表名
     * @param fid        字段名
     * @param aggregator 聚合函数类型
     * @param xAxis      限定条件
     * @return
     */
    Object[] calculate(String tb_id, String fid, String aggregator, Object... xAxis);
}
