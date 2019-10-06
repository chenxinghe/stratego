package org.gold.stratego.controller;

import org.gold.stratego.database.UserDB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping(path="/infoPage")
public class InfoController {

    @Autowired
    SessionController sc;

    @GetMapping("")
    public String infoPage(){
        return "info";
    }

    @ResponseBody
    @PostMapping("/set_continue_game")
    public Map<String, String> isContinuesGame (@RequestParam("isContinue") String isContinue,
                                     HttpSession session) throws Exception {

        Map<String, String> result = new HashMap<>();
        if (sc.userIsAnonymous(session)){
            result.put("success", "false");
            return result;
        }
        session.setAttribute("isContinue", isContinue);
        result.put("success", "true");
        return result;
    }
}
