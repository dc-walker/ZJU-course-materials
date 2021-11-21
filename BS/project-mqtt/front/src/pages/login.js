import React, {useState} from "react";
import {Button, Layout, Form, Input} from 'antd';
import axios from 'axios';
import 'antd/dist/antd.css';
import '../styles/login.css'

const {Header, Footer, Content} = Layout

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            mode: 1
        }
    }

    setMode(){
        let newMode = this.state.mode===1 ? 2 :1;
        this.setState({
            mode: newMode,
        })
    }

    render() {
        const LoginForm = () => {
            const layout = {
                labelCol: {
                    span: 8,
                },
                wrapperCol: {
                    span: 8,
                },
            };
            const tailLayout = {
                wrapperCol: {
                    offset: 8,
                    span: 8,
                },
            };

            const [username, setUsername] = useState("");
            const [password, setPassword] = useState("");

            const onFinish = (values) => {
                console.log('Success:', values);
            };

            const onFinishFailed = (errorInfo) => {
                console.log('Failed:', errorInfo);
            };

            const handleSubmit = () => {
                // alert(username + ", " + password);
                let data = `username=${username}&password=${password}`;
                axios.post('/login', data)
                    .then(res => res.data)
                    .then(res => {
                        alert(res);
                        if(res.toString() === 'success'){
                            localStorage.setItem('username', username);
                            window.location = '/home';
                        }
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            };

            return (<div className={"content"}>
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: false,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    style={{
                        margin:10,
                        background: ''
                    }}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{
                            required: true,
                            message: 'Please input your username!',
                        },]}
                        style={{

                        }}
                    >
                        <Input onChange={(e)=>{
                            setUsername(e.target.value);
                        }}/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{
                            required: true,
                            message: 'Please input your password!',
                        },]}
                    >
                        <Input.Password onChange={(e)=>{
                            setPassword(e.target.value);
                        }}/>
                    </Form.Item>

                    <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                        has no account? <span style={{color:'blue'}}
                                              onClick={()=>this.setMode()}>sign up here</span>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button className="button" type="primary"
                                onClick={handleSubmit}>
                            sign in
                        </Button>
                    </Form.Item>
                </Form>
            </div>);
        };

        const SignupForm = () => {
            const layout = {
                labelCol: {span: 8},
                wrapperCol: {span: 8},
            };
            const tailLayout = {
                wrapperCol: {offset: 8, span: 8},
            };

            const onFinish = (values) => {
                console.log('Success:', values);
            };

            const onFinishFailed = (errorInfo) => {
                console.log('Failed:', errorInfo);
            };

            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');
            const [mail, setMail] = useState('');

            const mailFormatCheck = (s) => {
                let pattern =  /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                return pattern.test(s);
            }

            const signUp = () => {
                // alert(username + ' ' + password + ' ' + mail);
                if(username.length < 6){
                    alert('the length of username should be at least 6');
                    return;
                }
                if(password.length < 6){
                    alert('the length of password should be at least 6');
                    return;
                }
                if(!mailFormatCheck(mail)){
                    alert('illegal mail format');
                    return;
                }
                let url = '/signup';
                let data = `username=${username}&password=${password}&mail=${mail}`;
                axios.post(url, data)
                    .then(res => res.data.toString())
                    .then(res => {
                        alert(res);
                        if(res==='success'){
                            this.setMode();
                        }
                    })
                    .catch(err => console.log(err));
            }

            return (<div className={"content"}>
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: false,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    style={{
                        margin:10,
                        background: ''
                    }}
                >
                    <Form.Item
                        label="username"
                        name="username"
                        rules={[{
                            required: true,
                        },]}
                        style={{

                        }}
                    >
                        <Input onChange={(e)=>setUsername(e.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        label="password"
                        name="password"
                        rules={[{
                            required: true,
                        },]}
                    >
                        <Input.Password onChange={(e)=>setPassword(e.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        label="email"
                        name="email"
                        rules={[{
                            required: true,
                        },]}
                    >
                        <Input onChange={(e)=>setMail(e.target.value)}/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button className="button" type="primary"
                                onClick={()=>signUp()}>
                            sign up
                        </Button>
                    </Form.Item>
                </Form>
            </div>);
        };

        return(<>
            <Layout className="login-layout">
                <Header>Selamat pagi</Header>
                <Content>
                    {this.state.mode===1 && <LoginForm />}
                    {this.state.mode===2 && <SignupForm />}
                </Content>
                <Footer>B/S</Footer>
            </Layout>
        </>)
    }
}

export default Login;