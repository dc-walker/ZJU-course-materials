package mqtt.manager;

import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ManagerApplication {

    public static void main(String[] args) throws MqttException {
        new Thread(new Subscriber()).start();
        SpringApplication.run(ManagerApplication.class, args);
    }

}
