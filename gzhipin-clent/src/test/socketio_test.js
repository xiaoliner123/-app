import io from 'socket.io-client'

//连接服务器
const socket = io('ws://localhost:3000')    
//发送消息
socket.emit('sendMsg',{name:'abc'})
socket.on('receiveMsg',function(data){
    console.log('有一个服务户端发送了数据',data)
})