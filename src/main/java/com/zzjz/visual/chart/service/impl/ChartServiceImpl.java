package com.zzjz.visual.chart.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Lists;
import com.zzjz.core.common.service.impl.CommonServiceImpl;
import com.zzjz.utils.Contants;
import com.zzjz.visual.chart.service.IChartService;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
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
    public List<List<String>> getGroupArrayList(String tb_id, String xFid, String aggregator, String granularity, JSONObject granularity_type) {
        StringBuffer sql = new StringBuffer("SELECT ");
        sql.append(aggregator).append(",");
        if (granularity_type != null) {
            //{"week":[{"name":"cc","day_of_week":1}],"month":[{"name":"bb","day":1}],"year":[{"name":"aa","day":1,"month":2}]}

            sql.append("CONCAT(IF (");
            sql.append(xFid);
            sql.append("> DATE_FORMAT(");
            sql.append(xFid);
            sql.append(", '%Y-11-30'),");
            sql.append("year(");
            sql.append(xFid);
            sql.append("),year(");
            sql.append(xFid);
            sql.append(")-1),'年')");
        }
        //日期类型统计粒度
        //年
        if (Contants.GRANULARITY_TYPE_YEAR.equals(granularity)) {
            sql.append("DATE_FORMAT(");
            sql.append(xFid);
            sql.append(", '%Y年')");
            //季度
        } else if (Contants.GRANULARITY_TYPE_QUARTER.equals(granularity)) {
            sql.append("CONCAT(YEAR (");
            sql.append(xFid);
            sql.append("time),'年第',QUARTER (time),'季度')");
            //月
        } else if (Contants.GRANULARITY_TYPE_MONTH.equals(granularity)) {
            sql.append("DATE_FORMAT(");
            sql.append(xFid);
            sql.append(", '%Y年%c月')");
            //周
        } else if (Contants.GRANULARITY_TYPE_WEEK.equals(granularity)) {
            sql.append("CONCAT(YEAR (");
            sql.append(xFid);
            sql.append("),'年第',WEEK (");
            sql.append(xFid);
            sql.append(", 1),'周（',DATE_FORMAT(date_add(");
            sql.append(xFid);
            sql.append("INTERVAL - DAYOFweek(");
            sql.append(xFid);
            sql.append(") + 2 DAY),'%c/%e'),'~',DATE_FORMAT(date_add(");
            sql.append(xFid);
            sql.append(",INTERVAL 7 - DAYOFweek(");
            sql.append(xFid);
            sql.append(") + 1 DAY),'%c/%e）'))");
            //天
        } else if (Contants.GRANULARITY_TYPE_DAY.equals(granularity)) {
            sql.append("DATE_FORMAT(");
            sql.append(xFid);
            sql.append(", '%Y年%c月%e日')");
            //时
        } else if (Contants.GRANULARITY_TYPE_HOUR.equals(granularity)) {
            sql.append("DATE_FORMAT(");
            sql.append(xFid);
            sql.append(",'%Y年%c月%e日 %H时')");
            //分
        } else if (Contants.GRANULARITY_TYPE_MINUTE.equals(granularity)) {
            sql.append("DATE_FORMAT(");
            sql.append(xFid);
            sql.append(",'%Y年%c月%e日 %H时%i分')");
            //秒
        } else if (Contants.GRANULARITY_TYPE_SECOND.equals(granularity)) {
            sql.append("DATE_FORMAT(");
            sql.append(xFid);
            sql.append(",'%Y年%c月%e日 %H时%i分%S秒')");
        }
//        else if(){
//
//        }
        else {//null
            sql.append(xFid);
        }
        sql.append(" AS xAxis FROM ").append(tb_id);
        sql.append(" GROUP BY xAxis ORDER BY xAxis");
        return getArrayList(sql.toString());
    }

    @Override
    public List<List<String>> getArrayList(String tb_id, String xFid, String yFid) {
      /*  List<String> vals = queryRowUniqVal(xFid, tb_id);
        StringBuffer sql = new StringBuffer("select ");
        sql.append(aggregator).append(" from ").append(tb_id).append(" where ").append(xFid).append("=?");
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
            result.add(Double.parseDouble(val) / sum);
        }
        return result;
    }

    @Override
    public void saveToolbar(String chartId, String type, String jsonString) {
        StringBuffer sql = new StringBuffer("INSERT INTO toolbar SET id=UUID_SHORT(),chart_id=?,");
        sql.append(type);
        sql.append("=?");
        executeSql(sql.toString(), chartId, jsonString);
    }

    @Override
    public JSONObject queryToolbarGranularity(String chartId, String granularity_name) {
        if (StringUtils.isNotBlank(granularity_name)) {
            StringBuffer sql = new StringBuffer("SELECT granularity_type");
//            sql.append(type);
            sql.append(" FROM toolbar WHERE chart_id=?");
            List<List<String>> list = getArrayList(sql.toString(), chartId);
            JSONObject granularity_type = (JSONObject) JSONObject.parse(list.get(0).get(0));

            for (Map.Entry<String, Object> entry : granularity_type.entrySet()) {
                JSONArray arr = JSONArray.parseArray(entry.getValue().toString());
                for (Object o : arr) {
                    JSONObject json1 = (JSONObject) JSONObject.parse(o.toString());
                    if (granularity_name.equals(json1.getString("name"))) {
                        return json1;
                    }
                }
            }
        }
        return null;
    }


}
