var User=require('../models/user');
var Post=require('../models/post');
var Introduce=require('../models/introduce');
var Comment=require('../models/comment');
var multer=require('multer');
var storage=multer.diskStorage({
    //这个是上传图片的地址
    destination:function (req,file,cb) {
        cb(null,'./public/img');
    },
    //上传到服务器上图片的名字
    filename:function (req,file,cb) {
        req.file = file;
        var name = req.session.user.name;
        if (file.mimetype == 'image/jpeg') {
            req.pictureurl = name + '.jpg';
        } else if (file.mimetype == 'image/png') {
            req.pictureurl = name + '.png';
        } else if (file.mimetype == 'image/gif') {
            req.pictureurl = name + '.gif';
        }
        cb(null,req.pictureurl);
    }
})
var upload=multer({storage:storage});
var crypto=require('crypto');
module.exports=function (app) {
    app.get('/',function (req,res) {
        var page=parseInt(req.query.p)||1;
        Post.getFive(null,page,function (err,posts,total) {
            if(err){
                posts=[];
                return res.redirect('back');
            }
            res.render('index',{
                title:'首页',
                user:req.session.user,
                page:page,
                posts:posts,
                total:total,
                totalall: parseInt(Math.ceil(parseFloat(total) / parseFloat(5))),
                isFirstPage:(page - 1)==0,
                isLastPage:(page -1) * 5 + posts.length == total,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            })

        })

    });
    app.get('/regist',function (req,res) {
        res.render('regist',{
            title:'注册界面',
            islogin:false,
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    })
    app.get('/codingalways',function (req,res) {
        res.render('codingalways',{
            title:'这就23了？',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
    app.post('/regist',function (req,res) {
        // console.log(req.body);
        var name=req.body.username;
        var password=req.body.password;
        var repassword=req.body.repassword;
        var email=req.body.email;
        var zhpattern=/[a-zA-Z]{4}/;
        var mmpattern=/^[a-zA-Z]\w{5,17}$/;
        if(zhpattern.test(name)==false){
            req.flash('error','用户名不合法');
            return res.redirect('back');
        }
        if(mmpattern.test(password)==false){
            req.flash('error','密码不符合要求哦');
            return res.redirect('back');
        }
        if(name==''||password==''||repassword==''||email==''){
            req.flash('error','请正确填写信息');
            return res.redirect('back');
        };
        if(password!=repassword){
            req.flash('error','两次输入的密码不一致');
            return res.redirect('back');
        };
        var md5=crypto.createHash('md5');
        password=md5.update(password).digest('hex');
        //console.log(password);
        var newUser=new User({
            name:name,
            password:password,
            email:email
        });
        User.get(name,function (err,user) {
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            if(user){
                req.flash('error','用户名已存在');
                return res.redirect('back');
            }
            newUser.save(function (err,user) {
                if(err){
                    req.flash('error',err);
                    return res.redirect('back');
                }
                req.session.user=newUser;
                req.flash('success','注册成功');
                res.redirect('/');
            });
        });

    });
    app.get('/login',function (req,res) {
        res.render('login',{
            title:'登录界面',
            islogin:true,
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    })
    app.post('/login',function (req,res) {
        var md5=crypto.createHash('md5');
        var password=md5.update(req.body.password).digest('hex');
        User.get(req.body.username,function (err,user) {
            if(!user){
                req.flash('error','用户不存在');
                return res.redirect('back');
            }
            if(user.password!=password){
                req.flash('error','密码错误');
                return res.redirect('back');
            }
            req.session.user=user;
            req.flash('success','登陆成功');
            res.redirect('/');
        })
    })
    app.get('/logout',function (req,res) {
        req.session.user=null;
        req.flash('success','退出成功');
        res.redirect('/');
    })
    app.get('/post',function (req,res) {
        res.render('post',{
            title:'发布界面',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    })
    app.post('/post',function (req,res) {
        if(req.body.title==''||req.body.tag==''||req.body.content==''){
            req.flash('error','请把每个空白都填写完整');
            return res.redirect('/post');
        }
        var postuser=req.session.user;
        var post=new Post(postuser.name,req.body.title,req.body.tag,req.body.content,req.pictureurl);
        post.save(function (err) {
            if(err){
                req.flash('error',err);
            }
            // req.flash('success','发布成功');
            res.redirect('/');
        })
    })
    //个人资料页面
    app.post('/personal',upload.single("perimg"),function (req,res) {
        if(req.body.sex==''||req.body.introduce==''){
            req.flash('error','性别和介绍一定要填写哦');
            return res.redirect('/personal');
        }
        console.log(req.pictureurl);
        User.edit(req.session.user.name,function (err,diffuser) {
            var diffuser=diffuser;
            if(req.body.sign==diffuser.sign&&req.body.sex==diffuser.sex&&req.body.hobby==diffuser.hobby&&req.body.introduce==diffuser.introduce&&req.pictureurl==diffuser.pictureurl){
                req.flash('error','没有对内容进行改动');
                return res.redirect('/personal');
            }
            req.session.user=diffuser;
            User.update(req.session.user.name,req.body.sign,req.body.sex,req.body.hobby,req.body.introduce,req.pictureurl,function (err) {
                if(err){
                    req.flash('error',err);
                    return res.redirect('back');
                }
                //头像上传成功后对post集合进行更新
                Post.updatePhoto(req.session.user.name, req.pictureurl, function (err) {
                    if(err){
                        console.log('修改资料出现错误');
                    } else {
                        User.get(req.session.user.name,function (err,user) {
                            req.session.user =user;
                            req.flash('success', '资料修改成功!');
                            res.redirect('/');
                        })
                    }
                })
//                req.flash('success','编辑成功');
//                res.redirect('/');
            })
        })
    })
    app.get('/personal',function (req,res) {
        User.edit(req.session.user.name,function (err,user) {
             console.log(req.body);
//            console.log(req.body.perimg.src);
            if(err){
                req.flash('error','信息有误');
                return res.redirect('/');
            }
            res.render('editpersonal',{
                title:'编辑个人资料',
                user:user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            })
        })
    })

   //根据用户名进入所有文章的列表
    app.get('/u/:name',function (req,res) {
        User.get(req.params.name,function (err,user) {
            if(!user){
                req.flash('error','用户不存在');
                return res.redirect('/');
            }
            Post.get(user.name,function (err,posts) {
               if (err){
                   req.flash('error','没有找到用户的文章');
                   return res.redirect('/');
               }
               // console.log(posts);
               res.render('user',{
                   title:"作者："+user.name,
                   posts:posts,
                   user:req.session.user,
                   success:req.flash('success').toString(),
                   error:req.flash('error').toString()
               })
            })

        })
    })
    //根据标题进入文章的详情
    app.get('/u/:name/:time/:title',function (req,res) {
         Post.getOne(req.params.name,req.params.time,req.params.title,function (err,post) {
             if(err){
                 req.flash('error',err);
                 return res.redirect('/');
             }
             res.render('article',{
                 title:req.params.title,
                 post:post,
                 user:req.session.user,
                 success:req.flash('success').toString(),
                 error:req.flash('error').toString()
             })
         })
    })
    //提交文章的评论
    app.post('/comment/:name/:time/:title',function (req,res) {
        // console.log(req.body);
        if(req.body.content==''){
            req.flash('error','提交内容不能为空');
            return res.redirect('back');
        }
        var date=new Date();
        var time=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'-'
            +date.getHours()+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
            +':'+(date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds());
        var comment={
            time:time,
            content:req.body.content,
            name:req.body.name,
        }
        var newComment=new Comment(req.params.name,req.params.time,req.params.title,comment);
        newComment.save(function (err) {
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
            req.flash('succcess','评论成功');
            res.redirect('back');
        })

    })
    //点击编辑，返回编辑页面，对文章内容进行修改
    app.get('/edit/:name/:time/:title',function (req,res) {
        Post.edit(req.session.user.name,req.params.time,req.params.title,function (err,post) {
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            };
            res.render('edit',{
                title:'文章编辑页面',
                user:req.session.user,
                post:post,
                success:req.flash('succcess').toString(),
                error:req.flash('error').toString()
            })
        })

    })

    //提交编辑的文章,
    app.post('/edit/:name/:time/:title',function (req,res) {
        //console.log(req.body);
        Post.update(req.params.name,req.params.time,req.params.title,req.body.content,function (err) {
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            };
            req.flash('success','文章修改成功');
            return res.redirect('/');
        })
    })
    //删除文章
    app.get('/remove/:name/:time/:title',function (req,res) {
        Post.remove(req.params.name,req.params.time,req.params.title,function (err) {
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
            res.redirect('/');
        })
    })

    app.get('/tags',function (req,res) {
        Post.getTags(function (err,posts) {
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            res.render('tags',{
                title:'标签',
                posts:posts,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            })
        })
    })
    
    app.get('/tags/:tag',function (req,res) {
        Post.getTag(req.params.tag,function (err,posts) {
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            res.render('tag',{
                title:'标签：' +req.params.tag,
                posts:posts,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            })
        })
    })

    app.get('/search',function (req,res) {
        Post.search(req.query.keyword,function (err,post) {
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            res.render('search',{
                title:'search' +req.query.keyword,
                post:post,
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            })
        })
    })
}