import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Result,List,WhiteSpace,Button,Modal} from 'antd-mobile'
import Cookies from 'js-cookie'
import {reset_user} from '../../redux/actions'
const Item = List.Item
const Brief = Item.Brief
class Personal extends Component{


    logout = () => {
        Modal.alert('退出','确认退出登录吗？',[
            {text:'取消'},
            {
               text:'确定',
               onPress:()=>{
                   Cookies.remove('userid')
                   this.props.reset_user()
               } 
            }
        ])
    }
    render(){
        const {username,info,header,company,post,salary} = this.props.user
        return (
            <div style={{marginTop:50}}>
                <Result
                    img={<img src={require(`../../assets/images/icon_zses4r8c5yf/${header}.png`).default} style={{width:50}} alt='header'/>}
                    title={username}
                    msessage={company}
                />
                <List renderHeader={() => '相关信息'}>
                    <Item multipleLine>
                        <Brief>职位：{post}</Brief>
                        <Brief>简介：{info}</Brief>
                        {salary ? <Brief>薪资：{salary}</Brief> : null}
                    </Item>
                    <WhiteSpace/>
                    <List>
                        <Button type='warning' onClick={this.logout}>退出登录</Button>
                    </List>
                </List>
            </div>
        ) 
    }

} 
export default connect(
    state =>({user:state.user}),
    {reset_user}
)(Personal)