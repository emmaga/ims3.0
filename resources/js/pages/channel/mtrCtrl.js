define(function (require, exports, module) {
    var UTIL = require("common/util.js");
    var CONFIG = require("common/config.js");
    var CRUD = require("common/crud.js");
    var DB = CRUD.Database.getInstance();
    var widgetData,
        languageJSON;

    exports.init = function () {
        selectLanguage();
        //关闭窗口
        $(".CA_close").click(function () {
            UTIL.cover.close();
        });

        //文本类型下拉框
        $("#mtrC_textType").change(function () {
            if ($("#mtrC_textType").val() == "Marquee") {
                $("#mtrC_effect").show();
                $("#text_color").val("#000000");
                $("#mtrC_scrollDirection").val("Left_2_Right");
                $("#mtrC_scrollSpeed").val("0");
                $("#mtrC_flip").hide();
            } else {
                if ($("#mtrC_textType").val() == "Normal") {
                    $("#mtrC_pageDownPeriod").val(0)
                    $("#box_text_time").children().first().text(languageJSON.flipInterval);
                } else {
                    $("#box_text_time").children().first().text(languageJSON.reflashInterval);
                }
                $("#mtrC_effect").hide();
                $("#mtrC_flip").css('display', 'inline');
            }
        })

        //播放类型下拉框
        $("#mtrCtrl_playType").change(function () {
            var playType = $("#mtrCtrl_playType").val();
            if (playType == "Percent") {
                $(".mtrCtrl_times").children().show();
            } else {
                $(".mtrCtrl_times").children().hide();
            }
        })

        // 添加资源控件
        $('#mtr_addMtr').click(function () {
            var page = "resources/pages/channel/addMtr.html";
            UTIL.cover.load(page);
        })

        // 批量修改
        $('#mtr_batchOperation').click(function () {
            var page = "resources/pages/channel/mtrBatchOperation.html";
            UTIL.cover.load(page);
        })

        // 统计时长
        $('#mtr_countTime').click(function () {
            var conutTime = 0;
            for (var a = 0; a < $(".mtrCtrl_time").length; a++) {
                conutTime += formatSecond($(".mtrCtrl_time:eq(" + a + ")").val());
            }
            //conutTime = formatTime(conutTime);
            $("#channel-editor-wrapper .program-duration-hidden").val(conutTime).change();
        })

        //批量删除
        $("#mtr_delete").click(function () {
            $("input:checkbox[class='mtr_cb']:checked").each(function () {
                DB.collection("material").delete({
                    id: Number($(this).parents("tr").attr("data-id")),
                    resource_id: Number($(this).parents("tr").attr("mtrid")),
                    widget_id: Number($("#mtrCtrl_Title").attr("widget_id"))
                });
                $(this).parents("tr").remove();
            });
            mtrCb();
        })

        //全选和全不选
        $(".checkbox-toggle").click(function () {
            var clicks = $(this).data('clicks');

            if (clicks) {
                //Uncheck all checkboxes
                $(".table-responsive input[type='checkbox']").iCheck("uncheck");
                $(".fa", this).removeClass("fa-check-square-o").addClass('fa-square-o');
            } else {
                //Check all checkboxes
                $(".table-responsive input[type='checkbox']").iCheck("check");
                $(".fa", this).removeClass("fa-square-o").addClass('fa-check-square-o');
            }
            $(this).data("clicks", !clicks);
            mtrCb();
        });

        //Flat red color scheme for iCheck
        $('input[type="radio"].flat-red').iCheck({
            radioClass: 'iradio_flat-green DT_radio',
        });
        $('input[type="radio"].flat-red').each(function () {
            $(this).parent().attr("id", "DT_radio");
        })

        $("#box_tableHeader").hide();
        var widget = JSON.parse(localStorage.getItem('currentWidget'));
        if (widget == null) {
            $("#mtrCtrl_Title").html(languageJSON.noControls);
            $("#box_datetimeEffect").hide();
            $("#box_tableHeader").hide();
            return;
        }
        mtrCb();
        exports.loadPage(widget);
    }

    /**
     * 语言切换绑定
     */
    function selectLanguage() {
        languageJSON = CONFIG.languageJson.channel;
        $("#box_text_time .flipInterval").html(languageJSON.flipInterval);
        $("#mtrC_pageDownPeriod").attr("placeholder", languageJSON.pl_input);
        // $("#box_text_time .second").html(languageJSON.second);
        $("#text_color").attr("placeholder", languageJSON.color);
        $("#mtrC_scrollDirection").html('<option selected="selected" value="Right_2_Left">' + languageJSON.rightToleft + '</option>');
        $("#mtrC_scrollSpeed option:eq(0)").html(languageJSON.static);
        $("#box_text_bgcolor label").html(languageJSON.bgcolor);
        $("#text_bgcolor").attr("placeholder", languageJSON.pl_bgcolor);
        $("#box_datetimeEffect label").html(languageJSON.fontColor);
        $("#clockText_color").attr("placeholder", languageJSON.pl_fontColor);
        $("#box_weather_color label").html(languageJSON.fontColor);
        $("#weatherText_color").attr("placeholder", languageJSON.pl_weatherColor);
        $("#box_weather_time .switchingInterval").html(languageJSON.switchingInterval);
        $("#weatherFlip_time").attr("placeholder", languageJSON.pl_input);
        // $("#box_weather_time .second").html(languageJSON.second);
        $("#mtrC_office_type").html('<option selected="selected" value="Normal">' + languageJSON.Normal + '</option>');
        $("#mtrC_office_switchAnimation").html('<option selected="selected" value="None">' + languageJSON.None + '</option>' +
            '<option value="Random">' + languageJSON.Random + '</option>');
        $("#box_text_time .switchingInterval").html(languageJSON.switchingInterval);
        $("#mtrC_office_switchPeriod").attr("placeholder", languageJSON.pl_input);
        $("#mtr_delete").html(languageJSON.delete);
        $("#mtr_batchOperation").html(languageJSON.batchOperation);
        $("#mtr_countTime").html(languageJSON.staDuration);
        $("#mtr_addMtr").html(languageJSON.addResource);
        $("#mtrC_textType").html('<option selected="selected" value="Normal">' + languageJSON.Normal + '</option>' +
            '<option value="Marquee">' + languageJSON.Marquee + '</option>' +
            '<option value="WebURL">' + languageJSON.WebURL + '</option>')
        $("#mtrC_fontFamily").html('<option selected="selected" value="">' + languageJSON.Default + '</option>' +
            '<option value="宋体" style="font-family: 宋体">' + languageJSON.SimSun + '</option>' +
            '<option value="黑体" style="font-family: 黑体">' + languageJSON.SimHei + '</option>' +
            '<option value="仿宋" style="font-family: 仿宋">' + languageJSON.FangSong + '</option>' +
            '<option value="楷体" style="font-family: 楷体">' + languageJSON.KaiTi + '</option>' +
            '<option value="隶书" style="font-family: 隶书">' + languageJSON.LiSu + '</option>' +
            '<option value="幼圆" style="font-family: 幼圆">' + languageJSON.YouYuan + '</option>' +
            '<option value="微软雅黑" style="font-family: 微软雅黑">' + languageJSON.YaHei + '</option>')
        $("#mtrC_fontBold").html('<option selected="selected" value="0">' + languageJSON.Normal + '</option>' +
            '<option value="1" style="font-weight: 700">' + languageJSON.Bold + '</option>');
        $("#mtrC_FontItalic").html('<option selected="selected" value="0">' + languageJSON.Normal + '</option>' +
            '<option value="1" style="font-style: italic">' + languageJSON.Italic + '</option>');

        $("#mtrCtrl_playType").html('<option selected="selected" value="Sequence">' + languageJSON.SequencePlay + '</option>' +
            '<option value="Random">' + languageJSON.RandomPlay + '</option>' +
            '<option value="Percent">' + languageJSON.PercentPlay + '</option>');
        $("#box_datetime .span-monday").html(languageJSON.Monday);
        $("#weather_cloudy").html(languageJSON.Cloudy);
        $("#weather_wind").html(languageJSON.wind);
        $("#weather_beijing").html(languageJSON.Beijing);
        $("#weather_today").html(languageJSON.today);
        $("#weather_bjtd").html(languageJSON.Beijing + '&nbsp;' + languageJSON.today + '&nbsp;' + languageJSON.Cloudy + '&nbsp;15°～28°');
    }

    exports.loadPage = function (widget) {
        widgetData = widget;
        $(".cp-popover-container").remove();
        $("#mtrCtrl_Table tbody").empty();	//初始化
        $("#mtrCtrl_Table thead").empty();
        $("#mtrCtrl_Table thead").append('<tr>' +
            '<th class="mtrCtrl_checkbox"></th>' +
            '<th class="mtrCtrl_name">' + languageJSON.resourceName + '</th>' +
            '<th class="mtrCtrl_duration">' + languageJSON.duration + '</th>' +
            '<th class="mtrCtrl_times"><label>' + languageJSON.times + '</label></th>' +
            '<th class="mtrCtrl_delete"></th>' +
            '</tr>');
        if ($("#mtrCtrl_playType").val() == "Percent") {
            $(".mtrCtrl_times").children().show();
        } else {
            $(".mtrCtrl_times").children().hide();
        }
        //载入
        if (widget.type != undefined) {
            var wtype = widget.type;
            switch (wtype) {
                case 'VideoBox':
                    $("#mtrCtrl_Title").html(languageJSON.ctrTitle1);
                    $("#box_tableHeader").show();
                    $("#mtr_addMtr").attr("typeId", "1");
                    break;
                case 'ImageBox':
                    $("#mtrCtrl_Title").html(languageJSON.ctrTitle2);
                    $("#box_tableHeader").show();
                    $("#mtr_addMtr").attr("typeId", "2");
                    break;
                case 'AudioBox':
                    $("#mtrCtrl_Title").html(languageJSON.ctrTitle3);
                    $("#box_tableHeader").show();
                    $("#mtr_addMtr").attr("typeId", "3");
                    break;
                case 'WebBox':
                    $("#mtrCtrl_Title").html(languageJSON.ctrTitle4);
                    $("#box_tableHeader").show();
                    $("#mtr_addMtr").attr("typeId", "4");
                    $("#box_effect").show();
                    $("#mtrC_bgFlip").show();
                    $("#mtrC_effect").hide();
                    $("#mtrC_flip").hide();
                    break;
                case 'ClockBox':
                    $("#mtrCtrl_Title").html(languageJSON.ctrTitle5);
                    $("#box_datetime").show();
                    $("#box_datetimeEffect").show();
                    $("#mtrCtrl_Table").hide();
                    $("#box_datetime").show();
                    break;
                case 'WeatherBox':
                    $("#mtrCtrl_Title").html(languageJSON.ctrTitle6);
                    $("#mtrCtrl_Table").hide();
                    $("#box_weather").show();
                    break;
                case 'OfficeBox':
                    $("#mtrCtrl_Title").html(languageJSON.ctrTitle7);
                    $("#box_tableHeader").show();
                    $("#box_officeEffect").show();
                    $("#mtr_addMtr").attr("typeId", "7");
                    break;
            }
            //控件颜色
            var widgetColor;
            $(".channel-program-layout-footer ul li").each(function () {
                if ($(this).attr("data-id") == widget.id.toString()) {
                    widgetColor = $(this).find("i").css("background-color");
                }
            })
            $("#mtrCtrl_Title").prev().css("background-color", widgetColor);
            $("#mtrCtrl_Title").attr("widget_id", widget.id);

            widgetLoad();
        } else {
            $("#mtrCtrl_Title").html(languageJSON.noControls);
        }

    }

    /**
     * 加载控件属性
     */
    function widgetLoad() {
        //color picker with addon
        $("#text_color").ColorPickerSliders({               //文本字体颜色
            color: '#000000',
            size: 'large',
            placement: 'auto',
            swatches: false,
            sliders: false,
            hsvpanel: true,
            title: languageJSON.transparentPrompt,
            onchange: function (ev) {
                textAttrSave();
            }
        });
        $("#text_bgcolor").ColorPickerSliders({             //文本背景颜色
            color: 'rgba(0, 0, 0, 0)',
            size: 'large',
            placement: 'auto',
            swatches: false,
            sliders: false,
            hsvpanel: true,
            title: languageJSON.transparentPrompt,
            onchange: function (ev) {
                textAttrSave();
            }
        });
        $("#clockText_color").ColorPickerSliders({          //时钟文本颜色
            color: '#000000',
            size: 'large',
            placement: 'auto',
            swatches: false,
            sliders: false,
            hsvpanel: true,
            title: languageJSON.transparentPrompt,
            onchange: function (ev, color) {
                $(".mtrC_datetime").css("color", color.tiny.toRgbString());
                clockSave();
            }
        });
        $("#weatherText_color").ColorPickerSliders({        //天气文本颜色
            color: '#000000',
            size: 'large',
            placement: 'auto',
            swatches: false,
            sliders: false,
            hsvpanel: true,
            title: languageJSON.transparentPrompt,
            onchange: function (ev, color) {
                $(".mtrC_weather").css("color", color.tiny.toRgbString());
                weatherSave();
            }
        });
        var wOsp = JSON.parse(widgetData.overall_schedule_params);
        if (wOsp.Type == undefined) {
            var wOspType = "Sequence";
        } else {
            var wOspType = wOsp.Type;
        }
        $("#mtrCtrl_playType").val(wOspType);
        switch (widgetData.type) {
            case 'VideoBox':
                if (wOsp.Type != undefined) {
                    playTypeSave();
                }
                break;
            case 'ImageBox':
                if (wOsp.Type != undefined) {
                    playTypeSave();
                }
                break;
            case 'AudioBox':
                if (wOsp.Type != undefined) {
                    playTypeSave();
                }
                break;
            case 'WebBox':
                if (widgetData.style != "") {
                    var wStyle = JSON.parse(widgetData.style);
                    $("#mtrC_textType").val(wStyle.Type);
                    //走马灯
                    if (wStyle.Type == "Marquee") {
                        $("#mtrC_effect").show();
                        $("#mtrC_fontFamily").val(wStyle.FontFamily);
                        if (wStyle.FontFamily != "") {
                            $("#mtrC_fontFamily").css("font-family", wStyle.FontFamily)
                        }
                        $("#mtrC_fontBold").val(wStyle.FontBold);
                        if (wStyle.FontBold == 1) {
                            $("#mtrC_fontBold").css("font-weight", "700")
                        }
                        $("#mtrC_FontItalic").val(wStyle.FontItalic);
                        if (wStyle.FontItalic == 1) {
                            $("#mtrC_FontItalic").css("font-style", "italic")
                        }
                    } else {
                        $("#mtrC_flip").show();
                        if (wStyle.Type == "Normal") {
                            $("#box_text_time").children().first().text(languageJSON.flipInterval);
                            $("#mtrC_pageDownPeriod").val(wStyle.PageDownPeriod);
                        } else {
                            $("#box_text_time").children().first().text(languageJSON.reflashInterval);
                            $("#mtrC_pageDownPeriod").val(wStyle.RefreshPeriod);
                        }
                    }
                    $("#text_color").trigger("colorpickersliders.updateColor", wStyle.TextColor);
                    $("#text_bgcolor").trigger("colorpickersliders.updateColor", wStyle.BackgroundColor);
                    $("#mtrC_scrollDirection").val(wStyle.ScrollDriection);
                    $("#mtrC_scrollSpeed").val(wStyle.ScrollSpeed);

                } else {
                    $("#mtrC_flip").show();
                    $("#mtrC_pageDownPeriod").val(0);
                    $("#text_bgcolor").val("rgba(0, 0, 0, 0)");
                    $("#text_color").css("background-color", "#000000");
                    $("#text_bgcolor").css("background-color", "rgba(0, 0, 0, 0)");
                }
                textAttrSave();
                break;
            case 'ClockBox':
                var wStyle = widgetData.style === '' ? {} : JSON.parse(widgetData.style);
                if (wStyle.Type == undefined) {
                    $("#clockText_color").val("#000000");
                    $("#mtrC_dtTime").next().trigger("click");
                } else {
                    $("#clockText_color").trigger("colorpickersliders.updateColor", wStyle.TextColor);
                    $(".mtrC_datetime").css("color", wStyle.TextColor);
                    var wctype = wStyle.Type;
                    switch (wctype) {
                        case 'Time':
                            $("#mtrC_dtTime").next().trigger("click");
                            break;
                        case 'Date':
                            $("#mtrC_dtDate").next().trigger("click");
                            break;
                        case 'Week':
                            $("#mtrC_dtWeek").next().trigger("click");
                            break;
                        case 'DateTime':
                            $("#mtrC_dtDateTime").next().trigger("click");
                            break;
                        case 'DateTimeWeekH':
                            $("#mtrC_dtDateTimeWeekH").next().trigger("click");
                            break;
                        case 'DateTimeWeekV':
                            $("#mtrC_dtDateTimeWeekV").next().trigger("click");
                            break;
                        case 'TimeAnim':
                            $("#mtrC_dtTimeAnim").next().trigger("click");
                            break;
                    }
                }
                clockSave();
                break;
            case 'WeatherBox':
                var wStyle = widgetData.style === '' ? {} : JSON.parse(widgetData.style);
                $("#box_weatherEffect").show();
                if (wStyle.Type == undefined) {
                    $("#weatherText_color").val("#000000");
                    $("#weatherText_color").css("background-color", "#000000");
                    $("#weatherFlip_time").val(10);
                    $("#mtrC_weatherNormal").next().trigger("click");
                } else {
                    $("#weatherText_color").trigger("colorpickersliders.updateColor", wStyle.TextColor);
                    $(".mtrC_weather").css("color", wStyle.TextColor);
                    $("#weatherFlip_time").val(wStyle.SwitchPeriod);
                    var wctype = wStyle.Type;
                    switch (wctype) {
                        case 'Normal':
                            $("#mtrC_weatherNormal").next().trigger("click");
                            break;
                        case 'Oneline':
                            $("#mtrC_weatherOneline").next().trigger("click");
                            break;
                    }
                }
                weatherSave();
                break;
            case 'OfficeBox':
                if (widgetData.style != "") {
                    var wStyle = JSON.parse(widgetData.style);
                    $("#mtrC_office_type").val(wStyle.Type);
                    $("#mtrC_office_switchAnimation").val(wStyle.SwitchAnimation);
                    $("#mtrC_office_switchPeriod").val(wStyle.SwitchPeriod);
                } else {
                    $("#mtrC_office_switchPeriod").val(10);
                }
                if (wOsp.Type != undefined) {
                    playTypeSave();
                }
                officeSave();
                break;
        }

        $("#widget_attribute").empty();
        var wleft = widgetData.left;
        var wtop = widgetData.top;
        var wwidth = widgetData.width;
        var wheight = widgetData.height;
        $("#widget_attribute").append('<label>' + languageJSON.left + '：' + wleft + '</label><label>' + languageJSON.top + '：' + wtop + '</label><label>' + languageJSON.size + '：' + wwidth + '×' + wheight + '</label>');

        var mtrData = DB.collection("material").select({widget_id: widgetData.id});
        if (widgetData.type != "ClockBox") {
            exports.getSelectedID(mtrData, true);
        }

        //绑定触发事件
        save();
        clockChange();
        weatherChange();
    }

    /**
     * 将数据添加到列表
     * @param mtrData
     * @param getWidgetMtr {bool} 判断是获取还是新增
     */
    exports.getSelectedID = function (mtrData, getWidgetMtr) {
        mtrData.sort(function (a, b) {
            return a.sequence - b.sequence
        });
        //拼接
        if (mtrData.length != 0) {
            if (getWidgetMtr == true) {     //获取
                for (var x = 0; x < mtrData.length; x++) {
                    var mtrTypeClass,
                        duration;
                    switch (mtrData[x].type_id) {
                        case 1:
                            if (mtrData[x].type_name == "视频") {
                                mtrTypeClass = "fa fa-file-video-o";
                            } else {
                                mtrTypeClass = "fa fa-file-o";
                            }
                            break;
                        case 2:
                            mtrTypeClass = "fa fa-file-image-o";
                            break;
                        case 3:
                            mtrTypeClass = "fa fa-file-audio-o";
                            break;
                        case 4:
                            mtrTypeClass = "fa fa-file-text-o";
                            break;
                        case 7:
                            mtrTypeClass = "fa fa-file-word-o";
                            break;
                    }
                    var schedule_params = JSON.parse(mtrData[x].schedule_params) === '' ? {} : JSON.parse(mtrData[x].schedule_params);
                    if (schedule_params != {}) {
                        if (mtrData[x].type_name == "Office") {
                            var data = JSON.stringify({
                                project_name: CONFIG.projectName,
                                action: "getone",
                                officeid: mtrData[x].resource_id
                            })
                            var _url = CONFIG.serverRoot + '/backend_mgt/v2/officeaction/';
                            UTIL.ajax2('post', _url, data, function (msg) {
                                var SwitchPeriod = JSON.parse(widgetData.style).SwitchPeriod;
                                var count = Object.keys(msg).length;
                                duration = formatTime(SwitchPeriod * count);
                            })
                        } else {
                            duration = formatTime(schedule_params.duration);
                        }
                    } else {
                        if (mtrData[x].type_name == "直播") {
                            duration = "01:00:00";
                        } else {
                            duration = "00:00:15";
                        }
                    }
                    var mtrCtrl_name_tr,
                        mtrCtrl_duration_tr;
                    if (mtrData[x].type_name == "文本" || mtrData[x].type_name == "直播") {		    //文本和直播无预览效果
                        mtrCtrl_name_tr = '<i class="' + mtrTypeClass + '"></i>&nbsp;' + mtrData[x].name;
                        mtrCtrl_duration_tr = '<td class="mtrCtrl_duration"><input type="text" class="mtrCtrl_time" value=' + duration + '></td>'
                    } else {
                        if (mtrData[x].type_name == "视频" || mtrData[x].type_name == "音频" || mtrData[x].type_name == "Office") {     //视频和音频无法修改时长
                            mtrCtrl_duration_tr = '<td class="mtrCtrl_duration"><input type="text" class="mtrCtrl_time" value=' + duration + ' disabled></td>'
                        } else {
                            mtrCtrl_duration_tr = '<td class="mtrCtrl_duration"><input type="text" class="mtrCtrl_time" value=' + duration + '></td>'
                        }
                        var mtrUrl = UTIL.getRealURL(mtrData[x].download_auth_type, mtrData[x].url);
                        mtrCtrl_name_tr = '<a url=' + mtrUrl + ' target="_blank"><i class="' + mtrTypeClass + '"></i>&nbsp;' + mtrData[x].name + '</a>';
                    }
                    if (JSON.parse(mtrData[x].schedule_params).count != undefined) {
                        var dbcount = JSON.parse(mtrData[x].schedule_params).count;
                    } else {
                        var dbcount = 1;
                    }
                    var mtrtr = '<tr data-id="' + mtrData[x].id + '" mtrid="' + mtrData[x].resource_id + '" mtrsequence="' + mtrData[x].sequence + '">' +
                        '<td class="mtrCtrl_checkbox"><input type="checkbox" id="mtr_cb" class="mtr_cb" mtrid="' + mtrData[x].resource_id + '"></td>' +
                        '<td class="mtrCtrl_name" title="' + mtrData[x].name + '"><b>' + mtrCtrl_name_tr + '</b></td>' +
                        mtrCtrl_duration_tr +
                        '<td class="mtrCtrl_times"><input type="number" class="mtrC_times"  value=' + dbcount + '></td>' +
                        '<td class="mtrCtrl_delete"><a id="btn_ctrlDel" class="btn_ctrlDel"><i class="fa fa-trash-o"></i></a></th>' +
                        '</tr>';
                    $("#mtrCtrl_Table tbody").append(mtrtr);
                }
            } else {       //添加
                if ($("#mtrCtrl_playType").val() == "Sequence") {     //顺序播放查询最大sequence
                    var maxsequence = 0;
                    $("#mtrCtrl_Table tbody tr").each(function () {
                        var mtrsequence = Number($(this).attr("mtrsequence"));
                        if (mtrsequence > maxsequence) {
                            maxsequence = mtrsequence;
                        }
                    })
                } else {
                    var maxsequence = 0;
                }
                for (var x = 0; x < mtrData.length; x++) {
                    var mtrTypeClass,
                        dbTypeName,
                        mtrDuration,
                        mtrCtrl_name_tr,
                        mtrCtrl_duration_tr;
                    switch (mtrData[x].Type_Name) {
                        case "Video":
                            dbTypeName = "视频";
                            mtrTypeClass = "fa fa-file-video-o";
                            break;
                        case "Live":
                            dbTypeName = "直播";
                            mtrTypeClass = "fa fa-file-o";
                            break;
                        case "Image":
                            dbTypeName = "图片";
                            mtrTypeClass = "fa fa-file-image-o";
                            break;
                        case "Audio":
                            dbTypeName = "音频";
                            mtrTypeClass = "fa fa-file-audio-o";
                            break;
                        case "文本":
                            dbTypeName = "文本";
                            mtrTypeClass = "fa fa-file-text-o";
                            break;
                        case "Office":
                            dbTypeName = "Office";
                            mtrTypeClass = "fa fa-file-word-o";
                            break;
                    }
                    if (mtrData[x].Duration == undefined) {
                        if (mtrData[x].Type_Name == "Office") {
                            var data = JSON.stringify({
                                project_name: CONFIG.projectName,
                                action: "getone",
                                officeid: mtrData[x].ID
                            })
                            var _url = CONFIG.serverRoot + '/backend_mgt/v2/officeaction/';
                            UTIL.ajax2('post', _url, data, function (msg) {
                                var SwitchPeriod = Number($("#mtrC_office_switchPeriod").val());
                                var count = Object.keys(msg).length;
                                mtrDuration = SwitchPeriod * count;
                            })
                        } else {
                            mtrDuration = 15;
                        }
                    } else {
                        mtrDuration = formatSecond(mtrData[x].Duration).toString();
                        if (mtrDuration == 0) {
                            if (mtrData[x].Type_Name == "Live") {
                                mtrDuration = 3600;
                            } else {
                                mtrDuration = 15;
                            }
                        }
                    }
                    var dbduration = {
                        duration: mtrDuration       //将时间转为秒
                    }
                    if ($("#mtrCtrl_playType").val() == "Sequence") {
                        maxsequence++;
                    }
                    var dbtype_id = typeof mtrData[x].Type_ID === 'number' ? mtrData[x].Type_ID : {
                            'Office': 5,
                            '文本': 4,
                            '音频': 3,
                            '图片': 2,
                            '视频': 1
                        }[mtrData[x].Type_Name];
                    var intDate = {
                        is_time_segment_limit: 0,
                        lifetime_start: '1970-01-01 00:00:00',
                        lifetime_end: "2030-01-01 00:00:00",
                        name: mtrData[x].Name,
                        name_eng: mtrData[x].Name_eng,
                        resource_id: mtrData[x].ID,
                        schedule_params: JSON.stringify(dbduration),
                        schedule_type: "Regular",
                        sequence: maxsequence,
                        time_segment_duration: 99999,
                        time_segment_start: "",
                        type_id: dbtype_id,
                        type_name: dbTypeName,
                        download_auth_type: mtrData[x].Download_Auth_Type,
                        url: mtrData[x].URL,
                        widget_id: Number($("#mtrCtrl_Title").attr("widget_id"))
                    }
                    DB.collection("material").insert(intDate);                      //存入缓存
                    var data_id = DB.collection("material").lastInsertId();         //查询刚添加的ID
                    //拼接
                    if ((mtrData[x].Type_Name == "Video" && mtrData[x].Is_Live == 0) || mtrData[x].Type_Name == "Audio" || mtrData[x].Type_Name == "Image" || mtrData[x].Type_Name == "Office") {       //视频、音乐、图片、Office
                        var mtrUrl = UTIL.getRealURL(mtrData[x].Download_Auth_Type, mtrData[x].URL)         //获取真实url
                        mtrCtrl_name_tr = '<a url=' + mtrUrl + ' target="_blank"><i class="' + mtrTypeClass + '"></i>&nbsp;' + mtrData[x].Name + '</a>';
                        if (mtrData[x].Type_Name == "Image") {                     //图片
                            mtrCtrl_duration_tr = '<td class="mtrCtrl_duration"><input type="text" class="mtrCtrl_time" step="1" value=' + formatTime(mtrDuration) + '></td>'
                        } else {
                            mtrCtrl_duration_tr = '<td class="mtrCtrl_duration"><input type="text" class="mtrCtrl_time" step="1" value=' + formatTime(mtrDuration) + ' disabled></td>'
                        }
                    } else if (mtrData[x].Type_Name == "文本") {                  //文本
                        mtrCtrl_name_tr = '<i class="' + mtrTypeClass + '"></i>&nbsp;' + mtrData[x].Name;
                        mtrCtrl_duration_tr = '<td class="mtrCtrl_duration"><input type="text" class="mtrCtrl_time" step="1" value=' + formatTime(mtrDuration) + '></td>'
                    } else if (mtrData[x].Type_Name == "Live") {        //直播资源
                        mtrCtrl_name_tr = '<i class="' + mtrTypeClass + '"></i>&nbsp;' + mtrData[x].Name;
                        mtrCtrl_duration_tr = '<td class="mtrCtrl_duration"><input type="text" class="mtrCtrl_time" step="1" value=' + formatTime(mtrDuration) + '></td>'
                    }
                    var mtrtr = '<tr data-id="' + data_id + '" mtrid="' + mtrData[x].ID + '" mtrsequence="' + maxsequence + '">' +
                        '<td class="mtrCtrl_checkbox"><input type="checkbox" id="mtr_cb" class="mtr_cb" mtrid="' + mtrData[x].ID + '"></td>' +
                        '<td class="mtrCtrl_name" title="' + mtrData[x].Name + '"><b>' + mtrCtrl_name_tr + '</b></td>' +
                        mtrCtrl_duration_tr +
                        '<td class="mtrCtrl_times"><input type="number" class="mtrC_times" value=1></td>' +
                        '<td class="mtrCtrl_delete"><a id="btn_ctrlDel" class="btn_ctrlDel"><i class="fa fa-trash-o"></i></a></th>' +
                        '</tr>';
                    $("#mtrCtrl_Table tbody").append(mtrtr);
                }
            }

            // 时间控件绑定
            $(".mtrCtrl_time").inputmask("hh:mm:ss", {"placeholder": "hh:mm:ss"});

            //预览操作
            // $(".mtrCtrl_name a").each(function () {
            $(".mtrCtrl_name a").click(function () {
                var mtrData = DB.collection("material").select({widget_id: Number($("#mtrCtrl_Title").attr("widget_id"))});
                var z_index;
                for (var a = 0; a < mtrData.length; a++) {
                    if (mtrData[a].resource_id == $(this).parents("tr").attr("mtrid")) {
                        z_index = a;
                    }
                }
                if (mtrData[z_index].type_name == "视频") {
                    var backSuffix = mtrData[z_index].url.substring(mtrData[z_index].url.lastIndexOf("."));
                    if (backSuffix != ".mp4" && backSuffix != ".ogg" && backSuffix != ".WebM" && backSuffix != ".MPEG4") {
                        alert("当前视频格式暂不支持预览！");
                        return;
                    }
                } else if (mtrData[z_index].type_name == "音频") {
                    var backSuffix = mtrData[z_index].url.substring(mtrData[z_index].url.lastIndexOf("."));
                    if (backSuffix != ".mp3" && backSuffix != ".ogg" && backSuffix != ".wav") {
                        alert("当前音频格式暂不支持试听！");
                        return;
                    }
                }
                exports.viewData = mtrData[z_index];
                var page = "resources/pages/materials/materials_preview.html";
                UTIL.cover.load(page, 3);
            });
            // });

            //显示或隐藏次数
            if ($("#mtrCtrl_playType").val() == "Percent") {
                $(".mtrCtrl_times").children().show();
            } else {
                $(".mtrCtrl_times").children().hide();
            }

            //显示或隐藏删除按钮
            $(".btn_ctrlDel").hide();
            $("#mtrCtrl_Table tbody tr").mouseover(function () {
                $(this).find("#btn_ctrlDel").show();
            })
            $("#mtrCtrl_Table tbody tr").mouseout(function () {
                $(this).find("#btn_ctrlDel").hide();
            })
            //单个删除
            $(".btn_ctrlDel").click(function () {
                DB.collection("material").delete({
                    id: Number($(this).parents("tr").attr("data-id")),
                    resource_id: Number($(this).parents("tr").attr("mtrid")),
                    widget_id: Number($("#mtrCtrl_Title").attr("widget_id"))
                });
                $(this).parents("tr").remove();
                mtrCb();
            })

            //复选框样式
            $('.table-responsive input[type="checkbox"]').iCheck({
                checkboxClass: 'icheckbox_flat-blue',
                radioClass: 'iradio_flat-blue'
            });
            //复选框点击事件
            $(".icheckbox_flat-blue").parent().parent().click(function () {
                $(".table-responsive input[type='checkbox']").iCheck("uncheck");
                if ($(this).find("input").prop("checked") == true) {
                    $(this).find("input").prop("checked", false);
                    $(this).find("div").prop("class", "icheckbox_flat-blue");
                    $(this).find("div").prop("aria-checked", "false");
                } else {
                    $(this).find("input").prop("checked", true);
                    $(this).find("div").prop("class", "icheckbox_flat-blue checked");
                    $(this).find("div").prop("aria-checked", "true");
                }
                mtrCb();
            })
            $(".icheckbox_flat-blue ins").click(function () {
                mtrCb();
            })

            //资源排序
            var tbody = $("#mtrCtrl_Table tbody");
            materialSortable = Sortable.create(tbody[0], {
                onSort: onResortMaterial
            });

            mtrCb();
            mtrAttrSave()
        }
    }

    function save() {
        //文本类型
        $("#mtrC_textType").change(function () {
            $("#mtrC_scrollDirection").val("Right_2_Left");
            textAttrSave();
        })
        //翻页时间
        $("#mtrC_pageDownPeriod").change(function () {
            textAttrSave();
        })
        //文本字体颜色
        $("#text_color").bind("input propertychange", function () {
            textAttrSave();
        })
        //文本背景颜色
        $("#text_bgcolor").bind("input propertychange", function () {
            textAttrSave();
        })
        //滚动方向
        $("#mtrC_scrollDirection").change(function () {
            textAttrSave();
        })
        //滚动速度
        $("#mtrC_scrollSpeed").change(function () {
            textAttrSave();
        })
        //字体
        $("#mtrC_fontFamily").change(function () {
            if ($(this).val() != "") {
                this.style.fontFamily = $(this).val();
            }
            textAttrSave();
        })
        //加粗
        $("#mtrC_fontBold").change(function () {
            if ($(this).val() == 0) {
                this.style.fontWeight = "400";
            } else {
                this.style.fontWeight = "700";
            }
            textAttrSave();
        })
        //斜体
        $("#mtrC_FontItalic").change(function () {
            if ($(this).val() == 0) {
                this.style.fontStyle = "normal";
            } else {
                this.style.fontStyle = "italic";
            }
            textAttrSave();
        })
        //播放顺序
        $("#mtrCtrl_playType").change(function () {
            playTypeSave();
        })

        //office显示类型
        $("#mtrC_office_type").change(function () {
            officeSave();
        })
        //office切换动画
        $("#mtrC_office_switchAnimation").change(function () {
            officeSave();
        })
        //office切换间隔
        $("#mtrC_office_switchPeriod").change(function () {
            officeDuration();
            officeSave();
        })
    }

    /**
     * 播放顺序保存
     */
    function playTypeSave() {
        if (!inputCheck()) return;
        var overall_schedule_params = {
            Type: $("#mtrCtrl_playType").val()
        };
        DB.collection("widget").update({overall_schedule_params: JSON.stringify(overall_schedule_params)}, {id: Number($("#mtrCtrl_Title").attr("widget_id"))});
    }

    /**
     * 文本效果保存
     */
    function textAttrSave() {
        if (!inputCheck()) return;
        if ($("#mtrC_textType").val() == "Marquee") {
            var wstyle = {
                Type: $("#mtrC_textType").val(),
                TextColor: $("#text_color").val(),
                ScrollDriection: $("#mtrC_scrollDirection").val(),
                ScrollSpeed: $("#mtrC_scrollSpeed").val(),
                FontFamily: $("#mtrC_fontFamily").val(),
                FontBold: $("#mtrC_fontBold").val(),
                FontItalic: $("#mtrC_FontItalic").val(),
                BackgroundColor: $("#text_bgcolor").val()
            }
        } else if ($("#mtrC_textType").val() == "Normal") {
            var wstyle = {
                Type: $("#mtrC_textType").val(),
                PageDownPeriod: $("#mtrC_pageDownPeriod").val(),
                BackgroundColor: $("#text_bgcolor").val()
            }
        } else if ($("#mtrC_textType").val() == "WebURL") {
            var wstyle = {
                Type: $("#mtrC_textType").val(),
                RefreshPeriod: $("#mtrC_pageDownPeriod").val(),
                BackgroundColor: $("#text_bgcolor").val()
            }
        }
        DB.collection("widget").update({style: JSON.stringify(wstyle)}, {id: Number($("#mtrCtrl_Title").attr("widget_id"))});
    }

    /**
     * 资源修改
     */
    function mtrAttrSave() {
        $(".mtrCtrl_time").change(function () {
            if (!inputCheck()) return;
            var time = {
                duration: formatSecond($(this).val())
            };
            DB.collection("material").update({schedule_params: JSON.stringify(time)}, {
                resource_id: Number($(this).parent().parent().attr("mtrid")),
                widget_id: Number($("#mtrCtrl_Title").attr("widget_id"))
            });
        })
        $(".mtrC_times").change(function () {
            if (!inputCheck()) return;
            if ($("#mtrCtrl_playType").val() == "Percent") {
                var schedule_params = {
                    duration: formatSecond($(this).parent().prev().find("input").val()),
                    count: Number($(this).val())
                };
            } else {
                var schedule_params = {
                    duration: formatSecond($(this).parent().prev().find("input").val())
                };
            }
            DB.collection("material").update({schedule_params: JSON.stringify(schedule_params)},
                {
                    resource_id: Number($(this).parent().parent().attr("mtrid")),
                    widget_id: Number($("#mtrCtrl_Title").attr("widget_id"))
                });
        })
    }

    /**
     * 时钟修改
     */
    function clockChange() {
        //时钟字体颜色事件
        $("#clockText_color").bind("input propertychange", function () {
            clockSave();
        })
        //时钟类型
        $(".rd_clock").next().click(function () {
            clockSave();
        })
    }

    /**
     * 时钟字体颜色
     */
    function clockSave() {
        if (!inputCheck()) return;
        var wstyle = {
            TextColor: $("#clockText_color").val(),
            Type: $("input:radio:checked").attr("clocktype"),
        }
        DB.collection("widget").update({style: JSON.stringify(wstyle)}, {id: Number($("#mtrCtrl_Title").attr("widget_id"))});
    }

    /**
     * 天气控件
     */
    function weatherChange() {
        //字体颜色
        $("#weatherText_color").bind("input propertychange", function () {
            weatherSave();
        })
        $("#weatherFlip_time").change(function () {
            weatherSave();
        })
        //天气类型
        $(".rd_weather").next().click(function () {
            weatherSave();
        })
    }

    /**
     * 天气保存
     */
    function weatherSave() {
        if (!inputCheck()) return;
        var wstyle = {
            Type: $("input:radio:checked").attr("weathertype"),
            SwitchPeriod: Number($("#weatherFlip_time").val()),
            TextColor: $("#weatherText_color").val()
        }
        DB.collection("widget").update({style: JSON.stringify(wstyle)}, {id: Number($("#mtrCtrl_Title").attr("widget_id"))});
    }

    /**
     * Office数据加入缓存
     */
    function officeSave() {
        if (!inputCheck()) return;
        var wstyle = {
            Type: $("#mtrC_office_type").val(),
            SwitchPeriod: Number($("#mtrC_office_switchPeriod").val()),
            SwitchAnimation: $("#mtrC_office_switchAnimation").val()
        }
        DB.collection("widget").update({style: JSON.stringify(wstyle)}, {id: Number($("#mtrCtrl_Title").attr("widget_id"))});
    }

    /**
     * Office切换间隔改变文件播放时长
     */
    function officeDuration() {
        var switchPeriod = Number($("#mtrC_office_switchPeriod").val());
        $("#mtrCtrl_Table tbody tr").each(function (el) {
            var data = JSON.stringify({
                project_name: CONFIG.projectName,
                action: "getone",
                officeid: $(this).attr("mtrid")
            })
            var _url = CONFIG.serverRoot + '/backend_mgt/v2/officeaction/';
            UTIL.ajax('post', _url, data, function (msg) {
                var count = Object.keys(msg).length
                var duration = formatTime(switchPeriod * count);
                $("#mtrCtrl_Table tbody tr:eq(" + el + ")").find($(".mtrCtrl_time")).val(duration);
            })
        })
    }


    /**
     * 校验
     */
    function inputCheck() {
        var widgetData = JSON.parse(localStorage.getItem('currentWidget'));
        var errorMsg = "";
        var obj;
        $(".mtrCtrl_time").each(function () {
            if ($(this).val() == "") {
                errorMsg += languageJSON.al_duration + "！\n";
                obj = $(this);
            } else {
                var attr = $(this).val().split(":");
                if (isNaN(attr[0]) || isNaN(attr[1]) || isNaN(attr[2])) {
                    errorMsg += languageJSON.al_durationEr + "！\n";
                    obj = $(this);
                    $(this).val($(this).attr("value"));
                }
            }
        })
        $(".mtrC_times").each(function () {
            if ($(this).val() == null) {
                errorMsg += languageJSON.al_times + "！\n";
                obj = $(this);
            }

        })
        if (widgetData.type_id == 3) {
            if ($("#mtrC_textType").val() == "Normal") {
                if ($("#mtrC_pageDownPeriod").val() == null) {
                    errorMsg += languageJSON.al_flipTime + "！\n";
                    obj = $("#mtrC_textType");
                }
            } else {
                if ($("#text_color").val() == "") {
                    $("#text_color").trigger("colorpickersliders.updateColor", "#000000");
                    if ($(".cp-popover-container").length != 0) {
                        $("#text_color").trigger("colorpickersliders.hide");
                    }
                }
                if ($("#mtrC_scrollSpeed").val() == "") {
                    errorMsg += languageJSON.al_speed + "！\n";
                    obj = $("#mtrC_scrollSpeed");
                }
            }
            if ($("#text_bgcolor").val() == "") {
                $("#text_bgcolor").trigger("colorpickersliders.updateColor", "rgba(0, 0, 0, 0)");
                if ($(".cp-popover-container").length != 0) {
                    $("#text_bgcolor").trigger("colorpickersliders.hide");
                }
            }
        }
        if (widgetData.type_id == 5) {
            if ($("#clockText_color").val() == "") {
                $("#clockText_color").trigger("colorpickersliders.updateColor", "#000000");
                if ($(".cp-popover-container").length != 0) {
                    $("#clockText_color").trigger("colorpickersliders.hide");
                }
            }
        }
        if (widgetData.type_id == 6) {
            if ($("#weatherText_color").val() == "") {
                $("#weatherText_color").trigger("colorpickersliders.updateColor", "#000000");
                if ($(".cp-popover-container").length != 0) {
                    $("#weatherText_color").trigger("colorpickersliders.hide");
                }
            }
            if ($("#weatherFlip_time").val() == "") {
                errorMsg += languageJSON.al_weaCutTime + "！\n";
                obj = $("#weatherFlip_time")
            }
        }
        if (errorMsg == "") {
            return true;
        } else {
            alert(errorMsg);
            obj.focus();
            return false;
        }

    }

    /**
     * 校验复选框勾选的个数
     */
    function mtrCb() {
        var Ck = $("#mtrCtrl_Table .icheckbox_flat-blue.checked").length;	//当前选中复选框个数
        var Uck = $("#mtrCtrl_Table .icheckbox_flat-blue").length;			//复选框总个数
        //控制全选按钮全选或者不全选状态
        if (Ck != 0) {
            $("#mtr_delete").removeAttr("disabled");
            $("#mtr_batchOperation").removeAttr("disabled");
        } else {
            $("#mtr_delete").attr("disabled", true);
            $("#mtr_batchOperation").attr("disabled", true);
        }
        if (Uck != 0) {
            $("#mtr_countTime").removeAttr("disabled");
            if (Ck == Uck) {
                $(".fa.fa-square-o").attr("class", "fa fa-check-square-o");
                $(".checkbox-toggle").data('clicks', true);
            } else {
                $(".fa.fa-check-square-o").attr("class", "fa fa-square-o");
                $(".checkbox-toggle").data('clicks', false);
            }
        } else {
            $("#mtr_delete").attr("disabled", true);
            $("#mtr_batchOperation").attr("disabled", true);
            $("#mtr_countTime").attr("disabled", true);
            $(".fa.fa-check-square-o").attr("class", "fa fa-square-o");
            $(".checkbox-toggle").data("clicks", false);
        }

    }

    /**
     * 当节目重排序时回调
     * @param evt
     */
    function onResortMaterial(evt) {
        var sortedIds = materialSortable.toArray().map(function (el) {
            return parseInt(el);
        });
        sortedIds.forEach(function (id, idx) {
            DB.collection('material').update({sequence: idx}, {id: id});
        });
    }

    /**
     * @function 将时间戳转化为小时+分+秒
     * @param {Date} 时间戳
     * @return {String} 时间字符串
     */
    function formatTime(longTime) {
        //转化为 小时+分+秒
        var time = parseFloat(longTime);
        var h,
            m,
            s
        if (time != null && time != "" || time == 0) {
            if (time < 60) {
                h = "00";
                m = "00";
                s = format(time);
            } else if (time >= 60 && time < 3600) {
                h = "00";
                m = format(parseInt(time / 60));
                s = format(parseInt(time % 60));
            } else if (time >= 3600 && time < 86400) {
                h = format(parseInt(time / 3600));
                m = format(parseInt(time % 3600 / 60));
                s = format(parseInt(time % 3600 % 60 % 60));
            }
            time = h + ":" + m + ":" + s;
        }
        return time;
    }

    function format(time) {
        if (time < 10) {
            return "0" + time;
        } else {
            return time;
        }
    }

    /**
     * 转时间为秒
     * @param longTime
     * @returns {number}
     */
    function formatSecond(longTime) {
        var arr = longTime.split(":");
        var h = Number(arr[0]);
        var m = Number(arr[1]);
        var s = Number(arr[2]);
        var time = h * 3600 + m * 60 + s;
        return time;
    }

    /**
     * 获取当前日期时间"yyyy-MM-dd HH:MM:SS"
     * @returns {string}
     */
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (h < 10) h = '0' + h;
        if (m < 10) m = '0' + m;
        if (s < 10) s = '0' + s;
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + h + seperator2 + m + seperator2 + s;
        return currentdate;
    }
})
