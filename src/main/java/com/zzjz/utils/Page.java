package com.zzjz.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * 分页对象。
 * <p>用于包含数据及分页信息的对象
 * Copyright: Copyright (c) 2015/8/20
 * Company: 上海直真君智科技有限公司
 *
 * @author mingqing.wang@zzjunzhi.com
 * @version 1.0.0
 */
public class Page<T> implements java.io.Serializable {

	/**
	 * sid
	 */
	private static final long serialVersionUID = -8901550401275849961L;

	//	/**
	//	 * 空页对象
	//	 */
	//	public static final Page<?> EMPTY_PAGE = new Page<Object>();

	/**
	 * 默认的每页记录数， 15
	 */
	public static final int DEFAULT_PAGESIZE = 15;

	/**
	 * 默认的页码， 1
	 */
	public static final int DEFAULT_PAGENO = 1;

	/**
	 * 本页包含的数据
	 */
	private List<T> datas;

	/**
	 * 每页条数
	 */
	private int pageSize = DEFAULT_PAGESIZE;

	/**
	 * 总页数
	 */
	private int totalPage;

	/**
	 * 总条数
	 */
	private int total;
	/**
	 * 当前页数
	 */
	private int pageNo = DEFAULT_PAGENO;

	/**
	 * 默认构造方法，只构造空页
	 */
	public Page() {
		this.init(0, DEFAULT_PAGESIZE, new ArrayList<T>());
	}

	/**
	 * 默认构造方法，只构造空页
	 */
	public Page(int totalSize, int pageSize, List<T> data) {
		this.init(totalSize, pageSize, data);
	}

	/**
	 * 分页数据初始方法
	 *
	 * @param totalSize 数据库中总记录条数
	 * @param pageSize  本页容量
	 * @param data      本页包含的数据
	 */
	private void init(int totalSize, int pageSize, List<T> data) {
		this.pageSize = pageSize;
		this.total = totalSize;
		this.datas = data;
		this.totalPage = (totalSize + pageSize - 1) / pageSize;
	}

	/**
	 * 取总页码
	 *
	 * @return 总页码
	 */
	public int getTotalPage() {
		return this.totalPage;
	}

	/**
	 * 获得本页数据
	 *
	 * @return 本页数据
	 */
	public List<T> getDatas() {
		return datas;
	}

	public void setDatas(List<T> datas) {
		this.datas = datas;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	public int getPageNo() {
		return pageNo;
	}

	public void setPageNo(int pageNo) {
		this.pageNo = pageNo;
	}
}

