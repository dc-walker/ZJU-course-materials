import React from "react";
import {Modal, Button, Input, List} from "antd";
import '../styles/devices.css'
import 'antd/dist/antd.css';
import axios from "axios";



function getUsername(){
    let username = localStorage.getItem('username');
    if(username===null){
        window.location = '/sign';
        return ;
    }
    return username;
}

class Line extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            newName: null,
            id: props.id,
            alertInfo: props.alertInfo,
            value: props.value,
            isActive: props.isActive,
            isModalVisible: false
        }
    }

    getID() {
        return this.state.id;
    }

    getNewName(){
        return this.state.newName;
    }

    setAlias(alias){
        let username = getUsername();
        let deviceID = this.getID();
        // alert(username + deviceID);
        let url = `/setAlias?username=${username}&deviceID=${deviceID}&alias=${alias}`;
        axios.get(url)
            .then(res =>res.data.toString())
            .then(res => {
                alert(res);
            })
            .catch(err => console.log(err))
    }

    removeDevice(){
        let username = getUsername();
        let deviceID = this.getID();
        let url = `/deleteDevice?username=${username}&deviceID=${deviceID}`;
        axios.get(url)
            .then(res => res.data)
            .then(res => alert(res))
            .catch(err => console.log(err))
    }

    render() {
        return(<div className={'device-line'}>
            <div className={'device-line-description'}>
                <div className={'device-line-item'}>
                    <label>id:</label> <span>{this.state.id}</span>
                </div>
                <div className={'device-line-item'}>
                    <label>alert:</label> <span>{this.state.alertInfo}</span>
                </div>
                <div className={'device-line-item'}>
                    <label>value:</label> <span>{this.state.value}</span>
                </div>
                <div className={'device-line-item'}>
                    <label>status:</label> <span>{this.state.isActive?'active':'inactive'}</span>
                </div>
            </div>

            <Button style={{'margin-right':5}}
                 onClick={() => {
                     // this.setAlias();
                     this.setState({
                         isModalVisible: true,
                     })
                 }}>
                rename
            </Button>
            <Modal title="rename"
                   visible={this.state.isModalVisible}
                   onOk={()=>{
                       let newName = this.getNewName();
                       if(newName===null || newName===''){
                           alert("please input the new name");
                           return;
                       }
                       this.setAlias(newName);
                       this.setState({
                           isModalVisible: false,
                       })
                   }}
                   onCancel={()=>{
                       this.setState({
                           isModalVisible: false,
                       })
                   }}>
                <p>new name:</p>
                <input onChange={(event)=>{
                    this.setState({
                        isModalVisible: true,
                        newName: event.target.value
                    })
                }}/>
            </Modal>

            <Button danger onClick={()=>this.removeDevice()}>remove</Button>
        </div>)
    }
}

class Devices extends React.Component{
    constructor(props) {
        super(props);
        let username = getUsername();
        this.state = {
            ids: [],
            values:[],
            alerts: [],
            names: [],
            isActive: [],
            row_size: 3,
            username: username,
            deviceToAdd: null,
        }
        this.getDevices = this.getDevices.bind(this);
    }

    componentDidMount() {

    }

    componentWillMount() {
        this.getDevices();
        setInterval(this.getDevices,5000);
    }

    getDevices(){
        let username = getUsername();
        // console.log(username);
        let url = `/getDevices?username=${username}`;
        let ids = [];
        let values = [];
        let names = [];
        let alerts = [];
        let isActive = [];
        axios.get(url)
            .then(res => JSON.parse(JSON.stringify(res.data)))
            .then(res => {
                // console.log(res)
                for(let k in res){
                    ids.push(k);
                    let infos = res[k].split(',');
                    names.push(infos[0]);
                    values.push(parseInt(infos[2]));
                    alerts.push(parseInt(infos[3]));
                    let time = Date.parse(infos[4]);
                    let now = new Date().getTime();
                    let diff = Math.trunc((now - time)/1000/60);
                    // console.log(infos[4]);
                    // console.log(diff);
                    isActive.push(diff < 20);
                }
                this.setState({
                    ids: ids,
                    values: values,
                    names: names,
                    alerts: alerts,
                    isActive: isActive
                })
            })
            .catch(err => console.log(err));
        // return ids;
    }

    addDevice(){
        let deviceID = this.state.deviceToAdd;
        let username = getUsername();
        if(deviceID===null || deviceID===''){
            alert("please input the device ID");
            return;
        }
        let url = `/addDevice?username=${username}&deviceID=${deviceID}`;
        axios.get(url)
            .then(res => res.data)
            .then(res => alert(res))
            .catch(err => console.log(err));
    }

    render() {
        let ids = this.state.ids;
        let names = this.state.names;
        let values = this.state.values;
        let alerts = this.state.alerts;
        let isActive = this.state.isActive;

        // console.log('ids', ids);

        let data = [];
        for(let i=0; i<ids.length; i++){
            data.push({
                name: names[i],
                id: ids[i],
                value: values[i],
                alertInfo: alerts[i],
                isActive: isActive[i],
            })
        }

        let header =
            <div>
                <Input style={{width:'20%'}}
                       type="text"
                       onChange={(event) =>{
                           this.setState({
                               deviceToAdd: event.target.value
                           })
                       }}
                />
                <Button type={'primary'}
                        onClick={()=>this.addDevice()}
                        className={'add-device'}>
                    add device
                </Button>
            </div>


        let lines =
            <List itemLayout="horizontal"
                  dataSource={data}
                  header={header}
                  bordered={true}
                  split={true}
                  renderItem={item=>(
                      <List.Item>
                          <List.Item.Meta
                              title={item.name}
                              description={
                                  <div>
                                      <Line
                                          id={item.id}
                                          alertInfo={item.alertInfo}
                                          value={item.value}
                                          isActive={item.isActive}
                                      />
                                  </div>

                              }
                          />
                      </List.Item>
                  )}
            />

        return(<div className={'dev-cards'}>
            {lines}
        </div>)
    }
}

export default Devices;