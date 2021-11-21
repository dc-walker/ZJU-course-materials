package mqtt.manager;

import java.sql.Timestamp;

public class Device{
    String id;
    int value;
    int alert;
    Timestamp time;
    float longitude;
    float latitude;

    public Device(String id, int value, int alert, Timestamp time){
        this.id = id;
        this.value = value;
        this.alert = alert;
        this.time = time;
    }

    public Device(String id,  int value, int alert, Timestamp time, float lng, float lat){
        this.id = id;
        this.value = value;
        this.alert = alert;
        this.time = time;
        this.longitude = lng;
        this.latitude = lat;
    }

    public void setValue(int newValue){
        this.value = newValue;
    }

    @Override
    public String toString(){
        //todo: update delimiter
        //return id + "," + value + "," + alert + "," + time;
        return String.join(
                ",", id, String.valueOf(value), String.valueOf(alert), String.valueOf(time)
        );
    }
}