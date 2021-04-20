/*包含n个reducer函数：根据老的state和指定的action返回一个新的state*/
import {combineReducers} from 'redux'
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG,
    RECEIVE_MSG_LIST,
    MSG_READ
} from './actions-types'
import {getRedirectTo} from '../utils'
const initUser = {
    username:'', //用户名
    type:'', //dashen/laoban
    msg:'',  //错误信息
    redirecTo:''//自动重定向的路由路径
}
//产生user状态的reducer
function user(state=initUser,action){
    switch(action.type){
        case AUTH_SUCCESS:
            return {...action.data,redirecTo:getRedirectTo(action.data.type,action.header)}
        case ERROR_MSG:
            return {...state,msg:action.data}
        case RECEIVE_USER:
            return action.data
        case RESET_USER:
            return {...initUser,msg:action.data}
        default:
            return state
    }
}
//产生userlist状态的reducer
const initUserList = []
function userList(state=initUserList,action){
    switch(action.type){
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}


//产生聊天状态的reducer
const initChat = {
    users:{},        //所有用户的信息   
    chatMsgs:[],     //当前用户所有相关的消息
    unReadCount: 0   //未读消息总数量
}
function chat(state=initChat,action){
    switch(action.type){
        case RECEIVE_MSG_LIST:
            const {users,chatMsgs,userid} = action.data
            return {
                users,
                chatMsgs,
                unReadCount: chatMsgs.reduce((preTotal,msg) => preTotal + (msg.read&&msg.to2===userid ? 1 : 0),0) //总的未读数量
            }
        case RECEIVE_MSG:
            const {chatMsg} = action.data 
            return {
                users:state.users,
                chatMsgs:[...state.chatMsgs,chatMsg],
                unReadCount:state.unReadCount + (chatMsg.read&&chatMsg.to2===action.data.userid ? 1 : 0)
            }
        case MSG_READ:
            const {from2,to2,count} = action.data
            return {
                users:state.users,
                chatMsgs: state.chatMsgs.map(msg =>{
                    if(msg.from2===from2 && msg.to2===to2 && !msg.read){
                        return {...msg,read:true}
                    }else{
                        return msg
                    }
                }),
                unReadCount:state.unReadCount - count
            }
        default:
            return state
    }
}
export default combineReducers({
    user,
    userList,
    chat
})


