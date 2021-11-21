import React from "react";
import { Statistic, Row, Col, Button } from 'antd';
import { Pie } from 'ant-design-pro/lib/Charts';
import { Bar } from '@ant-design/charts';
import 'antd/dist/antd.css';
import 'ant-design-pro/dist/ant-design-pro.css';
import '../styles/dashboard.css';
import axios from "axios";

function getUsername(){
    let username = localStorage.getItem('username');
    if(username === null){
        window.location = '/sign';
        return ;
    }
    return username;
}

class Dashboard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            alertCount: 0,
            activeCount: 0,
            deviceCount: 0,
            msgCount: [],
        };
    }

    componentWillMount(){
        this.getDevices();
        this.getMessagesCount();
    }

    getDevices(){
        let username = getUsername();
        let url = `/getDevices?username=${username}`;

        let alertCount = 0;
        let activeCount = 0;
        let deviceCount = 0;
        axios.get(url)
            .then(res => JSON.parse(JSON.stringify(res.data)))
            .then(res => {
                // console.log(res)
                for(let k in res){
                    deviceCount++;
                    let infos = res[k].split(',');
                    if(parseInt(infos[3]) > 0){
                        alertCount++;
                    }
                    let time = Date.parse(infos[4]);
                    let now = new Date().getTime();
                    let diff = Math.trunc((now - time)/1000/60);
                    if(diff < 20){
                        activeCount++;
                    }
                }
                this.setState({
                    alertCount: alertCount,
                    activeCount: activeCount,
                    deviceCount: deviceCount,
                })
            })
            .catch(err => console.log(err));
        // return ids;
    }

    getMessagesCount(){
        let username = getUsername();
        let url = `/getMessagesCount?username=${username}`;
        let msgCount = [];
        axios.get(url)
            .then(res => JSON.parse(JSON.stringify(res.data)))
            .then(res => {
                for(let k in res){
                    msgCount.push({
                        device: k,
                        count: res[k],
                    })
                }
                // console.log(msgCount);
                this.setState({
                    msgCount: msgCount
                })
            })
            .catch(err => console.log(err))
    }

    render() {
        let active = this.state.activeCount;
        let device = this.state.deviceCount;
        let alert = this.state.alertCount;
        let msgCount = this.state.msgCount;

        let totalCount = 0;
        for(let i in msgCount){
            totalCount += msgCount[i]['count'];
        }

        let config = {
            data: msgCount,
            height: 150,
            xField: 'count',
            yField: 'device',
            legend: { position: 'top-left' },
            barBackground: { style: { fill: 'rgba(0,0,0,0.1)' } },
            interactions: [
                {
                    type: 'active-region',
                    enable: false,
                },
            ],
        };

        return(<div className={'dashboard'}>
            <Row gutter={16} className={'row'}>
                <Col span={8} className={'col'}>
                    <Statistic title="Active devices" value={active+'/'+device} />
                    <Pie percent={100*active/device}
                         total={100*active/device+"%"}
                         height={200}
                    />
                </Col>
                <Col span={8} className={'col'}>
                    <Statistic title="Alert devices" value={alert+'/'+device}/>
                    <Pie percent={100*alert/device}
                         total={Math.trunc(100*alert/device)+"%"}
                         height={200}
                    />
                </Col>
                <Col span={8} className={'col'}>
                    <Statistic title="Received" value={totalCount} />
                    <Bar {...config} />
                    <Button style={{ marginTop: 16 }} type="primary">
                        see history
                    </Button>
                </Col>
            </Row>
        </div>)
    }
}

export default Dashboard;