package com.zzjz.core.common.dao.impl;

import com.google.common.collect.Lists;
import com.zzjz.core.common.dao.IGenericBaseCommonDao;
import com.zzjz.utils.DataUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.hibernate.*;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.hibernate.transform.ResultTransformer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import javax.sql.DataSource;
import java.io.Serializable;
import java.util.*;

/**
 * 类描述： DAO层泛型基类
 * liujun
 *
 * @param <T>
 * @param <PK>
 * @version 1.0
 * @date： 日期：2012-12-7 时间：上午10:16:48
 */
@SuppressWarnings("hiding")
@Repository
public class GenericBaseCommonDao<T, PK extends Serializable> implements IGenericBaseCommonDao {

    /**
     * 初始化Log4j的一个实例
     */
    private static final Logger logger = Logger.getLogger(GenericBaseCommonDao.class);

    /**
     * 注入一个sessionFactory属性,并注入到父类(HibernateDaoSupport)
     **/
    @Autowired
    @Qualifier("sessionFactory")
    private SessionFactory sessionFactory;

    public Session getSession() {
        // 事务必须是开启的(Required)，否则获取不到
        return sessionFactory.getCurrentSession();
    }

    public DataSource getDataSource() {
        return this.jdbcTemplate.getDataSource();
    }

    /**
     * 根据传入的实体持久化对象
     */
    public <T> Serializable save(T entity) {
        try {
            Serializable id = getSession().save(entity);
            getSession().flush();
            if (logger.isDebugEnabled()) {
                logger.debug("保存实体成功," + entity.getClass().getName());
            }
            return id;
        } catch (RuntimeException e) {
            logger.error("保存实体异常", e);
            throw e;
        }

    }

    /**
     * 批量保存数据
     *
     * @param <T>
     * @param entitys 要持久化的临时实体对象集合
     */
    public <T> void batchSave(List<T> entitys) {
        for (int i = 0; i < entitys.size(); i++) {
            getSession().save(entitys.get(i));
            if (i % 20 == 0) {
                // 20个对象后才清理缓存，写入数据库
                getSession().flush();
                getSession().clear();
            }
        }
        // 最后清理一下----防止大于20小于40的不保存
        getSession().flush();
        getSession().clear();
    }

    /**
     * 根据传入的实体添加或更新对象
     *
     * @param <T>
     * @param entity
     */

    public <T> void saveOrUpdate(T entity) {
        try {
            getSession().saveOrUpdate(entity);
            getSession().flush();
            if (logger.isDebugEnabled()) {
                logger.debug("添加或更新成功," + entity.getClass().getName());
            }
        } catch (RuntimeException e) {
            logger.error("添加或更新异常", e);
            throw e;
        }
    }

    /**
     * 根据传入的实体删除对象
     */
    public <T> void delete(T entity) {
        try {
            getSession().delete(entity);
            getSession().flush();
            if (logger.isDebugEnabled()) {
                logger.debug("删除成功," + entity.getClass().getName());
            }
        } catch (RuntimeException e) {
            logger.error("删除异常", e);
            throw e;
        }
    }

    /**
     * 根据主键删除指定的实体
     *
     * @param entityName
     * @param id
     * @param <T>
     */
    public <T> void deleteEntityById(Class entityName, Serializable id) {
        delete(get(entityName, id));
        getSession().flush();
    }

    /**
     * 删除全部的实体
     *
     * @param <T>
     * @param entitys
     */
    public <T> void deleteAllEntitie(Collection<T> entitys) {
        for (Object entity : entitys) {
            getSession().delete(entity);
            getSession().flush();
        }
    }

    /**
     * 根据Id获取对象。
     */
    public <T> T get(Class<T> entityClass, final Serializable id) {

        return (T) getSession().get(entityClass, id);

    }

    @Override
    public <T> List<T> getByIds(Class<T> entityName, Object[] ids) {
        return getSession().createQuery("from " + entityName.getName() + " where id in (:ids)").setParameterList("ids", ids).list();
    }

