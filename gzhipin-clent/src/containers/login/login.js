/*登录*/
import React,{Component} from 'react'
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {login} from '../../redux/actions'
import Logo from '../../components/logo/logo'
class Login extends Component{
    state = {
        username:'',
        password:'',
    }
    login = () => {
        this.props.login(this.state)
    }

    handleChange = (name,val) =>{
        //更新状态
        this.setState({
            [name]:val  //[[name]是属性的值]
        })
    }   
    
    toRegister = () =>{
        this.props.history.replace('/register')
    }
    
    render(){
        const{msg,redirecTo} = this.props.user
        if(redirecTo){
            return <Redirect to={redirecTo}/>
        }
        return (
            <div>
                <NavBar>小&nbsp;麟&nbsp;儿</NavBar>
                <Logo/>
                <WingBlank>
                    <List>
                        {msg ? <div className="error-msg">{msg}</div> : null}   
                        <WhiteSpace/>
                        <InputItem placeholder="请输入用户名" onChange={val => {this.handleChange('username',val)}}>用户名：</InputItem>
                        <WhiteSpace/>
                        <InputItem placeholder="请输入密码" type='password' onChange={val => {this.handleChange('password',val)}}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace/>
                        <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;&nbsp;录</Button>
                        <WhiteSpace/>
                        <Button onClick={this.toRegister}>新账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {login}
)(Login)