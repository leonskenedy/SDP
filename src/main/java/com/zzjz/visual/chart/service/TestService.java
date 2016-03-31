package com.zzjz.visual.chart.service;

import com.alibaba.fastjson.JSONArray;
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
}
