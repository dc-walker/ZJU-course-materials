package mqtt.manager;

import java.sql.Timestamp;

public class IotMessage {
    private String clientID;
    //上报信息
    private String info;
    //设备数据
    private int value;
    //是否告警，0-正常，1-告警
    private int alert;
    //设备位置，经度
    private double lng;
    //设备位置，纬度
    private double lat;
    //上报时间，ms
    private long timestamp;

    public IotMessage(String clientID, String info,
                      int value, int alert,
                      double lng, double lat, long timestamp){
        this.clientID = clientID;
        this.info = info;
        this.value = value;
        this.alert = alert;
        this.lng = lng;
        this.lat = lat;
        this.timestamp = timestamp;
    }

    public IotMessage(){

    }

    public String getClientID(){
        return clientID;
    }

    public String getInfo(){
        return info;
    }

    public int getValue(){
        return value;
    }

    public int getAlert(){
        return alert;
    }

    public float getLongitude(){
        return (float)lng;
    }

    public float getLatitude(){
        return (float)lat;
    }

    public Timestamp getTime(){
        return new Timestamp(timestamp);
    }

    public void setClientID(String newClientId){
        clientID = newClientId;
    }

    public void setInfo(String newInfo){
        info = newInfo;
    }

    public void setValue(int newValue){
        value = newValue;
    }

    public void setAlert(int newAlert){
        alert = newAlert;
    }

    public void setLng(double newLng){
        lng = newLng;
    }

    public void setLat(double newLat){
        lat = newLat;
    }

    public void setTimestamp(long newTime){
        timestamp = newTime;
    }
}
