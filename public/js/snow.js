
// 创建雪花
// 雪花下落，并重用雪花
function creatSnow() {
    
    // createElement 创建标签的方法
    var snow=document.createElement('img');
    // 获取可视界面的宽高
// var w=$(window).width();
// var h=$(window).height();

    var w=document.documentElement.clientWidth;
    var h=document.documentElement.clientHeight;
    // 随机获取雪花距离屏幕上边 和 左边 的距离
    var top=Math.random()*h;
    var left=Math.random()*w;
     var rotate=Math.random();


    snow.src='/img/zy.png';
    snow.style.position='absolute';
    // 分别设置距离顶部和左边的距离
    snow.style.top=top+'px';
    snow.style.left=left+'px';
    snow.style.width=3+'rem';
    snow.style.height=3+'rem';
    // snow.style.transform='scale('+Math.random()+')';
     snow.style.transform='scale(rotate)';


    // 在body的最下方插入img标签
    document.body.appendChild(snow);
    function down() {
    top+=10;
    left+=10;
    // 更新雪花的位置
    snow.style.top=top+'px';
    snow.style.left=left+'px';
   if (top>h) {
       top=-100;
   };
   if (left>w) {
       left=-100;
   }
     }
//每隔0.05秒执行一次down方法
// 50  时间  单位：毫秒
 setInterval(down,200);
}


for(var i=0;i<30;i++){

creatSnow();
}














