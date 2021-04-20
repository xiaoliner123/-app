/*选择用户头像的ui组件 */
import React,{Component} from 'react'
import {List,Grid} from 'antd-mobile'
import PropTypes from 'prop-types'
export default class HeaderSelecter extends Component{
    static propTypes = {
        setHeader:PropTypes.func.isRequired
    }

    state = {
        icon:null   //图片对象
    }
    constructor(props){
        super(props)
        this.headerList = []
        for(let i = 0;i < 16; i++){
            this.headerList.push({
                text:'icon-test_' + (i+1),
                icon:require(`./images/icon_zses4r8c5yf/icon-test_${i+1}.png`).default
            })
        }
    }
    handleclick = ({text,icon}) =>{
        //更新当前组件状态
        this.setState({
            icon
        })
        this.props.setHeader(text)
    }
    render(){
        const listHeader = !this.state.icon ? '请选择头像' : (
            <div>
                已选择头像：<img src={this.state.icon} alt="头像"/>
            </div>
        )
        return (
            <List renderHeader={() => listHeader}>
                <Grid data={this.headerList} columnNum={4} onClick={this.handleclick}></Grid>
            </List>
        )        
    }
} 