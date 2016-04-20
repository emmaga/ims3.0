define(function(require, exports, module) {

  var TREE = require("common/treetree.js");
  var CONFIG = require("common/config.js");
  var UTIL = require("common/util.js");
  var _timerLoadTermList;
  var _pagesize = CONFIG.pager.pageSize;
  var _pageNO = 1;
  var _checkList = [];

	exports.init = function(){
    initTree();
    initEvent();
	}

  function setBatchBtn(){
    if(_checkList.length === 0){
      $('#term_batch_move').addClass('disabled');
      $('#term_batch_delete').addClass('disabled');
      $('#term_batch_start').addClass('disabled');
      $('#term_batch_stop').addClass('disabled');
    }
    else{
      $('#term_batch_move').removeClass('disabled');
      $('#term_batch_delete').removeClass('disabled');

      if(_checkList.hasOffline){
        $('#term_batch_start').addClass('disabled');
        $('#term_batch_stop').addClass('disabled');
      }else{
        $('#term_batch_start').removeClass('disabled');
        $('#term_batch_stop').removeClass('disabled');
      }
    }
  }

  function initEvent(){

    // serach
    $('#term_search').click(function(){
      loadTermList(_pageNO);
    })
    .change(function(){
      loadTermList(_pageNO);
    })

    // 筛选终端
    $('#term-status button').each(function(i,e){
      $(this).click(function(){
        $(this).siblings().removeClass('btn-primary');
        $(this).siblings().addClass('btn-defalut');

        var isFocus = $(this).hasClass('btn-primary');
        $(this).removeClass(isFocus?'btn-primary':'btn-defalut');
        $(this).addClass(isFocus?'btn-defalut':'btn-primary');
        loadTermList(_pageNO);
      })
    })

    // 全选，不全选
    $('#term-list-select-all').click(function(){
      var check = $('#term-list-select-all>i').hasClass('fa-square-o');
      $('#term-list-select-all>i').toggleClass('fa-square-o', !check);
      $('#term-list-select-all>i').toggleClass('fa-check-square-o', check);
      $('#term_list tr input[type="checkbox"]').iCheck((check?'check':'uncheck'));
    })
    setBatchBtn();

    // 批量删除
    $('#term_batch_delete').click(function(){

      if($(this).hasClass('disabled')){
        return;
      }

      if(confirm('确定删除所选终端？')){
        var data = {
        "project_name": CONFIG.projectName,
        "action": "deleteTerms",
        "termList":_checkList
        }

        UTIL.ajax(
          'POST',
          CONFIG.serverRoot + '/backend_mgt/v2/term', 
          JSON.stringify(data),
          function(data){
            if(data.rescode === '200'){
              loadTermList();
            }else{
              alert('删除终端失败'+data.errInfo);
            }
          }
        )
      }

    })

    // 批量唤醒
    $('#term_batch_start').click(function(){
      
      if($(this).hasClass('disabled')){
        return;
      }

      if(confirm('确定唤醒所选终端？')){
        var data = {
        "project_name": CONFIG.projectName,
        "action": "termPowerOnMulti",
        "termList":_checkList
        }

        UTIL.ajax(
          'POST',
          CONFIG.serverRoot + '/backend_mgt/v2/term', 
          JSON.stringify(data),
          function(data){
            if(data.rescode === '200'){
              loadTermList();
            }else{
              alert('唤醒终端失败'+data.errInfo);
            }
          }
        )
      }

    })

    // 批量休眠
    $('#term_batch_stop').click(function(){

      if($(this).hasClass('disabled')){
        return;
      }

      if(confirm('确定休眠所选终端？')){
        var data = {
        "project_name": CONFIG.projectName,
        "action": "termPowerOffMulti",
        "termList":_checkList
        }

        UTIL.ajax(
          'POST',
          CONFIG.serverRoot + '/backend_mgt/v2/term', 
          JSON.stringify(data),
          function(data){
            if(data.rescode === '200'){
              loadTermList();
            }else{
              alert('休眠终端失败'+data.errInfo);
            }
          }
        )
      }

    })

    // 批量移动

  }

  _checkList.add = function(id, online){
    _checkList.push({'termID': id, 'online': online});
  }

  _checkList.delete = function(id){
    for(var i = 0; i < _checkList.length; i++){
      if(_checkList[i].termID === id){
        _checkList.splice(i,1);
        return;
      }
    }
  }

  _checkList.hasOffline = function(){
    var boolean = false;
    for(var i = 0; i < _checkList.length; i++){
      if(_checkList[i].online === '0'){
        boolean = true;
        break;
      }
    }
    return boolean;
  }

  function onCheckBoxChange(){
    
    // 设置是否全选
    var ifSelAll = ($('#term_list tr').length === _checkList.length);
    $('#term-list-select-all>i').toggleClass('fa-square-o', !ifSelAll);
    $('#term-list-select-all>i').toggleClass('fa-check-square-o', ifSelAll);
  }

  function loadTermList(pageNum){

    if(pageNum !== undefined){
      _pageNO = pageNum;
    }else{
      _pageNO = 1;
    }
    
    if(_timerLoadTermList){
      clearInterval(_timerLoadTermList);
    }

    if($('#termclass-tree').length > 0){
      _timerLoadTermList = setInterval(function(){loadTermList()}, CONFIG.termListLoadInterval);
    }
    else{
      return;
    }
    
    // loadlist start
    var searchKeyword = $.trim($('#term_search').val());
    
    var status = 0;
    var bp = $('#term_status').find('.btn-primary');
    if(bp.length > 0){
      status = bp.attr('code');
    }

    var termClassId = $('#termclass-tree').find('.focus').attr('node-id');
    var status = '';
    if($('#term-status button.btn-primary').length > 0){
      status = $('#term-status button.btn-primary').attr('value');
    }

    var data = {
      "project_name": CONFIG.projectName,
      "action": "getTermList",
      "categoryID": termClassId,
      "Pager":{
        "total": -1,
        "per_page": _pagesize,
        "page": _pageNO,
        "orderby": "",
        "sortby": "",
        "keyword": searchKeyword,
        "status": status
      }
    }

    UTIL.ajax(
      'POST', 
      CONFIG.serverRoot + '/backend_mgt/v2/termcategory',
      JSON.stringify(data), 
      function(data){
        if(data.rescode != 200){
          alert('获取终端列表出错：'+rescode.errInfo);
          return;
        }
        // set pagebar

        try{
          $('#term-table-pager').jqPaginator('destroy');
        }catch(error){
          console.error("$('#term-table-pager').jqPaginator 未创建");
        }
        
        var totalCounts = Math.max(data.totalStatistic.totalTermNum, 1);

        $('#term-table-pager').jqPaginator({
          totalCounts: totalCounts,
          pageSize: _pagesize,
          visiblePages: CONFIG.pager.visiblePages,
          first: CONFIG.pager.first,
          prev: CONFIG.pager.prev,
          next: CONFIG.pager.next,
          last: CONFIG.pager.last,
          page: CONFIG.pager.page,
          currentPage: _pageNO,
          onPageChange: function (num, type) {
            _pageNO = num;
            if (type === 'change') {
             loadTermList(_pageNO);
            }
          }
        });

        // term_download_status
        $('#term_download_status').html(' 下载（' + data.totalStatistic.downloadFileNum + '/' + data.totalStatistic.downloadAllFileNum + '） 预下载（' + data.totalStatistic.preDownloadFileNum + '/' + data.totalStatistic.preDownloadAllFileNum + '）');
      
        // term_online_status
        $('#term_online_1').html(data.totalStatistic.onlineTermNum + '/' + data.totalStatistic.totalTermNum);

        // term_list
        var tl = data.termList.terms;
        $('#term_list').empty();
        for(var i = 0; i < tl.length; i++){

          var downloadStatus = JSON.parse(tl[i].CurrentChannelDownloadInfo);
          var downloadNum = downloadStatus.DownloadFiles +'/' + downloadStatus.AllFiles;
          downloadStatus = downloadStatus.DownloadFiles/downloadStatus.AllFiles*100;

          var preloadStatus = JSON.parse(tl[i].PreDownloadInfo);
          var preloadNum = preloadStatus.DownloadFiles +'/' + preloadStatus.AllFiles;
          preloadStatus = preloadStatus.DownloadFiles/preloadStatus.AllFiles*100;

          var status = ((tl[i].Online === 0)?'离线':((tl[i].Status === 'Running')?'运行':'休眠'));

          $('#term_list').append('' +
            '<tr tid="'+ tl[i].ID +'" online="' + tl[i].Online + '">' +
              '<td><input type="checkbox"></td>' +
              '<td>'+ tl[i].Name +'<br />'+ tl[i].Description +'<br />'+ status +'</td>' +
              '<td>当前频道：'+ ((tl[i].CurrentPlayInfo==='')?'':JSON.parse(tl[i].CurrentPlayInfo).ChannelName) +'<br />当前节目：'+ ((tl[i].CurrentPlayInfo==='')?'':JSON.parse(tl[i].CurrentPlayInfo).ProgramName) +'<br />当前视频：'+ ((tl[i].CurrentPlayInfo==='')?'':JSON.parse(tl[i].CurrentPlayInfo).ProgramPlayInfo) +
              '</td>' +
              '<td>' +
                '<span style="font-size: 12px; color: grey;">下载：'+downloadNum+'</span>' +
                '<div style="height: 10px; margin-top: 0px;" class="progress progress-striped">' +
                   '<div class="progress-bar progress-bar-success" role="progressbar" ' +
                      'aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" ' +
                      'style="width: '+ downloadStatus +'%;">' +
                      '<span class="sr-only">'+ downloadStatus +'% 完成（成功）</span>' +
                   '</div>' +
                '</div>' +
                '<span style="font-size: 12px; color: grey;">预下载：'+preloadNum+'</span>' +
                '<div style="height: 10px; margin-top: 0px;" class="progress progress-striped">' +
                   '<div class="progress-bar progress-bar-success" role="progressbar" ' +
                      'aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" ' +
                      'style="width: '+ preloadStatus +'%;">' +
                      '<span class="sr-only">'+ preloadStatus +'% 完成（成功）</span>' +
                   '</div>' +
                '</div>' +
              '</td>' +
              '<td>' +
              'ip：'+ tl[i].IP +'<br />' +
              '版本：' + tl[i].TermVersion + 
              '</td>' +
              '<td><a class="pointer">编辑</a> <br/><a class="pointer">截屏</a></td>' +
            '</tr>'
          )
        }

        // 复选
        // 复选全选按钮初始化
        var hasCheck = $('#term-list-select-all>i').hasClass('fa-check-square-o');
        if(hasCheck){
          $('#term-list-select-all>i').toggleClass('fa-square-o', true);
          $('#term-list-select-all>i').toggleClass('fa-check-square-o', false);
        }

        // 清空已选list
        _checkList.length = 0;

        // 列表选择按钮添加icheck，单击
        $('#term_list tr input[type="checkbox"]').iCheck({
          checkboxClass: 'icheckbox_flat-blue',
          radioClass: 'iradio_flat-blue'
        })
        .on('ifChecked', function(event){
           _checkList.add($(this).parent().parent().parent().attr('tid'),$(this).parent().parent().parent().attr('online'));
           onCheckBoxChange();
           setBatchBtn();
        })
        .on('ifUnchecked', function(event){
           _checkList.delete($(this).parent().parent().parent().attr('tid'));
           onCheckBoxChange();
           setBatchBtn();
        });

        // 整行点击
        $('#term_list tr').each(function(i,e){
          $(e).click(function(){
            var input = $(e).find('input[type="checkbox"]');
            var check = !input.parent().hasClass('checked');
            input.iCheck((check?'check':'uncheck'));
          })
        })

        // 设置批量按钮
        setBatchBtn();

      }
    )
  }

  function initTree(){

    var dataParameter = {
      "project_name": CONFIG.projectName,
      "action": "getTree"
    };

    UTIL.ajax(
      'POST', 
      CONFIG.serverRoot+'/backend_mgt/v2/termcategory', 
      JSON.stringify(dataParameter),
      function(data){
        if(data.rescode === '200'){
          data = data.TermTree.children;
          var tree = {domId: 'termclass-tree', canCheck: false};
          tree = TREE.new(tree);
          tree.createTree($('#'+tree.domId), data);
          // alert('loadtermlist: '+$('#termclass-tree').find('.focus').attr('node-id'))
          loadTermList();

          // 终端分类列表各项点击
          $('#termclass-tree li > a').each(function(i, e){
            $(this).click(function(e){
              tree.setFocus($(this).parent());
               // alert('loadtermlist: '+$(this).parent().attr('node-id'))
               loadTermList();
            })
          })

          // 添加终端分类按钮点击
          $('#tct_add').click(function(){
            var li = $('#termclass-tree').find('.focus');

            // 如果正在有添加中，不响应
            if(li.children('a').find('div input').length > 0){
              return;
            }

            var newNode = [
              {
                "children": [], 
                "id": "", 
                "name": "未命名终端分类"
              }
            ]
            // 如果分类有子分类
            var ul;
            if(li.hasClass('treeview')){
              ul = li.children('ul');
            }
            // 如果分类下无子分类
            else{
              tree.addParentCss(li);
              ul = $('<ul class="tree-menu-2"></ul>');
              li.append(ul);
            }
            tree.createNode(ul, newNode);
            var dom = ul.children('li:nth('+(ul.children().length-1)+')');
            tree.openNode(li);
            tree.setFocus(dom);
            // alert('loadtermlist: '+dom.attr('node-id'));
            loadTermList();
            tree.showEditInput(dom,function(input){
              input.blur(function(e){
                addTermClassName(input);
              })
            });
            
            function addTermClassName(input){
              var change = $.trim(input.val());
              var a = input.parent().parent();
              var t = a.children('span');
              
              // 终端组分类名称为空时设置名称为：未命名终端分类
              if(change === ''){
                change = '未命名终端分类';
              }

              // 提交终端组分类名称新建
              var parentId = input.parent().parent().parent().parent().parent().attr('node-id');
              var data = {
                "project_name": CONFIG.projectName,
                "action": "addCategory",
                "parentCategoryID": Number(parentId),
                "name": change
              }

              UTIL.ajax(
                'POST', 
                CONFIG.serverRoot + '/backend_mgt/v2/termcategory',
                JSON.stringify(data), 
                function(data){
                  var a = $('#termclass-tree').find('.focus').children('a');
                  var input = a.children('div').children('input');
                  var t = a.children('span');
                  var li = a.parent();
                  if(data.rescode == '200'){
                    t.html(' ' + $.trim(input.val()));
                    t.css('display','inline-block');
                    input.parent().remove();
                    li.attr('node-id',data.categoryID);
                    a.click(function(e){
                      tree.setFocus(li);
                      // alert('loadtermlist: '+li.attr('node-id'));
                      loadTermList();
                    })
                  }else{
                    alert('新建终端分类失败');
                    input.focus();
                  }
                }
              );
            }

          })

          // 删除终端分类按钮点击
          $('#tct_delete').click(function(){
            var focus = $('#termclass-tree').find('.focus');

            // 不能删除“全部”
            if(focus.attr('node-id') == 1){
              alert('不能删除根目录');
            }else{
              if(confirm('确定删除终端分类"' + $.trim(focus.children('a').find('span').html()) + '"? （该分类下的终端不会被删除）')){
                if(confirm('请再次确认，确定删除终端分类"' + $.trim(focus.children('a').find('span').html()) + '"? （该分类下的终端不会被删除）')){

                  var nodeId = focus.attr('node-id');
                  var data = {
                    "project_name": CONFIG.projectName,
                    "action": "delCategory",
                    "categoryID": Number(nodeId)
                  }

                  UTIL.ajax(
                    'POST', 
                    CONFIG.serverRoot + '/backend_mgt/v2/termcategory',
                    JSON.stringify(data), 
                    function(data){
                      if(data.rescode == '200'){
                        var focus = $('#termclass-tree').find('.focus');
                        tree.setFocus(focus.parent().parent());
                        // alert('loadtermlist: '+focus.parent().parent().attr('node-id'));
                        loadTermList();
                        focus.remove();
                      }else{
                        alert('删除终端分类失败');
                        input.focus();
                      }
                    }
                  );
                }
              }
            }

          })

          // 编辑终端分类按钮点击
          $('#tct_edit').click(function(){
            var p = $('#termclass-tree').find('.focus');

            tree.showEditInput(p,function(input){
              input.blur(function(e){
                editTermClassName(input);
              })
            });

            function editTermClassName(input){
              var change = $.trim(input.val());
              var a = input.parent().parent();
              var t = a.children('span');
              
              // 终端组分类名称为空时恢复原名称，不提交修改
              if(change === ''){
                t.css('display','inline-block');
                input.parent().remove();
              }

              // 终端组分类名称未改变时不提交修改
              else if( change ===  $.trim(t.html()) ){
                t.css('display','inline-block');
                input.parent().remove();
              }

              // 提交终端组分类名称修改
              else{
                var nodeId = a.parent().attr('node-id');
                var data = {
                  "project_name": CONFIG.projectName,
                  "action": "changeCategoryName",
                  "categoryID": nodeId,
                  "newName": change
                }

                UTIL.ajax(
                  'POST', 
                  CONFIG.serverRoot + '/backend_mgt/v2/termcategory',
                  JSON.stringify(data), 
                  function(data){
                    var a = $('#termclass-tree').find('.focus').children('a');
                    var input = a.children('div').children('input');
                    var t = a.children('span');
                    if(data.rescode == '200'){
                      t.html(' ' + $.trim(input.val()));
                      t.css('display','inline-block');
                      input.parent().remove();
                    }else{
                      alert('编辑终端分类失败');
                      input.focus();
                    }
                  }
                );
              }
            }

          })

        }else{
          alert('获取终端分类失败');
        }
      }
    );

    /*var tree = {domId: 'termclass-tree', canCheck: false};
    tree = TREE.new(tree);
    var data = [
        {
            "children": [
                {
                    "id": 2, 
                    "name": "未分类终端",
                    "children": []
                }, 
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "id": 316, 
                                    "name": "自定义分类1-1-1",
                                    "children": []
                                }
                            ], 
                            "id": 313, 
                            "name": "自定义分类1-1"
                        }, 
                        {
                            "id": 314, 
                            "name": "自定义分类1-2",
                            "children": []
                        }
                    ], 
                    "id": 310, 
                    "name": "自定义分类1"
                }, 
                {
                    "children": [
                        {
                            "id": 315, 
                            "name": "自定义分类2-1",
                            "children": []
                        }
                    ], 
                    "id": 311, 
                    "name": "自定义分类2"
                }, 
                {
                    "id": 312, 
                    "name": "自定义分类3",
                    "children": []
                }
            ], 
            "id": 1, 
            "name": "全部终端"
        },
        {
            "children": [
                {
                    "id": 2, 
                    "name": "未分类终端",
                    "children": []
                }, 
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "id": 316, 
                                    "name": "自定义分类1-1-1",
                                    "children": []
                                }
                            ], 
                            "id": 313, 
                            "name": "自定义分类1-1"
                        }, 
                        {
                            "id": 314, 
                            "name": "自定义分类1-2",
                            "children": []
                        }
                    ], 
                    "id": 310, 
                    "name": "自定义分类1"
                }, 
                {
                    "children": [
                        {
                            "id": 315, 
                            "name": "自定义分类2-1",
                            "children": []
                        }
                    ], 
                    "id": 311, 
                    "name": "自定义分类2"
                }, 
                {
                    "id": 312, 
                    "name": "自定义分类3",
                    "children": []
                }
            ], 
            "id": 1, 
            "name": "全部终端"
        }
    ]
    tree.createTree($('#'+tree.domId), data);
    */

    // $('.treetree li .fa-angle-left').each(function(i, e){
    //   $(this).click(function(e){
    //     alert(1)
    //   })
    // })

    // $('.treetree li').each(function(i, e){
    //   $(this).click(function(e){
    //     e.preventDefault();
    //     e.stopPropagation();
    //   })
    // })
  }

});