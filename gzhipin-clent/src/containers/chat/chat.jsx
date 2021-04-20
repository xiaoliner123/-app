import React,{Component} from 'react'
import {connect} from 'react-redux'
import {NavBar,List,InputItem,Grid,Icon} from 'antd-mobile'
import {readMsg,sendMsg} from '../../redux/actions'
import QueueAnim from 'rc-queue-anim'
const Item = List.Item
class Chat extends Component{
    state = {
        content:'',
        isShow: false //是否显示表情
    }

    //在第一次render之前回调
    componentWillMount(){
        //初始化表情数据
        const emojis = ['😃','🐻','🍔','⚽','🌇','💡','🔣','🎌','😃','🐻','🍔','⚽','🌇','💡','🔣','🎌','😃','🐻','🍔','⚽','🌇','💡','🔣','🎌',
        '😃','🐻','🍔','⚽','🌇','💡','🔣','🎌','😃','🐻','🍔','⚽','🌇','💡','🔣','🎌','😃','🐻','🍔','⚽','🌇','💡','🔣','🎌']
        this.emojis = emojis.map(emoji => ({text:emoji}))
    }
    componentDidMount(){
        //初始化显示列表
        window.scrollTo(0,document.body.scrollHeight)
        //发请求更新消息
        const targetId = this.props.match.params.userid
        const userid = this.props.user.username
        this.props.readMsg(targetId,userid)
    }
    componentDidUpdate(){
        window.scrollTo(0,document.body.scrollHeight)
    }

    componentWillUnmount(){
        const targetId = this.props.match.params.userid
        const userid = this.props.user.username
        this.props.readMsg(targetId,userid)
    }
    toggleShow = () => {
        const isShow = !this.state.isShow
        this.setState({isShow})
        if(isShow){
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            },0)
        }
    }

    handleSend = () =>{
        //收集数据
        console.log(this.state.content)
        const from2 = this.props.user.username
        const to2 = this.props.match.params.userid
        const content = this.state.content
        //发送请求
        if(content){
            this.props.sendMsg(from2,to2,content)
        }
        //清除数据
        this.setState({content:''})
    }

    render(){
        const {user} = this.props
        const {users,chatMsgs} = this.props.chat
        
        //计算当前聊天的chatid
        const meId = user.username
        // if(!users[meId]){
        //     return null
        // }
        const targetId = this.props.match.params.userid
        const chatId = [meId,targetId].sort().join('_')
        //对chatMsgs进行过滤
        const msgs = chatMsgs.filter(msg => msg.chat_id===chatId )
        //得到目标用户头像(暂不可用)
        //const targetHeader = users[targetId].header
        //const targetIcon = targetHeader ? require(`../../assets/images/icon_zses4r8c5yf/${targetHeader}.png`).default : null
        return(
            <div id='chat-page'>
                <NavBar 
                    icon={<Icon type='left' onClick={() => this.props.history.goBack()}/>} 
                    className='sticky-header'>
                    {targetId}
                </NavBar>
                <List style={{marginTop:50,marginBottom:50}}>
                    <QueueAnim type='alpha'>
                    {
                        msgs.map(msg => {
                            if(targetId===msg.from2){
                                return(
                                    <Item
                                        key={msg.id}
                                        thumb={require('../../assets/images/icon_zses4r8c5yf/icon-test_17.png').default}
                                    >
                                        {msg.content}
                                    </Item>
                                )  
                            }else{
                                return(
                                    <Item
                                        key={msg.id}
                                        className='chat-me'
                                        extra='我'
                                    >
                                        {msg.content}
                                    </Item>
                                )
                            }
                        })
                    }
                    </QueueAnim>
                </List>
                <div className='chat-send'>
                    <InputItem
                        placeholder='请输入'
                        value={this.state.content}
                        onChange={val => this.setState({content:val})}
                        onFocus={() => this.setState({isShow:false})}
                        extra={
                            <span>
                                <span onClick={this.toggleShow}>😃</span>&nbsp;
                                <span onClick={this.handleSend}>发送</span>                            
                            </span>
                        }
                    />
                    {this.state.isShow ? 
                    <Grid
                        data={this.emojis}
                        columnNum={8}
                        carouselMaxRow={4}
                        isCarousel={true}
                        onClick={(item) =>{
                            this.setState({content:this.state.content + item.text})
                        }}
                    /> : null}
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({user:state.user,chat:state.chat}),
    {readMsg,sendMsg}
)(Chat)