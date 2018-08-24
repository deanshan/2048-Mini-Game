/**
 * 2048 beta 1.1
 * 
 */

function Game(container,rows,cols){
	// 容器（包含头部标题和棋盘）
	this.container = $(container);

	// 单个宽高
	this.oneSize = 100;
	
	// 单个间距
	this.spaceBetween = 20;

	// 单元格个数
	this.rows = rows || 4;
	this.cols = cols || 4;
	
	this.init(this.rows,this.cols);
}

Game.prototype={
	constructor:Game,
	init:function(rows,cols){
		rows = this.rows = rows || this.rows;
		cols = this.cols = cols || this.cols;

		this.container.empty();
		// 头部
		this.head = $('<h2>当前分数</h2>')
	    // 棋盘
	    this.board = $('<div class="board"></div>')

		// 头部样式
		this.head.css({
			textAlign:'center',
			height:'35px',
			lineHeight:'35px',
			margin:0,
			borderTopLeftRadius:'10px',
			borderTopRightRadius:'10px',
			background:'#e4abab'
		});
		
		// 棋盘宽度
		this.width = this.oneSize * cols + this.spaceBetween * (cols+1);
		this.container.width(this.width);
		this.board.width(this.width);
		// 棋盘高度
		this.height = this.oneSize * rows + this.spaceBetween * (rows + 1);
		this.board.height(this.height);
		// 容器高度要加上头部
		this.container.height(this.height + 35);
        
        // 容器样式 
		this.container.css({
			margin:'auto'
		})
		// 棋盘样式
		this.board.css({
			background:'#d5daac',
			borderBottomLeftRadius:'10px',
			borderBottomRightRadius:'10px',
			position:'relative'
		})

		// 插入到容器
		this.container.append(this.head,this.board);

		// 分数显示界面
		this.grade =  $('<span class="grade">0</span>').appendTo(this.head);
		this.grade.gradeData = 0;

		// 生成背景格子
		this.createBg();

 		// 初始化游戏数据
		this.initialData();

		this.gameover = false;

		this.createNumCell(2);
		this.createNumCell(2);
	},
	initialData:function(){
		// 根据行列初始化数据
		// data中存储所有单元格的数字信息
		// noNumber中存储没有数字（值为0）的位置信息
		// cellData中存储含有数字的jQuery元素及位置信息
		this.data = [];
		this.noNumber = [];
		this.cellData = [];
		for(var i = 0 ; i < this.rows;i++){
			this.data[i] = [];
			for(var j = 0 ; j < this.cols;j++){
				this.data[i][j] = {num:0};
				this.noNumber.push({row:i,col:j})
			}
		}
	},
	/**
	 * 更新data数据中的
	 * @param  {array} options 形式为：[{row:1,col:1,value:{num:4,cell:cell_object}}]
	 * @param {boolean} updateNoNumber 是否更新noNumber数据
	 */
	updateData:function(options,updateNoNumber){
		var game = this;
		jQuery.each(options,function(index){
			//更新data中的值
			game.data[this.row][this.col] = this.value;

			if(updateNoNumber !== false){
				if(this.value.num == 0){
					//增加noNumber中的数据
					game.noNumber.push({row:this.row,col:this.col})
				}else{
					// 删除noNumber中的数据
					var tmp = this;
					jQuery.each(game.noNumber,function(index){
						if (this.row == tmp.row && this.col == tmp.col) {
							game.noNumber.splice(index,1)
							return false;
						}
					})
				}
			}	
		})
	},
	// 遍历二维数组data，reverse为true表示反向遍历
	// callback 中this指向当前数据，可自动获取二维下标和data
	eachData:function(callback,reverse){
		var data = this.data;
		if(!reverse){ // 正向遍历
			for(var row = 0;row < this.rows ;row++){
				for(var col = 0;col < this.cols ;col++){
					if(callback.call(data[row][col],row,col,data) === false){
						return false;
					};
				}
			}
		}else{ // 反向遍历
			for(var row = this.rows-1;row >= 0 ;row--){
				for(var col = this.cols -1;col >=0 ;col--){
					if(!callback.call(data[row][col],row,col,data) === false){
						return false;
					};
				}
			}
		}
	},
	// 渲染背景
	createBg:function(){
		for(var i = 0 ; i < this.rows;i++){
			for(var j = 0 ; j < this.cols;j++){
				// 生成背景单元格
				new Game.StaticCell({
					size:this.oneSize,
					// 计算偏移量
					offsetX:j * (this.oneSize) + (j+1)*this.spaceBetween,
					offsetY:i * (this.oneSize) + (i+1)*this.spaceBetween,
				})
				// 获取jquery对象并插入棋盘
				.getCellElement().appendTo(this.board);
			}
		}
	},
	
	// 创建数字单元格
	createNumCell:function(num){
		if(this.noNumber.length == 0){
			return false;
		}
		// 根据现有空位，随机选择一个空位生成
		var index = Game.rand(0,this.noNumber.length);
		// 没有传参时生成随机数字 ，2的概率为60%
		num = num || (Game.rand(0,10) < 6 ? 2 : 4);
		
		col = this.noNumber[index].col;
		row = this.noNumber[index].row;

		// 生成单元格对象，并将元素插入board
		var cell = new Game.NumberCell({
			num:num,
			size:this.oneSize,
			offsetX:col * (this.oneSize) + (col+1)*this.spaceBetween,
			offsetY:row * (this.oneSize) + (row+1)*this.spaceBetween,
		}).appendToBoard(this.board);

		this.noNumber.splice(index,1);
		// 更新数据，第二个参数false取消遍历更新noNumber提高性能
		this.updateData([{
			row : row,
			col : col,
			value : {	
						num:num,
						cell:cell
					}
			}],false);
		
		// 打印数据 
		if(this.displayData){
			console.clear();
			console.log('2048 by yemao');
			jQuery.each(this.data,function(){
				var row = '';
				jQuery.each(this,function(){
					row += this.num + ' ';
				})
				console.log(row)
			})
		}
		// 检测是否游戏结束
		if(this.isGameOver()){
			if(this.event.ongameover){
				this.event.ongameover()
			}else{
				alert('game over');
			}
		}
	},
	/**
	 * 移动cell到指定位置
	 * @param  {int} srcrow 原始位置的数据
	 * @param  {int} srccol 原始位置的数据
	 * @param  {int} 	row     [行位置]
	 * @param  {int} 	col     [列位置]
	 * @param  {string} type    [移动方位] 'left' 'right' 'up' 'down'
	 */
	cellMove:function(srcrow,srccol,row,col,type){
		// 没有移动则不进行后续操作
		if(srcrow == row && srccol == col){
			return false;
		}
		var cell; // 需要保存的cell
		var srcCell = cell = this.data[srcrow][srccol].cell;// 原位置的cell对象 
		var game = this;
		var deleteSrc = false; // 是否删除原cell
		var num = this.data[srcrow][srccol].num;

		if(this.data[row][col].num){ // 目标点不为0
			if(this.data[srcrow][srccol].num != this.data[row][col].num || this.data[row][col].protect){
				// 目标位置有元素时，将选择一个合理的目标位置
				
				switch(type){
					case 'left':col = col + 1;break;
						
					case 'right':col = col - 1;break;

					case 'up' : row = row + 1;break;

					case 'down' : row = row -1;break;
				}
			}else{
				// 合并单元格
				num = num*2;
				// 分数更新
				this.grade.gradeData += num;
				this.grade.text(this.grade.gradeData);
				// 单元格显示更新
				srcCell.setTextAndColor(num).getCellElement().css('zIndex',120);
				this.data[row][col].cell.setTextAndColor(num);

				// 设置移动动画完成后，删除原始元素
				var deleteSrc = true;
				// 将需要保存的cell变成目标位置的cell ，因为源cell会被移除
				cell = this.data[row][col].cell;
			}
		}
		// 没有移动则不进行后续操作
		if(srcrow == row && srccol == col){
			return false;
		}
		// 更新数据
		game.updateData([{
							row:row,
							col:col,
							value:{num:num,cell:cell}
						},{
							row:srcrow,
							col:srccol,
							value:{num:0}
						}]);
		
		if(deleteSrc){
			// 在单次事件中，对合并的元素进行保护，防止多重合并
			this.data[row][col].protect = true;
		}

		var x = col * (this.oneSize) + (col+1)*this.spaceBetween;
		var y = row * (this.oneSize) + (row+1)*this.spaceBetween;
		
		game.event.moving = true; // 正在移动

		srcCell.getCellElement().animate({left:x,top:y},200,function(){
			if(deleteSrc){
				
				srcCell.remove(); // 移除源元素
				deleteSrc = false; 
			}

			game.event.moving = false; // 还原moving
			
			if(!game.event.createdCell){ //本次事件未产生新元素则产生新元素
				game.createNumCell();
				game.event.createdCell = true;
			}
			
		})	
	},
	/**
	 * 触发移动事件
	 * @param  {string} type 移动方向
	 * event包含以下可用属性
	 * event.createdCell boolean 表示本次移动事件是否产生过新元素
	 * event.moving boolean 表示元素是否正在移动
	 * event.ongameover function 游戏结束时的事件
	 */
	event:function(type){
		// gameover 是否游戏结束
		// event.moving 是否正在运动
		if(this.gameover || this.event.moving){
			return false;
		}
		var game = this;
		this.event.createdCell = false; // 本次事件是否产生了新元素
		switch (type){
			case 'left':this.eachData(function(row,col,data){
							if(this.num != 0){
								for(var count = col -1;count >=0;count--){// 向移动方向的前方遍历
									if(data[row][count].num !=0 || count == 0){ // 直到遇到元素或到达边界
										game.cellMove(row,col,row,count,type);break; // 移动元素
									}
								}
							}
						});break;
			case 'right':this.eachData(function(row,col,data){
							if(this.num != 0){
								for(var count = col+1 ;count <= game.cols - 1;count++){
									if(data[row][count].num !=0 || count == game.cols-1){ 
										game.cellMove(row,col,row,count,type);break; 
									}
								}
							}
						},true);break;
			case 'up':  this.eachData(function(row,col,data){
							if(this.num != 0){
								for(var count = row -1;count >=0;count--){
									if(data[count][col].num !=0 || count == 0){ 
										game.cellMove(row,col,count,col,type);break;
									}
								}
							}
						});break;
			case 'down':this.eachData(function(row,col,data){
							if(this.num != 0){
								for(var count = row+1 ;count <= game.rows - 1;count++){// 向移动方向的前方遍历
									if(data[count][col].num !=0 || count == game.rows-1){ // 直到遇到元素或到达边界
										game.cellMove(row,col,count,col,type);break; // 移动元素
									}
								}
							}
						},true);break;
		}
		// 取消保护
		this.eachData(function(){
			delete this.protect;
		})
	},
	isGameOver:function(){
		// 没有空位
		var game = this;
		if(this.noNumber.length <= 0){
			game.gameover = true;
			this.eachData(function(row,col,data){
				// 检测四周是否有相同的数
				if((this.num == (data[row][col-1]?data[row][col-1].num : undefined ))||
					(this.num == (data[row][col+1]?data[row][col+1].num :undefined))||
					(this.num == (data[row-1]?data[row-1][col].num : undefined)) || 
					(this.num == (data[row+1]?data[row+1][col].num : undefined)))
				{
					game.gameover = false;
					return false;
				}
			});
		}
		return game.gameover;
	},

	// 控制台打印模式 
	consolePrint : function(show){
		if(show === true){
			this.displayData = true;
		}else if(show === false){
			this.displayData = false;
		}
	}
}

