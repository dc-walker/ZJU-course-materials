package mqtt.manager.controllers;

import mqtt.manager.Database;
import mqtt.manager.Server;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class MqttController {
    @RequestMapping(value = "/getDeviceStates", method = RequestMethod.GET)
    @ResponseBody
    public String getAllDeviceStates() throws SQLException{
        Map<String, String> devs = Server.getDevices();
        StringBuilder res = new StringBuilder();
        for(String id: devs.keySet()){
            res.append(id).append(":").append(devs.get(id)).append(",");
        }
        return res.toString();
    }


    @RequestMapping(value = "addDevice", method = RequestMethod.GET)
    @ResponseBody
    public String addDevice(@RequestParam("username")String username,
                            @RequestParam("deviceID")String deviceID) throws SQLException {
        return Database.TUserDevices.addDevice(username, deviceID);
    }


    @RequestMapping(value = "getDevices", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, String> getDevices(@RequestParam("username")String username) throws SQLException {
        List<String> ids = Database.TUserDevices.getDevices(username);
        Map<String, String> devs = Server.getDevices();
        Map<String, String> res = new HashMap<>();
        for(String id: ids){
            String alias = Database.TAlias.getAlias(username, id);
            if(alias==null) alias = id;
            res.put(id, alias + "," + devs.get(id));
        }
        return res;
    }


    @RequestMapping(value = "deleteDevice", method = RequestMethod.GET)
    @ResponseBody
    public String deleteDevice(@RequestParam("username")String username,
                               @RequestParam("deviceID")String deviceID) throws SQLException {
        if(!Database.TUserDevices.exist(username, deviceID)){
            return "not existed";
        }
        return Database.TUserDevices.deleteDevice(username, deviceID);
    }


    @RequestMapping(value = "/getHistory", method = RequestMethod.GET)
    @ResponseBody
    public List<String> getHistory(@RequestParam("deviceID")String deviceID) throws SQLException {
        List<String> res = new ArrayList<>();
        if(!Server.existDevice(deviceID)){
            return res;
        }
        res = Database.TMessages.getHistory(deviceID);
        return res;
    }


    @RequestMapping(value = "/getLocations", method = RequestMethod.GET)
    @ResponseBody
    public List<String> getLocations(@RequestParam("deviceID")String deviceID) throws SQLException {
        List<String> res = new ArrayList<>();
        if(!Server.existDevice(deviceID)){
            return res;
        }
        res = Database.TMessages.getLocations(deviceID);
        return res;
    }


    @RequestMapping(value = "/setAlias", method = RequestMethod.GET)
    @ResponseBody
    public String setAlias(@RequestParam("username")String username,
                           @RequestParam("deviceID")String deviceID,
                           @RequestParam("alias")String alias) throws SQLException {
        if(!Database.TAlias.exist(username, deviceID)){
            return Database.TAlias.addAlias(username, deviceID, alias);
        }
        return Database.TAlias.updateAlias(username, deviceID, alias);
    }


    @RequestMapping(value = "getMessagesCount", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Integer> getMessagesCount(@RequestParam("username")String username)throws SQLException{
        List<String> ids = Database.TUserDevices.getDevices(username);
        return Database.TMessages.getMessagesCount(ids);
    }
}
