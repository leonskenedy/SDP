package com.zzjz.visual.chart.service;

import com.alibaba.fastjson.JSONArray;
import com.zzjz.visual.chart.entity.Test;
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

    public void save(Test test){
        factory.openSession().save(test);
    }

    public void delete(Test test){
        factory.openSession().delete(test);
    }

    public List<Test> getList(){
        return factory.openSession().createQuery("from Test").list();
    }

    public JSONArray getUniqueColumnData(String columnName){
        return (JSONArray) JSONArray.toJSON(factory.openSession().createSQLQuery("select distinct " + columnName + " from product")
                .setResultTransformer(CriteriaSpecification.ALIAS_TO_ENTITY_MAP).list());
    }
}
