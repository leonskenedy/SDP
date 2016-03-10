package com.zzjz.core.common.service;

import com.zzjz.utils.Page;
import org.hibernate.Session;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface CommonService {

    public <T> Serializable save(T entity);

    public <T> void saveOrUpdate(T entity);

    public <T> void delete(T entity);

    public <T> void batchSave(List<T> entitys);

    /**
     * 根据实体名称和主键获取实体
     *
     * @param class1
     * @param id
     * @param <T>
     * @return
     */
    public <T> T get(Class<T> class1, Serializable id);

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
     * 根据实体名称和主键获取实体
     *
     * @param <T>
     * @param entityName
     * @param id
     * @return
     */
    @SuppressWarnings("rawtypes")
    public <T> T getEntity(Class entityName, Serializable id);

    /**
     * 加载全部实体
     *
     * @param <T>
     * @param entityClass
     * @return
     */
    public <T> List<T> loadAll(final Class<T> entityClass);

    /**
     * 删除实体主键删除
     *
     * @param entityName
     * @param id
     * @param <T>
     */
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
     * @param hql
     * @param <T>
     * @return
     */
    public <T> List<T> findByQueryString(String hql);

    @SuppressWarnings("rawtypes")
    public <T> List<T> getList(Class clas);

    public Session getSession();

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
     * 通过JDBC查找对象集合,带分页 使用指定的检索标准检索数据并分页返回数据
     */
    public List<Map<String, Object>> findForJdbc(String sql, int page, int rows);

    /**
     * 使用指定的检索标准检索数据并分页返回数据-采用预处理方式
     *
     * @param sql
     * @param page
     * @param rows
     * @param objs
     * @return
     */
    public List<Map<String, Object>> findForJdbcParam(String sql, int page, int rows, Object... objs);

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
     * 根据传入的数据库相关的sql和页面信息返回Map格式的分页对象，Map的值为对象格式。
     *
     * @param sql    用于查询记录集的SQL
     * @param params 查询参数
     * @param page   分页参数
     * @return 基于数据库相关的sql的分页实现类
     */
    Page<Map<String, String>> getMapPage(String sql, Page page, Object... params);

    /**
     * 根据实体名称和字段名称和字段值获取唯一记录
     *
     * @param <T>
     * @param entityClass
     * @param propertyName
     * @param value
     * @return
     */
    public <T> T findUniqueByProperty(Class<T> entityClass, String propertyName, Object value);

    /**
     * 按属性查找对象列表.
     */
    public <T> List<T> findByProperty(Class<T> entityClass, String propertyName, Object value);
}
