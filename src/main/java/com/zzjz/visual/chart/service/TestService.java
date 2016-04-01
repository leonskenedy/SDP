package com.zzjz.visual.chart.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.CriteriaSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by xhzhang on 2016/3/4.
 */
@Service
public class TestService {
    @Autowired
    private SessionFactory factory;






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
}
