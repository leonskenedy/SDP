package com.zzjz.visual.chart.service.impl;

import com.google.common.collect.Lists;
import com.zzjz.core.common.service.impl.CommonServiceImpl;
import com.zzjz.visual.chart.service.IChartService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by cnwan on 2016/3/7.
 */

@Service
public class ChartServiceImpl extends CommonServiceImpl implements IChartService {

    @Override
    public void save(String chartId, Object reqInfo, Object respInfo) {
        String sql = "insert into t_chart_option(id,reqinfo,respinfo) values (?,?,?) on duplicate key update id=values(id),reqinfo=VALUES(reqinfo),respinfo=VALUES(respinfo)";
        executeSql(sql, chartId, reqInfo, respInfo);
    }

    @Override
    public Object[] queryRowUniqVal(String fid, String tb_id) {
        List<Map<String, Object>> valList = findForJdbc("select DISTINCT " + fid + " from " + tb_id + " order by " + fid);
        List<Object> vals = new ArrayList<>(valList.size());
        for (Map<String, Object> map : valList) {
            vals.add(map.get(fid));
        }
        return vals.toArray();
    }

    @Override
    public Object[] calculate(String tb_id, String fid, String aggregator, Object... xAxis) {

        List<Object> values = Lists.newArrayList();
        for (Object item : xAxis) {
            StringBuffer sql = new StringBuffer(200);
            sql.append("select ");
            sql.append(aggregator);
            sql.append(" from ").append(tb_id).append(" where ").append(fid).append("=?");
            List<Map<String, Object>> valList = findForJdbc(sql.toString(), item);
            values.add(valList.get(0).get(aggregator));
        }
        return values.toArray();
    }

}
