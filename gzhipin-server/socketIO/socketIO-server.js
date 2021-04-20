const connect = require('../db/connect')
const {schemaSql,userSql} = require('../db/userSql')
module.exports = function(server){
    const io = require('socket.io')(server)
    //监视客户端与服务器的连接
    io.on('connection',function(socket){
        console.log('有一个客户端连接了服务器')

        socket.on('sendMsg',function({from2,to2,content}){
            const chat_id = [from2,to2].sort().join('_')
            const create_time = Date.now()
            const read = 'false'
            const ele = {from2,to2,content,chat_id,create_time,read}
            console.log('有一个客户端发送了数据',{from2,to2,content})
            connect.query(schemaSql.insert,ele,function(error,chatMsg){
                io.emit('receiveMsg',chatMsg)
            })  
        })
    })
}