/**
 * 根据最大值和最小值生成随机数
 * @param  {int} min 最小值
 * @param  {int} max 最大值
 * @return {int}     数值范围：min<=随机数<max
 */
Game.rand = function(min,max){
	return parseInt(Math.random()*(max-min)+min);
}

/**
 * 静止的单元格（背景）
 * @param  {[Object]} options 配置参数 size:大小，offsetX:横向偏移量，offsetY:纵向偏移量
 */
Game.StaticCell = function(options){

	// 获取重要属性
	this.size = options.size;
	this.offsetX = options.offsetX;
	this.offsetY = options.offsetY;

	this.init();
}

Game.StaticCell.prototype = {
	constructor:Game.StaticCell,
	// 初始化
	init:function(){
		// 生成单个单元
		// 设置样式
		this.cell = $('<div></div>')
		.css({
			borderRadius : '5px',
			background : '#a2a28f',
			width:this.size, // 没有单位
			height:this.size, // 没有单位
			position:'absolute',
			left:this.offsetX,
			top:this.offsetY
		})
	},
	getCellElement:function(){
		return this.cell;
	}
}

/**
 * 生成带数字的单元格
 * @param {Object} options 配置参数 size:大小，offsetX:横向偏移量，offsetY:纵向偏移量
 */
Game.NumberCell = function(options){

	// 获取重要属性
	this.size = options.size; // 大小
	this.offsetX = options.offsetX; // 横向偏移
	this.offsetY = options.offsetY; // 纵向偏移
	
	this.num = options.num // 数字

	this.init();
}

