import React,{Component} from 'react'
import {connect} from 'react-redux'
import {List,Badge} from 'antd-mobile'
const Item = List.Item
const Brief = Item.Brief

//分组函数，得到每个组lastMsg组成的数组
function getLastMsgs(chatMsgs,userid){ 
    //找出每组聊天的lastMsg，存入lastMsgObjs{chat_id：lastMSg}
    const lastMsgObjs = {}
    chatMsgs.forEach(msg => {

        if(msg.to2===userid&&!msg.read){
            msg.unReadCount = 1
        }else{  
            msg.unReadCount = 0
        }
        const chatId = msg.chat_id
        const lastMsg = lastMsgObjs[chatId]
        console.log(msg,msg.unReadCount)
        if(!lastMsg){
            lastMsgObjs[chatId] = msg
        }else{
            //保存已经统计的未读数量
            const unReadCount = lastMsg.unReadCount + msg.unReadCount
            if(msg.create_time > lastMsg.create_time){
                lastMsgObjs[chatId] = msg
            }
            lastMsgObjs[chatId].unReadCount = unReadCount
        }
    })
    //得到所有lastMsg数组
    const lastMsgs = Object.values(lastMsgObjs)
    //对数组进行排序
    lastMsgs.sort(function(m1,m2){//结果<0，m1在前面，=0不变，>0m2在前
        return m2.create_time-m1.create_time
    })
    console.log(lastMsgs)
    return lastMsgs
}
class Message extends Component{
    render(){

        const {user} = this.props
        const {users,chatMsgs} = this.props.chat
        //按chat_id对chatMsg分组
        const lastMsgs = getLastMsgs(chatMsgs,user.username)
        return (
            <List style={{marginTop:50,marginBottom:50}}>
                {
                    lastMsgs.map(msg =>(
                        <Item
                        key={msg.id}
                        extra={<Badge text={msg.unReadCount}/>}
                        thumb={require(`../../assets/images/icon_zses4r8c5yf/icon-test_1.png`).default}
                        arrow='horizontal'
                        onClick={() => this.props.history.push(`/chat/${msg.to2}`)}
                        >
                            {msg.content}
                    <Brief>{msg.to2}</Brief>
                        </Item>   
                    ))
                }
            </List>
        ) 
    }
}
export default connect(
    state =>({user:state.user,chat:state.chat}),
    {}
)(Message)