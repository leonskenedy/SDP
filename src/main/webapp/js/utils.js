/*
 将数值四舍五入后格式化.
 @param num 数值(Number或者String)
 @param cent 要保留的小数位(Number)
 @param isThousand 是否需要千分位 0:不需要,1:需要(数值类型),2:百分数;
 @return 格式的字符串,如'1,234,567.45'
 @type String
 */
function formatNumber(num, cent, isThousand) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))//检查传入数值为数值类型.
        num = "0";
    if (isNaN(cent))//确保传入小数位为数值型数值.
        cent = 0;
    cent = parseInt(cent);
    cent = Math.abs(cent);//求出小数位数,确保为正整数.
    if (isNaN(isThousand))//确保传入是否需要千分位为数值类型.
        isThousand = 0;
    isThousand = parseInt(isThousand);
    if (isThousand == 2) {//百分数
        //return (Number(num)*100).toFixed(cent) + '%'
        num = num * 100;
    }
    //if (isThousand < 0)
    //    isThousand = 0;
    //if (isThousand >= 1) //确保传入的数值只为0或1
    //    isThousand = 1;
    sign = (num == (num = Math.abs(num)));//获取符号(正/负数)
//Math.floor:返回小于等于其数值参数的最大整数
    num = Math.floor(num * Math.pow(10, cent) + 0.50000000001);//把指定的小数位先转换成整数.多余的小数位四舍五入.
    cents = num % Math.pow(10, cent); //求出小数位数值.
    num = Math.floor(num / Math.pow(10, cent)).toString();//求出整数位数值.
    cents = cents.toString();//把小数位转换成字符串,以便求小数位长度.
    while (cents.length < cent) {//补足小数位到指定的位数.
        cents = "0" + cents;
    }
    if (isThousand == 2) {//百分数
        if (cent < 1) {
            return (((sign) ? '' : '-') + num) + "%";
        } else {
            return (((sign) ? '' : '-') + num + '.' + cents) + "%";
        }
    }
    if (isThousand == 0) { //不需要千分位符.
        if (cent < 1) {
            return (((sign) ? '' : '-') + num);
        } else {
            return (((sign) ? '' : '-') + num + '.' + cents);
        }
    }
//对整数部分进行千分位格式化.
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
    }
    if (cent < 1) {
        return (((sign) ? '' : '-') + num);
    } else {
        return (((sign) ? '' : '-') + num + '.' + cents);
    }
}
function newline(option, number, axis) {
    option[axis]['axisLabel'] = {
        interval: 0,
        formatter: function (params) {
            var newParamsName = "";
            var paramsNameNumber = params.length;
            var provideNumber = number;
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                    var tempStr = "";
                    var start = p * provideNumber;
                    var end = start + provideNumber;
                    if (p == rowNumber - 1) {
                        tempStr = params.substring(start, paramsNameNumber);
                    } else {
                        tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr;
                }
            } else {
                newParamsName = params;
            }
            return newParamsName
        }
    }
    return option;
}
/**
 * 格式化tooltip
 * @param yAxis
 */
function tooltipFormatter(params, yAxis) {
    var res;
    if (params instanceof Array) {
        if (params[0].value&&params[0].value instanceof Array) {//时间轴提示
            var date =new Date(params[0].name);
            var dateStr = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() +"日";
            res = '<span style="color: black">' + dateStr + '</span>';
            yAxis = eval(yAxis);
            $.each(yAxis, function (index) {
                var name = this.nick_name && $.trim(this.nick_name) != "" ? this.nick_name : params[index].seriesName;

                res += '<br/><span style="font-weight:bold;color: ' + params[index].color + '">' + name + ' : ';
                var  valArr = params[index].value;
                var formatter = this.formatter;
                if (formatter.check == "num") {//数值
                    var num = formatter.num;
                    var digit = num.digit;//精度
                    if (num.millesimal) {//使用千分位分隔符
                        res += formatNumber(valArr[1], digit, 1);
                    } else {
                        res += formatNumber(valArr[1], digit, 0);
                    }

                } else if (formatter.check == "percent") {
                    var percent = formatter.percent;
                    var digit = percent.digit;
                    res += formatNumber(valArr[1], digit, 2);
                }
                var unit_adv = this.unit_adv;//字段单位
                if (unit_adv && $.trim(unit_adv) != "") {
                    res += unit_adv;
                }
                res += "</span>";
            });

        } else {//柱子提示
            res = '<span style="color: black">' + params[0].name + '</span>';
            yAxis = eval(yAxis);
            $.each(yAxis, function (index) {
                var name = this.nick_name && $.trim(this.nick_name) != "" ? this.nick_name : params[index].seriesName;

                res += '<br/><span style="font-weight:bold;color: ' + params[index].color + '">' + name + ' : ';
                var formatter = this.formatter;
                if (formatter.check == "num") {//数值
                    var num = formatter.num;
                    var digit = num.digit;//精度
                    if (num.millesimal) {//使用千分位分隔符
                        res += formatNumber(params[index].value, digit, 1);
                    } else {
                        res += formatNumber(params[index].value, digit, 0);
                    }

                } else if (formatter.check == "percent") {
                    var percent = formatter.percent;
                    var digit = percent.digit;
                    res += formatNumber(params[index].value, digit, 2);
                }
                var unit_adv = this.unit_adv;//字段单位
                if (unit_adv && $.trim(unit_adv) != "") {
                    res += unit_adv;
                }
                res += "</span>";
            });
        }
    } else {//辅助线提示
        res = '<span style="color: black">';
        if (params.data  instanceof Array) {
            res += params.data[0]['realName'];//固定值辅助线名称
        } else {
            res += params["name"];//其余辅助线名称
        }
        res += '</span>';
    }


    return res;
}