Game.NumberCell.prototype = {
	constructor:Game.NumberCell,
	// 初始化
	init:function(){
		// 生成单个单元
		// 设置样式
		this.element = $('<div></div>')
		.css({
			fontWeight:'bold',
			borderRadius : '5px',
			width:this.size, // 没有单位
			height:this.size, // 没有单位
			lineHeight: this.size+'px',
			textAlign:'center',
			position:'absolute',
			zIndex:10,
			left:this.offsetX,
			top:this.offsetY,
			display:'none'
		})

		this.setTextAndColor(this.num);
	},
	// 插入到board
	appendToBoard:function(board){
		this.element.appendTo(board).show(220);
		return this;
	},
	// 移除元素
	remove:function(){
		this.element.remove();
		return this;
	},
	getCellElement:function(){
		return this.element;
	},
	setTextAndColor:function(num){
		this.element.text(this.num=num);
		switch(num){
			case 2:this.element.css({'background':'#eee',fontSize:'60px'});break;
			case 4:this.element.css({'background':'#ffe7ae',fontSize:'60px'});break;
			case 8:this.element.css({'background':'#ffbf90',fontSize:'55px',color:'white'});break;
			case 16:this.element.css({'background':'#ffc31f',fontSize:'55px',color:'white'});break;
			case 32:this.element.css({'background':'#fd5656',fontSize:'55px',color:'white'});break;
			case 64:this.element.css({'background':'#ff6c00',fontSize:'55px',color:'white'});break;
			case 128:this.element.css({'background':'#6c99ff',fontSize:'45px',color:'white'});break;
			case 256:this.element.css({'background':'#437bfd',fontSize:'45px',color:'white'});break;
			case 512:this.element.css({'background':'#d800ff',fontSize:'45px',color:'white'});break;
			case 1024:this.element.css({'background':'#ff0075',fontSize:'35px',color:'white'});break;
			case 2048:this.element.css({'background':'#fd0808',fontSize:'35px',color:'white'});break;
			case 4096:this.element.css({'background':'#c9ff2a',fontSize:'35px',color:'white'});break;
			case 8192:this.element.css({'background':'#00ff16',fontSize:'35px',color:'white'});break;
		}
		return this;
	}
}