/*主界面路由*/
import React,{Component} from 'react'
import {Switch,Route,HashRouter,Redirect} from 'react-router-dom'
import {NavBar} from 'antd-mobile'
import LaobanInfo from '../laoban-info/laoban-info'
import DashenInfo from '../dashen-info/dashen-info'
import Dashen from '../dashen/dashen'
import Laoban from '../laoban/laoban'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/notfound/notfound'
import NavFooter from '../../components/nav-footer/nav-footer'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {getRedirectTo} from '../../utils'
import {getUser} from '../../redux/actions'
import Chat from '../chat/chat'
class Main extends Component{
    navList = [
        {
            path:'/laoban',
            component:Laoban,
            title:'大神列表',
            icon:'dashen',
            text:'大神',
            hide:''
        },
        {
            path:'/dashen',
            component:Dashen,
            title:'老板列表',
            icon:'laoban',
            text:'老板',
            hide:''
        },
        {
            path:'/message',
            component:Message,
            title:'消息列表',
            icon:'message',
            text:'消息'
        },
        {
            path:'/personal',
            component:Personal,
            title:'个人中心',
            icon:'personal',
            text:'个人中心'
        }
    ]
    componentDidMount(){
        //登录过cookie中有username，但没有登录redux管理的user中没有username，发请求获取对应的user
        const user_id = Cookies.get('userid')
        const {username} = this.props.user
        if(user_id && !username){
            //发送异步action，获取user
            this.props.getUser()
        }
    }
    render(){
        //读取cookie中的id
        const user_id = Cookies.get('userid')
        //没有自动进去登录界面
        if(!user_id){
            return <Redirect to='/login'/>
        }
        //如果有，读取redux中的user状态
        const {user,unReadCount} = this.props
        //如果user没有userid，返回null（不做任何显示）
        if(!user_id){
            return null
        }else{
        //有则，显示对应界面
        let path = this.props.location.pathname
        if(path==='/'){
            path = getRedirectTo(user.type,user.header)
            return <Redirect to={path}/> 
        }
        }


        //根据user的type和header；爱计算出一个重定向的路由路径，并自动重定向
        // const {user} = this.props
        // if(!user.username){
        //     return <Redirect to='/login'/>
        // }

        const {navList} = this
        const path = this.props.location.pathname   //当前请求路径
        const currentNav = navList.find(nav=> nav.path===path)//当前得到的nav，可能没有

        if(currentNav){
          //决定哪个路由需要隐藏
          if(user.type==='laoban'){
            navList[1].hide = true
          }else{
            navList[0].hide = true
          } 
        }

        return (
            <HashRouter>
                {currentNav ? <NavBar className='sticky-header'>{currentNav.title}</NavBar> : null }
                <Switch>
                    {
                        navList.map(nav => <Route path={nav.path} component={nav.component}/>) 
                    }
                    <Route path='/laobaninfo' component={LaobanInfo}/>
                    <Route path='/dasheninfo' component={DashenInfo}/>
                    <Route path='/chat/:userid' component={Chat}/>
                    <Route component={NotFound}/> 
                </Switch>
                {currentNav ? <NavFooter navList = {navList} unReadCount = {unReadCount}/> : null }
            </HashRouter>
        )
    }
}
export default  connect(
    state => ({user:state.user,unReadCount:state.chat.unReadCount}),
    {getUser}
)(Main)
/*
1.实现自动登录
    如果cookie中有username，发请求获取username，没有则进去登录界面
2.如果已经登录，

*/