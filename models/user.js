/**
 * Created by Administrator on 2016/12/27.
 */
var mongo=require('./db');
function  User(user) {
    this.name=user.name;
    this.password=user.password;
    this.email=user.email;
}
module.exports=User;
User.prototype.save=function (callback) {
    var user={
        name:this.name,
        password:this.password,
        email:this.email,
        sign:[],
        sex:[],
        hobby:[],
        introduce:[],
        pictureurl:[],
    }
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.insert(user,{safe:true},function (err,user) {
                mongo.close();
                if(err){
                  return callback(err);
                }
                return callback(user[0]);
            })
        })
    })
}
User.get=function (username,callback) {
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.findOne({name:username},function (err,user) {
                mongo.close();
                if(err){
                    return callback(err);
                }
                callback(null,user);
            })
        })
    })
}

User.edit=function (name,callback) {
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.findOne({
                "name":name,
            },function (err,user) {
                mongo.close();
                if(err){
                    return callback(err);
                }
                // console.log(user);
                callback(null,user);
            })
        })
    })
}

User.update=function (name,sign,hobby,sex,introduce,pictureurl,callback) {
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.update({
                "name":name,
            },{$set:{
                sign:sign,
                hobby:hobby,
                sex:sex,
                introduce:introduce,
                pictureurl:pictureurl,
            }},function (err) {
                mongo.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}
