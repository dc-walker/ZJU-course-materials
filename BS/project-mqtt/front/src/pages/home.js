import React from 'react';
import 'antd/dist/antd.css';
import '../styles/home.css';
import Avatar from '@material-ui/core/Avatar';
import {Layout, Menu, Modal, Input} from 'antd';
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    CompassOutlined,
} from '@ant-design/icons';

import Devices from "./devices";
import MarkMap from "./map";
import Chart from "./chart";
import Dashboard from "./dashboard";

import childe from '../assets/childe.png';
import axios from "axios";

const { Header, Sider, Content } = Layout;

function getUsername(){
    return localStorage.getItem('username');
}

class UserBar extends React.Component {
    constructor(props) {
        super(props);
        this.logCheck();
        let username = getUsername();
        this.state = {
            username: username,
            isModalVisible: false,
            newPassword: null,
            oldPassword: null,
        }
    }

    logCheck() {
        let username = getUsername();
        if (username === null){
            window.location.href = '/sign';
        }
    }

    logout(){
        localStorage.clear();
        alert('logout success');
        this.logCheck();
    }

    setPassword(){
        let username = getUsername();
        let oldPassword = this.state.oldPassword;
        let newPassword = this.state.newPassword;
        if(oldPassword===null) {
            alert('please input the old password');
            return;
        }
        if(newPassword === null){
            alert('please input the new password');
            return;
        }
        if(newPassword.length < 6){
            alert('the length of password should be at least 6');
            return;
        }
        let url = '/setPassword';
        let data = `username=${username}&oldPassword=${oldPassword}&newPassword=${newPassword}`;
        axios.post(url, data)
            .then(res => res.data.toString())
            .then(res => {
                alert(res);
                if(res === 'success'){
                    this.setState({
                        isModalVisible: false,
                    })
                }
            })
            .catch(err => console.log(err))
    }

    render() {
        let username = getUsername();

        return(<Header className='user-bar'>
            <div className={'username'}>{username}</div>
            <Avatar className={'avatar'} src={childe}/>
            <div className={'logout'}
                 onClick={()=>this.logout()}>
                logout
            </div>
            <div className={'logout'}
                 onClick={() => {
                     this.setState({
                         isModalVisible: true
                     })
                 }}>
                set password
            </div>
            <Modal title="set password"
                   visible={this.state.isModalVisible}
                   onOk={()=>{
                       this.setPassword();
                   }}
                   onCancel={()=>{
                       this.setState({
                           isModalVisible: false,
                       })
                   }}>
                <p style={{width: '100%'}}>
                    <label style={{
                        width:'25%',
                        textAlign: 'right',
                        display: 'inline-block',
                        margin: 5
                    }}>old password:</label>
                    <Input type={'password'}
                           style={{width: '50%'}}
                           onChange={(event)=>{
                               this.setState({
                                   isModalVisible: true,
                                   oldPassword: event.target.value
                               })}}/>
                </p>

                <p style={{width: '100%'}}>
                    <label style={{
                        width:'25%',
                        textAlign: 'right',
                        display: 'inline-block',
                        margin: 5
                    }}>new password:</label>
                    <Input type={'password'}
                           style={{width: '50%'}}
                           onChange={(event)=>{
                               this.setState({
                                   isModalVisible: true,
                                   newPassword: event.target.value
                               })}}/>
                </p>
            </Modal>
        </Header>)
    }
}

class HomeBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            selected: '4'
        };
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        return (
            <Layout>
                <Sider
                    className={'sider'}
                    trigger={null}
                    collapsed={this.state.collapsed}
                >
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['4']}
                        onSelect={(item)=>{
                            this.setState({
                                selected: item.key,
                            })
                        }}>
                        <Menu.Item key="4" icon={<UploadOutlined />}>
                            Dashboard
                        </Menu.Item>
                        <Menu.Item key="1" icon={<UserOutlined />}>
                            Devices
                        </Menu.Item>
                        <Menu.Item key="2" icon={<CompassOutlined />}>
                            Map
                        </Menu.Item>
                        <Menu.Item key="3" icon={<VideoCameraOutlined />}>
                            History
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Layout className="site-layout">
                    <UserBar username={"Childe"}/>
                    <Content className="site-layout-background">
                        {this.state.selected==='1' && <Devices/>}
                        {this.state.selected==='2' && <MarkMap/>}
                        {this.state.selected==='3' && <Chart/>}
                        {this.state.selected==='4' && <Dashboard/>}
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

class Home extends React.Component{
    render() {
        return(<Layout className={'home'}>
            <HomeBody />
        </Layout>)
    }
}

export default Home;