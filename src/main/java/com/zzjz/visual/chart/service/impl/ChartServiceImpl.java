package com.zzjz.visual.chart.service.impl;

import com.google.common.collect.Lists;
import com.zzjz.core.common.service.impl.CommonServiceImpl;
import com.zzjz.visual.chart.service.IChartService;
import org.apache.commons.collections.CollectionUtils;
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
    public List<String> queryRowUniqVal(String fid, String tb_id) {
        /*List<Map<String, Object>> valList = findForJdbc("select DISTINCT " + fid + " from " + tb_id + " order by " + fid);
        List<Object> vals = new ArrayList<>(valList.size());
        for (Map<String, Object> map : valList) {
            vals.add(map.get(fid));
        }*/
        List<List<String>> list = getArrayList("select DISTINCT " + fid + " from " + tb_id + " order by " + fid);
        return CollectionUtils.isEmpty(list) ? new ArrayList<String>() : list.get(0);
    }

    @Override
    public Object[] calculate(String tb_id, String xFid, String yFid, Object... xAxis) {

        List<Object> values = Lists.newArrayList();
        for (Object item : xAxis) {

            StringBuffer sql = new StringBuffer(200);
            sql.append("select ");
//            sql.append(aggregator);
            sql.append(yFid);
            sql.append(" from ").append(tb_id).append(" where ").append(xFid).append("=?");
            List<Map<String, Object>> valList = findForJdbc(sql.toString(), item);
//            values.add(valList.get(0).get(aggregator));
        }
        return values.toArray();
    }

    @Override
    public List<List<String>> getGroupArrayList(String tb_id, String xFid, String yFid) {
        StringBuffer sql = new StringBuffer("select ");
        sql.append(xFid).append(",").append(yFid);
        sql.append(" from ").append(tb_id).append(" GROUP BY ").append(xFid);
        return getArrayList(sql.toString());
    }

    @Override
    public List<List<String>> getArrayList(String tb_id, String xFid, String yFid) {
      /*  List<String> vals = queryRowUniqVal(xFid, tb_id);
        StringBuffer sql = new StringBuffer("select ");
        sql.append(yFid).append(" from ").append(tb_id).append(" where ").append(xFid).append("=?");
        for (String val : vals) {
            List<String> list = getArrayList(sql.toString(),val);
        }*/
        return null;
    }

    @Override
    public List<Double> percentage(List<String> vals) {
        Double sum = 0D;
        List<Double> result = Lists.newArrayList();
        for (String val : vals) {
            sum += Double.parseDouble(val);
        }
        for (String val : vals) {
            result.add(Double.parseDouble(val) / sum );
        }
        return result;
    }


}
