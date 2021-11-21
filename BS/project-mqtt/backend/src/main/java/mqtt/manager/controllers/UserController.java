package mqtt.manager.controllers;

import mqtt.manager.Database;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;

@Controller
public class UserController {

    @RequestMapping (value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public String login(@RequestParam("username") String username,
                        @RequestParam("password") String password,
                        HttpServletResponse response)throws SQLException{
        System.out.println(username + "/" + password + " login");
        if(Database.TUsers.exist(username, password)){
            // todo: set cookie
            Cookie cookie = new Cookie("token", username);
            response.addCookie(cookie);
            return "success";
        }
        return "failed";
    }


    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    @ResponseBody
    public String signup(@RequestParam("username") String username,
                         @RequestParam("password") String password,
                         @RequestParam("mail") String mail) throws SQLException {

        if(Database.TUsers.existUser(username)){
            return "username used";
        }
        if(Database.TMails.existMail(mail)){
            return "mail used";
        }
        if(Database.TMails.existUser(username)
                && !Database.TMails.setMail(username, mail).equals("success")){
            return "error happens";
        }
        if(!Database.TMails.addMail(username, mail).equals("success")){
            return "error happens";
        }
        if(!Database.TUsers.addUser(username, password).equals("success")){
            Database.TMails.clearMail(username);
            return "error happens";
        }

        return "success";
    }


    @RequestMapping(value = "/setPassword", method = RequestMethod.POST)
    @ResponseBody
    public String setPassword(@RequestParam("username")String username,
                              @RequestParam("oldPassword")String oldPassword,
                              @RequestParam("newPassword")String newPassword)throws SQLException{

        System.out.println(username + "/" + oldPassword + "/" + newPassword);
        if(!Database.TUsers.exist(username, oldPassword)){
            return "incorrect old password";
        }
        return Database.TUsers.updatePassword(username, newPassword);
    }
}
