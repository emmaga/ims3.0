define(function (require, exports, module) {
    var CONFIG = require("common/config.js");
    var UTIL = require("common/util.js");
    var INDEX = require("../index.js");
    var MTRU = require("pages/materials/materials_upload.js");
    var templates = require('common/templates');
    var nDisplayItems = 10,
        last;
    var _pageNum = 1;
    var mtrType;
    var t1;
    var languageJSON = CONFIG.languageJson.material;

    exports.init = function () {
        selectLanguage();
        checkCheck();
        bind();
        exports.loadPage(_pageNum, mtrType == undefined ? "Video" : mtrType ); //加载默认页面
    }

    /**
     * 语言切换绑定
     */
    function selectLanguage() {
        $("#material_title").html(languageJSON.resourceTitle);
        $("#mtrVideo").html('<i class="fa fa-video-camera"></i> ' + languageJSON.video);
        $("#mtrVideo").html('<i class="fa fa-image"></i> ' + languageJSON.image);
        $("#mtrVideo").html('<i class="fa fa-music"></i> ' + languageJSON.audio);
        $("#mtrVideo").html('<i class="fa fa-font"></i> ' + languageJSON.text);
        $("#mtrVideo").html('<i class="fa fa-cloud"></i> ' + languageJSON.live);
        $("#mtr_download").html('<a style="color: #333">' + languageJSON.download + '</a>');
        $("#mtr_edit").html(languageJSON.edit);
        $("#mtr_delete").html(languageJSON.delete);
        $("#mtr_submit").html(languageJSON.submitCheck);
        $("#mtr_approve").html(languageJSON.checkPass);
        $("#mtr_reject").html(languageJSON.checkUnpass);
        $("#addResource").html(languageJSON.addResource);
        $("#mtr_upload").html('<i class="fa fa-circle-o text-red">' + languageJSON.upload);
        $("#mtr_addText").html('<i class="fa fa-circle-o text-yellow">' + languageJSON.addText);
        $("#mtr_addLive").html('<i class="fa fa-circle-o text-green">' + languageJSON.addLive);
        $("#mtr_refresh").attr("title", languageJSON.refrash);
        $("#mtr_toBeCheckedDiv button:eq(0)").html(languageJSON.pendingAudit);
        $("#mtr_toBeCheckedDiv button:eq(1)").html(languageJSON.pendingSubmit);
        $("#mtr_toBeCheckedDiv button:eq(2)").html(languageJSON.pass);
        $("#mtr_toBeCheckedDiv button:eq(3)").html(languageJSON.unpass);
    }

    /**
     * 加载页面数据
     * @param pageNum 当前页码
     * @param typeName  类别
     */
    exports.loadPage = function (pageNum, typeName) {
        window.clearInterval(t1);
        // loading
        $("#mtrTable tbody").html('<i class="fa fa-refresh fa-spin" style="display:block; text-align: center; padding:10px;"></i>');
        $("#addtext_box").empty();
        $("#list_box").css("display", "block");
        $("#mtrLisTitle").empty();
        $(".checkbox-toggle").data("clicks", false)
        $(".fa.fa-check-square-o").attr("class", "fa fa-square-o");
        mtrCb();
        if (pageNum != undefined) {
            _pageNum = pageNum;
        }
        $("#mtrChoise li").removeClass('active');
        $("#mtrChoise li").each(function () {
            if ($(this).attr("typename") == typeName) {
                $(this).addClass("active");
            }
        })
        mtrType = typeName;
        switch (typeName) {
            case "Video":
                $("#mtrSearch").attr("placeholder", languageJSON.pl_searchVideo);
                break;
            case "Image":
                $("#mtrSearch").attr("placeholder", languageJSON.pl_searchImage);
                break;
            case "Audio":
                $("#mtrSearch").attr("placeholder", languageJSON.pl_searchAudio);
                break;
            case "WebText":
                $("#mtrSearch").attr("placeholder", languageJSON.pl_searchText);
                break;
            case "Live":
                $("#mtrSearch").attr("placeholder", languageJSON.pl_searchLive);
                break;
            // case "WebUrl":
            //     $("#mtrSearch").attr("placeholder", "搜索在线网页");
            //     break;
            case "Office":
                $("#mtrSearch").attr("placeholder", languageJSON.pl_searchOffice);
                break;
        }
        var status = "";
        if ($('#mtr_toBeCheckedDiv button.btn-primary').length > 0) {
            status = $('#mtr_toBeCheckedDiv button.btn-primary').attr('value');
        }

        var pager = {
            page: String(_pageNum),
            total: '0',
            per_page: nDisplayItems,
            orderby: 'CreateTime',
            sortby: 'DESC',
            keyword: $('#mtrSearch').val(),
            status: status
        };
        var action, search, _url,
            isWebUrl = 0;
        if (mtrType == "Office") {
            action = "getlist";
            search = "status";
            _url = CONFIG.serverRoot + '/backend_mgt/v2/officeaction/';
        }
        // else if (mtrType == "WebUrl") {
        //     action = "GetPage";
        //     isWebUrl = 1;
        //     search = "";
        //     _url = CONFIG.serverRoot + '/backend_mgt/v1/materials';
        // }
        else {
            action = "GetPage";
            search = "";
            _url = CONFIG.serverRoot + '/backend_mgt/v1/materials';
        }
        var data = JSON.stringify({
            action: action,
            project_name: CONFIG.projectName,
            material_type: mtrType,
            search: search,
            Pager: pager,
            isWebUrl: isWebUrl
        });

        UTIL.ajax('post', _url, data, render);

        //定时刷新
        if (mtrType == "Office") {
            t1 = window.setInterval(function() {
                exports.loadPage(_pageNum, mtrType);
            },60000);
        }
    }

    /**
     * 绑定数据回调函数
     * @param json
     */
    function render(json) {
        $("#mtrTable tbody").empty();
        //翻页
        var totalPages = Math.ceil(json.Pager.total / nDisplayItems);
        totalPages = Math.max(totalPages, 1);
        $('#materials-table-pager').jqPaginator({
            totalPages: totalPages,
            visiblePages: CONFIG.pager.visiblePages,
            first: CONFIG.pager.first,
            prev: CONFIG.pager.prev,
            next: CONFIG.pager.next,
            last: CONFIG.pager.last,
            page: CONFIG.pager.page,
            currentPage: Number(json.Pager.page),
            onPageChange: function (num, type) {
                if (type == 'change') {
                    _pageNum = num;
                    $('#materials-table-pager').jqPaginator('destroy');
                    exports.loadPage(num, mtrType);
                }
            }
        });
        //拼接
        if (json.Materials != undefined) {
            var mtrData = json.Materials;
            var check_th = '';
            if (UTIL.getLocalParameter('config_checkSwitch') == '1') {
                check_th = '<th class="mtr_check">' + languageJSON.checkStatus + '</th>';
            }
            $("#mtrTable tbody").append('<tr>' +
                '<th class="mtr_checkbox"></th>' +
                '<th class="mtr_name">' + languageJSON.resourceName + '</th>' +
                check_th +
                '<th class="mtr_size">' + languageJSON.size + '</th>' +
                '<th class="mtr_time">' + languageJSON.duration + '</th>' +
                '<th class="mtr_status">' + languageJSON.transformStatus + '</th>' +
                '<th class="mtr_uploadUser">' + languageJSON.createUser + '</th>' +
                '<th class="mtr_uploadDate create-time">' + languageJSON.createTime + '</th>' +
                '</tr>');
            if (mtrData.length != 0) {
                var material_type = mtrData[0].Type_Name;
                var mtrName_tr;
                for (var x = 0; x < mtrData.length; x++) {
                    var material_type = mtrData[x].Type_Name;
                    if (material_type == "Live" || (material_type == "Office" && mtrData[x].status != 3)) {		//直播无预览效果
                        mtrName_tr = '<td class="mtr_name" title="' + mtrData[x].Name + '">' + mtrData[x].Name + '</td>';
                    } else {
                        if (material_type == "文本") {
                            mtrName_tr = '<td class="mtr_name" title="' + mtrData[x].Name + '"><b><a href="#materials/materials_addText?id=' + mtrData[x].ID + '">' + mtrData[x].Name + '</a></b></td>';
                        } else if (material_type == "Office" && mtrData[x].status == 3) {
                            mtrName_tr = '<td class="mtr_name" title="' + mtrData[x].Name + '"><b><a url="' + mtrData[x].URL + '" target="_blank">' + mtrData[x].Name + '</a></b></td>';
                        } else {
                            var mtrUrl = UTIL.getRealURL(mtrData[x].Download_Auth_Type, mtrData[x].URL);
                            mtrName_tr = '<td class="mtr_name" title="' + mtrData[x].Name + '"><b><a url="' + mtrUrl + '" target="_blank">' + mtrData[x].Name + '</a></b></td>';
                        }
                    }
                    // 审核状态
                    var check_td = '';
                    var check_status = '';
                    if (UTIL.getLocalParameter('config_checkSwitch') == '1') {
                        var status;
                        check_status = "check_status=" + mtrData[x].CheckLevel;
                        switch (mtrData[x].CheckLevel) {
                            case 0:
                                status = languageJSON.pendingSubmit;
                                break;
                            case 1:
                                status = languageJSON.pendingAudit;
                                break;
                            case 2:
                                status = languageJSON.pass;
                                break;
                            case 3:
                                status = languageJSON.unpass;
                                break;
                            default:
                                break;
                        }
                        check_td = '<td class="mtr_check">' + status + '</td>';
                    }

                    var mtr_status;
                    var transform_status = "transform_status=" + mtrData[x].status;
                    if (mtrData[x].status != undefined) {
                        switch (mtrData[x].status) {
                            case 0:
                                mtr_status = languageJSON.tfFaild;
                                break;
                            case 1:
                                mtr_status = languageJSON.pendingTf;
                                break;
                            case 2:
                                mtr_status = languageJSON.transforming;
                                break;
                            case 3:
                                mtr_status = languageJSON.tfSuc;
                                break;
                        }
                    }

                    var mtrtr = '<tr ' + check_status + ' ' + transform_status + ' mtrID="' + mtrData[x].ID + '">' +
                        '<td class="mtr_checkbox"><input type="checkbox" id="mtr_cb" class="mtr_cb" mtrID="' + mtrData[x].ID + '"></td>' +
                        mtrName_tr +
                        check_td +
                        '<td class="mtr_size">' + mtrData[x].Size + '</td>' +
                        '<td class="mtr_time">' + mtrData[x].Duration + '</td>' +
                        '<td class="mtr_status">' + mtr_status + '</td>' +
                        '<td class="mtr_uploadUser">' + mtrData[x].CreateUser + '</td>' +
                        '<td class="mtr_uploadDate create-time">' + mtrData[x].CreateTime + '</td>' +
                        '</tr>';
                    $("#mtrTable tbody").append(mtrtr);
                }
            } else {
                $("#mtrTable tbody").empty();
                $('#materials-table-pager').empty();
                $("#mtrTable tbody").append('<h5 style="text-align:center;color:grey;">（空）</h5>');
            }
        }

        if (material_type == "Video" || material_type == "Audio") {		//视频和音频有时长
            $(".mtr_time").show();
        }
        if (material_type == "Office") {
            $(".mtr_status").show();
        }
        //复选框样式
        $('.mailbox-messages input[type="checkbox"]').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-blue'
        });
        //
        $(".icheckbox_flat-blue").parent().parent().click(function () {
            $(".mailbox-messages input[type='checkbox']").iCheck("uncheck");
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

        //预览操作
        $(".mtr_name a").each(function(){
            $(this).click(function(){
                var z_index = parseInt($(this).parents("tr").index())-1;
                if (mtrData[z_index].Type_Name != "文本") {
                    if(mtrData[z_index].Type_Name == "Video"){
                        var backSuffix = mtrData[z_index].URL.substring(mtrData[z_index].URL.lastIndexOf("."));
                        if(backSuffix != ".mp4" && backSuffix != ".ogg" && backSuffix != ".WebM" && backSuffix != ".MPEG4"){
                            alert(languageJSON.al_videoFormat);
                            return;
                        }
                    } else if(mtrData[z_index].Type_Name == "Audio"){
                        var backSuffix = mtrData[z_index].URL.substring(mtrData[z_index].URL.lastIndexOf("."));
                        if(backSuffix != ".mp3" && backSuffix != ".ogg" && backSuffix != ".wav"){
                            alert(languageJSON.al_audioFormat);
                            return;
                        }
                    }
                    exports.viewData = mtrData[z_index];
                    var page = "resources/pages/materials/materials_preview.html";
                    UTIL.cover.load(page, 3);
                }
            });
        });
    }

    /**
     * 绑定事件
     */
    function bind() {
        // 上传文件按钮点击
        $('#mtr_upload').click(function () {
            $('#file').attr("accept", "image/*, audio/*, video/*, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf");
            $('#file').trigger("click");
            MTRU.uploadType("upload");
        })
        $("#file").unbind("change").change(function () {
            if ($("#page_upload").children().length == 0) {
                INDEX.upl();
            } else {
                $("#page_upload").css("display", "flex");
                $("#upload_box").css("display", "block");
                MTRU.beginUpload();
            }
        });
        // 添加直播按钮点击
        $('#mtr_addLive').click(function () {
            openLive();
        })
        // 添加在线网页按钮点击
        $('#mtr_addURL').click(function () {
            openURl();
        })
        //加载视频列表
        $('#mtrVideo').click(function () {
            exports.loadPage(1, "Video");
        })
        //加载图片列表
        $('#mtrImage').click(function () {
            exports.loadPage(1, "Image");
        })
        //加载音频列表
        $('#mtrAudio').click(function () {
            exports.loadPage(1, "Audio");
        })
        //加载文本列表
        $('#mtrText').click(function () {
            exports.loadPage(1, "WebText");
        })
        //加载直播列表
        $('#mtrLive').click(function () {
            exports.loadPage(1, "Live");
        })
        //加载直播列表
        $('#mtrWebUrl').click(function () {
            exports.loadPage(1, "WebUrl");
        })
        //加载Office列表
        $('#mtrOffice').click(function () {
            exports.loadPage(1, "Office");
        })

        //搜索
        $("#mtrSearch").keyup(function (event) {
            if (event.keyCode == 13) {
                onSearch(event);
            }
        });
        $("#mtrSearch").next().click(onSearch);
        function onSearch(event) {
            last = event.timeStamp;                     //利用event的timeStamp来标记时间，这样每次的keyup事件都会修改last的值，注意last必需为全局变量
            setTimeout(function () {                    //设时延迟0.5s执行
                if (last - event.timeStamp == 0)        //如果时间差为0（也就是你停止输入0.5s之内都没有其它的keyup事件发生）则做你想要做的事
                {
                    exports.loadPage(1, mtrType);
                }
            }, 500);
        }

        //删除和批量删除
        $("#mtr_delete").click(function () {
            var w = false;
            var MaterialIDs = [];
            for (var x = 0; x < $(".mtr_cb").length; x++) {
                if ($(".mtr_cb:eq(" + x + ")").get(0).checked) {
                    w = true;
                    break;
                }
            }
            if (w) {
                if (confirm(languageJSON.cf_delResource)) {
                    var mtrId;
                    for (var x = 0; x < $(".mtr_cb").length; x++) {
                        if ($(".mtr_cb:eq(" + x + ")").get(0).checked) {
                            mtrId = $(".mtr_cb:eq(" + x + ")").attr("mtrID")
                            MaterialIDs.push(Number(mtrId));
                        }
                    }
                    if ($(".mtr_cb:checked").length == $(".mtr_cb").length || _pageNum != 1) {
                        _pageNum--;
                    }
                    if (mtrType == "WebText") {
                        var data = JSON.stringify({
                            Action: 'DeleteMulti',
                            Project: CONFIG.projectName,
                            MaterialIDs: MaterialIDs
                        });
                        var _url = CONFIG.serverRoot + '/backend_mgt/v1/webmaterials';
                    } else {
                        var data = JSON.stringify({
                            action: 'DeleteMulti',
                            project_name: CONFIG.projectName,
                            MaterialIDs: MaterialIDs,
                            type_name: mtrType
                        });
                        var _url = CONFIG.serverRoot + '/backend_mgt/v1/materials';
                    }
                    UTIL.ajax('post', _url, data, function () {
                        exports.loadPage(_pageNum, mtrType); //刷新页面
                    });
                }
            }
        });

        //刷新按钮
        $("#mtr_refresh").click(function () {
            exports.loadPage(1, mtrType);
        })

        //编辑
        $("#mtr_edit").click(function () {
            if (mtrType == "WebText") {			//编辑文本
                $("#mtr_edit").attr("edit_type", "文本");
                var mtrHref;
                for (var x = 0; x < $(".mtr_cb").length; x++) {
                    if ($(".mtr_cb:eq(" + x + ")").get(0).checked) {
                        mtrHref = $(".mtr_cb:eq(" + x + ")").parents("td").next().find("a").attr("href");


                    }
                }
                location.hash = mtrHref;
            } else if (mtrType == "Live") {	    //编辑直播
                $("#mtr_edit").attr("edit_type", "直播");
                openLive();
            } else {
                var page = "resources/pages/materials/materials_edit.html";
                UTIL.cover.load(page);
            }
        })

        //全选和全不选
        $(".checkbox-toggle").click(function () {
            var clicks = $(this).data('clicks');

            if (clicks) {
                //Uncheck all checkboxes
                $(".mailbox-messages input[type='checkbox']").iCheck("uncheck");
                $(".fa", this).removeClass("fa-check-square-o").addClass('fa-square-o');
            } else {
                //Check all checkboxes
                $(".mailbox-messages input[type='checkbox']").iCheck("check");
                $(".fa", this).removeClass("fa-square-o").addClass('fa-check-square-o');
            }
            $(this).data("clicks", !clicks);
            mtrCb();
        });

        //审核状态筛选
        // 筛选终端
        if (UTIL.getLocalParameter('config_checkSwitch') == '1') {
            $('#mtr_toBeCheckedDiv button').each(function (i, e) {
                $(this).click(function () {
                    $(this).siblings().removeClass('btn-primary');
                    $(this).siblings().addClass('btn-defalut');

                    var isFocus = $(this).hasClass('btn-primary');
                    $(this).removeClass(isFocus ? 'btn-primary' : 'btn-defalut');
                    $(this).addClass(isFocus ? 'btn-defalut' : 'btn-primary');
                    exports.loadPage(1, mtrType);
                })
            })

            //获取已选资源ids
            function getSourceIds() {
                var ids = new Array();
                $("#mtrTable input[type='checkBox']:checked").each(function (i, e) {
                    ids.push(Number($(e).parent().parent().parent().attr('mtrid')));
                })
                return ids;
            }

            function loadPage() {
                var pageNum = $("#materials-table-pager li.active").find("a").text();
                exports.loadPage(pageNum, mtrType);
            }

            //提交审核
            $('#mtr_submit').click(function () {
                if (!$('#mtr_submit').attr('disabled')) {
                    var data = {
                        "project_name": CONFIG.projectName,
                        "action": "submitToCheck",
                        "material_type": mtrType,
                        "MaterialIDs": getSourceIds()
                    }
                    UTIL.ajax(
                        'POST',
                        CONFIG.serverRoot + '/backend_mgt/v1/materials',
                        JSON.stringify(data),
                        function (data) {
                            if (data.rescode === '200') {
                                alert(languageJSON.al_submitted);
                                loadPage();
                            } else {
                                alert(languageJSON.al_submitFaild);
                            }
                        }
                    )
                }
            })

            //审核通过
            $('#mtr_approve').click(function () {
                if (!$('#mtr_approve').attr('disabled')) {
                    var data = {
                        "project_name": CONFIG.projectName,
                        "action": "checkPass",
                        "material_type": mtrType,
                        "MaterialIDs": getSourceIds()
                    }
                    UTIL.ajax(
                        'POST',
                        CONFIG.serverRoot + '/backend_mgt/v1/materials',
                        JSON.stringify(data),
                        function (data) {
                            if (data.rescode === '200') {
                                alert(languageJSON.al_audited);
                                loadPage();
                            } else {
                                alert(languageJSON.al_auditFaild);
                            }
                        }
                    )
                }
            })

            //审核不通过
            $('#mtr_reject').click(function () {
                if (!$('#mtr_reject').attr('disabled')) {
                    var data = {
                        "project_name": CONFIG.projectName,
                        "action": "checkFailed",
                        "material_type": mtrType,
                        "MaterialIDs": getSourceIds()
                    }
                    UTIL.ajax(
                        'POST',
                        CONFIG.serverRoot + '/backend_mgt/v1/materials',
                        JSON.stringify(data),
                        function (data) {
                            if (data.rescode === '200') {
                                alert(languageJSON.al_audited);
                                loadPage();
                            } else {
                                alert(languageJSON.al_auditFaild);
                            }
                        }
                    )
                }
            })
        }
    }

    /**
     * 列表分类点击事件
     * @param obj
     */
    function mtrChoise(obj) {
        $("#mtrChoise li").removeClass('active');
        obj.parent().attr("class", "active");
    }

    /**
     * 校验删除按钮
     */
    function checkDelBtns() {
        $("#mtrTable input[type='checkBox']:checked").each(function (i, e) {
            if ($(e).parent().parent().parent().find('td.mtr_uploadUser').html() != CONFIG.userName) {
                $('#mtr_delete').attr('disabled', true);
                return false;
            }
        })
    }

    /**
     * 校验批量操作的审核功能
     */
    function checkCheckBtns() {
        if ($("#mtrTable input[type='checkBox']:checked").length === 0) {
            $('#mtr_submit').attr('disabled', true);
            $('#mtr_approve').attr('disabled', true);
            $('#mtr_reject').attr('disabled', true);
        } else {

            $("#mtrTable input[type='checkBox']:checked").each(function (i, e) {

                if ($('#mtr_submit').attr('disabled') && $('#mtr_approve').attr('disabled') && $('#mtr_reject').attr('disabled')) {
                    return false;
                }

                //待提交
                if ($(e).parent().parent().parent().attr('check_status') == '0') {
                    $('#mtr_approve').attr('disabled', true);
                    $('#mtr_reject').attr('disabled', true);
                }
                //待审核
                else if ($(e).parent().parent().parent().attr('check_status') == '1') {
                    $('#mtr_submit').attr('disabled', true);
                }
                //已通过和未通过
                else {
                    $('#mtr_submit').attr('disabled', true);
                    $('#mtr_approve').attr('disabled', true);
                    $('#mtr_reject').attr('disabled', true);
                }

                if ($(e).parents("tr").attr('transform_status') != '3' && mtrType == "Office") {
                    $('#mtr_approve').attr('disabled', true);
                    $('#mtr_reject').attr('disabled', true);
                }

            })
        }

    }

    /**
     * 校验复选框勾选的个数
     */
    function mtrCb() {
        $("#mtr_delete").removeAttr("disabled");
        var Ck = $(".icheckbox_flat-blue.checked").length;	//当前选中复选框个数
        var Uck = $(".icheckbox_flat-blue").length;			//复选框总个数
        if (Ck == 1) {
            var dlurl = $(".icheckbox_flat-blue.checked").parent().next().find("a").attr("url");
            var dlname = $(".icheckbox_flat-blue.checked").parent().next().find("a").text();
            if (mtrType != "WebText" && mtrType != "Live") {
                $("#mtr_download").removeAttr("disabled");
            }

            $("#mtr_edit").removeAttr("disabled");
            $("#mtr_download").find("a").attr("href", dlurl);           //下载
            $("#mtr_download").find("a").attr("download", dlname);
        } else {
            if (Ck == 0) {
                $("#mtr_delete").attr("disabled", true);
            }
            $("#mtr_download").attr("disabled", true);
            $("#mtr_edit").attr("disabled", true);
            $("#mtr_download").parent().removeAttr("href");
            $("#mtr_download").parent().removeAttr("download");
        }

        if (UTIL.getLocalParameter('config_checkSwitch') == '1') {
            $('#mtr_submit').attr('disabled', false);
            $('#mtr_approve').attr('disabled', false);
            $('#mtr_reject').attr('disabled', false);
            checkCheckBtns();
            if (UTIL.getLocalParameter('config_canCheck') == '0') {
                checkDelBtns();
            }
        }

        //控制全选按钮全选或者不全选状态
        if (Uck != 0) {
            if (Ck == Uck) {
                $(".fa.fa-square-o").attr("class", "fa fa-check-square-o");
                $(".checkbox-toggle").data('clicks', true);
            } else {
                $(".fa.fa-check-square-o").attr("class", "fa fa-square-o");
                $(".checkbox-toggle").data('clicks', false);
            }
        }
    }

    /**
     * 打开直播编辑窗口
     */
    function openLive() {
        var page = "resources/pages/materials/materials_addLive.html";
        UTIL.cover.load(page);
    }

    /**
     * 打开在线网页编辑窗口
     */
    function openURl() {
        var page = "resources/pages/materials/materials_addURL.html";
        UTIL.cover.load(page);
    }

    function checkCheck() {
        if (UTIL.getLocalParameter('config_checkSwitch') == '0') {
            $('#mtr_submit').css('display', 'none');
            $('#mtr_approve').css('display', 'none');
            $('#mtr_reject').css('display', 'none');
            $('#mtr_toBeCheckedDiv').css('display', 'none');
        }
        else if (UTIL.getLocalParameter('config_canCheck') == 0) {
            $('#mtr_approve').css('display', 'none');
            $('#mtr_reject').css('display', 'none');
        }
    }

    /**
     * 返回当前页码及类型
     * @returns {{pageNum: number, mtrType: *}}
     */
    exports.mtrList = function () {
        var listData = {
            pageNum: _pageNum,
            mtrType: mtrType
        }
        return listData;
    }
})
