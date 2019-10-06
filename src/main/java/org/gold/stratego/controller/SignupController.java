package org.gold.stratego.controller;

import org.gold.stratego.database.UserDB;
import org.gold.stratego.model.LoginInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping(path="/signupPage")
public class SignupController {

    @Autowired
    UserDB userDB;
    @Autowired
    SessionController sc;

    @GetMapping("")
    public String infoPage(){
        return "signup";
    }


    @ResponseBody
    @PostMapping("/signup")
    public Map<String, String> signup(@RequestParam("userName") String userName, @RequestParam("password") String password){
        Map<String, String> hashMap = new HashMap<>();
        if( userDB.insertUser(userName, password)){
            hashMap.put("success", "true");
        }else{
            hashMap.put("success", "false");
        }
        return hashMap;
    }
}
