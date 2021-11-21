import { TimelineChart } from 'ant-design-pro/lib/Charts';
import React from "react";
import axios from "axios";
import 'antd/dist/antd.css';
import { Select } from 'antd';

const { Option } = Select;

function getUsername(){
    return localStorage.getItem('username');
}

class Chart extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            ids: [],
            id: '',
            times: [],
            values: [],
        };
        this.selectDevice = this.selectDevice.bind(this);
    }

    componentWillMount() {
        this.getDevices();
        // this.getHistory();
    }

    getDevices(){
        let username = getUsername();
        let url = `/getDevices?username=${username}`;
        let ids = [];
        axios.get(url)
            .then(res => JSON.parse(JSON.stringify(res.data)))
            .then(res => {
                for(let k in res){
                    ids.push(k);
                }
                this.setState({
                    ids: ids,
                })
            })
            .catch(err => console.log(err));
        // return ids;
    }

    getHistory(id){
        // let id = this.state.id;
        console.log(id);
        let url = `/getHistory?deviceID=${id}`;
        axios.get(url)
            .then(res => res.data)
            .then(res => {
                // console.log(res);
                let values = [];
                let times = [];
                for(let i in res){
                    values.push(parseInt(res[i].split(',')[0]));
                    times.push(Date.parse(res[i].split(',')[1]));
                }
                // console.log(values, times)
                this.setState({
                    times: times,
                    values: values,
                });
            })
            .catch(err => console.log(err))
    }

    selectDevice(value){
        // console.log(value);
        this.setState({
            id: value
        });
        this.getHistory(value);
    }

    render() {
        let ids = this.state.ids;
        let selector =
            <Select showSearch style={{ width: 200 }}
                    placeholder="Select a device"
                    optionFilterProp="children"
                    onChange={this.selectDevice}
                    filterOption={(input, option) => {
                        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }}>
                {ids.map(id => <Option value={id}>{id}</Option> )}
            </Select>;

        let chartData = [];
        let values = this.state.values;
        let times = this.state.times;
        let n = values.length;
        if ( n===0 ){
            chartData.push({
                x: 0,
                y1: 0,
            })
        }
        for(let i=0; i<n; i++){
            chartData.push({
                x: times[i],
                y1: values[i],
            })
        }
        console.log(chartData);

        return(<div style={{width: '100%', height: '80%'}}>
            {selector}
            <TimelineChart
                data={chartData}
                titleMap={{ y1: this.state.id}}
            />
        </div>);
    }
}

export default Chart;