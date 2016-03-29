package com.zzjz.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 时间操作工具类
 * Created by cnwan on 2016/3/29.
 */
public class TimeUtils {
    /**
     * 获取date推迟的周数后周一的时间，
     *
     * @param n 0本周，-1向前推迟一周，1下周，依次类推
     * @return
     */
    public static Date addWeekStartTime(Date date, int n) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, n * 7);
        cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        return cal.getTime();
    }

    /**
     * 获取date推迟的季度第一天的时间，
     *
     * @param n 0当前季度，-1向前推迟一季度，1下季度，依次类推
     * @return
     */
    public static Date addQuarterStartTime(Date date, int n) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        int currentMonth = c.get(Calendar.MONTH) + 1;

        if (currentMonth >= 1 && currentMonth <= 3)
            c.set(Calendar.MONTH, 0);
        else if (currentMonth >= 4 && currentMonth <= 6)
            c.set(Calendar.MONTH, 3);
        else if (currentMonth >= 7 && currentMonth <= 9)
            c.set(Calendar.MONTH, 4);
        else if (currentMonth >= 10 && currentMonth <= 12)
            c.set(Calendar.MONTH, 9);
        c.set(Calendar.DATE, 1);
        c.set(Calendar.MONTH, date.getMonth() - (n * 3));
        c.set(Calendar.HOUR, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        return c.getTime();
    }

    /**
     * 获取date推迟的月份第一天的时间，
     *
     * @param n 0当前月，-1向前推迟一月，1下月，依次类推
     * @return
     */
    public static Date addMonthStartTime(Date date, int n) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.MONTH, date.getMonth() + n);
        c.set(Calendar.DAY_OF_MONTH, 1);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        return c.getTime();
    }

    /**
     * 获取date推迟的天数第一天的时间，
     *
     * @param n 0当前天，-1向前推迟一天，1明日，依次类推
     * @return
     */
    public static Date addDayStartTime(Date date, int n) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.DAY_OF_MONTH, date.getDate() + n);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        return c.getTime();
    }

    /**
     * 获取date推迟的年份数第一天的时间，
     *
     * @param date 时间
     * @param n    0当前年，-1向前推迟一年，1明年，依次类推
     * @return
     */
    public static Date addYearStartTime(Date date, int n) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.YEAR, c.get(Calendar.YEAR)+n);
        c.set(Calendar.MONTH, 0);
        c.set(Calendar.DAY_OF_MONTH, 1);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        return c.getTime();
    }

    public static void main(String[] args) {
        SimpleDateFormat a = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
        System.out.println("TimeUtils.java-->104:" + a.format(addDayStartTime(new Date(), 1)));
        System.out.println("TimeUtils.java-->104:" + a.format(addMonthStartTime(new Date(), 1)));
        System.out.println("TimeUtils.java-->104:" + a.format(addQuarterStartTime(new Date(), 1)));
        System.out.println("TimeUtils.java-->104:" + a.format(addWeekStartTime(new Date(), 1)));
        System.out.println("TimeUtils.java-->104:" + a.format(addYearStartTime(new Date(), 1)));
    }
}
