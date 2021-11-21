package mqtt.manager;

import lombok.SneakyThrows;
import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;


public class Subscriber implements Runnable{
    private static final int qos = 2;
    private static final String broker = "tcp://39.103.229.106:1883";

    private static MqttClient connect(String clientID) throws MqttException{
        MemoryPersistence persistence = new MemoryPersistence();
        MqttConnectOptions connOpts = new MqttConnectOptions();
        connOpts.setCleanSession(false);
        connOpts.setConnectionTimeout(10);
        connOpts.setKeepAliveInterval(20);
        MqttClient mqttClient = new MqttClient(broker, clientID, persistence);
        mqttClient.connect(connOpts);
        return mqttClient;
    }

    public static void sub(MqttClient mqttClient, String topic) throws MqttException{
        int[] Qos = {qos};
        String[] topics = {topic};
        mqttClient.subscribe(topics, Qos);
    }

    private static void runSub(String clientID, String topic) throws MqttException{
        MqttClient mqttClient = connect(clientID);
        sub(mqttClient, topic);
        mqttClient.subscribe(topic, 2, new MessageListener());
    }

    private static class MessageListener implements IMqttMessageListener{
        @Override
        public void messageArrived(String s, MqttMessage message) throws SQLException{
            String payload = new String(message.getPayload());
            System.out.println("msg: " + payload);
            IotMessage msg = str2msg(payload);
            Server.updateDevice(
                    msg.getClientID(),
                    msg.getValue(),
                    msg.getAlert(),
                    msg.getTime()
            );
            writeDatabase(str2msg(payload));
        }

        public IotMessage str2msg(String payload){
            String[] attrs = payload.substring(1, payload.length()-1).split(",");
            Map<String, String> attrMap = new HashMap<>();
            for(String a: attrs){
                // System.out.println(a);
                String[] kv = a.split(":");
                String key = kv[0];
                StringBuilder value = new StringBuilder(kv[1]);
                if(kv.length > 2){
                    for(int i=2; i<kv.length; i++){
                        value.append(":").append(kv[i]);
                    }
                }
                key = key.substring(1, key.length()-1);
                attrMap.put(key, value.toString());
            }
            IotMessage msg = new IotMessage();
            msg.setClientID(attrMap.get("clientId").replaceAll("\"", ""));
            msg.setInfo(attrMap.get("info").replaceAll("\"", ""));
            msg.setAlert(Integer.parseInt(attrMap.get("alert")));
            msg.setLng(Double.parseDouble(attrMap.get("lng")));
            msg.setLat(Double.parseDouble(attrMap.get("lat")));
            msg.setTimestamp(Long.parseLong(attrMap.get("timestamp")));
            msg.setValue(Integer.parseInt(attrMap.get("value")));
            return msg;
        }
    }

    private static void writeDatabase(IotMessage msg) throws SQLException {
        Database.TMessages.addMessage(msg);
    }

    @SneakyThrows
    @Override
    public void run(){
        runSub("test", "test");
    }

    public static void main(String[] args) throws MqttException {
        runSub("test", "test");
        // test();
    }
}
