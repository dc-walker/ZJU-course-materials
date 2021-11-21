package mqtt.manager;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Database {
    static final String JDBC_URL = "jdbc:mysql://39.103.229.106/mqtt";
    static final String JDBC_USER = "test";
    static final String JDBC_PASSWORD = "test123456";
    static Connection conn = null;

    static{
        try {
            init();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void init() throws SQLException {
        conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
    }

    public static boolean isConnected(){
        return conn == null;
    }

    public static class TUsers {
        public static boolean exist(String username, String password) throws SQLException {
            String sql = "select * from users where username=? and password=?;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            stmt.setString(2, password);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        }

        public static boolean existUser(String username) throws SQLException{
            String sql = "select * from users where username=?;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        }

        public static String addUser(String username, String password) throws SQLException{
            if(existUser(username)){
                return "user already existed";
            }
            String sql = "insert into users values(?, ?);";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            stmt.setString(2, password);
            int res = stmt.executeUpdate();
            if(res == 1){
                return "success";
            }
            return "error happens";
        }

        public static String deleteUser(String username) throws SQLException{
            String sql = "delete from users where username=?;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            int res = stmt.executeUpdate();
            if(res == 1){
                return "success";
            }
            return "error happens";
        }

        public static String updatePassword(String username, String newPasswd) throws SQLException{
            String sql = "update users set password=? where username=? ;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, newPasswd);
            stmt.setString(2, username);
            int res = stmt.executeUpdate();
            if(res == 1){
                return "success";
            }
            return "error happens";
        }
    }

    public static class TMails{
        public static boolean existMail(String mail)throws SQLException{
            String sql = "select * from mails where mail=? ;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, mail);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        }

        public static boolean existUser(String uname)throws SQLException{
            String sql = "select * from mails where username=? ;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, uname);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        }

        public static boolean clearMail(String uname) throws SQLException{
            String sql = "delete from mails where username=? ;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, uname);
            return stmt.executeUpdate()==1;
        }

        public static String addMail(String uname, String mail)throws SQLException{
            String sql = "insert into mails values(?, ?);";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, uname);
            stmt.setString(2, mail);
            int res = stmt.executeUpdate();
            if(res == 1){
                return "success";
            }
            return "error happens";
        }

        public static String setMail(String uname, String mail)throws SQLException{
            String sql = "update mails set mail=? where username=? ;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, mail);
            stmt.setString(2, uname);
            int res = stmt.executeUpdate();
            if(res == 1){
                return "success";
            }
            return "error happens";
        }
    }

    public static class TMessages{
        public static String addMessage(IotMessage msg) throws SQLException {
            String sql = "insert into messages values(?, ?, ?, ?, ?, ?, ?);";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, msg.getClientID());
            stmt.setString(2, msg.getInfo());
            stmt.setInt(3, msg.getValue());
            stmt.setInt(4, msg.getAlert());
            stmt.setTimestamp(5, msg.getTime());
            stmt.setFloat(6, msg.getLongitude());
            stmt.setFloat(7, msg.getLatitude());
            int res = stmt.executeUpdate();
            if(res == 1){
                return "success";
            }
            return "error happens";
        }

        public static List<String> getAllDevices() throws SQLException{
            String sql = "select distinct client_id from messages";
            PreparedStatement stmt = conn.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            List<String> res = new ArrayList<>();
            while(rs.next()){
                res.add(rs.getString("client_id"));
            }
            return res;
        }

        public static boolean existDevice(String deviceID)throws SQLException{
            List<String> ids = getAllDevices();
            return ids.contains(deviceID);
        }

        public static IotMessage getLatest(String deviceID)throws SQLException{
            String sql = "select * from messages where client_id=? order by ttime desc;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, deviceID);
            ResultSet rs = stmt.executeQuery();
            if(rs.next()){
                String id = rs.getString("client_id");
                String info = rs.getString("info");
                int value = rs.getInt("value");
                int alert = rs.getInt("alert");
                double lng = rs.getFloat("longitude");
                double lat = rs.getFloat("latitude");
                Timestamp time = rs.getTimestamp("ttime");
                return new IotMessage(id, info, value, alert, lng, lat, time.getTime());
            }
            return new IotMessage();
        }

        public static List<String> getHistory(String deviceID) throws SQLException{
            String sql = "select * from messages where client_id=? order by ttime desc ;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, deviceID);
            ResultSet rs = stmt.executeQuery();
            List<String> res = new ArrayList<>();
            int count = 0;
            while(rs.next()){
                if(++count > 50){
                    break;
                }
                res.add(rs.getString("value") + "," + rs.getString("ttime"));
            }
            return res;
        }

        public static List<String> getLocations(String deviceID) throws SQLException{
            String sql = "select longitude, latitude from messages where client_id=? order by ttime desc ;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, deviceID);
            ResultSet rs = stmt.executeQuery();
            List<String> res = new ArrayList<>();
            int count = 0;
            while(rs.next()){
                if(++count > 50){
                    break;
                }
                res.add(rs.getFloat("longitude") + "," + rs.getFloat("latitude"));
            }
            return res;
        }

        public static Map<String, Integer> getMessagesCount(List<String> devices)throws SQLException{
            Map<String, Integer> res = new HashMap<>();
            for(String id: devices){
                String sql = "select count(*) as count from messages where client_id=? ;";
                PreparedStatement stmt = conn.prepareStatement(sql);
                stmt.setString(1, id);
                ResultSet rs = stmt.executeQuery();
                if(rs.next()){
                    res.put(id, rs.getInt("count"));
                }else{
                    res.put(id, 0);
                }
            }
            return res;
        }
    }

    public static class TUserDevices{

        public static String addDevice(String uname, String devID)throws SQLException{
            if(!TMessages.existDevice(devID)){
                return "no such device";
            }
            if(exist(uname, devID)){
                return "device already added";
            }
            String sql = "insert into user_devices values(?, ?);";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, uname);
            stmt.setString(2, devID);
            int res = stmt.executeUpdate();
            if(res == 1){
                return "success";
            }
            return "error happens";
        }

        public static List<String> getDevices(String uname)throws SQLException{
            String sql = "select device_id from user_devices where username=?;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, uname);
            ResultSet rs = stmt.executeQuery();
            List<String> res = new ArrayList<>();
            while(rs.next()){
                res.add(rs.getString("device_id"));
            }
            return res;
        }

        public static boolean exist(String uname, String devID)throws SQLException{
            String sql = "select * from user_devices where username=? and device_id=?;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, uname);
            stmt.setString(2, devID);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        }

        public static String deleteDevice(String uname, String devID)throws SQLException{
            String sql = "delete from user_devices where username=? and device_id=?;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, uname);
            stmt.setString(2, devID);
            int res = stmt.executeUpdate();
            if(res == 1){
                return "success";
            }
            return "error happens";
        }
    }

    public static class TAlias{
        public static boolean exist(String uname, String devID)throws SQLException{
            String sql = "select * from alias where username=? and device_id=? ;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, uname);
            stmt.setString(2, devID);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        }

        public static String updateAlias(String uname, String devID, String newAlias) throws SQLException{
            String sql = "update alias set alias=? where username=? and device_id=? ;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, newAlias);
            stmt.setString(2, uname);
            stmt.setString(3, devID);
            int res = stmt.executeUpdate();
            if(res == 1){
                return "success";
            }
            return "error happens";
        }

        public static String addAlias(String uname, String devID, String alias)throws SQLException{
            String sql = "insert into alias values(?, ?, ?);";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, uname);
            stmt.setString(2, devID);
            stmt.setString(3, alias);
            int res = stmt.executeUpdate();
            if(res == 1){
                return "success";
            }
            return "error happens";
        }

        public static String getAlias(String uname, String devID)throws SQLException{
            String sql = "select * from alias where username=? and device_id=? ;";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, uname);
            stmt.setString(2, devID);
            ResultSet rs = stmt.executeQuery();
            if(rs.next()){
                return rs.getString("alias");
            }
            return null;
        }
    }
}
