/**
 * myjQuery beta 1.0
 */

(function(global,factory){
	factory(global);
})(window,function(window){



	// 构造函数
	var jQuery = function (selector){

		return new jQuery.fn.init(selector);

	}

	jQuery.fn = jQuery.prototype = {

		jquery : 1.0,
		
		constructor : jQuery,

		toArray:function(){

			return [].slice.call(this,0,this.length)

		},

		get : function(num){
			if(num === 0){

				return this[0]

			}else if(num < 0){

				return this[this.length + num]

			}else{
				return [].slice.call(this,0,this.length)
			}
		},

		each : function(callback){

			return jQuery.each(this,callback)

		},

		slice : function(){

			return jQuery([].slice.call(this,arguments))
		},

		first : function(){
			return this.eq(0)
		},

		last : function(){
			return this.eq(-1)
		},

		eq:function(i){
			if(i !== undefined){

				return jQuery(this[i > 0 ? i : this.length + i]);
			}

			return jQuery();
		},

	}

	// 添加属性方法 
	jQuery.extend = jQuery.fn.extend = function(options){
		for(var i in options){

			this[i] = options[i]
		
		}
	}



	// 匹配新建元素选择器
	var newDOMREG = /^<\S+[\S\s]*>$/, 

		// 真正的构造函数
		// 
		init = jQuery.fn.init = function(selector){

		if(typeof selector == 'string' && selector.length > 0){

			if(!selector){
				return this;
			}

			// 如果是新建DOM元素
			if(selector.match(newDOMREG)){ 

				var tmp = document.createElement('div');
				tmp.innerHTML = selector;
				var elem = tmp.childNodes

			}else{
				// 选择元素
				elem =  document.querySelectorAll(selector);
			}
			// 将DOM元素包装成jQuery对象
			[].push.apply(this,elem)

		}else if(jQuery.isDOM(selector)){
			// 如果是原生DOM
			[].push.call(this,selector)
		
		}else if(jQuery.isArrayLike(selector)){
			// jquery对象
			[].push.apply(this,selector)


		// 如果参数是函数
		}else if(jQuery.isFunction(selector)){

			(document.readyState == 'complete') ? selector() :
			document.addEventListener('readystatechange', function(){
				if(document.readyState == 'complete'){
					selector()
				}
			})
		}
	}
	
	init.prototype = jQuery.fn;

	jQuery.extend({

		// 是否是元素DOM元素
		isDOM : function(object){
			return object.nodeType;
		},

		// 是否是类数组
		isArrayLike:function(object){
			if(object && object['length'] && object.hasOwnProperty(object.length-1)){
				return true;
			}
		},

		// 判断是否是 function 
		isFunction : function(object){
			return object instanceof Function
		},

		// 遍历对象
		each : function(obj,callback){

			// 如果是类数组对象
			if(jQuery.isArrayLike(obj)){

				for(var i = 0 ; i < obj.length ; i++ ){

					// callback 中this指向当前元素
					if(callback.call(obj[i],i,obj[i]) === false){
						// 如果callback return false 终止遍历 
						break;
					}
				}

			// 如果是常规对象 
			}else{
				for(var i in obj){
					if(callback.call(obj[i], i, obj[i])) break;
				}
			}

			return obj;
		},

		// 获取最终样式
		getStyle : function(elem,styleName){
			if(window.getComputedStyle){
				return window.getComputedStyle(elem)[styleName]
			}else if(elem.currentStyle){
				return elem.currentStyle[styleName]
			}
		},

		// 设置或返回最终尺寸
		/*scale : function(elems,type,value){

				
				if(value !== undefined){

					// 以字符串形式设置值
 					if(typeof value == 'string' || typeof value == 'number'){
 						// 增加默认单位 px
						if(!(value.toString().match(/px$/))){
							value += 'px';
						}

						jQuery.each(elems,function(){
							this.style[type] = value;
						})

					// 函数返回形式设置值
 					}else if(jQuery.isFunction(value)){
 						jQuery.each(elems,function(index){

 							// 获取当前值 并 去除单位 px
 							var currentValue = parseInt(jQuery.getStyle(this,type))

 							// 获取回调函数返回值
 							var returnedValue = value.call(this,index,currentValue)

 							// 设置默认单位
 							if(typeof returnedValue == 'number' || !returnedValue.match(/px$/)){
								returnedValue += 'px';
							}
							// 设置样式
							this.style[type] = returnedValue;

 						})

 					}
				

				return this;

			// 返回实际值
			}else{

				return scale = jQuery.getStyle(elems[0],type);

			}
		},*/

		// 
		scale : function(elems,type,value){
		
			if(value !== undefined){

				// 以字符串形式设置值
				 if(typeof value == 'string' || typeof value == 'number'){
					 // 增加默认单位 px
					if(!(value.toString().match(/px$/))){
						value += 'px';
					}

					jQuery.each(elems,function(){
						this.style[type] = value;
					})

				// 函数返回形式设置值
				 }else if(jQuery.isFunction(value)){
					 jQuery.each(elems,function(index){

						 // 获取当前值 并 去除单位 px
						 var currentValue = parseInt(jQuery.getStyle(this,type))

						 // 获取回调函数返回值
						 var returnedValue = value.call(this,index,currentValue)

						 // 设置默认单位
						 if(typeof returnedValue == 'number' || !returnedValue.match(/px$/)){
							returnedValue += 'px';
						}
						// 设置样式
						this.style[type] = returnedValue;

					 })

				 }
			

			return this;

		// 返回实际值
		}else{

			return scale = jQuery.getStyle(elems[0],type);

		}
	},


		// jquery动画
		// 只处理和尺寸有关的样式 如width top 
		animate : function(target,style,speed,easing,beforeAnimate,callback){
		
			
			// 总完成步数
			var totalSteps = speed / 20;
			
			jQuery.each(target,function(){
				if(beforeAnimate){
					if(beforeAnimate.call(this) === false){
						return true;
					};
				}
				var elem = this;
					
				jQuery.each(style, function (i) {

					var final = parseInt(this);

					var start = parseInt(jQuery.getStyle(elem, i))

					var step = (final - start)/totalSteps;

					var count = 1;
					
					$(elem).css(i,start + step*count)
					var intv = setInterval(function(){
						count++;
						$(elem).css(i,start + step*count)
						
						// 运动到终点 清除定时器
						if(count == totalSteps){
							clearInterval(intv);

							// 执行回调函数
							if(callback){
								callback.call(elem)
							}
						}
					},20)
				})
			})
		}
	})


	// 事件处理
	jQuery.extend({
		on : function(elem,type,callback){

			// 保持事件函数
			if(!elem.jQueryEventFunction){
				elem.jQueryEventFunction = {}
			}
			if(!elem.jQueryEventFunction[type]){
				elem.jQueryEventFunction[type] = []
			}
			[].push.call(elem.jQueryEventFunction[type],callback)

			// 绑定事件 兼容IE
			if(elem.addEventListener){
				elem.addEventListener(type,callback)
			}else if(elem.attachEvent){
				elem.attachEvent(on+'type',callback)
			}
		},

		off : function(elem,type,fn){

			if(!elem.jQueryEventFunction){
				return false
			}

			if(elem.removeEventListener){
				// 移除全部事件
				if(type == undefined && fn == undefined){
					
					jQuery.each(elem.jQueryEventFunction,function(index){
						
						jQuery.each(this,function(){
							
							elem.removeEventListener(index,this)
							
						})
						
					})
					elem.jQueryEventFunction = null;
				
				// 移除指定类型事件	
				}else if(fn == undefined){
					jQuery.each(elem.jQueryEventFunction[type],function(index){
						
						elem.removeEventListener(type,this)
						
						delete elem.jQueryEventFunction[type]
						
					})

				// 移除指定类型事件的指定函数	
				}else{
					elem.removeEventListener(type,fn)
					if(elem.jQueryEventFunction[type]){
						jQuery.each(elem.jQueryEventFunction[type], function (index) {
							if (this == fn) {
								elem.jQueryEventFunction[type].splice(index, 1);
							}
						})
					}
					
				}

			// 兼容IE	
			}else if(elem.detachEvent){
				if(type == undefined && fn == undefined){
					
					jQuery.each(elem.jQueryEventFunction,function(index){
						
						jQuery.each(this,function(){
							
							elem.detachEvent('on' + index,this)
							
						})
						
					})
					elem.jQueryEventFunction = null;
				
				// 移除指定类型事件	
				}else if(fn == undefined){
					jQuery.each(elem.jQueryEventFunction[type],function(index){
					
						elem.detachEvent('on' + type,this)

						delete elem.jQueryEventFunction[type]
						
					})

				// 移除指定类型事件的指定函数	
				}else{
					elem.detachEvent('on' + type,fn)
					jQuery.each(elem.jQueryEventFunction[type],function(index){
						
						if(this == fn){
							
							elem.jQueryEventFunction[type].splice(index,1);
						}
					})
				}
			}
		}
	})

	jQuery.fn.extend({

		// html方法
		html : function(){
			var args = arguments;
			if(arguments.length == 0){
				return this[0].innerHTML;
			}else{
				var elem = this;
				jQuery.each(elem,function(){

					this.innerHTML = args[0]
				})
				return this;
			}
		},
		text : function(){
			var args = arguments;
			if(arguments.length == 0){
				return this.innerText;
			}else{
				var elem = this;
				jQuery.each(elem,function(){

					this.innerText = args[0]

				})
				
				return this;
			}
		},
		val : function(){
			var args = arguments;
			if(arguments.length == 0){
				return this.value;
			}else{
				var elem = this;
				jQuery.each(elem,function(){

					this.value = args[0]

				})
				
				return this;
			}
		},

		// css
		css : function(){

				var args = arguments;
				var elems = this;

				// 宽度和高度有单位 需要特殊处理
				var speclia = ['width','height','top','left','bottom','right'];

				if(args.length == 1){

					// 返回元素集合中第一个的样式
					if(typeof args[0] == 'string'){
						
						return jQuery.getStyle(this[0],args[0])
					
					// 参数是对象形式
					}else if(typeof args[0] == 'object'){

						jQuery.each(args[0],function(index,value){

							if(speclia.includes(index)){

								jQuery.scale(elems,index,value)
								
							}else{
								jQuery.each(elems,function(){
									// 设置样式
									this.style[index] = value
								})
							}
						})
					}

				// 两个参数的形式
				}else if(args.length == 2){
					
					// 如果是尺寸样式
					if(speclia.includes(args[0])){

						jQuery.scale(this,args[0],args[1])

					// 其他样式
					}else if(jQuery.isFunction(args[1])){
						jQuery.each(this,function(index){

							var currentValue = jQuery.getStyle(this,args[0]);

							this.style[args[0]] = args[1].call(this,index,currentValue)
						})
					}else{
						jQuery.each(this,function(index){

							this.style[args[0]] = args[1]
						})
					}

				}

				return this;

		},

		// 尺寸
		width : function(){
			if(arguments.length == 0){

				// 返回第一个元素的宽度
				return parseInt(jQuery.scale(this,'width',undefined))
			}else{
				
				// 设置集合中所有元素的宽度
				jQuery.scale(this,'width',arguments[0])

				return this
			}
		},
		height : function(){
			if(arguments.length == 0){

				// 返回第一个元素的宽度
				return parseInt(jQuery.scale(this,'height',undefined))
			}else{
				
				// 设置集合中所有元素的宽度
				jQuery.scale(this,'height',arguments[0])

				return this
			}
		},

		// DOM操作
		append : function(){
			var source = arguments;
			for(var i in source){
				jQuery.each(this, function (index) {
					var dst = this;

					// 如果参数是字符串
					if (typeof source[i] == 'string') {
						this.innerHTML += source;
					}

					// 如果参数是原生DOM元素
					else if (jQuery.isDOM(source[i])) {
						
						// 第一个元素会插入元素本身
						// 其他元素会插入source的克隆
						if (index == 0) {
							this.appendChild(source[i])
						} else {

							this.appendChild(source[i].cloneNode(true))
						}
					}

					// 如果是类数组对象
					else if (jQuery.isArrayLike(source[i])) {

						jQuery.each(source[i], function () {
							if (index == 0) {
								dst.appendChild(this)
							} else {
								dst.appendChild(this.cloneNode(true))
							}
						})
					}
					// 如果元素被插入到DOM节点中时是隐藏的 需要记录元素的尺寸初始值
					if (jQuery.getStyle(this, 'display') == 'none') {
						var display = this.jQueryDisplay = 'block';
						// 行级元素无法改变宽高 需要装换成inline-block
						if (display == 'inline') {
							this.jQueryDisplay = this.style.display = 'inline-block';
						}

						this.jQueryWidth = jQuery.getStyle(this, 'width');
						this.jQueryHeight = jQuery.getStyle(this, 'height');

						this.jQueryOverflow = this.style.overflow;
						this.style.overflow = 'hidden';
					}

				})
			}
			
			return this;
		},

		appendTo : function(target){
			var source = this;

			if(typeof target == 'string'){
				target = jQuery(target);
			}

			var result = jQuery(source)

			jQuery.each(target,function(index){
				var dst = this;

				jQuery.each(source,function(){
					
					if(index == 0){

						dst.appendChild(this)

					}else{

						// 将克隆的元素插入并保存
						var tmp = this.cloneNode(true);
						
						dst.appendChild(tmp);

						[].push.call(result,tmp)
					}

					// 如果元素被插入到DOM节点中时是隐藏的 需要记录元素的尺寸初始值
					if (jQuery.getStyle(this, 'display') == 'none') {
						var display = this.jQueryDisplay = 'block';
						// 行级元素无法改变宽高 需要装换成inline-block
						if (display == 'inline') {
							this.jQueryDisplay = this.style.display = 'inline-block';
						}

						this.jQueryWidth = jQuery.getStyle(this, 'width');
						this.jQueryHeight = jQuery.getStyle(this, 'height');

						this.jQueryOverflow = this.style.overflow;
						this.style.overflow = 'hidden';
					}
					
				})

			})
			return result;
		},

		// 清空元素
		empty : function(){
			jQuery.each(this,function(){
				this.innerHTML = '';
			})

			return this;
		},

		// 移除元素
		remove : function(){
			jQuery.each(this,function(){
				// 如果元素含有父元素
				var parent = this.parentNode;
				if(parent){
					parent.removeChild(this)
				}
			})

			return this;
		},

		// 隐藏元素
		hide : function(){

			// 保存原始值
			jQuery.each(this,function(){
				// 如果已经被隐藏，不进行操作
				if(jQuery.getStyle(this,'display') == 'none'){
					this.jQueryDoNotAnimate = true; 
					return true;
				}
				var display = this.jQueryDisplay = jQuery.getStyle(this,'display');
				// 行级元素无法改变宽高 需要装换成inline-block
				if(display == 'inline'){
					this.jQueryDisplay = this.style.display = 'inline-block';
				}

				this.jQueryWidth = jQuery.getStyle(this,'width');
				this.jQueryHeight = jQuery.getStyle(this,'height');
							
				this.jQueryOverflow = this.style.overflow;
				this.style.overflow = 'hidden';

			})
			// 不进行动画
			if(arguments.length == 0){
				jQuery.each(this,function(){
					this.style['display'] = 'none';
					this.style.overflow = this.jQueryOverflow; 
				})
			
			// 进行动画
			}else if(typeof arguments[0] == 'number' || typeof arguments[0] == 'string'){
				var duration = arguments[0];
				jQuery.animate(this,{width:0,height:0},duration,'easing',function(){
					
					if(this.jQueryDoNotAnimate){
						return false;
					}
				},function(){
					// 彻底隐藏元素
					this.style.display = 'none';
					this.style['width'] = '';
					this.style['height'] = '';
					this.style['overflow'] = this.jQueryOverflow;
				});
			}

			return this;
		},

		// 显示元素
		show : function(){
			// 不进行动画
			if(arguments.length == 0){
				jQuery.each(this,function(){
					this.style['display'] = this.jQueryDisplay;
					this.style['width'] = this.jQueryWidth;
					this.style['height'] = this.jQueryHeight;
					this.style.overflow = this.jQueryOverflow;
				})

			// 进行动画 
			}else if(typeof arguments[0] == 'number' || typeof arguments[0] == 'string'){
				
				// 动画时间
				var duration = arguments[0]

				jQuery.each(this,function(){

					jQuery.animate($(this),{width:this.jQueryWidth,height:this.jQueryHeight},duration,'easing',function(){
						this.style.overflow = 'hidden';
						
						// 还原属性
						this.style.display = this.jQueryDisplay;
						// 预设宽高
						this.style.width = 0;
						this.style.height = 0;
						
					},function(){
						
						this.style.overflow = this.jQueryOverflow;
						delete this.jQueryDoNotAnimate;
					});
				})

			}

			return this;
		},

		// 动画
		animate : function(){
			var args = arguments;
			if(args.length == 1){
				jQuery.animate(this,args[0],400,'easing',null,null)
			}else if(args.length >= 2){
				for(var i in args){
					if(jQuery.isFunction(args[i])){
						var callback = args[i]
					}else if(!isNaN(parseInt(args[i]))){
						var duration = args[i]
					}else if(typeof args[i] == 'string'){
						var easing = args[i]
					}
				}
				jQuery.animate(this,args[0],duration || 400,easing || 'easing',null ,callback);

			}

			return this;
		}
	})

	// 事件

	jQuery.fn.extend({

		// 绑定事件
		on : function(type,callback){
			jQuery.each(this,function(){

				jQuery.on(this,type,callback)
			})

			return this;
		},

		off : function(type,fn){
			jQuery.each(this,function(){
				
				jQuery.off(this,type,fn);

			})
			return this;
		}
	})

	// 绑定到window全局对象上
	return window.$ = window.jQuery = jQuery;
})