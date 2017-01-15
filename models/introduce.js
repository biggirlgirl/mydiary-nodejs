/**
 * Created by Administrator on 2017/1/3.
 */
var mongo=require('./db');
function  Introduce(person) {
    this.name=person.name;
    this.sign=person.sign;
    this.sex=person.sex;
    this.hobby=person.hobby;
    this.introduce=person.introduce;
}
module.exports=Introduce;
Introduce.prototype.save=function (callback) {
    var person={
        name:this.name,
        sign:this.sign,
        sex:this.sex,
        hobby:this.hobby,
        introduce:this.introduce,
    }
    //console.log(person);
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('introduces',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.insert(person,{safe:true},function (err) {
                //console.log(person);
                mongo.close();
                if(err){
                  return callback(err);
                }
                callback(null);
            })
        })
    })
}
Introduce.get=function (name,callback) {
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('introduces',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.find({name:name}).toArray(function(err,docs){
                mongo.close();
                if(err){
                    return callback(err);
                }
                console.log('docs='+docs);
                callback(null,docs);
            })
        })
    })
}

Introduce.edit=function (name,callback) {
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('introduces',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.find({
                "name":name,
            },function (err,doc) {
                mongo.close();
                if(err){
                    return callback(err);
                }
                console.log(doc);
                callback(null,doc);
            })
        })
    })
}

Introduce.update=function (name,sign,hobby,introduce,callback) {
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('introduces',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.update({
                "name":name,
            },{$set:{
                sign:sign,
                hobby:hobby,
                introduce:introduce}},function (err) {
                    mongo.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}

