/**
 * Created by Administrator on 2017/1/8.
 */
// 开始动画之前，先停止动画
$('.scroll li').hover(function () {
    $(this).find('div')
        .stop()
        .animate({opacity:1,rigth:'0'},'fast');

},function () {
    $(this).find('div')
        .stop()
        .animate({opacity:0,right:'0'},'fast')
});

// 返回顶部
$('.scroll .to_top').click(function () {
    $('html,body').animate({scrollTop:'0'},800);
});
// 转到底部
$('.scroll .to_bottom').click(function () {
    $('html,body').animate({
        scrollTop:$(document).height()+'px',
    },800);
});


