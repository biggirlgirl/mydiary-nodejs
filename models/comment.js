/**
 * Created by Administrator on 2016/12/31.
 */
var mongo=require('./db');
function Comment(name,time,title,comment) {
    this.name=name;
    this.time=time;
    this.title=title;
    this.comment=comment;

}
module.exports=Comment;
Comment.prototype.save=function (callback) {
    var name=this.name;
    var time=this.time;
    var title=this.title;
    var comment=this.comment;
    mongo.open(function (err,db) {
        if (err){
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
            },{
                $push:{"comments":comment}
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