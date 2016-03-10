package com.zzjz.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by cnwan on 2016/3/9.
 */
public class ChartAtt {
    public static Map<Long, String> statusMap = null;

    static {
        statusMap = new HashMap<Long, String>();
        statusMap.put(0l, "草稿,意见:");
        statusMap.put(1l, "待审核,意见:");
        statusMap.put(2l, "审核中,意见:");
        statusMap.put(3l, "审核通过,意见:");
        statusMap.put(4l, "审核驳回,意见:");
    }
}
