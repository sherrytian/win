/**
 * @fileOverview: popup.js 多功能弹出框
 * @author: tianxiaoyun 
 * @contact: email misstian2008@163.com || 358926040
 * @version: 1.2
 * @date: 2015-12-28
 * @external: [jquery.js]
 */
zgxcw = window.zgxcw || {};
zgxcw.popup = (function(){
	var defaults = {
		'elementId':'id',//必需
        'drag':true,//是否可拖拽
        'mask':true,//是否显示遮罩层
		'width':'auto',
		'height':'auto',
        'title':'',//标题
        'content':'',//内容
        'model':'alert',//必需 模式{alert：弹出框；confirm:确认弹出框; win:窗口模式}
        'closeBtn':false,//可选 需要关闭按钮时设置为true, 默认false
        'confirmFn':null,//确认函数
        'cancelFn':null//取消函数
	}
	/**
	 * [style 渲染样式]
	 * @param  {[string]} id     [id name]
	 * @param  {[number]} width  [width value]
	 * @param  {[number]} height [height value]
	 */
	function style(id,width,height){
        var winObj = $('#'+id);
        var winW = (width == 'auto') ? 300 : width,
            winH = (height == 'auto') ? parseInt(winObj.outerHeight()) : height;
            winObj.css({'position':'fixed','top':'50%','left':'50%','z-index':'1001','width':winW,'height':winH,'margin-top':'-'+winH/2+'px','margin-left':'-'+winW/2+'px'});
	}
	/**
	 * [displayShow 显示弹框]
	 * @param  {[jq object]} $obj [弹框元素]
	 */
	function displayShow($obj,flag){
		$obj.show();
		if(flag){
			mask().show();
		}
	}
	/**
	 * [displayNone 不显示弹框]
	 * @param  {[jq object]} $obj [弹框元素]
	 * @param  {[string]} type [弹框类型]
	 */
	function displayNone($obj,type){
		if(type === 'win'){
			$obj.hide();
		}else{
			$obj.remove();
		}
		mask().hide();
	}
	/**
	 * [渲染组件]
	 * @return {[jq object]} [返回弹框元素]
	 */
	function renderUI(opt,type){
		
		if($('#'+opt.elementId).length < 1){
			var html = '<div class="popup" id="'+opt.elementId+'">';

				if(opt.closeBtn){
					html += '<div class="popup-head">'+opt.title+'<span class="btn-close">&times;</span></div>';
				}else{
					html += '<div class="popup-head">'+opt.title+'</div>';
				}
				
				html += '<div class="popup-body">'+opt.content+'</div>';
				html += '<div class="popup-footer">';
				html += '<span class="btn btn-confirm">确定</span>';
				if(type !== 'alert'){
					html += '<span class="btn btn-cancel">取消</span>';
				}
				html += '</div></div>';

				$('body').append(html);
		}
		// 渲染样式
		style(opt.elementId,opt.width,opt.height);
		bindEvent(opt.elementId,opt);
		return $('#'+opt.elementId);
	}
	/**
	 * [bindEvent 绑定事件]
	 * @param  {[string]} id  [弹框 id]
	 * @param  {[object]} opt [参数]
	 */
	function bindEvent(id,opt){
		var confirmBtn = $('#'+id + ' .btn-confirm');
		var cancelBtn = $('#'+id+' .btn-cancel');
		var closeBtn = $('#'+id+' .btn-close');
		confirmBtn.on('click',function(){
			if($.isFunction(opt.confirmFn)){
				opt.confirmFn();
			}
			if(opt.model !== 'win'){
				displayNone($('#'+id),opt.model,opt.mask);
			}
		});
		cancelBtn.on('click',function(){
			if($.isFunction(opt.cancelFn)){
				opt.cancelFn();
			}
			displayNone($('#'+id),opt.model,opt.mask);
		});
		closeBtn.on('click',function(){
			if($.isFunction(opt.cancelFn)){
				opt.cancelFn();
			}
			displayNone($('#'+id),opt.model,opt.mask);
		});
		if(opt.drag){
			drag($('#'+id),$('#'+id+' .popup-head'));
		}
	}
	/**
	 * [mask 渲染遮罩层]
	 * @return {[jq object]} [遮罩层元素]
	 */
	function mask(){
		if($('.layer').length < 1){
			var layer = '<div class="layer"></div>';
			$('body').append(layer);
		}
		return $('.layer').eq(0);
	}
	function drag($obj,$target){
		var disX=0;//鼠标位置距离元素左边的距离
	    var disY=0;//鼠标位置距离元素上边的距离
	    var flag = false;
    	// 按下鼠标
    	$target.on('mousedown',function(e){
    		//记录初始值
    		var oEvent = e || window.event;
    			disX = oEvent.clientX-$obj.get(0).offsetLeft;
    			disY=oEvent.clientY-$obj.get(0).offsetTop;
    		flag = true;
    	});	
    	// 移动鼠标
    	$(document).on('mousemove',function(e){
    		var oEvent = e || window.event;
    		var oTarget = oEvent.srcElement ? oEvent.srcElement : oEvent.target;
    		var oLeft = oEvent.clientX - disX;
    		var oTop = oEvent.clientY - disY;
    		if(oLeft < 0){
    			oLeft = 0;
    		}
    		if(oLeft > parseInt($(window).width()) - parseInt($obj.outerWidth())){
    			oLeft = parseInt($(window).width()) - parseInt($obj.outerWidth());
    		}
    		if(oTop < 0){
    			oTop = 0;
    		}
    		if(oTop > parseInt($(window).height()) - parseInt($obj.outerHeight())){
    			oTop = parseInt($(window).height()) - parseInt($obj.outerHeight());
    		}
    		if(flag){
    			$obj.css({'left':oLeft+'px','top':oTop+'px','margin-left':'0px','margin-top':'0px'});
    		}
    		

    	});
    	// 松开鼠标
    	$target.on('mouseup',function(){
    		flag = false;
    	});
    	$(document).on('mouseup',function(){
    		flag = false;
    	});
	}
	// Public members
	return {
		win:function(opt){
			var options = $.extend({}, defaults, opt);
			// 渲染组件
			return renderUI(options,'win');
		},
		alert:function(opt){
			var options = $.extend({}, defaults, opt);
			// 渲染组件
			var $obj = renderUI(options,'alert');
			displayShow($obj,options.mask);
		},
		confirm:function(opt){
			var options = $.extend({}, defaults, opt);
			// 渲染组件
			var $obj = renderUI(options,'confirm');
			displayShow($obj,options.mask);
		},
		mask:function(){
			return mask();
		}
	}
})();