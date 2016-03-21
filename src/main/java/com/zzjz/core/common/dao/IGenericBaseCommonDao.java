package com.zzjz.core.common.dao;

import org.hibernate.Session;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Map;


/**
 * 类描述：DAO层泛型基类接口
 * <p/>
 * liujun
 *
 * @version 1.0
 * @date： 日期：2012-12-8 时间：下午05:37:33
 */
public interface IGenericBaseCommonDao {

    public <T> Serializable save(T entity);

    public <T> void batchSave(List<T> entitys);

    public <T> void saveOrUpdate(T entity);

    /**
     * 删除实体
     *
     * @param <T>
     * @param <T>
     * @param <T>
     * @param entitie
     */
    public <T> void delete(T entitie);

    /**
     * 根据实体名称和主键获取实体
     *
     * @param <T>
     * @param entityName
     * @param id
     * @return
     */
    public <T> T get(Class<T> entityName, Serializable id);


    /**
     * 根据实体名称和主键数组获取到实体list
     *
     * @param <T>
     * @param entityName
     * @param ids        数组
     * @return List of entity
     */
    public <T> List<T> getByIds(Class<T> entityName, Object[] ids);

    /**
     * 根据实体名称和主键获取实体
     *
     * @param <T>
     * @param entityName
     * @param ids        list for id
     * @return List of entity
     */
    public <T> List<T> getByIds(Class<T> entityName, List<Object> ids);

    /**
     * 加载全部实体
     *
     * @param <T>
     * @param entityClass
     * @return
     */
    public <T> List<T> loadAll(final Class<T> entityClass);

    /**
     * 根据实体名称和主键获取实体
     *
     * @param <T>
     * @param <T>
     * @param entityName
     * @param id
     * @return
     */
    @SuppressWarnings("rawtypes")
    public <T> T getEntity(Class entityName, Serializable id);

    @SuppressWarnings("rawtypes")
    public <T> void deleteEntityById(Class entityName, Serializable id);

    /**
     * 删除实体集合
     *
     * @param <T>
     * @param entities
     */
    public <T> void deleteAllEntitie(Collection<T> entities);

    /**
     * 更新指定的实体
     *
     * @param <T>
     * @param pojo
     */
    public <T> void updateEntitie(T pojo);

    /**
     * 通过hql 查询语句查找对象
     *
     * @param <T>
     * @return
     */
    public <T> List<T> findByQueryString(String hql);


    public Session getSession();

    <T> int batchInsertsEntitie(List<T> entityList);

    <T> List<T> executeQuery(final String hql, final Object[] values);

    /**
     * 通过hql 查询语句查找HashMap对象
     *
     * @param query
     * @return
     */
    public Map<Object, Object> getHashMapbyQuery(String query);


    /**
     * 执行SQL
     */
    public Integer executeSql(String sql, List<Object> param);

    /**
     * 执行SQL
     */
    public Integer executeSql(String sql, Object... param);

    /**
     * 执行SQL 使用:name占位符
     */
    public Integer executeSql(String sql, Map<String, Object> param);

    /**
     * 通过JDBC查找对象集合 使用指定的检索标准检索数据返回数据
     */
    public List<Map<String, Object>> findForJdbc(String sql, Object... objs);

    /**
     * 通过JDBC查找对象集合 使用指定的检索标准检索数据返回数据
     */
    public Map<String, Object> findOneForJdbc(String sql, Object... objs);

    /**
     * 使用指定的检索标准检索数据并分页返回数据-采用预处理方式
     *
     * @param sql
     * @param page
     * @param rows
     * @param objs
     * @return
     */
    public List<Map<String, Object>> findForJdbcParam(String sql, int page,
                                                      int rows, Object... objs);


    /**
     * 使用指定的检索标准检索数据并分页返回数据For JDBC-采用预处理方式
     */
    public Long getCountForJdbcParam(String sql, Object[] objs);

    /**
     * 通过hql 查询语句查找对象
     *
     * @param hql
     * @param param
     * @param <T>
     * @return
     */
    public <T> List<T> findHql(String hql, Object... param);

    /**
     * 执行HQL语句操作更新
     *
     * @param hql
     * @return
     */
    public Integer executeHql(String hql);


    public <T> List<T> list(String hql, Map<String, Object> bean);


    public List simpleNativeQuery(String sql, Object... objs);


    /**
     * 根据实体名字获取唯一记录
     *
     * @param propertyName
     * @param value
     * @return
     */
    public <T> T findUniqueByProperty(Class<T> entityClass,
                                      String propertyName, Object value);

    /**
     * 按属性查找对象列表.
     */
    public <T> List<T> findByProperty(Class<T> entityClass,
                                      String propertyName, Object value);
    List<List<String>> getArrayList(String sql, Object... objs);
}
