module.exports = function(server){
    const io = require('socket.io')(server)

    //监视客户端与服务器的连接
    io.on('connection',function(socket){
        //console.log('有一个客户端连接了服务器')

        socket.on('sendMsg',function(data){
            console.log('有一个客户端发送了数据',data)
            data.name = data.name.toUpperCase()
            socket.emit('receiveMsg',data)
        })
    })
}
