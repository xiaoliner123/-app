/*包含n个action creator
   异步action
   同步action 
*/
import io from 'socket.io-client'

import {
   AUTH_SUCCESS,
   ERROR_MSG,
   RECEIVE_USER,
   RESET_USER,
   RECEIVE_USER_LIST,
   RECEIVE_MSG_LIST,
   RECEIVE_MSG,
   MSG_READ
} from './actions-types'
import {
   reqRegister,
   reqLogin,
   reqUpdateUser,
   reqUser,
   reqUserList,
   reqChatMsgList,
   reqReadMsg
}from '../api'
/*单例对象 
1.创建对象之前：判断对象是否已经创建，没有创建才创建
2.创建对象后，保存对象
*/
function initIo(dispatch,userid){
   if(!io.socket){
     io.socket = io('ws://localhost:3000')
      io.socket.on('receiveMsg',function(chatMsg){
         console.log('有一个服务端发送了数据')
         console.log(chatMsg)
         //只有当chatMsg是与当前用户相关的信息，才去分发同步action保存消息
         if(userid===chatMsg.from2 || userid===chatMsg.to2){
            dispatch(receiveMsg({chatMsg,userid}))
         }
      })
   }
}

 //异步发送消息的action
export const sendMsg = (from2,to2,content) =>{
   return dispatch =>{
      console.log('发送消息',{from2,to2,content})
      io.socket.emit('sendMsg',{from2,to2,content})
   }
}

//读取消息的异步action
export const readMsg = (targetId,userid) =>{
   return async dispatch => {
      const response = await reqReadMsg(targetId)
      const result = response.data
      if(result.code===0){
         const count = result.data
         const from2 = result.data
         const to2 = userid
         dispatch(msgRead({count,from2,to2}))
      }
   }
}

//异步获取消息列表
async function getMsgList(dispatch,userid){
   initIo(dispatch,userid)
   const response = await reqChatMsgList()
   const result = response.data
   if(result.code===0){
      const {users,chatMsgs} = result.data
      //分发同步action
      dispatch(receiveMsgList({users,chatMsgs,userid}))
   }
}


//授权成功的同步action
const authSuccess = (user) => ({type:AUTH_SUCCESS,data:user})
const errorMsg = (msg) => ({type:ERROR_MSG,data:msg})
const receive_user = (user) => ({type:RECEIVE_USER,data:user})
export const reset_user = (msg) => ({type:RESET_USER,data:msg})
export const receive_userlist = (userList) =>({type:RECEIVE_USER_LIST,data:userList})
export const receiveMsgList = ({users,chatMsgs,userid}) =>({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}})
const receiveMsg = ({chatMsg,userid}) =>({type:RECEIVE_MSG,data:{chatMsg,userid}})
const msgRead = ({count,from2,to2}) =>({type:MSG_READ,data:{count,from2,to2}})
//注册异步action
export const register = (user) =>{
   const {username,password,password2} = user
   if(!username){
      return errorMsg('必须输入用户名')
   }else if(password!==password2){
      //form表单的前台验证，返回一个errormsg的同步action
      return errorMsg('2次密码要一致')
   }
   return async dispatch =>{
      //发送注册的异步ajax请求
      const response = await reqRegister(user)
      const result = response.data
      if(result.code===0){
         getMsgList(dispatch,result.data.username)
         dispatch(authSuccess(result.data))
      }else{
         dispatch(errorMsg(result.msg))
      }
   }
} 
//登录异步action
export const login = (user) =>{
   const {username,password} = user
   if(!username){
      return errorMsg('必须输入用户名')
   }else if(!password){
      //form表单的前台验证，返回一个errormsg的同步action
      return errorMsg('请输入密码')
   }
   return async dispatch =>{
      //发送注册的异步ajax请求
      const response = await reqLogin(user)
      const result = response.data
      if(result.code===0){
         getMsgList(dispatch,result.data.username)
         dispatch(authSuccess(result.data))
      }else{
         dispatch(errorMsg(result.msg))
      }
   }
} 
//更新用户信息异步action
export const updateUser = (user) => {
   return async dispatch =>{
      const response = await reqUpdateUser(user)
      const result = response.data
      if(result.code===0){
         dispatch(receive_user(result.data))
      }else{
         dispatch(reset_user(result.msg))
      }
   }
}
 //获取用户信息异步action
export const getUser = () =>{
    return async dispatch =>{
      const response = await reqUser()
      const result = response.data
      if(result.code===0){
         getMsgList(dispatch,result.data.username)
         dispatch(receive_user(result.data))
      }else{
         dispatch(reset_user(result.msg))
      }
    }
 }

export const getUserList = (type) =>{
    return async dispatch =>{
       const response = await reqUserList(type)
       const result = response.data
       if(result.code===0){
         dispatch(receive_userlist(result.data))
       }
    }
}