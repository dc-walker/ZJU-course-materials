import {Map, Markers, Polyline} from 'react-amap';
import React from "react";


import 'antd/dist/antd.css';
import { Select } from 'antd';
import axios from "axios";

const { Option } = Select;

const range = (n) => {
    let res = [];
    for(let i=0; i<n; i++){
        res.push(i);
    }
    return res;
}

function getUsername(){
    return localStorage.getItem('username');
}

class MarkMap extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            markers: [],
            path: [],
            ids: [],
            markerNumber: 10,
        }
        this.selectDevice = this.selectDevice.bind(this);
        this.selectNumber = this.selectNumber.bind(this);
    }

    componentWillMount(){
        this.getDevices();
    }

    getDevices(){
        let username = getUsername();
        let url = `/getDevices?username=${username}`;
        axios.get(url)
            .then(res => JSON.parse(JSON.stringify(res.data)))
            .then(res => {
                let ids = [];
                for(let k in res){
                    ids.push(k);
                }
                this.setState({
                    ids: ids,
                })
            })
            .catch(err => console.log(err));
    }

    getLocations(id){
        if(id === ''){
            return;
        }
        let url = `/getLocations?deviceID=${id}`
        axios.get(url)
            .then(res => JSON.parse(JSON.stringify(res.data)))
            .then(res => {
                let locations = Array(res)[0];
                let markers = [];
                let path = [];
                for(let i in locations){
                    if(i >= this.state.markerNumber){
                        break;
                    }
                    let location = locations[i];
                    // console.log(location);
                    let lng = location.split(',')[0];
                    let lat = location.split(',')[1];
                    markers.push({
                        position:{
                            longitude: parseFloat(lng),
                            latitude: parseFloat(lat),
                        }
                    })
                    path.push({
                        longitude: parseFloat(lng),
                        latitude: parseFloat(lat),
                    })
                }
                console.log(markers);
                this.setState({
                    markers: markers,
                    path: path,
                })
            })
            .catch(err => console.log(err))
    }

    selectDevice(value){
        // console.log(value);
        this.setState({
            id: value
        });
        this.getLocations(value);
    }

    selectNumber(value){
        this.setState({
            markerNumber: value
        })
        this.getLocations(this.state.id)
    }

    render(){
        let ids = this.state.ids;
        let deviceSelector =
            <Select showSearch style={{ width: 200 }}
                    placeholder="Select a device"
                    optionFilterProp="children"
                    onChange={this.selectDevice}
                    filterOption={(input, option) => {
                        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }}>
                {ids.map(id => <Option value={id}>{id}</Option> )}
            </Select>;

        let numberSelector =
            <Select showSearch style={{ width: 200 }}
                    placeholder="Select a number"
                    optionFilterProp="children"
                    onChange={this.selectNumber}
                    filterOption={(input, option) => {
                        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }}>
                {range(10).map(i => <Option value={(i+1)*5}>{(i+1)*5}</Option> )}
            </Select>;

        return <div style={{width: '100%', height: '100%'}}>
            <p>{deviceSelector}{numberSelector}</p>
            <div style={{width: '100%', height: '90%'}}>
                <Map amapkey={'788e08def03f95c670944fe2c78fa76f'}>
                    <Markers markers={this.state.markers}/>
                    <Polyline path={this.state.path}
                              showDir={true}
                              style={{
                                  linejoin: 'miter',
                                  strokeWeight: 5,
                                  strokeColor: '#db0808'
                              }}/>
                </Map>
            </div>
        </div>
    }
}

export default MarkMap;