package com.zzjz.utils;


import com.alibaba.fastjson.JSONObject;

/**
 * 操作JSONObject的相关公共方�?.
 * <p/>
 * Copyright: Copyright (c) Dec 16, 2013 3:03:04 PM
 * <p/>
 *
 * @version 1.0.0
 */
public class JsonUtils {

    /**
     * 获取JSON对象中的�?
     *
     * @param json json
     * @param name name
     * @return JSON对象中的�?
     */
    public static String getJsonValue(JSONObject json, String name) {
        return getJsonValue(json, name, null);
    }

    /**
     * 获取JSON对象中的�?
     *
     * @param json         json
     * @param name         name
     * @param defaultValue defaultValue
     * @return JSON对象中的�?
     */
    public static String getJsonValue(JSONObject json, String name, String defaultValue) {
        if (json.containsKey(name)) {
            return json.getString(name);
        } else {
            json.put(name, defaultValue);
            return defaultValue;
        }
    }

    /**
     * hidden constructor
     */
    private JsonUtils() {
    }

}
