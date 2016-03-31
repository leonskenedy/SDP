package com.zzjz.visual.chart.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Lists;
import com.zzjz.core.common.service.impl.CommonServiceImpl;
import com.zzjz.utils.Contants;
import com.zzjz.utils.DataUtils;
import com.zzjz.utils.TimeUtils;
import com.zzjz.visual.chart.service.IChartService;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.*;

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
        //聚合函数字段
        sql.append(aggregator).append(",");
        if (granularity_type != null) {
            //自定义时间分组查询
            sql.append(customGroupTimeSql(xFid, granularity_type));
        } else {
            //常规分组查询
            sql.append(groupSql(xFid, granularity));
        }

        sql.append(" AS xAxis FROM ").append(tb_id).append(" ");

        if (StringUtils.isNotBlank(filterSql)) {
            //筛选器sql
            sql.append(" WHERE ").append(filterSql);
        }

        sql.append(" GROUP BY xAxis ORDER BY ");

        //排序字段
        if (StringUtils.isBlank(sortFid)) {
            sql.append("xAxis");
        } else {
            sql.append(sortFid);
        }

        //截取行数sql
        sql.append(limitSql(top, sql.toString()));


        List<List<String>> list = getArrayList(sql.toString());
        return list;
    }

    /**
     * 截取固定行数的sql
     * @param top 截取参数对象
     * @return
     */
    private String limitSql(JSONObject top,String sql) {
        StringBuffer limitSql = new StringBuffer();
        //是否勾选维度显示条目数
        if (top.getBoolean("enabled")) {
            String topType = top.getString("type");
            Double numValue = top.getDoubleValue("value");
            Long count;
            if (numValue > 0) {
                count = getCountForJdbcParam("SELECT COUNT(*) FROM (" + sql.toString() + ") A");
                if (topType.equals(Contants.TOP_TYPE_PERCENT)) {
                    numValue = numValue / 100 * count;//百分比条目数
                }
                if (top.getIntValue("reversed") == 0) {//前
                    if (numValue.intValue() > 0) {
                        limitSql.append(" LIMIT ").append(numValue.intValue());
                    } else {
                        limitSql.append(" LIMIT 1");
                    }
                } else if (top.getIntValue("reversed") == 1) {//后
                    long num = Long.parseLong(count + "") - numValue.intValue();
                    if (num > 0 && num < count) {
                        limitSql.append(" LIMIT ").append(num).append(",").append(count);
                    } else {
                        limitSql.append(" LIMIT ").append(count - 1).append(",").append(count);
                    }

                }

            }
        }
        return limitSql.toString();
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
    public String joinFilterSql(JSONArray filter_list) {
        StringBuffer filterSql = new StringBuffer(200);
        for (int i = 0; i < filter_list.size(); i++) {

            if (i != 0) {
                filterSql.append(" AND ");
            }

            JSONObject filterItem = filter_list.getJSONObject(i);

            String adv_type = filterItem.getString("adv_type");
            String fid = filterItem.getString("fid");
            ////range_type 0 不包含  1包含
            String range_type = filterItem.getString("range_type");
            String data_type = filterItem.getString("data_type");
            if (Contants.DATA_TYPE_DATE.equals(data_type)) {//日期类型
                JSONArray rangeJsonArr = filterItem.getJSONArray("range");
                for (int j = 0; j < rangeJsonArr.size(); j++) {
                    filterSql.append(joinTimeSql(rangeJsonArr.getString(j), fid));
                }
            } else if (Contants.DATA_TYPE_NUMBER.equals(data_type)) {//数字类型
                if (Contants.ADV_TYPE_CONDITION.equals(adv_type)) {//条件筛选
                    filterSql.append(" (");

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
                    filterSql.append(fid).append(" ");
                    //全部包含
                    if ("1".equals(range_type)) {
                        filterSql.append(Contants.RANGE_TYPE_IN);
                        //全部不包含
                    } else if ("0".equals(range_type)) {
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
        return filterSql.toString();
    }

    @Override
    public String joinTimeSql(String filterId, String fid) {

        //查询筛选器sql
        String toolbarSql = "SELECT adv_date_type FROM toolbar WHERE id=?";
        List<List<String>> list = getArrayList(toolbarSql, filterId);
        //拼装筛选语句
        StringBuffer sql = new StringBuffer();
        JSONObject adv_date_type = (JSONObject) JSONObject.parse(list.get(0).get(0));
        String type = adv_date_type.getString("type");//指定筛选器使用的筛选类型
        if ("fixed".equals(type)) {//固定时长
            JSONObject fixed = adv_date_type.getJSONObject("fixed");

            //时间单位 day week month quarter year
            String granularity = fixed.getString("granularity");
            //截止时间数值
            JSONObject end = fixed.getJSONObject("end");
            //截止时间类型 0 当日/当月/本周。。。 1 昨天/上月/上周  2 前N日/N月/N周 3 后N日/N月/N周
            String endType = end.getString("type");
            //最近时间数值
            int startNum = fixed.getIntValue("start");
            //截止时间数值默认为当前
            int endNum = 0;
            //查询开始时间及结束时间
            Date startTime = null;
            Date endTime = null;

            if ("1".equals(endType)) {
                endNum = -1;
            } else if ("2".equals(endType)) {
                endNum = -end.getInteger("value");
            } else if ("3".equals(endType)) {
                endNum = end.getInteger("value");
            }

            if (Contants.GRANULARITY_TYPE_DAY.equals(granularity)) {

                endTime = TimeUtils.addDayStartTime(new Date(), endNum + 1);
                startTime = TimeUtils.addDayStartTime(endTime, -startNum);

            } else if (Contants.GRANULARITY_TYPE_WEEK.equals(granularity)) {

                endTime = TimeUtils.addWeekStartTime(new Date(), endNum + 1);
                startTime = TimeUtils.addWeekStartTime(endTime, -startNum);

            } else if (Contants.GRANULARITY_TYPE_MONTH.equals(granularity)) {

                endTime = TimeUtils.addMonthStartTime(new Date(), endNum + 1);
                startTime = TimeUtils.addMonthStartTime(endTime, -startNum);

            } else if (Contants.GRANULARITY_TYPE_QUARTER.equals(granularity)) {

                endTime = TimeUtils.addQuarterStartTime(new Date(), endNum + 1);
                startTime = TimeUtils.addQuarterStartTime(endTime, -startNum);

            } else if (Contants.GRANULARITY_TYPE_YEAR.equals(granularity)) {

                endTime = TimeUtils.addYearStartTime(new Date(), endNum + 1);
                startTime = TimeUtils.addYearStartTime(endTime, -startNum);

            }

            sql.append(fid);
            sql.append(">='");
            sql.append(DataUtils.formatDate(startTime, DataUtils.datetimeFormat));
            sql.append("' AND ");
            sql.append(fid);
            sql.append("<'");
            sql.append(DataUtils.formatDate(endTime, DataUtils.datetimeFormat));
            sql.append("'");

        } else if ("relative".equals(type)) {//相对时长
            JSONObject relative = adv_date_type.getJSONObject("relative");

            //时间单位  week month quarter year
            String granularity = relative.getString("granularity");
            String start = relative.getJSONObject(granularity).getString("start");//开始时期编号
            String end = relative.getJSONObject(granularity).getString("end");//结束时期编号
            int startNum = 0;//默认为当月/本周/本季度/本年
            if ("1".equals(start)) {//上一个节点
                startNum = -1;
            } else if ("2".equals(start)) {//下一个节点
                startNum = 1;
            }
            Date startTime = TimeUtils.addTimeStartTime(granularity, new Date(), startNum);
            Date endTime = null;
            if ("0".equals(end)) {//今天
                endTime = TimeUtils.addDayStartTime(new Date(), 1);
            } else if ("1".equals(end)) {//昨天
                endTime = TimeUtils.addDayStartTime(new Date(), 0);
            } else if ("2".equals(end)) {//上周
                endTime = TimeUtils.addWeekStartTime(new Date(), 0);
            } else if ("3".equals(end)) {//上月
                endTime = TimeUtils.addMonthStartTime(new Date(), 0);
            } else if ("4".equals(end)) {//上季度
                endTime = TimeUtils.addQuarterStartTime(new Date(), 0);
            }

            sql.append(fid);
            sql.append(">='");
            sql.append(DataUtils.formatDate(startTime, DataUtils.datetimeFormat));
            sql.append("' AND ");
            sql.append(fid);
            sql.append("<'");
            sql.append(DataUtils.formatDate(endTime, DataUtils.datetimeFormat));
            sql.append("'");

        } else if ("accurate".equals(type)) {//精确日期
            JSONObject accurate = adv_date_type.getJSONObject("accurate");
            sql.append(fid);
            sql.append(">='");
            sql.append(accurate.getString("start"));
            sql.append("' AND ");
            sql.append(fid);
            sql.append("<'");
            sql.append(accurate.getString("end"));
            sql.append("'");
        } else if ("expression".equals(type)) {//表达式
            sql.append(adv_date_type.getString("expression"));
        }

        return sql.toString();
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

    /**
     * 常规时间查询sql
     *
     * @param xFid
     * @param granularity 时间类型
     * @return
     */
    private String groupSql(String xFid, String granularity) {
        StringBuffer sql = new StringBuffer(200);
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
        } else {//非时间分组查询
            sql.append(xFid);
        }
        return sql.toString();
    }

    /**
     * 自定义分组时间查询sql
     *
     * @param xFid
     * @param granularity_type 自定义时间对象
     */
    private String customGroupTimeSql(String xFid, JSONObject granularity_type) {
        StringBuffer sql = new StringBuffer(200);
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
        return sql.toString();
    }
}
