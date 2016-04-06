package com.zzjz.visual.chart.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.github.abel533.echarts.axis.CategoryAxis;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.CriteriaSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by xhzhang on 2016/3/4.
 */
@Service
public class TestService {
    @Autowired
    private SessionFactory factory;

    private String _MAP_SQL = "SELECT\n" +
            "\ta.city_id AS cid,\n" +
            "\ta. NAME AS cname,\n" +
            "\tb.province_id AS pid,\n" +
            "\tb. NAME AS pname\n" +
            "FROM\n" +
            "\tcity a\n" +
            "JOIN province b ON a.pid = b.province_id";


    public Map<String, String> chinaMap = new HashMap<>();



    public JSONArray getUniqueColumnData(String columnName, String keyWord){
        Session s = null;
        JSONArray result = new JSONArray();
        try{
            s = factory.openSession();
            result = (JSONArray) JSONArray.toJSON(s.createSQLQuery("select distinct " + columnName + " from product where " + columnName + " like :keyword")
                    .setString("keyword", "%"+keyWord+"%")
                    .setResultTransformer(CriteriaSpecification.ALIAS_TO_ENTITY_MAP).list());
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            s.close();
        }
        return result;
    }

    public JSONObject validateGrammar(String tName, String jStr){
        JSONObject result = new JSONObject();
        JSONObject object = JSON.parseObject(jStr);
        String columnName = object.getString("fid");
        String sql = object.getJSONArray("range").getString(0).replaceAll("\\[_field_id_\\]", columnName);
        Session s = null;
        try{
            s = factory.openSession();
            s.createSQLQuery("select 1 from " + tName + " where " + sql).list();
            result.put("valid", true);
        }catch (Exception e){
            e.printStackTrace();
            result.put("valid", false);
        }finally {
            if(s != null){
                s.close();
            }
        }
        return result;
    }

    @PostConstruct
    private void intMap(){
        Session s = null;
        try{
            s = factory.openSession();
            List<Map<String, Object>> mapList = s.createSQLQuery(_MAP_SQL)
                    .setResultTransformer(CriteriaSpecification.ALIAS_TO_ENTITY_MAP).list();
            for(int i = 0; i < mapList.size(); i++){
                String cName = mapList.get(i).get("cname").toString();
                String pName = mapList.get(i).get("pname").toString();
                if(!chinaMap.containsKey(pName)){
                    chinaMap.put(pName, "");
                }
                if(!chinaMap.containsKey(cName)){
                    chinaMap.put(cName, pName);
                }
            }
            chinaMap.put("北京市", "");
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            s.close();
        }
    }


    public void resetMapAxis(CategoryAxis axis){
        List<String> list = axis.getData();
        List<String> nList = new ArrayList<>();
        for(int i = 0; i < list.size(); i++){
            if(chinaMap.get(list.get(i)).equals("")){
                nList.add(list.get(i));
            }else{
                nList.add(chinaMap.get(list.get(i)));
            }
        }
        axis.setData(nList);
    }
}
