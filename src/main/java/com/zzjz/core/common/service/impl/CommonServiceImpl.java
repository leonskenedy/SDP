package com.zzjz.core.common.service.impl;

import com.zzjz.core.common.dao.impl.GenericBaseCommonDao;
import com.zzjz.core.common.service.CommonService;
import com.zzjz.utils.Page;
import org.hibernate.Session;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Service("commonService")
@Transactional
public class CommonServiceImpl implements CommonService {

    // public IbaseDao baseDao = null;
    // @Autowired
    @SuppressWarnings("rawtypes")
    public GenericBaseCommonDao genericBaseCommonDao;

    @SuppressWarnings("rawtypes")
    @Resource
    public void setGenericBaseCommonDao(GenericBaseCommonDao genericBaseCommonDao) {
        this.genericBaseCommonDao = genericBaseCommonDao;
    }

	/*
     * @Resource public void setbaseDao(IbaseDao baseDao) { this.baseDao =
	 * baseDao; }
	 */

    @SuppressWarnings("unchecked")
    public <T> Serializable save(T entity) {
        return genericBaseCommonDao.save(entity);
    }

    @SuppressWarnings("unchecked")
    public <T> void saveOrUpdate(T entity) {
        genericBaseCommonDao.saveOrUpdate(entity);

    }

    @SuppressWarnings("unchecked")
    public <T> void delete(T entity) {
        genericBaseCommonDao.delete(entity);

    }

    @SuppressWarnings("unchecked")
    public <T> void deleteAllEntitie(Collection<T> entities) {
        genericBaseCommonDao.deleteAllEntitie(entities);
    }

    @SuppressWarnings("unchecked")
    public <T> T get(Class<T> class1, Serializable id) {
        return (T) genericBaseCommonDao.get(class1, id);
    }

    @Override
    public <T> List<T> getByIds(Class<T> entityName, Object[] ids) {
        return genericBaseCommonDao.getByIds(entityName, ids);
    }

    @Override
    public <T> List<T> getByIds(Class<T> entityName, List<Object> ids) {
        return genericBaseCommonDao.getByIds(entityName, ids);
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    public <T> List<T> getList(Class clas) {
        return genericBaseCommonDao.loadAll(clas);
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    public <T> T getEntity(Class entityName, Serializable id) {
        return (T) genericBaseCommonDao.getEntity(entityName, id);
    }

    @SuppressWarnings("unchecked")
    public <T> List<T> loadAll(final Class<T> entityClass) {
        return genericBaseCommonDao.loadAll(entityClass);
    }

    @SuppressWarnings("rawtypes")
    public <T> void deleteEntityById(Class entityName, Serializable id) {
        genericBaseCommonDao.deleteEntityById(entityName, id);
    }

    @SuppressWarnings("unchecked")
    public <T> void updateEntitie(T pojo) {
        genericBaseCommonDao.updateEntitie(pojo);
    }

    @SuppressWarnings("unchecked")
    public <T> List<T> findByQueryString(String hql) {
        return genericBaseCommonDao.findByQueryString(hql);
    }


    public Session getSession()

    {
        return genericBaseCommonDao.getSession();
    }


    @SuppressWarnings("unchecked")
    public Integer executeSql(String sql, List<Object> param) {
        return genericBaseCommonDao.executeSql(sql, param);
    }

    public Integer executeSql(String sql, Object... param) {
        return genericBaseCommonDao.executeSql(sql, param);
    }

    @SuppressWarnings("unchecked")
    public Integer executeSql(String sql, Map<String, Object> param) {
        return genericBaseCommonDao.executeSql(sql, param);
    }


    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> findForJdbc(String sql, int page, int rows) {
        return genericBaseCommonDao.findForJdbc(sql, page, rows);
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> findForJdbc(String sql, Object... objs) {
        return genericBaseCommonDao.findForJdbc(sql, objs);
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> findForJdbcParam(String sql, int page, int rows, Object... objs) {
        return genericBaseCommonDao.findForJdbcParam(sql, page, rows, objs);
    }


    @SuppressWarnings("unchecked")
    public Map<String, Object> findOneForJdbc(String sql, Object... objs) {
        return genericBaseCommonDao.findOneForJdbc(sql, objs);
    }


    public Long getCountForJdbcParam(String sql, Object[] objs) {
        return genericBaseCommonDao.getCountForJdbcParam(sql, objs);
    }

    @SuppressWarnings("unchecked")
    public <T> void batchSave(List<T> entitys) {
        this.genericBaseCommonDao.batchSave(entitys);
    }

    @SuppressWarnings("unchecked")
    public <T> List<T> findHql(String hql, Object... param) {
        return this.genericBaseCommonDao.findHql(hql, param);
    }


    @Override
    public Page<Map<String, String>> getMapPage(String sql, Page page, Object... params) {
        Long count = genericBaseCommonDao.getCountForJdbcParam("select count(*) from (" + sql + ") a", params);
        int totalSize = 0;

        if (count != null) {
            totalSize = count.intValue();
        }
        if (totalSize < 1) {
            return new Page<>();
        }

        List<Map<String, String>> list = genericBaseCommonDao
                .findForJdbcParam(sql, (page.getPageNo() - 1) * page.getPageSize(), page.getPageSize(), params);

        return new Page<>(totalSize, page.getPageSize(), list);
    }


    @SuppressWarnings("unchecked")
    public <T> T findUniqueByProperty(Class<T> entityClass, String propertyName, Object value) {
        return (T) genericBaseCommonDao.findUniqueByProperty(entityClass, propertyName, value);
    }


    @SuppressWarnings("unchecked")
    public <T> List<T> findByProperty(Class<T> entityClass, String propertyName, Object value) {

        return genericBaseCommonDao.findByProperty(entityClass, propertyName, value);
    }

    @Override
    public List<List<String>> getArrayList(String sql, Object... objects) {
        return  genericBaseCommonDao.getArrayList(sql, objects);
    }


}
