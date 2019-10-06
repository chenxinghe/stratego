package org.gold.stratego.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;


@Controller
@RequestMapping(path="/game")
public class GameController {

    @Autowired
    SessionController sc;

    @GetMapping("")
    public String game(){
        return "game";
    }

    /*
    *
    *
    *
    */

    @ResponseBody
    @GetMapping("/is_continue")
    public  Map<String, String>  is_continue_game(HttpSession session) throws Exception {
        Map<String, String> result = new HashMap<>();
        if (sc.userIsAnonymous(session)){
            result.put("success", "false");
            return result;
        }
        String isContinue = (String)session.getAttribute("isContinue");
        if (isContinue.equals("true")){
            result.put("isContinue", (String)session.getAttribute("isContinue"));
            result.put("success", "true");
            return result;
        }
        result.put("success", "false");
        return result;
    }

}

