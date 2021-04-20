import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {WingBlank,WhiteSpace,Card} from 'antd-mobile'
import {withRouter} from 'react-router-dom'
const Header = Card.Header
const Body = Card.Body
class UserList extends Component{
    static propTypes = {
        userList:PropTypes.array.isRequired
    }

    render(){
        const {userList} = this.props
        return(
            <WingBlank style={{marginBottom:50,marginTop:50}}>
                {
                    userList.map((user) =>(
                        <div key={user.id}>
                        <WhiteSpace/>
                        <Card onClick={() => this.props.history.push(`/chat/${user.username}`)}>
                            <Header
                                thumb={require(`../../assets/images/icon_zses4r8c5yf/${user.header}.png`).default}
                                extra={user.username}
                            />
                            <Body>
                                <div>职位：{user.post}</div>
                                {user.salary ? <div>月薪：{user.salary}</div> : null}
                                {user.company ? <div>公司：{user.company}</div> : null}
                                <div>描述：{user.info}</div>
                            </Body>
                        </Card>
                    </div>
                    ))
                }
            </WingBlank>
        )
    }
}
export default withRouter(UserList)