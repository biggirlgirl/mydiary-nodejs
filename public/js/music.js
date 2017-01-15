/**
 * Created by Administrator on 2017/1/8.
 */
// load加载音频，paly播放声音
var audios = document.querySelectorAll('audio');
var divs = document.querySelectorAll('div');
// 记录所点击 的按键
var code = 0;
function play (index) {
    // alert(index);
    var audio = audios[index];
    // 加载音频
    audio.load();
    // 播放
    audio.play();
}
window.onkeydown = function (e) {
    var key = e.keyCode;
    // alert(key);
    // 当code的值和key值不相等的时候再进入判断句
    if (code != key) {
        code = key;
        if (code>=49 && code<=57) {
            var index = code - 49;
            play(index);
            divs[index].classList.add('down');
        }
    }
}
window.onkeyup = function () {
        code = 0;
        for (var i = 0; i < divs.length; i ++) {
            divs[i].classList.remove('down');
        }
    }
