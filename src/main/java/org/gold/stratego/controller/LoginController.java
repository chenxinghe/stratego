package org.gold.stratego.controller;


import org.gold.stratego.database.UserDB;
import org.gold.stratego.database.entities.User;
import org.gold.stratego.model.LoginInfo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

/**
 * Controllers for login and signup pages
 */

@Controller
public class LoginController{

    @Autowired
    UserDB userDB;

    @GetMapping("/loginPage")
        public String loginGet(){
            return "login";
    }

    /**
     * Processes user data submission in /login and adds
     * user data to current session.
     *
     * @param userName -username from form submission in login.html
     * @param password -password from form submission in login.html
     * @param session -current user session
     * @return JSON hashmap for success/failure verification in login.html javascript
     */
    @ResponseBody
    @PostMapping("/login")
    public Map<String, String> login(@RequestParam("userName") String userName,
                                     @RequestParam("password") String password,
                                     HttpSession session) {
        Map<String, String> hashMap = new HashMap<>();
        UserDB.UserAuthenticationStatus status = userDB.authenticateUser(userName, password);
        if (status == UserDB.UserAuthenticationStatus.SUCCESSFUL) {
            hashMap.put("success", "true");
            session.setAttribute("auth", "true");
            session.setAttribute("name", userName);
        }
        else {
            hashMap.put("success", "false");
            session.setAttribute("auth", "false");
        }
        return hashMap;
    }



}