    @Override
    public <T> List<T> getByIds(Class<T> entityName, List<Object> ids) {
        Object[] arr = ids.toArray(new Object[0]);
        return getByIds(entityName, arr);
    }

    /**
     * 根据主键获取实体并加锁。
     *
     * @param entityName
     * @param id
     * @param <T>
     * @return
     */
    public <T> T getEntity(Class entityName, Serializable id) {

        T t = (T) getSession().get(entityName, id);
        if (t != null) {
            getSession().flush();
        }
        return t;
    }

    /**
     * 更新指定的实体
     *
     * @param <T>
     * @param pojo
     */
    public <T> void updateEntitie(T pojo) {
        getSession().update(pojo);
        getSession().flush();
    }

    /**
     * 通过hql 查询语句查找HashMap对象
     *
     * @param hql
     * @return
     */
    public Map<Object, Object> getHashMapbyQuery(String hql) {

        Query query = getSession().createQuery(hql);
        List list = query.list();
        Map<Object, Object> map = new HashMap<Object, Object>();
        for (Iterator iterator = list.iterator(); iterator.hasNext(); ) {
            Object[] tm = (Object[]) iterator.next();
            map.put(tm[0].toString(), tm[1].toString());
        }
        return map;

    }

    /**
     * @param entityClass
     * @param <T>
     * @return
     */
    public <T> List<T> loadAll(final Class<T> entityClass) {
        Criteria criteria = createCriteria(entityClass);
        return criteria.list();
    }

    /**
     * 创建单一Criteria对象
     *
     * @param entityClass
     * @param <T>
     * @return
     */
    private <T> Criteria createCriteria(Class<T> entityClass) {
        Criteria criteria = getSession().createCriteria(entityClass);
        return criteria;
    }

    /**
     * 批量插入实体
     *
     * @param entityList
     * @param <T>
     * @return
     */
    public <T> int batchInsertsEntitie(List<T> entityList) {
        int num = 0;
        for (int i = 0; i < entityList.size(); i++) {
            save(entityList.get(i));
            num++;
        }
        return num;
    }

    /**
     * 使用占位符的方式填充值 请注意：like对应的值格式："%"+username+"%" Hibernate Query
     *
     * @param hql 占位符号?对应的值，顺序必须一一对应 可以为空对象数组，但是不能为null
     * @return 2008-07-19 add by liuyang
     */
    public List<T> executeQuery(final String hql, final Object[] values) {
        Query query = getSession().createQuery(hql);
        // query.setCacheable(true);
        for (int i = 0; values != null && i < values.length; i++) {
            query.setParameter(i, values[i]);
        }

        return query.list();

    }

