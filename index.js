//bug:1、没有限制红旗总数，可以无限插旗；
//2、可以只点击右键，看剩余数来找地雷 
//3、页面高度是定死的，不能自适应占满全屏，影响体验；
var surplus=document.getElementsByClassName("surplus")[0];
var checker=document.getElementsByClassName("checkerboard")[0];
var begin=document.getElementsByClassName("btn")[0];
var monk=document.getElementsByClassName("monk")[0];
var bbtn=document.getElementsByClassName("bbtn")[0];
var arr=new Array();
var number=10;
var flag=true;
function create(num){
	var main=document.getElementsByClassName("main")[0];
	if(!main){
		main=document.getElementsByClassName("checkerboard")[0];
		var main2=document.createElement("div");
		main2.classList.add('main');
		main.appendChild(main2);
		main=main2;		
	}
	for(var j=0;j<num;j++){
		var ul=document.createElement("ul");
		for(var i=0;i<num;i++){
			var li=document.createElement("li");
			ul.appendChild(li);
			li.classList.add(i+"-"+j);
		}
		main.appendChild(ul);
	}
	//生成一个数组，这个数组里存放num组不相同的随机数
	var arr=sheng(num);
	console.log(arr);
	for(var i=0;i<num;i++){
		var hang=arr.arr1[i];
		var lie=arr.arr2[i];
		// hang=quchong().hang;
		// lie=quchong().lie;
		var boom=document.createElement('div');
		boom.classList.add("bs");
		main.children[hang].children[lie].classList.add('boom');
		main.children[hang].children[lie].appendChild(boom);
		if(main.children[hang].children[lie].children.length>1){
			main.children[hang].children[lie].removeChild(main.children[hang].children[lie].children[1]);		
		}
	}
	main.addEventListener("click", leftclick, true);//鼠标左击事件
	main.oncontextmenu=function(e){//取消鼠标默认右击事件
		e.preventDefault();
	}
	main.onmouseup=function(oEvent){//绑定自定义鼠标右击事件
		var target=oEvent.target;
		if(oEvent.button==2){
			//如果右击的没被点击，没有旗就加旗的类，如果有就移出旗的类
			if(target&&!target.classList.contains('click')&&!target.classList.contains('rfl')){
				target.classList.add('rfl');
				//如果有旗子的类还有雷的话就让剩余的雷减一
				if(target.classList.contains('boom')){
					  number--;
					  if(number==0){
					  	alert("恭喜！,游戏结束");
					  	over();
					  }
					  surplus.innerHTML="当前剩余雷数："+number;
				}
			}else if(target.classList.contains('rfl')){
				target.classList.remove('rfl');
				if(target.classList.contains('boom')){
					number++;
				}
			}
		}
	}
	//checker.appendChild(main);
	surplus.innerHTML="当前剩余雷数："+number;
	flag=false;
}
function disroy(){
	var main=document.getElementsByClassName("main")[0];
	if(checker.children[1].classList.contains("main")){
		checker.removeChild(main);
	}
	number=10;
}
function sheng(numb){//为了防止有重复的雷发生需要单独生成没有重复的数组，列是一组行是一组，最后返回一个对象
	var arr1=new Array();
	var arr2=new Array();
	while(arr1.length<numb){
		var randh=Math.floor(Math.random()*10);
		if(arr1.indexOf(randh)==-1){
			arr1.push(randh);
		}
	}
	while(arr2.length<numb){
		var randl=Math.floor(Math.random()*10);
		if(arr2.indexOf(randl)==-1){
			arr2.push(randl);
		}
	}	
	return {arr1,arr2};	
}
begin.onmousedown=function(){
	create(10);
	this.style.display="none";	
}
//target
function leftclick(e){
	var target=e.target||e;
	if(target&&!target.classList.contains('click')&&!target.classList.contains('boom')){
		//没有雷的情况
		var s=target.className.split('-');
		var n=0;
		var posX=parseInt(s[0]);
		var posY=parseInt(s[1]);
		console.log(posX,posY);
		for(var i=posX-1;i<=posX+1;i++)
			for(var j=posY-1;j<=posY+1;j++){
		 		var around=document.getElementsByClassName(i+'-'+j)[0];
		 		if(around&&around.classList.contains('boom')){
		 			n++;
		 		}
		 	}
		target.classList.add("click");
		target.innerHTML=n;
		if(n==0){
	 		//扩散算法
	 		//递归左击，递归：1.找规律，2.找出口
	 		for(var i=posX-1;i<=posX+1;i++)
				for(var j=posY-1;j<=posY+1;j++){
					var around=document.getElementsByClassName(i+'-'+j)[0];
					if(around&&around.length!=0){
						if(!around.classList.contains('click')){
							leftclick(around);  
						}
					}
	 			}
			}
//i行,j列  i-1,j-1  i-1,j  i-1,j+1  i,j+1  i+1,j+1  i+1,j  i+1,j-1   i,j-1 
	}else if(target&&target.classList.contains('boom')){
		var boom=document.getElementsByClassName('bs');
		for(var i=0;i<boom.length;i++){
			boom[i].style.display = 'block';
		}
		alert("你输了，游戏结束！");
		over();
	}
}
function over(){//游戏结束时的界面
	monk.style.display="flex";
	monk.style.opacity = '0.5';
}
bbtn.onmousedown=function(){
	monk.style.display='none';
	disroy();
	create(10);
}
