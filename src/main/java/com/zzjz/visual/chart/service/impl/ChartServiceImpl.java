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
import java.util.UUID;

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
    public List<List<String>> getGroupArrayList(String tb_id, String xFid, String aggregator, String granularity, JSONObject granularity_type, JSONObject top, String sortFid, String filterSql) {
        StringBuffer sql = new StringBuffer("SELECT ");
        sql.append(aggregator).append(",");
        if (granularity_type != null) {
            //{"week":[{"name":"cc","day_of_week":1}],"month":[{"name":"bb","day":1}],"year":[{"name":"aa","day":1,"month":2}]}
            Integer day_of_week = granularity_type.getInteger("day_of_week");
            Integer month = granularity_type.getInteger("month");
            //自定义年
            if (month != null) {
                sql.append("CONCAT(IF (");
                sql.append(xFid);
                sql.append("> DATE_FORMAT(");
                sql.append(xFid);
                sql.append(", '%Y-");
                sql.append(month);
                sql.append("-");
                sql.append(granularity_type.getInteger("day"));
                sql.append("'),year(");
                sql.append(xFid);
                sql.append("),year(");
                sql.append(xFid);
                sql.append(")-1),'年')");
                //自定义周分组
            } else if (day_of_week != null) {

                //自定义月分组
            } else {
                sql.append("CASE WHEN ");
                sql.append(xFid);
                sql.append("> DATE_FORMAT(time, '%Y-%c-");
                sql.append(granularity_type.getInteger("day"));
                sql.append("')");
                sql.append("THEN DATE_FORMAT(");
                sql.append(xFid);
                sql.append(", '%Y年%c月')");
                sql.append("WHEN month(");
                sql.append(xFid);
                sql.append(")=1");
                sql.append("THEN CONCAT(year(");
                sql.append(xFid);
                sql.append(")-1,'年','12月')");
                sql.append("ELSE  CONCAT(year(");
                sql.append(xFid);
                sql.append("),'年',month(");
                sql.append(")-1,'月')END");
            }
        } else {
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
                sql.append("),'年第',QUARTER (time),'季度')");
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
        }
        sql.append(" AS xAxis FROM ").append(tb_id).append(" ");

        if (StringUtils.isNotBlank(filterSql)) {//筛选器sql
            sql.append(filterSql);
        }

        sql.append(" GROUP BY xAxis ORDER BY ");
        if (StringUtils.isBlank(sortFid)) {
            sql.append("xAxis");
        } else {
            sql.append(sortFid);
        }

        List<List<String>> list = getArrayList(sql.toString());
        //是否勾选维度显示条目数
        if (top.getBoolean("enabled") && !list.isEmpty()) {
            List<String> item = list.get(1);
            String topType = top.getString("type");
            int numValue = top.getIntValue("value");
            if (numValue > 0) {
                if (topType.equals(Contants.TOP_TYPE_PERCENT)) {
                    numValue = numValue / 100 * list.size();//百分比条目数
                }
                if (top.getIntValue("reversed") == 0) {//前
                    list.set(1, item.subList(0, numValue));
                } else if (top.getIntValue("reversed") == 1) {//后
                    list.set(1, item.subList(numValue, list.size() - 1));
                }
            }
        }
        return list;
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
    public String saveToolbar(String chartId, String type, String jsonString) {
        String uuid = UUID.randomUUID().toString();
        StringBuffer sql = new StringBuffer("INSERT INTO toolbar SET id=?,");
        List<String> params = new ArrayList<>();
        sql.append(type);
        sql.append("=?");
        params.add(uuid);
        params.add(jsonString);
        if (StringUtils.isNotBlank(chartId)) {
            sql.append(",chart_id=?");
            params.add(chartId);
        }
        executeSql(sql.toString(), params.toArray());
        return uuid;
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

    @Override
    public void updaToolbar(String chartId, String optId, String type, String jsonString) {
        StringBuffer sql = new StringBuffer();
        List<String> params = new ArrayList<>();

        sql.append("UPDATE toolbar SET ");
        sql.append(type).append("=?");
        params.add(jsonString);
        if (StringUtils.isNotBlank(chartId)) {
            sql.append(",chart_id=?");
            params.add(chartId);
        }
        sql.append(" WHERE id=?");
        params.add(optId);
        executeSql(sql.toString(), params.toArray());
    }


}
