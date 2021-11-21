package mqtt.manager;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Server{

    static Map<String, Device> devices = new HashMap<>();

    public static boolean existDevice(String id)throws SQLException{
        if(devices.isEmpty()){
            update();
        }
        return devices.containsKey(id);
    }

    public static void updateDevice(String id, int value, int alert, Timestamp time){
        if(!devices.containsKey(id)){
            devices.put(id, new Device(id, value, alert, time));
            return;
        }
        devices.get(id).setValue(value);
    }

    public static void update()throws SQLException {
        List<String> deviceIDs = Database.TMessages.getAllDevices();
        for(String id: deviceIDs){
            IotMessage msg = Database.TMessages.getLatest(id);
            if(!msg.getClientID().isEmpty()){
                devices.put(id, new Device(id, msg.getValue(), msg.getAlert(), msg.getTime()));
            }
        }
    }

    public static Map<String, String> getDevices() throws SQLException{
        update();

        Map<String, String> res = new HashMap<>();
        for(String k: devices.keySet()){
            // devs.append(devices.get(k).toString()).append(";");
            res.put(k, devices.get(k).toString());
        }
        return res;
    }
}