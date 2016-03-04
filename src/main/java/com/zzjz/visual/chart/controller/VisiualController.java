package com.zzjz.visual.chart.controller;

import com.alibaba.fastjson.JSONObject;
import com.zzjz.visual.chart.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/visual")
public class VisiualController {
    @Autowired


    TestService testService;

    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String toIndex(){
        return "chart/index";
    }
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public Object getList(){
        return JSONObject.toJSON(testService.getList());
    }
}
