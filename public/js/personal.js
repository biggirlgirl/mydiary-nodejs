/**
 * Created by Administrator on 2017/1/6.
 */

var imgs = document.querySelector('#choseimg img');

// 通过点击图片实现点击input选择文件的效果

    imgs.onclick = function () {

        this.nextElementSibling.click();
    }


var inputs = document.querySelector('#choseimg input');
var file;
    // 表单内容发生变化
    inputs.onchange = function () {
        console.log(this);
        console.dir(this.files[0]);

        // 取出选择文件(图片、html、text...)
        file = this.files[0];

        // startsWith('image')判断字符串是否以'image'开头
        if (file.type.startsWith('image')) {
            // URL.createObjectURL(file);创建一个指向该文件的url
            this.previousElementSibling.src = URL.createObjectURL(file);
        } else{
            alert('文件格式不正确，请选择图片');
        }
    }