    @Autowired
    @Qualifier("jdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    @Autowired
    @Qualifier("namedParameterJdbcTemplate")
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    /**
     * 使用指定的检索标准检索数据并分页返回数据For JDBC-采用预处理方式
     */
    public Long getCountForJdbcParam(String sql, Object[] objs) {
        return this.jdbcTemplate.queryForLong(sql, objs);
    }

    public List<Map<String, Object>> findForJdbc(String sql, Object... objs) {
        return this.jdbcTemplate.queryForList(sql, objs);
    }

    public Integer executeSql(String sql, List<Object> param) {
        return this.jdbcTemplate.update(sql, param);
    }

    public Integer executeSql(String sql, Object... param) {
        return this.jdbcTemplate.update(sql, param);
    }

    public Integer executeSql(String sql, Map<String, Object> param) {
        return this.namedParameterJdbcTemplate.update(sql, param);
    }

    public Map<String, Object> findOneForJdbc(String sql, Object... objs) {
        try {
            return this.jdbcTemplate.queryForMap(sql, objs);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /**
     * 通过hql 查询语句查找对象
     *
     * @param hql
     * @param param
     * @param <T>
     * @return
     */
    public <T> List<T> findHql(String hql, Object... param) {
        Query q = getSession().createQuery(hql);
        if (param != null && param.length > 0) {
            for (int i = 0; i < param.length; i++) {
                q.setParameter(i, param[i]);
            }
        }
        return q.list();
    }

    /**
     * 执行HQL语句操作更新
     *
     * @param hql
     * @return
     */
    public Integer executeHql(String hql) {
        Query q = getSession().createQuery(hql);
        return q.executeUpdate();
    }

    public <T> List<T> findByQueryString(String hql) {
        // TODO Auto-generated method stub
        return getSession().createQuery(hql).list();
    }

    /**
     * 分页查询
     */
    public List<Map<String, Object>> findForJdbcParam(String sql, int firstResult, int maxResult, Object... objs) {
        SQLQuery sq = getSession().createSQLQuery(sql);
        if (objs != null && objs.length > 0) {
            for (int i = 0; i < objs.length; i++) {
                sq.setParameter(i, objs[i]);
            }
        }
        sq.setFirstResult(firstResult);
        sq.setMaxResults(maxResult);
        //将结果集转换为map
        sq.setResultTransformer(new ResultTransformer() {

            @Override
            public Object transformTuple(Object[] values, String[] columns) {
                Map<String, Object> map = new HashMap<String, Object>(1);
                int i = 0;
                for (String column : columns) {
                    Object vv = values[i];
                    if (vv instanceof Date) {
                        Date _time = (Date) vv;
                        map.put(column, DataUtils.formatTime(_time));
                    } else {
                        map.put(column, vv);
                    }
                    i++;
                }
                return map;
            }

            @Override
            public List transformList(List list) {
                return list;
            }
        });
        return sq.list();
    }

    @Override
    public <T> List<T> list(String hql, Map<String, Object> bean) {
        Query query = getSession().createQuery(hql).setProperties(bean);
        if (query.list() != null && query.list().size() >= 1) {
            return query.list();
        }
        return Lists.newArrayList();

    }


    @Override
    public List simpleNativeQuery(String sql, Object... objs) {
        SQLQuery query = getSession().createSQLQuery(sql);
        if (objs != null && objs.length > 0) {
            for (int i = 0; i < objs.length; i++) {
                query.setParameter(i, objs[i]);
            }
        }
        if (query.list() != null && query.list().size() >= 1) {
            return query.list();
        }
        return Lists.newArrayList();
    }

    /**
     * 根据实体名字获取唯一记录
     *
     * @param propertyName
     * @param value
     * @return
     */
    @SuppressWarnings("unchecked")
    public <T> T findUniqueByProperty(Class<T> entityClass, String propertyName, Object value) {
        Assert.hasText(propertyName);
        return (T) createCriteria(entityClass, Restrictions.eq(propertyName, value)).uniqueResult();
    }

    /**
     * 按属性查找对象列表.
     */
    @SuppressWarnings("unchecked")
    public <T> List<T> findByProperty(Class<T> entityClass,
                                      String propertyName, Object value) {
        Assert.hasText(propertyName);
        return (List<T>) createCriteria(entityClass,
                Restrictions.eq(propertyName, value)).list();
    }

    /**
     * 创建Criteria对象，有排序功能。
     *
     * @param <T>
     * @param entityClass
     * @param isAsc
     * @param criterions
     * @return
     */
    private <T> Criteria createCriteria(Class<T> entityClass, boolean isAsc,
                                        Criterion... criterions) {
        Criteria criteria = createCriteria(entityClass, criterions);
        if (isAsc) {
            criteria.addOrder(Order.asc("asc"));
        } else {
            criteria.addOrder(Order.desc("desc"));
        }
        return criteria;
    }

    /**
     * 创建Criteria对象带属性比较
     *
     * @param <T>
     * @param entityClass
     * @param criterions
     * @return
     */
    private <T> Criteria createCriteria(Class<T> entityClass,
                                        Criterion... criterions) {
        Criteria criteria = getSession().createCriteria(entityClass);
        for (Criterion c : criterions) {
            criteria.add(c);
        }
        return criteria;
    }
}
