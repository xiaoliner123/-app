import React,{Component} from 'react'
import {TabBar} from 'antd-mobile'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'  //在非路由组件中使用路由库的api
const Item = TabBar.Item
class NavFooter extends Component {
    static propTypes = {
        navList:PropTypes.array.isRequired,
        unReadCount:PropTypes.number.isRequired
    }
    render(){
        let {navList,unReadCount} = this.props
        navList = navList.filter(nav => !nav.hide)
        const path = this.props.location.pathname
        return (
            <TabBar>
                {navList.map((nav) => (
                    <Item key={nav.title}
                          badge={nav.path==='/message'? unReadCount : 0}
                          title={nav.text}
                          icon={{uri:require(`./img/${nav.icon}.png`).default}}
                          selectedIcon={{uri:require(`./img/${nav.icon}-selected.png`).default}}
                          selected={path===nav.path}
                          onPress={() => this.props.history.replace(nav.path)}
                    />
                ))}
            </TabBar>
        )
    }
}
export default withRouter(NavFooter)//向外暴露withRouter（）包装产生的路由组件。会向