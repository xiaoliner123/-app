var express = require('express');
var router = express.Router();
const connect = require('../db/connect')
const {userSql,schemaSql} = require('../db/userSql')
const md5 = require('blueimp-md5')
connect.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/*1.获取请求参数
  2.处理
  3.返回响应数据
*/ 
router.post('/register',function(req,res){
    //1.获取请求参数
    const user = {username,password,type} = req.body
    //2.处理
    connect.query(userSql.queryByName,user.username,function(error,result){
    if(result){
      if(result.length){
        console.log('no')
        res.send({code:1,msg:"用户已存在"})
      }else{
        user.password = md5(user.password)
        connect.query(userSql.insert,user,(error,result) =>{
          if(result){
            console.log('ok')
            res.cookie('userid',user.username,{maxAge:1000*60*60*24})
            res.send({code:0,msg:'注册成功',data:user})
          }else{
            res.send({code:1,msg:'注册失败',data:error})
          }
        })
      }
    }
  })
})
router.post('/login',function(req,res){
  //1.获取请求参数
  const user = {username,password} = req.body
  //2.处理
  user.password = md5(user.password)
  connect.query(userSql.queryByNamePassword,[user.username,user.password],function(error,result){
    if(result){
      if(result.length){
        console.log('ok')
        res.cookie('userid',user.username,{maxAge:1000*60*60*24})
        res.send({code:0,msg:"登录成功",data:result[0]})
      }else{
        res.send({code:1,msg:"登录失败"})
      }
    }
  })
})
//更新数据路由
router.post('/update',function(req,res){
  //从cookie取得id
  const userid  = req.cookies.userid
  //如果不存在，cookie被删除，返回错误信息
  if(!userid){
    console.log('no')
    return res.send({code:1,msg:'请先登录'})
  }
  //存在。根据userid更新对应的user文档数据
  const user = req.body
  connect.query(userSql.updateUser,[user,userid],function(error,result){
    if(!result){
      res.clearCookie('userid')
      return res.send({code:1,msg:'请先登录'})
    }else{
      res.send({code:0,data:userid})
    }
  })
})

//获取用户信息的路由（根据cookie中的username）
router.get('/user',function(req,res){
  const userid  = req.cookies.userid
  if(!userid){
    return res.send({code:1,msg:'请先登录'})
  }
  connect.query(userSql.queryByName,userid,function(error,result){
    res.send({code:0,data:result[0]})
  })
})
//根据用户类型获取获取用户列表
router.get('/userlist',function(req,res){
  const {type} = req.query
  connect.query(userSql.queryByType,type,function(error,result){
    res.send({code:0,data:result})
  })
})

//获取当前用户所有相关聊天的信息列表
router.get('/msglist',function(req,res){
  const userid = req.cookies.userid
  connect.query(userSql.queryAll,function(error,result){
    const users = result.reduce((users,user) => {
      users[user.id] = {username:user.username,header:user.header}
      return users
    },{})
      //查询serid相关的所有聊天信息
    connect.query(schemaSql.queryByFromorTo,[userid,userid],function(error,result){
      console.log(result)
      res.send({code:0,data:{users,chatMsgs:result}})
    })
  })
})
//\更改指定消息为已读
router.post('/readmsg',function(req,res){
  const from2 = req.body.from2
  const to2 = req.cookies.userid
  const read = {read:'true'}
  connect.query(schemaSql.updateRead,[read,from2,to2,'false'],function(err,result){
    console.log(result)
    res.send({code:0,data:result})
  })
})
module.exports = router;
