/**
 * Created by Administrator on 2017/1/11.
 */
//<script src="js/jquery.validate.js"></script>
$("#form").validate({
    rules:{
        username:{
            required: true,
            minlength: 4,
            unameMethod:true,
        },
        password:{
            required: true,
            minlength: 6,
            maxlength: 16,
            passwordMethod:true,

        },
        repassword:{
            required: true,
            equalTo: "#password",
        },
        message:{
            username:{
                required: "用户名不能为空",
                minlength: "用户名的最小长度为2"
            },
            password:{
                required: "密码不能为空",
                minlength: "密码长度不能少于6个字符",
                maxlength: "密码长度不能超过16个字符"
            },
            repassword:{
                required: "确认密码不能为空",
                equalTo:'password',
            },
        }
    }
});
$.validator.addMethod(
    "unameMethod",
    function(value, element){
        return  this.optional(element) || /[a-zA-Z]{4}/.test(value);
    },"账号格式不正确"
);
$.validator.addMethod(
    "passwordMethod",
    function(value, element){
        return  this.optional(element) || /^[a-zA-Z]\w{5,17}$/.test(value);
    },"密码格式不正确"
);
