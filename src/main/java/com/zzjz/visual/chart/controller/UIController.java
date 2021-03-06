package com.zzjz.visual.chart.controller;

import com.zzjz.visual.chart.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 */
@Controller
@RequestMapping("/ui")
public class UIController {
    @Autowired
    TestService testService;
    /**
     * 页面首页指向
     * @return
     */
    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String toIndex() {
        return "ui/index";
    }

    @RequestMapping(value = "/uniqueData", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public Object getUniqueData(@RequestParam String columnName, @RequestParam(required = false, defaultValue = "") String keyword){
        return testService.getUniqueColumnData(columnName, keyword);
    }

    @RequestMapping(value = "/validateGrammar", method = {RequestMethod.GET, RequestMethod.POST})
    @ResponseBody
    public Object validateGrammar(@RequestParam String tableName, @RequestParam String json){
        return testService.validateGrammar(tableName, json);
    }
}
