/**
 * Created by Administrator on 2016/12/28.
 */
var mongo=require('./db');
var markdown=require('markdown').markdown;
function Post(name,title,tag,post,pictureurl) {
    this.name=name;
    this.title=title;
    this.tag=tag;
    this.post=post;
    this.pictureurl=pictureurl;

}
module.exports=Post;
Post.prototype.save=function (callback) {
    var date=new Date();
    var time={
        data:date,
        year:date.getFullYear(),
        month:date.getFullYear()+'-'+(date.getMonth()+1),
        day:date.getFullYear()+'-'+(date.getMonth()+1)+date.getDate(),
        minute:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'-'
        +date.getHours()+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
        +':'+(date.getSeconds()<10?'0'+ date.getSeconds():date.getSeconds()),
    }
    var post={
        name:this.name,
        time:time.minute,
        title:this.title,
        tag:this.tag,
        post:this.post,
        comments:[],
        pictureurl:this.pictureurl,
        pv:0
    }
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.insert(post,{safe:true},function (err) {
                mongo.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}
Post.getFive=function (name,page,callback) {
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            var query={};
            if(name){
                query.name=name;
            }
            collection.count(query,function (err,total) {
                collection.find(query,{
                    skip:(page - 1) * 5,
                    limit:5
                }).sort({
                    time:-1
                }).toArray(function (err,docs) {
                    mongo.close();
                    if(err){
                        return callback(err);
                    }
                    callback(null,docs,total);
                })
            })
        })
    })
}

Post.get=function (name,callback) {
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            var query={};
            if(name){
                query.name=name;
            }
             collection.find(query).sort({
                 time:-1
             }).toArray(function (err,docs) {
                 mongo.close();
                 if(err){
                     return callback(err);
                 }
                 docs.forEach(function (doc) {
                     doc.post = markdown.toHTML(doc.post);
                 })
                 callback(null,docs);
             })

        })
    })
}
Post.getOne=function (name,time,title,callback) {
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.findOne({
                "name":name,
                "time":time,
                "title":title
            },function (err,doc) {
                if(err){
                    mongo.close();
                   return callback(err);
                }
                if(doc){
                    collection.update({
                        "name":name,
                        "time":time,
                        "title":title

                    },{
                        $inc:{"pv":1}
                    },function (err) {
                        mongo.close();
                        if(err){
                            return callback(err);
                        }
                    })
                }
                callback(null,doc);
            })
        })
    })
}

Post.edit=function (name,time,title,callback) {
    mongo.open(function (err,db) {
        if (err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if (err){
                mongo.close();
                return callback(err);
            }
            collection.findOne({
                "name":name,
                "time":time,
                "title":title
            },function (err,doc) {
                mongo.close();
                if (err){
                    return callback(err);
                }
              return  callback(null,doc);
            })
        })
    })
}

Post.update=function (name,time,title,post,callback) {
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.update({
                "name":name,
                "time":time,
                "title":title
            },{$set:{"post":post}},function (err) {
                console.log(post);
                mongo.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}

Post.remove=function (name,time,title,callback) {
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.remove({
                "name":name,
                "time":time,
                "title":title
            },function (err) {
                mongo.close();
                if(err){
                    return callback(err);
                }
                callback(null);
            })
        })
    })
}

Post.getTags=function (callback) {
    mongo.open(function (err,db) {
       if(err){
           return callback(err);
       }
       db.collection('posts',function (err,collection) {
           if(err){
               mongo.close();
               return callback(err);
           }
           collection.distinct('tag',function (err,docs) {
               mongo.close();
               if(err){
                   return callback(err);
               }
               callback(null,docs);
           })
       })
    })
}

Post.getTag=function (tag,callback) {
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            collection.find({
                tag:tag,
            },{
                "name":1,
                "time":1,
                "title":1
            }).sort({
                time:-1
            }).toArray(function (err,docs) {
                mongo.close();
                if(err){
                    return callback(err);
                }
                callback(null,docs);
            })
        })
    })
}

Post.search=function (keyword,callback) {
    mongo.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongo.close();
                return callback(err);
            }
            var  pattern=new RegExp(keyword,'i');
            collection.find({
                title:keyword
            },{
                "name":1,
                "title":1,
                "time":1
            }).sort({
                time:-1
            }).toArray(function (err,docs) {
                mongo.close();
                if(err){
                    return callback(err);
                }
                callback(null,docs);
            })
        })
    })
}

Post.updatePhoto = function (name, pictureurl, callback) {
    mongo.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongo.close();
                return callback(err);
            }
            collection.update({
                "name": name
            }, {$set: {pictureurl: pictureurl}}, {multi: true}, function (err) {
                mongo.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            })
        })
    })
};


